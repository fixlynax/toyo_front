<template>
    <Fluid>
        <div class="flex flex-col gap-8">
            <!-- Toast Notification -->
            <Toast />

            <!-- TOP SECTION: Detail Event + Advance Info -->
            <div class="flex flex-col md:flex-row gap-8">
                <!-- LEFT SIDE (2/3) -->
                <div class="md:w-2/3 flex flex-col">
                    <div class="card flex flex-col w-full">
                        <div class="flex items-center justify-between border-b pb-2">
                            <div class="flex items-center gap-2">
                                <RouterLink to="/om/listSalesProgram">
                                    <Button icon="pi pi-arrow-left font-bold" class="p-button-text p-button-secondary text-xl" size="big" v-tooltip="'Back'" />
                                </RouterLink>
                                <div class="text-2xl font-bold text-black-800">Sales Program Detail</div>
                            </div>
                            <div class="inline-flex items-center gap-2">
                                <RouterLink :to="`/om/editSalesProgram/${programId}`">
                                    <Button label="Edit" class="p-button-info" size="small" />
                                </RouterLink>
                            </div>
                        </div>

                        <LoadingPage v-if="loading" :message="'Loading Sales Program...'" :sub-message="'Fetching program details'" />

                        <!-- Error State -->
                        <div v-else-if="error" class="text-center py-12 text-red-600">
                            <i class="pi pi-exclamation-triangle text-4xl mb-4"></i>
                            <p class="text-lg">Failed to load sales program data</p>
                            <Button label="Retry" class="p-button-outlined p-button-danger mt-4" @click="fetchSalesProgram" />
                        </div>

                        <!-- Content -->
                        <div v-else class="grid grid-cols-1 gap-4 mt-4">
                            <img :src="salesProgram.imageUrl" :alt="salesProgram.title" class="rounded-xl shadow-sm object-cover w-full h-80" @error="handleImageError" v-if="salesProgram.imageUrl && !imageLoading" />
                            <div v-if="imageLoading" class="rounded-xl shadow-sm w-full h-80 bg-gray-200 flex items-center justify-center">
                                <i class="pi pi-spin pi-spinner text-4xl text-gray-400"></i>
                            </div>
                            <div v-else-if="!salesProgram.imageUrl" class="rounded-xl shadow-sm w-full h-80 bg-gray-200 flex items-center justify-center">
                                <i class="pi pi-image text-4xl text-gray-400"></i>
                            </div>
                        </div>

                        <div v-if="!loading && !error" class="mt-6">
                            <h1 class="text-2xl font-bold text-black-800">{{ salesProgram.title }}</h1>
                            <p class="text-lg font-medium text-black-600">{{ salesProgram.desc }}</p>

                            <div class="flex flex-col md:flex-row gap-4 mt-3">
                                <div class="w-full">
                                    <span class="block text-sm font-bold text-black-700">Start Date</span>
                                    <p class="text-lg font-medium">{{ formatDate(salesProgram.startDate) }}</p>
                                </div>
                                <div class="w-full">
                                    <span class="block text-sm font-bold text-black-700">End Date</span>
                                    <p class="text-lg font-medium">{{ formatDate(salesProgram.endDate) }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- RIGHT SIDE - Simplified Advance Info -->
                <div class="md:w-1/3 flex flex-col">
                    <div class="card flex flex-col w-full">
                        <div class="flex items-center justify-between border-b pb-2 mb-2">
                            <div class="text-2xl font-bold text-black-800">ℹ️ Advance Info</div>
                            <Tag :value="salesProgram.status === 1 ? 'Active' : 'Inactive'" :severity="salesProgram.status === 1 ? 'success' : 'danger'" />
                        </div>

                        <div v-if="!loading && !error" class="overflow-x-auto">
                            <table class="w-full text-sm text-left text-black-700">
                                <tbody>
                                    <tr class="border-b">
                                        <td class="px-4 py-2 font-medium">Program No</td>
                                        <td class="px-4 py-2 text-right font-semibold">{{ salesProgram.programid }}</td>
                                    </tr>
                                    <tr class="border-b">
                                        <td class="px-4 py-2 font-medium">Type</td>
                                        <td class="px-4 py-2 text-right">
                                            <span class="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                                                {{ salesProgram.type }}
                                            </span>
                                        </td>
                                    </tr>
                                    <tr class="border-b">
                                        <td class="px-4 py-2 font-medium">Price Group</td>
                                        <td class="px-4 py-2 text-right font-semibold">{{ salesProgram.pricegroup }}</td>
                                    </tr>
                                    <tr class="border-b">
                                        <td class="px-4 py-2 font-medium">Availability </td>
                                        <td class="px-4 py-2 text-right">{{ salesProgram.showSP === 1 ? 'Yes' : 'No' }}</td>
                                    </tr>
                                    <tr class="border-b">
                                        <td class="px-4 py-2 font-medium">Created</td>
                                        <td class="px-4 py-2 text-right">{{ formatDateTime(salesProgram.created) }}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <!-- ✅ ENHANCED FOC CRITERIA SECTION -->
            <div v-if="!loading && !error && salesProgram.type === 'FOC'" class="card flex flex-col w-full">
                <div class="flex items-center justify-between border-b pb-4 mb-6">
                    <div class="flex items-center gap-3">
                        <div>
                            <div class="text-2xl font-bold text-black-800">🎯 FOC Promotion Criteria</div>
                        </div>
                    </div>
                    <!-- <div class="flex items-center gap-3">
                        <div class="text-right">
                            <Tag :value="salesProgram.status === 1 ? 'Active' : 'Inactive'" :severity="salesProgram.status === 1 ? 'success' : 'danger'" class="font-semibold" />
                        </div>
                    </div> -->
                </div>

                <!-- Free Material Information -->
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    <!-- Free Material Details -->
                    <div class="border border-black-200 rounded-xl p-5 bg-white shadow-sm">
                        <div class="flex items-center gap-3 mb-4">
                            <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                <i class="pi pi-box text-green-600 text-lg"></i>
                            </div>
                            <div>
                                <h3 class="font-semibold text-black-800 text-lg">Free Material Details</h3>
                                <p class="text-sm text-black-600">Item provided as free gift</p>
                            </div>
                        </div>
                        <div class="space-y-3">
                            <div class="flex justify-between items-center py-2 border-b border-black-100">
                                <span class="text-xm font-medium text-black-600">Material Code</span>
                                <span class="text-xm font-semibold text-black-800 bg-green-50 px-3 py-1 rounded">{{ salesProgram.free_material }}</span>
                            </div>
                            <div class="flex justify-between items-center py-2 border-b border-black-100">
                                <span class="text-xm font-medium text-black-600">Quota</span>
                                <span class="text-xm font-bold text-black-800 bg-green-50 px-3 py-1 rounded">{{ salesProgram.freeQuota }}</span>
                            </div>
                            <div class="flex justify-between items-start py-2">
                                <span class="text-xm font-medium text-black-600">Description</span>
                                <span class="text-xm text-black-800 text-right max-w-xs">{{ salesProgram.free_material_desc }}</span>
                            </div>
                        </div>
                    </div>

                    <!-- Promotion Rule Summary -->
                    <div class="border border-black-200 rounded-xl p-5 bg-white shadow-sm">
                        <div class="flex items-center gap-3 mb-4">
                            <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <i class="pi pi-info-circle text-blue-600 text-lg"></i>
                            </div>
                            <div>
                                <h3 class="font-semibold text-black-800 text-lg">Promotion Rule</h3>
                                <p class="text-sm text-black-600">Buy X Get Y Free</p>
                            </div>
                        </div>
                        <div class="text-center py-4">
                            <div class="flex items-center justify-center gap-4 mb-3">
                                <div class="bg-blue-500 text-white px-4 py-3 rounded-lg shadow-md">
                                    <div class="text-2xl font-bold">{{ salesProgram.buyQty }}</div>
                                    <div class="text-xs">BUY</div>
                                </div>
                                <div class="text-2xl text-black-400">→</div>
                                <div class="bg-green-500 text-white px-4 py-3 rounded-lg shadow-md">
                                    <div class="text-2xl font-bold">{{ salesProgram.freeQty }}</div>
                                    <div class="text-xs">GET FREE</div>
                                </div>
                            </div>
                            <p class="text-sm text-black-600">
                                For every <span class="font-semibold text-blue-600">{{ salesProgram.buyQty }}</span> items purchased, get <span class="font-semibold text-green-600">{{ salesProgram.freeQty }}</span> items free
                            </p>
                        </div>
                    </div>
                </div>

                <!-- Criteria Patterns List -->
                <div class="border border-black-200 rounded-xl p-5 pt-6">
                    <div class="flex items-center justify-between mb-6">
                        <div>
                            <h3 class="text-xl font-bold text-black-800">🎨 Eligible Materials</h3>
                            <p class="text-sm text-black-600 mt-1">Materials that qualify for this promotion</p>
                        </div>
                        <Tag :value="`${criteriaList.length} materials`" severity="info" />
                    </div>

                    <div v-if="criteriaList.length" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                        <div v-for="(criteria, criteriaIndex) in criteriaList" :key="criteria.id" class="border border-black-200 rounded-xl p-5 bg-white shadow-sm hover:shadow-md transition-all duration-300 hover:border-blue-300">
                            <div class="flex items-start justify-between">
                                <div class="flex items-center gap-4">
                                    <div>
                                        <h4 class="font-bold text-primary">{{ criteria.materialid }}</h4>
                                    </div>
                                </div>
                            </div>

                            <div class="space-y-3">
                                <div class="flex items-center justify-between text-xm">
                                    <span class="text-black-600">Material Description:</span>
                                    <span class="font-mono font-semibold text-black-800">{{ criteria.materialdesc }}</span>
                                </div>
                                <!-- You can add more material details here if available from API -->
                            </div>
                        </div>
                    </div>

                    <div v-else class="text-center py-12 border-2 border-dashed border-black-300 rounded-xl bg-black-50">
                        <i class="pi pi-inbox text-5xl text-black-300 mb-4"></i>
                        <p class="text-lg font-medium text-black-500 mb-2">No Criteria Materials</p>
                        <p class="text-sm text-black-400 max-w-md mx-auto">No materials have been added to this promotion yet. Add materials to define which items qualify for this FOC offer.</p>
                    </div>
                </div>
            </div>
        </div>
    </Fluid>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import api from '@/service/api';
import LoadingPage from '@/components/LoadingPage.vue';

const route = useRoute();
const router = useRouter();
const toast = useToast();

const programId = ref(route.params.id);
const loading = ref(false);
const error = ref(false);
const imageLoading = ref(false);
const salesProgram = ref({});
const criteriaList = ref([]);

// Enhanced image processing function
const processPrivateImages = async (programData) => {
    // If no image or image is null, set placeholder and return
    if (!programData || !programData.image) {
        programData.imageUrl = 'https://via.placeholder.com/800x400?text=No+Image+Available';
        return programData;
    }

    const imageUrl = programData.image;

    // If it's already a blob URL or data URL, return as is
    if (imageUrl.startsWith('blob:') || imageUrl.startsWith('data:')) {
        programData.imageUrl = imageUrl;
        return programData;
    }

    // Use getPrivateFile to load the image
    try {
        imageLoading.value = true;
        console.log('Processing private image:', imageUrl);
        const blobUrl = await api.getPrivateFile(imageUrl);
        if (blobUrl) {
            programData.imageUrl = blobUrl;
        } else {
            programData.imageUrl = 'https://via.placeholder.com/800x400?text=Image+Not+Found';
        }
    } catch (error) {
        console.error('Error loading private image:', error);
        programData.imageUrl = 'https://via.placeholder.com/800x400?text=Image+Not+Found';
    } finally {
        imageLoading.value = false;
    }

    return programData;
};

// Enhanced image error handler
const handleImageError = (event) => {
    console.warn('Image failed to load:', event.target.src);
    event.target.src = 'https://via.placeholder.com/800x400?text=Image+Not+Found';
    salesProgram.value.imageUrl = 'https://via.placeholder.com/800x400?text=Image+Not+Found';
};

const fetchSalesProgram = async () => {
    loading.value = true;
    error.value = false;

    try {
        const response = await api.get(`sales-program/detail-sales-program/${programId.value}`);

        // More robust data validation
        if (!response.data?.admin_data?.[0]) {
            throw new Error('No sales program data found');
        }

        let programData = response.data.admin_data[0];

        // Process images BEFORE setting the reactive data
        programData = await processPrivateImages(programData);

        // Now set the reactive data
        salesProgram.value = programData;

        // Map the criteria list to match frontend expectations
        criteriaList.value = programData.salesProgramFOC || [];

        console.log('Loaded sales program:', programData);
        console.log('Criteria list:', criteriaList.value);

        showToast('success', 'Success', 'Sales program data loaded successfully');
    } catch (err) {
        console.error('Error fetching sales program:', err);
        error.value = true;

        const errorMessage = err.response?.data?.message || err.message || 'Failed to load sales program data';
        showToast('error', 'Error', errorMessage);
    } finally {
        loading.value = false;
    }
};

const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return 'N/A';
    return new Date(dateTimeString).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

const showToast = (severity, summary, detail) => {
    toast.add({
        severity,
        summary,
        detail,
        life: 3000
    });
};

onMounted(() => {
    if (!programId.value) {
        showToast('error', 'Error', 'No program ID provided');
        router.push('/om/listSalesProgram');
        return;
    }
    fetchSalesProgram();
});

// Clean up blob URLs to prevent memory leaks
onUnmounted(() => {
    if (salesProgram.value.imageUrl && salesProgram.value.imageUrl.startsWith('blob:')) {
        URL.revokeObjectURL(salesProgram.value.imageUrl);
    }
});
</script>
