<!-- <script setup>
import { ref, onBeforeMount } from 'vue';
import api from '@/service/api';
import { useRoute } from 'vue-router';

const route = useRoute();
const appointment = ref(null);
const loading = ref(true);

onBeforeMount(async () => {
    try {
        const response = await api.get(`appointment_detail/${route.params.id}`);
        if (response.data.status === 1) {
            appointment.value = response.data.data;
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
        <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-6">
     
            <div class="card p-4">
                <div class="text-lg font-semibold text-gray-800 border-b pb-2 mb-3">👤 Member Info</div>
                <p><strong>Name:</strong> {{ appointment.member_name }}</p>
                <p><strong>Phone:</strong> {{ appointment.phone_no }}</p>
                <p><strong>Email:</strong> {{ appointment.email }}</p>
            </div>

        
            <div class="card p-4">
                <div class="text-lg font-semibold text-gray-800 border-b pb-2 mb-3">🛞 Tyre Info</div>
                <p><strong>Brand:</strong> {{ appointment.tyre_brand }}</p>
                <p><strong>Model:</strong> {{ appointment.tyre_model }}</p>
                <p><strong>Size:</strong> {{ appointment.tyre_size }}</p>
            </div>

         
            <div class="card p-4">
                <div class="text-lg font-semibold text-gray-800 border-b pb-2 mb-3">🏢 Dealer Info</div>
                <p><strong>Customer Account:</strong> {{ appointment.dealer_cust_acc }}</p>
                <p><strong>Dealer Short Name:</strong> {{ appointment.dealer_short_name }}</p>
                <p><strong>Booking Time:</strong> {{ appointment.book_datetime }}</p>
            </div>
        </div>
    </div>
</template> -->

<script setup>
import { ref } from 'vue';

const appointment = ref({
    member_name: 'John Doe',
    phone_no: '012-3456789',
    email: 'john.doe@example.com',
    tyre_brand: 'Toyo',
    tyre_model: 'Proxes ST III',
    tyre_size: '225/45R17 94W',
    dealer_cust_acc: 'CUST001',
    dealer_short_name: 'PS Tyres',
    book_datetime: '2025-11-10 14:30'
});

const loading = ref(false); // no need to show loading for hardcoded data
</script>

<template>
    <div class="flex flex-col gap-6">
        <!-- Appointment + Member Info Card -->
        <div class="card p-4">
            <!-- Header -->
            <div class="flex items-center gap-2 border-b pb-2 mb-8">
                <Button icon="pi pi-arrow-left" class="p-button-text p-button-secondary" @click="$router.back()" />
                <div class="text-2xl font-bold text-gray-800">Appointment Details</div>
            </div>

            <!-- Member Info -->
            <div class="text-lg font-semibold text-gray-800 border-b pb-2 mb-3">👤 Member Info</div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label class="block font-bold text-gray-700">Name</label>
                    <p class="text-gray-900">{{ appointment.member_name }}</p>
                </div>
                <div>
                    <label class="block font-bold text-gray-700">Phone</label>
                    <p class="text-gray-900">{{ appointment.phone_no }}</p>
                </div>
                <div>
                    <label class="block font-bold text-gray-700">Email</label>
                    <p class="text-gray-900">{{ appointment.email }}</p>
                </div>
            </div>
        </div>

        <!-- Tyre Info Card -->
        <div class="card p-4">
            <div class="text-lg font-semibold text-gray-800 border-b pb-2 mb-3">🛞 Tyre Info</div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label class="block font-bold text-gray-700">Brand</label>
                    <p class="text-gray-900">{{ appointment.tyre_brand }}</p>
                </div>
                <div>
                    <label class="block font-bold text-gray-700">Model</label>
                    <p class="text-gray-900">{{ appointment.tyre_model }}</p>
                </div>
                <div>
                    <label class="block font-bold text-gray-700">Size</label>
                    <p class="text-gray-900">{{ appointment.tyre_size }}</p>
                </div>
            </div>
        </div>

        <!-- Dealer Info Card -->
        <div class="card p-4">
            <div class="text-lg font-semibold text-gray-800 border-b pb-2 mb-3">🏢 Dealer Info</div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label class="block font-bold text-gray-700">Customer Account</label>
                    <p class="text-gray-900">{{ appointment.dealer_cust_acc }}</p>
                </div>
                <div>
                    <label class="block font-bold text-gray-700">Dealer Short Name</label>
                    <p class="text-gray-900">{{ appointment.dealer_short_name }}</p>
                </div>
                <div>
                    <label class="block font-bold text-gray-700">Booking Time</label>
                    <p class="text-gray-900">{{ appointment.book_datetime }}</p>
                </div>
            </div>
        </div>
    </div>
</template>
