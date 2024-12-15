<template>
  <main class="container">
    <h1>Satellite Course</h1>
    <!-- Search Form -->
    <form @submit.prevent="searchCourses">
      <fieldset class="grid">
        <input type="text" v-model="filters.id" placeholder="Course ID" />
        <input type="text" v-model="filters.name" placeholder="Name" />
        <input
          type="text"
          v-model="filters.professor"
          placeholder="Professor"
        />
        <button type="submit">
          <i class="fa-solid fa-magnifying-glass" />&nbsp;Search
        </button>
        <button type="button" @click="resetFilters" class="secondary">
          Reset
        </button>
      </fieldset>
    </form>

    <!-- Table Article -->
    <article class="table-article">
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th scope="col">ID</th>
              <th scope="col">Name</th>
              <th scope="col">Professor</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="course in courses" :key="course.SCourseID">
              <td>{{ course.SCourseID }}</td>
              <td>{{ course.CourseName }}</td>
              <td>{{ course.ProfessorName }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </article>
  </main>
</template>

<script>
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';

export default {
  name: 'SatelliteCourseView',
  setup() {
    const courses = ref([]);
    const route = useRoute();
    const router = useRouter();

    const filters = ref({
      id: route.query.id || '',
      name: route.query.name || '',
      professor: route.query.professor || '',
    });

    const fetchCourses = async () => {
      try {
        const params = new URLSearchParams();
        Object.entries(filters.value).forEach(([key, value]) => {
          if (value?.trim()) {
            params.append(key, value.trim());
          }
        });

        const response = await axios.get(
          `${process.env.VUE_APP_API_URL}/api/satellite-courses?${params}`
        );
        courses.value = response.data;
      } catch (error) {
        console.error('Error:', error);
      }
    };

    const searchCourses = () => {
      const cleanedFilters = Object.fromEntries(
        Object.entries(filters.value).filter(([, value]) => value.trim())
      );

      router.push({ query: cleanedFilters });
      fetchCourses();
    };

    const resetFilters = () => {
      filters.value = { id: '', name: '', professor: '' };
      router.push({ query: {} });
      fetchCourses();
    };

    onMounted(() => {
      fetchCourses();
    });

    return {
      courses,
      filters,
      searchCourses,
      resetFilters,
    };
  },
};
</script>

<style scoped>
.table-wrapper {
  overflow-x: auto;
  max-height: 500px;
}

thead {
  position: sticky;
  top: 0;
  z-index: 1;
}
</style>
