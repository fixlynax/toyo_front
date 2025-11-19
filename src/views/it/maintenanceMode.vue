<template>
    <Fluid>
        <div class="flex flex-col md:flex-row gap-8">
            <div class="card flex flex-col gap-6 w-full">
                <!-- Header -->
                <div class="text-2xl font-bold text-gray-800 border-b pb-2">Maintenance Mode</div>

                <!-- Channel Toggles -->
                <div class="flex flex-col gap-6">
                    <div 
                        v-for="channel in channelOptions" 
                        :key="channel.value" 
                        class="border rounded-lg p-4 flex flex-col gap-4"
                    >
                        <!-- Toggle Row -->
                        <div class="flex items-center justify-between">
                            <span class="font-medium text-gray-800">{{ channel.label }}</span>
                            <InputSwitch 
                                v-model="form.channels[channel.value].enabled" 
                                @change="handleToggle(channel.value)" 
                            />
                        </div>

                        <!-- Show Period & Message only if ON -->
                        <div v-if="form.channels[channel.value].enabled" class="grid grid-cols-1 gap-4">
                            <!-- Period -->
                            <div>
                                <label class="block text-sm font-bold text-gray-700 mb-2">Period (Date/Time)</label>
                                <DatePicker 
                                    v-model="form.channels[channel.value].period" 
                                    selectionMode="range" 
                                    showIcon 
                                    showTime 
                                    hourFormat="24" 
                                    :manualInput="true" 
                                    class="w-full" 
                                />
                            </div>

                            <!-- Message -->
                            <div>
                                <label class="block text-sm font-bold text-gray-700 mb-2">Message</label>
                                <Textarea 
                                    v-model="form.channels[channel.value].message" 
                                    placeholder="Enter maintenance message" 
                                    rows="3" 
                                    class="w-full" 
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Save Button -->
                <div class="flex justify-end mt-8 gap-4">
                    <div class="w-32">
                        <Button label="Update" class="w-full p-button-primary" @click="save" :loading="saving" />
                    </div>
                </div>
            </div>
        </div>
    </Fluid>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import InputSwitch from 'primevue/inputswitch';
import DatePicker from 'primevue/datepicker';
import Textarea from 'primevue/textarea';
import Button from 'primevue/button';
import api from '@/service/api';
import { useToast } from 'primevue/usetoast';

const router = useRouter();
const toast = useToast();
const saving = ref(false);

const dummyPeriods = {
    TC: [new Date("2025-02-10T09:00:00"), new Date("2025-02-10T12:00:00")],
    ETEN: [new Date("2025-02-12T14:00:00"), new Date("2025-02-12T16:30:00")],
    BOTH: [new Date("2025-02-15T08:30:00"), new Date("2025-02-15T11:00:00")]
};

const dummyMessages = {
    TC: "Toyocares system under maintenance. Please try again later.",
    ETEN: "ETEN will be down for upgrades.",
    BOTH: "Full system maintenance (TC & ETEN) in progress."
};

const form = ref({
    channels: {
        TC: { enabled: false, period: dummyPeriods.TC, message: dummyMessages.TC },
        ETEN: { enabled: false, period: dummyPeriods.ETEN, message: dummyMessages.ETEN },
        BOTH: { enabled: false, period: dummyPeriods.BOTH, message: dummyMessages.BOTH }
    }
});

const channelOptions = [
    { label: 'Toyocares (TC)', value: 'TC' },
    { label: 'ETEN', value: 'ETEN' },
    { label: 'Both', value: 'BOTH' }
];

const handleToggle = (channel) => {
    if (channel === 'BOTH' && form.value.channels.BOTH.enabled) {
        form.value.channels.TC.enabled = false;
        form.value.channels.ETEN.enabled = false;
    } else if ((channel === 'TC' || channel === 'ETEN') && form.value.channels[channel].enabled) {
        form.value.channels.BOTH.enabled = false;
    }
};

const save = async () => {
    saving.value = true;

    try {
        // Determine maintenance type and message
        let type = '';
        let maintenanceMsg = '';
        if (form.value.channels.BOTH.enabled) {
            type = 'BOTH';
            maintenanceMsg = form.value.channels.BOTH.message;
        } else if (form.value.channels.TC.enabled) {
            type = 'TC';
            maintenanceMsg = form.value.channels.TC.message;
        } else if (form.value.channels.ETEN.enabled) {
            type = 'ETEN';
            maintenanceMsg = form.value.channels.ETEN.message;
        } else {
            type = 'NONE';
            maintenanceMsg = '';
        }

        const payload = {
            type,
            isMaintainence: type !== 'NONE' ? 1 : 0,
            maintenanceMsg,
            adminID: 123, // replace with actual admin ID
            currentVer: '1.0.0', // optional
            newVer: '1.0.0',     // optional
            link: '',            // optional
            isForce: 0,          // optional
            reason: ''
        };

        const res = await api.post('admin/update-version', payload);

        if (res.data.status === 1) {
            toast.add({
                severity: 'success',
                summary: 'Updated',
                detail: res.data.message || 'Maintenance updated successfully',
                life: 3000
            });
            router.push('/it/maintenanceMode');
        } else {
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: res.data.message || 'Failed to update maintenance',
                life: 4000
            });
        }
    } catch (err) {
        console.error(err);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: err.response?.data?.message || 'Something went wrong',
            life: 4000
        });
    } finally {
        saving.value = false;
    }
};
</script>
