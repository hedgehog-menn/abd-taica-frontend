<template>
  <main class="container">
    <h1>Student's Average GPA Map</h1>
    <form @submit.prevent="searchData">
      <fieldset class="grid">
        <input
          type="text"
          v-model="filters.course_id"
          placeholder="Course ID"
        />
        <select v-model="filters.semester_id">
          <option value="">Select Semester</option>
          <option value="S2024S">2024 Spring</option>
          <option value="S2024F">2024 Fall</option>
        </select>
        <button type="submit">
          <i class="fa-solid fa-magnifying-glass" />&nbsp;Search
        </button>
        <button type="button" @click="resetFilters" class="secondary">
          Reset
        </button>
      </fieldset>
    </form>

    <div v-if="filters.semester_id" class="info-label">
      Semester: {{ filters.semester_id.slice(1, 5) }}
      {{ filters.semester_id.endsWith('F') ? 'Fall' : 'Spring' }}
    </div>

    <div v-if="courseInfo" class="info-label">
      {{ courseInfo.courseId }} {{ courseInfo.courseName }}
    </div>

    <div class="map-wrapper">
      <div class="map-container" ref="mapContainer">
        <div class="legend">
          <h3>Average GPA</h3>
          <div v-for="(item, i) in legend" :key="i" class="legend-item">
            <span
              class="color-box"
              :style="{ backgroundColor: item.color }"
            ></span>
            {{ item.range }}: {{ item.count }} regions
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import { onMounted, ref, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { initMap } from '../utils/mapConfig';
import L from 'leaflet';
import axios from 'axios';

export default {
  name: 'AverageGPAMapView',
  setup() {
    const mapContainer = ref(null);
    const legend = ref([]);
    const route = useRoute();
    const router = useRouter();
    const courseInfo = ref(null);
    const mapInstance = ref(null);
    const layerGroup = ref(null);

    const filters = ref({
      course_id: route.query.course_id || '',
      semester_id: route.query.semester_id || '',
    });

    function getColor(gpa) {
      return gpa >= 4.0
        ? '#084594'
        : gpa >= 3.0
        ? '#2171b5'
        : gpa >= 2.0
        ? '#4292c6'
        : gpa >= 1.0
        ? '#6baed6'
        : '#deebf7';
    }

    function clearMap() {
      if (layerGroup.value) {
        layerGroup.value.clearLayers();
      }
    }

    async function updateMap() {
      try {
        if (!mapInstance.value) {
          mapInstance.value = initMap(mapContainer.value);
          layerGroup.value = L.layerGroup().addTo(mapInstance.value);
        }
        clearMap();

        const params = new URLSearchParams();
        Object.entries(filters.value).forEach(([key, value]) => {
          if (value?.trim()) params.append(key, value.trim());
        });

        const [geoResponse, gpaResponse] = await Promise.all([
          axios.get(`${process.env.VUE_APP_API_URL}/api/taiwan-regions`),
          axios.get(
            `${process.env.VUE_APP_API_URL}/api/students-gpa-by-region?${params}`
          ),
        ]);

        const data = gpaResponse.data;
        courseInfo.value = data.courseInfo;

        L.geoJSON(geoResponse.data, {
          style: (feature) => ({
            fillColor: getColor(data.averageGPA[feature.properties.name] || 0),
            weight: 1,
            opacity: 1,
            color: 'white',
            fillOpacity: 0.7,
          }),
          onEachFeature: (feature, layer) => {
            const regionName = feature.properties.name;
            const gpa = data.averageGPA[regionName] || 0;
            const count = data.studentCounts[regionName] || 0;

            if (gpa > 0) {
              const center = layer.getBounds().getCenter();
              L.marker(center, {
                icon: L.divIcon({
                  className: 'gpa-label',
                  html: `<span class="label-text">${gpa.toFixed(2)}</span>`,
                }),
              }).addTo(layerGroup.value);
            }

            layer.bindPopup(
              `<strong>${regionName}</strong><br>
               Students: ${count}<br>
               Average GPA: ${gpa.toFixed(2)}`
            );
          },
        }).addTo(layerGroup.value);

        const gpas = Object.values(data.averageGPA);
        legend.value = [
          {
            range: '3.0-4.0',
            color: '#084594',
            count: gpas.filter((g) => g >= 3.0).length,
          },
          {
            range: '2.0-2.99',
            color: '#2171b5',
            count: gpas.filter((g) => g >= 2.0 && g < 3.0).length,
          },
          {
            range: '1.0-1.99',
            color: '#4292c6',
            count: gpas.filter((g) => g >= 1.0 && g < 2.0).length,
          },
          {
            range: '0-0.99',
            color: '#6baed6',
            count: gpas.filter((g) => g > 0 && g < 1.0).length,
          },
        ];
      } catch (error) {
        console.error('Error:', error);
      }
    }

    const searchData = () => {
      const cleanedFilters = Object.fromEntries(
        Object.entries(filters.value).filter(([, value]) => value.trim())
      );
      router.push({ query: cleanedFilters });
      updateMap();
    };

    const resetFilters = () => {
      filters.value = {
        course_id: '',
        semester_id: '',
      };
      courseInfo.value = null;
      router.push({ query: {} });
      updateMap();
    };

    onMounted(() => {
      updateMap();
    });

    onUnmounted(() => {
      if (mapInstance.value) {
        clearMap();
        mapInstance.value.remove();
      }
    });

    return {
      mapContainer,
      legend,
      filters,
      courseInfo,
      searchData,
      resetFilters,
    };
  },
};
</script>

<style scoped>
.map-wrapper {
  height: calc(100vh - 12rem);
  width: 100%;
}

.legend {
  position: absolute;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
  background: var(--pico-background-color);
  padding: 1rem;
  border-radius: var(--pico-border-radius);
  box-shadow: var(--pico-card-box-shadow);
}

.legend-item {
  margin: 5px 0;
  display: flex;
  align-items: center;
}

.color-box {
  width: 20px;
  height: 20px;
  margin-right: 8px;
}

.info-label {
  margin: 1rem 0;
  font-weight: bold;
}

:global(.gpa-label) {
  background: none !important;
  border: none;
  width: auto !important;
  height: auto !important;
}

:global(.label-text) {
  display: inline-block;
  font-size: 14px;
  font-weight: bold;
  color: black;
  text-shadow: -1px -1px 0 white, 1px -1px 0 white, -1px 1px 0 white,
    1px 1px 0 white;
  white-space: nowrap;
  transform: translate(-50%, -50%);
}

.map-container {
  height: 100%;
  width: 100%;
  position: relative;
}
</style>
