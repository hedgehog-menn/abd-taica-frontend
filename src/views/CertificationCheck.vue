<template>
  <main class="container">
    <h1>Certification Check</h1>
    <form @submit.prevent="searchCertificates">
      <fieldset class="grid">
        <input type="text" v-model="filters.id" placeholder="Student ID" />
        <input
          type="date"
          v-model="filters.date"
          name="date"
          aria-label="Issue Date"
        />
        <button type="submit">
          <i class="fa-solid fa-magnifying-glass" />&nbsp;Search
        </button>
        <button type="button" @click="resetFilters" class="secondary">
          Reset
        </button>
      </fieldset>
    </form>

    <article class="table-article">
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th scope="col">ID</th>
              <th scope="col">Name</th>
              <th scope="col">Issue Date</th>
              <th scope="col">Program</th>
              <th scope="col">Certificate</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="cert in certificates"
              :key="cert.StudentID + cert.IssuedDate"
            >
              <td>{{ cert.StudentID }}</td>
              <td>{{ cert.StudentName }}</td>
              <td>{{ cert.IssuedDate }}</td>
              <td>{{ cert.ProgramName }}</td>
              <td>{{ cert.CertificateName }}</td>
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
  name: 'CertificateCheckView',
  setup() {
    const certificates = ref([]);
    const route = useRoute();
    const router = useRouter();

    const filters = ref({
      id: route.query.id || '',
      date: route.query.date || '',
    });

    const fetchCertificates = async () => {
      try {
        const params = new URLSearchParams();
        Object.entries(filters.value).forEach(([key, value]) => {
          if (value?.trim()) {
            params.append(key, value.trim());
          }
        });

        const response = await axios.get(
          `${process.env.VUE_APP_API_URL}/api/student-certificates?${params}`
        );
        certificates.value = response.data;
      } catch (error) {
        console.error('Error:', error);
      }
    };

    const searchCertificates = () => {
      const cleanedFilters = Object.fromEntries(
        Object.entries(filters.value).filter(([, value]) => value.trim())
      );

      router.push({ query: cleanedFilters });
      fetchCertificates();
    };

    const resetFilters = () => {
      filters.value = {
        id: '',
        date: '',
      };
      router.push({ query: {} });
      fetchCertificates();
    };

    onMounted(() => {
      fetchCertificates();
    });

    return {
      certificates,
      filters,
      searchCertificates,
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
