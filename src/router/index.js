import { createRouter, createWebHistory } from 'vue-router';
import UniversityView from '../views/UniversityView.vue';
import StudentView from '../views/StudentView.vue';
import ChoroplethMap from '@/views/ChoroplethMap.vue';

const routes = [
  {
    path: '/university',
    name: 'university',
    component: UniversityView,
  },
  {
    path: '/student',
    name: 'student',
    component: StudentView,
  },
  {
    path: '/choropleth',
    name: 'choropleth',
    component: ChoroplethMap,
  },
  {
    path: '/',
    redirect: '/university',
  },
];

export default createRouter({
  history: createWebHistory(),
  routes,
});
