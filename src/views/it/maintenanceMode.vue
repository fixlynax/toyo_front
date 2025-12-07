<template>
    <Fluid>
        <div class="flex flex-col gap-8">
            <!-- Version List Table Card -->
            <div class="card">
                <div class="flex justify-between items-center mb-6 border-b pb-2">
                    <div class="text-2xl font-bold text-gray-800">Maintenance Mode</div>
                    <!-- <Button label="Refresh" icon="pi pi-refresh" class="p-button-outlined p-button-sm" style="width:fit-content" @click="fetchVersionList" /> -->
                </div>

                <DataTable :value="versionList" :loading="loading" class="rounded-table">
                    <Column field="type" header="Type">
                        <template #body="{ data }">
                            <span class="font-medium">{{ getTypeLabel(data.type) }}</span>
                        </template>
                    </Column>
                    <Column field="currentVer" header="Current Version"></Column>
                    <Column field="newVer" header="New Version"></Column>
                    <Column field="link" header="Link">
                        <template #body="{ data }">
                            <a v-if="data.link" :href="data.link" target="_blank" class="text-blue-600 hover:underline">
                                {{ truncateText(data.link, 30) }}
                            </a>
                            <span v-else class="text-gray-400">-</span>
                        </template>
                    </Column>
                    <Column field="isForce" header="Force Update">
                        <template #body="{ data }">
                            <Tag :value="data.isForce ? 'Yes' : 'No'" :severity="data.isForce ? 'danger' : 'success'" />
                        </template>
                    </Column>
                    <Column field="isMaintainence" header="Maintenance">
                        <template #body="{ data }">
                            <Tag :value="data.isMaintainence ? 'Yes' : 'No'" :severity="data.isMaintainence ? 'warning' : 'info'" />
                        </template>
                    </Column>
                    <Column header="Actions" style="width: 120px">
                        <template #body="{ data }">
                            <div class="flex gap-2">
                                <Button icon="pi pi-eye" class="p-button-rounded p-button-text p-button-sm" @click="viewMaintenanceMsg(data)" v-tooltip="'View Maintenance Message'" />
                                <Button icon="pi pi-pencil" class="p-button-rounded p-button-text p-button-sm" @click="openUpdateDialog(data)" v-tooltip="'Update Version'" />
                            </div>
                        </template>
                    </Column>
                </DataTable>
            </div>
        </div>

        <!-- Update Version Dialog -->
        <Dialog v-model:visible="updateDialog.visible" :style="{ width: '600px' }" header="Update Version" :modal="true">
            <div class="flex flex-col gap-4">
                <div>
                    <label class="block text-sm font-bold text-gray-700 mb-2">Type</label>
                    <InputText :value="getTypeLabel(updateDialog.data.type)" class="w-full" disabled />
                </div>

                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-bold text-gray-700 mb-2">Current Version</label>
                        <InputText v-model="updateDialog.data.currentVer" class="w-full" />
                    </div>
                    <div>
                        <label class="block text-sm font-bold text-gray-700 mb-2">New Version</label>
                        <InputText v-model="updateDialog.data.newVer" class="w-full" />
                    </div>
                </div>

                <div>
                    <label class="block text-sm font-bold text-gray-700 mb-2">Download Link</label>
                    <InputText v-model="updateDialog.data.link" class="w-full" />
                </div>

                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-bold text-gray-700 mb-2">Force Update</label>
                        <SelectButton v-model="updateDialog.data.isForce" :options="booleanOptions" optionLabel="label" optionValue="value" class="w-full" />
                    </div>
                    <div>
                        <label class="block text-sm font-bold text-gray-700 mb-2">Maintenance Mode</label>
                        <SelectButton v-model="updateDialog.data.isMaintainence" :options="booleanOptions" optionLabel="label" optionValue="value" class="w-full" />
                    </div>
                </div>

                <div>
                    <label class="block text-sm font-bold text-gray-700 mb-2">Maintenance Message</label>
                    <Textarea v-model="updateDialog.data.maintenanceMsg" rows="4" class="w-full" placeholder="Enter maintenance message (if maintenance mode is enabled)" />
                </div>

                <div>
                    <label class="block text-sm font-bold text-gray-700 mb-2">Reason for Update *</label>
                    <InputText v-model="updateDialog.reason" class="w-full" placeholder="Enter reason for update" />
                </div>
            </div>

            <template #footer>
                <Button label="Cancel" icon="pi pi-times" @click="closeUpdateDialog" class="p-button-text" />
                <Button label="Update" icon="pi pi-check" @click="updateVersion" :loading="updating" autofocus />
            </template>
        </Dialog>

        <!-- Maintenance Message Dialog -->
        <Dialog v-model:visible="messageDialog.visible" :style="{ width: '500px' }" header="Maintenance Message" :modal="true">
            <div class="flex flex-col gap-4">
                <div>
                    <label class="block text-sm font-bold text-gray-700 mb-2">Type</label>
                    <InputText :value="getTypeLabel(messageDialog.data.type)" class="w-full" disabled />
                </div>
                <div>
                    <label class="block text-sm font-bold text-gray-700 mb-2">Message</label>
                    <div class="p-4 bg-gray-50 rounded border min-h-[100px]">
                        {{ messageDialog.data.maintenanceMsg || 'No maintenance message' }}
                    </div>
                </div>
            </div>
            <template #footer>
                <Button label="Close" icon="pi pi-times" @click="messageDialog.visible = false" class="p-button-text" />
            </template>
        </Dialog>
    </Fluid>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/service/api';
