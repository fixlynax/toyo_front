<template>
    <Fluid>
        <div class="flex flex-col md:flex-row gap-8">
            <div class="md:w-2/3">
                <!-- Header -->
                <div class="flex flex-col md:flex-row gap-8">
                    <div class="card flex flex-col gap-6 w-full">
                        <div class="flex items-center justify-between gap-4 border-b pb-2">
                            <div class="flex items-center gap-2">
                                <RouterLink to="/marketing/listEtenUser">
                                    <Button icon="pi pi-arrow-left font-bold" class="p-button-text p-button-secondary text-xl" size="big" v-tooltip="'Back'" />
                                </RouterLink>
                                <span class="text-2xl font-bold text-gray-800">Member Information</span>
                            </div>

                            <div class="flex items-center gap-2">
                                <!-- Edit Button -->
                                <RouterLink v-if="canUpdate" :to="`/marketing/editEtenUser/${memberId}`">
                                    <Button type="button" label="Edit" />
                                </RouterLink>
                            </div>
                        </div>

                        <!-- Loading State -->
                        <LoadingPage v-if="loading" :message="'Loading User Details...'" :sub-message="'Fetching member data'" />

                        <div v-else class="space-y-6">
                            <!-- Header Section -->
                            <div class="flex items-center justify-between w-full">
                                <!-- Account No -->
                                <div>
                                    <span class="block text-xm font-bold text-black-700">Member Code.</span>
                                    <span class="text-lg font-medium">{{ memberDetail.memberCode || '-' }}</span>
                                </div>
                            </div>

                            <!-- Personal Information Card -->
                            <div class="font-semibold text-xl border-b pb-2 mt-8">👤 Account Details</div>
                            <div class="p-4 space-y-4">
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div class="space-y-1">
                                        <span class="block text-sm font-medium text-gray-600">Full Name</span>
                                        <p class="text-base font-semibold text-gray-800">{{ memberDetail.firstName }} {{ memberDetail.lastName }}</p>
                                    </div>
                                    <div class="space-y-1">
                                        <span class="block text-sm font-medium text-gray-600">Gender</span>
                                        <p class="text-base font-semibold text-gray-800">{{ formatGender(memberDetail.gender) }}</p>
                                    </div>
                                </div>
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div class="space-y-1">
                                        <span class="block text-sm font-medium text-gray-600">Date of Birth</span>
                                        <p class="text-base font-semibold text-gray-800">{{ formatDate(memberDetail.dob) }}</p>
                                    </div>
                                    <div class="space-y-1">
                                        <span class="block text-sm font-medium text-gray-600">Race</span>
                                        <p class="text-base font-semibold text-gray-800">{{ memberDetail.race || '-' }}</p>
                                    </div>
                                    <div class="space-y-1">
                                        <span class="block text-sm font-medium text-gray-600">Email Address</span>
                                        <p class="text-base font-semibold text-gray-800 flex items-center gap-2">
                                            <i class="pi pi-envelope text-gray-400"></i>
                                            {{ memberDetail.emailAddress || '-' }}
                                        </p>
                                    </div>
                                    <div class="space-y-1">
                                        <span class="block text-sm font-medium text-gray-600">Mobile Number</span>
                                        <p class="text-base font-semibold text-gray-800 flex items-center gap-2">
                                            <i class="pi pi-mobile text-gray-400"></i>
                                            +{{ memberDetail.countryCode }} {{ memberDetail.mobileNumber }}
                                        </p>
                                    </div>
                                    <div class="space-y-1">
                                        <span class="block text-sm font-medium text-gray-600">City</span>
                                        <p class="text-base font-semibold text-gray-800">{{ memberDetail.city || '-' }}</p>
                                    </div>
                                    <div class="space-y-1">
                                        <span class="block text-sm font-medium text-gray-600">State</span>
                                        <p class="text-base font-semibold text-gray-800">{{ memberDetail.state || '-' }}</p>
                                    </div>

                                    <div class="space-y-1">
                                        <span class="block text-sm font-medium text-gray-600">Postcode</span>
                                        <p class="text-base font-semibold text-gray-800">{{ memberDetail.postcode || '-' }}</p>
                                    </div>
                                    <div class="space-y-1">
                                        <span class="block text-sm font-medium text-gray-600">Country</span>
                                        <p class="text-base font-semibold text-gray-800">{{ memberDetail.country || '-' }}</p>
                                    </div>
                                    <div class="space-y-1">
                                        <span class="block text-sm font-medium text-gray-600">Member Level</span>
                                        <p class="text-base font-semibold text-gray-800">
                                            <Tag :value="memberDetail.memberLevel || 'N/A'" severity="info" />
                                        </p>
                                    </div>
                                    <div class="space-y-1">
                                        <span class="block text-sm font-medium text-gray-600">Referrer Code</span>
                                        <p class="text-base font-semibold text-gray-800">{{ memberDetail.referrerCode || '-' }}</p>
                                    </div>
                                    <div class="space-y-1">
                                        <span class="block text-sm font-medium text-gray-600">Member Since</span>
                                        <p class="text-base font-semibold text-gray-800 flex items-center gap-2">
                                            <i class="pi pi-calendar text-gray-400"></i>
                                            {{ formatDateTime(memberDetail.created) }}
                                        </p>
                                    </div>
                                    <div class="space-y-1">
                                        <span class="block text-sm font-medium text-gray-600">Last Login</span>
                                        <p class="text-base font-semibold text-gray-800 flex items-center gap-2">
                                            <i class="pi pi-clock text-gray-400"></i>
                                            {{ formatDateTime(memberDetail.lastLogin) }}
                                        </p>
                                    </div>
                                    <div class="space-y-1">
                                        <span class="block text-sm font-medium text-gray-600">Activated Date</span>
                                        <p class="text-base font-semibold text-gray-800">{{ formatDateTime(memberDetail.activated) }}</p>
                                    </div>
                                    <div class="space-y-1">
                                        <span class="block text-sm font-medium text-gray-600">Device</span>
                                        <p class="text-base font-semibold text-gray-800">{{ memberDetail.device || '-' }}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Warranty Certificates Section -->
                <div class="flex flex-col md:flex-row gap-8">
                    <div class="card flex flex-col gap-6 w-full">
                        <div class="flex items-center gap-4 border-b pb-2">
                            <span class="text-2xl font-bold text-gray-800">Warranty Certificates</span>
                        </div>

                        <!-- Loading State -->
                        <LoadingPage v-if="loading" :message="'Loading User Details...'" :sub-message="'Fetching member data'" />

                        <!-- No Warranty Certificates -->
                        <div v-else-if="!memberDetail.warrantyCerts || memberDetail.warrantyCerts.length === 0" class="p-6 text-center">
                            <div class="text-gray-500 mb-2">No warranty certificates found</div>
                            <div class="text-gray-400 text-sm">This member has not registered any warranty certificates</div>
                        </div>

                        <!-- Warranty Certificates List -->
                        <div v-else class="p-4 space-y-4">
                            <div class="grid grid-cols-3 gap-4">
                                <!-- Certificate Item -->
                                <div v-for="cert in memberDetail.warrantyCerts" :key="cert.id" class="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:bg-gray-100 transition-colors">
                                    <div class="flex justify-between items-start">
                                        <!-- Left Side: Certificate Info -->
                                        <div class="space-y-3">
                                            <div>
                                                <span class="block text-xm font-medium text-gray-500">Warranty Certificate No</span>
                                                <p class="text-base font-semibold text-gray-800">{{ cert.warrantyCertNo }}</p>
                                            </div>
                                            <div>
                                                <span class="block text-xm font-medium text-gray-500">Expiry Date</span>
                                                <p class="text-base font-semibold text-gray-800">{{ cert.expiredDate }}</p>
                                            </div>
                                            <div class="flex items-center gap-3">
                                                <div>
                                                    <Tag :value="cert.type" :severity="cert.type === 'NORMAL' ? 'success' : 'warning'" size="small" />
                                                </div>
                                                <div>
                                                    <Tag v-if="Number(cert.isTWP) === 1" value="TWP" severity="info" />
                                                </div>
                                            </div>
                                        </div>

                                        <!-- Right Side: Action Button -->
                                        <div class="flex flex-col items-end gap-2">
                                            <RouterLink :to="cert.type === 'NORMAL' ? `/marketing/detailWarrantyRegistration/${cert.id}` : `/marketing/detailOERegistration/${cert.id}`">
                                                <Button
                                                    :label="cert.type === 'NORMAL' ? 'View Details' : 'View OE Details'"
                                                    icon="pi pi-external-link"
                                                    size="small"
                                                    class="p-button-outlined"
                                                    :class="cert.type === 'NORMAL' ? 'p-button-primary' : 'p-button-warning'"
                                                />
                                            </RouterLink>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="md:w-1/3">
                <!-- Account Info -->
                <div class="card flex flex-col w-full">
                    <!-- Title -->
                    <div class="flex items-center justify-between border-b pb-2 mb-2">
                        <div class="text-2xl font-bold text-gray-800">Account Info</div>
                        <Tag :value="getStatusText(memberDetail.status)" :severity="getStatusSeverity(memberDetail.status)" />
                    </div>

                    <!-- Loading State for Account Info -->
                    <div v-if="loading" class="text-center py-8">
                        <ProgressSpinner style="width: 30px; height: 30px" />
                    </div>

                    <!-- Table -->
                    <div v-else class="overflow-x-auto">
                        <table class="w-full text-sm text-left text-gray-700">
                            <tbody>
                                <!-- Latest Point -->
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Latest Point</td>
                                    <td class="px-4 py-2 text-right">{{ memberDetail.lastest_point || '0' }}</td>
                                </tr>

                                <!-- Delete Status -->
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Account Status</td>
                                    <td class="px-4 py-2 text-right">
                                        {{ memberDetail.deleted ? 'Deleted' : 'Active' }}
                                    </td>
                                </tr>

                                <!-- Delete Reason -->
                                <tr v-if="memberDetail.deleteReason" class="border-b">
                                    <td class="px-4 py-2 font-medium">Delete Reason</td>
                                    <td class="px-4 py-2 text-right">{{ memberDetail.deleteReason }}</td>
                                </tr>

                                <!-- Activation Status -->
                                <tr>
                                    <td class="px-4 py-2 font-medium">Account Status</td>
                                    <td class="px-2 py-2 text-right">
                                        <Button
                                            v-if="canUpdate"
                                            :label="memberDetail.status === 0 ? 'Inactive' : 'Active'"
                                            :severity="memberDetail.status === 0 ? 'danger' : 'success'"
                                            size="small"
                                            @click="toggleStatus"
                                            :disabled="loadingAction"
                                            :icon="memberDetail.status === 0 ? 'pi pi-ban' : 'pi pi-check'"
                                        />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Point Transactions -->
                <div class="card flex flex-col w-full">
                    <div class="text-2xl font-bold text-gray-800 border-b pb-2 mb-3">Point Transactions</div>

                    <div v-if="loading" class="text-center py-8">
                        <ProgressSpinner style="width: 30px; height: 30px" />
                    </div>

                    <div v-else class="overflow-x-auto">
                        <!-- If no transactions -->
                        <div v-if="!memberDetail.point_transactions || memberDetail.point_transactions.length === 0" class="text-center py-4 text-gray-500">No point transactions available</div>

                        <!-- Display limited transactions (first 5) -->
                        <div v-else class="space-y-4">
                            <div class="flex justify-between items-center mb-2">
                                <div class="text-sm font-medium">Recent Transactions</div>
                                <Button v-if="memberDetail.point_transactions.length > 5" label="View All" icon="pi pi-eye" class="p-button-text p-button-sm" @click="showAllTransactions = true" />
                            </div>

                            <!-- Transaction List - Show only first 5 -->
                            <div class="grid grid-cols-2 gap-4">
                                <div v-for="(transaction, index) in limitedTransactions" :key="transaction.id || index" class="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                    <!-- First Row: Ref No + Points -->
                                    <div class="flex justify-between items-center mb-2">
                                        <div class="space-y-1">
                                            <span class="block text-xs font-medium text-gray-500">Ref No</span>
                                            <span class="text-sm font-semibold text-gray-800">{{ transaction.refno || '-' }}</span>
                                        </div>
                                        <div class="text-right space-y-1">
                                            <span class="block text-xs font-medium text-gray-500">Points</span>
                                            <span :class="['text-sm font-bold', transaction.transactionType === 'EARN' ? 'text-green-600' : 'text-red-600']">
                                                {{ transaction.transactionType === 'EARN' ? '+' : '-' }}{{ transaction.point || '0' }}
                                            </span>
                                        </div>
                                    </div>

                                    <!-- Second Row: Description -->
                                    <div class="border-t border-gray-100">
                                        <div class="space-y-1">
                                            <span class="block text-xs font-medium text-gray-500">Description</span>
                                            <span class="text-sm text-gray-700">{{ transaction.desc || '-' }}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Show limited transaction count -->
                            <div class="mt-6 pt-4 border-t border-gray-200 text-center">
                                <div class="text-sm text-gray-500">Showing {{ Math.min(memberDetail.point_transactions.length, 5) }} of {{ memberDetail.point_transactions.length }} transaction(s)</div>
                                <div class="text-xs text-gray-400 mt-1">Latest transactions are shown first</div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Dialog for showing all transactions in 3-column layout -->
                <Dialog v-model:visible="showAllTransactions" modal :style="{ width: '90vw', maxWidth: '1200px' }" header="All Point Transactions">
                    <div class="max-h-[70vh] overflow-y-auto pr-2">
                        <div v-if="memberDetail.point_transactions.length === 0" class="text-center py-8 text-gray-500">No transactions available</div>

                        <!-- 3-column grid layout -->
                        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div v-for="(transaction, index) in memberDetail.point_transactions" :key="transaction.id || index" class="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:bg-gray-100 transition-colors">
                                <!-- Header Row: Ref No and Points -->
                                <div class="flex justify-between items-start mb-3">
                                    <div class="space-y-1">
                                        <span class="block text-xs font-medium text-gray-500">Ref No</span>
                                        <span class="text-sm font-semibold text-gray-800 break-all">{{ transaction.refno || '-' }}</span>
                                    </div>
                                    <div class="text-right space-y-1">
                                        <span class="block text-xs font-medium text-gray-500">Points</span>
                                        <span :class="['text-sm font-bold', transaction.transactionType === 'EARN' ? 'text-green-600' : 'text-red-600']"> {{ transaction.transactionType === 'EARN' ? '+' : '-' }}{{ transaction.point || '0' }} </span>
                                    </div>
                                </div>

                                <!-- Description Section -->
                                <div class="mb-3">
                                    <span class="block text-xs font-medium text-gray-500 mb-1">Description</span>
                                    <span class="text-sm text-gray-700 line-clamp-2">{{ transaction.desc || '-' }}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Footer with summary -->
                    <template #footer>
                        <div class="flex justify-between items-center w-full">
                            <div class="text-sm text-gray-600">Total: {{ memberDetail.point_transactions.length }} transaction(s)</div>
                            <Button label="Close" icon="pi pi-times" severity="primary" class="text-sm px-3 py-2" @click="showAllTransactions = false" />
                        </div>
                    </template>
                </Dialog>

                <!-- Device List -->
                <div class="card flex flex-col w-full">
                    <div class="text-2xl font-bold text-gray-800 border-b pb-2 mb-3">Device Information</div>

                    <div v-if="loading" class="text-center py-8">
                        <ProgressSpinner style="width: 30px; height: 30px" />
                    </div>

                    <div v-else class="overflow-x-auto">
                        <table class="w-full text-sm text-left">
                            <tbody>
                                <tr v-if="memberDetail.device && memberDetail.device !== '-'" class="border-b">
                                    <td class="px-4 py-3">
                                        <div class="flex items-center gap-2 text-gray-800 font-bold">
                                            <i class="pi pi-mobile text-primary-500"></i>
                                            {{ formatDevice(memberDetail.device) }}
                                        </div>
                                        <div class="ml-6 text-gray-500 text-xs mt-2">
                                            <div>Platform: {{ memberDetail.device }}</div>
                                            <div>FCM Token: {{ memberDetail.fcmToken ? 'Available' : 'Not available' }}</div>
                                            <div>Last Active: {{ formatDateTime(memberDetail.lastLogin) }}</div>
                                        </div>
                                    </td>
                                </tr>
                                <tr v-else>
                                    <td class="px-4 py-4 text-center text-gray-500">No device information available</td>
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
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import api from '@/service/api';
import LoadingPage from '@/components/LoadingPage.vue';
import { useMenuStore } from '@/store/menu';

