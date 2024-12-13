<template>
  <nav class="container-fluid">
    <ul>
      <li><strong>Spatial Data System</strong></li>
    </ul>
    <ul>
      <!-- Navigation items can be added here -->
    </ul>
  </nav>
  
  <router-view></router-view>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
@import '@picocss/pico/css/pico.min.css';

/* Global custom styles */
body {
  margin: 0;
  padding: 0;
}
</style>
