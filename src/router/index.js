import { createRouter, createWebHistory } from 'vue-router';
import UniversityView from '../views/UniversityView.vue';
import StudentView from '../views/StudentView.vue';
import MasterCourseView from '@/views/MasterCourseView.vue';
import SatelliteCourseView from '@/views/SatelliteCourseView.vue';
import ChoroplethMap from '@/views/ChoroplethMap.vue';

const routes = [
  {
    path: '/university',
    name: 'university',
    component: UniversityView,
    props: (route) => ({ query: route.query }),
  },
  {
    path: '/student',
    name: 'student',
    component: StudentView,
    props: (route) => ({ query: route.query }),
  },
  {
    path: '/master-course',
    name: 'master-course',
    component: MasterCourseView,
    props: (route) => ({ query: route.query }),
  },
  {
    path: '/satellite-course',
    name: 'satellite-course',
    component: SatelliteCourseView,
  },
  {
    path: '/choropleth',
    name: 'choropleth',
    component: ChoroplethMap,
    props: (route) => ({ query: route.query }),
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
