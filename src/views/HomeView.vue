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
    title: 'Student',
    icon: 'fa-user',
    link: '/student',
  },
  {
    title: 'Master Cousre',
    icon: 'fa-book-open',
    link: '/master-course',
  },
  {
    title: 'Satellite Cousre',
    icon: 'fa-book-open',
    link: '/satellite-course',
  },
  {
    title: 'Semester Enrollment',
    icon: 'fa-book-open',
    link: '/semester-enrollment',
  },
  {
    title: 'Student Map by region',
    icon: 'fa-earth-asia',
    link: '/choropleth',
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
.grid {
  grid-template-columns: 1fr;
}

.cursor-pointer {
  cursor: pointer;
}

.cursor-pointer:hover {
  opacity: 0.8;
}
</style>
