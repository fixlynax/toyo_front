<template>
    <Fluid>
        <div class="flex flex-col md:flex-row gap-8">
            <div class="card flex flex-col gap-6 w-full">
                <!-- Header -->
                <div class="text-2xl font-bold text-gray-800 border-b pb-2">Referral Reward Point</div>

                <!-- Settings Form -->
                <div class="border rounded-lg p-6 bg-gray-50">
                    <div class="text-xl font-bold text-gray-800 mb-4">Update Reward Point Settings</div>

                    <div class="grid grid-cols-1 gap-6">
                        <div class="pb-4">
                            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label class="block font-bold text-gray-700 mb-2">Points per Referral <span style="color: red">*</span></label>
                                    <InputNumber
                                        v-model="form.referralPoint"
                                        mode="decimal"
                                        :min="0"
                                        :max="10000"
                                        :minFractionDigits="0"
                                        :maxFractionDigits="0"
                                        placeholder="Enter points"
                                        class="w-full"
                                        :class="{ 'p-invalid': !form.referralPoint && form.referralPoint !== 0 }"
                                        :disabled="loading"
                                    >
                                        <template #decrementbuttonicon></template>
                                    </InputNumber>
                                    <div class="text-xs text-gray-500 mt-1">Points awarded for each successful referral</div>
                                    <small v-if="!form.referralPoint && form.referralPoint !== 0" class="p-error">Points per referral is required.</small>
                                </div>
                                <div>
                                    <label class="block font-bold text-gray-700 mb-2">Annual Quota <span style="color: red">*</span></label>
                                    <InputNumber
                                        v-model="form.referralLimit"
                                        mode="decimal"
                                        :min="0"
                                        :max="100"
                                        :minFractionDigits="0"
                                        :maxFractionDigits="0"
                                        placeholder="Enter quota"
                                        class="w-full"
                                        :class="{ 'p-invalid': !form.referralLimit && form.referralLimit !== 0 }"
                                        :disabled="loading"
                                    />
                                    <div class="text-xs text-gray-500 mt-1">Maximum referrals per member per year</div>
                                    <small v-if="!form.referralLimit && form.referralLimit !== 0" class="p-error">Annual quota is required.</small>
                                </div>
                                <div>
                                    <label class="block font-bold text-gray-700 mb-2">Status</label>
                                    <div class="flex items-center gap-3 mt-2">
                                        <InputSwitch v-model="form.status" :disabled="loading" />
                                        <span :class="form.status ? 'text-green-600' : 'text-gray-600'">
                                            {{ form.status ? 'Active' : 'Inactive' }}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Action Buttons -->
                    <div class="flex justify-end gap-4 mt-6">
                        <div class="w-32">
                            <Button label="Reset" class="w-full p-button-outlined p-button-secondary" @click="resetForm" :disabled="!hasChanges || loading" :loading="loadingReset" />
                        </div>
                        <div class="w-32">
                            <Button label="Update" class="w-full" :disabled="!hasChanges || !isFormValid || loading" @click="updateSettings" :loading="loading">
                                <i v-if="loading" class="pi pi-spin pi-spinner mr-2"></i>
                                <span v-else>Update</span>
                            </Button>
                        </div>
                    </div>
                </div>

                <!-- History Table -->
                <div class="border rounded-lg p-4 bg-white">
                    <div class="flex justify-between items-center mb-3">
                        <label class="block text-xl font-bold text-gray-700">Update History</label>
                        <Button icon="pi pi-refresh" class="p-button-text p-button-sm" @click="loadSettings" :disabled="loadingHistory" title="Refresh history" />
                    </div>

                    <!-- Loading State for Table -->
                    <LoadingPage v-if="loadingHistory" :message="'Loading Update History...'" :sub-message="'Fetching referral settings history'" />

                    <DataTable
                        v-else
                        :value="settingHistory"
                        :paginator="true"
                        :rows="5"
                        :rowsPerPageOptions="[5, 10, 20]"
                        dataKey="id"
                        :rowHover="true"
                        responsiveLayout="scroll"
                        :loading="false"
                        :filters="filters"
                        filterDisplay="menu"
                        class="rounded-table"
                    >
                        <template #header>
                            <div class="flex justify-between items-center">
                                <span class="p-input-icon-left w-1/3">
                                    <InputText v-model="filters['global'].value" placeholder="Search..." :disabled="loadingHistory" />
                                </span>
                                <div class="flex gap-2">
                                    <Button label="Active" :severity="activeFilter ? 'success' : 'success'" @click="toggleActiveFilter" :disabled="loadingHistory" :outlined="!activeFilter" />
                                    <Button label="Inactive" :severity="inactiveFilter ? 'danger' : 'danger'" @click="toggleInactiveFilter" :disabled="loadingHistory" :outlined="!inactiveFilter" />
                                    <Button label="Clear" style="background-color: #0ea5e9; border: none" @click="clearFilters" :disabled="loadingHistory || !hasActiveFilters" />
                                </div>
                            </div>
                        </template>

                        <Column field="created" header="Created Date Time" style="min-width: 12rem" sortable :showFilterMenu="false" :filterField="getCreatedFieldForFilter">
                            <template #body="{ data }">
                                <div class="text-sm">
                                    <div class="font-semibold text-gray-800">
                                        {{ formatDate(data.created) }}
                                    </div>
                                    <div class="text-gray-500 text-xs">
                                        {{ formatTime(data.created) }}
                                    </div>
                                </div>
                            </template>
                        </Column>

                        <Column header="Updated By" style="min-width: 10rem" :showFilterMenu="false" :filterField="getCreatedByNameForFilter">
                            <template #body="{ data }">
                                <div v-if="data.created_by_name" class="flex items-center gap-2">
                                    <Avatar
                                        :label="data.created_by_name.charAt(0)"
                                        class="mr-2"
                                        size="small"
                                        shape="circle"
                                        :style="{
                                            backgroundColor: stringToColor(data.created_by_name),
                                            color: 'white'
                                        }"
                                    />
                                    <div>
                                        <div class="font-semibold text-gray-800">{{ data.created_by_name }}</div>
                                    </div>
                                </div>
                                <div v-else class="text-gray-400 italic">Unknown</div>
                            </template>
                        </Column>

                        <Column field="referralPoint" header="Points" style="min-width: 8rem" sortable :showFilterMenu="false">
                            <template #body="{ data }">
                                <div class="flex items-center gap-2">
                                    <span class="font-bold text-blue-600">{{ data.referralPoint }}</span>
                                </div>
                            </template>
                        </Column>

                        <Column field="referralLimit" header="Limit" style="min-width: 8rem" sortable :showFilterMenu="false">
                            <template #body="{ data }">
                                <div class="flex items-center gap-2">
                                    <span class="font-bold text-green-600">{{ data.referralLimit }}</span>
                                </div>
                            </template>
                        </Column>

                        <Column field="status" header="Status" style="min-width: 8rem" sortable :showFilterMenu="false" :filterMatchModeOptions="statusFilterOptions">
                            <template #body="{ data }">
                                <Tag :value="data.status ? 'Active' : 'Inactive'" :severity="data.status ? 'success' : 'danger'" :rounded="true" />
                            </template>
                            <template #filter="{ filterModel, filterCallback }">
                                <div class="p-2">
                                    <Dropdown v-model="filterModel.value" :options="statusOptions" optionLabel="label" optionValue="value" placeholder="Select Status" @change="filterCallback()" class="w-full" />
                                </div>
                            </template>
                        </Column>

                        <Column header="Actions" style="min-width: 8rem">
                            <template #body="{ data }">
                                <div class="flex gap-1">
                                    <Button
                                        icon="pi pi-copy"
                                        class="p-button-text p-button-sm p-button-info"
                                        title="Apply these values"
                                        @click="applyHistoricalValues(data)"
                                        :disabled="loading || isCurrentSetting(data)"
                                        v-tooltip="'Apply these values to form'"
                                    />
                                </div>
                            </template>
                        </Column>

                        <template #empty>
                            <div class="text-center text-gray-500 py-8">
                                <i class="pi pi-history text-3xl text-gray-300 mb-2"></i>
                                <p class="text-lg">No update history found</p>
                                <p class="text-sm">Update settings to see history here</p>
                            </div>
                        </template>

                        <template #footer>
                            <div class="flex justify-between items-center text-sm text-gray-600">
                                <div>Total records: {{ settingHistory.length }}</div>
                                <div v-if="hasActiveFilters">Filter applied</div>
                            </div>
                        </template>
                    </DataTable>
                </div>
            </div>
        </div>

        <!-- Confirmation Dialog -->
        <Dialog v-model:visible="showApplyDialog" header="Apply Historical Values" :modal="true" :closable="false" :style="{ width: '450px' }">
            <div class="p-4">
                <p class="mb-4">Are you sure you want to apply these historical values?</p>
                <div class="bg-gray-50 p-3 rounded mb-4">
                    <div class="grid grid-cols-2 gap-2 text-sm">
                        <div class="font-semibold">Points:</div>
                        <div class="font-bold text-blue-600">{{ selectedHistoricalData?.referralPoint }}</div>
                        <div class="font-semibold">Limit:</div>
                        <div class="font-bold text-green-600">{{ selectedHistoricalData?.referralLimit }}</div>
                        <div class="font-semibold">Status:</div>
                        <div>
                            <Tag :value="selectedHistoricalData?.status ? 'Active' : 'Inactive'" :severity="selectedHistoricalData?.status ? 'success' : 'danger'" size="small" />
                        </div>
                    </div>
                </div>
                <div class="flex justify-end gap-2">
                    <Button label="Cancel" class="p-button-outlined" @click="showApplyDialog = false" />
                    <Button label="Apply" class="p-button-primary" @click="confirmApplyHistoricalValues" />
                </div>
            </div>
        </Dialog>
    </Fluid>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useToast } from 'primevue/usetoast';