import { useToast } from 'primevue/usetoast';


const router = useRouter();
const toast = useToast();
const saving = ref(false);
const loading = ref(false);
const updating = ref(false);

// Initialize form with proper structure
const initializeForm = () => {
    return {
        channels: {
            TC: { enabled: false, period: null, message: '' },
            ETEN: { enabled: false, period: null, message: '' },
            BOTH: { enabled: false, period: null, message: '' }
        }
    };
};

const form = ref(initializeForm());

const versionList = ref([]);
const updateDialog = ref({
    visible: false,
    data: {
        type: '',
        currentVer: '',
        newVer: '',
        link: '',
        isForce: 0,
        isMaintainence: 0,
        maintenanceMsg: ''
    },
    reason: ''
});

const messageDialog = ref({
    visible: false,
    data: {}
});

const channelOptions = [
    { label: 'Toyocares (TC)', value: 'TC' },
    { label: 'ETEN', value: 'ETEN' },
    { label: 'Both', value: 'BOTH' }
];

const booleanOptions = [
    { label: 'No', value: 0 },
    { label: 'Yes', value: 1 }
];

const TYPE_LABELS = {
    'ios-care': 'iOS Care',
    'android-care': 'Android Care',
    'ios-eten': 'iOS ETEN',
    'android-eten': 'Android ETEN'
};

onMounted(() => {
    fetchVersionList();
});

const fetchVersionList = async () => {
    loading.value = true;
    try {
        const response = await api.post('admin/list-version');
        if (response.data.status === 1) {
            versionList.value = response.data.data;
            
            // Reset form based on current maintenance status
            resetFormFromVersionList(versionList.value);
        }
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to fetch version list: ' + (error.response?.data?.message || error.message),
            life: 3000
        });
    } finally {
        loading.value = false;
    }
};

const resetFormFromVersionList = (versions) => {
    // Reset form to initial state
    form.value = initializeForm();
    
    // Check if any versions are in maintenance mode
    const tcInMaintenance = versions.some(v => 
        ['ios-care', 'android-care'].includes(v.type) && v.isMaintainence === 1
    );
    const etenInMaintenance = versions.some(v => 
        ['ios-eten', 'android-eten'].includes(v.type) && v.isMaintainence === 1
    );
    
    if (tcInMaintenance && etenInMaintenance) {
        form.value.channels.BOTH.enabled = true;
        // Try to get message from any TC or ETEN version
        const tcVersion = versions.find(v => ['ios-care', 'android-care'].includes(v.type));
        if (tcVersion?.maintenanceMsg) {
            form.value.channels.BOTH.message = tcVersion.maintenanceMsg;
        }
    } else if (tcInMaintenance) {
        form.value.channels.TC.enabled = true;
        const tcVersion = versions.find(v => ['ios-care', 'android-care'].includes(v.type));
        if (tcVersion?.maintenanceMsg) {
            form.value.channels.TC.message = tcVersion.maintenanceMsg;
        }
    } else if (etenInMaintenance) {
        form.value.channels.ETEN.enabled = true;
        const etenVersion = versions.find(v => ['ios-eten', 'android-eten'].includes(v.type));
        if (etenVersion?.maintenanceMsg) {
            form.value.channels.ETEN.message = etenVersion.maintenanceMsg;
        }
    }
};

const getTypeLabel = (type) => {
    return TYPE_LABELS[type] || type;
};

const truncateText = (text, maxLength) => {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
};

const viewMaintenanceMsg = (data) => {
    messageDialog.value.data = { ...data };
    messageDialog.value.visible = true;
};

