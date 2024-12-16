<template>
  <main class="container">
    <h1>University's Total Students</h1>
    <!-- Table Article -->
    <article class="table-article">
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th scope="col">University</th>
              <th scope="col">Total Students</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, index) in table" :key="index">
              <td>{{ row.UniversityName }}</td>
              <td>{{ row.TotalStudents }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </article>
  </main>
</template>

<script>
import { onMounted, ref } from 'vue';
import axios from 'axios';

export default {
  name: 'UniversityTotalStudentView',
  setup() {
    const table = ref([]);

    onMounted(async () => {
      try {
        const response = await axios.get(
          `${process.env.VUE_APP_API_URL}/api/university-total-students`
        );
        table.value = response.data;
      } catch (error) {
        console.error('Error:', error);
      }
    });

    return {
      table,
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
