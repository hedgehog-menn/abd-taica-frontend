import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import UniversityView from '../views/UniversityView.vue';
import StudentView from '../views/StudentView.vue';
import MasterCourseView from '@/views/MasterCourseView.vue';
import SatelliteCourseView from '@/views/SatelliteCourseView.vue';
import ChoroplethMap from '@/views/ChoroplethMap.vue';
import CustomQueryView from '@/views/CustomQueryView.vue';

const routes = [
  {
    path: '/home',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/university',
    name: 'university',
    component: UniversityView,
    meta: { title: 'University' },
    props: (route) => ({ query: route.query }),
  },
  {
    path: '/student',
    name: 'student',
    component: StudentView,
    meta: { title: 'Student' },
    props: (route) => ({ query: route.query }),
  },
  {
    path: '/master-course',
    name: 'master-course',
    component: MasterCourseView,
    meta: { title: 'Master Course' },
    props: (route) => ({ query: route.query }),
  },
  {
    path: '/satellite-course',
    name: 'satellite-course',
    component: SatelliteCourseView,
    meta: { title: 'Satellite Course' },
  },
  {
    path: '/choropleth',
    name: 'choropleth',
    component: ChoroplethMap,
    meta: { title: 'Student Map' },
    props: (route) => ({ query: route.query }),
  },
  {
    path: '/custom-query',
    name: 'custom-query',
    component: CustomQueryView,
    meta: { title: 'Custom Query' },
    props: (route) => ({ query: route.query }),
  },
  {
    path: '/',
    redirect: '/home',
  },
];

export default createRouter({
  history: createWebHistory(),
  routes,
});
