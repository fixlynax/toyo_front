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
                        <div class="flex items-center gap-2">
                            <RouterLink to="/marketing/listRedemption">
                                <Button icon="pi pi-arrow-left" class="p-button-text p-button-secondary text-xl font-bold" v-tooltip="'Back'" />
                            </RouterLink>
                            <h2 class="text-2xl font-bold text-gray-800">🎁 Details Redemption</h2>
                        </div>
                        <div class="inline-flex items-center gap-2">
                            <RouterLink to="/marketing/editredemption">
                                <Button label="Edit" class="p-button-info" size="small" icon="pi pi-pencil" />
                            </RouterLink>
                        </div>
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
                            <p class="text-lg font-medium">{{ redemption.addLine1 }}, {{ redemption.addLine2 }}, {{ redemption.addCity }}, {{ redemption.addState }}, {{ redemption.addPostcode }}, {{ redemption.addCountry }}</p>
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

                    <!-- Action Buttons moved here -->
                    <div class="flex justify-end mt-4 pt-4 border-t">
                        <div class="flex gap-2">
                            <!-- Reject Button -->
                            <Button label="Reject" class="p-button-danger" @click="showRejectDialog = true" />

                            <!-- Approve Button -->
                            <RouterLink to="/marketing/detailEvent">
                                <Button label="Approve" class="p-button-success" />
                            </RouterLink>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Rejection Reason Dialog -->
        <Dialog 
            v-model:visible="showRejectDialog" 
            modal 
            header="Reject Redemption" 
            :style="{ width: '500px' }"
            :breakpoints="{ '960px': '75vw', '641px': '90vw' }"
        >
            <div class="flex flex-col gap-4">
                <div>
                    <label for="rejectReason" class="block text-sm font-medium text-gray-700 mb-2">
                        Reason for rejection <span class="text-red-500">*</span>
                    </label>
                    <textarea 
                        id="rejectReason"
                        v-model="rejectReason" 
                        class="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                        placeholder="Please provide the reason for rejecting this redemption..."
                        rows="4"
                        :class="{ 'border-red-500': showValidationError }"
                    ></textarea>
                    <p v-if="showValidationError" class="text-red-500 text-sm mt-1">
                        Please enter a reason for rejection
                    </p>
                </div>
                
                <div class="mt-2">
                    <p class="text-sm text-gray-600">
                        This action cannot be undone. The user will be notified about the rejection.
                    </p>
                </div>
            </div>
            
            <template #footer>
                <div class="flex justify-end gap-2">
                    <Button 
                        label="Cancel" 
                        class="p-button-secondary" 
                        @click="closeRejectDialog" 
                    />
                    <Button 
                        label="Submit Rejection" 
                        class="p-button-danger" 
                        @click="submitReject" 
                        :disabled="!rejectReason.trim()"
                    />
                </div>
            </template>
        </Dialog>
    </Fluid>
</template>

<script setup>
import { ref } from 'vue';
import Dialog from 'primevue/dialog';

const showRejectDialog = ref(false);
const rejectReason = ref('');
const showValidationError = ref(false);

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

// Close dialog and reset form
const closeRejectDialog = () => {
    showRejectDialog.value = false;
    rejectReason.value = '';
    showValidationError.value = false;
};

// Reject submission handler
const submitReject = () => {
    if (!rejectReason.value.trim()) {
        showValidationError.value = true;
        return;
    }
    
    console.log('Rejected with reason:', rejectReason.value);
    // Here you would typically make an API call to submit the rejection
    
    // Show success message (you can use Toast from PrimeVue)
    // this.$toast.add({ severity: 'success', summary: 'Rejected', detail: 'Redemption has been rejected successfully', life: 3000 });
    
    closeRejectDialog();
    
    // Optionally, you can redirect or update the status
    // redemption.value.status = 'Rejected';
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