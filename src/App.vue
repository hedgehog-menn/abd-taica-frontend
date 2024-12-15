<template>
  <nav class="container-fluid">
    <ul>
      <li>
        <strong
          ><i class="fa-solid fa-database" />&nbsp;Group 5: TAICA System</strong
        >
      </li>
    </ul>
    <ul>
      <li><a href="/">Home</a></li>
    </ul>
  </nav>

  <router-view></router-view>
</template>

<script>
export default {
  name: 'App',
};
</script>

<style>
@import '@picocss/pico/css/pico.orange';

/* Leaflet specific fixes */
/* .leaflet-control-zoom {
  border: none !important;
  background: var(--background-color) !important;
}

.leaflet-control-zoom a {
  background: var(--background-color) !important;
  color: var(--primary) !important;
  border: 1px solid var(--primary) !important;
} */

/* Remove pin point blue border */
.leaflet-marker-icon {
  background: transparent !important;
  border: none !important;
  filter: none !important;
}

.map-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
