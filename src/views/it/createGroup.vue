<template>
    <Fluid>
        <div class="flex flex-col md:flex-row gap-8">
            <div class="card flex flex-col gap-6 w-full">
                <div class="text-2xl font-bold text-gray-800 border-b pb-2">Create Group</div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div class="md:col-span-1">
                        <label class="block font-bold text-gray-700 mb-2">Name</label>
                        <InputText v-model="form.name" placeholder="Enter group name" class="w-full" />
                    </div>

                    <div class="md:col-span-1">
                        <label class="block font-bold text-gray-700 mb-2">Status</label>
                        <Select v-model="form.status" :options="statusOptions" optionLabel="label" optionValue="value" placeholder="Select status" class="w-full" />
                    </div>

                    <div class="md:col-span-2">
                        <label class="block font-bold text-gray-700 mb-2">Description</label>
                        <Textarea v-model="form.description" rows="3" placeholder="Enter description" class="w-full" />
                    </div>

                    <div class="md:col-span-2">
                        <div class="flex items-center gap-2">
                            <Checkbox v-model="form.is_super_admin" :binary="true" inputId="super_admin" />
                            <label for="super_admin" class="font-bold text-gray-700 cursor-pointer">Super Administrator</label>
                        </div>
                    </div>

                    <div class="md:col-span-2">
                        <div class="flex items-center gap-2">
                            <Checkbox v-model="form.is_sales_person" :binary="true" inputId="sales_person" />
                            <label for="sales_person" class="font-bold text-gray-700 cursor-pointer">Sales Person</label>
                        </div>
                    </div>
                </div>

                <div class="flex justify-end mt-8 gap-2">
                    <div class="w-32">
                        <Button label="Cancel" class="w-full p-button-secondary" @click="cancel" />
                    </div>
                    <div class="w-32">
                        <Button label="Create" class="w-full p-button" @click="submitForm" :loading="submitting" />
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
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import Select from 'primevue/select';
import Button from 'primevue/button';
import Checkbox from 'primevue/checkbox';
import api from '@/service/api';

const router = useRouter();
const toast = useToast();

const form = ref({
    name: '',
    description: '',
    status: 1,
    is_super_admin: 0,
    is_sales_person: 0
});

const submitting = ref(false);

const statusOptions = [
    { label: 'Active', value: 1 },
    { label: 'Suspend', value: 0 }
];

const cancel = () => router.push('/it/ListGroup');

const validateForm = () => {
    const errors = [];
    if (!form.value.name) errors.push('Group name is required');
    if (!form.value.description) errors.push('Description is required');
    return errors;
};

const submitForm = async () => {
    submitting.value = true;

    try {
        const validationErrors = validateForm();
        if (validationErrors.length > 0) {
            toast.add({
                severity: 'error',
                summary: 'Validation Error',
                detail: validationErrors.join('; '),
                life: 5000
            });
            return;
        }

        const payload = {
            name: form.value.name,
            description: form.value.description,
            status: form.value.status,
            is_super_admin: form.value.is_super_admin ? 1 : 0,
            is_sales_person: form.value.is_sales_person ? 1 : 0,
            permissions: [] 
        };

        const response = await api.post('admin/create-user-role', payload);

        if (response.data.status === 1) {
            toast.add({
                severity: 'success',
                summary: 'Success',
                detail: `Group "${form.value.name}" created successfully!`,
                life: 5000
            });

            setTimeout(() => {
                router.push('/it/ListGroup');
            }, 1500);
        } else {
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: response.data.message || 'Failed to create group',
                life: 4000
            });
        }
    } catch (err) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Something went wrong while creating the group',
            life: 5000
        });
    } finally {
        submitting.value = false;
    }
};
</script>


<style scoped>
.card {
    background: white;
    border-radius: 8px;
    padding: 24px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

:deep(.p-radiobutton .p-radiobutton-box) {
    border-radius: 50%;
}

:deep(.p-radiobutton .p-radiobutton-box.p-highlight) {
    background-color: #3b82f6;
    border-color: #3b82f6;
}

:deep(.p-select) {
    width: 100%;
}
</style>