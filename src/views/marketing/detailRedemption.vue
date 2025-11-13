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
                            <RouterLink to="/marketing/listRedemption"> 
                                <Button icon="pi pi-arrow-left font-bold" class="p-button-text p-button-secondary text-xl" size="big" v-tooltip="'Back'" /> 
                            </RouterLink>
                            <div class="text-2xl font-bold text-gray-800">🎁 Details Redemption</div>
                        </div>

                        <!-- Right Section: Edit & Delete Buttons -->
                        <div class="inline-flex items-center gap-2">
                            <RouterLink :to="`/marketing/editRedemption/${redemptionId}`">
                                <Button label="Edit" class="p-button-info" size="small" />
                            </RouterLink>
                        </div>
                    </div>

                    <!-- Loading State -->
                    <LoadingPage v-if="loading" :message="'Loading Redemption Details...'" />

                    <!-- Content when not loading -->
                    <div v-else>
                        <!-- Recipient Info -->
                        <div class="mt-2 grid grid-cols-2 gap-4">
                            <div>
                                <span class="block text-sm font-bold text-gray-700">Recipient</span>
                                <p class="text-lg font-medium">{{ redemption.recipientName || 'N/A' }}</p>
                            </div>
                            <div>
                                <span class="block text-sm font-bold text-gray-700">Contact</span>
                                <p class="text-lg text-gray-500">{{ redemption.contactNumber || 'N/A' }}</p>
                            </div>
                            <div>
                                <span class="block text-sm font-bold text-gray-700">Redeemed Item</span>
                                <p class="text-lg text-gray-500">{{ redemption.itemName || 'N/A' }}</p>
                            </div>
                            <div>
                                <span class="block text-sm font-bold text-gray-700">Approved By</span>
                                <p class="text-lg text-gray-500">{{ redemption.approvedBy || 'N/A' }} ({{ redemption.adminID || 'N/A' }})</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Shipping Details -->
                <div class="card flex flex-col gap-6 w-full" v-if="!loading">
                    <!-- Header Section -->
                    <div class="flex items-center justify-between border-b pb-2">
                        <h2 class="text-2xl font-bold text-gray-800">🚚 Shipping Details</h2>
                    </div>

                    <!-- Shipping Info -->
                    <div class="grid grid-cols-4 gap-2 text-sm">
                        <div class="col-span-4">
                            <span class="text-sm font-bold text-gray-700">Shipping Date</span>
                            <p class="text-lg font-medium">{{ redemption.shippedDate || 'Not Shipped' }}</p>
                        </div>
                        <div class="col-span-2">
                            <span class="text-sm font-bold text-gray-700">Recipient</span>
                            <p class="text-lg font-medium">{{ redemption.recipientName || 'N/A' }}</p>
                        </div>
                        <div class="col-span-2">
                            <span class="text-sm font-bold text-gray-700">Contact</span>
                            <p class="text-lg font-medium">{{ redemption.contactNumber || 'N/A' }}</p>
                        </div>
                        <div class="col-span-2">
                            <span class="text-sm font-bold text-gray-700">Courier</span>
                            <p class="text-lg font-medium">{{ redemption.courierName || 'Not Assigned' }}</p>
                        </div>
                        <div class="col-span-2">
                            <span class="text-sm font-bold text-gray-700">Tracking No</span>
                            <p class="text-lg font-medium">{{ redemption.trackingNumber || 'Not Assigned' }}</p>
                        </div>
                        <div class="col-span-4">
                            <span class="text-sm font-bold text-gray-700">Delivery Location</span>
                            <p class="text-lg font-medium">
                                {{ [redemption.addLine1, redemption.addLine2, redemption.addCity, redemption.addState, redemption.addPostcode, redemption.addCountry]
                                    .filter(Boolean).join(', ') || 'No address provided' }}
                            </p>
                        </div>
                    </div>
                </div>

                <!-- Campaign Criteria -->
                <div class="card flex flex-col gap-6 w-full" v-if="!loading && campaignCriteria.length > 0">
                    <!-- Header Section -->
                    <div class="flex items-center justify-between border-b pb-2">
                        <h2 class="text-2xl font-bold text-gray-800">📋 Campaign Criteria</h2>
                    </div>

                    <!-- Criteria List -->
                    <div class="grid grid-cols-1 gap-3">
                        <div v-for="(criteria, index) in campaignCriteria" :key="index" class="border rounded-lg p-4">
                            <div class="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span class="font-semibold text-gray-700">Title:</span>
                                    <p class="text-gray-600">{{ criteria.title || 'N/A' }}</p>
                                </div>
                                <div>
                                    <span class="font-semibold text-gray-700">Pattern:</span>
                                    <p class="text-gray-600">{{ criteria.pattern || 'N/A' }}</p>
                                </div>
                                <div>
                                    <span class="font-semibold text-gray-700">Size:</span>
                                    <p class="text-gray-600">{{ criteria.size || 'N/A' }}</p>
                                </div>
                                <div>
                                    <span class="font-semibold text-gray-700">Minimum Quantity:</span>
                                    <p class="text-gray-600">{{ criteria.minQty || 'N/A' }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Status Result Cards -->
                <div v-if="!loading && redemption.status === 1" class="card mt-6 border-l-4 border-green-500 bg-green-50 shadow-sm">
                    <div class="flex items-center gap-2 mb-3">
                        <i class="pi pi-check-circle text-green-600 text-xl"></i>
                        <h3 class="font-bold text-green-700 text-lg">Redemption Approved</h3>
                    </div>
                    <div class="grid grid-cols-2 gap-3 text-xm">
                        <div>
                            <span class="font-semibold text-gray-700">Approved By:</span>
                            <p class="text-gray-600">{{ redemption.approvedBy || 'N/A' }}</p>
                        </div>
                        <div>
                            <span class="font-semibold text-gray-700">Approved Date:</span>
                            <p class="text-gray-600">{{ formatDate(redemption.verifiedDate) }}</p>
                        </div>
                    </div>
                </div>

                <div v-if="!loading && redemption.status === 2" class="card mt-6 border-l-4 border-red-500 bg-red-50 shadow-sm">
                    <div class="flex items-center gap-2 mb-3">
                        <i class="pi pi-times-circle text-red-600 text-xl"></i>
                        <h3 class="font-bold text-red-700 text-lg">Redemption Rejected</h3>
                    </div>
                    <div class="grid grid-cols-2 gap-3 text-xm">
                        <div>
                            <span class="font-semibold text-gray-700">Reason:</span>
                            <p class="text-gray-600">{{ redemption.rejectReason || 'No reason provided' }}</p>
                        </div>
                        <div>
                            <span class="font-semibold text-gray-700">Rejected Date:</span>
                            <p class="text-gray-600">{{ formatDate(redemption.rejectedDate) }}</p>
                        </div>
                    </div>
                </div>
            </div>


            <div class="md:w-1/3 flex flex-col" v-if="!loading">
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
                                    <td class="px-4 py-2 text-right">{{ redemption.refno || 'N/A' }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Member Code</td>
                                    <td class="px-4 py-2 text-right">{{ redemption.tc_member_code || 'N/A' }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Member Level</td>
                                    <td class="px-4 py-2 text-right">{{ redemption.memberLevel || 'N/A' }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Redeem Date</td>
                                    <td class="px-4 py-2 text-right">{{ formatDate(redemption.created) }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Verified Date</td>
                                    <td class="px-4 py-2 text-right">{{ formatDate(redemption.verifiedDate) }}</td>
                                </tr>
                                <tr class="border-b" v-if="redemption.status === 1">
                                    <td class="px-4 py-2 font-medium">Approved Date</td>
                                    <td class="px-4 py-2 text-right">{{ formatDate(redemption.verifiedDate) }}</td>
                                </tr>
                                <tr class="border-b" v-if="redemption.status === 2">
                                    <td class="px-4 py-2 font-medium">Rejected Date</td>
                                    <td class="px-4 py-2 text-right">{{ formatDate(redemption.rejectedDate) }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Points Used</td>
                                    <td class="px-4 py-2 text-right">{{ redemption.totalPoint || 0 }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Quantity</td>
                                    <td class="px-4 py-2 text-right">{{ redemption.quantity || 0 }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <!-- Action Buttons - Only show for pending status -->
                    <div v-if="redemption.status === 0" class="flex justify-end mt-4 pt-4">
                        <div class="flex gap-2">
                            <!-- Reject Button -->
                            <Button label="Reject" class="p-button-danger" @click="showRejectDialog = true" />

                            <!-- Approve Button -->
                            <Button label="Approve" class="p-button-success" @click="showApproveDialog = true" />
                        </div>
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
                    <Button label="Cancel" class="p-button-secondary p-button-sm" @click="closeRejectDialog" />
                    <Button label="Submit Rejection" class="p-button-danger p-button-sm" @click="submitReject" :disabled="!rejectReason.trim()" />
                </div>
            </template>
        </Dialog>

        <!-- Approval Confirmation Dialog -->
        <Dialog v-model:visible="showApproveDialog" modal header="Approve Redemption" :style="{ width: '400px' }" :breakpoints="{ '960px': '75vw', '641px': '90vw' }">
            <div class="flex flex-col gap-3">
                <div class="flex items-center gap-3">
                    <i class="pi pi-exclamation-triangle text-yellow-500 text-xl"></i>
                    <p class="text-gray-700">Are you sure you want to approve this redemption?</p>
                </div>
                <div class="bg-blue-50 p-3 rounded-md">
                    <p class="text-sm text-blue-700">
                        <strong>Item:</strong> {{ redemption.itemName || 'N/A' }}<br />
                        <strong>Recipient:</strong> {{ redemption.recipientName || 'N/A' }}<br />
                        <strong>Points:</strong> {{ redemption.totalPoint || 0 }}
                    </p>
                </div>
            </div>

            <template #footer>
                <div class="flex justify-end gap-3">
                    <Button label="Cancel" class="p-button-secondary p-button-sm" @click="showApproveDialog = false" />
                    <Button label="Confirm Approval" class="p-button-success p-button-sm" @click="submitApprove" />
                </div>
            </template>
        </Dialog>

        <!-- Toast Component for notifications -->
        <Toast />
    </Fluid>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import Dialog from 'primevue/dialog';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';
import api from '@/service/api';
import LoadingPage from '@/components/LoadingPage.vue';

const route = useRoute();
const toast = useToast();
const redemptionId = route.params.id;

const showRejectDialog = ref(false);
const showApproveDialog = ref(false);
const rejectReason = ref('');
const showValidationError = ref(false);
const loading = ref(true);
const processingAction = ref(false);

const redemption = ref({
    id: null,
    refno: '',
    tc_userID: '',
    memberLevel: '',
    recipientName: '',
    contactNumber: '',
    addLine1: '',
    addLine2: '',
    addCity: '',
    addState: '',
    addPostcode: '',
    addCountry: '',
    totalPoint: 0,
    itemName: '',
    quantity: 0,
    redemptionDate: '',
    courierName: '',
    trackingNumber: '',
    shippedDate: '',
    status: 0,
    adminID: '',
    approvedBy: '',
    verifiedDate: '',
    created: '',
    deleted: false,
    approvedDate: null,
    rejectedDate: null,
    rejectReason: null,
    tc_member_code: ''
});

const campaignCriteria = ref([]);

// Fetch redemption details from API
const fetchRedemptionDetails = async () => {
    try {
        loading.value = true;
        const response = await api.get(`redeem/item/${redemptionId}`);

        if (response.data.status === 1 && response.data.admin_data) {
            const redemptionData = response.data.admin_data.redemption_details;
            
            // Map API data to component structure
            redemption.value = {
                id: redemptionData.id,
                refno: redemptionData.refno,
                tc_userID: redemptionData.tc_userID,
                memberLevel: redemptionData.memberLevel,
                recipientName: redemptionData.recipientName,
                contactNumber: redemptionData.contactNumber,
                addLine1: redemptionData.addLine1,
                addLine2: redemptionData.addLine2,
                addCity: redemptionData.addCity,
                addState: redemptionData.addState,
                addPostcode: redemptionData.addPostcode,
                addCountry: redemptionData.addCountry,
                totalPoint: redemptionData.totalPoint,
                itemName: redemptionData.redeem_item,
                quantity: redemptionData.quantity,
                redemptionDate: redemptionData.created,
                courierName: redemptionData.courierName,
                trackingNumber: redemptionData.trackingNumber,
                shippedDate: redemptionData.shippedDate,
                status: redemptionData.status,
                adminID: redemptionData.adminID,
                approvedBy: redemptionData.approvedBy,
                verifiedDate: redemptionData.verifiedDate,
                created: redemptionData.created,
                deleted: redemptionData.deleted,
                approvedDate: redemptionData.approvedDate,
                rejectedDate: redemptionData.rejectedDate,
                rejectReason: redemptionData.rejectReason,
                tc_member_code: redemptionData.tc_member_code
            };

            // Set campaign criteria if available
            campaignCriteria.value = response.data.admin_data.campaign_criteria || [];
        } else {
            console.error('API returned error or invalid data:', response.data);
            toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to load redemption details', life: 3000 });
        }
    } catch (error) {
        console.error('Error fetching redemption details:', error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to load redemption details', life: 3000 });
    } finally {
        loading.value = false;
    }
};

// Close dialog and reset form
const closeRejectDialog = () => {
    showRejectDialog.value = false;
    rejectReason.value = '';
    showValidationError.value = false;
};

// Reject submission handler
const submitReject = async () => {
    if (!rejectReason.value.trim()) {
        showValidationError.value = true;
        return;
    }

    processingAction.value = true;

    try {
        // API call to verify redemption with status 2 (Rejected)
        const response = await api.post(`redeem/verify/${redemptionId}`, {
            status: 2, // Rejected status
            reject_reason: rejectReason.value // Required for status 2
        });

        if (response.data.status === 1) {
            // Update local state
            redemption.value.status = 2; // Rejected status
            redemption.value.rejectedDate = new Date().toISOString();
            redemption.value.rejectReason = rejectReason.value;

            // Show success message
            toast.add({ severity: 'success', summary: 'Success', detail: 'Redemption has been rejected successfully', life: 3000 });
            
            // Refresh data to get updated information from server
            fetchRedemptionDetails();
        } else {
            console.error('Failed to reject redemption:', response.data);
            toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to reject redemption', life: 3000 });
        }
    } catch (error) {
        console.error('Error rejecting redemption:', error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to reject redemption', life: 3000 });
    } finally {
        processingAction.value = false;
        closeRejectDialog();
    }
};

// Approve submission handler
const submitApprove = async () => {
    processingAction.value = true;

    try {
        // API call to verify redemption with status 1 (Approved)
        const response = await api.post(`redeem/verify/${redemptionId}`, {
            status: 1 // Approved status
            // No reject_reason needed for approval
        });

        if (response.data.status === 1) {
            // Update local state
            redemption.value.status = 1; // Approved status
            redemption.value.approvedDate = new Date().toISOString();

            // Show success message
            toast.add({ severity: 'success', summary: 'Success', detail: 'Redemption has been approved successfully', life: 3000 });
            
            // Refresh data to get updated information from server
            fetchRedemptionDetails();
        } else {
            console.error('Failed to approve redemption:', response.data);
            toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to approve redemption', life: 3000 });
        }
    } catch (error) {
        console.error('Error approving redemption:', error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to approve redemption', life: 3000 });
    } finally {
        processingAction.value = false;
        showApproveDialog.value = false;
    }
};

// Helper functions for status label
const statusLabel = (status) => {
    const statusMap = {
        0: 'Pending',
        1: 'Approved',
        2: 'Rejected',
        3: 'Processing',
        4: 'Delivery',
        5: 'Redeemed (Yet to Use)',
        10: 'Completed'
    };
    return statusMap[status] || 'Unknown';
};

const statusSeverity = (status) => {
    const severityMap = {
        0: 'warning',   // Pending
        1: 'success',   // Approved
        2: 'danger',    // Rejected
        3: 'info',      // Processing
        4: 'primary',   // Delivery
        5: 'secondary', // Redeemed (Yet to Use)
        10: 'success'   // Completed
    };
    return severityMap[status] || 'secondary';
};

// Date formatting function
const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    // Handle different date formats from API
    try {
        // If date is in DD-MM-YYYY format
        if (dateString.includes('-')) {
            const [day, month, year] = dateString.split('-');
            const date = new Date(`${year}-${month}-${day}`);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        }
        
        // If date is in ISO format or other standard format
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    } catch (error) {
        console.error('Error formatting date:', error);
        return dateString; // Return original string if parsing fails
    }
};

// Fetch data when component mounts
onMounted(() => {
    fetchRedemptionDetails();
});
</script>