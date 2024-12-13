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
}

.map-container {
  width: 100%;
  height: 600px;
}

@media (max-width: 768px) {
  .map-container {
    height: 400px;
  }
}
</style>
