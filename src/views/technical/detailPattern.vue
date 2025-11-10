<template>
    <Fluid>
        <div class="flex flex-col md:flex-row gap-8">

            <div class="md:w-2/3 flex flex-col gap-6">
                <!-- Tyre Specifications -->
                <div class="card flex flex-col gap-6 w-full">
                    <div class="flex items-center justify-between border-b pb-2">
                        <h2 class="text-2xl font-bold text-gray-800">Pattern Details</h2>
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                        <img 
                        v-if="patterns"
                        :src="getImagePath(patterns.processedImageURL)" 
                        alt="Pattern Image" 
                        class="w-16 h-16 object-contain rounded-md shadow-sm border border-gray-200 cursor-pointer hover:scale-105 transition-transform" 
                        />
                        <div v-else class="w-16 h-16 flex items-center justify-center bg-gray-100 rounded-md border border-gray-200 text-gray-400 text-xs">
                            No Image
                        </div>
                        </div>
                        <div  v-if="patterns">
                            <span class="text-sm font-bold text-gray-700">Pattern Code</span>
                            <p class="text-lg font-medium">{{ patterns.pattern_code }}</p>
                        </div>
                        <div  v-if="patterns">
                            <span class="text-sm font-bold text-gray-700">Pattern Name</span>
                            <p class="text-lg font-medium">{{ patterns.pattern_name }}"</p>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </Fluid>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import api from '@/service/api';
import Button from 'primevue/button';

const showRejectReason = ref(false);
const rejectReason = ref('');
const warantyDetail = ref({});
const loading = ref(true);
const route = useRoute();
const patterns = ref();

const processCatalogueImages = async (item) => {
    if (item.image_url && typeof item.image_url === 'string') {
        try {
            console.log('Processing private image:', item.image_url);
            const blobUrl = await api.getPrivateFile(item.image_url); // call your function
            return {
                ...item,
                processedImageURL: blobUrl || `/${item.image_url}` // fallback to public path
            };
        } catch (error) {
            console.error(`Error loading catalogue image for ${item.pattern_name}:`, error);
            return {
                ...item,
                processedImageURL: `/${item.image_url}`
            };
        }
    } else {
        return {
            ...item,
            processedImageURL: ''
        };
    }
};

const getImagePath = (path) => {
    if (!path) return '';
    return path.replace(/^public\//, '/');
};
onMounted(async () => {
    try {
        loading.value = true;
        const id = route.params.id;
        const response = await api.get(`patternDetail/${id}`);

        if (response.data.status === 1 && (response.data.material_pattern)) {

            const processedItem = await processCatalogueImages(response.data.material_pattern);
            patterns.value = processedItem;
            console.log('API Response:',patterns.value);

        } else {
            console.error('API returned error or invalid data:', response.data);
            patterns.value = [];
        }
    } catch (error) {
        console.error('Error fetching Pattern list:', error);
        patterns.value = [];
    } finally {
        loading.value = false;
    }
});
</script>
