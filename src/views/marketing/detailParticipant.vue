<template>
    <Fluid>
        <div class="flex flex-col md:flex-row gap-8">
            <!-- Left Content -->
            <div class="md:w-2/3">
                <div class="card flex flex-col gap-6 w-full">
                    <!-- Header -->
                    <div class="flex items-center justify-between border-b pb-2">
                        <!-- Left Section: Title + Back Button -->
                        <div class="flex items-center gap-3">
                            <RouterLink to="/marketing/listRedemption"> <Button icon="pi pi-arrow-left font-bold" class="p-button-text p-button-secondary text-xl" size="big" v-tooltip="'Back'" /> </RouterLink>
                            <div class="text-2xl font-bold text-gray-800">🎁 Details Redemption</div>
                        </div>

                        <!-- Right Section: Edit Button -->
                        <div class="inline-flex items-center gap-2">
                            <Button 
                                label="Edit" 
                                class="p-button-info" 
                                size="small" 
                                @click="$router.push('/marketing/editRedemption')"
                            />
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
                        <Tag :value="statusLabel(redemption.status)" :severity="statusSeverity(redemption.status)" />
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

                    <!-- Action Buttons moved here -->
                    <div class="flex justify-end gap-2 mt-4 pt-4 border-t">
                        <!-- Reject Button -->
                        <Button 
                            label="Reject" 
                            class="p-button-danger" 
                            @click="showRejectDialog = true"
                            :disabled="redemption.status === 'Rejected' || redemption.status === 'Approved'"
                        />

                        <!-- Approve Button -->
                        <Button 
                            label="Approve" 
                            class="p-button-success" 
                            @click="showApproveDialog = true"
                            :disabled="redemption.status === 'Rejected' || redemption.status === 'Approved'"
                        />
                    </div>
                </div>
            </div>

            <!-- ======================= -->
            <!-- RIGHT SECTION: Advance Info -->
            <!-- ======================= -->
            <div class="md:w-1/3 flex flex-col">
                <div class="card flex flex-col w-full">
                    <!-- Header -->
                    <div class="flex items-center justify-between border-b pb-2 mb-2">
                        <h2 class="text-2xl font-bold text-gray-800">ℹ️ Advance Info</h2>
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
                                <tr class="border-b" v-if="redemption.approvedDate">
                                    <td class="px-4 py-2 font-medium">Approved Date</td>
                                    <td class="px-4 py-2 text-right">{{ redemption.approvedDate }}</td>
                                </tr>
                                <tr class="border-b" v-if="redemption.rejectedDate">
                                    <td class="px-4 py-2 font-medium">Rejected Date</td>
                                    <td class="px-4 py-2 text-right">{{ redemption.rejectedDate }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>

        <!-- Rejection Reason Dialog -->
        <Dialog v-model:visible="showRejectDialog" modal header="Reject Redemption" :style="{ width: '500px' }" :breakpoints="{ '960px': '75vw', '641px': '90vw' }">
            <div class="flex flex-col gap-1">
                <div>
                    <label for="rejectReason" class="block text-sm font-medium text-gray-700 mb-2"> Reason for rejection <span class="text-red-500">*</span> </label>
                    <textarea
                        id="rejectReason"
                        v-model="rejectReason"
                        class="w-full border border-gray-300 rounded-md p-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Please provide the reason for rejecting this redemption..."
                        rows="4"
                        :class="{ 'border-red-500': showValidationError }"
                    ></textarea>
                    <p v-if="showValidationError" class="text-red-500 text-sm mt-1">Please enter a reason for rejection</p>
                </div>

                <div class="mt-2">
                    <p class="text-sm text-gray-600">This action cannot be undone. The user will be notified about the rejection.</p>
                </div>
            </div>

            <template #footer>
                <div class="flex justify-end gap-3">
                    <Button label="Cancel" class="p-button-secondary p-button-sm p-button-outlined" @click="closeRejectDialog" />
                    <Button label="Submit Rejection" class="p-button-danger p-button-sm" @click="submitReject" :disabled="!rejectReason.trim()" />
                </div>
            </template>
        </Dialog>

        <!-- Approval Dialog -->
        <Dialog v-model:visible="showApproveDialog" modal header="Approve Redemption" :style="{ width: '500px' }" :breakpoints="{ '960px': '75vw', '641px': '90vw' }">
            <div class="flex flex-col gap-1">
                <div class="mb-4">
                    <p class="text-sm text-gray-700">Are you sure you want to approve this redemption?</p>
                </div>

                <div>
                    <label for="approvedBy" class="block text-sm font-medium text-gray-700 mb-2"> Approved By <span class="text-red-500">*</span> </label>
                    <InputText
                        id="approvedBy"
                        v-model="approvedBy"
                        class="w-full"
                        placeholder="Enter your name"
                        :class="{ 'border-red-500': showApproveValidationError }"
                    />
                    <p v-if="showApproveValidationError" class="text-red-500 text-sm mt-1">Please enter your name</p>
                </div>

                <div class="mt-2">
                    <p class="text-sm text-gray-600">This action will approve the redemption and update the status.</p>
                </div>
            </div>

            <template #footer>
                <div class="flex justify-end gap-3">
                    <Button label="Cancel" class="p-button-secondary p-button-sm p-button-outlined" @click="closeApproveDialog" />
                    <Button label="Submit Approval" class="p-button-success p-button-sm" @click="submitApprove" :disabled="!approvedBy.trim()" />
                </div>
            </template>
        </Dialog>
    </Fluid>
</template>

<script setup>
import { ref } from 'vue';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';

const showRejectDialog = ref(false);
const showApproveDialog = ref(false);
const rejectReason = ref('');
const approvedBy = ref('');
const showValidationError = ref(false);
const showApproveValidationError = ref(false);

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

// Close reject dialog and reset form
const closeRejectDialog = () => {
    showRejectDialog.value = false;
    rejectReason.value = '';
    showValidationError.value = false;
};

// Close approve dialog and reset form
const closeApproveDialog = () => {
    showApproveDialog.value = false;
    approvedBy.value = '';
    showApproveValidationError.value = false;
};

// Reject submission handler
const submitReject = () => {
    if (!rejectReason.value.trim()) {
        showValidationError.value = true;
        return;
    }

    console.log('Rejected with reason:', rejectReason.value);
    
    // Update redemption status and add rejection date
    redemption.value.status = 'Rejected';
    redemption.value.rejectedDate = new Date().toISOString().split('T')[0];
    
    // Show success message
    // this.$toast.add({ severity: 'success', summary: 'Rejected', detail: 'Redemption has been rejected successfully', life: 3000 });

    closeRejectDialog();
};

// Approve submission handler
const submitApprove = () => {
    if (!approvedBy.value.trim()) {
        showApproveValidationError.value = true;
        return;
    }

    console.log('Approved by:', approvedBy.value);
    
    // Update redemption status and add approval date
    redemption.value.status = 'Approved';
    redemption.value.approvedBy = approvedBy.value;
    redemption.value.approvedDate = new Date().toISOString().split('T')[0];
    
    // Show success message
    // this.$toast.add({ severity: 'success', summary: 'Approved', detail: 'Redemption has been approved successfully', life: 3000 });

    closeApproveDialog();
};

// Helper functions for status label
const statusLabel = (status) => {
    const statusMap = {
        'Packing': 'Packing',
        'Shipped': 'Shipped',
        'Delivered': 'Delivered',
        'Approved': 'Approved',
        'Rejected': 'Rejected'
    };
    return statusMap[status] || 'Unknown';
};

const statusSeverity = (status) => {
    const severityMap = {
        'Packing': 'info',
        'Shipped': 'warn',
        'Delivered': 'success',
        'Approved': 'success',
        'Rejected': 'danger'
    };
    return severityMap[status] || 'secondary';
};
</script>