const menuStore = useMenuStore();
const canUpdate = computed(() => menuStore.canWrite('Member List'));
const denyAccess = computed(() => menuStore.canTest('Member List'));

const route = useRoute();
const toast = useToast();
const memberId = ref(route.params.id);
const loading = ref(true);
const loadingAction = ref(false);

// Add ref for dialog visibility
const showAllTransactions = ref(false);

// Add computed property for limited transactions
import { computed } from 'vue';

const limitedTransactions = computed(() => {
    if (!memberDetail.value.point_transactions) return [];
    // Return only first 5 transactions
    return memberDetail.value.point_transactions.slice(0, 5);
});

// Member detail data
const memberDetail = ref({
    id: null,
    memberCode: '',
    memberLevel: '',
    firstName: '',
    lastName: '',
    countryCode: '',
    mobileNumber: '',
    emailAddress: '',
    gender: '',
    dob: '',
    race: '',
    city: '',
    state: '',
    postcode: '',
    country: '',
    referrerCode: '',
    referrerType: '',
    device: '',
    platform: '',
    fcmToken: '',
    status: 0,
    lastLogin: '',
    activated: '',
    created: '',
    deleteReason: null,
    deleted: null,
    mobile_number: '',
    lastest_point: '',
    warrantyCerts: [],
    point_transactions: []
});

