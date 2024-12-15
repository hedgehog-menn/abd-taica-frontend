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
              <th scope="col">Name</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="department in departments"
              :key="department.DepartmentID"
            >
              <td>{{ department.DepartmentID }}</td>
              <td>{{ department.DepartmentName }}</td>
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
  name: 'DepartmentView',
  setup() {
    const departments = ref([]);

    onMounted(async () => {
      try {
        const response = await axios.get(
          `${process.env.VUE_APP_API_URL}/api/departments`
        );
        departments.value = response.data;
      } catch (error) {
        console.error('Error:', error);
      }
    });

    return {
      departments,
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
