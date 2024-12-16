<template>
  <main class="container">
    <h1>Course Announcements</h1>
    <form @submit.prevent="searchAnnouncements">
      <fieldset class="grid">
        <input
          type="date"
          v-model="filters.date"
          name="date"
          aria-label="Date"
        />
        <input type="text" v-model="filters.id" placeholder="Course ID" />
        <select name="type" v-model="filters.type">
          <option value="">Type</option>
          <option value="Exam">Exam</option>
          <option value="Progress">Progress</option>
        </select>
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
              <th scope="col">Date</th>
              <th scope="col">ID</th>
              <th scope="col">Course</th>
              <th scope="col">Type</th>
              <th scope="col">Title</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="announcement in announcements"
              :key="announcement.CourseID + announcement.Date"
            >
              <td>{{ announcement.Date }}</td>
              <td>{{ announcement.CourseID }}</td>
              <td>{{ announcement.Course }}</td>
              <td>{{ announcement.Type }}</td>
              <td>{{ announcement.Title }}</td>
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
  name: 'CourseAnnouncementView',
  setup() {
    const announcements = ref([]);
    const route = useRoute();
    const router = useRouter();

    const filters = ref({
      id: route.query.id || '',
      type: route.query.type || '',
      date: route.query.date || '',
    });

    const fetchAnnouncements = async () => {
      try {
        const params = new URLSearchParams();
        Object.entries(filters.value).forEach(([key, value]) => {
          if (value?.trim()) {
            params.append(key, value.trim());
          }
        });

        const response = await axios.get(
          `${process.env.VUE_APP_API_URL}/api/course-announcement?${params}`
        );
        announcements.value = response.data;
      } catch (error) {
        console.error('Error:', error);
      }
    };

    const searchAnnouncements = () => {
      const cleanedFilters = Object.fromEntries(
        Object.entries(filters.value).filter(([, value]) => value.trim())
      );

      router.push({ query: cleanedFilters });
      fetchAnnouncements();
    };

    const resetFilters = () => {
      filters.value = {
        id: '',
        type: '',
        date: '',
      };
      router.push({ query: {} });
      fetchAnnouncements();
    };

    onMounted(() => {
      fetchAnnouncements();
    });

    return {
      announcements,
      filters,
      searchAnnouncements,
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
