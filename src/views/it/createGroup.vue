<template>
    <Fluid>
        <div class="flex flex-col md:flex-row gap-8">
            <div class="card flex flex-col gap-6 w-full">
                <!-- Header -->
                <div class="text-2xl font-bold text-gray-800 border-b pb-2">Create User Group</div>

                <!-- User Group Form -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <!-- User Group Name -->
                    <div class="md:col-span-2">
                        <label class="block text-sm font-bold text-gray-700 mb-2">User Group Name</label>
                        <InputText v-model="form.usergroup" placeholder="Enter group name" class="w-full" />
                    </div>

                    <!-- Module / Function Selection -->
                    <div class="md:col-span-2">
                        <label class="block text-sm font-bold text-gray-700 mb-2">Module / Function List</label>
                        <div class="grid grid-cols-2 gap-2">
                            <div 
                                v-for="module in moduleOptions" 
                                :key="module.value" 
                                class="flex items-center gap-2"
                            >
                                <Checkbox 
                                    v-model="form.modules" 
                                    :inputId="module.value" 
                                    :value="module.value" 
                                />
                                <label :for="module.value">{{ module.label }}</label>
                            </div>
                        </div>
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

// Form state
const form = ref({
    usergroup: '',
    modules: [],
    statusUser: 1
});

// Module options (checkbox list)
const moduleOptions = [
    { label: 'Marketing', value: 'Marketing' },
    { label: 'Technical', value: 'Technical' },
    { label: 'OM', value: 'OM' },
    { label: 'SCM', value: 'SCM' },
    { label: 'IT', value: 'IT' },
    { label: 'Sale', value: 'Sale' }
];

// Status options
const statusOptions = [
    { label: 'Active', value: 1 },
    { label: 'Suspend', value: 0 }
];

// Cancel action
const cancel = () => {
    router.push('/marketing/listGroup');
};

// Save action
const submitForm = () => {
    if (!form.value.usergroup) {
        alert('User Group Name is required');
        return;
    }
    console.log('✅ New User Group Created:', form.value);
    // TODO: Replace with API call
    router.push('/marketing/listGroup');
};
</script>
