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
      <li>
        <select v-model="theme" @change="changeTheme">
          <option value="auto">Auto</option>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </li>
      <li><a href="/">Home</a></li>
    </ul>
  </nav>

  <router-view></router-view>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      theme: localStorage.getItem('theme') || 'auto',
    };
  },
  mounted() {
    this.applyTheme(this.theme);
  },
  methods: {
    changeTheme(event) {
      const newTheme = event.target.value;
      this.applyTheme(newTheme);
      localStorage.setItem('theme', newTheme);
    },
    applyTheme(theme) {
      const html = document.documentElement;
      if (theme === 'auto') {
        html.removeAttribute('data-theme');
      } else {
        html.setAttribute('data-theme', theme);
      }
    },
  },
};
</script>

<style>
@import '@picocss/pico/css/pico.orange';

/* Existing Leaflet styles remain unchanged */
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

/* Theme selector styling */
select {
  margin-bottom: 0;
  width: auto;
}
</style>
