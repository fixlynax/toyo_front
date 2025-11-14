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
                                <Button label="Delete" class="p-button-danger" size="small" @click="confirmDelete" />
                            </div>
                        </div>

                        <!-- Loading State -->
                        <!-- <div v-if="loading" class="flex justify-center items-center py-12">
                            <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="4" />
                        </div> -->

                        <LoadingPage v-if="loading" :message="'Loading News...'" :sub-message="'Fetching list announcements'" />

                        <!-- Error State -->
                        <div v-else-if="error" class="text-center py-12 text-red-600">
                            <i class="pi pi-exclamation-triangle text-4xl mb-4"></i>
                            <p class="text-lg">Failed to load sales program data</p>
                            <Button label="Retry" class="p-button-outlined p-button-danger mt-4" @click="fetchSalesProgram" />
                        </div>

                        <!-- Content -->
                        <!-- In your template, update the image section -->
                        <div v-else class="grid grid-cols-1 gap-4 mt-4">
                            <img :src="salesProgram.imageUrl" :alt="salesProgram.title" class="rounded-xl shadow-sm object-cover w-full h-80" @error="handleImageError" v-if="salesProgram.imageUrl" />
                            <div v-else class="rounded-xl shadow-sm w-full h-80 bg-gray-200 flex items-center justify-center">
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
                        <!-- <div class="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
                            <i class="pi pi-tags text-white text-lg"></i>
                        </div> -->
                        <div>
                            <div class="text-2xl font-bold text-black-800">🎯 FOC Promotion Criteria</div>
                            <div class="text-sm text-black-600 mt-1">Total {{ criteriaList.length }} criteria patterns</div>
                        </div>
                    </div>
                    <div class="flex items-center gap-3">
                        <div class="text-right">
                            <div class="text-sm font-medium text-black-600">Program Status</div>
                            <Tag :value="salesProgram.status === 1 ? 'Active' : 'Inactive'" :severity="salesProgram.status === 1 ? 'success' : 'danger'" class="font-semibold" />
                        </div>
                    </div>
                </div>

                <!-- Promotion Summary Card -->

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
                <div class="border-t pt-6">
                    <div class="flex items-center justify-between mb-6">
                        <div>
                            <h3 class="text-xl font-bold text-black-800">🎨 Eligible Patterns</h3>
                            <p class="text-sm text-black-600 mt-1">Tire patterns that qualify for this promotion</p>
                        </div>
                        <Badge :value="`${criteriaList.length} patterns`" severity="info" />
                    </div>

                    <div v-if="criteriaList.length" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        <div v-for="(criteria, criteriaIndex) in criteriaList" :key="criteria.id" class="border border-black-200 rounded-xl p-5 bg-white shadow-sm hover:shadow-md transition-all duration-300 hover:border-blue-300">
                            <div class="flex items-start justify-between mb-4">
                                <div class="flex items-center gap-3">
                                    <div>
                                        <h4 class="font-bold text-black-800">Pattern {{ criteriaIndex + 1 }}</h4>
                                    </div>
                                </div>
                                <div class="flex flex-col items-end gap-1">
                                    <Tag :value="criteria.status === 1 ? 'Active' : 'Inactive'" :severity="criteria.status === 1 ? 'success' : 'danger'" class="text-xs" />
                                </div>
                            </div>

                            <div class="space-y-3">
                                <div class="flex items-center justify-between text-xm">
                                    <span class="text-black-600">Pattern Code:</span>
                                    <span class="font-mono font-semibold text-black-800">{{ criteria.pattern }}</span>
                                </div>
                                <div class="flex items-center justify-between text-xm">
                                    <span class="text-black-600">Pattern Name:</span>
                                    <span class="font-semibold text-black-800">{{ criteria.pattern_name }}</span>
                                </div>
                                <div class="flex items-center justify-between text-xm">
                                    <span class="text-black-600">Rim Size:</span>
                                    <span class="font-semibold text-blue-600">{{ criteria.size }}"</span>
                                </div>
                            </div>

                            <div class="mt-4 pt-3 border-t border-black-100 text-xm text-black-500">
                                <div class="flex justify-between">
                                    <span>Created:</span>
                                    <span>{{ formatDateTime(criteria.created) }}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div v-else class="text-center py-12 border-2 border-dashed border-black-300 rounded-xl bg-black-50">
                        <i class="pi pi-inbox text-5xl text-black-300 mb-4"></i>
                        <p class="text-lg font-medium text-black-500 mb-2">No Criteria Patterns</p>
                        <p class="text-sm text-black-400 max-w-md mx-auto">No tire patterns have been added to this promotion yet. Add patterns to define which tires qualify for this FOC offer.</p>
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
const salesProgram = ref({});
const criteriaList = ref([]);

// Process private images using the API method
// const processPrivateImages = async () => {
//     const imageFields = ['imageUrl'];
    
//     const imageProcessingPromises = imageFields.map(async (field) => {
//         if (!salesProgram.value[field] || typeof salesProgram.value[field] !== 'string') {
//             salesProgram.value[field] = '/demo/images/event-toyo-2.jpg';
//             return;
//         }

//         if (salesProgram.value[field].startsWith('http') || salesProgram.value[field].startsWith('/')) {
//             return;
//         }

//         try {
//             const blobUrl = await api.getPrivateFile(salesProgram.value[field]);
//             salesProgram.value[field] = blobUrl || '/demo/images/event-toyo-2.jpg';
//         } catch (error) {
//             console.error(`Error loading image ${field}:`, error);
//             salesProgram.value[field] = '/demo/images/event-toyo-2.jpg';
//         }
//     });

//     await Promise.all(imageProcessingPromises);
// };
const fetchSalesProgram = async () => {
    loading.value = true;
    error.value = false;

    try {
        const response = await api.get(`sales-program/detail-sales-program/${programId.value}`);

        // More robust data validation
        if (!response.data?.admin_data?.[0]) {
            throw new Error('No sales program data found');
        }

        const programData = response.data.admin_data[0];
        salesProgram.value = programData;
        criteriaList.value = programData.salesProgramFOC || [];

        await processPrivateImages();

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

const handleImageError = (event) => {
    event.target.src = '/demo/images/event-toyo-2.jpg'; // Fallback image
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

const confirmDelete = () => {
    // Implement delete confirmation logic here
    showToast('warn', 'Delete', 'Delete functionality to be implemented');
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
