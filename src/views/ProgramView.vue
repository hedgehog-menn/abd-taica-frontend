<template>
  <main class="container">
    <h1>Program Master Courses</h1>
    <form @submit.prevent="searchCourses">
      <fieldset class="grid">
        <input
          type="text"
          v-model="filters.program_id"
          placeholder="Program ID"
        />
        <input
          type="text"
          v-model="filters.program_name"
          placeholder="Program Name"
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
              <th scope="col">Program ID</th>
              <th scope="col">Program Name</th>
              <th scope="col">Course Name</th>
              <th scope="col">Approval ID</th>
              <th scope="col">Central Approval</th>
              <th scope="col">Committee Approval</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="program in programs" :key="program.ProgramID">
              <td>{{ program.ProgramID }}</td>
              <td>{{ program.ProgramName }}</td>
              <td>{{ program.CourseName }}</td>
              <td>{{ program.ApprovalID }}</td>
              <td class="text-center">
                <i
                  v-if="program.CommitteeApproval"
                  :class="['fa-solid', 'fa-check']"
                ></i>
              </td>
              <td class="text-center">
                <i
                  v-if="program.CentralApproval"
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
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';

export default {
  name: 'ProgramView',
  setup() {
    const programs = ref([]);
    const route = useRoute();
    const router = useRouter();

    const filters = ref({
      program_id: route.query.program_id || '',
      program_name: route.query.program_name || '',
    });

    const fetchCourses = async () => {
      try {
        const params = new URLSearchParams();
        Object.entries(filters.value).forEach(([key, value]) => {
          if (value?.trim()) {
            params.append(key, value.trim());
          }
        });

        const response = await axios.get(
          `${process.env.VUE_APP_API_URL}/api/programs?${params}`
        );
        programs.value = response.data;
      } catch (error) {
        console.error('Error:', error);
      }
    };

    const searchCourses = () => {
      const cleanedFilters = Object.fromEntries(
        Object.entries(filters.value).filter(([, value]) => value.trim())
      );
      router.push({ query: cleanedFilters });
      fetchCourses();
    };

    const resetFilters = () => {
      filters.value = {
        program_id: '',
        program_name: '',
      };
      router.push({ query: {} });
      fetchCourses();
    };

    onMounted(() => {
      fetchCourses();
    });

    return {
      programs,
      filters,
      searchCourses,
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
