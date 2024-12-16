<template>
  <main class="container">
    <h1>Student Total Credits</h1>
    <form @submit.prevent="searchCredits">
      <fieldset class="grid">
        <input
          type="text"
          v-model="filters.id"
          placeholder="Student ID"
          required
        />
        <button type="submit">
          <i class="fa-solid fa-magnifying-glass" />&nbsp;Search
        </button>
      </fieldset>
    </form>

    <article class="table-article" v-if="credits.length > 0">
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th scope="col">ID</th>
              <th scope="col">Name</th>
              <th scope="col" class="text-center">Total Completed Credits</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="credit in credits" :key="credit.StudentID">
              <td>{{ credit.StudentID }}</td>
              <td>{{ credit.StudentName }}</td>
              <td class="text-center">{{ credit.TotalCompletedCredits }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </article>
  </main>
</template>

<script>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';

export default {
  name: 'StudentTotalCreditView',
  setup() {
    const credits = ref([]);
    const route = useRoute();
    const router = useRouter();

    const filters = ref({
      id: route.query.id || '',
    });

    const searchCredits = async () => {
      if (!filters.value.id.trim()) return;

      try {
        const response = await axios.get(
          `${process.env.VUE_APP_API_URL}/api/student-credits`,
          {
            params: { id: filters.value.id },
          }
        );
        credits.value = response.data;
        router.push({ query: { id: filters.value.id } });
      } catch (error) {
        console.error('Error:', error);
      }
    };

    return {
      credits,
      filters,
      searchCredits,
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
