<template>
  <main class="container">
    <article class="map-article">
      <div class="map-wrapper">
        <div class="map-container" ref="mapContainer"></div>
      </div>
    </article>
  </main>
</template>

<script>
import { onMounted, ref } from 'vue'
import { initMap } from '../utils/mapConfig';
import L from 'leaflet'
import axios from 'axios'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
})

export default {
  name: 'UniversityView',
  setup() {
    const mapContainer = ref(null)

    onMounted(async () => {
     const map = initMap(mapContainer.value)

     try {
        const response = await axios.get('http://127.0.0.1:5000/api/universities')
        response.data.forEach(uni => {
          if (uni.point && Array.isArray(uni.point)) {
            L.marker([uni.point[1], uni.point[0]])
              .bindPopup(`
                <div>
                  <h3>${uni.name}</h3>
                </div>
              `)
              .addTo(map)
          }
        })
      } catch (error) {
        console.error('Error:', error)
      }
    })

    return {
      mapContainer
    }
  }
}
</script>

<style>
.map-wrapper {
  width: 100%;
  height: 100%;
  position: relative;
  padding-bottom: 56.25%; /* 16:9 aspect ratio */
}

.map-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  min-height: 300px;
}

@media (min-width: 768px) {
  .map-wrapper {
    padding-bottom: 75%; /* 4:3 aspect ratio for larger screens */
  }
}

.map-article {
  margin: 1rem 0;
  padding: 1rem;
  background: var(--background-color);
  border-radius: var(--border-radius);
}
</style>
