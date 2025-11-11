<template>
    <Fluid>
        <div class="flex flex-col md:flex-row gap-8">
            <!-- LEFT SECTION -->
            <div class="md:w-2/3">
                <div class="card flex flex-col border-b w-full">
                    <!-- Header -->
                    <div class="flex items-center justify-between border-b pb-3 mb-3">
                        <div class="flex items-center space-x-3">
                            <Button icon="pi pi-arrow-left font-bold" class="p-button-text p-button-secondary text-xl" size="big" v-tooltip="'Back'" @click="$router.back()" />
                            <div class="text-2xl font-bold text-gray-800">Devices</div>
                        </div>
                        <div class="flex items-center gap-2 w-full max-w-md">
                            <IconField class="flex-1">
                                <InputIcon>
                                    <i class="pi pi-search" />
                                </InputIcon>
                                <InputText v-model="searchQuery" placeholder="Quick Search..." class="w-full" />
                            </IconField>
                            <Button icon="pi pi-refresh" class="p-button" @click="fetchDeviceList" v-tooltip="'Refresh List'" />
                        </div>
                    </div>

                    <!-- Tabs -->
                    <TabView v-model:activeIndex="activeTabIndex">
                        <!-- ALL DEVICES -->
                        <TabPanel :header="`All Devices (${filteredAllDevices.length})`">
                            <div v-if="isLoading" class="text-center py-6 text-gray-500">Loading devices...</div>
                            <div v-else-if="filteredAllDevices.length === 0" class="text-center py-6 text-gray-500">No devices found</div>
                            <div v-else class="overflow-x-auto">
                                <table class="w-full text-sm text-left">
                                    <tbody>
                                        <tr v-for="device in filteredAllDevices" :key="device.device_id" class="border-b hover:bg-gray-50">
                                            <td class="px-4 py-3">
                                                <div class="flex items-center gap-2 text-gray-800 font-bold">
                                                    <i :class="device.is_blocked ? 'pi pi-ban text-red-500' : 'pi pi-tablet text-black-500'"></i>
                                                    {{ device.device_model }}
                                                </div>
                                                <div class="ml-6 text-gray-500 text-xs mt-2">
                                                    <div>ID: {{ device.device_id }}</div>
                                                    <div>Platform: {{ device.device_platform }}</div>
                                                    <div>Last Active: {{ formatDate(device.last_used_at) }}</div>
                                                    <div v-if="device.is_blocked" class="text-red-500 font-semibold">Status: Blocked</div>
                                                    <div v-if="device.is_active" class="text-green-500 font-semibold">Status: Active</div>
                                                </div>
                                            </td>
                                            <td class="px-4 py-3 text-right align-top">
                                                <Button :label="device.is_blocked ? 'Unblock' : 'Block'" :severity="device.is_blocked ? 'success' : 'danger'" size="small" class="!py-1 !px-2 text-xs w-fit" @click="openBlockModal(device)" />
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </TabPanel>

                        <!-- ACTIVE DEVICES -->
                        <TabPanel :header="`Active Devices (${filteredActiveDevices.length})`">
                            <div v-if="isLoading" class="text-center py-6 text-gray-500">Loading devices...</div>
                            <div v-else-if="filteredActiveDevices.length === 0" class="text-center py-6 text-gray-500">No active devices found</div>
                            <div v-else class="overflow-x-auto">
                                <table class="w-full text-sm text-left">
                                    <tbody>
                                        <tr v-for="device in filteredActiveDevices" :key="device.device_id" class="border-b hover:bg-gray-50">
                                            <td class="px-4 py-3">
                                                <div class="flex items-center gap-2 text-gray-800 font-bold">
                                                    <i class="pi pi-tablet text-black-500"></i>
                                                    {{ device.device_model }}
                                                </div>
                                                <div class="ml-6 text-gray-500 text-xs mt-2">
                                                    <div>ID: {{ device.device_id }}</div>
                                                    <div>Platform: {{ device.device_platform }}</div>
                                                    <div>Last Active: {{ formatDate(device.last_used_at) }}</div>
                                                </div>
                                            </td>
                                            <td class="px-4 py-3 text-right align-top">
                                                <Button label="Block" severity="danger" size="small" class="!py-1 !px-2 text-xs w-fit" @click="openBlockModal(device)" />
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </TabPanel>

                        <!-- BLOCKED DEVICES -->
                        <TabPanel :header="`Blocked Devices (${filteredBlockedDevices.length})`">
                            <div v-if="isLoading" class="text-center py-6 text-gray-500">Loading devices...</div>
                            <div v-else-if="filteredBlockedDevices.length === 0" class="text-center py-6 text-gray-500">No blocked devices found</div>
                            <div v-else class="overflow-x-auto">
                                <table class="w-full text-sm text-left">
                                    <tbody>
                                        <tr v-for="device in filteredBlockedDevices" :key="device.device_id" class="border-b hover:bg-gray-50">
                                            <td class="px-4 py-3">
                                                <div class="flex items-center gap-2 text-gray-800 font-bold">
                                                    <i class="pi pi-ban text-red-500"></i>
                                                    {{ device.device_model }}
                                                </div>
                                                <div class="ml-6 text-gray-500 text-xs mt-2">
                                                    <div>ID: {{ device.device_id }}</div>
                                                    <div>Platform: {{ device.device_platform }}</div>
                                                    <div>Last Active: {{ formatDate(device.last_used_at) }}</div>
                                                    <div class="text-red-500 font-semibold">Status: Blocked</div>
                                                </div>
                                            </td>
                                            <td class="px-4 py-3 text-right align-top">
                                                <Button label="Unblock" severity="success" size="small" class="!py-1 !px-2 text-xs w-fit" @click="openBlockModal(device)" />
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </TabPanel>
                    </TabView>
                </div>
            </div>
        </div>

        <!-- Block/Unblock Confirmation Modal -->
        <Dialog v-model:visible="blockModal.visible" :style="{ width: '500px' }" header="Device Action Confirmation" :modal="true" :closable="false">
            <div class="flex flex-col gap-4">
                <!-- Device Preview -->
                <div class="bg-gray-50 p-4 rounded-lg border">
                    <div class="font-semibold text-lg mb-2">Device Information</div>
                    <div class="grid grid-cols-2 gap-2 text-sm">
                        <div class="text-gray-600">Model:</div>
                        <div class="font-medium">{{ blockModal.device?.device_model }}</div>

                        <div class="text-gray-600">Device ID:</div>
                        <div class="font-medium">{{ blockModal.device?.device_id }}</div>

                        <div class="text-gray-600">Platform:</div>
                        <div class="font-medium">{{ blockModal.device?.device_platform }}</div>

                        <div class="text-gray-600">Last Active:</div>
                        <div class="font-medium">{{ formatDate(blockModal.device?.last_used_at) }}</div>

                        <div class="text-gray-600">Current Status:</div>
                        <div class="font-medium">
                            <span :class="blockModal.device?.is_blocked ? 'text-red-500' : 'text-green-500'">
                                {{ blockModal.device?.is_blocked ? 'Blocked' : 'Active' }}
                            </span>
                        </div>
                    </div>
                </div>

                <!-- Action Type Display -->
                <div class="text-center p-3 rounded-lg" :class="blockModal.isBlocking ? 'bg-red-50 border border-red-200' : 'bg-green-50 border border-green-200'">
                    <i :class="blockModal.isBlocking ? 'pi pi-ban text-red-500 text-xl' : 'pi pi-check-circle text-green-500 text-xl'"></i>
                    <div class="font-semibold mt-2" :class="blockModal.isBlocking ? 'text-red-700' : 'text-green-700'">
                        {{ blockModal.isBlocking ? 'Block Device' : 'Unblock Device' }}
                    </div>
                    <div class="text-sm text-gray-600 mt-1">
                        {{ blockModal.isBlocking ? 'This device will be blocked from accessing the system.' : 'This device will be allowed to access the system again.' }}
                    </div>
                </div>

                <!-- Reason Input -->
                <div class="field">
                    <label for="reason" class="font-medium block mb-2"> Reason for {{ blockModal.isBlocking ? 'Blocking' : 'Unblocking' }} * </label>
                    <Textarea id="reason" v-model="blockModal.reason" :placeholder="`Enter reason for ${blockModal.isBlocking ? 'blocking' : 'unblocking'} this device...`" rows="3" class="w-full" :autoResize="true" />
                    <small class="text-gray-500">This reason will be recorded in the audit log.</small>
                </div>
            </div>

            <template #footer>
                <div class="flex justify-end gap-2">
                    <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="closeBlockModal" />
                    <Button
                        :label="blockModal.isBlocking ? 'Block Device' : 'Unblock Device'"
                        :icon="blockModal.isBlocking ? 'pi pi-ban' : 'pi pi-check'"
                        :severity="blockModal.isBlocking ? 'danger' : 'success'"
                        :disabled="!blockModal.reason.trim()"
                        @click="confirmBlockAction"
                    />
                </div>
            </template>
        </Dialog>
    </Fluid>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import api from '@/service/api';
