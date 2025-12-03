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
            </div>


            <div class="md:w-1/3 flex flex-col" v-if="!loading">
                <div class="card flex flex-col w-full">
                    <!-- Header with Status Tag -->
                    <div class="flex items-center justify-between border-b pb-2 mb-2">
                        <h2 class="text-2xl font-bold text-gray-800">Advance Info</h2>
                        <!-- <Tag :value="statusLabel(redemption.status)" :severity="statusSeverity(redemption.status)" /> -->
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
                            <!-- <Button label="Reject" class="p-button-danger" @click="showRejectDialog = true" /> -->

                            <!-- Approve Button -->
                            <!-- <Button label="Approve" class="p-button-success" @click="showApproveDialog = true" /> -->
                        </div>
                    </div>
                </div>
            </div>
        </div>


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