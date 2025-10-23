<template>
  <Fluid>
    <div v-if="loading" class="text-center py-20 text-gray-500 text-lg">
      Loading news details...
    </div>

    <div v-else-if="error" class="text-center py-20 text-red-500 text-lg">
      {{ error }}
    </div>

    <div v-else class="flex flex-col md:flex-row gap-8">
      <!-- LEFT CONTENT -->
      <div class="md:w-2/3">
        <div class="card flex flex-col gap-6 w-full">
          <!-- HEADER -->
          <div class="flex items-center justify-between border-b pb-2">
            <div class="flex items-center gap-3">
              <RouterLink to="/marketing/listNews">
                <Button icon="pi pi-arrow-left" class="p-button-text p-button-secondary text-xl" size="big" v-tooltip="'Back'" />
              </RouterLink>
              <div class="text-2xl font-bold text-gray-800">Details News</div>
            </div>

            <div class="inline-flex items-center gap-2">
              <RouterLink :to="`/marketing/editNews/${news.id}`">
                <Button label="Edit" class="p-button-info" size="small" />
              </RouterLink>
              <Button label="Delete" class="p-button-danger" size="small" />
            </div>
          </div>

          <!-- IMAGES -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <img v-if="imageSrcs.image1" :src="imageSrcs.image1" alt="News Image 1" class="rounded-xl shadow-sm object-cover w-full h-40" />
            <img v-if="imageSrcs.image2" :src="imageSrcs.image2" alt="News Image 2" class="rounded-xl shadow-sm object-cover w-full h-40" />
            <img v-if="imageSrcs.image3" :src="imageSrcs.image3" alt="News Image 3" class="rounded-xl shadow-sm object-cover w-full h-40" />
          </div>

          <!-- INFO -->
          <div class="mt-6">
            <h1 class="text-2xl font-bold text-gray-800">{{ news.title }}</h1>
            <p class="text-lg font-medium">{{ news.description }}</p>
          </div>
        </div>
      </div>

      <!-- RIGHT SIDEBAR -->
      <div class="md:w-1/3 flex flex-col">
        <div class="card flex flex-col w-full">
          <div class="flex items-center justify-between border-b pb-2 mb-2">
            <div class="text-2xl font-bold text-gray-800">ℹ️ Advance Info</div>
            <Tag :value="statusLabel(news.status)" :severity="statusSeverity(news.status)" />
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-sm text-left text-gray-700">
              <tbody>
                <tr class="border-b">
                  <td class="px-4 py-2 font-medium">Published</td>
                  <td class="px-4 py-2 text-right">{{ news.publishDate }}</td>
                </tr>
                <tr class="border-b">
                  <td class="px-4 py-2 font-medium">Audience</td>
                  <td class="px-4 py-2 text-right">{{ news.audience }}</td>
                </tr>
                <tr class="border-b">
                  <td class="px-4 py-2 font-medium">Total View</td>
                  <td class="px-4 py-2 text-right">{{ news.view }}</td>
                </tr>
                <tr class="border-b">
                  <td class="px-4 py-2 font-medium">Start Date</td>
                  <td class="px-4 py-2 text-right">{{ news.startDate }}</td>
                </tr>
                <tr class="border-b">
                  <td class="px-4 py-2 font-medium">End Date</td>
                  <td class="px-4 py-2 text-right">{{ news.endDate }}</td>
                </tr>
                <tr class="border-b">
                  <td class="px-4 py-2 font-medium">Created</td>
                  <td class="px-4 py-2 text-right">{{ news.created_at }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </Fluid>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import api from '@/service/api';

const route = useRoute();
const news = ref(null);
const loading = ref(true);
const error = ref(null);
const imageSrcs = ref({
  image1: null,
  image2: null,
  image3: null,
});

const fetchNewsDetails = async () => {
  try {
    const id = route.params.id;
    const response = await api.get(`news/details/${id}`);
    if (response.data.status === 1) {
      news.value = response.data.admin_data;

      // Fetch images that require authentication
      imageSrcs.value.image1 = await fetchPrivateImage(news.value.image1URL);
      imageSrcs.value.image2 = await fetchPrivateImage(news.value.image2URL);
      imageSrcs.value.image3 = await fetchPrivateImage(news.value.image3URL);
    } else {
      error.value = 'News not found.';
    }
  } catch (err) {
    error.value = 'Failed to load news details.';
    console.error(err);
  } finally {
    loading.value = false;
  }
};

onMounted(fetchNewsDetails);

// Tag helper functions
const statusLabel = (status) => {
  if (status === 0) return 'Draft';
  if (status === 1) return 'Published';
  if (status === 2) return 'Unpublished';
  return 'Unknown';
};

const statusSeverity = (status) => {
  if (status === 0) return 'info';
  if (status === 1) return 'success';
  if (status === 2) return 'warn';
  return 'secondary';
};

const fetchPrivateImage = async (url) => {
  if (!url) return null;

  try {
    return await api.getPrivateFile(url);
  } catch (error) {
    console.error('Error loading image:', error);
    return null;
  }
};
</script>