import { FilterMatchMode } from '@primevue/core/api';
import api from '@/service/api';
import LoadingPage from '@/components/LoadingPage.vue';

const toast = useToast();
const loading = ref(false);
const loadingHistory = ref(false);
const loadingReset = ref(false);
const showApplyDialog = ref(false);
const selectedHistoricalData = ref(null);
const activeFilter = ref(false);
const inactiveFilter = ref(false);

// Filters for DataTable
const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    status: { value: null, matchMode: FilterMatchMode.EQUALS }
});

// Current settings data - initialize as null
const currentSettings = reactive({
    referralPoint: null,
    referralLimit: null,
    status: null
});

// Form data
const form = reactive({
    referralPoint: null,
    referralLimit: null,
    status: null
});

// History data
const settingHistory = ref([]);

// Filter options
const statusOptions = [
    { label: 'Active', value: 1 },
    { label: 'Inactive', value: 0 }
];

const statusFilterOptions = [
    { label: 'Equals', value: FilterMatchMode.EQUALS },
    { label: 'Not Equals', value: FilterMatchMode.NOT_EQUALS }
];

// Computed properties
const hasChanges = computed(() => {
    if (currentSettings.referralPoint === null || currentSettings.referralLimit === null || currentSettings.status === null) {
        return false;
    }

    return form.referralPoint !== currentSettings.referralPoint || form.referralLimit !== currentSettings.referralLimit || form.status !== currentSettings.status;
});

