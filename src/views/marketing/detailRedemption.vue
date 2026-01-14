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
                            <div class="text-2xl font-bold text-gray-800">Redemption Management Details</div>
                        </div>

                        <!-- Right Section: Edit & Delete Buttons -->
                        <div class="inline-flex items-center gap-2">
                            <RouterLink v-if="canUpdate" :to="`/marketing/editRedemption/${redemptionId}`">
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
                                <p class="text-lg font-medium">{{ redemption.redeem_item?.recipientName || 'N/A' }}</p>
                            </div>
                            <div>
                                <span class="block text-sm font-bold text-gray-700">Contact</span>
                                <p class="text-lg text-gray-500">{{ redemption.redeem_item?.contactNumber || 'N/A' }}</p>
                            </div>
                            <div>
                                <span class="block text-sm font-bold text-gray-700">Redeemed Item</span>
                                <p class="text-lg text-gray-500">{{ redemption.type || 'N/A' }}</p>
                            </div>
                            <div>
                                <span class="block text-sm font-bold text-gray-700">Approved By</span>
                                <p class="text-lg text-gray-500">{{ redemption.redeem_item?.approvedBy || 'N/A' }} ({{ redemption.adminID || 'N/A' }})</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Shipping Details -->
                <div class="card flex flex-col gap-6 w-full" v-if="!loading">
                    <!-- Header Section -->
                    <div class="flex items-center justify-between border-b pb-2">
                        <h2 class="text-2xl font-bold text-gray-800">User Details</h2>
                    </div>

                    <!-- Shipping Info -->
                    <div class="grid grid-cols-4 gap-2 text-sm">
                        <div class="col-span-2">
                            <span class="text-sm font-bold text-gray-700">Name</span>
                            <p class="text-lg font-medium">{{ redemption.user?.firstName || 'N/A' }} {{ redemption.user?.lastName || 'N/A' }}</p>
                        </div>
                        <div class="col-span-2">
                            <span class="text-sm font-bold text-gray-700">Contact</span>
                            <p class="text-lg font-medium">{{ redemption.user?.countryCode || 'N/A' }} {{ redemption.user?.mobileNumber || 'N/A' }}</p>
                        </div>
                        <div class="col-span-2">
                            <span class="text-sm font-bold text-gray-700">Email Address</span>
                            <p class="text-lg font-medium">{{ redemption.user?.emailAddress || 'Not Assigned' }}</p>
                        </div>
                        <div class="col-span-2">
                            <span class="text-sm font-bold text-gray-700">Gender</span>
                            <p class="text-lg font-medium">{{ redemption.user?.gender || 'Not Assigned' }}</p>
                        </div>
                         <div class="col-span-2">
                            <span class="text-sm font-bold text-gray-700">Date of Birth</span>
                            <p class="text-lg font-medium">{{ redemption.user?.dob || 'Not Assigned' }}</p>
                        </div>
                        <div class="col-span-2">
                            <span class="text-sm font-bold text-gray-700">Race</span>
                            <p class="text-lg font-medium">{{ redemption.user?.race || 'Not Assigned' }}</p>
                        </div>
                         <div class="col-span-2">
                            <span class="text-sm font-bold text-gray-700">Address</span>
                            <p class="text-lg font-medium">{{ redemption.user?.address1 || 'Not Assigned' }}</p>
                        </div>
                        <div class="col-span-2">
                            <span class="text-sm font-bold text-gray-700">city</span>
                            <p class="text-lg font-medium">{{ redemption.user?.city || 'Not Assigned' }}</p>
                        </div>
                         <div class="col-span-2">
                            <span class="text-sm font-bold text-gray-700">State</span>
                            <p class="text-lg font-medium">{{ redemption.user?.state || 'Not Assigned' }}</p>
                        </div>
                        <div class="col-span-2">
                            <span class="text-sm font-bold text-gray-700">Postcode</span>
                            <p class="text-lg font-medium">{{ redemption.user?.postcode || 'Not Assigned' }}</p>
                        </div>
                    </div>
                </div>
                <!-- Shipping Details -->
                <div class="card flex flex-col gap-6 w-full" v-if="!loading">
                    <!-- Header Section -->
                    <div class="flex items-center justify-between border-b pb-2">
                        <h2 class="text-2xl font-bold text-gray-800">Shipping Details</h2>
                    </div>

                    <!-- Shipping Info -->
                    <div class="grid grid-cols-4 gap-2 text-sm">
                        <div class="col-span-4">
                            <span class="text-sm font-bold text-gray-700">Shipping Date</span>
                            <p class="text-lg font-medium">{{ redemption.redeem_item?.shippedDate || 'Not Shipped' }}</p>
                        </div>
                        <div class="col-span-2">
                            <span class="block text-sm font-bold text-gray-700">Recipient</span>
                            <p class="text-lg font-medium">{{ redemption.redeem_item?.recipientName || 'N/A' }}</p>
                        </div>
                        <div class="col-span-2">
                            <span class="block text-sm font-bold text-gray-700">Contact</span>
                            <p class="text-lg font-medium">{{ redemption.redeem_item?.contactNumber || 'N/A' }}</p>
                        </div>
                        <div class="col-span-2">
                            <span class="block text-sm font-bold text-gray-700">Courier</span>
                            <p class="text-lg font-medium">{{ redemption.redeem_item?.courierName || 'Not Assigned' }}</p>
                        </div>
                        <div class="col-span-2">
                            <span class="block text-sm font-bold text-gray-700">Tracking No</span>
                            <p class="text-lg font-medium">{{ redemption.redeem_item?.trackingNumber || 'Not Assigned' }}</p>
                        </div>
                        <div class="col-span-4">
                            <span class="text-sm font-bold text-gray-700">Delivery Location</span>
                            <p class="text-lg font-medium">
                                {{ [redemption.redeem_item?.addLine1, redemption.redeem_item?.addLine2, redemption.redeem_item?.addCity, redemption.redeem_item?.addState, redemption.redeem_item?.addPostcode, redemption.redeem_item?.addCountry]
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
                                    <td class="px-4 py-2 text-right">{{ redemption.user?.memberCode || 'N/A' }}</td>
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
                                    <td class="px-4 py-2 text-right">{{ formatDate(redemption.redeem_item?.verifiedDate) }}</td>
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
                                    <td class="px-4 py-2 text-right">{{ redemption.point || 0 }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Quantity</td>
                                    <td class="px-4 py-2 text-right">{{ redemption.qty || 0 }}</td>
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
import { ref, onMounted, computed, watch, onActivated } from 'vue';
import { useRoute } from 'vue-router';
import Dialog from 'primevue/dialog';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';
import api from '@/service/api';
import LoadingPage from '@/components/LoadingPage.vue';
import { useMenuStore } from '@/store/menu';
 
const menuStore = useMenuStore();
const canUpdate = computed(() => menuStore.canWrite('Redemption Management'));
const denyAccess = computed(() => menuStore.canTest('Redemption Management'));

const route = useRoute();
const toast = useToast();
const redemptionId = route.params.id;

const showRejectDialog = ref(false);
const showApproveDialog = ref(false);
const rejectReason = ref('');
const showValidationError = ref(false);
const loading = ref(true);
const processingAction = ref(false);

const redemption = ref({});

// Fetch redemption details from API with cache prevention
const fetchRedemptionDetails = async (forceRefresh = false) => {
    try {
        loading.value = true;
        
        // Add timestamp to prevent browser caching
        const timestamp = Date.now();
        const response = await api.get(`redeem/item/${redemptionId}?_t=${timestamp}`);

        if (response.data.status === 1 && response.data.admin_data) {
            const redemptionData = response.data.admin_data.redemption_details;
            
            // Map API data to component structure
            redemption.value = response.data.admin_data.redemption_details;
            
            // Debug log to check data structure
            console.log('Fetched redemption data:', redemption.value);
            console.log('Shipping details:', redemption.value.redeem_item);
        } else {
            toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to load redemption details', life: 3000 });
        }
    } catch (error) {
        console.error('Error fetching redemption details:', error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to load redemption details', life: 3000 });
    } finally {
        loading.value = false;
    }
};

// Watch for route changes to refresh data
watch(
    () => route.query.t,
    (newTimestamp) => {
        if (newTimestamp) {
            // Refresh data when timestamp query parameter changes
            fetchRedemptionDetails(true);
        }
    }
);

// Refresh when component is activated (comes back into view)
onActivated(() => {
    fetchRedemptionDetails();
});

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