import { useToast } from 'primevue/usetoast';

const toast = useToast();
const activeTabIndex = ref(0);
const searchQuery = ref('');
const isLoading = ref(false);
const devices = ref([]);
const etenUserId = ref(1); // ✅ Replace with actual user ID (e.g. from route params)

// Block Modal State
const blockModal = ref({
    visible: false,
    device: null,
    isBlocking: false,
    reason: ''
});

// ✅ Open Block Modal
function openBlockModal(device) {
    blockModal.value = {
        visible: true,
        device: device,
        isBlocking: !device.is_blocked,
        reason: ''
    };
}

// ✅ Close Block Modal
function closeBlockModal() {
    blockModal.value = {
        visible: false,
        device: null,
        isBlocking: false,
        reason: ''
    };
}

// ✅ Fetch devices from API - Updated to use single endpoint
async function fetchDeviceList() {
    try {
        isLoading.value = true;
        const response = await api.get(`deviceList/${etenUserId.value}`);

        if (response.data.status === 1) {
            devices.value = response.data.admin_data.map((device) => ({
                device_model: device.device_model || 'Unknown Device',
                device_id: device.device_id,
                device_platform: device.device_platform,
                last_used_at: device.last_used_at,
                is_blocked: device.is_blocked === 1, // Convert to boolean
                is_active: device.is_blocked === 0 // Convert to boolean,
            }));
        } else {
            toast.add({
                severity: 'warn',
                summary: 'No Data',
                detail: 'No devices found.',
                life: 3000
            });
            devices.value = [];
        }
    } catch (err) {
        console.error('Error fetching devices:', err);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load devices.',
            life: 3000
        });
        devices.value = [];
    } finally {
        isLoading.value = false;
    }
}

