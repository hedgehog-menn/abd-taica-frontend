<template>
  <main class="container">
    <h1>Master Course</h1>
    <!-- Search Form -->
    <form @submit.prevent="searchCourses">
      <fieldset class="grid">
        <input type="text" v-model="filters.id" placeholder="Course ID" />
        <input type="text" v-model="filters.name" placeholder="Name" />
        <input type="number" v-model="filters.credit" placeholder="Credit" />
        <input
          type="text"
          v-model="filters.professor"
          placeholder="Professor"
        />
        <select name="licensing" v-model="filters.licensing">
          <option value="">Licensing</option>
          <option value="Normal">Normal</option>
        </select>
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
              <th scope="col">Credit</th>
              <th scope="col">Professor</th>
              <th scope="col">Licensing Type</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="course in courses" :key="course.CourseID">
              <td>{{ course.CourseID }}</td>
              <td>{{ course.CourseName }}</td>
              <td>{{ course.Credit }}</td>
              <td>{{ course.ProfessorName }}</td>
              <td>{{ course.LicensingType }}</td>
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
  name: 'MasterCourseView',
  setup() {
    const courses = ref([]);
    const route = useRoute();
    const router = useRouter();

    const filters = ref({
      id: route.query.id || '',
      name: route.query.name || '',
      credit: route.query.credit ? Number(route.query.credit) : '',
      professor: route.query.professor || '',
      licensing: route.query.licensing || '',
    });

    const fetchCourses = async () => {
      try {
        const params = new URLSearchParams();
        Object.entries(filters.value).forEach(([key, value]) => {
          if (key === 'credit') {
            if (value !== '' && !isNaN(value)) params.append(key, value);
          } else if (value?.trim()) {
            params.append(key, value.trim());
          }
        });

        const response = await axios.get(
          `http://127.0.0.1:5000/api/master-courses?${params}`
        );
        courses.value = response.data;
      } catch (error) {
        console.error('Error:', error);
      }
    };

    const searchCourses = () => {
      const cleanedFilters = Object.fromEntries(
        Object.entries(filters.value).filter(([key, value]) => {
          if (key === 'credit') {
            return value !== '' && !isNaN(value);
          }
          return value.trim();
        })
      );

      router.push({ query: cleanedFilters });
      fetchCourses();
    };

    const resetFilters = () => {
      filters.value = {
        id: '',
        name: '',
        credit: '',
        professor: '',
        licensing: '',
      };
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
