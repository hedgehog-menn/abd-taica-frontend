<template>
  <main class="container">
    <div class="grid">
      <h1>Master Course</h1>
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
    </div>
  </main>
</template>

<script>
import { onMounted, ref } from 'vue';
import axios from 'axios';

export default {
  name: 'MasterCourseView',
  setup() {
    const courses = ref([]);

    onMounted(async () => {
      try {
        const response = await axios.get(
          'http://127.0.0.1:5000/api/master-courses'
        );
        courses.value = response.data;
      } catch (error) {
        console.error('Error:', error);
      }
    });

    return {
      courses,
    };
  },
};
</script>

<style scoped>
.grid {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
}

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