// Fetch member details from API
const fetchMemberDetail = async () => {
    try {
        loading.value = true;

        const response = await api.get(`cares/user/${memberId.value}`);

        if (response.data.status === 1) {
            // Extract data from response structure
            const apiData = response.data;

            // Combine data from admin_data and root level
            const userData = {
                ...apiData, // Root level data
                ...(apiData.admin_data || {}) // admin_data properties (will override root if duplicates)
            };

            // Map API response to component data structure
            memberDetail.value = {
                id: userData.id,
                memberCode: userData.memberCode || '-',
                memberLevel: userData.memberLevel || '-',
                firstName: userData.firstName || '-',
                lastName: userData.lastName || '-',
                countryCode: userData.countryCode || '60',
                mobileNumber: userData.mobileNumber || userData.mobile_number || '-',
                emailAddress: userData.emailAddress || '-',
                gender: userData.gender || '-',
                dob: userData.dob || '-',
                race: userData.race || '-',
                city: userData.city || '-',
                state: userData.state || '-',
                postcode: userData.postcode || '-',
                country: userData.country || '-',
                referrerCode: userData.referrerCode || '-',
                referrerType: userData.referrerType || '-',
                device: userData.device || '-',
                platform: userData.platform || 'Web',
                fcmToken: userData.fcmToken || '',
                status: userData.status || 0,
                lastLogin: userData.lastLogin || '-',
                activated: userData.activated || '-',
                created: userData.created || '-',
                deleteReason: userData.deleteReason,
                deleted: userData.deleted,
                mobile_number: userData.mobile_number || '-',
                lastest_point: userData.lastest_point || '0',
                warrantyCerts: userData.warrantyCerts || [],
                point_transactions: userData.point_transactions || []
            };
        } else {
            console.error('API returned error:', response.data);
            showToast('error', 'Error', 'Failed to load user details');
        }
    } catch (error) {
        console.error('Error fetching member details:', error);
        showToast('error', 'Error', 'Failed to load user details');
    } finally {
        loading.value = false;
    }
};

