<template>
  <main class="container">
    <h1>University</h1>
    <!-- Search Form -->
    <form @submit.prevent="searchUniversities">
      <fieldset class="grid">
        <input type="text" v-model="filters.id" placeholder="University ID" />
        <input type="text" v-model="filters.name" placeholder="Name" />
        <button type="submit">Search</button>
        <button type="button" @click="resetFilters" class="secondary">
          Reset
        </button>
      </fieldset>
    </form>

    <!-- Map Article -->
    <div class="map-wrapper">
      <div class="map-container" ref="mapContainer"></div>
    </div>
    <!-- <article class="map-article">
        <div class="map-wrapper">
          <div class="map-container" ref="mapContainer"></div>
        </div>
      </article> -->

    <!-- Table Article -->
    <article class="table-article">
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th scope="col">ID</th>
              <th scope="col">Name</th>
              <th scope="col">Address</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="university in universities"
              :key="university.UniversityID"
            >
              <td>{{ university.UniversityID }}</td>
              <td>{{ university.UniversityName }}</td>
              <td>{{ university.Address }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </article>
  </main>
</template>

<script>
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { initMap } from '../utils/mapConfig';
import L from 'leaflet';
import axios from 'axios';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

export default {
  name: 'UniversityView',
  setup() {
    const mapContainer = ref(null);
    const universities = ref([]);
    const route = useRoute();
    const router = useRouter();
    let map = null;
    let markers = [];

    const filters = ref({
      id: route.query.id || '',
      name: route.query.name || '',
    });

    const fetchUniversities = async () => {
      try {
        const params = new URLSearchParams();
        Object.entries(filters.value).forEach(([key, value]) => {
          if (value?.trim()) {
            params.append(key, value.trim());
          }
        });

        const response = await axios.get(
          `http://127.0.0.1:5000/api/universities?${params}`
        );
        universities.value = response.data;
        updateMap();
      } catch (error) {
        console.error('Error:', error);
      }
    };

    const updateMap = () => {
      if (!map) return;

      markers.forEach((marker) => marker.remove());
      markers = [];

      universities.value.forEach((university) => {
        if (university.geoPoint && Array.isArray(university.geoPoint)) {
          const marker = L.marker([
            university.geoPoint[1],
            university.geoPoint[0],
          ])
            .bindPopup(
              `
                <div>
                  <h3>${university.UniversityName}</h3>
                  <p>ID: ${university.UniversityID}</p>
                  <p>Address: ${university.Address}</p>
                </div>
              `
            )
            .addTo(map);
          markers.push(marker);
        }
      });
    };

    const searchUniversities = () => {
      const cleanedFilters = Object.fromEntries(
        Object.entries(filters.value).filter(([, value]) => value.trim())
      );

      router.push({ query: cleanedFilters });
      fetchUniversities();
    };

    const resetFilters = () => {
      filters.value = { id: '', name: '' };
      router.push({ query: {} });
      fetchUniversities();
    };

    onMounted(() => {
      map = initMap(mapContainer.value);
      fetchUniversities();
    });

    return {
      mapContainer,
      universities,
      filters,
      searchUniversities,
      resetFilters,
    };
  },
};
</script>

<style scoped>
.map-wrapper {
  height: 600px;
  margin-bottom: var(--pico-spacing);
}

.table-wrapper {
  overflow-x: auto;
  max-height: 500px;
}

thead {
  position: sticky;
  top: 0;
  z-index: 1;
}
</style>
