<script setup>
import { ref, onMounted, computed } from 'vue';
import api from '@/service/api';
import { useRoute } from 'vue-router';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';

const route = useRoute();
const appointment = ref({});
const loading = ref(true);
const activeImage = ref(null);
const activeImageType = ref('');

// Fetch appointment details
const fetchAppointmentDetail = async () => {
    try {
        const response = await api.get(`appointment/${route.params.id}`);
        console.log('API Response:', response.data);
        
        if (response.data.status === 1) {
            appointment.value = response.data.admin_data;
            console.log('Appointment Info:', appointment.value.appointment_info);
            console.log('Customer Info:', appointment.value.customer_info);
            console.log('Dealer Info:', appointment.value.dealer_info);
            console.log('Tire Info:', appointment.value.tire_info);
            console.log('Submitted Photos:', appointment.value.submitted_photos);
        } else {
            console.warn('Unexpected API response structure:', response.data);
        }
    } catch (error) {
        console.error('Error fetching appointment detail:', error);
    } finally {
        loading.value = false;
    }
};

// Computed properties for conditional checks
const hasSubmittedPhotos = computed(() => {
    return appointment.value.submitted_photos && (
        appointment.value.submitted_photos.mileageFileURL ||
        appointment.value.submitted_photos.serialNoFileURL ||
        appointment.value.submitted_photos.tireSizeFileURL ||
        appointment.value.submitted_photos.defectAreaFileURL
    );
});

const hasTireInfo = computed(() => {
    return appointment.value.tire_info && appointment.value.tire_info.length > 0;
});

const hasCustomerInfo = computed(() => {
    return appointment.value.customer_info && appointment.value.customer_info.length > 0;
});

const hasDealerInfo = computed(() => {
    return appointment.value.dealer_info && appointment.value.dealer_info.length > 0;
});

const appointmentStatusClass = computed(() => {
    const status = appointment.value.appointment_info?.status;
    return {
        'px-3 py-1 rounded-full text-sm font-semibold': true,
        'bg-yellow-100 text-yellow-800': status === 0,
        'bg-green-100 text-green-800': status === 1,
        'bg-red-100 text-red-800': status === 2
    };
});

// Image modal functions
const openImageModal = (imageUrl, imageType) => {
    activeImage.value = imageUrl;
    activeImageType.value = imageType;
};

const closeImageModal = () => {
    activeImage.value = null;
    activeImageType.value = '';
};

// Copy URL to clipboard
const copyToClipboard = async (text) => {
    try {
        await navigator.clipboard.writeText(text);
        // You can add a toast notification here if needed
        console.log('URL copied to clipboard');
    } catch (err) {
        console.error('Failed to copy text: ', err);
    }
};

// Create a blank image data URL for fallback
const createFallbackImage = (text) => {
    const canvas = document.createElement('canvas');
    canvas.width = 300;
    canvas.height = 200;
    const ctx = canvas.getContext('2d');
    
    // Background
    ctx.fillStyle = '#f3f4f6';
    ctx.fillRect(0, 0, 300, 200);
    
    // Border
    ctx.strokeStyle = '#d1d5db';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, 300, 200);
    
    // Text
    ctx.fillStyle = '#6b7280';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(text, 150, 100);
    
    return canvas.toDataURL();
};

// Pre-create fallback images
const fallbackImages = {
    mileage: createFallbackImage('Mileage Image Not Available'),
    serialNo: createFallbackImage('Serial No Image Not Available'),
    tireSize: createFallbackImage('Tire Size Image Not Available'),
    defectArea: createFallbackImage('Defect Area Image Not Available'),
    general: createFallbackImage('Image Not Available')
};

// Handle image errors
const handleImageError = (event, imageType = 'general') => {
    console.log(`Image error for ${imageType}, using fallback`);
    event.target.src = fallbackImages[imageType] || fallbackImages.general;
    event.target.onerror = null; // Prevent infinite loop
};

// Fetch data when component mounts
onMounted(() => {
    fetchAppointmentDetail();
});
</script>

