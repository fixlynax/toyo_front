<script setup>
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
            <!-- Member Info -->
            <div class="card p-4">
                <div class="text-lg font-semibold text-gray-800 border-b pb-2 mb-3">👤 Member Info</div>
                <p><strong>Name:</strong> {{ appointment.member_name }}</p>
                <p><strong>Phone:</strong> {{ appointment.phone_no }}</p>
                <p><strong>Email:</strong> {{ appointment.email }}</p>
            </div>

            <!-- Tyre Info -->
            <div class="card p-4">
                <div class="text-lg font-semibold text-gray-800 border-b pb-2 mb-3">🛞 Tyre Info</div>
                <p><strong>Brand:</strong> {{ appointment.tyre_brand }}</p>
                <p><strong>Model:</strong> {{ appointment.tyre_model }}</p>
                <p><strong>Size:</strong> {{ appointment.tyre_size }}</p>
            </div>

            <!-- Dealer Info -->
            <div class="card p-4">
                <div class="text-lg font-semibold text-gray-800 border-b pb-2 mb-3">🏢 Dealer Info</div>
                <p><strong>Customer Account:</strong> {{ appointment.dealer_cust_acc }}</p>
                <p><strong>Dealer Short Name:</strong> {{ appointment.dealer_short_name }}</p>
                <p><strong>Booking Time:</strong> {{ appointment.book_datetime }}</p>
            </div>
        </div>
    </div>
</template>