const isFormValid = computed(() => {
    return form.referralPoint !== null && form.referralPoint >= 0 && form.referralLimit !== null && form.referralLimit >= 0 && form.status !== null;
});

const hasActiveFilters = computed(() => {
    return filters.value.global.value || filters.value.status.value || activeFilter.value || inactiveFilter.value;
});

// Methods
const stringToColor = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const color = Math.floor(Math.abs((Math.sin(hash) * 16777215) % 16777215)).toString(16);
    return '#' + '000000'.substring(0, 6 - color.length) + color;
};

const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-MY', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
};

const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-MY', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
};

const getCreatedFieldForFilter = (data) => {
    // Combine date and time for filtering
    return formatDate(data.created) + ' ' + formatTime(data.created);
};

const getCreatedByNameForFilter = (data) => {
    return data.created_by_name || '';
};

const toggleActiveFilter = () => {
    activeFilter.value = !activeFilter.value;
    if (activeFilter.value) {
        inactiveFilter.value = false;
        filters.value.status.value = 1;
    } else {
        filters.value.status.value = null;
    }
};

const toggleInactiveFilter = () => {
    inactiveFilter.value = !inactiveFilter.value;
    if (inactiveFilter.value) {
        activeFilter.value = false;
        filters.value.status.value = 0;
    } else {
        filters.value.status.value = null;
    }
};

const clearFilters = () => {
    filters.value.global.value = null;
    filters.value.status.value = null;
    activeFilter.value = false;
    inactiveFilter.value = false;
};

const isCurrentSetting = (data) => {
    return data.referralPoint === currentSettings.referralPoint && data.referralLimit === currentSettings.referralLimit && data.status === (currentSettings.status ? 1 : 0);
};

const applyHistoricalValues = (data) => {
    selectedHistoricalData.value = data;
    showApplyDialog.value = true;
};

