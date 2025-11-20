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
const submittedPhotos = ref([]);

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
            console.log('Submitted Photos URLs:', appointment.value.submitted_photos);

            // Load all submitted photos
            if (appointment.value.submitted_photos) {
                await loadSubmittedPhotos();
            }
        } else {
            console.warn('Unexpected API response structure:', response.data);
        }
    } catch (error) {
        console.error('Error fetching appointment detail:', error);
    } finally {
        loading.value = false;
    }
};

// Load submitted photos using the same method as reference code
const loadSubmittedPhotos = async () => {
    const photos = [];
    const photoTypes = [
        { key: 'mileageFileURL', label: 'Mileage' },
        { key: 'serialNoFileURL', label: 'Serial Number' },
        { key: 'tireSizeFileURL', label: 'Tire Size' },
        { key: 'defectAreaFileURL', label: 'Defect Area' }
    ];

    for (const photoType of photoTypes) {
        const url = appointment.value.submitted_photos[photoType.key];
        if (url && url !== 'null' && url !== null) {
            try {
                console.log(`Loading ${photoType.label} photo from:`, url);
                const imageSrc = await api.getPrivateFile(url);

                photos.push({
                    type: photoType.key,
                    label: photoType.label,
                    url: url,
                    imageSrc: imageSrc,
                    alt: `${photoType.label} Photo`
                });

                console.log(`✅ Successfully loaded ${photoType.label} photo`);
            } catch (error) {
                console.error(`❌ Error loading ${photoType.label} photo:`, error);
                // Create fallback image
                photos.push({
                    type: photoType.key,
                    label: photoType.label,
                    url: url,
                    imageSrc: createFallbackImage(photoType.label),
                    alt: `${photoType.label} Photo - Failed to load`
                });
            }
        }
    }

    submittedPhotos.value = photos;
    console.log('Loaded submitted photos:', submittedPhotos.value);
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
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Split text into multiple lines if needed
    const lines = text.split(' ');
    const lineHeight = 20;
    const startY = 100 - ((lines.length - 1) * lineHeight) / 2;

    lines.forEach((line, index) => {
        ctx.fillText(line, 150, startY + index * lineHeight);
    });

    return canvas.toDataURL();
};

// Computed properties for conditional checks
const hasSubmittedPhotos = computed(() => {
    return submittedPhotos.value.length > 0;
});

