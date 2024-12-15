<template>
  <main class="container">
    <h1>Semester Enrollment</h1>
    <form @submit.prevent="searchEnrollments">
      <fieldset role="group" class="grid">
        <select v-model="filters.year">
          <option disabled value="">Select Year</option>
          <option selected value="2024">2024</option>
          <option value="2025">2025</option>
        </select>
        <select v-model="filters.semester">
          <option disabled value="">Select Semester</option>
          <option selected value="F">Fall</option>
          <option value="S">Spring</option>
        </select>
        <button type="submit">
          <i class="fa-solid fa-magnifying-glass" />&nbsp;Search
        </button>
      </fieldset>
    </form>

    <article class="table-article">
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th scope="col">Student ID</th>
              <th scope="col">Enrollment ID</th>
              <th scope="col">Status</th>
              <th scope="col">Grade</th>
              <th scope="col">GPA</th>
              <th scope="col">Course Name</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="enrollment in enrollments"
              :key="enrollment.EnrollmentID"
            >
              <td>{{ enrollment.StudentID }}</td>
              <td>{{ enrollment.EnrollmentID }}</td>
              <td>{{ enrollment.Status }}</td>
              <td>{{ enrollment.Grade }}</td>
              <td>{{ enrollment.GPA }}</td>
              <td>{{ enrollment.CourseName }}</td>
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
  name: 'SemesterEnrollmentView',
  setup() {
    const enrollments = ref([]);
    const route = useRoute();
    const router = useRouter();

    const DEFAULT_YEAR = '2024';
    const DEFAULT_SEMESTER = 'F';

    const filters = ref({
      year: route.query.year || DEFAULT_YEAR,
      semester: route.query.semester || DEFAULT_SEMESTER,
    });

    const fetchEnrollments = async () => {
      try {
        const params = new URLSearchParams();
        const year = filters.value.year || DEFAULT_YEAR;
        const semester = filters.value.semester || DEFAULT_SEMESTER;

        params.append('year', year);
        params.append('semester', semester);

        const response = await axios.get(
          `${process.env.VUE_APP_API_URL}/api/semester-enrollment?${params}`
        );
        enrollments.value = response.data;
      } catch (error) {
        console.error('Error:', error);
      }
    };

    const searchEnrollments = () => {
      const year = filters.value.year || DEFAULT_YEAR;
      const semester = filters.value.semester || DEFAULT_SEMESTER;

      router.push({
        query: {
          year,
          semester,
        },
      });
      fetchEnrollments();
    };

    onMounted(() => {
      // If no query params, redirect to default
      if (!route.query.year || !route.query.semester) {
        router.replace({
          query: {
            year: filters.value.year,
            semester: filters.value.semester,
          },
        });
      }
      fetchEnrollments();
    });

    return {
      enrollments,
      filters,
      searchEnrollments,
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