const confirmApplyHistoricalValues = () => {
    if (selectedHistoricalData.value) {
        form.referralPoint = selectedHistoricalData.value.referralPoint;
        form.referralLimit = selectedHistoricalData.value.referralLimit;
        form.status = selectedHistoricalData.value.status === 1;
        showApplyDialog.value = false;

        toast.add({
            severity: 'success',
            summary: 'Values Applied',
            detail: 'Historical values have been applied to the form',
            life: 2000
        });
    }
};

const resetForm = async () => {
    loadingReset.value = true;
    await new Promise((resolve) => setTimeout(resolve, 300));

    form.referralPoint = currentSettings.referralPoint;
    form.referralLimit = currentSettings.referralLimit;
    form.status = currentSettings.status;

    loadingReset.value = false;

    toast.add({
        severity: 'info',
        summary: 'Form Reset',
        detail: 'Form has been reset to current values',
        life: 2000
    });
};

const loadSettings = async () => {
    try {
        loading.value = true;
        loadingHistory.value = true;

        const response = await api.get('referral/settings');

        if (response.data.status === 1) {
            const adminData = response.data.admin_data;

            if (adminData.latest_setting) {
                const latest = adminData.latest_setting;
                currentSettings.referralPoint = latest.referralPoint;
                currentSettings.referralLimit = latest.referralLimit;
                currentSettings.status = latest.status === 1;

                form.referralPoint = latest.referralPoint;
                form.referralLimit = latest.referralLimit;
                form.status = latest.status === 1;
            } else {
                currentSettings.referralPoint = 0;
                currentSettings.referralLimit = 0;
                currentSettings.status = true;

                form.referralPoint = 0;
                form.referralLimit = 0;
                form.status = true;
            }

            settingHistory.value = (adminData.setting_history || []).sort((a, b) => new Date(b.created) - new Date(a.created));

            clearFilters();
        } else {
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to load settings',
                life: 3000
            });
        }
    } catch (error) {
        console.error('Error loading settings:', error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load settings. Please try again.',
            life: 3000
        });
    } finally {
        loading.value = false;
        loadingHistory.value = false;
    }
};

const updateSettings = async () => {
    if (!isFormValid.value) {
        toast.add({
            severity: 'warn',
            summary: 'Validation Error',
            detail: 'Please fill in all required fields with valid values.',
            life: 3000
        });
        return;
    }

    try {
        loading.value = true;

        const payload = {
            referral_point: form.referralPoint,
            referral_limit: form.referralLimit,
            status: form.status ? 1 : 0
        };

        const response = await api.post('referral/create', payload);

        if (response.data.status === 1) {
            currentSettings.referralPoint = form.referralPoint;
            currentSettings.referralLimit = form.referralLimit;
            currentSettings.status = form.status;

            await loadSettings();

            toast.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Referral reward points updated successfully!',
                life: 3000
            });
        } else {
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: response.data.error || 'Failed to update settings',
                life: 3000
            });
        }
    } catch (error) {
        console.error('Error updating settings:', error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to update settings. Please try again.',
            life: 3000
        });
    } finally {
        loading.value = false;
    }
};

// Initialize
onMounted(() => {
    loadSettings();
});
</script>

<style scoped>
:deep(.rounded-table) {
    border-radius: 12px;
    overflow: hidden;
    border: 1px solid #e5e7eb;

    .p-datatable-header {
        border-top-left-radius: 12px;
        border-top-right-radius: 12px;
    }

    .p-paginator-bottom {
        border-bottom-left-radius: 12px;
        border-bottom-right-radius: 12px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 1rem;
    }

    .p-datatable-thead > tr > th {
        &:first-child {
            border-top-left-radius: 12px;
        }
        &:last-child {
            border-top-right-radius: 12px;
        }
    }

    .p-datatable-tbody > tr:last-child > td {
        &:first-child {
            border-bottom-left-radius: 0;
        }
        &:last-child {
            border-bottom-right-radius: 0;
        }
    }

    .p-datatable-tbody > tr.p-datatable-emptymessage > td {
        border-bottom-left-radius: 12px;
        border-bottom-right-radius: 12px;
    }

    :deep(.p-paginator-current) {
        margin-right: auto;
        order: -1;
    }
}

/* Custom styling for the date filter */
:deep(.p-calendar) {
    .p-inputtext {
        padding: 0.5rem;
    }
}
</style>
