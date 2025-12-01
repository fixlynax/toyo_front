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
                        <div class="grid grid-cols-2 md:grid-cols-2 gap-4">

                        <!-- Warranty Info -->
                        <div class="mt-6">
                            <span class="block text-lg font-bold text-black-700">Warranty Cert No</span>
                            <p class="text-lg font-medium">{{ Warranty.warranty_info?.warranty_cert_no  || '-'   }}</p>
                        </div>
                        <div class="mt-6">
                            <span class="block text-lg font-bold text-black-700">Registered Date</span>
                            <p class="text-lg font-medium">{{ Warranty.warranty_info?.date_registered || '-'  }}</p>
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
                            <p class="text-lg font-medium">{{ Warranty.vehicle_info?.vehicle_reg_no || '-' }}</p>
                        </div>
                        <div class="w-full">
                            <span class="block text-xm font-bold text-black-700">Vehicle Type</span>
                            <p class="text-lg font-medium">{{ Warranty.vehicle_info?.vehicle_type || '-' }}</p>
                        </div>
                        <div class="w-full">
                            <span class="block text-xm font-bold text-black-700">Vehicle Brand</span>
                            <p class="text-lg font-medium">{{ Warranty.vehicle_info?.vehicle_brand || '-' }}</p>
                        </div>
                        <div class="w-full">
                            <span class="block text-xm font-bold text-black-700">Vehicle Model</span>
                            <p class="text-lg font-medium">{{ Warranty.vehicle_info?.vehicle_model || '-'}}</p>
                        </div>
                        <div class="w-full">
                            <span class="block text-xm font-bold text-black-700">Mileage </span>
                            <p class="text-lg font-medium">{{ Warranty.vehicle_info?.mileage || '-'}}</p>
                        </div>
                        <div class="w-full">
                            <span class="block text-xm font-bold text-black-700">Purchase Date</span>
                            <p class="text-lg font-medium">{{ Warranty.invoice_info?.purchase_date || '-'}}</p>
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
                    <div :class="['grid', 'gap-4', 'mb-2', 'grid-cols-2 md:grid-cols-4']">
                        <div>
                            <span class="block text-sm font-bold text-black-800">MFG Code</span>

                            <!-- OLD (User) -->
                            <p class="text-lg font-medium mb-2">{{ Warranty.tire_info?.mfgCode || '-' }}</p>
                        </div>
                        <div>
                            <span class="block text-sm font-bold text-black-800">Size Code</span>
                             <p class="text-lg font-medium mb-2">{{ Warranty.tire_info?.tyreSize || '-' }}</p>
                        </div>
                        <div>
                            <span class="block text-sm font-bold text-black-800">Tyre Spec</span>
                            <p class="text-lg font-medium mb-2">{{ Warranty.tire_info?.tyreSpec || '-' }}</p>
                        </div>
                        <div>
                            <span class="block text-sm font-bold text-black-800">Week Code</span>
                            <p class="text-lg font-medium mb-2">{{ Warranty.tire_info?.weekcode || '-'  }}</p>
                        </div>
                        <div class="inline-flex items-center gap-2"></div>
                    </div>
                    <div class="grid grid-cols-2 md:grid-cols-2 gap-4">
                        <div class="w-full">
                            <span class="block text-xm font-bold text-black-700">Tyre Pattern</span>
                            <p class="text-lg font-medium">{{ Warranty.tire_info?.tire_pattern || '-'  }}</p>
                        </div>
                        <div class="w-full">
                            <span class="block text-xm font-bold text-black-700">Tyre Size</span>
                            <p class="text-lg font-medium">{{ Warranty.tire_info?.tire_size || '-'  }}</p>
                        </div>
                        <div class="w-full">
                            <span class="block text-xm font-bold text-black-700">Tyre Description</span>
                            <p class="text-lg font-medium">{{ Warranty.tire_info?.tire_desc || '-'  }}</p>
                        </div>
                        <div class="w-full">
                            <span class="block text-xm font-bold text-black-700">Serial Plate No</span>
                            <p class="text-lg font-medium">{{ Warranty.tire_info?.mfgCode || '-'  }}</p>
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
                                    <td class="px-4 py-2 text-right">{{ Warranty.consumer_info?.membercode || '-' }}</td>
                                </tr>
                                <!-- <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Audience</td>
                                    <td class="px-4 py-2 text-right">{{ Warranty.audience }}</td>
                                </tr> -->
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Member Name</td>
                                    <td class="px-4 py-2 text-right">{{ Warranty.consumer_info?.fullname || '-'}}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Member Phone Number</td>
                                    <td class="px-4 py-2 text-right">{{ Warranty.consumer_info?.phoneNumber || '-' }}</td>
                                </tr>
                                <tr  class="border-b">
                                    <td class="px-4 py-2 font-medium">Member email</td>
                                    <td class="px-4 py-2 text-right">{{ Warranty.consumer_info?.email || '-' }}</td>
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
                                    <td class="px-4 py-3 text-right font-semibold text-gray-800">{{ Warranty.invoice_info?.purchase_date || '-' }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-3 font-medium text-gray-600">Invoice Number</td>
                                    <td class="px-4 py-3 text-right font-semibold text-gray-800"><span  class="text-blue-600 cursor-pointer" @click="viewInvoice(Warranty.invoice_info?.invoice_file)">{{ Warranty.invoice_info?.invoice_no || '-' }}</span></td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-3 font-medium text-gray-600">Amount</td>
                                    <td class="px-4 py-3 text-right font-semibold text-gray-800">{{ Warranty.invoice_info?.invoice_amount || '-' }}</td>
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
const Warranty = ref([]);

const WarrantyId = route.params.id;
const loading = ref(true);
// Removed: const deleteDialog = ref(false);

// Warranty data

const surveyQuestions = ref([]);
const participants = ref([]);

// Fetch Warranty details
const fetchWarrantyDetails = async () => {
    try {
        loading.value = true;
        const id = route.params.id; // e.g. 1

        const response = await api.get(`warranty_registration/normal/${id}`);

        if (response.data.status === 1) {
            Warranty.value = response.data.admin_data;

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
const viewInvoice = async (url) => {
    try {
        const blobUrl = await api.getPrivateFile(url);
        if (!blobUrl) return;
        window.open(blobUrl, '_blank'); // opens preview in new tab
    } catch (error) {
        console.error('Failed to preview file:', error);
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
