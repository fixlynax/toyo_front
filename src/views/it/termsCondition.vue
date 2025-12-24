<template>
    <Fluid>
        <div class="flex flex-col">
            <!-- Terms & Conditions Section -->
            <div class="card flex flex-col gap-6 w-full">
                <!-- Header -->
                <div class="flex items-center pb-2 border-b">
                    <div>
                        <div class="text-2xl font-bold text-gray-800">Terms & Conditions</div>
                    </div>
                </div>

                <!-- T&C Form -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <!-- Care T&C -->
                    <div class="md:col-span-2 flex flex-col gap-1">
                        <label class="block text-sm font-bold text-gray-700 mb-1 flex items-center gap-2">Care T&C</label>
                        <div class="flex items-start gap-2">
                            <Textarea v-model="form.careTnc" placeholder="Enter Care Terms & Conditions" rows="6" class="flex-1" :disabled="loading" />
                            <Button icon="pi pi-history" class="p-button-sm p-button-secondary" @click="showLog.careTnc = true" tooltip="View Log History" :disabled="loading" />
                        </div>
                    </div>

                    <!-- ETEN T&C -->
                    <div class="md:col-span-2 flex flex-col gap-1">
                        <label class="block text-sm font-bold text-gray-700 mb-1 flex items-center gap-2">ETEN T&C</label>
                        <div class="flex items-start gap-2">
                            <Textarea v-model="form.etenTnc" placeholder="Enter ETEN Terms & Conditions" rows="6" class="flex-1" :disabled="loading" />
                            <Button icon="pi pi-history" class="p-button-sm p-button-secondary" @click="showLog.etenTnc = true" tooltip="View Log History" :disabled="loading" />
                        </div>
                    </div>
                </div>

                <!-- Action Buttons for T&C -->
                <div class="flex justify-end gap-4 pt-4">
                    <div class="w-32">
                        <Button label="Cancel" class="w-full p-button-secondary" @click="cancel" :disabled="loading" />
                    </div>
                    <div class="w-40">
                        <Button label="Update T&C" class="w-full p-button-warning" @click="submitTncForm" :loading="loading" />
                    </div>
                </div>
            </div>

            <!-- Privacy Policy Section -->
            <div class="card flex flex-col gap-6 w-full">
                <!-- Header -->
                <div class="flex items-center pb-2 border-b">
                    <div>
                        <div class="text-2xl font-bold text-gray-800">Privacy Policy</div>
                    </div>
                </div>

                <!-- Policy Form -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <!-- Care Policy -->
                    <div class="md:col-span-2 flex flex-col gap-1">
                        <label class="block text-sm font-bold text-gray-700 mb-1 flex items-center gap-2">Care Privacy Policy</label>
                        <div class="flex items-start gap-2">
                            <Textarea v-model="form.carePolicy" placeholder="Enter Care Privacy Policy" rows="6" class="flex-1" :disabled="loadingPolicy" />
                            <Button icon="pi pi-history" class="p-button-sm p-button-secondary" @click="showPolicyLog.carePolicy = true" tooltip="View Log History" :disabled="loadingPolicy" />
                        </div>
                    </div>

                    <!-- ETEN Policy -->
                    <div class="md:col-span-2 flex flex-col gap-1">
                        <label class="block text-sm font-bold text-gray-700 mb-1 flex items-center gap-2">
                            ETEN Privacy Policy
                        </label>
                        <div class="flex items-start gap-2">
                            <Textarea v-model="form.etenPolicy" placeholder="Enter ETEN Privacy Policy" rows="6" class="flex-1" :disabled="loadingPolicy" />
                            <Button icon="pi pi-history" class="p-button-sm p-button-secondary" @click="showPolicyLog.etenPolicy = true" tooltip="View Log History" :disabled="loadingPolicy" />
                        </div>
                    </div>
                </div>

                <!-- Action Buttons for Policy -->
                <div class="flex justify-end gap-4 pt-4">
                    <div class="w-32">
                        <Button label="Cancel" class="w-full p-button-secondary" @click="cancel" :disabled="loadingPolicy" />
                    </div>
                    <div class="w-40">
                        <Button label="Update Policy" class="w-full p-button-warning" @click="submitPolicyForm" :loading="loadingPolicy" />
                    </div>
                </div>
            </div>
        </div>

        <!-- Log History Modal for Care T&C -->
        <Dialog header="Care T&C Log History" v-model:visible="showLog.careTnc" :modal="true" :closable="true" :style="{ width: '700px', 'max-width': '90vw' }">
            <div class="flex flex-col gap-3">
                <div v-if="logHistory.careTnc.length === 0" class="p-3 text-center text-gray-500">No log history available</div>
                <div v-for="(log, index) in logHistory.careTnc" :key="index" class="p-4 border rounded-md bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div class="flex justify-between items-start mb-2">
                        <div class="text-sm text-gray-600">
                            <i class="pi pi-calendar mr-2"></i>{{ formatDate(log.created) }}
                            <span v-if="log.deleted" class="text-red-500 ml-2">(Deleted)</span>
                        </div>
                        <div class="text-sm text-gray-600">
                            <i class="pi pi-user mr-2"></i>{{ log.updatedByName }}
                        </div>
                    </div>
                    <div class="text-sm text-gray-700 whitespace-pre-wrap p-3 bg-white rounded border">{{ log.tnc }}</div>
                </div>
            </div>
        </Dialog>

        <!-- Log History Modal for ETEN T&C -->
        <Dialog header="ETEN T&C Log History" v-model:visible="showLog.etenTnc" :modal="true" :closable="true" :style="{ width: '700px', 'max-width': '90vw' }">
            <div class="flex flex-col gap-3">
                <div v-if="logHistory.etenTnc.length === 0" class="p-3 text-center text-gray-500">No log history available</div>
                <div v-for="(log, index) in logHistory.etenTnc" :key="index" class="p-4 border rounded-md bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div class="flex justify-between items-start mb-2">
                        <div class="text-sm text-gray-600">
                            <i class="pi pi-calendar mr-2"></i>{{ formatDate(log.created) }}
                            <span v-if="log.deleted" class="text-red-500 ml-2">(Deleted)</span>
                        </div>
                        <div class="text-sm text-gray-600">
                            <i class="pi pi-user mr-2"></i>{{ log.updatedByName }}
                        </div>
                    </div>
                    <div class="text-sm text-gray-700 whitespace-pre-wrap p-3 bg-white rounded border">{{ log.tnc }}</div>
                </div>
            </div>
        </Dialog>

        <!-- Log History Modal for Care Policy -->
        <Dialog header="Care Privacy Policy Log History" v-model:visible="showPolicyLog.carePolicy" :modal="true" :closable="true" :style="{ width: '700px', 'max-width': '90vw' }">
            <div class="flex flex-col gap-3">
                <div v-if="policyHistory.carePolicy.length === 0" class="p-3 text-center text-gray-500">No log history available</div>
                <div v-for="(log, index) in policyHistory.carePolicy" :key="index" class="p-4 border rounded-md bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div class="flex justify-between items-start mb-2">
                        <div class="text-sm text-gray-600">
                            <i class="pi pi-calendar mr-2"></i>{{ formatDate(log.created) }}
                            <span v-if="log.deleted" class="text-red-500 ml-2">(Deleted)</span>
                        </div>
                        <div class="text-sm text-gray-600">
                            <i class="pi pi-user mr-2"></i>{{ log.updatedByName }}
                        </div>
                    </div>
                    <div class="text-sm text-gray-700 whitespace-pre-wrap p-3 bg-white rounded border">{{ log.policy }}</div>
                </div>
            </div>
        </Dialog>

        <!-- Log History Modal for ETEN Policy -->
        <Dialog header="ETEN Privacy Policy Log History" v-model:visible="showPolicyLog.etenPolicy" :modal="true" :closable="true" :style="{ width: '700px', 'max-width': '90vw' }">
            <div class="flex flex-col gap-3">
                <div v-if="policyHistory.etenPolicy.length === 0" class="p-3 text-center text-gray-500">No log history available</div>
                <div v-for="(log, index) in policyHistory.etenPolicy" :key="index" class="p-4 border rounded-md bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div class="flex justify-between items-start mb-2">
                        <div class="text-sm text-gray-600">
                            <i class="pi pi-calendar mr-2"></i>{{ formatDate(log.created) }}
                            <span v-if="log.deleted" class="text-red-500 ml-2">(Deleted)</span>
                        </div>
                        <div class="text-sm text-gray-600">
                            <i class="pi pi-user mr-2"></i>{{ log.updatedByName }}
                        </div>
                    </div>
                    <div class="text-sm text-gray-700 whitespace-pre-wrap p-3 bg-white rounded border">{{ log.policy }}</div>
                </div>
            </div>
        </Dialog>
    </Fluid>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import Button from 'primevue/button';
