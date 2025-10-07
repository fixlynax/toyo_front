<template>
    <Fluid>
        <div class="flex flex-col md:flex-row gap-8">
            <div class="card flex flex-col gap-6 w-full">
                <!-- Header -->
                <div class="text-2xl font-bold text-gray-800 border-b pb-2">Create Mail Setting</div>

                <!-- User Group Form -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <!-- Function -->
                    <div class="md:col-span-2">
                        <label class="block text-sm font-bold text-gray-700 mb-2">Function</label>
                        <Dropdown v-model="form.functionOption" :options="functionOption" filter optionLabel="label" placeholder="Select shipping point" class="w-full" @change="filterEmails" />
                    </div>

                    <!-- Shipping Point -->
                    <div class="md:col-span-2">
                        <label class="block text-sm font-bold text-gray-700 mb-2">Shipping Point</label>
                        <Dropdown v-model="form.shippingPoint" :options="shippingPointOptions" filter optionLabel="label" placeholder="Select shipping point" class="w-full" @change="filterEmails" />
                    </div>

                    <!-- Email List -->
                    <div class="md:col-span-2">
                        <label class="block text-sm font-bold text-gray-700 mb-2">Email list</label>
                        <MultiSelect v-model="form.emails" :options="filteredEmailOptions" optionLabel="label" filter placeholder="Select email recipients" display="chip" class="w-full" :disabled="!form.shippingPoint" />
                    </div>
                    <div class="md:col-span-2">
                        <label class="block text-sm font-bold text-gray-700 mb-2">Subject</label>
                        <InputText filter placeholder="Insert Subject" class="w-full" />
                    </div>
                    <div class="md:col-span-2">
                        <label class="block text-sm font-bold text-gray-700 mb-2">Content</label>
                        <InputText filter placeholder="Insert Content" class="w-full" />
                    </div>
                </div>

                <!-- Action Buttons -->
                <div class="flex justify-end mt-8 gap-4">
                    <div class="w-32">
                        <Button label="Cancel" class="w-full p-button-secondary" @click="cancel" />
                    </div>
                    <div class="w-32">
                        <Button label="Create" class="w-full p-button-success" @click="submitForm" />
                    </div>
                </div>
            </div>
        </div>
    </Fluid>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// Form data
const form = ref({
    function: '',
    shippingPoint: null,
    emails: []
});

// Dummy shipping points
const functionOption = [
    { label: 'OM', value: 'port_klang' },
    { label: 'CTC', value: 'johor_port' },
    { label: 'Technical', value: 'penang_port' }
];
const shippingPointOptions = [
    { label: 'PS Tyres & Battery Auto Services Sdn. Bhd', value: 'port_klang' },
    { label: 'Toyo Auto Centre UHP Tyres Sdn Bhd Johor Port', value: 'johor_port' },
    { label: 'Penang Port', value: 'penang_port' }
];

// Dummy email data (grouped by shipping point)
const allEmailOptions = {
    port_klang: [
        { label: 'klang.ops@example.com', value: 'klang.ops@example.com' },
        { label: 'klang.manager@example.com', value: 'klang.manager@example.com' }
    ],
    johor_port: [
        { label: 'johor.ops@example.com', value: 'johor.ops@example.com' },
        { label: 'johor.teamlead@example.com', value: 'johor.teamlead@example.com' }
    ],
    penang_port: [
        { label: 'penang.ops@example.com', value: 'penang.ops@example.com' },
        { label: 'penang.supervisor@example.com', value: 'penang.supervisor@example.com' }
    ]
};

// Reactive filtered list
const filteredEmailOptions = ref([]);

// Filter emails based on shipping point
const filterEmails = () => {
    const point = form.value.shippingPoint?.value;
    filteredEmailOptions.value = point ? allEmailOptions[point] || [] : [];
    form.value.emails = []; // reset email selection when shipping point changes
};

// Cancel
const cancel = () => {
    router.push('/it/listMailSetting');
};

// Submit
const submitForm = () => {
    router.push('/it/listMailSetting');
};
</script>
