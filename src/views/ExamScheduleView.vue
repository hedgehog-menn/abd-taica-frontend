<template>
  <main class="container">
    <h1>Exam Schedule</h1>
    <form @submit.prevent="searchExams">
      <fieldset class="grid">
        <input
          type="text"
          v-model="filters.course_id"
          placeholder="Course ID"
        />
        <input
          type="date"
          v-model="filters.exam_date"
          placeholder="Exam Date"
        />
        <button type="submit">
          <i class="fa-solid fa-magnifying-glass" />&nbsp;Search
        </button>
        <button type="button" @click="resetFilters" class="secondary">
          Reset
        </button>
      </fieldset>
    </form>

    <article class="table-article">
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th scope="col">Course ID</th>
              <th scope="col">Course Name</th>
              <th scope="col">Date</th>
              <th scope="col">Room</th>
              <th scope="col">University</th>
              <th scope="col">Address</th>
              <th scope="col">Route</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="exam in exams" :key="exam.CourseID + exam.Date">
              <td>{{ exam.CourseID }}</td>
              <td>{{ exam.CourseName }}</td>
              <td>{{ exam.Date }}</td>
              <td>{{ exam.Room }}</td>
              <td>{{ exam.University }}</td>
              <td>{{ exam.Address }}</td>
              <td>
                <button
                  v-if="activeRoute !== exam"
                  @click="showRoute(exam)"
                  data-tooltip="Show Route"
                >
                  <i class="fa-solid fa-route"></i>
                </button>
                <button
                  v-else
                  @click="showRoute(exam)"
                  class="outline"
                  data-tooltip="Hide Route"
                >
                  <i class="fa-solid fa-route"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </article>

    <div class="map-wrapper">
      <div class="map-container" ref="mapContainer"></div>
    </div>
  </main>
</template>

<script>
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { initMap } from '../utils/mapConfig';
import L from 'leaflet';
import axios from 'axios';
import 'leaflet-routing-machine';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

export default {
  name: 'ExamScheduleView',
  setup() {
    const mapContainer = ref(null);
    const exams = ref([]);
    const route = useRoute();
    const router = useRouter();
    const activeRoute = ref(null);
    let map = null;
    let markers = [];
    let currentRouting = null;
    let userLocation = null;
    const DEFAULT_ZOOM = 7;

    const filters = ref({
      course_id: route.query.course_id || '',
      exam_date: route.query.exam_date || '',
    });

    const fetchExams = async () => {
      try {
        const params = new URLSearchParams();
        Object.entries(filters.value).forEach(([key, value]) => {
          if (value?.trim()) {
            params.append(key, value.trim());
          }
        });

        const response = await axios.get(
          `${process.env.VUE_APP_API_URL}/api/exam-schedule?${params}`
        );
        exams.value = response.data;
        updateMap();
      } catch (error) {
        console.error('Error:', error);
      }
    };

    const fitMapBounds = () => {
      if (markers.length > 0) {
        const bounds = L.featureGroup(markers).getBounds();
        map.fitBounds(bounds, { padding: [50, 50] });
      } else {
        map.setView([23.5, 121], DEFAULT_ZOOM);
      }
    };

    const updateMap = () => {
      if (!map) return;

      markers.forEach((marker) => marker.remove());
      markers = [];

      exams.value.forEach((exam) => {
        if (exam.geoPoint && Array.isArray(exam.geoPoint)) {
          const marker = L.marker([exam.geoPoint[1], exam.geoPoint[0]])
            .bindPopup(
              `
              <div>
                <h3>${exam.CourseName}</h3>
                <p>Course ID: ${exam.CourseID}</p>
                <p>Date: ${exam.Date}</p>
                <p>Room: ${exam.Room}</p>
                <p>University: ${exam.University}</p>
                <p>Address: ${exam.Address}</p>
              </div>
            `
            )
            .addTo(map);
          markers.push(marker);
        }
      });

      fitMapBounds();
    };

    const getUserLocation = () => {
      return new Promise((resolve, reject) => {
        if (userLocation) {
          resolve(userLocation);
        } else {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              userLocation = [
                position.coords.latitude,
                position.coords.longitude,
              ];
              resolve(userLocation);
            },
            (error) => reject(error)
          );
        }
      });
    };

    const showRoute = async (exam) => {
      try {
        if (currentRouting) {
          map.removeControl(currentRouting);
          currentRouting = null;
        }

        // Remove all existing markers
        markers.forEach((marker) => marker.remove());

        if (activeRoute.value === exam) {
          activeRoute.value = null;
          updateMap(); // This will restore all markers
          return;
        }

        const userCoords = await getUserLocation();
        const examCoords = [exam.geoPoint[1], exam.geoPoint[0]];

        const userIcon = L.divIcon({
          html: `
        <div style="
          width: 12px;
          height: 12px;
          background-color: var(--pico-primary);
          border-radius: 50%;
          border: 2px solid white;
        "></div>`,
          className: 'user-location-marker',
        });

        // Add only the relevant exam marker
        const examMarker = L.marker([exam.geoPoint[1], exam.geoPoint[0]])
          .bindPopup(
            `
        <div>
          <h3>${exam.CourseName}</h3>
          <p>Course ID: ${exam.CourseID}</p>
          <p>Date: ${exam.Date}</p>
          <p>Room: ${exam.Room}</p>
          <p>University: ${exam.University}</p>
          <p>Address: ${exam.Address}</p>
        </div>
      `
          )
          .addTo(map);
        markers = [examMarker];

        currentRouting = L.Routing.control({
          waypoints: [
            L.latLng(userCoords[0], userCoords[1]),
            L.latLng(examCoords[0], examCoords[1]),
          ],
          routeWhileDragging: true,
          createMarker: function (i, waypoint) {
            if (i === 0) {
              return L.marker(waypoint.latLng, { icon: userIcon });
            }
            return null; // Don't show end marker since we already have examMarker
          },
        }).addTo(map);

        activeRoute.value = exam;
      } catch (error) {
        console.error('Error getting location:', error);
        alert('Unable to access location. Please enable location services.');
      }
    };

    const searchExams = () => {
      const cleanedFilters = Object.fromEntries(
        Object.entries(filters.value).filter(([, value]) => value.trim())
      );
      router.push({ query: cleanedFilters });
      fetchExams();
    };

    const resetFilters = () => {
      filters.value = { course_id: '', exam_date: '' };
      router.push({ query: {} });
      fetchExams();
    };

    onMounted(() => {
      map = initMap(mapContainer.value);
      fetchExams();
    });

    return {
      mapContainer,
      exams,
      filters,
      activeRoute,
      searchExams,
      resetFilters,
      showRoute,
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
