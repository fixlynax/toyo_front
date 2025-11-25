<template>
    <Fluid>
        <div class="flex flex-col md:flex-row gap-8">
            <div class="card flex flex-col gap-6 w-full">
                <!-- Header -->
                <div class="text-2xl font-bold text-gray-800 border-b pb-2">Terms & Conditions</div>

                <!-- T&C Form -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <!-- Toyocares T&C -->
                    <div class="md:col-span-2 flex flex-col gap-1">
                        <label class="block text-sm font-bold text-gray-700 mb-1">Toyocares T&C</label>
                        <div class="flex items-start gap-2">
                            <Textarea v-model="form.tcTnc" placeholder="Enter Toyocares Terms & Conditions" rows="6" class="flex-1" :disabled="loading" />
                            <Button icon="pi pi-history" class="p-button-sm p-button-secondary" @click="showLog.tcTnc = true" tooltip="View Log History" :disabled="loading" />
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

        <!-- Log History Modal for Toyocares -->
        <Dialog header="Toyocares T&C Log History" v-model:visible="showLog.tcTnc" :modal="true" :closable="true" :style="{ width: '600px' }">
            <div class="flex flex-col gap-3">
                <div v-if="logHistory.tcTnc.length === 0" class="p-3 text-center text-gray-500">No log history available</div>
                <div v-for="(log, index) in logHistory.tcTnc" :key="index" class="p-3 border rounded-md bg-gray-50">
                    <div class="text-sm text-gray-600">Updated On: {{ formatDate(log.last_updated) }}</div>
                    <div class="text-sm text-gray-700 whitespace-pre-wrap">{{ log.content_text }}</div>
                </div>
            </div>
        </Dialog>

        <!-- Log History Modal for ETEN -->
        <Dialog header="ETEN T&C Log History" v-model:visible="showLog.etenTnc" :modal="true" :closable="true" :style="{ width: '600px' }">
            <div class="flex flex-col gap-3">
                <div v-if="logHistory.etenTnc.length === 0" class="p-3 text-center text-gray-500">No log history available</div>
                <div v-for="(log, index) in logHistory.etenTnc" :key="index" class="p-3 border rounded-md bg-gray-50">
                    <div class="text-sm text-gray-600">Updated On: {{ formatDate(log.last_updated) }}</div>
                    <div class="text-sm text-gray-700 whitespace-pre-wrap">{{ log.content_text }}</div>
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
    tcTnc: '',
    etenTnc: ''
});

const loading = ref(false);
const showLog = ref({
    tcTnc: false,
    etenTnc: false
});

const logHistory = ref({
    tcTnc: [],
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
    toast.add({ severity: 'info', summary: 'Loading', detail: 'Fetching latest T&C...', life: 2000 });
    await fetchTncData();
});

const fetchTncData = async () => {
    loading.value = true;
    try {
        const etenResponse = await api.get('getetenTnc');
        if (etenResponse.data.status === 1 && etenResponse.data.eten_tnc) {
            form.value.etenTnc = etenResponse.data.eten_tnc.content_text;
            logHistory.value.etenTnc = [etenResponse.data.eten_tnc];
        }

        try {
            const tcResponse1 = await api.get('tcTnc');
            if (tcResponse1.data.status === 1 && tcResponse1.data.tc_tnc) {
                form.value.tcTnc = tcResponse1.data.tc_tnc.content_text;
                logHistory.value.tcTnc = [tcResponse1.data.tc_tnc];
            }
        } catch (tcError) {
            try {
                const tcResponse2 = await api.get('getTcTnc');
                if (tcResponse2.data.status === 1 && tcResponse2.data.tc_tnc) {
                    form.value.tcTnc = tcResponse2.data.tc_tnc.content_text;
                    logHistory.value.tcTnc = [tcResponse2.data.tc_tnc];
                }
            } catch (tcError2) {}
        }

        if (!form.value.tcTnc) {
            toast.add({
                severity: 'info',
                summary: 'Info',
                detail: 'Enter Toyocares T&C and click Update',
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
    if (!form.value.tcTnc.trim() || !form.value.etenTnc.trim()) {
        toast.add({
            severity: 'warn',
            summary: 'Required',
            detail: 'Both Toyocares and ETEN T&C must be filled',
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
        const tcResponse = await api.post('tcTnc/update', {
            tc_tnc_text: form.value.tcTnc
        });

        const etenResponse = await api.post('etenTnc/update', {
            eten_tnc_text: form.value.etenTnc
        });

        if (tcResponse.data.status === 1 && etenResponse.data.status === 1) {
            toast.add({
                severity: 'success',
                summary: 'Updated',
                detail: 'Terms & Conditions updated successfully',
                life: 7000
            });

            if (tcResponse.data.tc_tnc) {
                logHistory.value.tcTnc.unshift(tcResponse.data.tc_tnc);
            }
            if (etenResponse.data.eten_tnc) {
                logHistory.value.etenTnc.unshift(etenResponse.data.eten_tnc);
            }

            await fetchTncData();
        } else {
            throw new Error('Update failed');
        }
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: error.response?.data?.message || 'Failed to update T&C',
            life: 3000
        });
    } finally {
        loading.value = false;
    }
};
</script>
