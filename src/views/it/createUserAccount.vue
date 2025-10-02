<template>
    <Fluid>
        <div class="flex flex-col md:flex-row gap-8">
            <div class="card flex flex-col gap-6 w-full">
                <!-- Header -->
                <div class="text-2xl font-bold text-gray-800 border-b pb-2">Create User</div>

                <!-- User Form -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <!-- User Group -->
                    <div>
                        <label class="block text-sm font-bold text-gray-700 mb-2">User Group</label>
                        <Dropdown 
                            v-model="form.usergroup" 
                            :options="userGroupOptions" 
                            optionLabel="label" 
                            optionValue="value" 
                            placeholder="Select User Group" 
                            class="w-full" 
                        />
                    </div>

                    <!-- Username -->
                    <div>
                        <label class="block text-sm font-bold text-gray-700 mb-2">Username</label>
                        <InputText 
                            v-model="form.username" 
                            placeholder="Enter username" 
                            class="w-full" 
                        />
                    </div>

                    <!-- Department -->
                    <div>
                        <label class="block text-sm font-bold text-gray-700 mb-2">Department</label>
                        <InputText 
                            v-model="form.department" 
                            placeholder="Enter department" 
                            class="w-full" 
                        />
                    </div>

                    <!-- Mobile No -->
                    <div>
                        <label class="block text-sm font-bold text-gray-700 mb-2">Mobile No</label>
                        <InputText 
                            v-model="form.mobileno" 
                            placeholder="e.g. 01123456789" 
                            class="w-full" 
                            @input="form.mobileno = form.mobileno.replace(/[^0-9]/g, '')" 
                        />
                    </div>

                    <!-- Email -->
                    <div class="md:col-span-2">
                        <label class="block text-sm font-bold text-gray-700 mb-2">Email</label>
                        <InputText 
                            v-model="form.email" 
                            placeholder="Enter email" 
                            class="w-full" 
                        />
                    </div>

                    <!-- Status -->
                    <div class="md:col-span-2">
                        <label class="block text-sm font-bold text-gray-700 mb-2">Status</label>
                        <Dropdown 
                            v-model="form.statusUser" 
                            :options="statusOptions" 
                            optionLabel="label" 
                            optionValue="value" 
                            placeholder="Select status" 
                            class="w-full" 
                        />
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

// Form state (matches your data model)
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
    { label: 'Information Technology', value: 'Information Technology' },
    { label: 'Finance', value: 'Finance' },
    { label: 'Marketing', value: 'Marketing' },
    { label: 'Sales', value: 'Sales' },
    { label: 'Operations', value: 'Operations' },
    { label: 'Engineering', value: 'Engineering' },
    { label: 'Quality Assurance', value: 'Quality Assurance' },
    { label: 'Administration', value: 'Administration' }
];

// Status options
const statusOptions = [
    { label: 'Active', value: 1 },
    { label: 'Suspend', value: 0 }
];

// Cancel button
const cancel = () => {
    router.push('/marketing/userList'); // adjust route
};

// Submit form
const submitForm = () => {
    if (!form.value.username || !form.value.email || !form.value.usergroup) {
        alert('⚠️ Username, Email, and User Group are required');
        return;
    }

    console.log('✅ New User Created:', form.value);
    // TODO: replace with API call to save user
    router.push('/it/listUserAccount');
};
</script>
