<script setup>
import { ref, onMounted, computed, reactive } from 'vue';
import api from '@/service/api';
import { useRoute } from 'vue-router';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import { useToast } from 'primevue/usetoast';

import { useMenuStore } from '@/store/menu';
import { useConfirm } from 'primevue';

const menuStore = useMenuStore();
const canUpdate = computed(() => menuStore.canWrite('Appointment'));
const denyAccess = computed(() => menuStore.canTest('Appointment'));
const confirmation = useConfirm();
const toast = useToast();

const rejectAppointment = ref(false);
const approveAppointment = ref(false);

const showRejectDialogAppoinment = ref(false);
const showApproveDialogAppoinment = ref(false);

const showRejectAppointment = reactive({
    remarks: '',
});
const today = ref(new Date());
const showApproveAppointment = reactive({
    appDate: null,
    appTime: null,
    dealerId: null,
});

const route = useRoute();
const appointment = ref({});
const dealerSelect = ref({});
const loading = ref(true);
const activeImage = ref(null);
const activeImageType = ref('');
const submittedPhotos = ref([]);
const imageDialogVisible = ref(false);

// Fetch appointment details
const fetchAppointmentDetail = async () => {
    try {
        const response = await api.get(`appointment/${route.params.id}`);
        

        if (response.data.status === 1) {
            appointment.value = response.data.admin_data;

            // Load all submitted photos
            if (appointment.value.submitted_photos) {
                await loadSubmittedPhotos();
            }
        } else {
            toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to load data', life: 3000 });
        }
    } catch (error) {
        console.error('Error fetching appointment detail:', error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to load data', life: 3000 });
    } finally {
        loading.value = false;
    }
};

const fetchDealer = async () => {
    try {
        const response = await api.post(`list_dealer`);
    
        if (response.data.status === 1) {
            dealerSelect.value = response.data.admin_data;
        } else {
            toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to load data', life: 3000 });
        }
    } catch (error) {
        console.error('Error fetching dealer detail:', error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to load data', life: 3000 });
    } finally {
        loading.value = false;
    }
};

const dealerOptions = computed(() => {
    return Object.values(dealerSelect.value).map(item => ({
        label: `${item.shop.companyName1} (${item.shop.custAccountNo})`,
        value: item.shop.id,          // ✅ SHOP ID
        raw: item                      // optional (full data)
    }));
});

// Load submitted photos using the same method as reference code
const loadSubmittedPhotos = () => {
    const photos = [];
    const photoTypes = [
        { key: 'mileageFileURL', label: 'Mileage' },
        { key: 'serialNoFileURL', label: 'Serial Number' },
        { key: 'tireSizeFileURL', label: 'Tire Size' },
        { key: 'defectAreaFileURL', label: 'Defect Area' }
    ];

    for (const photoType of photoTypes) {
        const url = appointment.value?.submitted_photos?.[photoType.key];

        if (url && url !== 'null') {
            photos.push({
                type: photoType.key,
                label: photoType.label,
                url: url,
                imageSrc: url, // ✅ use directly
                alt: `${photoType.label} Photo`
            });
        }
    }

    submittedPhotos.value = photos;
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
const formatDateSubmission = (date) => {
    if (!date) return null;

    const d = new Date(date);
    return d.toISOString().split('T')[0];
};
const formatTimeSubmission = (time) => {
    if (!time) return null;

    const d = new Date(time);
    let hours = d.getHours();
    const minutes = d.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'pm' : 'am';

    hours = hours % 12 || 12; // convert 0 → 12

    return `${hours}:${minutes}${ampm}`;
};
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
    imageDialogVisible.value = true;
};

const closeImageModal = () => {
    activeImage.value = null;
    activeImageType.value = '';
    imageDialogVisible.value = false;

};

// Get photo by type
const getPhotoByType = (type) => {
    return submittedPhotos.value.find((photo) => photo.type === type);
};

// Fetch data when component mounts
onMounted(() => {
    fetchAppointmentDetail();
    fetchDealer();
});

const rejectAppointmentDialog = () => {
    showRejectDialogAppoinment.value = true;
    showRejectAppointment.remarks = '';
};
const closerejectAppointmentDialog = () => {
    showRejectDialogAppoinment.value = false;
    showRejectAppointment.remarks = '';
};

const approveAppointmentDialog = () => {
    showApproveDialogAppoinment.value = true;
    showApproveAppointment.appDate = null;
    showApproveAppointment.appTime = null;
    showApproveAppointment.dealerId = null;
};
const closeapproveAppointmentDialog = () => {
    showApproveDialogAppoinment.value = false;
    showApproveAppointment.appDate = null;
    showApproveAppointment.appTime = null;
    showApproveAppointment.dealerId = null;
};

const rejectApp = async () => {
        if (!showRejectAppointment.remarks) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Rejection Reason missing',
            life: 4000
        });
        return;
    }

    try {
        rejectAppointment.value = true;
        const response = await api.post(`appointment/update`, 
        {
            appointmentID: route.params.id,
            status: 2,
            rejectReason: showRejectAppointment.remarks,
        });
        if (response.data.status === 1) {
            toast.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Appointment rejected successfully',
                life: 3000
            });
            await fetchAppointmentDetail(); // Refresh data
        } else {
          toast.add({
            severity: 'error',
            summary: 'Error',
            detail: response?.data?.message || 'Failed to reject appointment',
            life: 3000
        });
        }
    } catch (err) {
        console.error('Error rejecting appoinment:', err);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: err.response?.data?.message || 'Failed to reject appoinment',
            life: 3000
        });
    } finally {
        rejectAppointment.value = false;
        closerejectAppointmentDialog();
    }
};

