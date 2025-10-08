<template>
    <Fluid>
        <div class="flex flex-col md:flex-row gap-8">
            <!-- LEFT SIDE -->
            <div class="md:w-2/3 flex flex-col">
                <div class="card flex flex-col w-full">
                    <div class="flex items-center justify-between border-b pb-2">
                        <div class="text-2xl font-bold text-gray-800">Order Delivery Details</div>
                        <div class="inline-flex items-center gap-2">
                            <Button label="Edit" class="p-button-primary" size="small" />
                        </div>
                    </div>
                    <div class="mt-6 mb-4">
                        <div>
                            <span class="block text-sm font-bold text-black-700">Order Number</span>
                            <span class="text-lg font-medium">{{ orderData.orderNo }}</span>
                        </div>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                        <div>
                            <span class="block text-sm font-bold text-black-700">Pattern</span>
                            <p class="font-medium text-lg">{{ orderData.pattern }}</p>
                        </div>
                        <div>
                            <span class="block text-sm font-bold text-black-700">Size</span>
                            <p class="font-medium text-lg">{{ orderData.size }}</p>
                        </div>
                        <div>
                            <span class="block text-sm font-bold text-black-700">DOT (year)</span>
                            <p class="font-medium text-lg">{{ orderData.dotYear }}</p>
                        </div>
                        <div>
                            <span class="block text-sm font-bold text-black-700">Quantity</span>
                            <p class="font-medium text-lg">{{ orderData.qty }}</p>
                        </div>
                        <div>
                            <span class="block text-sm font-bold text-black-700">Delivery Type</span>
                            <p class="font-medium text-lg">{{ orderData.deliveryType }}</p>
                        </div>
                        <div>
                            <span class="block text-sm font-bold text-black-700">Delivery Location</span>
                            <p class="font-medium text-lg">{{ orderData.deliveryLocation }}</p>
                        </div>
                    </div>
                    <div class="mt-4">
                        <span class="block text-sm font-bold text-black-700">Remark</span>
                        <p class="font-medium text-lg">{{ orderData.remark }}</p>
                    </div>
                </div>
            </div>

            <!-- RIGHT SIDE -->
            <div class="md:w-1/3 flex flex-col">
                <!-- Dealer Information -->
                <div class="card flex flex-col w-full">
                    <div class="flex items-center justify-between border-b pb-2 mb-2">
                        <div class="text-2xl font-bold text-gray-800">🏬 Dealer Information</div>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="w-full text-sm text-left text-gray-700">
                            <tbody>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Dealer Name</td>
                                    <td class="px-4 py-2 text-right">{{ dealerInfo.name }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Dealer Code</td>
                                    <td class="px-4 py-2 text-right">{{ dealerInfo.code }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Contact Person</td>
                                    <td class="px-4 py-2 text-right">{{ dealerInfo.contactPerson }}</td>
                                </tr>
                                <tr>
                                    <td class="px-4 py-2 font-medium">Contact Number</td>
                                    <td class="px-4 py-2 text-right">{{ dealerInfo.contactNo }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Customer Information -->
                <div class="card flex flex-col w-full">
                    <div class="flex items-center justify-between border-b pb-2 mb-2">
                        <div class="text-2xl font-bold text-gray-800">👤 Customer Information</div>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="w-full text-sm text-left text-gray-700">
                            <tbody>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Customer Name</td>
                                    <td class="px-4 py-2 text-right">{{ customerInfo.name }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Vehicle</td>
                                    <td class="px-4 py-2 text-right">{{ customerInfo.vehicle }}</td>
                                </tr>
                                <tr>
                                    <td class="px-4 py-2 font-medium">Registration Number</td>
                                    <td class="px-4 py-2 text-right">{{ customerInfo.regNo }}</td>
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
import { ref } from 'vue';
import Button from "primevue/button";

const orderData = ref({
    orderNo: 'OD-2025-001',
    pattern: 'Proxes T1R',
    size: '215/45R17',
    dotYear: '2024',
    qty: 4,
    deliveryType: 'Deliver',
    deliveryLocation: 'Kuala Lumpur',
    remark: 'Urgent delivery required'
});

const dealerInfo = ref({
    name: 'AutoWorld KL',
    code: 'DLR-001',
    contactPerson: 'Ahmad Zaki',
    contactNo: '+6012-3456789'
});

const customerInfo = ref({
    name: 'Lee Wei Ming',
    vehicle: 'Toyota Hilux 2.8G',
    regNo: 'WXY 4567'
});
</script>
