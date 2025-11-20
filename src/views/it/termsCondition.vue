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
                <div v-if="logHistory.tcTnc.length === 0" class="p-3 text-center text-gray-500">
                    No log history available
                </div>
                <div v-for="(log, index) in logHistory.tcTnc" :key="index" class="p-3 border rounded-md bg-gray-50">
                    <div class="text-sm text-gray-600">Updated On: {{ formatDate(log.last_updated) }}</div>
                    <div class="text-sm text-gray-700 whitespace-pre-wrap">{{ log.content_text }}</div>
                </div>
            </div>
        </Dialog>

        <!-- Log History Modal for ETEN -->
        <Dialog header="ETEN T&C Log History" v-model:visible="showLog.etenTnc" :modal="true" :closable="true" :style="{ width: '600px' }">
            <div class="flex flex-col gap-3">
                <div v-if="logHistory.etenTnc.length === 0" class="p-3 text-center text-gray-500">
                    No log history available
                </div>
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

// Format date for display
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

// Fetch T&C data on component mount
onMounted(async () => {
    await fetchTncData();
});

const fetchTncData = async () => {
    loading.value = true;
    try {
        // Fetch ETEN TNC - this endpoint works
        const etenResponse = await api.get('getetenTnc');
        if (etenResponse.data.status === 1 && etenResponse.data.eten_tnc) {
            form.value.etenTnc = etenResponse.data.eten_tnc.content_text;
            // Add current version to log history
            logHistory.value.etenTnc = [etenResponse.data.eten_tnc];
        }

        // For TC TNC, we need to find the correct view endpoint
        // Since the update endpoint doesn't work for GET, let's try some alternatives
        try {
            // Try common view endpoints
            const tcResponse1 = await api.get('tcTnc');
            if (tcResponse1.data.status === 1 && tcResponse1.data.tc_tnc) {
                form.value.tcTnc = tcResponse1.data.tc_tnc.content_text;
                logHistory.value.tcTnc = [tcResponse1.data.tc_tnc];
            }
        } catch (tcError) {
            console.log('First TC TNC endpoint failed, trying alternatives...');
            
            try {
                // Try another common pattern
                const tcResponse2 = await api.get('getTcTnc');
                if (tcResponse2.data.status === 1 && tcResponse2.data.tc_tnc) {
                    form.value.tcTnc = tcResponse2.data.tc_tnc.content_text;
                    logHistory.value.tcTnc = [tcResponse2.data.tc_tnc];
                }
            } catch (tcError2) {
                console.log('All TC TNC view endpoints failed');
                // TC TNC will remain empty, user can enter new content
            }
        }

        // If we still don't have TC TNC data, show info message
        if (!form.value.tcTnc) {
            toast.add({
                severity: 'info',
                summary: 'Info',
                detail: 'Enter Toyocares T&C content and click Update to save',
                life: 4000
            });
        }

    } catch (error) {
        console.error('Error fetching T&C data:', error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load Terms & Conditions data',
            life: 3000
        });
    } finally {
        loading.value = false;
    }
};

const cancel = () => {
    router.push('/it/dashboard');
};

const submitForm = async () => {
    if (!form.value.tcTnc.trim() || !form.value.etenTnc.trim()) {
        toast.add({
            severity: 'warn',
            summary: 'Warning',
            detail: 'Both Toyocares and ETEN T&C are required',
            life: 3000
        });
        return;
    }

    loading.value = true;
    try {
        // Update TC TNC
        const tcResponse = await api.post('tcTnc/update', {
            tc_tnc_text: form.value.tcTnc
        });

        // Update ETEN TNC
        const etenResponse = await api.post('etenTnc/update', {
            eten_tnc_text: form.value.etenTnc
        });

        if (tcResponse.data.status === 1 && etenResponse.data.status === 1) {
            toast.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Terms & Conditions updated successfully',
                life: 3000
            });

            // Update log history with new data from responses
            if (tcResponse.data.tc_tnc) {
                logHistory.value.tcTnc.unshift(tcResponse.data.tc_tnc);
            }
            if (etenResponse.data.eten_tnc) {
                logHistory.value.etenTnc.unshift(etenResponse.data.eten_tnc);
            }

            // Refresh the data to show updated content
            await fetchTncData();
            
        } else {
            throw new Error('Failed to update one or more T&C');
        }
    } catch (error) {
        console.error('Error updating T&C:', error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: error.response?.data?.message || 'Failed to update Terms & Conditions',
            life: 3000
        });
    } finally {
        loading.value = false;
    }
};
</script>