import Textarea from 'primevue/textarea';
import Dialog from 'primevue/dialog';
import api from '@/service/api';

const router = useRouter();
const toast = useToast();

const form = ref({
    careTnc: '',
    etenTnc: '',
    carePolicy: '',
    etenPolicy: ''
});

const loading = ref(false);
const loadingPolicy = ref(false);

const showLog = ref({
    careTnc: false,
    etenTnc: false
});

const showPolicyLog = ref({
    carePolicy: false,
    etenPolicy: false
});

const logHistory = ref({
    careTnc: [],
    etenTnc: []
});

const policyHistory = ref({
    carePolicy: [],
    etenPolicy: []
});

const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-GB', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
};

onMounted(async () => {
    await Promise.all([fetchTncData(), fetchPolicyData()]);
});

const fetchTncData = async () => {
    loading.value = true;
    try {
        const response = await api.get('admin/getTNC');

        if (response.data.history_eten) {
            logHistory.value.etenTnc = response.data.history_eten;
            form.value.etenTnc = response.data.last_eten_tnc || '';
        }

        if (response.data.history_care) {
            logHistory.value.careTnc = response.data.history_care;
            form.value.careTnc = response.data.last_care_tnc || '';
        }

        if (!form.value.careTnc) {
            toast.add({
                severity: 'info',
                summary: 'Info',
                detail: 'Enter Care T&C and click Update',
                life: 3000
            });
        }

        toast.add({
            severity: 'success',
            summary: 'Loaded',
            detail: 'T&C data loaded successfully',
            life: 2000
        });
    } catch (error) {
        console.error('Error fetching T&C data:', error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load Terms & Conditions',
            life: 3000
        });
    } finally {
        loading.value = false;
    }
};

