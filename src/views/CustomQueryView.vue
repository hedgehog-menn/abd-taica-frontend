<template>
  <main class="container">
    <h1>Custom Query</h1>
    <form @submit.prevent="executeQuery">
      <textarea
        v-model="query"
        placeholder="Enter your Cypher query"
        rows="4"
      ></textarea>
      <button type="submit">Execute Query</button>
    </form>

    <article class="table-article" v-if="results.length">
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th v-for="header in tableHeaders" :key="header" scope="col">
                {{ header }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(result, index) in results" :key="index">
              <td v-for="header in tableHeaders" :key="header">
                {{ formatValue(result[header]) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </article>
  </main>
</template>

<script>
import { ref, computed } from 'vue';
import axios from 'axios';

export default {
  name: 'CustomQueryView',
  setup() {
    const query = ref('');
    const results = ref([]);

    const tableHeaders = computed(() => {
      if (results.value.length === 0) return [];
      return Object.keys(results.value[0]);
    });

    const formatValue = (value) => {
      if (Array.isArray(value)) return JSON.stringify(value);
      if (value === null) return 'null';
      if (value === undefined) return '';
      return value;
    };

    const executeQuery = async () => {
      try {
        const response = await axios.post(
          'http://127.0.0.1:5000/api/custom-query',
          {
            query: query.value,
            params: {},
          }
        );
        results.value = response.data;
      } catch (error) {
        console.error('Error:', error);
        alert(error.response?.data?.error || 'Error executing query');
      }
    };

    return {
      query,
      results,
      tableHeaders,
      executeQuery,
      formatValue,
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

textarea {
  width: 100%;
  margin-bottom: 1rem;
}
</style>