// Format gender display
const formatGender = (gender) => {
    if (!gender || gender === '-') return '-';
    if (gender === 'M' || gender === 'Male') return 'Male';
    if (gender === 'F' || gender === 'Female') return 'Female';
    return gender;
};

// Format date (remove time if present)
function formatDate(dateString) {
    if (!dateString) return '-';

    const date = new Date(dateString); // Works for ISO, YYYY-MM-DD, YYYY-MM-DDTHH

    if (isNaN(date)) return '-';

    return date.toLocaleDateString('en-MY', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
}

function formatDateTime(dateTimeString) {
    if (!dateTimeString) return '-';

    // Replace space with T if needed
    const normalized = dateTimeString.includes('T') ? dateTimeString : dateTimeString.replace(' ', 'T');

    const date = new Date(normalized);

    if (isNaN(date)) return '-';

    return date.toLocaleString('en-MY', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    });
}

// Format device display
const formatDevice = (deviceInfo) => {
    if (!deviceInfo || deviceInfo === '-') return 'Unknown Device';

    const deviceMap = {
        iOS: 'Apple iPhone/iPad',
        Android: 'Android Device',
        web: 'Web Browser',
        Web: 'Web Browser'
    };

    return deviceMap[deviceInfo] || deviceInfo;
};

// Get status text
const getStatusText = (status) => {
    return status === 1 ? 'Active' : 'Inactive';
};