<template>
    <div class="flex flex-col md:flex-row gap-8">
        <!-- LEFT SIDE -->
        <div class="md:w-2/3 flex flex-col gap-6">
            <!-- Appointment Header -->
            <div class="card flex flex-col w-full">
                <div class="flex items-center justify-between border-b pb-2">
                    <div class="flex items-center gap-2">
                        <Button icon="pi pi-arrow-left" class="p-button-text p-button-secondary" @click="$router.back()" />
                        <div class="text-2xl font-bold text-gray-800">Appointment Details</div>
                    </div>
                    <div class="inline-flex items-center gap-2">
                        <span :class="appointmentStatusClass">
                            {{ appointment.appointment_info?.status_string || 'Unknown' }}
                        </span>
                    </div>
                </div>
                
                <!-- Appointment Code -->
                <div class="mt-4 mb-2">
                    <div>
                        <span class="block text-sm font-bold text-black-800">Appointment Code</span>
                        <span class="text-lg font-medium">{{ appointment.appointment_info?.appointmentCode || 'N/A' }}</span>
                    </div>
                </div>
            </div>

            <!-- Customer Information -->
            <div class="card flex flex-col w-full" v-if="hasCustomerInfo">
                <div class="flex items-center justify-between border-b pb-2 mb-4">
                    <div class="text-2xl font-bold text-gray-800">👤 Customer Information</div>
                </div>

                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <span class="block text-sm font-bold text-black-800">Name</span>
                        <p class="text-lg font-medium">{{ appointment.customer_info[0]?.name || 'N/A' }}</p>
                    </div>
                    <div>
                        <span class="block text-sm font-bold text-black-800">Vehicle</span>
                        <p class="text-lg font-medium">{{ appointment.customer_info[0]?.vehicle || 'N/A' }}</p>
                    </div>
                    <div>
                        <span class="block text-sm font-bold text-black-800">Registration No</span>
                        <p class="text-lg font-medium">{{ appointment.customer_info[0]?.regNo || 'N/A' }}</p>
                    </div>
                    <div>
                        <span class="block text-sm font-bold text-black-800">Mobile Number</span>
                        <p class="text-lg font-medium">{{ appointment.customer_info[0]?.mobileNo || 'N/A' }}</p>
                    </div>
                </div>
            </div>

            <!-- Tire Information -->
            <div class="card flex flex-col w-full" v-if="hasTireInfo">
                <div class="flex items-center justify-between border-b pb-2 mb-4">
                    <div class="text-2xl font-bold text-gray-800">🛞 Tire Information</div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div v-for="(tire, index) in appointment.tire_info" :key="index" class="border border-gray-200 rounded-lg p-4 bg-gray-50">
                        <div class="text-lg font-semibold mb-3 text-gray-800">Tire {{ index + 1 }}</div>
                        <div class="grid grid-cols-2 gap-3">
                            <div class="col-span-2">
                                <span class="block text-sm font-bold text-black-800">Pattern</span>
                                <p class="text-base font-medium">{{ tire.pattern || 'N/A' }}</p>
                            </div>
                            <div class="col-span-2">
                                <span class="block text-sm font-bold text-black-800">Size</span>
                                <p class="text-base font-medium">{{ tire.tyresize || 'N/A' }}</p>
                            </div>
                            <div class="col-span-2">
                                <span class="block text-sm font-bold text-black-800">Description</span>
                                <p class="text-base font-medium text-sm">{{ tire.desc || 'N/A' }}</p>
                            </div>
                            <div>
                                <span class="block text-sm font-bold text-black-800">MFG Code</span>
                                <p class="text-base font-medium">{{ tire.mfgcode || 'N/A' }}</p>
                            </div>
                            <div>
                                <span class="block text-sm font-bold text-black-800">Week Code</span>
                                <p class="text-base font-medium">{{ tire.weekcode || 'N/A' }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Submitted Photos -->
            <div class="card flex flex-col w-full" v-if="hasSubmittedPhotos">
                <div class="flex items-center justify-between border-b pb-2 mb-4">
                    <div class="text-2xl font-bold text-gray-800">📸 Submitted Photos</div>
                </div>

                <!-- Photo Grid -->
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                    <!-- Mileage Photo -->
                    <div v-if="appointment.submitted_photos.mileageFileURL" class="text-center">
                        <span class="block text-sm font-bold text-black-800 mb-3">Mileage</span>
                        <div 
                            class="cursor-pointer border-2 border-gray-300 rounded-lg overflow-hidden hover:border-primary-500 transition-all duration-200"
                            @click="openImageModal(appointment.submitted_photos.mileageFileURL, 'Mileage')"
                        >
                            <img 
                                :src="appointment.submitted_photos.mileageFileURL" 
                                alt="Mileage" 
                                class="w-full h-32 object-cover"
                                @error="(e) => handleImageError(e, 'mileage')"
                            />
                        </div>
                        <Button 
                            label="View Full Size" 
                            icon="pi pi-external-link" 
                            class="p-button-text p-button-sm mt-2"
                            @click="openImageModal(appointment.submitted_photos.mileageFileURL, 'Mileage')"
                        />
                    </div>

                    <!-- Serial Number Photo -->
                    <div v-if="appointment.submitted_photos.serialNoFileURL" class="text-center">
                        <span class="block text-sm font-bold text-black-800 mb-3">Serial No</span>
                        <div 
                            class="cursor-pointer border-2 border-gray-300 rounded-lg overflow-hidden hover:border-primary-500 transition-all duration-200"
                            @click="openImageModal(appointment.submitted_photos.serialNoFileURL, 'Serial Number')"
                        >
                            <img 
                                :src="appointment.submitted_photos.serialNoFileURL" 
                                alt="Serial No" 
                                class="w-full h-32 object-cover"
                                @error="(e) => handleImageError(e, 'serialNo')"
                            />
                        </div>
                        <Button 
                            label="View Full Size" 
                            icon="pi pi-external-link" 
                            class="p-button-text p-button-sm mt-2"
                            @click="openImageModal(appointment.submitted_photos.serialNoFileURL, 'Serial Number')"
                        />
                    </div>

                    <!-- Tire Size Photo -->
                    <div v-if="appointment.submitted_photos.tireSizeFileURL" class="text-center">
                        <span class="block text-sm font-bold text-black-800 mb-3">Tire Size</span>
                        <div 
                            class="cursor-pointer border-2 border-gray-300 rounded-lg overflow-hidden hover:border-primary-500 transition-all duration-200"
                            @click="openImageModal(appointment.submitted_photos.tireSizeFileURL, 'Tire Size')"
                        >
                            <img 
                                :src="appointment.submitted_photos.tireSizeFileURL" 
                                alt="Tire Size" 
                                class="w-full h-32 object-cover"
                                @error="(e) => handleImageError(e, 'tireSize')"
                            />
                        </div>
                        <Button 
                            label="View Full Size" 
                            icon="pi pi-external-link" 
                            class="p-button-text p-button-sm mt-2"
                            @click="openImageModal(appointment.submitted_photos.tireSizeFileURL, 'Tire Size')"
                        />
                    </div>

                    <!-- Defect Area Photo -->
                    <div v-if="appointment.submitted_photos.defectAreaFileURL" class="text-center">
                        <span class="block text-sm font-bold text-black-800 mb-3">Defect Area</span>
                        <div 
                            class="cursor-pointer border-2 border-gray-300 rounded-lg overflow-hidden hover:border-primary-500 transition-all duration-200"
                            @click="openImageModal(appointment.submitted_photos.defectAreaFileURL, 'Defect Area')"
                        >
                            <img 
                                :src="appointment.submitted_photos.defectAreaFileURL" 
                                alt="Defect Area" 
                                class="w-full h-32 object-cover"
                                @error="(e) => handleImageError(e, 'defectArea')"
                            />
                        </div>
                        <Button 
                            label="View Full Size" 
                            icon="pi pi-external-link" 
                            class="p-button-text p-button-sm mt-2"
                            @click="openImageModal(appointment.submitted_photos.defectAreaFileURL, 'Defect Area')"
                        />
                    </div>
                </div>

                <!-- File URLs Section -->
                <div class="border-t pt-4">
                    <div class="text-lg font-semibold text-gray-800 mb-3">File URLs</div>
                    <div class="space-y-2">
                        <div v-if="appointment.submitted_photos.mileageFileURL" class="flex items-center gap-2 p-2 bg-gray-50 rounded">
                            <span class="font-medium text-sm min-w-20">Mileage:</span>
                            <a 
                                :href="appointment.submitted_photos.mileageFileURL" 
                                target="_blank" 
                                class="text-primary-600 hover:text-primary-700 text-sm break-all flex-1"
                            >
                                {{ appointment.submitted_photos.mileageFileURL }}
                            </a>
                            <Button 
                                icon="pi pi-copy" 
                                class="p-button-text p-button-sm"
                                @click="copyToClipboard(appointment.submitted_photos.mileageFileURL)"
                                v-tooltip="'Copy URL'"
                            />
                        </div>
                        <div v-if="appointment.submitted_photos.serialNoFileURL" class="flex items-center gap-2 p-2 bg-gray-50 rounded">
                            <span class="font-medium text-sm min-w-20">Serial No:</span>
                            <a 
                                :href="appointment.submitted_photos.serialNoFileURL" 
                                target="_blank" 
                                class="text-primary-600 hover:text-primary-700 text-sm break-all flex-1"
                            >
                                {{ appointment.submitted_photos.serialNoFileURL }}
                            </a>
                            <Button 
                                icon="pi pi-copy" 
                                class="p-button-text p-button-sm"
                                @click="copyToClipboard(appointment.submitted_photos.serialNoFileURL)"
                                v-tooltip="'Copy URL'"
                            />
                        </div>
                        <div v-if="appointment.submitted_photos.tireSizeFileURL" class="flex items-center gap-2 p-2 bg-gray-50 rounded">
                            <span class="font-medium text-sm min-w-20">Tire Size:</span>
                            <a 
                                :href="appointment.submitted_photos.tireSizeFileURL" 
                                target="_blank" 
                                class="text-primary-600 hover:text-primary-700 text-sm break-all flex-1"
                            >
                                {{ appointment.submitted_photos.tireSizeFileURL }}
                            </a>
                            <Button 
                                icon="pi pi-copy" 
                                class="p-button-text p-button-sm"
                                @click="copyToClipboard(appointment.submitted_photos.tireSizeFileURL)"
                                v-tooltip="'Copy URL'"
                            />
                        </div>
                        <div v-if="appointment.submitted_photos.defectAreaFileURL" class="flex items-center gap-2 p-2 bg-gray-50 rounded">
                            <span class="font-medium text-sm min-w-20">Defect Area:</span>
                            <a 
                                :href="appointment.submitted_photos.defectAreaFileURL" 
                                target="_blank" 
                                class="text-primary-600 hover:text-primary-700 text-sm break-all flex-1"
                            >
                                {{ appointment.submitted_photos.defectAreaFileURL }}
                            </a>
                            <Button 
                                icon="pi pi-copy" 
                                class="p-button-text p-button-sm"
                                @click="copyToClipboard(appointment.submitted_photos.defectAreaFileURL)"
                                v-tooltip="'Copy URL'"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- RIGHT SIDE -->
        <div class="md:w-1/3 flex flex-col gap-6">
            <!-- Dealer Information -->
            <div class="card w-full" v-if="hasDealerInfo">
                <div class="flex items-center justify-between border-b pb-2 mb-4">
                    <div class="text-2xl font-bold text-gray-800">🏢 Dealer Information</div>
                </div>

                <div class="grid grid-cols-2 gap-4">
                    <div class="col-span-2">
                        <span class="block text-sm font-bold text-black-800">Customer Account</span>
                        <p class="text-lg font-medium">{{ appointment.dealer_info[0]?.custAccountNo || 'N/A' }}</p>
                    </div>
                    <div class="col-span-2">
                        <span class="block text-sm font-bold text-black-800">Company Name</span>
                        <p class="text-lg font-medium">{{ appointment.dealer_info[0]?.companyName1 || 'N/A' }}</p>
                    </div>
                    <div>
                        <span class="block text-sm font-bold text-black-800">Phone Number</span>
                        <p class="text-lg font-medium">{{ appointment.dealer_info[0]?.phoneNumber || 'N/A' }}</p>
                    </div>
                    <div>
                        <span class="block text-sm font-bold text-black-800">Email Address</span>
                        <p class="text-lg font-medium">{{ appointment.dealer_info[0]?.emailAddress || 'N/A' }}</p>
                    </div>
                </div>
            </div>

            <!-- Appointment Information -->
            <div class="card w-full">
                <div class="flex items-center justify-between border-b pb-2 mb-4">
                    <div class="text-2xl font-bold text-gray-800">📅 Appointment Information</div>
                </div>

                <div class="grid grid-cols-1 gap-3">
                    <div>
                        <span class="block text-sm font-bold text-black-800">Warranty Entry ID</span>
                        <p class="text-base font-medium">{{ appointment.appointment_info?.warrantyEntryID || 'N/A' }}</p>
                    </div>
                    <div>
                        <span class="block text-sm font-bold text-black-800">Request Date</span>
                        <p class="text-base font-medium">{{ appointment.appointment_info?.appointmentRequestDate || 'N/A' }}</p>
                    </div>
                    <div>
                        <span class="block text-sm font-bold text-black-800">Request Session</span>
                        <p class="text-base font-medium">{{ appointment.appointment_info?.appointmentRequestSession || 'N/A' }}</p>
                    </div>
                    <div>
                        <span class="block text-sm font-bold text-black-800">Appointment Date</span>
                        <p class="text-base font-medium">{{ appointment.appointment_info?.appointmentDate || 'Not Scheduled' }}</p>
                    </div>
                    <div>
                        <span class="block text-sm font-bold text-black-800">Appointment Time</span>
                        <p class="text-base font-medium">{{ appointment.appointment_info?.appointmentTime || 'Not Scheduled' }}</p>
                    </div>
                    <div>
                        <span class="block text-sm font-bold text-black-800">Problem Description</span>
                        <p class="text-base font-medium">{{ appointment.appointment_info?.problem || 'N/A' }}</p>
                    </div>
                    <div>
                        <span class="block text-sm font-bold text-black-800">Created Date</span>
                        <p class="text-base font-medium">{{ appointment.appointment_info?.created || 'N/A' }}</p>
                    </div>
                    
                    <!-- Reject Reason (only show if exists) -->
                    <div v-if="appointment.appointment_info?.rejectReason" class="mt-2 p-3 bg-red-50 rounded-lg border border-red-200">
                        <span class="font-bold text-red-800">Reject Reason</span>
                        <p class="text-base font-medium text-red-700 mt-1">{{ appointment.appointment_info.rejectReason }}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Image Modal -->
    <Dialog 
        v-model:visible="activeImage" 
        :modal="true" 
        :style="{ width: '90vw', maxWidth: '1200px' }"
        @hide="closeImageModal"
    >
        <template #header>
            <div class="font-semibold text-lg">{{ activeImageType }} - Image Preview</div>
        </template>
        <div class="flex justify-center">
            <img 
                :src="activeImage" 
                alt="Preview" 
                class="max-w-full max-h-96 object-contain"
                @error="(e) => handleImageError(e, 'general')"
            />
        </div>
        <template #footer>
            <div class="flex justify-between items-center w-full">
                <a :href="activeImage" target="_blank" class="text-primary-600 hover:text-primary-700 flex items-center gap-2">
                    <i class="pi pi-external-link"></i>
                    Open in new tab
                </a>
                <Button label="Close" icon="pi pi-times" @click="closeImageModal" class="p-button-text" />
            </div>
        </template>
    </Dialog>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-8 text-gray-500">
        Loading appointment details...
    </div>

    <!-- Empty State -->
    <div v-else-if="!appointment || Object.keys(appointment).length === 0" class="text-center py-8 text-gray-500">
        No appointment data found.
    </div>
</template>

<style scoped>
.cursor-pointer {
    cursor: pointer;
}

.border-1 {
    border-width: 1px;
}

:deep(.p-dialog .p-dialog-header) {
    padding: 1.5rem;
}

:deep(.p-dialog .p-dialog-content) {
    padding: 1.5rem;
}
</style>