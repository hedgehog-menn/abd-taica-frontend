<template>
  <main class="container">
    <div class="grid">
      <h1>Satellite Course</h1>
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
    </div>
  </main>
</template>

<script>
import { onMounted, ref } from 'vue';
import axios from 'axios';

export default {
  name: 'SatelliteCourseView',
  setup() {
    const courses = ref([]);

    onMounted(async () => {
      try {
        const response = await axios.get(
          'http://127.0.0.1:5000/api/satellite-courses'
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
