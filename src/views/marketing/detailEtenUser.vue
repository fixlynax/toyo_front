<template>
    <Fluid>
        <Toast />
        <div class="flex flex-col md:flex-row gap-8">
            <div class="md:w-2/3">
                <!-- Header -->
                <div class="flex flex-col md:flex-row gap-8">
                    <div class="card flex flex-col gap-6 w-full">
                        <div class="flex items-center gap-4 border-b pb-2">
                            <RouterLink to="/marketing/listEtenUser">
                                <Button icon="pi pi-arrow-left font-bold" class="p-button-text p-button-secondary text-xl" size="big" v-tooltip="'Back'" />
                            </RouterLink>

                            <span class="text-2xl font-bold text-gray-800">Member Information</span>
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

                                <!-- Edit Button -->
                                <RouterLink :to="`/marketing/editEtenUser/${memberId}`">
                                    <Button type="button" label="Edit" />
                                </RouterLink>
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
                                <!-- Platform -->
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Platform</td>
                                    <td class="px-4 py-2 text-right">{{ memberDetail.platform || 'Web' }}</td>
                                </tr>

                                <!-- FCM Token -->
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">FCM Token</td>
                                    <td class="px-4 py-2 text-right">{{ memberDetail.fcmToken ? 'Yes' : 'No' }}</td>
                                </tr>

                                <!-- Referrer Type -->
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Referrer Type</td>
                                    <td class="px-4 py-2 text-right">{{ memberDetail.referrerType || '-' }}</td>
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
                                            :label="memberDetail.status === 1 ? 'Deactivate' : 'Activate'"
                                            :severity="memberDetail.status === 1 ? 'danger' : 'success'"
                                            size="small"
                                            @click="toggleStatus"
                                            :disabled="loadingAction"
                                            :icon="memberDetail.status === 1 ? 'pi pi-ban' : 'pi pi-check'"
                                        />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Device List -->
                <div class="card flex flex-col w-full">
                    <div class="text-2xl font-bold text-gray-800 border-b pb-2 mb-3">Devices</div>

                    <div v-if="loading" class="text-center py-8">
                        <ProgressSpinner style="width: 30px; height: 30px" />
                    </div>

                    <div v-else class="overflow-x-auto">
                        <table class="w-full text-sm text-left">
                            <tbody>
                                <tr v-if="memberDetail.device" class="border-b">
                                    <!-- Device info -->
                                    <td class="px-4 py-3">
                                        <div class="flex items-center gap-2 text-gray-800 font-bold">
                                            <i class="pi pi-tablet text-primary-500"></i>
                                            {{ getDeviceType(memberDetail.device) }}
                                        </div>
                                        <div class="ml-6 text-gray-500 text-xs mt-2">
                                            <div>IP: {{ memberDetail.device }}</div>
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

const route = useRoute();
const toast = useToast();
const memberId = ref(route.params.id);
const loading = ref(true);
const loadingAction = ref(false);

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
    mobile_number: ''
});

// Fetch member details from API
const fetchMemberDetail = async () => {
    try {
        loading.value = true;

        const response = await api.get(`cares/user/${memberId.value}`);

        if (response.data.status === 1 && response.data.admin_data) {
            const userData = response.data.admin_data;

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
                mobile_number: userData.mobile_number || '-'
            };
        } else {
            console.error('API returned error or invalid data:', response.data);
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
const formatDate = (dateString) => {
    if (!dateString || dateString === '-') return '-';
    return dateString.split(' ')[0]; // Return only date part
};

// Format date-time
const formatDateTime = (dateTimeString) => {
    if (!dateTimeString || dateTimeString === '-') return '-';
    return dateTimeString;
};

// Get device type from IP or device info
const getDeviceType = (deviceInfo) => {
    if (!deviceInfo || deviceInfo === '-') return 'Unknown Device';
    if (deviceInfo.includes('.')) return 'IP Device';
    return deviceInfo;
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
</style>