const approveApp = async () => {
      if (!showApproveAppointment.appDate) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Appointmen Date is missing',
            life: 4000
        });
        return;
    }
    if (!showApproveAppointment.appTime) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Appointmen Time is missing',
            life: 4000
        });
        return;
    }
    if (!showApproveAppointment.dealerId) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Please select a dealer',
            life: 4000
        });
        return;
    }
    try {
        approveAppointment.value = true;
        const response = await api.post(`appointment/update`, 
        {
            appointmentID: route.params.id,
            status: 1,
            appointmentTime: formatTimeSubmission(showApproveAppointment.appTime),
            appointmentDate: formatDateSubmission(showApproveAppointment.appDate),
            dealerID: showApproveAppointment.dealerId,
        });
        if (response.data.status === 1) {
            toast.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Appointment aproved successfully',
                life: 3000
            });
            await fetchAppointmentDetail(); // Refresh data
        } else {
          toast.add({
            severity: 'error',
            summary: 'Error',
            detail: response?.data?.message || 'Failed to aproved appointment',
            life: 3000
        });
        }
    } catch (err) {
        console.error('Error rejecting appoinment:', err);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: err.response?.data?.message || 'Failed to aproved appoinment',
            life: 3000
        });
    } finally {
        approveAppointment.value = false;
        closeapproveAppointmentDialog();
    }
};
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
                    <div class="text-2xl font-bold text-gray-800">Tyre Information</div>
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
            <div class="card w-full" v-if="appointment?.warrantyReg?.isTWP === 1 && appointment?.appointment_info?.status === 0 && canUpdate ">
                <div class="flex items-center justify-between border-b pb-2 mb-4">
                    <div class="text-2xl font-bold text-gray-800">Update Appoinment Details</div>
                </div>

                    <div class="flex justify-start gap-2 mt-4">
                        <Button label="Approve " @click="approveAppointmentDialog" class="p-button-success w-full" size="small" icon="pi pi-check" />
                        <Button label="Reject " @click="rejectAppointmentDialog" class="p-button-danger w-full" size="small" icon="pi pi-times" />
                    </div>
            </div>
        </div>
    </div>

    <!-- Image Modal -->
    <Dialog v-model:visible="imageDialogVisible" :modal="true" :style="{ width: '90vw', maxWidth: '1200px' }" @hide="closeImageModal">
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
    <Dialog v-model:visible="showRejectDialogAppoinment" header="Reject Appointment" :modal="true" class="p-fluid" :style="{ width: '40rem' }">
        <div class="field">
            <label class="block font-bold text-gray-700 mb-2">Rejection Reason*</label>
            <InputText v-model="showRejectAppointment.remarks" class="w-full"/>
        </div>
        <template #footer>
            <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="closerejectAppointmentDialog" :disabled="rejectAppointment" />
            <Button label="Reject" icon="pi pi-times-circle" class="p-button-danger" @click="rejectApp" :loading="rejectAppointment" :disabled="rejectAppointment" />
        </template>
    </Dialog>

    <Dialog v-model:visible="showApproveDialogAppoinment" header="Approve Appointment" :modal="true" class="p-fluid" :style="{ width: '40rem' }">
            <!-- Date selection -->
             <div class="flex flex-col gap-3">
                <div>
                    <label for="appDate" class="block mb-2 font-medium w-full">Appointment Date</label>
                    <Calendar id="appDate"v-model="showApproveAppointment.appDate" dateFormat="dd/mm/yy" :min-date="today" class="w-full" showIcon/>
                </div>
                <div>
                    <label for="appTime" class="block mb-2 font-medium w-full">Appointment Time</label>
                    <Calendar id="appTime"v-model="showApproveAppointment.appTime"timeOnly hourFormat="12" class="w-full"/>
                </div>
                <div>
                    <label for="appTime" class="block mb-2 font-medium w-full">Dealer Selection</label>
                    <Dropdown v-model="showApproveAppointment.dealerId" :options="dealerOptions" optionLabel="label"  optionValue="value" placeholder="Select Dealer"class="w-full"/>
                </div>
             </div>
        <div class="field">

        </div>
        <template #footer>
            <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="closeapproveAppointmentDialog" :disabled="approveAppointment" />
            <Button label="Approve" icon="pi pi-check"  class="p-button-success" @click="approveApp" :loading="approveAppointment" :disabled="approveAppointment" />
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
