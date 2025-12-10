<template>
    <Fluid>
        <div class="flex flex-col md:flex-row gap-8">
            <div class="card flex flex-col gap-6 w-full">
                <!-- Header -->
                <div class="text-2xl font-bold text-gray-800 border-b pb-2">Terms & Conditions</div>

                <!-- T&C Form -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <!-- Care T&C -->
                    <div class="md:col-span-2 flex flex-col gap-1">
                        <label class="block text-sm font-bold text-gray-700 mb-1">Care T&C</label>
                        <div class="flex items-start gap-2">
                            <Textarea v-model="form.careTnc" placeholder="Enter Care Terms & Conditions" rows="6" class="flex-1" :disabled="loading" />
                            <Button icon="pi pi-history" class="p-button-sm p-button-secondary" @click="showLog.careTnc = true" tooltip="View Log History" :disabled="loading" />
                        </div>
                    </div>

                    <!-- ETEN T&C -->
                    <div class="md:col-span-2 flex flex-col gap-1">
                        <label class="block text-sm font-bold text-gray-700 mb-1">ETEN T&C</label>
                        <div class="flex items-start gap-2">
                            <Textarea v-model="form.etenTnc" placeholder="Enter ETEN Terms & Conditions" rows="6" class="flex-1" :disabled="loading" />
                            <Button icon="pi pi-history" class="p-button-sm p-button-secondary" @click="showLog.etenTnc = true" tooltip="View Log History" :disabled="loading" />
                        </div>
                    </div>
                </div>

                <!-- Action Buttons -->
                <div class="flex justify-end mt-8 gap-4">
                    <div class="w-32">
                        <Button label="Cancel" class="w-full p-button-secondary" @click="cancel" :disabled="loading" />
                    </div>
                    <div class="w-32">
                        <Button label="Update" class="w-full p-button-success" @click="submitForm" :loading="loading" />
                    </div>
                </div>
            </div>
        </div>

        <!-- Log History Modal for Care -->
        <Dialog header="Care T&C Log History" v-model:visible="showLog.careTnc" :modal="true" :closable="true" :style="{ width: '600px' }">
            <div class="flex flex-col gap-3">
                <div v-if="logHistory.careTnc.length === 0" class="p-3 text-center text-gray-500">No log history available</div>
                <div v-for="(log, index) in logHistory.careTnc" :key="index" class="p-3 border rounded-md bg-gray-50">
                    <div class="text-sm text-gray-600">
                        Updated On: {{ formatDate(log.created) }}
                        <span v-if="log.deleted" class="text-red-500 ml-2">(Deleted)</span>
                    </div>
                    <div class="text-sm text-gray-600 mb-2">Updated By: {{ log.updatedByName }}</div>
                    <div class="text-sm text-gray-700 whitespace-pre-wrap">{{ log.tnc }}</div>
                </div>
            </div>
        </Dialog>

        <!-- Log History Modal for ETEN -->
        <Dialog header="ETEN T&C Log History" v-model:visible="showLog.etenTnc" :modal="true" :closable="true" :style="{ width: '600px' }">
            <div class="flex flex-col gap-3">
                <div v-if="logHistory.etenTnc.length === 0" class="p-3 text-center text-gray-500">No log history available</div>
                <div v-for="(log, index) in logHistory.etenTnc" :key="index" class="p-3 border rounded-md bg-gray-50">
                    <div class="text-sm text-gray-600">
                        Updated On: {{ formatDate(log.created) }}
                        <span v-if="log.deleted" class="text-red-500 ml-2">(Deleted)</span>
                    </div>
                    <div class="text-sm text-gray-600 mb-2">Updated By: {{ log.updatedByName }}</div>
                    <div class="text-sm text-gray-700 whitespace-pre-wrap">{{ log.tnc }}</div>
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
    etenTnc: ''
});

const loading = ref(false);
const showLog = ref({
    careTnc: false,
    etenTnc: false
});

const logHistory = ref({
    careTnc: [],
    etenTnc: []
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
    await fetchTncData();
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

const cancel = () => {
    toast.add({
        severity: 'warn',
        summary: 'Cancelled',
        detail: 'No changes were saved',
        life: 2000
    });
    router.push('/it/dashboard');
};

const submitForm = async () => {
    // Allow empty T&C submission
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

            // Refresh data
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
</script>