// ✅ Confirm Block/Unblock Action - Updated to match API requirements
async function confirmBlockAction() {
    if (!blockModal.value.reason.trim()) {
        toast.add({
            severity: 'warn',
            summary: 'Reason Required',
            detail: 'Please enter a reason for this action.',
            life: 3000
        });
        return;
    }

    try {
        const { device, isBlocking, reason } = blockModal.value;

        // Prepare request data according to API
        const requestData = {
            eten_userListID: etenUserId.value,
            deviceUUID: device.device_id,
            device_model: device.device_model,
            status: isBlocking ? 'blocked' : 'unblocked'
        };

        // Add appropriate reason field based on action
        if (isBlocking) {
            requestData.block_reason = reason;
            requestData.unblock_reason = null;
        } else {
            requestData.unblock_reason = reason;
            requestData.block_reason = null;
        }

        const response = await api.post('block_user_device', requestData);

        if (response.data.status === 1) {
            // Update local device status
            const deviceIndex = devices.value.findIndex((d) => d.device_id === device.device_id);
            if (deviceIndex !== -1) {
                devices.value[deviceIndex].is_blocked = isBlocking;
            }

            toast.add({
                severity: 'success',
                summary: 'Success',
                detail: response.data.message,
                life: 3000
            });

            closeBlockModal();
        } else {
            toast.add({
                severity: 'warn',
                summary: 'Warning',
                detail: response.data.message || 'Action failed.',
                life: 3000
            });
        }
    } catch (err) {
        console.error('Error updating device status:', err);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to update device status.',
            life: 3000
        });
    }
}

// ✅ Filters
const filterDevices = (list) => {
    if (!searchQuery.value.trim()) return list;
    const q = searchQuery.value.toLowerCase();
    return list.filter((d) => d.device_model.toLowerCase().includes(q) || d.device_id.toLowerCase().includes(q) || d.device_platform.toLowerCase().includes(q));
};

const filteredAllDevices = computed(() => filterDevices(devices.value));
const filteredActiveDevices = computed(() => filterDevices(devices.value.filter((d) => !d.is_blocked)));
const filteredBlockedDevices = computed(() => filterDevices(devices.value.filter((d) => d.is_blocked)));

// ✅ Format date
function formatDate(date) {
    if (!date) return '-';
    return new Date(date).toLocaleString('en-MY', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// ✅ Load on mount
onMounted(fetchDeviceList);
</script>
