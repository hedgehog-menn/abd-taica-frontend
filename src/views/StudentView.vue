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
                <th scope="col">Phone</th>
                <th scope="col">Email</th>
                <th scope="col">Address</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="student in students" :key="student.StudentID">
                <td>{{ student.StudentID }}</td>
                <td>{{ student.StudentName }}</td>
                <td>{{ student.PhoneNumber }}</td>
                <td>{{ student.Email }}</td>
                <td>{{ student.Address }}</td>
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
  name: 'StudentView',
  setup() {
    const mapContainer = ref(null);
    const students = ref([]);

    onMounted(async () => {
      const map = initMap(mapContainer.value);

      try {
        const response = await axios.get('http://127.0.0.1:5000/api/students');
        students.value = response.data;

        students.value.forEach((student) => {
          if (student.geoPoint && Array.isArray(student.geoPoint)) {
            L.marker([student.geoPoint[1], student.geoPoint[0]])
              .bindPopup(
                `
                <div>
                  <h3>${student.StudentName}</h3>
                  <p>ID: ${student.StudentID}</p>
                  <p>Phone: ${student.PhoneNumber}</p>
                  <p>Email: ${student.Email}</p>
                  <p>Address: ${student.Address}</p>
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
      students,
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
