<template>
    <Fluid>
        <div class="flex flex-col md:flex-row gap-8">
            <div class="card flex flex-col gap-6 w-full">
                <div class="text-2xl font-bold text-gray-800 border-b pb-2">Maintenance Mode </div>

                <div class="flex flex-col gap-6">
                    <div 
                        v-for="channel in channelOptions" 
                        :key="channel.value" 
                        class="border rounded-lg p-4 flex flex-col gap-4"
                    >
                        <div class="flex items-center justify-between">
                            <span class="font-medium text-gray-800">{{ channel.label }}</span>
                            <InputSwitch 
                                v-model="form.channels[channel.value].enabled" 
                                @change="handleToggle(channel.value)" 
                            />
                        </div>

                        <div v-if="form.channels[channel.value].enabled" class="grid grid-cols-1 gap-4">
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

const form = ref({
    channels: {
        TC: { enabled: false, period: null, message: '' },
        ETEN: { enabled: false, period: null, message: '' },
        BOTH: { enabled: false, period: null, message: '' }
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

    toast.add({
        severity: 'info',
        summary: 'Selection Updated',
        detail: `${channel} toggle changed`,
        life: 2000
    });
};

const TYPE_MAP = {
    TC: ['ios-care', 'android-care'],
    ETEN: ['ios-eten', 'android-eten'],
    BOTH: ['ios-care', 'android-care', 'ios-eten', 'android-eten']
};

toast.add({
    severity: 'info',
    summary: 'Maintenance Mode',
    detail: 'Configure the channels below.',
    life: 2000
});

const save = async () => {
    saving.value = true;

    toast.add({
        severity: 'info',
        summary: 'Saving',
        detail: 'Updating maintenance mode...',
        life: 2000
    });

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

            if (form.value.channels[activeChannel].period && form.value.channels[activeChannel].period.length === 2) {
                const [start, end] = form.value.channels[activeChannel].period;
                currentVer = start ? new Date(start).toISOString() : '';
                newVer = end ? new Date(end).toISOString() : '';
            }
        } else {
            typesToUpdate = [
                'ios-care',
                'android-care',
                'ios-eten',
                'android-eten'
            ];
        }

        for (const t of typesToUpdate) {
            await api.post('admin/update-version', {
                type: t,
                adminID: 1,
                reason: activeChannel === 'NONE' ? 'Disable maintenance' : 'Maintenance update',
                currentVer,
                newVer,
                link: '',
                isForce: 0,
                isMaintainence,
                maintenanceMsg: message
            });
        }

        toast.add({
            severity: 'success',
            summary: 'Success',
            detail: activeChannel === 'NONE' ? 'Maintenance disabled' : 'Maintenance updated successfully',
            life: 3000
        });

        router.push('/it/maintenanceMode');
    } catch (err) {
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

