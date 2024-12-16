<template>
  <main class="container">
    <div class="grid">
      <article
        v-for="item in items"
        :key="item.id"
        @click="navigateTo(item.link)"
        class="cursor-pointer"
      >
        <i v-if="item.icon" :class="['fa-solid', item.icon]"></i>
        <span v-if="item.icon">&nbsp;&nbsp;</span>
        <span>{{ item.title }}</span>
      </article>
    </div>
  </main>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const items = ref([
  {
    title: 'University',
    icon: 'fa-school',
    link: '/university',
  },
  {
    title: 'Department',
    icon: 'fa-school',
    link: '/department',
  },
  {
    title: 'Student',
    icon: 'fa-user',
    link: '/student',
  },
  {
    title: 'Master Course',
    icon: 'fa-book-open',
    link: '/master-course',
  },
  {
    title: 'Satellite Course',
    icon: 'fa-book-open',
    link: '/satellite-course',
  },
  {
    title: 'Semester Enrollment',
    icon: 'fa-book-open',
    link: '/semester-enrollment',
  },
  {
    title: 'Student Map by Region',
    icon: 'fa-earth-asia',
    link: '/choropleth',
  },
  {
    title: 'Exam Schedule',
    icon: 'fa-route',
    link: '/exam-schedule',
  },
  {
    title: 'Course Approvement',
    icon: 'fa-check',
    link: 'course-approvement',
  },
  {
    title: 'Course Announcement',
    icon: 'fa-bullhorn',
    link: 'course-announcement',
  },
  {
    title: "University's Total Students",
    icon: 'fa-user',
    link: '/university-total-student',
  },
  {
    title: "University's Student Status",
    icon: 'fa-user',
    link: '/university-student-status',
  },
  {
    title: "Student's Total Credits",
    icon: 'fa-user',
    link: '/student-total-credit',
  },
  {
    title: 'Custom Query',
    icon: 'fa-magnifying-glass',
    link: '/custom-query',
  },
]);

const navigateTo = (link) => {
  router.push(link);
};
</script>

<style scoped>
@media (min-width: 768px) {
  .grid {
    grid-template-columns: 1fr 1fr;
  }
}

@media (min-width: 1024px) {
  .grid {
    grid-template-columns: 1fr 1fr 1fr;
  }
}

.cursor-pointer {
  cursor: pointer;
}

.cursor-pointer:hover {
  opacity: 0.8;
}
</style>
