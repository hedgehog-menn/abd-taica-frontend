import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import UniversityView from '../views/UniversityView.vue';
import StudentView from '../views/StudentView.vue';
import MasterCourseView from '@/views/MasterCourseView.vue';
import SatelliteCourseView from '@/views/SatelliteCourseView.vue';
import ChoroplethMap from '@/views/ChoroplethMap.vue';
import CustomQueryView from '@/views/CustomQueryView.vue';
import SemesterEnrollment from '@/views/SemesterEnrollment.vue';
import DepartmentView from '@/views/DepartmentView.vue';
import UniversityTotalStudentView from '@/views/UniversityTotalStudentView.vue';
import CourseApprovementView from '@/views/CourseApprovementView.vue';
import UniversityStudentStatusView from '@/views/UniversityStudentStatusView.vue';
import StudentTotalCreditView from '@/views/StudentTotalCreditView.vue';
import CourseAnnouncementView from '@/views/CourseAnnouncementView.vue';
import ExamScheduleView from '@/views/ExamScheduleView.vue';
import AverageGPAMapView from '@/views/AverageGPAMapView.vue';

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
    path: '/department',
    name: 'department',
    component: DepartmentView,
    meta: { title: 'Department' },
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
    props: (route) => ({ query: route.query }),
  },
  {
    path: '/semester-enrollment',
    name: 'semester-enrollment',
    component: SemesterEnrollment,
    meta: { title: 'Semester Enrollment' },
    props: (route) => ({ query: route.query }),
  },
  {
    path: '/choropleth',
    name: 'choropleth',
    component: ChoroplethMap,
    meta: { title: 'Student Map' },
  },
  {
    path: '/custom-query',
    name: 'custom-query',
    component: CustomQueryView,
    meta: { title: 'Custom Query' },
  },
  {
    path: '/university-total-student',
    name: 'university-total-student',
    component: UniversityTotalStudentView,
    meta: { title: "University's Total Students" },
  },
  {
    path: '/course-approvement',
    name: 'course-approvement',
    component: CourseApprovementView,
    meta: { title: 'Course Approvement' },
  },
  {
    path: '/university-student-status',
    name: 'university-student-status',
    component: UniversityStudentStatusView,
    meta: { title: "University's Student Status" },
    props: (route) => ({ query: route.query }),
  },
  {
    path: '/student-total-credit',
    name: 'student-total-credit',
    component: StudentTotalCreditView,
    meta: { title: "Student's Total Credits" },
    props: (route) => ({ query: route.query }),
  },
  {
    path: '/course-announcement',
    name: 'course-announcement',
    component: CourseAnnouncementView,
    meta: { title: 'Course Announcement' },
    props: (route) => ({ query: route.query }),
  },
  {
    path: '/exam-schedule',
    name: 'exam-schedule',
    component: ExamScheduleView,
    meta: { title: 'Exam Schedule' },
    props: (route) => ({ query: route.query }),
  },
  {
    path: '/average-gpa-map',
    name: 'average-gpa-map',
    component: AverageGPAMapView,
    meta: { title: "Student's Average GPA Map" },
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