const fetchPolicyData = async () => {
    loadingPolicy.value = true;
    try {
        const response = await api.get('admin/getPolicy');

        if (response.data.history_eten) {
            policyHistory.value.etenPolicy = response.data.history_eten;
            form.value.etenPolicy = response.data.last_eten_policy || '';
        }

        if (response.data.history_care) {
            policyHistory.value.carePolicy = response.data.history_care;
            form.value.carePolicy = response.data.last_care_policy || '';
        }

        toast.add({
            severity: 'success',
            summary: 'Loaded',
            detail: 'Privacy Policy data loaded successfully',
            life: 2000
        });
    } catch (error) {
        console.error('Error fetching Policy data:', error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load Privacy Policy',
            life: 3000
        });
    } finally {
        loadingPolicy.value = false;
    }
};

const cancel = () => {
    toast.add({
        severity: 'warn',
        summary: 'Cancelled',
        detail: 'No changes were saved',
        life: 2000
    });
    router.push('/it/dashboard');
};

const submitTncForm = async () => {
    if (form.value.careTnc.trim() === '' && form.value.etenTnc.trim() === '') {
        toast.add({
            severity: 'warn',
            summary: 'Required',
            detail: 'At least one T&C must be filled',
            life: 3000
        });
        return;
    }

    loading.value = true;
    toast.add({
        severity: 'info',
        summary: 'Saving',
        detail: 'Updating Terms & Conditions...',
        life: 2000
    });

    try {
        const response = await api.post('admin/updateTNC', {
            eten_tnc_text: form.value.etenTnc || null,
            care_tnc_text: form.value.careTnc || null
        });

        if (response.data.status === 1) {
            toast.add({
                severity: 'success',
                summary: 'Updated',
                detail: response.data.message || 'Terms & Conditions updated successfully',
                life: 3000
            });

            await fetchTncData();
        } else {
            throw new Error(response.data.error || 'Update failed');
        }
    } catch (error) {
        console.error('Error updating T&C:', error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: error.response?.data?.error || error.message || 'Failed to update T&C',
            life: 3000
        });
    } finally {
        loading.value = false;
    }
};

const submitPolicyForm = async () => {
    if (form.value.carePolicy.trim() === '' && form.value.etenPolicy.trim() === '') {
        toast.add({
            severity: 'warn',
            summary: 'Required',
            detail: 'At least one Privacy Policy must be filled',
            life: 3000
        });
        return;
    }

    loadingPolicy.value = true;
    toast.add({
        severity: 'info',
        summary: 'Saving',
        detail: 'Updating Privacy Policy...',
        life: 2000
    });

    try {
        const response = await api.post('admin/updatePolicy', {
            eten_policy_text: form.value.etenPolicy || null,
            care_policy_text: form.value.carePolicy || null
        });

        if (response.data.status === 1) {
            toast.add({
                severity: 'success',
                summary: 'Updated',
                detail: response.data.message || 'Privacy Policy updated successfully',
                life: 3000
            });

            await fetchPolicyData();
        } else {
            throw new Error(response.data.error || 'Update failed');
        }
    } catch (error) {
        console.error('Error updating Policy:', error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: error.response?.data?.error || error.message || 'Failed to update Privacy Policy',
            life: 3000
        });
    } finally {
        loadingPolicy.value = false;
    }
};
</script>