const hasTireInfo = computed(() => {
    return appointment.value.tire_info;
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

function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleString('en-MY', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}
function formatDateFull(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleString('en-MY', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });
}

// Image modal functions
const openImageModal = (imageSrc, imageType) => {
    activeImage.value = imageSrc;
    activeImageType.value = imageType;
};

const closeImageModal = () => {
    activeImage.value = null;
    activeImageType.value = '';
};

// Get photo by type
const getPhotoByType = (type) => {
    return submittedPhotos.value.find((photo) => photo.type === type);
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
                    <div class="grid grid-cols-2 gap-4 pb-3">
                        <div>
                            <span class="block text-sm font-bold text-black-800">Appointment Code</span>
                            <p class="text-lg font-medium">{{ appointment.appointment_info?.appointmentCode || '-' }}</p>
                        </div>
                        <div>
                            <span class="block text-sm font-bold text-black-800">Appointment Date</span>
                            <p class="text-lg font-medium">{{ formatDate(appointment.appointment_info?.appointmentDate)  || 'Not Scheduled' }}</p>
                        </div>
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <span class="block text-sm font-bold text-black-800">Request Date</span>
                            <p class="text-lg font-medium">{{ formatDate(appointment.appointment_info?.appointmentRequestDate) || 'Not Request' }}</p>
                        </div>
                        <div>
                            <span class="block text-sm font-bold text-black-800">Request Session</span>
                            <p class="text-lg font-medium">{{ appointment.appointment_info?.appointmentRequestSession || '-' }}</p>
                        </div>
                        <div>
                            <span class="block text-sm font-bold text-black-800">Appointment Time</span>
                            <p class="text-lg font-medium">{{ appointment.appointment_info?.appointmentTime || '-' }}</p>
                        </div>
                        <div>
                            <span class="block text-sm font-bold text-black-800">Created Date</span>
                            <p class="text-lg font-medium">{{ formatDateFull(appointment.appointment_info?.created) || 'Not Created' }}</p>
                        </div>
                        
                    <!-- Reject Reason (only show if exists) -->
                    <div v-if="appointment.appointment_info?.rejectReason" class="mt-2 p-3 bg-red-50 rounded-lg border border-red-200">
                        <span class="font-bold text-red-800">Reject Reason</span>
                        <p class="text-base font-medium text-red-700 mt-1">{{ appointment.appointment_info.rejectReason }}</p>
                    </div>
                    </div>
                </div>
            </div>

            <!-- Customer Information -->
            <div class="card flex flex-col w-full" v-if="hasCustomerInfo">
                <div class="flex items-center justify-between border-b pb-2 mb-4">
                    <div class="text-2xl font-bold text-gray-800">Vehicle Information</div>
                </div>

                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <span class="block text-sm font-bold text-black-800">Brand</span>
                        <p class="text-lg font-medium">{{ appointment.customer_info[0]?.vehicleBrand || '-' }}</p>
                    </div>
                    <div>
                        <span class="block text-sm font-bold text-black-800">Model</span>
                        <p class="text-lg font-medium">{{ appointment.customer_info[0]?.vehicleModel || '-' }}</p>
                    </div>
                    <div>
                        <span class="block text-sm font-bold text-black-800">Registration No</span>
                        <p class="text-lg font-medium">{{ appointment.customer_info[0]?.regNo || '-' }}</p>
                    </div>
                    <div>
                        <span class="block text-sm font-bold text-black-800">Vehicle Type</span>
                        <p class="text-lg font-medium">{{ appointment.customer_info[0]?.vehicle || '-' }}</p>
                    </div>
                </div>
            </div>

            <!-- Tire Information - Side by side like customer info -->
            <div class="card flex flex-col w-full" v-if="hasTireInfo">
                <div class="flex items-center justify-between border-b pb-2 mb-4">
                    <div class="text-2xl font-bold text-gray-800">Tire Information</div>
                </div>
            <!-- "pattern": "P57",
            "tyresize": "16",
            "desc": "185\/55 R16 87H PXR57 TLYKGSS MT1Z",
            "mfgcode": "WWW",
            "weekcode": "RRRR" -->
                <div class="grid grid-cols-2 gap-4" >
                    <div>
                        <span class="block text-sm font-bold text-black-800">Pattern</span>
                        <p class="text-lg font-medium">{{ appointment.tire_info.pattern || '-' }}</p>
                    </div>
                    <div>
                        <span class="block text-sm font-bold text-black-800">Size</span>
                        <p class="text-lg font-medium">{{  appointment.tire_info.tyresize || '-' }}</p>
                    </div>
                    <div>
                        <span class="block text-sm font-bold text-black-800">Description</span>
                        <p class="text-lg font-medium">{{  appointment.tire_info.desc || '-' }}</p>
                    </div>
                    <div>
                        <span class="block text-sm font-bold text-black-800">MFG Code</span>
                        <p class="text-lg font-medium">{{ appointment.tire_info.mfgcode || '-' }}</p>
                    </div>
                    <div>
                        <span class="block text-sm font-bold text-black-800">Week Code</span>
                         <p class="text-lg font-medium">{{  appointment.tire_info.weekcode || '-' }}</p>
                    </div>
                    <div>
                        <span class="block text-sm font-bold text-black-800">Certificate No</span>
                        <p class="text-lg font-medium">{{  appointment.warrantyReg.warrantyCertNo || '-' }}</p>
                    </div>
                    <div>
                        <span class="block text-sm font-bold text-black-800">Warranty Type</span>
                        <p class="text-lg font-medium">{{  appointment.warrantyReg.warrantyType || '-' }}</p>
                    </div>
                    <div>
                        <span class="block text-sm font-bold text-black-800">Purchase Date</span>
                        <p class="text-lg font-medium">{{ formatDate(appointment.warrantyReg.purchaseDate) || '-' }}</p>
                    </div>
                   <div>
                        <span class="block text-sm font-bold text-black-800">Problem Description</span>
                        <p class="text-lg font-medium">{{ appointment.appointment_info?.problem || 'N/A' }}</p>
                    </div>
                    <div>
                        <span class="block text-sm font-bold text-black-800">Serial Plate</span>
                        <p class="text-lg font-medium">{{ appointment.customer_info[0]?.serialPlate || '-' }}</p>
                    </div>
                </div>
            </div>

            <!-- Submitted Photos Section -->
            <div class="card flex flex-col w-full">
                <div class="flex items-center justify-between border-b pb-2 mb-4">
                    <div class="text-2xl font-bold text-gray-800">Submitted Images</div>
                </div>

                <!-- Photo Grid -->
                <div v-if="hasSubmittedPhotos" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div v-for="photo in submittedPhotos" :key="photo.type" class="text-center">
                        <span class="block text-lg font-bold text-black-800 mb-3">{{ photo.label }}</span>
                        <div class="cursor-pointer border-2 border-gray-300 rounded-lg overflow-hidden hover:border-primary-500 transition-all duration-200 bg-gray-100" @click="openImageModal(photo.imageSrc, photo.label)">
                            <img :src="photo.imageSrc" :alt="photo.alt" class="w-full h-32 object-cover" />
                        </div>
                        <div class="mt-2 flex justify-center">
                            <Button label="View Full Size" icon="pi pi-eye" class="p-button-text p-button-sm" @click="openImageModal(photo.imageSrc, photo.label)" />
                        </div>
                    </div>
                </div>
                <div v-else class="text-center py-8 bg-gray-50 rounded-lg mb-6">
                    <i class="pi pi-image text-4xl text-gray-400 mb-3"></i>
                    <p class="text-gray-500 font-medium">No submitted images available</p>
                </div>
            </div>
        </div>

        <!-- RIGHT SIDE -->
        <div class="md:w-1/3 flex flex-col gap-6">
            <!-- Dealer Information - Side by side like customer info -->
            <div class="card w-full" v-if="hasDealerInfo">
                <div class="flex items-center justify-between border-b pb-2 mb-4">
                    <div class="text-2xl font-bold text-gray-800">Customer Information</div>
                </div>

                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <span class="block text-sm font-bold text-black-800">Customer Account</span>
                        <p class="text-lg font-medium">{{ appointment.dealer_info[0]?.custAccountNo || '-' }}</p>
                    </div>
                    <div>
                        <span class="block text-sm font-bold text-black-800">Company Name</span>
                        <p class="text-lg font-medium">{{ appointment.dealer_info[0]?.companyName1 || '-' }}</p>
                    </div>
                    <div>
                        <span class="block text-sm font-bold text-black-800">Phone Number</span>
                        <p class="text-lg font-medium">{{ appointment.dealer_info[0]?.phoneNumber || '-' }}</p>
                    </div>
                    <div>
                        <span class="block text-sm font-bold text-black-800">Email Address</span>
                        <p class="text-lg font-medium">{{ appointment.dealer_info[0]?.emailAddress || '-' }}</p>
                    </div>
                </div>
            </div>

            <!-- Consumer Information -->
            <div class="card w-full" v-if="hasCustomerInfo">
                <div class="flex items-center justify-between border-b pb-2 mb-4">
                    <div class="text-2xl font-bold text-gray-800">Consumer Information</div>
                </div>

                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <span class="block text-sm font-bold text-black-800">Name</span>
                        <p class="text-lg font-medium">{{ appointment.customer_info[0]?.name || '-' }}</p>
                    </div>
                    <div>
                        <span class="block text-sm font-bold text-black-800">Mobile Number</span>
                        <p class="text-lg font-medium">{{ appointment.customer_info[0]?.mobileNo || '-' }}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Image Modal -->
    <Dialog v-model:visible="activeImage" :modal="true" :style="{ width: '90vw', maxWidth: '1200px' }" @hide="closeImageModal">
        <template #header>
            <div class="font-semibold text-lg">{{ activeImageType }} - Image Preview</div>
        </template>
        <div class="flex justify-center">
            <img :src="activeImage" alt="Preview" class="max-w-full max-h-96 object-contain" />
        </div>
        <template #footer>
            <div class="flex justify-between items-center w-full">
                <Button label="Close" icon="pi pi-times" @click="closeImageModal" class="p-button-text" />
            </div>
        </template>
    </Dialog>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-8 text-gray-500">Loading appointment details...</div>

    <!-- Empty State -->
    <div v-else-if="!appointment || Object.keys(appointment).length === 0" class="text-center py-8 text-gray-500">No appointment data found.</div>
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

/* Ensure images display properly */
img {
    display: block;
    background-color: #f9fafb;
}
</style>
