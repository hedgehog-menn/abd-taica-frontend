<template>
  <main class="container">
    <h1>Student</h1>
    <!-- Search Form -->
    <form @submit.prevent="searchStudents">
      <fieldset class="grid">
        <input type="text" v-model="filters.id" placeholder="Student ID" />
        <input type="text" v-model="filters.name" placeholder="Name" />
        <input type="text" v-model="filters.phone" placeholder="Phone" />
        <input type="email" v-model="filters.email" placeholder="Email" />
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
  name: 'StudentView',
  setup() {
    const mapContainer = ref(null);
    const students = ref([]);
    const route = useRoute();
    const router = useRouter();
    let map = null;
    let markers = [];

    const filters = ref({
      id: route.query.id || '',
      name: route.query.name || '',
      phone: route.query.phone || '',
      email: route.query.email || '',
    });

    const fetchStudents = async () => {
      try {
        const params = new URLSearchParams();
        Object.entries(filters.value).forEach(([key, value]) => {
          if (value?.trim()) {
            params.append(key, value.trim());
          }
        });

        const response = await axios.get(
          `http://127.0.0.1:5000/api/students?${params}`
        );
        students.value = response.data;
        updateMap();
      } catch (error) {
        console.error('Error:', error);
      }
    };

    const updateMap = () => {
      if (!map) return;

      markers.forEach((marker) => marker.remove());
      markers = [];

      students.value.forEach((student) => {
        if (student.geoPoint && Array.isArray(student.geoPoint)) {
          const marker = L.marker([student.geoPoint[1], student.geoPoint[0]])
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
          markers.push(marker);
        }
      });
    };

    const searchStudents = () => {
      const cleanedFilters = Object.fromEntries(
        Object.entries(filters.value).filter(([, value]) => value.trim())
      );

      router.push({ query: cleanedFilters });
      fetchStudents();
    };

    const resetFilters = () => {
      filters.value = { id: '', name: '', phone: '', email: '' };
      router.push({ query: {} });
      fetchStudents();
    };

    onMounted(() => {
      map = initMap(mapContainer.value);
      fetchStudents();
    });

    return {
      mapContainer,
      students,
      filters,
      searchStudents,
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
