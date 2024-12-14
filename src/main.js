import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

router.beforeEach((to, from, next) => {
  document.title = to.meta.title || 'Group 5: TAICA System';
  next();
});

createApp(App).use(router).mount('#app');
