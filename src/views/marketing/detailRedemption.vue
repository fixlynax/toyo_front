<template>
    <Fluid>
        <div class="flex flex-col md:flex-row gap-8">
            <!-- ======================= -->
            <!-- LEFT SECTION: Redemption & Shipping -->
            <!-- ======================= -->
            <div class="md:w-2/3 flex flex-col">
                <!-- Redemption Details -->
                <div class="card flex flex-col gap-6 w-full">
                    <!-- Header Section -->
                    <div class="flex items-center justify-between border-b pb-2">
                        <h2 class="text-2xl font-bold text-gray-800">🎁 Details Redemption</h2>
                    </div>

                    <!-- Recipient Info -->
                    <div class="mt-2 grid grid-cols-2 gap-4">
                        <div>
                            <span class="block text-sm font-bold text-gray-700">Recipient</span>
                            <p class="text-lg font-medium">{{ redemption.recipientName }}</p>
                        </div>
                        <div>
                            <span class="block text-sm font-bold text-gray-700">Contact</span>
                            <p class="text-lg text-gray-500">{{ redemption.contactNumber }}</p>
                        </div>
                        <div>
                            <span class="block text-sm font-bold text-gray-700">Redeemed Item</span>
                            <p class="text-lg text-gray-500">{{ redemption.itemName }}</p>
                        </div>
                        <div>
                            <span class="block text-sm font-bold text-gray-700">Approved By</span>
                            <p class="text-lg text-gray-500">{{ redemption.approvedBy }} ({{ redemption.adminID }})</p>
                        </div>
                    </div>
                </div>

                <!-- Shipping Details -->
                <div class="card flex flex-col gap-6 w-full">
                    <!-- Header Section -->
                    <div class="flex items-center justify-between border-b pb-2">
                        <h2 class="text-2xl font-bold text-gray-800">🚚 Shipping Details</h2>

                        <!-- Edit Button -->
                        <div class="inline-flex items-center gap-2">
                            <RouterLink to="/marketing/editredemption">
                                <Button label="Edit" class="p-button-info" size="small" icon="pi pi-pencil" />
                            </RouterLink>
                        </div>
                    </div>

                    <!-- Shipping Info -->
                    <div class="grid grid-cols-4 gap-2 text-sm">
                        <div class="col-span-2">
                            <span class="text-sm font-bold text-gray-700">Recipient</span>
                            <p class="text-lg font-medium">{{ redemption.recipientName }}</p>
                        </div>
                        <div class="col-span-2">
                            <span class="text-sm font-bold text-gray-700">Contact</span>
                            <p class="text-lg font-medium">{{ redemption.contactNumber }}</p>
                        </div>
                        <div class="col-span-2">
                            <span class="text-sm font-bold text-gray-700">Courier</span>
                            <p class="text-lg font-medium">{{ redemption.courierName }}</p>
                        </div>
                        <div class="col-span-2">
                            <span class="text-sm font-bold text-gray-700">Tracking No</span>
                            <p class="text-lg font-medium">{{ redemption.trackingNumber }}</p>
                        </div>
                        <div class="col-span-4">
                            <span class="text-sm font-bold text-gray-700">Delivery Location</span>
                            <p class="text-lg font-medium">
                                {{ redemption.addLine1 }}, {{ redemption.addLine2 }},
                                {{ redemption.addCity }}, {{ redemption.addState }},
                                {{ redemption.addPostcode }}, {{ redemption.addCountry }}
                            </p>
                        </div>
                    </div>

                    <!-- Action Buttons -->
                    <div class="flex justify-end mt-4">
                        <div class="flex gap-2">
                            <!-- Reject Button -->
                            <Button label="Reject" class="p-button-danger" size="small" @click="showRejectReason = true" />

                            <!-- Approve Button -->
                            <RouterLink to="/marketing/detailEvent">
                                <Button label="Approve" class="p-button-success" size="small" />
                            </RouterLink>
                        </div>
                    </div>
                </div>

                <!-- ======================= -->
                <!-- Rejection Reason Section -->
                <!-- ======================= -->
                <div v-if="showRejectReason" class="card flex flex-col gap-6 w-full border border-red-300">
                    <!-- Header -->
                    <div class="flex items-center justify-between border-b pb-2">
                        <h2 class="text-2xl font-bold text-red-600">❌ Reject Redemption</h2>
                    </div>

                    <!-- Reason Input -->
                    <div>
                        <p class="mb-2 text-gray-700 text-lg">Reason for rejection:</p>
                        <textarea v-model="rejectReason" class="w-full border p-2 rounded" placeholder="Enter reason here..." rows="3"></textarea>
                    </div>

                    <!-- Action Buttons -->
                    <div class="flex justify-end mt-2 space-x-2">
                        <Button label="Cancel" class="p-button-secondary" size="small" @click="showRejectReason = false" />
                        <Button label="Submit" class="p-button-danger" size="small" @click="submitReject" :disabled="!rejectReason.trim()" />
                    </div>
                </div>
            </div>

            <!-- ======================= -->
            <!-- RIGHT SECTION: Advance Info -->
            <!-- ======================= -->
            <div class="md:w-1/3 flex flex-col">
                <div class="card flex flex-col w-full">
                    <!-- Header with Status Tag -->
                    <div class="flex items-center justify-between border-b pb-2 mb-2">
                        <h2 class="text-2xl font-bold text-gray-800">ℹ️ Advance Info</h2>
                        <Tag :value="statusLabel(redemption.status)" :severity="statusSeverity(redemption.status)" />
                    </div>

                    <!-- Info Table -->
                    <div class="overflow-x-auto">
                        <table class="w-full text-sm text-left text-gray-700">
                            <tbody>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">RefNo</td>
                                    <td class="px-4 py-2 text-right">{{ redemption.refno }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Tc User ID</td>
                                    <td class="px-4 py-2 text-right">{{ redemption.tc_userID }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Member Level</td>
                                    <td class="px-4 py-2 text-right">{{ redemption.memberLevel }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Redeem Date</td>
                                    <td class="px-4 py-2 text-right">{{ redemption.redemptionDate }}</td>
                                </tr>
                                <tr class="border-b" v-if="redemption.shippedDate">
                                    <td class="px-4 py-2 font-medium">Shipped Date</td>
                                    <td class="px-4 py-2 text-right">{{ redemption.shippedDate }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Created</td>
                                    <td class="px-4 py-2 text-right">{{ redemption.created }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Verified Date</td>
                                    <td class="px-4 py-2 text-right">{{ redemption.verifiedDate }}</td>
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

const showRejectReason = ref(false);
const rejectReason = ref('');

const redemption = ref({
    id: 1,
    refno: 'TYO-MY-1001',
    tc_userID: 'U1001',
    memberLevel: 'Gold',
    recipientName: 'Ahmad Faizal',
    contactNumber: '012-3456789',
    addLine1: 'No. 12, Jalan Melur',
    addLine2: 'Taman Melawati',
    addCity: 'Kuala Lumpur',
    addState: 'Selangor',
    addPostcode: '53100',
    addCountry: 'Malaysia',
    totalPoint: 500,
    itemName: 'Bluetooth Headphones',
    quantity: 1,
    redemptionDate: '2024-03-15',
    courierName: 'DHL Express',
    trackingNumber: 'DHLMY10001',
    shippedDate: '2024-04-01',
    status: 'Packing',
    adminID: 'admin01',
    approvedBy: 'EtenAdmin',
    verifiedDate: '2024-04-02',
    created: '2024-03-25',
    deleted: false
});

// Reject submission handler
const submitReject = () => {
    console.log('Rejected with reason:', rejectReason.value);
    showRejectReason.value = false;
    rejectReason.value = '';
};

// Helper functions for status label
const statusLabel = (status) => {
    if (status === 'Packing') return 'Packing';
    if (status === 'Shipped') return 'Shipped';
    if (status === 'Delivered') return 'Delivered';
    return 'Unknown';
};

const statusSeverity = (status) => {
    if (status === 'Packing') return 'info';
    if (status === 'Shipped') return 'warn';
    if (status === 'Delivered') return 'success';
    return 'secondary';
};
</script>
