<template>
    <Fluid>
        <div class="flex flex-col md:flex-row gap-8">
            <div class="card flex flex-col gap-6 w-full">
                <!-- Header -->
                <div class="text-2xl font-bold text-gray-800 border-b pb-2">Create User</div>

                <!-- Form -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <!-- User Group Name -->
                    <div class="md:col-span-2">
                        <label class="block font-bold text-gray-700 mb-2">User Group Name</label>
                        <InputText v-model="form.usergroup" placeholder="Enter group name" class="w-full" />
                    </div>

                    <!-- Description -->
                    <div class="md:col-span-2">
                        <label class="block font-bold text-gray-700 mb-2">Description</label>
                        <Textarea v-model="form.description" rows="3" placeholder="Enter description" class="w-full" />
                    </div>

                    <!-- Module / Function Selection -->
                    <div>
                        <label class="block font-bold text-gray-700 mb-2">Module / Function List</label>
                        <MultiSelect v-model="form.modules" :options="moduleOptions" optionLabel="label" filter placeholder="Select modules" display="chip" class="w-full" />
                    </div>

                    <!-- Status -->
                    <div>
                        <label class="block font-bold text-gray-700 mb-2">Status</label>
                        <Dropdown v-model="form.statusUser" :options="statusOptions" optionLabel="label" optionValue="value" placeholder="Select status" class="w-full" />
                    </div>
                </div>

                <!-- Action Buttons -->
                <div class="flex justify-end mt-8 gap-2">
                    <div class="w-32">
                        <Button label="Cancel" class="w-full p-button-secondary" @click="cancel" />
                    </div>
                    <div class="w-32">
                        <Button label="Create" class="w-full p-button" @click="submitForm" />
                    </div>
                </div>
            </div>
        </div>
    </Fluid>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/service/api';
import { useToast } from 'primevue/usetoast';

const router = useRouter();
const toast = useToast();

// Form state
const form = ref({
    usergroup: '',
    description: '',
    modules: [],
    statusUser: 1,
    is_super_admin: 0
});

// Module options
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

// Super Admin options
const superAdminOptions = [
    { label: 'Yes', value: 1 },
    { label: 'No', value: 0 }
];

// Watch modules selection
watch(
    () => form.value.modules,
    (newVal) => {
        // If all modules are selected, automatically set super admin
        if (newVal.length === moduleOptions.length) {
            form.value.is_super_admin = 1;
        } else {
            form.value.is_super_admin = 0;
        }
    },
    { deep: true }
);

// Cancel action
const cancel = () => {
    router.push('/it/listUserAccount');
};

// Submit form
const submitForm = async () => {
    if (!form.value.usergroup) {
        toast.add({
            severity: 'warn',
            summary: 'Validation Error',
            detail: 'User Group Name is required.',
            life: 3000
        });
        return;
    }

    if (!form.value.modules.length) {
        toast.add({
            severity: 'warn',
            summary: 'Validation Error',
            detail: 'Please select at least one module.',
            life: 3000
        });
        return;
    }

    try {
        const payload = {
            name: form.value.usergroup,
            description: form.value.description,
            status: form.value.statusUser,
            functions: form.value.modules,
            is_super_admin: form.value.is_super_admin
        };

        const response = await api.post('admin/create-user-role', payload);

        if (response.data.status === 1) {
            toast.add({
                severity: 'success',
                summary: 'Success',
                detail: 'User group created successfully.',
                life: 3000
            });
            router.push('/it/listUserAccount');
        } else {
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: response.data.error?.messageEnglish || 'Failed to create user group',
                life: 4000
            });
        }
    } catch (err) {
        console.error(err);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: err.response?.data?.error?.messageEnglish || 'Something went wrong',
            life: 4000
        });
    }
};
</script>
