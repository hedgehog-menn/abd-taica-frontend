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
    path: '/',
    redirect: '/university',
  },
];

export default createRouter({
  history: createWebHistory(),
  routes,
});
