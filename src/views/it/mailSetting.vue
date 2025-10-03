<template>
    <Fluid>
        <div class="flex flex-col md:flex-row gap-8">
            <div class="card flex flex-col gap-6 w-full">
                <!-- Header -->
                <div class="text-2xl font-bold text-gray-800 border-b pb-2">Email Setting</div>

                <!-- Email Form -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <!-- Notification Email Name -->
                    <div>
                        <label class="block text-sm font-bold text-gray-700 mb-2">Notification Email Name</label>
                        <Dropdown v-model="form.notificationName" :options="notificationOptions" optionLabel="label" optionValue="value" placeholder="Select Notification" class="w-full" />
                    </div>

                    <!-- Email Address -->
                    <div>
                        <label class="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                        <InputText v-model="form.email" placeholder="Enter email" class="w-full" />
                    </div>

                    <!-- Shipping Point -->
                    <div class="md:col-span-2">
                        <label class="block text-sm font-bold text-gray-700 mb-2">Shipping Point</label>
                        <InputText v-model="form.shippingPoint" placeholder="Enter shipping point" class="w-full" />
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
    </Fluid>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const form = ref({
    notificationName: '',
    email: '',
    shippingPoint: ''
});

const notificationOptions = [
    { label: 'System Alert', value: 'System Alert' },
    { label: 'Password Reset', value: 'Password Reset' },
    { label: 'Shipping Notification', value: 'Shipping Notification' }
];

const cancel = () => {
    router.push('/it/dashboard'); // adjust route
};

const submitForm = () => {
    if (!form.value.notificationName || !form.value.email) {
        alert('⚠️ Notification name and Email are required');
        return;
    }

    console.log('✅ Email Setting Updated:', form.value);
    // TODO: API call to save email settings
    router.push('/it/dashboard');
};
</script>
