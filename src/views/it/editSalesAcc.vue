<template>
    <Fluid>
        <div class="flex flex-col md:flex-row gap-8">
            <div class="card flex flex-col gap-6 w-full">
                <!-- Header -->
                <div class="text-2xl font-bold text-gray-800 border-b pb-2">Edit User</div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <!-- User Group -->
                    <div>
                        <label class="block text-sm font-bold text-gray-700 mb-2">User Group</label>
                        <Dropdown v-model="form.usergroup" :options="userGroupOptions" optionLabel="label" optionValue="value" placeholder="Select User Group" class="w-full" />
                    </div>

                    <!-- Username -->
                    <div>
                        <label class="block text-sm font-bold text-gray-700 mb-2">Username</label>
                        <InputText v-model="form.username" placeholder="Enter username" class="w-full" />
                    </div>

                    <!-- Department -->
                    <div>
                        <label class="block text-sm font-bold text-gray-700 mb-2">Department</label>
                        <InputText v-model="form.department" placeholder="Enter department" class="w-full" />
                    </div>

                    <!-- Mobile No -->
                    <div>
                        <label class="block text-sm font-bold text-gray-700 mb-2">Mobile No</label>
                        <InputText v-model="form.mobileno" placeholder="e.g. 01123456789" class="w-full" />
                    </div>

                    <!-- Email -->
                    <div class="md:col-span-2">
                        <label class="block text-sm font-bold text-gray-700 mb-2">Email</label>
                        <InputText v-model="form.email" placeholder="Enter email" class="w-full" />
                    </div>

                    <!-- Status -->
                    <div class="md:col-span-2">
                        <label class="block text-sm font-bold text-gray-700 mb-2">Status</label>
                        <Dropdown v-model="form.statusUser" :options="statusOptions" optionLabel="label" optionValue="value" placeholder="Select status" class="w-full" />
                    </div>
                </div>

                <!-- Action Buttons -->
                <div class="flex justify-end mt-8 gap-4">
                    <div class="w-32">
                        <Button label="Cancel" class="w-full p-button-secondary" @click="cancel" />
                    </div>
                    <div class="w-32">
                        <Button label="Save" class="w-full p-button-success" @click="submitForm" />
                    </div>
                </div>
            </div>
        </div>
    </Fluid>
</template>

<script setup>
import { ref, onBeforeMount } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const loading = ref(true);
const form = ref({
    usergroup: '',
    username: '',
    department: '',
    mobileno: '',
    email: '',
    statusUser: 1
});

// User group options
const userGroupOptions = [
    { label: 'Technical Consultant', value: 'Technical Consultant' },
    { label: 'Human Resources', value: 'Human Resources' },
    { label: 'Information Technology', value: 'Information Technology' }
    // ...more
];

// Status options
const statusOptions = [
    { label: 'Active', value: 1 },
    { label: 'Suspend', value: 0 }
];

// load dummy user by id
onBeforeMount(async () => {
    const id = route.params.id; // e.g. 1
    form.value = {
        id,
        usergroup: 'Information Technology',
        username: 'John Doe',
        department: 'IT',
        mobileno: '555-1234',
        email: 'john.doe@example.com',
        statusUser: 1
    };
    loading.value = false;
});

// Cancel button
const cancel = () => {
    router.push('/it/listSalesAccount'); // adjust route to your list page
};

// Save form
const submitForm = () => {
    console.log('✅ User Updated:', form.value);
    // TODO: call API to update user
    router.push('/it/listSalesAccount');
};
</script>
