<template>
  <article class="map-article">
    <div class="map-wrapper">
      <div class="map-container" ref="mapContainer">
        <div class="legend">
          <h3>Students per Region</h3>
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
  </article>
</template>

<script>
import { onMounted, ref } from 'vue';
import { initMap } from '../utils/mapConfig';
import L from 'leaflet';
import axios from 'axios';

export default {
  name: 'ChoroplethMap',
  setup() {
    const mapContainer = ref(null);
    const legend = ref([]);

    function getColor(count) {
      return count > 50
        ? '#084594'
        : count > 30
        ? '#2171b5'
        : count > 20
        ? '#4292c6'
        : count > 10
        ? '#6baed6'
        : count > 0
        ? '#9ecae1'
        : '#deebf7';
    }

    function style(feature, studentCounts) {
      const count = studentCounts[feature.properties.name] || 0;
      return {
        fillColor: getColor(count),
        weight: 1,
        opacity: 1,
        color: 'white',
        fillOpacity: 0.7,
      };
    }

    onMounted(async () => {
      const map = initMap(mapContainer.value);

      try {
        const [geoResponse, studentsResponse] = await Promise.all([
          axios.get(`${process.env.VUE_APP_API_URL}/api/taiwan-regions`),
          axios.get(`${process.env.VUE_APP_API_URL}/api/students-by-region`),
        ]);

        const studentCounts = studentsResponse.data;

        L.geoJSON(geoResponse.data, {
          style: (feature) => style(feature, studentCounts),
          onEachFeature: (feature, layer) => {
            const count = studentCounts[feature.properties.name] || 0;
            layer.bindPopup(
              `<strong>${feature.properties.name}</strong><br>
                 Students: ${count}`
            );
          },
        }).addTo(map);

        // Create legend
        const counts = Object.values(studentCounts);
        console.log('count', counts);
        legend.value = [
          {
            range: '1-10',
            color: '#9ecae1',
            count: counts.filter((c) => c > 0 && c <= 10).length,
          },
          {
            range: '11-20',
            color: '#6baed6',
            count: counts.filter((c) => c > 10 && c <= 20).length,
          },
          {
            range: '21-30',
            color: '#4292c6',
            count: counts.filter((c) => c > 20 && c <= 30).length,
          },
          {
            range: '31-50',
            color: '#2171b5',
            count: counts.filter((c) => c > 30 && c <= 50).length,
          },
          {
            range: '50+',
            color: '#084594',
            count: counts.filter((c) => c > 50).length,
          },
        ];
      } catch (error) {
        console.error('Error:', error);
      }
    });

    return {
      mapContainer,
      legend,
    };
  },
};
</script>

<style scoped>
.map-wrapper {
  height: 600px;
  /* padding: 1rem; */
}

.legend {
  position: absolute;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
  background: var(--background-color);
  padding: 1rem;
  border-radius: var(--border-radius);
  box-shadow: var(--card-box-shadow);
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
</style>
