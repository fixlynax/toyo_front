<template>
    <Fluid>
        <div class="flex flex-col md:flex-row gap-8">
            <!-- LEFT SIDE (2/3) -->
            <div class="md:w-2/3 flex flex-col">
                <!-- Detail Warranty -->
                <div class="card flex flex-col w-full">
                    <div class="flex items-center justify-between border-b pb-2">
                        <div class="flex items-center gap-3">
                            <RouterLink to="/marketing/listWarrantyRegistration">
                                <Button icon="pi pi-arrow-left" class="p-button-text p-button-secondary text-xl" size="big" v-tooltip="'Back'" />
                            </RouterLink>
                            <div class="text-2xl font-bold text-gray-800">Detail Warranty Registration</div>
                        </div>
                        <div class="inline-flex items-center gap-2"></div>
                    </div>
                    <div class="mt-4">
                        <!-- Warranty Info -->
                        <div class="mt-6">
                            <span class="block text-lg font-bold text-black-700">Warranty Cert No</span>
                            <p class="text-lg font-medium">{{ Warranty.desc }}</p>
                        </div>
                    </div>
                </div>

                <div class="card flex flex-col w-full">
                    <div class="flex items-center justify-between border-b pb-2 mb-4">
                        <div class="flex items-center gap-3">
                            <div class="text-2xl font-bold text-gray-800">Vehicle Details</div>
                        </div>
                        <div class="inline-flex items-center gap-2"></div>
                    </div>
                    <div class="grid grid-cols-2 md:grid-cols-2 gap-4">
                        <div class="w-full">
                            <span class="block text-xm font-bold text-black-700">Vehicle Plate No</span>
                            <p class="text-lg font-medium">{{ Warranty.startDate }}</p>
                        </div>
                        <div class="w-full">
                            <span class="block text-xm font-bold text-black-700">Vehicle Type</span>
                            <p class="text-lg font-medium">{{ Warranty.endDate }}</p>
                        </div>
                        <div class="w-full">
                            <span class="block text-xm font-bold text-black-700">Vehicle Brand</span>
                            <p class="text-lg font-medium">{{ Warranty.startDate }}</p>
                        </div>
                        <div class="w-full">
                            <span class="block text-xm font-bold text-black-700">Vehicle Model</span>
                            <p class="text-lg font-medium">{{ Warranty.endDate }}</p>
                        </div>
                        <div class="w-full">
                            <span class="block text-xm font-bold text-black-700">Mileage Photo</span>
                            <p class="text-lg font-medium">{{ Warranty.startDate }}</p>
                        </div>
                        <div class="w-full">
                            <span class="block text-xm font-bold text-black-700">Purchase Date</span>
                            <p class="text-lg font-medium">{{ Warranty.endDate }}</p>
                        </div>
                    </div>
                </div>
                <div class="card flex flex-col w-full">
                    <div class="flex items-center justify-between border-b pb-2 mb-4">
                        <div class="flex items-center gap-3">
                            <div class="text-2xl font-bold text-gray-800">Tyre Details</div>
                        </div>
                        <div class="inline-flex items-center gap-2"></div>
                    </div>
                    <div class="grid grid-cols-2 md:grid-cols-2 gap-4">
                        <div class="w-full">
                            <span class="block text-xm font-bold text-black-700">Tyre List</span>
                            <p class="text-lg font-medium">{{ Warranty.startDate }}</p>
                        </div>
                        <div class="w-full">
                            <span class="block text-xm font-bold text-black-700">Tyre Pattern</span>
                            <p class="text-lg font-medium">{{ Warranty.endDate }}</p>
                        </div>
                        <div class="w-full">
                            <span class="block text-xm font-bold text-black-700">Tyre Size</span>
                            <p class="text-lg font-medium">{{ Warranty.startDate }}</p>
                        </div>
                        <div class="w-full">
                            <span class="block text-xm font-bold text-black-700">Tyre Description</span>
                            <p class="text-lg font-medium">{{ Warranty.endDate }}</p>
                        </div>
                        <div class="w-full">
                            <span class="block text-xm font-bold text-black-700">Serial Plate No</span>
                            <p class="text-lg font-medium">{{ Warranty.startDate }}</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- RIGHT SIDE (1/3) -->
            <div class="md:w-1/3 flex flex-col">
                <!-- Advance Info -->
                <div class="card flex flex-col w-full">
                    <div class="flex items-center justify-between border-b pb-2 mb-2">
                        <div class="text-2xl font-bold text-gray-800">ℹ️ User Details</div>
                        <Tag :value="Warranty.status === 1 ? 'Active' : 'Inactive'" :severity="Warranty.status === 1 ? 'success' : 'danger'" />
                    </div>

                    <div class="overflow-x-auto">
                        <table class="w-full text-sm text-left text-gray-700">
                            <tbody>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">TC member no</td>
                                    <td class="px-4 py-2 text-right">{{ Warranty.publishDate }}</td>
                                </tr>
                                <!-- <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Audience</td>
                                    <td class="px-4 py-2 text-right">{{ Warranty.audience }}</td>
                                </tr> -->
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Member Name</td>
                                    <td class="px-4 py-2 text-right">{{ Warranty.view }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Member Phone Number</td>
                                    <td class="px-4 py-2 text-right">{{ Warranty.isSurvey }}</td>
                                </tr>
                                <tr v-if="Warranty.isSurvey === 'Yes'" class="border-b">
                                    <td class="px-4 py-2 font-medium">Member email</td>
                                    <td class="px-4 py-2 text-right">{{ Warranty.point1 }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div class="card flex flex-col w-full">
                    <div class="flex items-center justify-between border-b pb-2 mb-4">
                        <div class="text-2xl font-bold text-gray-800">ℹ️ Invoice Details</div>
                        <Tag :value="Warranty.status === 1 ? 'Active' : 'Inactive'" :severity="Warranty.status === 1 ? 'success' : 'danger'" />
                    </div>

                    <div class="flex-1">
                        <table class="w-full text-sm text-left text-gray-700">
                            <tbody>
                                <tr class="border-b">
                                    <td class="px-4 py-3 font-medium text-gray-600">Tyre Purchase Date</td>
                                    <td class="px-4 py-3 text-right font-semibold text-gray-800">{{ Warranty.publishDate }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-3 font-medium text-gray-600">Invoice Number</td>
                                    <td class="px-4 py-3 text-right font-semibold text-gray-800">{{ Warranty.view }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-3 font-medium text-gray-600">Amount</td>
                                    <td class="px-4 py-3 text-right font-semibold text-gray-800">{{ Warranty.isSurvey }}</td>
                                </tr>
                                <tr v-if="Warranty.point1">
                                    <td class="px-4 py-3 font-medium text-gray-600 align-top">Invoice Photo</td>
                                    <td class="px-4 py-3 text-right">
                                        <!-- Display image if Warranty.point1 contains image URL/path -->
                                        <div class="flex justify-end">
                                            <div class="max-w-xs border border-gray-200 rounded-lg overflow-hidden shadow-sm bg-white">
                                                <img :src="Warranty.point1" alt="Invoice Photo" class="w-full h-auto object-contain max-h-64" @error="handleImageError" />
                                                <div class="px-3 py-2 bg-gray-50 border-t border-gray-100 text-xs text-gray-500 text-center">
                                                    <a :href="Warranty.point1" target="_blank" class="text-blue-600 hover:text-blue-800 hover:underline font-medium"> View Full Size </a>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
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
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm'; // Added
import api from '@/service/api';

const route = useRoute();
const router = useRouter();
const toast = useToast();
const confirm = useConfirm(); // Added

const WarrantyId = route.params.id;
const loading = ref(true);
// Removed: const deleteDialog = ref(false);

// Warranty data
const Warranty = ref({
    id: null,
    audience: '',
    isSurvey: 'No',
    point1: 0,
    point2: 0,
    point3: 0,
    title: '',
    image1URL: '',
    image2URL: '',
    image3URL: '',
    desc: '',
    location: '',
    publishDate: '',
    startDate: '',
    endDate: '',
    view: 0,
    status: 0
});

const surveyQuestions = ref([]);
const participants = ref([]);

// Fetch Warranty details
const fetchWarrantyDetails = async () => {
    try {
        loading.value = true;
        const response = await api.get(`warranty_registration/normal`);

        if (response.data.status === 1) {
            const WarrantyData = response.data.admin_data;

            // Update Warranty data
            Warranty.value = {
                ...Warranty.value,
                ...WarrantyData
            };

            // Handle survey questions
            if (WarrantyData.survey_questions && WarrantyData.survey_questions.length > 0) {
                surveyQuestions.value = WarrantyData.survey_questions[0] || [];
            }

            // Handle participants
            if (WarrantyData.participants) {
                participants.value = WarrantyData.participants;
            }

            // Process private images
            await processPrivateImages();
        } else {
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to load Warranty details',
                life: 3000
            });
        }
    } catch (error) {
        console.error('Error fetching Warranty details:', error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load Warranty details',
            life: 3000
        });
    } finally {
        loading.value = false;
    }
};

// Process private images using the API method
const processPrivateImages = async () => {
    const imageFields = ['image1URL', 'image2URL', 'image3URL'];

    for (const field of imageFields) {
        if (Warranty.value[field] && typeof Warranty.value[field] === 'string') {
            try {
                const blobUrl = await api.getPrivateFile(Warranty.value[field]);
                if (blobUrl) {
                    Warranty.value[field] = blobUrl;
                }
            } catch (error) {
                console.error(`Error loading image ${field}:`, error);
                // Keep the original URL if private file loading fails
            }
        }
    }
};

onMounted(() => {
    fetchWarrantyDetails();
});
</script>
