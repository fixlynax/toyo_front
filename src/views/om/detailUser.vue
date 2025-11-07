<template>
    <Fluid>
        <!-- Loading State -->
        <div v-if="loading" class="flex justify-center items-center h-64">
            <ProgressSpinner />
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="card p-4 text-center text-red-600">
            <i class="pi pi-exclamation-triangle text-2xl mb-2"></i>
            <p>Error loading member details: {{ error }}</p>
            <Button label="Retry" @click="fetchMemberDetail" class="mt-2" />
        </div>

        <!-- Content -->
        <div v-else class="flex flex-col md:flex-row gap-8">
            <div class="md:w-2/3">
                <!-- Header -->
                <div class="flex flex-col md:flex-row gap-8">
                    <div class="card flex flex-col gap-6 w-full">
                        <div class="flex items-center justify-between border-b pb-2">
                            <div class="flex items-center space-x-3">
                                <RouterLink to="/om/listEten">
                                    <Button icon="pi pi-arrow-left font-bold" class="p-button-text p-button-secondary text-xl" size="big" v-tooltip="'Back'" />
                                </RouterLink>

                                <div class="text-2xl font-bold text-gray-800">Member Information</div>
                            </div>

                            <RouterLink :to="`/om/editEtenUser/${memberId}`">
                                <Button type="button" label="Edit" />
                            </RouterLink>
                        </div>

                        <!-- <div class="font-semibold text-xl pb-2">👤 Account Details</div> -->
                        <div class="flex flex-col md:flex-row gap-4">
                            <div class="w-full">
                                <span class="text-xm font-bold text-black-700">Name</span>
                                <p class="text-lg font-medium">{{ memberDetail.firstName }} {{ memberDetail.lastName }} <span v-if="memberDetail.isMaster === 1" class="font-bold text-primary">(Master)</span></p>
                            </div>
                            <div class="w-full">
                                <span class="text-xm font-bold text-black-700">Mobile Number</span>
                                <p class="text-lg font-medium">(+{{ memberDetail.countryCode }} ) {{ memberDetail.mobileNumber }}</p>
                            </div>
                        </div>

                        <div class="flex flex-col md:flex-row gap-4">
                            <div class="w-full">
                                <span class="text-xm font-bold text-black-700">Email</span>
                                <p class="text-lg font-medium">{{ memberDetail.emailAddress }}</p>
                            </div>
                            <div class="w-full">
                                <span class="text-xm font-bold text-black-700">Password</span>
                                <div class="flex items-center">
                                    <p class="text-lg font-medium mr-2 mb-0">
                                        {{ showPassword ? memberDetail.password : '••••••••' }}
                                    </p>
                                    <!-- Toggle Button -->
                                    <button type="button" @click="showPassword = !showPassword" class="text-gray-500 hover:text-gray-700">
                                        <div class="text-lg font-medium mr-2 mb-0">
                                            <i v-if="showPassword" class="pi pi-eye-slash"></i>
                                            <i v-else class="pi pi-eye"></i>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <!-- Additional Member Information -->
                        <div class="flex flex-col md:flex-row gap-4">
                            <div class="w-full">
                                <span class="text-xm font-bold text-black-700">Member Since</span>
                                <p class="text-lg font-medium">{{ formatDate(memberDetail.memberSince) }}</p>
                            </div>
                            <div class="w-full">
                                <span class="text-xm font-bold text-black-700">Last Login</span>
                                <p class="text-lg font-medium">{{ formatDateTime(memberDetail.lastLogin) }}</p>
                            </div>
                        </div>

                        <div class="flex flex-col md:flex-row gap-4">
                            <div class="w-full">
                                <span class="text-xm font-bold text-black-700">Status</span>
                                <p class="text-lg font-medium">
                                    <span :class="memberDetail.status === 1 ? 'text-green-600 font-medium' : 'text-red-600 font-medium'">
                                        {{ memberDetail.status === 1 ? 'Active' : 'Inactive' }}
                                    </span>
                                </p>
                            </div>
                            <div class="w-full">
                                <span class="text-xm font-bold text-black-700">Activated</span>
                                <p class="text-lg font-medium">
                                    <span :class="memberDetail.activated === 1 ? 'text-green-600 font-medium' : 'text-red-600 font-medium'">
                                        {{ memberDetail.activated === 1 ? 'Yes' : 'No' }}
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="md:w-1/3">
                <!-- Permissions Section -->
                <div class="card">
                    <div class="flex items-center justify-between border-b pb-4 mb-4">
                        <div class="text-2xl font-bold text-gray-800">Permissions</div>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                        <div class="flex items-center justify-between p-3 border rounded-lg">
                            <span class="font-medium text-gray-700">Warranty</span>
                            <ToggleSwitch disabled :modelValue="memberDetail.allow_warranty === 1" class="custom-toggle" />
                        </div>
                        <div class="flex items-center justify-between p-3 border rounded-lg">
                            <span class="font-medium text-gray-700">Order</span>
                            <ToggleSwitch disabled :modelValue="memberDetail.allow_order === 1" class="custom-toggle" />
                        </div>
                        <div class="flex items-center justify-between p-3 border rounded-lg">
                            <span class="font-medium text-gray-700">Billing</span>
                            <ToggleSwitch disabled :modelValue="memberDetail.allow_billing === 1" class="custom-toggle" />
                        </div>
                        <div class="flex items-center justify-between p-3 border rounded-lg">
                            <span class="font-medium text-gray-700">Sales</span>
                            <ToggleSwitch disabled :modelValue="memberDetail.allow_sale === 1" class="custom-toggle" />
                        </div>
                        <div class="flex items-center justify-between p-3 border rounded-lg">
                            <span class="font-medium text-gray-700">User Management</span>
                            <ToggleSwitch disabled :modelValue="memberDetail.allow_user === 1" class="custom-toggle" />
                        </div>
                    </div>
                </div>
                <!-- Devices -->
                <div class="card flex flex-col border-b w-full">
                    <div class="flex items-center justify-between border-b pb-2 mb-3">
                        <div class="text-2xl font-bold text-gray-800">Devices</div>
                        <div class="flex justify-end">
                            <RouterLink :to="`/om/manageDevices/${memberId}`">
                                <Button label="Manage All Devices" icon="pi pi-tablet" size="small" class="!py-1 !px-3 text-sm" />
                            </RouterLink>
                        </div>
                    </div>

                    <div>
                        <div class="overflow-x-auto">
                            <table class="w-full text-sm text-left">
                                <tbody>
                                    <tr v-for="device in sortedDevices.slice(0, 5)" :key="device.id" class="border-b">
                                        <td class="px-4 py-3">
                                            <div class="flex items-center gap-2 text-gray-800 font-bold">
                                                <i class="pi pi-tablet text-black-500"></i>
                                                {{ device.name }}
                                            </div>
                                            <div class="ml-6 text-gray-500 text-xs mt-2">
                                                <div>ID: {{ device.uniqueId }}</div>
                                                <div>Active at: {{ device.lastActive }}</div>
                                                <div>Platform: {{ device.platform }}</div>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr v-if="devices.length === 0">
                                        <td colspan="2" class="px-4 py-3 text-center text-gray-500">No devices found</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </Fluid>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import api from '@/service/api';
