<template>
    <Fluid>
        <div class="flex flex-col md:flex-row gap-8">
            <div class="card flex flex-col gap-6 w-full">
                <!-- Header -->
                <div class="text-2xl font-bold text-gray-800 border-b pb-2">Create User Group</div>

                <!-- Form -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <!-- Group Name -->
                    <div class="md:col-span-2">
                        <label class="block text-sm font-bold text-gray-700 mb-2">User Group Name</label>
                        <InputText v-model="form.usergroup" placeholder="Enter group name" class="w-full" />
                    </div>

                    <!-- Module / Function -->
                    <div class="md:col-span-2">
                        <label class="block text-sm font-bold text-gray-700 mb-2">Module / Function List</label>
                        <MultiSelect v-model="form.modules" :options="moduleOptions" optionLabel="label" filter placeholder="Select modules" display="chip" class="w-full" />
                    </div>

                    <!-- Status -->
                    <div class="md:col-span-2">
                        <label class="block text-sm font-bold text-gray-700 mb-2">Status</label>
                        <Dropdown v-model="form.statusUser" :options="statusOptions" optionLabel="label" optionValue="value" placeholder="Select status" class="w-full" />
                    </div>
                </div>

                <!-- Buttons -->
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
import { useToast } from 'primevue/usetoast';
import api from '@/service/api';

const router = useRouter();
const toast = useToast();

const form = ref({
    usergroup: '',
    modules: [],
    statusUser: 1
});

const moduleOptions = [
    { label: 'Marketing', value: 'Marketing' },
    { label: 'Technical', value: 'Technical' },
    { label: 'OM', value: 'OM' },
    { label: 'SCM', value: 'SCM' },
    { label: 'IT', value: 'IT' },
    { label: 'Sales', value: 'Sales' }
];

const statusOptions = [
    { label: 'Active', value: 1 },
    { label: 'Suspend', value: 0 }
];

const cancel = () => {
    router.push('/it/listGroup');
};

const submitForm = async () => {
    if (!form.value.usergroup || form.value.modules.length === 0) {
        toast.add({
            severity: 'warn',
            summary: 'Missing Fields',
            detail: 'Please fill in all required fields',
            life: 3000
        });
        return;
    }

    try {
        const response = await api.post('admin/create-user-role', {
            name: form.value.usergroup,
            status: form.value.statusUser,
            functions: form.value.modules // adjust according to API: array of module names or IDs
        });

        if (response.data.status === 1) {
            toast.add({
                severity: 'success',
                summary: 'Success',
                detail: 'User group created successfully',
                life: 3000
            });
            router.push('/it/listGroup');
        } else {
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: response.data.error?.message || 'Failed to create user group',
                life: 3000
            });
        }
    } catch (err) {
        console.error(err);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Something went wrong',
            life: 3000
        });
    }
};
</script>
