<script setup>
import { ref, onMounted, computed } from 'vue';
import api from '@/service/api';
import { useRoute } from 'vue-router';
import Button from 'primevue/button';

const route = useRoute();
const appointment = ref({});
const loading = ref(true);

// Fetch appointment details
const fetchAppointmentDetail = async () => {
    try {
        const response = await api.get(`appointment/${route.params.id}`);
        console.log('API Response:', response.data);
        
        if (response.data.status === 1) {
            appointment.value = response.data.admin_data;
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

const appointmentStatusClass = computed(() => {
    const status = appointment.value.appointment_info?.status;
    return {
        'px-3 py-1 rounded-full text-sm font-semibold': true,
        'bg-yellow-100 text-yellow-800': status === 0,
        'bg-green-100 text-green-800': status === 1,
        'bg-red-100 text-red-800': status === 2
    };
});

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
            <div class="card flex flex-col w-full">
                <div class="flex items-center justify-between border-b pb-2 mb-4">
                    <div class="text-2xl font-bold text-gray-800">👤 Customer Information</div>
                </div>

                <div class="grid grid-cols-2 md:grid-cols-2 gap-4">
                    <div>
                        <span class="block text-sm font-bold text-black-800">Name</span>
                        <p class="text-lg font-medium">{{ appointment.customer_info?.[0]?.name || 'N/A' }}</p>
                    </div>
                    <div>
                        <span class="block text-sm font-bold text-black-800">Vehicle</span>
                        <p class="text-lg font-medium">{{ appointment.customer_info?.[0]?.vehicle || 'N/A' }}</p>
                    </div>
                    <div>
                        <span class="block text-sm font-bold text-black-800">Registration No</span>
                        <p class="text-lg font-medium">{{ appointment.customer_info?.[0]?.regNo || 'N/A' }}</p>
                    </div>
                    <div>
                        <span class="block text-sm font-bold text-black-800">Mobile Number</span>
                        <p class="text-lg font-medium">{{ appointment.customer_info?.[0]?.mobileNo || 'N/A' }}</p>
                    </div>
                </div>
            </div>

            <!-- Tire Information -->
            <div class="card flex flex-col w-full">
                <div class="flex items-center justify-between border-b pb-2 mb-4">
                    <div class="text-2xl font-bold text-gray-800">🛞 Tire Information</div>
                </div>

                <div class="grid grid-cols-2 md:grid-cols-2 gap-4">
                    <div>
                        <span class="block text-sm font-bold text-black-800">Pattern</span>
                        <p class="text-lg font-medium">{{ appointment.tire_info?.[0]?.pattern || 'N/A' }}</p>
                    </div>
                    <div>
                        <span class="block text-sm font-bold text-black-800">Size</span>
                        <p class="text-lg font-medium">{{ appointment.tire_info?.[0]?.tyresize || 'N/A' }}</p>
                    </div>
                    <div>
                        <span class="block text-sm font-bold text-black-800">Description</span>
                        <p class="text-lg font-medium">{{ appointment.tire_info?.[0]?.desc || 'N/A' }}</p>
                    </div>
                    <div>
                        <span class="block text-sm font-bold text-black-800">Manufacturer Code</span>
                        <p class="text-lg font-medium">{{ appointment.tire_info?.[0]?.mfgcode || 'N/A' }}</p>
                    </div>
                    <div>
                        <span class="block text-sm font-bold text-black-800">Week Code</span>
                        <p class="text-lg font-medium">{{ appointment.tire_info?.[0]?.weekcode || 'N/A' }}</p>
                    </div>
                </div>
            </div>

            <!-- Submitted Photos -->
            <div class="card flex flex-col w-full" v-if="hasSubmittedPhotos">
                <div class="flex items-center justify-between border-b pb-2 mb-4">
                    <div class="text-2xl font-bold text-gray-800">📸 Submitted Photos</div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div v-if="appointment.submitted_photos.mileageFileURL">
                        <span class="block text-sm font-bold text-black-800 mb-2">Mileage</span>
                        <img :src="appointment.submitted_photos.mileageFileURL" alt="Mileage" class="w-full h-32 object-cover rounded-lg border shadow-sm" />
                    </div>
                    <div v-if="appointment.submitted_photos.serialNoFileURL">
                        <span class="block text-sm font-bold text-black-800 mb-2">Serial No</span>
                        <img :src="appointment.submitted_photos.serialNoFileURL" alt="Serial No" class="w-full h-32 object-cover rounded-lg border shadow-sm" />
                    </div>
                    <div v-if="appointment.submitted_photos.tireSizeFileURL">
                        <span class="block text-sm font-bold text-black-800 mb-2">Tire Size</span>
                        <img :src="appointment.submitted_photos.tireSizeFileURL" alt="Tire Size" class="w-full h-32 object-cover rounded-lg border shadow-sm" />
                    </div>
                    <div v-if="appointment.submitted_photos.defectAreaFileURL">
                        <span class="block text-sm font-bold text-black-800 mb-2">Defect Area</span>
                        <img :src="appointment.submitted_photos.defectAreaFileURL" alt="Defect Area" class="w-full h-32 object-cover rounded-lg border shadow-sm" />
                    </div>
                </div>
            </div>
        </div>

        <!-- RIGHT SIDE -->
        <div class="md:w-1/3 flex flex-col gap-6">
            <!-- Dealer Information -->
            <div class="card w-full">
                <div class="flex items-center justify-between border-b pb-2 mb-4">
                    <div class="text-2xl font-bold text-gray-800">🏢 Dealer Information</div>
                </div>

                <div class="grid grid-cols-1 gap-4 text-sm text-gray-800">
                    <div>
                        <span class="font-bold">Customer Account</span>
                        <p class="text-lg font-medium">{{ appointment.dealer_info?.[0]?.custAccountNo || 'N/A' }}</p>
                    </div>
                    <div>
                        <span class="font-bold">Company Name</span>
                        <p class="text-lg font-medium">{{ appointment.dealer_info?.[0]?.companyName1 || 'N/A' }}</p>
                    </div>
                    <div>
                        <span class="font-bold">Phone Number</span>
                        <p class="text-lg font-medium">{{ appointment.dealer_info?.[0]?.phoneNumber || 'N/A' }}</p>
                    </div>
                    <div>
                        <span class="font-bold">Email Address</span>
                        <p class="text-lg font-medium">{{ appointment.dealer_info?.[0]?.emailAddress || 'N/A' }}</p>
                    </div>
                </div>
            </div>

            <!-- Appointment Information -->
            <div class="card w-full">
                <div class="flex items-center justify-between border-b pb-2 mb-4">
                    <div class="text-2xl font-bold text-gray-800">📅 Appointment Information</div>
                </div>

                <div class="grid grid-cols-1 gap-3 text-sm text-gray-800">
                    <div>
                        <span class="font-bold">Request Date</span>
                        <p class="text-base font-medium">{{ appointment.appointment_info?.appointmentRequestDate || 'N/A' }}</p>
                    </div>
                    <div>
                        <span class="font-bold">Request Session</span>
                        <p class="text-base font-medium">{{ appointment.appointment_info?.appointmentRequestSession || 'N/A' }}</p>
                    </div>
                    <div>
                        <span class="font-bold">Appointment Date</span>
                        <p class="text-base font-medium">{{ appointment.appointment_info?.appointmentDate || 'Not Scheduled' }}</p>
                    </div>
                    <div>
                        <span class="font-bold">Appointment Time</span>
                        <p class="text-base font-medium">{{ appointment.appointment_info?.appointmentTime || 'Not Scheduled' }}</p>
                    </div>
                    <div>
                        <span class="font-bold">Problem Description</span>
                        <p class="text-base font-medium">{{ appointment.appointment_info?.problem || 'N/A' }}</p>
                    </div>
                    <div>
                        <span class="font-bold">Created Date</span>
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

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-8 text-gray-500">
        Loading appointment details...
    </div>

    <!-- Empty State -->
    <div v-else-if="!appointment || Object.keys(appointment).length === 0" class="text-center py-8 text-gray-500">
        No appointment data found.
    </div>
</template>