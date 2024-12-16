<template>
  <main class="container">
    <h1>Department</h1>
    <!-- Table Article -->
    <article class="table-article">
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th scope="col">ID</th>
              <th scope="col">Course</th>
              <th scope="col" class="text-center">Approved by Committee</th>
              <th scope="col" class="text-center">
                Approved by Central Office
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, index) in table" :key="index">
              <td>{{ row.CourseID }}</td>
              <td>{{ row.CourseName }}</td>
              <td class="text-center">
                <i
                  v-if="row.CommitteeApproval"
                  :class="['fa-solid', 'fa-check']"
                ></i>
              </td>
              <td class="text-center">
                <i
                  v-if="row.CentralOfficeApproval"
                  :class="['fa-solid', 'fa-check']"
                ></i>
              </td>
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
  name: 'CourseApprovementView',
  setup() {
    const table = ref([]);

    onMounted(async () => {
      try {
        const response = await axios.get(
          `${process.env.VUE_APP_API_URL}/api/course-approvement`
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