import ToggleSwitch from 'primevue/toggleswitch';
import ProgressSpinner from 'primevue/progressspinner';
import Tag from 'primevue/tag';
import { useToast } from 'primevue/usetoast';

const route = useRoute();
const toast = useToast();
const memberId = route.params.id;

// Reactive data
const memberDetail = ref({});
const devices = ref([]);
const showPassword = ref(false);
const loading = ref(true);
const error = ref(null);

// Computed properties
const sortedDevices = computed(() => {
    return [...devices.value].sort((a, b) => new Date(b.lastActive) - new Date(a.lastActive));
});

// Methods
const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return 'N/A';
    return new Date(dateTimeString).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

const fetchMemberDetail = async () => {
    try {
        loading.value = true;
        error.value = null;

        const response = await api.get(`detail_dealer_user/${memberId}`);

        if (response.data.status === 1) {
            // Map API response to frontend structure
            const userData = response.data.admin_data.userData;
            memberDetail.value = {
                id: userData.id,
                etenUserID: userData.eten_user_id || userData.etenUserID,
                countryCode: userData.country_code || userData.countryCode,
                mobileNumber: userData.mobile_number || userData.mobileNumber,
                password: userData.password || '********',
                firstName: userData.first_name || userData.firstName,
                lastName: userData.last_name || userData.lastName,
                emailAddress: userData.email || userData.email_address || userData.emailAddress,
                isMaster: userData.is_master || userData.isMaster || 0,
                memberSince: userData.created_at || userData.created || userData.memberSince,
                lastLogin: userData.last_login || userData.lastLogin,
                status: userData.status || 1,
                activated: userData.activated || 1,
                allow_warranty: userData.allow_warranty || 0,
                allow_order: userData.allow_order || 0,
                allow_billing: userData.allow_billing || 0,
                allow_sale: userData.allow_sale || 0,
                allow_user: userData.allow_user || 0
            };

            // Map devices data
            devices.value = response.data.admin_data.device_data.map((device) => ({
                id: device.device_id,
                name: device.device_model || 'Unknown Device',
                uniqueId: device.device_id,
                platform: device.device_platform || 'Unknown',
                lastActive: formatDateTime(device.last_used_at),
                isBlocked: device.is_blocked === 1,
                loading: false
            }));
        } else {
            throw new Error(response.data.error?.message || 'Failed to fetch member details');
        }
    } catch (err) {
        console.error('Error fetching member details:', err);
        error.value = err.response?.data?.error?.message || err.message || 'An error occurred while fetching member details';

        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: error.value,
            life: 5000
        });
    } finally {
        loading.value = false;
    }
};

// Lifecycle
onMounted(() => {
    fetchMemberDetail();
});
</script>

<style scoped>
/* --- Disabled OFF --- */
:deep(.custom-toggle.p-disabled:not(.p-toggleswitch-checked) .p-toggleswitch-slider) {
    background-color: #f87171; /* lighter red */
    opacity: 0.8;
    cursor: not-allowed;
}

/* --- Disabled ON --- */
:deep(.custom-toggle.p-disabled.p-toggleswitch-checked .p-toggleswitch-slider) {
    background-color: #22c55e; /* lighter green */
    opacity: 0.8;
    cursor: not-allowed;
}

/* Disabled knob */
:deep(.custom-toggle.p-disabled .p-toggleswitch-slider:before) {
    background-color: #f9fafb;
    opacity: 0.9;
}

/* Disable hover for disabled */
:deep(.custom-toggle.p-disabled .p-toggleswitch-slider:hover) {
    filter: none;
}

.card {
    background: white;
    border-radius: 8px;
    box-shadow:
        0 1px 3px 0 rgba(0, 0, 0, 0.1),
        0 1px 2px 0 rgba(0, 0, 0, 0.06);
    padding: 1.5rem;
}
</style>
