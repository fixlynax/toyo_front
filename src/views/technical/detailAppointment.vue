<script setup>
import { ref, onBeforeMount } from 'vue';
import api from '@/service/api';
import { useRoute } from 'vue-router';

const route = useRoute();
const appointment = ref(null);
const loading = ref(true);

onBeforeMount(async () => {
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
});
</script>

<template>
    <div class="card flex flex-col gap-6">
        <div class="flex items-center gap-2 border-b pb-2">
            <Button icon="pi pi-arrow-left" class="p-button-text p-button-secondary" @click="$router.back()" />
            <div class="text-2xl font-bold text-gray-800">Appointment Details</div>
        </div>

        <div v-if="loading" class="text-gray-500">Loading...</div>
        
        <template v-else-if="appointment">
            <!-- Appointment Code & Status Header -->
            <div class="bg-gray-50 p-4 rounded-lg">
                <div class="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h2 class="text-xl font-bold text-gray-800">
                            {{ appointment.appointment_info?.appointmentCode || 'N/A' }}
                        </h2>
                        <p class="text-gray-600">Appointment ID: {{ appointment.appointment_info?.id }}</p>
                    </div>
                    <div>
                        <span :class="{
                            'px-3 py-1 rounded-full text-sm font-semibold': true,
                            'bg-yellow-100 text-yellow-800': appointment.appointment_info?.status === 0,
                            'bg-green-100 text-green-800': appointment.appointment_info?.status === 1,
                            'bg-red-100 text-red-800': appointment.appointment_info?.status === 2
                        }">
                            {{ appointment.appointment_info?.status_string || 'Unknown' }}
                        </span>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <!-- Left Column -->
                <div class="space-y-6">
                    <!-- 👤 Customer Info -->
                    <div class="card p-4">
                        <div class="text-lg font-semibold text-gray-800 border-b pb-2 mb-3">👤 Customer Info</div>
                        <div class="space-y-2">
                            <p><strong>Name:</strong> {{ appointment.customer_info?.[0]?.name || 'N/A' }}</p>
                            <p><strong>Vehicle:</strong> {{ appointment.customer_info?.[0]?.vehicle || 'N/A' }}</p>
                            <p><strong>Registration No:</strong> {{ appointment.customer_info?.[0]?.regNo || 'N/A' }}</p>
                            <p><strong>Mobile No:</strong> {{ appointment.customer_info?.[0]?.mobileNo || 'N/A' }}</p>
                        </div>
                    </div>

                    <!-- 🏢 Dealer Info -->
                    <div class="card p-4">
                        <div class="text-lg font-semibold text-gray-800 border-b pb-2 mb-3">🏢 Dealer Info</div>
                        <div class="space-y-2">
                            <p><strong>Customer Account:</strong> {{ appointment.dealer_info?.[0]?.custAccountNo || 'N/A' }}</p>
                            <p><strong>Company Name:</strong> {{ appointment.dealer_info?.[0]?.companyName1 || 'N/A' }}</p>
                            <p><strong>Phone Number:</strong> {{ appointment.dealer_info?.[0]?.phoneNumber || 'N/A' }}</p>
                            <p><strong>Email Address:</strong> {{ appointment.dealer_info?.[0]?.emailAddress || 'N/A' }}</p>
                        </div>
                    </div>
                </div>

                <!-- Right Column -->
                <div class="space-y-6">
                    <!-- 🛞 Tire Info -->
                    <div class="card p-4">
                        <div class="text-lg font-semibold text-gray-800 border-b pb-2 mb-3">🛞 Tire Info</div>
                        <div class="space-y-2">
                            <p><strong>Pattern:</strong> {{ appointment.tire_info?.[0]?.pattern || 'N/A' }}</p>
                            <p><strong>Size:</strong> {{ appointment.tire_info?.[0]?.tyresize || 'N/A' }}</p>
                            <p><strong>Description:</strong> {{ appointment.tire_info?.[0]?.desc || 'N/A' }}</p>
                            <p><strong>Manufacturer Code:</strong> {{ appointment.tire_info?.[0]?.mfgcode || 'N/A' }}</p>
                            <p><strong>Week Code:</strong> {{ appointment.tire_info?.[0]?.weekcode || 'N/A' }}</p>
                        </div>
                    </div>

                    <!-- 📅 Appointment Info -->
                    <div class="card p-4">
                        <div class="text-lg font-semibold text-gray-800 border-b pb-2 mb-3">📅 Appointment Info</div>
                        <div class="space-y-2">
                            <p><strong>Request Date:</strong> {{ appointment.appointment_info?.appointmentRequestDate || 'N/A' }}</p>
                            <p><strong>Request Session:</strong> {{ appointment.appointment_info?.appointmentRequestSession || 'N/A' }}</p>
                            <p><strong>Appointment Date:</strong> {{ appointment.appointment_info?.appointmentDate || 'Not Scheduled' }}</p>
                            <p><strong>Appointment Time:</strong> {{ appointment.appointment_info?.appointmentTime || 'Not Scheduled' }}</p>
                            <p><strong>Problem:</strong> {{ appointment.appointment_info?.problem || 'N/A' }}</p>
                            <p><strong>Created:</strong> {{ appointment.appointment_info?.created || 'N/A' }}</p>
                            <p v-if="appointment.appointment_info?.rejectReason" class="text-red-600">
                                <strong>Reject Reason:</strong> {{ appointment.appointment_info.rejectReason }}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 📸 Submitted Photos -->
            <div class="card p-4" v-if="appointment.submitted_photos">
                <div class="text-lg font-semibold text-gray-800 border-b pb-2 mb-3">📸 Submitted Photos</div>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div v-if="appointment.submitted_photos.mileageFileURL">
                        <p class="font-medium mb-2">Mileage</p>
                        <img :src="appointment.submitted_photos.mileageFileURL" alt="Mileage" class="w-full h-32 object-cover rounded border" />
                    </div>
                    <div v-if="appointment.submitted_photos.serialNoFileURL">
                        <p class="font-medium mb-2">Serial No</p>
                        <img :src="appointment.submitted_photos.serialNoFileURL" alt="Serial No" class="w-full h-32 object-cover rounded border" />
                    </div>
                    <div v-if="appointment.submitted_photos.tireSizeFileURL">
                        <p class="font-medium mb-2">Tire Size</p>
                        <img :src="appointment.submitted_photos.tireSizeFileURL" alt="Tire Size" class="w-full h-32 object-cover rounded border" />
                    </div>
                    <div v-if="appointment.submitted_photos.defectAreaFileURL">
                        <p class="font-medium mb-2">Defect Area</p>
                        <img :src="appointment.submitted_photos.defectAreaFileURL" alt="Defect Area" class="w-full h-32 object-cover rounded border" />
                    </div>
                </div>
            </div>
        </template>

        <div v-else class="text-center py-8 text-gray-500">
            No appointment data found.
        </div>
    </div>
</template>