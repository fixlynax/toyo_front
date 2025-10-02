<template>
    <Fluid>
        <div class="flex flex-col md:flex-row gap-8">
            <div class="card flex flex-col gap-6 w-full">
                <!-- Header -->
                <div class="text-2xl font-bold text-gray-800 border-b pb-2">Create Sales User</div>

                <!-- Sales User Form -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <!-- Name -->
                    <div>
                        <label class="block text-sm font-bold text-gray-700 mb-2">Name</label>
                        <InputText v-model="form.name" placeholder="Enter full name" class="w-full" />
                    </div>

                    <!-- Title -->
                    <div>
                        <label class="block text-sm font-bold text-gray-700 mb-2">Title</label>
                        <InputText v-model="form.title" placeholder="Enter title (e.g. Saleswoman)" class="w-full" />
                    </div>

                    <!-- Email -->
                    <div>
                        <label class="block text-sm font-bold text-gray-700 mb-2">Email</label>
                        <InputText v-model="form.email" placeholder="Enter email" class="w-full" />
                    </div>

                    <!-- Mobile -->
                    <div>
                        <label class="block text-sm font-bold text-gray-700 mb-2">Mobile</label>
                        <InputText v-model="form.mobile" placeholder="e.g. 0172345678" class="w-full" @input="form.mobile = form.mobile.replace(/[^0-9]/g, '')" />
                    </div>

                    <!-- Sales Office -->
                    <div>
                        <label class="block text-sm font-bold text-gray-700 mb-2">Sales Office</label>
                        <InputText v-model="form.salesOffice" placeholder="Enter sales office" class="w-full" />
                    </div>

                    <!-- Sales District -->
                    <div>
                        <label class="block text-sm font-bold text-gray-700 mb-2">Sales District</label>
                        <Dropdown v-model="form.salesDistrict" :options="districtOptions" optionLabel="label" optionValue="value" placeholder="Select district" class="w-full" />
                    </div>

                    <!-- Status -->
                    <div>
                        <label class="block text-sm font-bold text-gray-700 mb-2">Status</label>
                        <Dropdown v-model="form.status" :options="statusOptions" optionLabel="label" optionValue="value" placeholder="Select status" class="w-full" />
                    </div>

                    <!-- Place Order -->
                    <div>
                        <label class="block text-sm font-bold text-gray-700 mb-2">Place Order</label>
                        <Dropdown v-model="form.placeorder" :options="placeOrderOptions" optionLabel="label" optionValue="value" placeholder="Allow order?" class="w-full" />
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

// Form state
const form = ref({
    id: null,
    district: '',
    name: '',
    status: 1,
    title: '',
    email: '',
    mobile: '',
    salesOffice: '',
    salesDistrict: '',
    placeorder: 1
});

// Status options
const statusOptions = [
    { label: 'Active', value: 1 },
    { label: 'Inactive', value: 0 }
];

// District options
const districtOptions = [
    { label: 'Johor', value: 'Johor' },
    { label: 'Kedah', value: 'Kedah' },
    { label: 'Kelantan', value: 'Kelantan' },
    { label: 'Melaka', value: 'Melaka' },
    { label: 'Negeri Sembilan', value: 'Negeri Sembilan' },
    { label: 'Pahang', value: 'Pahang' },
    { label: 'Perak', value: 'Perak' },
    { label: 'Perlis', value: 'Perlis' },
    { label: 'Pulau Pinang', value: 'Pulau Pinang' },
    { label: 'Sabah', value: 'Sabah' },
    { label: 'Sarawak', value: 'Sarawak' },
    { label: 'Selangor', value: 'Selangor' },
    { label: 'Terengganu', value: 'Terengganu' },
    { label: 'Wilayah Persekutuan Kuala Lumpur', value: 'Wilayah Persekutuan Kuala Lumpur' },
    { label: 'Wilayah Persekutuan Labuan', value: 'Wilayah Persekutuan Labuan' },
    { label: 'Wilayah Persekutuan Putrajaya', value: 'Wilayah Persekutuan Putrajaya' }
];

// Place order options
const placeOrderOptions = [
    { label: 'Allowed', value: 1 },
    { label: 'Not Allowed', value: 0 }
];

// Cancel button
const cancel = () => {
    router.push('/sales/userList'); // adjust route to your sales user list page
};
</script>