// Get status severity for tag
const getStatusSeverity = (status) => {
    return status === 1 ? 'success' : 'danger';
};

// Show toast notification
const showToast = (severity, summary, detail) => {
    toast.add({
        severity: severity,
        summary: summary,
        detail: detail,
        life: 3000
    });
};

// Toggle status (active/inactive)
const toggleStatus = async () => {
    try {
        loadingAction.value = true;

        // Call the API to toggle status
        const response = await api.put(`cares/toggleInactive/${memberId.value}`);

        if (response.data.status === 1) {
            // Toggle the local status (1 = active, 0 = inactive)
            const newStatus = memberDetail.value.status === 1 ? 0 : 1;
            memberDetail.value.status = newStatus;

            // Show success message
            const action = newStatus === 1 ? 'activated' : 'deactivated';
            showToast('success', 'Success', `User ${action} successfully`);
        } else {
            console.warn('Status toggle failed:', response.data);
            showToast('error', 'Error', 'Failed to update user status');
        }
    } catch (error) {
        console.error('Error toggling status:', error);
        showToast('error', 'Error', 'Failed to update user status');
    } finally {
        loadingAction.value = false;
    }
};

// Fetch member details when component mounts
onMounted(() => {
    fetchMemberDetail();
});
</script>

<style scoped>
.card {
    box-shadow:
        0 1px 3px 0 rgba(0, 0, 0, 0.1),
        0 1px 2px 0 rgba(0, 0, 0, 0.06);
}

.bg-gray-50 {
    background-color: #f9fafb;
}

.border-gray-200 {
    border-color: #e5e7eb;
}

.text-primary-600 {
    color: #2563eb;
}

.text-primary-500 {
    color: #3b82f6;
}

.shadow-sm {
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

.space-y-6 > * + * {
    margin-top: 1.5rem;
}

.space-y-4 > * + * {
    margin-top: 1rem;
}

.space-y-1 > * + * {
    margin-top: 0.25rem;
}

.text-green-600 {
    color: #059669;
}

.text-red-600 {
    color: #dc2626;
}
/* Add line-clamp utility for description truncation */
.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
}

/* Custom scrollbar for dialog */
::-webkit-scrollbar {
    width: 8px;
}

::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
}

::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
    background: #555;
}
</style>
