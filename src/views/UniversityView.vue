<template>
  <main class="container">
    <div class="grid">
      <!-- Map Article -->
      <article class="map-article">
        <div class="map-wrapper">
          <div class="map-container" ref="mapContainer"></div>
        </div>
      </article>

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
    </div>
  </main>
</template>

<script>
import { onMounted, ref } from 'vue';
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

    onMounted(async () => {
      const map = initMap(mapContainer.value);

      try {
        const response = await axios.get(
          'http://127.0.0.1:5000/api/universities'
        );
        universities.value = response.data;

        universities.value.forEach((university) => {
          if (university.geoPoint && Array.isArray(university.geoPoint)) {
            L.marker([university.geoPoint[1], university.geoPoint[0]])
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
          }
        });
      } catch (error) {
        console.error('Error:', error);
      }
    });

    return {
      mapContainer,
      universities,
    };
  },
};
</script>

<style scoped>
.grid {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
}

.map-wrapper {
  height: 600px;
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

article {
  margin: 0;
}
</style>
