<template>
    <Fluid>
        <div class="flex flex-col md:flex-row gap-8">
            <!-- ======================= -->
            <!-- LEFT SECTION: Redemption & Shipping -->
            <!-- ======================= -->
            <div class="md:w-2/3 flex flex-col gap-8">
                <!-- Redemption Details -->
                <div class="card flex flex-col gap-6 w-full">
                    <!-- Header Section -->
                    <div class="flex items-center justify-between border-b pb-2">
                        <h2 class="text-2xl font-bold text-gray-800">Details Redemption</h2>

                        <!-- Action Buttons -->
                    </div>
                    <!-- Recipient Info -->
                    <div class="mt-2 grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <p class="text-xl font-bold text-black-700">Recipient</p>
                            <p class="text-lg text-black-900">{{ redemption.recipientName }}</p>
                        </div>
                        <div>
                            <p class="text-xl font-bold text-black-700">Contact</p>
                            <p class="text-lg text-black-500">{{ redemption.contactNumber }}</p>
                        </div>
                    </div>
                </div>

                <!-- Shipping Details (moved below Redemption) -->
                <div class="card flex flex-col gap-6 w-full">
                    <!-- Header Section -->
                    <div class="flex items-center justify-between border-b pb-2">
                        <h2 class="text-2xl font-bold text-gray-800">Shipping Details</h2>

                        <!-- Action Buttons -->
                        <div class="inline-flex items-center gap-2">
                            <RouterLink to="/marketing/editredemption">
                                <Button label="Edit Shipping" class="p-button-info" size="small" />
                            </RouterLink>
                        </div>
                    </div>

                    <!-- Recipient Info -->
                    <div class="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <p class="text-xl font-bold text-gray-700">Recipient</p>
                            <p class="text-lg text-black-900">{{ redemption.recipientName }}</p>
                        </div>
                        <div>
                            <p class="text-xl font-bold text-gray-700">Contact</p>
                            <p class="text-lg text-black-900">{{ redemption.contactNumber }}</p>
                        </div>
                        <div class="col-span-2">
                            <p class="text-xl font-bold text-gray-700">Address</p>
                            <p class="text-lg text-gray-900">{{ redemption.addLine1 }}, {{ redemption.addLine2 }}, {{ redemption.addCity }}, {{ redemption.addState }}, {{ redemption.addPostcode }}, {{ redemption.addCountry }}</p>
                        </div>
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
                                    <td class="px-4 py-2 font-medium">Redeem Date</td>
                                    <td class="px-4 py-2 text-right">{{ redemption.redemptionDate }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Audience</td>
                                    <td class="px-4 py-2 text-right">{{ redemption.recipientName }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Tracking No.</td>
                                    <td class="px-4 py-2 text-right">{{ redemption.trackingNumber }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Courier</td>
                                    <td class="px-4 py-2 text-right">{{ redemption.courierName }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Created</td>
                                    <td class="px-4 py-2 text-right">{{ redemption.created }}</td>
                                </tr>
                            </tbody>
                        </table>

                        <!-- Publish/Unpublish Buttons -->
                        <div class="flex justify-end mt-4 space-x-2">
                            <RouterLink v-if="redemption.status === 1" to="/marketing/detailEvent">
                                <Button label="Unpublish" class="p-button-danger" size="small" />
                            </RouterLink>
                            <RouterLink v-else-if="redemption.status === 2" to="/marketing/detailEvent">
                                <Button label="Publish" class="p-button-success" size="small" />
                            </RouterLink>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </Fluid>
</template>

<script setup>
import { ref } from 'vue';

const redemption = ref({
    id: 1,
    refno: 'TYO-MY-1001',
    tc_userID: 'U1001',
    memberLevel: 'Gold',
    recipientName: 'Ahmad Faizal', //
    contactNumber: '012-3456789', //
    addLine1: 'No. 12, Jalan Melur', //
    addLine2: 'Taman Melawati',
    addCity: 'Kuala Lumpur',
    addState: 'Selangor',
    addPostcode: '53100',
    addCountry: 'Malaysia',
    totalPoint: 500,
    itemName: 'Bluetooth Headphones', //
    quantity: 1, //
    redemptionDate: '2024-03-25', //
    courierName: 'DHL Express', //
    trackingNumber: 'DHLMY10001', //
    shippedDate: '2024-04-01',
    status: 'Shipped', //
    adminID: 'admin01',
    approvedBy: 'admin01',
    verifiedDate: '2024-04-02',
    created: '2024-03-25',
    deleted: false
});

// helper functions for tag
const statusLabel = (status) => {
    if (status === 0) return 'Draft';
    if (status === 1) return 'Published';
    if (status === 2) return 'Unpublished';
    return 'Unknown';
};

const statusSeverity = (status) => {
    if (status === 0) return 'info';
    if (status === 1) return 'success';
    if (status === 2) return 'warn';
    return 'secondary';
};
</script>