const openUpdateDialog = (data) => {
    updateDialog.value.data = { 
        ...data,
        isForce: data.isForce || 0,
        isMaintainence: data.isMaintainence || 0,
        maintenanceMsg: data.maintenanceMsg || ''
    };
    updateDialog.value.reason = '';
    updateDialog.value.visible = true;
};

const closeUpdateDialog = () => {
    updateDialog.value.visible = false;
    updateDialog.value.data = {
        type: '',
        currentVer: '',
        newVer: '',
        link: '',
        isForce: 0,
        isMaintainence: 0,
        maintenanceMsg: ''
    };
    updateDialog.value.reason = '';
};

const updateVersion = async () => {
    if (!updateDialog.value.reason.trim()) {
        toast.add({
            severity: 'warn',
            summary: 'Warning',
            detail: 'Please enter a reason for update',
            life: 3000
        });
        return;
    }

    updating.value = true;
    try {
        const payload = {
            type: updateDialog.value.data.type,
            adminID: 1, // TODO: Replace with actual admin ID from auth
            reason: updateDialog.value.reason,
            currentVer: updateDialog.value.data.currentVer || '',
            newVer: updateDialog.value.data.newVer || '',
            link: updateDialog.value.data.link || '',
            isForce: updateDialog.value.data.isForce || 0,
            isMaintainence: updateDialog.value.data.isMaintainence || 0,
            maintenanceMsg: updateDialog.value.data.maintenanceMsg || ''
        };

        const response = await api.post('admin/update-version', payload);
        
        if (response.data.status === 1) {
            toast.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Version updated successfully',
                life: 3000
            });

            closeUpdateDialog();
            fetchVersionList();
        } else {
            throw new Error(response.data.message || 'Update failed');
        }
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: error.response?.data?.message || error.message || 'Failed to update version',
            life: 3000
        });
    } finally {
        updating.value = false;
    }
};

const handleToggle = (channel) => {
    if (channel === 'BOTH' && form.value.channels.BOTH.enabled) {
        form.value.channels.TC.enabled = false;
        form.value.channels.ETEN.enabled = false;
    } else if ((channel === 'TC' || channel === 'ETEN') && form.value.channels[channel].enabled) {
        form.value.channels.BOTH.enabled = false;
    }
};

const TYPE_MAP = {
    TC: ['ios-care', 'android-care'],
    ETEN: ['ios-eten', 'android-eten'],
    BOTH: ['ios-care', 'android-care', 'ios-eten', 'android-eten']
};

const saveMaintenanceConfig = async () => {
    saving.value = true;

    try {
        let activeChannel = '';

        if (form.value.channels.BOTH.enabled) activeChannel = 'BOTH';
        else if (form.value.channels.TC.enabled) activeChannel = 'TC';
        else if (form.value.channels.ETEN.enabled) activeChannel = 'ETEN';
        else activeChannel = 'NONE';

        let typesToUpdate = [];
        let message = '';
        let isMaintainence = 0;
        let currentVer = '';
        let newVer = '';

        if (activeChannel !== 'NONE') {
            typesToUpdate = TYPE_MAP[activeChannel];
            message = form.value.channels[activeChannel].message;
            isMaintainence = 1;

            if (form.value.channels[activeChannel].period && Array.isArray(form.value.channels[activeChannel].period)) {
                const [start, end] = form.value.channels[activeChannel].period;
                currentVer = start ? start.toISOString() : '';
                newVer = end ? end.toISOString() : '';
            }
        } else {
            typesToUpdate = ['ios-care', 'android-care', 'ios-eten', 'android-eten'];
        }

        // Update all affected types
        const updatePromises = typesToUpdate.map(type => 
            api.post('admin/update-version', {
                type: type,
                adminID: 1, // TODO: Replace with actual admin ID from auth
                reason: activeChannel === 'NONE' ? 'Disable maintenance' : 'Maintenance update',
                currentVer: currentVer,
                newVer: newVer,
                link: '',
                isForce: 0,
                isMaintainence: isMaintainence,
                maintenanceMsg: message
            })
        );

        await Promise.all(updatePromises);

        toast.add({
            severity: 'success',
            summary: 'Success',
            detail: activeChannel === 'NONE' ? 'Maintenance disabled' : 'Maintenance updated successfully',
            life: 3000
        });

        fetchVersionList();
    } catch (err) {
        console.error('Error saving maintenance config:', err);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: err.response?.data?.message || err.message || 'Something went wrong',
            life: 4000
        });
    } finally {
        saving.value = false;
    }
};
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
            border-bottom-right-radius:0;
        }
    }
    
    .p-datatable-tbody > tr.p-datatable-emptymessage > td {
        border-bottom-left-radius: 12px;
        border-bottom-right-radius: 12px;
    }
}

</style>
