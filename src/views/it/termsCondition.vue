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
                            <Textarea v-model="form.tcTnc" placeholder="Enter Toyocares Terms & Conditions" rows="6" class="flex-1" />
                            <Button icon="pi pi-history" class="p-button-sm p-button-secondary" @click="showLog.tcTnc = true" tooltip="View Log History" />
                        </div>
                    </div>

                    <!-- ETEN T&C -->
                    <div class="md:col-span-2 flex flex-col gap-1">
                        <label class="block text-sm font-bold text-gray-700 mb-1">ETEN T&C</label>
                        <div class="flex items-start gap-2">
                            <Textarea v-model="form.etenTnc" placeholder="Enter ETEN Terms & Conditions" rows="6" class="flex-1" />
                            <Button icon="pi pi-history" class="p-button-sm p-button-secondary" @click="showLog.etenTnc = true" tooltip="View Log History" />
                        </div>
                    </div>
                </div>

                <!-- Action Buttons -->
                <div class="flex justify-end mt-8 gap-4">
                    <div class="w-32">
                        <Button label="Cancel" class="w-full p-button-secondary" @click="cancel" />
                    </div>
                    <div class="w-32">
                        <Button label="Update" class="w-full p-button-success" @click="submitForm" />
                    </div>
                </div>
            </div>
        </div>

        <!-- Log History Modal for Toyocares -->
        <Dialog header="Toyocares T&C Log History" v-model:visible="showLog.tcTnc" :modal="true" :closable="true" :style="{ width: '600px' }">
            <div class="flex flex-col gap-3">
                <div v-for="(log, index) in logHistory.tcTnc" :key="index" class="p-3 border rounded-md bg-gray-50">
                    <div class="text-sm text-gray-600">Updated On: {{ log.date }}</div>
                    <div class="text-sm text-gray-700 whitespace-pre-wrap">{{ log.text }}</div>
                </div>
            </div>
        </Dialog>

        <!-- Log History Modal for ETEN -->
        <Dialog header="ETEN T&C Log History" v-model:visible="showLog.etenTnc" :modal="true" :closable="true" :style="{ width: '600px' }">
            <div class="flex flex-col gap-3">
                <div v-for="(log, index) in logHistory.etenTnc" :key="index" class="p-3 border rounded-md bg-gray-50">
                    <div class="text-sm text-gray-600">Updated On: {{ log.date }}</div>
                    <div class="text-sm text-gray-700 whitespace-pre-wrap">{{ log.text }}</div>
                </div>
            </div>
        </Dialog>
    </Fluid>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import Button from 'primevue/button';
import Textarea from 'primevue/textarea';
import Dialog from 'primevue/dialog';

const router = useRouter();

const form = ref({
    tcTnc: '',
    etenTnc: ''
});

// Show/hide modal for each textarea
const showLog = ref({
    tcTnc: false,
    etenTnc: false
});

// Dummy log history
const logHistory = ref({
    tcTnc: [
        { date: '2025-10-01 10:00', text: 'Old Toyocares T&C v1' },
        { date: '2025-09-15 14:30', text: 'Old Toyocares T&C v0.9' }
    ],
    etenTnc: [
        { date: '2025-10-01 10:00', text: 'Old ETEN T&C v1' },
        { date: '2025-09-15 14:30', text: 'Old ETEN T&C v0.9' }
    ]
});

const cancel = () => {
    router.push('/it/dashboard'); // adjust route
};

const submitForm = () => {
    if (!form.value.tcTnc || !form.value.etenTnc) {
        alert('⚠️ Both Toyocares and ETEN T&C are required');
        return;
    }

    console.log('✅ Terms & Conditions Updated:', form.value);
    // TODO: API call to save updated T&C and log
    router.push('/it/dashboard');
};
</script>
