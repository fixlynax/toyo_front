<template>
    <Fluid>
        <div class="flex flex-col md:flex-row gap-8">
            <div class="card flex flex-col gap-6 w-full">
                <!-- Header -->
                <div class="text-2xl font-bold text-gray-800 border-b pb-2">Edit Group</div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <!-- User Group -->
                    <div class="md:col-span-2">
                        <label class="block text-sm font-bold text-gray-700 mb-2">User Group Name</label>
                        <InputText placeholder="Enter group name" class="w-full" />
                    </div>

                    <!-- Module / Function Selection -->
                    <div class="md:col-span-2">
                        <label class="block text-sm font-bold text-gray-700 mb-2">Module / Function List</label>
                        <MultiSelect v-model="form.modules" :options="moduleOptions" optionLabel="label" optionValue="value" placeholder="Select modules" display="chip" class="w-full" />
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
import { onBeforeMount, ref } from 'vue';
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
// Module options (checkbox list)
const moduleOptions = [
    { label: 'Marketing', value: 'Marketing' },
    { label: 'Technical', value: 'Technical' },
    { label: 'OM', value: 'OM' },
    { label: 'SCM', value: 'SCM' },
    { label: 'IT', value: 'IT' },
    { label: 'Sales', value: 'Sales' }
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
    router.push('/it/listGroup'); // adjust route to your list page
};

// Save form
const submitForm = () => {
    console.log('✅ User Updated:', form.value);
    // TODO: call API to update user
    router.push('/it/listGroup');
};
</script>
