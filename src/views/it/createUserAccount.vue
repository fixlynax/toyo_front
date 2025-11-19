<template>
  <Fluid>
    <div class="flex flex-col md:flex-row gap-8">
      <div class="card flex flex-col gap-6 w-full">
        <!-- Header -->
        <div class="text-2xl font-bold text-gray-800 border-b pb-2">Create User</div>

        <!-- Form -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Username -->
          <div class="md:col-span-1">
            <label class="block font-bold text-gray-700 mb-2">User Name</label>
            <InputText v-model="form.username" placeholder="Enter username" class="w-full" />
          </div>

          <!-- Email -->
          <div class="md:col-span-1">
            <label class="block font-bold text-gray-700 mb-2">Email</label>
            <InputText v-model="form.email" placeholder="Enter email" class="w-full" />
          </div>

          <!-- First Name -->
          <div class="md:col-span-1">
            <label class="block font-bold text-gray-700 mb-2">First Name</label>
            <InputText v-model="form.first_name" placeholder="Enter first name" class="w-full" />
          </div>

          <!-- Last Name -->
          <div class="md:col-span-1">
            <label class="block font-bold text-gray-700 mb-2">Last Name</label>
            <InputText v-model="form.last_name" placeholder="Enter last name" class="w-full" />
          </div>

          <!-- Mobile Phone -->
          <div class="md:col-span-1">
            <label class="block font-bold text-gray-700 mb-2">Mobile Phone</label>
            <InputText v-model="form.mobilephone" placeholder="Enter mobile phone" class="w-full" />
          </div>

          <!-- Status -->
          <div class="md:col-span-1">
            <label class="block font-bold text-gray-700 mb-2">Status</label>
            <Dropdown
              v-model="form.status"
              :options="statusOptions"
              optionLabel="label"
              optionValue="value"
              placeholder="Select status"
              class="w-full"
            />
          </div>

          <!-- Description / Role -->
          <div class="md:col-span-2">
            <label class="block font-bold text-gray-700 mb-2">Description / Role</label>
            <Textarea
              v-model="form.role_description"
              rows="3"
              placeholder="Enter description"
              class="w-full"
            />
          </div>

          <!-- Permissions -->
          <div class="md:col-span-2">
            <label class="block font-bold text-gray-700 mb-2">Permissions</label>
            <MultiSelect
              v-model="form.permissions"
              :options="permissionOptions"
              optionLabel="function_name"
              display="chip"
              placeholder="Select permissions"
              class="w-full"
            />
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
  username: '',
  email: '',
  first_name: '',
  last_name: '',
  mobilephone: '',
  role_description: '',
  permissions: [],
  status: 1,
  is_super_admin: 0
});

const statusOptions = [
  { label: 'Active', value: 1 },
  { label: 'Suspend', value: 0 }
];

// Example permission list (replace or fetch from API if needed)
const permissionOptions = [
  { function_id: 1, function_name: 'Events Management' },
  { function_id: 2, function_name: 'News Management' },
  { function_id: 3, function_name: 'Campaign Management' },
  { function_id: 4, function_name: 'Game Management' },
  { function_id: 5, function_name: 'Content Management' }
];

// Automatically set Super Admin if all permissions are selected
watch(
  () => form.value.permissions,
  (newPermissions) => {
    form.value.is_super_admin =
      newPermissions.length === permissionOptions.length ? 1 : 0;
  },
  { deep: true }
);

// Cancel
const cancel = () => router.push('/it/listUserAccount');

// Submit
const submitForm = async () => {
  try {
    const payload = {
      username: form.value.username,
      email: form.value.email,
      first_name: form.value.first_name,
      last_name: form.value.last_name,
      mobilephone: form.value.mobilephone,
      role_description: form.value.role_description,
      permissions: form.value.permissions.map((p) => p.function_id),
      status: form.value.status,
      is_super_admin: form.value.is_super_admin
    };

    const response = await api.post('admin/create-user', payload);

    if (response.data.status === 1) {
      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: response.data.message,
        life: 3000
      });
      router.push('/it/listUserAccount');
    } else {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: response.data.message || 'Failed',
        life: 4000
      });
    }
  } catch (err) {
    console.error(err);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: err.response?.data?.message || 'Something went wrong',
      life: 4000
    });
  }
};
</script>
