<template>
    <Fluid>
        <div class="flex flex-col gap-6">
            <!-- Unified Form Card -->
            <div class="card p-6 shadow-sm rounded-lg bg-white flex flex-col gap-6">
                <!-- Page Header -->
                <div class="text-2xl font-bold text-gray-800">Mail Push Settings</div>

                <!-- Navigation -->
                <div class="flex border-b">
                    <RouterLink to="/it/listMailSetting" class="py-2 px-6 text-center cursor-pointer -mb-px border-b-2 border-transparent text-gray-500">eTEN</RouterLink>
                    <div class="py-2 px-6 text-center cursor-pointer -mb-px border-b-2 border-blue-500 text-blue-600 font-semibold">Admin</div>
                </div>

                <!-- Form Fields -->
                <div class="flex flex-col gap-6 mt-4">
                    <div v-for="mail in mailOptions" :key="mail.value" class="border rounded-md p-4 flex flex-col gap-4 hover:shadow-sm transition-shadow bg-gray-50">
                        <span class="font-medium text-gray-800">{{ mail.label }}</span>

                        <div class="flex flex-col gap-2">
                            <div v-for="(entry, index) in form.mails[mail.value]" :key="index" class="flex gap-2 items-end">
                                <!-- Email Address -->
                                <div class="flex-1">
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                    <InputText v-model="entry.email" class="w-full" />
                                </div>

                                <!-- Shipping Point -->
                                <div class="flex-1">
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Shipping Point</label>
                                    <InputText v-model="entry.shippoint" class="w-full" />
                                </div>

                                <!-- Remove Button (icon only) -->
                                <div class="flex items-end">
                                    <Button icon="pi pi-trash" class="p-button-danger" @click="removeEmail(mail.value, index)" tooltip="Remove Email" />
                                </div>
                            </div>

                            <!-- Add Button -->
                            <div class="mt-2">
                                <Button label="+ Add Email" class="p-button-sm p-button-secondary" @click="addEmail(mail.value)" />
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Save Button -->
                <div class="flex justify-end mt-4">
                    <Button label="Save" class="p-button-primary" @click="save" />
                </div>
            </div>
        </div>
    </Fluid>
</template>

<script setup>
import { ref } from 'vue';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';

// Dummy form data as arrays
const form = ref({
    mails: {
        Marketing: [{ email: 'sample1@example.com', shippoint: 'SP001' }],
        Technical: [{ email: 'sample1@example.com', shippoint: 'SP001' }],
        OM: [{ email: 'sample1@example.com', shippoint: 'SP001' }],
        CTC: [{ email: 'sample1@example.com', shippoint: 'SP001' }],
        SCRAP: [{ email: 'sample2@example.com', shippoint: 'SP002' }]
    }
});

// Dummy mail options
const mailOptions = [
    { label: 'OM', value: 'OM' },
    { label: 'Marketing', value: 'Marketing' },
    { label: 'Technical', value: 'Technical' },
    { label: 'Customer Technical Complaint (CTC)', value: 'CTC' },
    { label: 'Scrap Claim', value: 'SCRAP' }
];

// Add new email entry
const addEmail = (mailType) => {
    form.value.mails[mailType].push({ email: '', shippoint: '' });
};

// Remove email entry
const removeEmail = (mailType, index) => {
    form.value.mails[mailType].splice(index, 1);
};

// Dummy save function
const save = () => {
    alert('Dummy save clicked!\n' + JSON.stringify(form.value, null, 2));
};
</script>
