<template>
  <main class="container">
    <h1>University Student Status</h1>
    <!-- Search Form -->
    <form @submit.prevent="searchStudents">
      <fieldset class="grid">
        <input
          type="text"
          v-model="filters.student_id"
          placeholder="Student ID"
        />
        <input
          type="text"
          v-model="filters.student_name"
          placeholder="Student Name"
        />
        <input
          type="text"
          v-model="filters.university"
          placeholder="University Name"
        />
        <select name="status" v-model="filters.status">
          <option value="">Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
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
              <th scope="col">Student ID</th>
              <th scope="col">Student Name</th>
              <th scope="col">University</th>
              <th scope="col">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="student in students" :key="student.StudentID">
              <td>{{ student.StudentID }}</td>
              <td>{{ student.StudentName }}</td>
              <td>{{ student.UniversityName }}</td>
              <td>{{ student.RegistrationStatus }}</td>
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
  name: 'UniversityStudentStatusView',
  setup() {
    const students = ref([]);
    const route = useRoute();
    const router = useRouter();

    const filters = ref({
      student_id: route.query.student_id || '',
      student_name: route.query.student_name || '',
      university: route.query.university || '',
      status: route.query.status || '',
    });

    const fetchStudents = async () => {
      try {
        const params = new URLSearchParams();
        Object.entries(filters.value).forEach(([key, value]) => {
          if (value?.trim()) {
            params.append(key, value.trim());
          }
        });

        const response = await axios.get(
          `${process.env.VUE_APP_API_URL}/api/university-student-status?${params}`
        );
        students.value = response.data;
      } catch (error) {
        console.error('Error:', error);
      }
    };

    const searchStudents = () => {
      const cleanedFilters = Object.fromEntries(
        Object.entries(filters.value).filter(([, value]) => value.trim())
      );

      router.push({ query: cleanedFilters });
      fetchStudents();
    };

    const resetFilters = () => {
      filters.value = {
        student_id: '',
        student_name: '',
        university: '',
        status: '',
      };
      router.push({ query: {} });
      fetchStudents();
    };

    onMounted(() => {
      fetchStudents();
    });

    return {
      students,
      filters,
      searchStudents,
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
