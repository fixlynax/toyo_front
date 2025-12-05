<template>
    <Fluid>
        <div class="flex flex-col md:flex-row gap-8">
            <div class="card flex flex-col gap-6 w-full">
                <!-- Header -->
                <div class="text-2xl font-bold text-gray-800 border-b pb-2">Edit User</div>

                <!-- Loading State -->
                <div v-if="loading" class="flex justify-center items-center py-12">
                    <i class="pi pi-spin pi-spinner text-4xl text-blue-500"></i>
                </div>

                <!-- Form -->
                <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <!-- Username -->
                    <div class="md:col-span-1">
                        <label class="block font-bold text-gray-700 mb-2">Username *</label>
                        <InputText v-model="form.username" placeholder="Enter username" class="w-full" />
                        <small v-if="errors.username" class="text-red-500 text-sm">{{ errors.username }}</small>
                    </div>

                    <!-- Email -->
                    <div class="md:col-span-1">
                        <label class="block font-bold text-gray-700 mb-2">Email *</label>
                        <InputText v-model="form.email" placeholder="Enter email" class="w-full" />
                        <small v-if="errors.email" class="text-red-500 text-sm">{{ errors.email }}</small>
                    </div>

                    <!-- First Name -->
                    <div class="md:col-span-1">
                        <label class="block font-bold text-gray-700 mb-2">First Name</label>
                        <InputText v-model="form.first_name" placeholder="Enter first name" class="w-full" />
                        <small v-if="errors.first_name" class="text-red-500 text-sm">{{ errors.first_name }}</small>
                    </div>

                    <!-- Last Name -->
                    <div class="md:col-span-1">
                        <label class="block font-bold text-gray-700 mb-2">Last Name</label>
                        <InputText v-model="form.last_name" placeholder="Enter last name" class="w-full" />
                        <small v-if="errors.last_name" class="text-red-500 text-sm">{{ errors.last_name }}</small>
                    </div>

                    <!-- Mobile Phone -->
                    <div class="md:col-span-1">
                        <label class="block font-bold text-gray-700 mb-2">Mobile Phone</label>
                        <InputText v-model="form.mobilephone" placeholder="Enter mobile phone" class="w-full" />
                        <small v-if="errors.mobilephone" class="text-red-500 text-sm">{{ errors.mobilephone }}</small>
                    </div>

                    <!-- User Role -->
                    <div class="md:col-span-1">
                        <label class="block font-bold text-gray-700 mb-2">User Role *</label>
                        <Select v-model="form.user_role_id" :options="userRoleOptions" optionLabel="label" optionValue="value" placeholder="Select user role" class="w-full" :loading="loadingRoles" />
                        <small v-if="errors.user_role_id" class="text-red-500 text-sm">{{ errors.user_role_id }}</small>
                    </div>

                    <!-- Sales Office -->
                    <div class="md:col-span-1">
                        <label class="block font-bold text-gray-700 mb-2">Sales Office</label>
                        <InputText v-model="form.salesOffice" placeholder="Enter sales office" class="w-full" />
                    </div>

                    <!-- Sales District -->
                    <div class="md:col-span-1">
                        <label class="block font-bold text-gray-700 mb-2">Sales District</label>
                        <InputText v-model="form.salesDistrict" placeholder="Enter sales district" class="w-full" />
                    </div>

                    <!-- Status -->
                    <div class="md:col-span-1">
                        <label class="block font-bold text-gray-700 mb-2">Status</label>
                        <Select v-model="form.status" :options="statusOptions" optionLabel="label" optionValue="value" placeholder="Select status" class="w-full" />
                    </div>
                </div>

                <!-- Action Buttons -->
                <div class="flex justify-end mt-8 gap-2">
                    <div class="w-32">
                        <Button label="Cancel" class="w-full p-button-secondary" @click="cancel" />
                    </div>
                    <div class="w-32">
                        <Button label="Update" class="w-full p-button-success" @click="submitForm" :loading="submitting" />
                    </div>
                </div>
            </div>
        </div>
    </Fluid>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import InputText from 'primevue/inputtext';
import Select from 'primevue/select';
import Button from 'primevue/button';
import api from '@/service/api';

const route = useRoute();
const router = useRouter();
const toast = useToast();

const form = ref({
    user_id: null,
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    mobilephone: '',
    user_role_id: null,
    salesOffice: '',
    salesDistrict: '',
    status: 1
});

const errors = reactive({});
const loading = ref(true);
const submitting = ref(false);
const loadingRoles = ref(false);

const statusOptions = [
    { label: 'Active', value: 1 },
    { label: 'Inactive', value: 0 }
];

const userRoleOptions = ref([]);

// Fetch user roles from API
const fetchUserRoles = async () => {
    try {
        loadingRoles.value = true;
        const response = await api.get('admin/list-user-role');

        if (response.data.status === 1) {
            userRoleOptions.value = response.data.data.map((role) => ({
                label: `${role.name}${role.is_super_admin ? ' (Super Admin)' : '' || role.is_sales_person ? ' (Sales Person)' : ''}`,
                value: role.id,
                is_super_admin: role.is_super_admin,
                is_sales_person: role.is_sales_person
            }));
        } else {
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to load user roles',
                life: 4000
            });
        }
    } catch (error) {
        console.error('Error fetching user roles:', error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load user roles',
            life: 4000
        });
    } finally {
        loadingRoles.value = false;
    }
};

// Fetch user data by ID
const fetchUserData = async () => {
    try {
        loading.value = true;
        const userId = route.params.id;

        if (!userId) {
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: 'User ID is required',
                life: 4000
            });
            router.push('/it/listUserAccount');
            return;
        }

        // First, get all users to find the specific user
        const response = await api.get('admin/list-user');

        if (response.data.status === 1) {
            const user = response.data.data.find((u) => u.id.toString() === userId.toString());

            if (user) {
                form.value = {
                    user_id: user.id,
                    username: user.username || '',
                    email: user.email || '',
                    first_name: user.first_name || '',
                    last_name: user.last_name || '',
                    mobilephone: user.mobilephone || '',
                    user_role_id: user.role?.id || null,
                    salesOffice: user.salesOffice || '',
                    salesDistrict: user.salesDistrict || '',
                    status: user.status || 1
                };
            } else {
                toast.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'User not found',
                    life: 4000
                });
                router.push('/it/listUserAccount');
            }
        } else {
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to load user data',
                life: 4000
            });
        }
    } catch (error) {
        console.error('Error fetching user data:', error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load user data',
            life: 4000
        });
        router.push('/it/listUserAccount');
    } finally {
        loading.value = false;
    }
};

// Validation function
const validateForm = () => {
    // Clear previous errors
    Object.keys(errors).forEach((key) => delete errors[key]);

    let isValid = true;

    // Username validation
    if (!form.value.username.trim()) {
        errors.username = 'Username is required';
        isValid = false;
    } else if (form.value.username.length > 100) {
        errors.username = 'Username must not exceed 100 characters';
        isValid = false;
    }

    // Email validation
    if (!form.value.email.trim()) {
        errors.email = 'Email is required';
        isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) {
        errors.email = 'Please enter a valid email address';
        isValid = false;
    } else if (form.value.email.length > 255) {
        errors.email = 'Email must not exceed 255 characters';
        isValid = false;
    }

    // User role validation
    if (!form.value.user_role_id) {
        errors.user_role_id = 'User role is required';
        isValid = false;
    }

    // First name validation (if provided)
    if (form.value.first_name && form.value.first_name.length > 100) {
        errors.first_name = 'First name must not exceed 100 characters';
        isValid = false;
    }

    // Last name validation (if provided)
    if (form.value.last_name && form.value.last_name.length > 100) {
        errors.last_name = 'Last name must not exceed 100 characters';
        isValid = false;
    }

    // Mobile phone validation (if provided)
    if (form.value.mobilephone && form.value.mobilephone.length > 30) {
        errors.mobilephone = 'Mobile phone must not exceed 30 characters';
        isValid = false;
    }

    return isValid;
};

// Submit form
const submitForm = async () => {
    if (!validateForm()) {
        return;
    }

    submitting.value = true;

    try {
        const payload = {
            user_id: form.value.user_id,
            username: form.value.username,
            email: form.value.email,
            first_name: form.value.first_name || null,
            last_name: form.value.last_name || null,
            mobilephone: form.value.mobilephone || null,
            user_role_id: form.value.user_role_id,
            salesOffice: form.value.salesOffice || null,
            salesDistrict: form.value.salesDistrict || null,
            status: form.value.status
        };

        console.log('Updating user with payload:', JSON.stringify(payload, null, 2));

        // Call the update API endpoint
        const response = await api.post('admin/update-user', payload);

        if (response.data.status === 1) {
            toast.add({
                severity: 'success',
                summary: 'Success',
                detail: response.data.message || `User "${form.value.username}" updated successfully!`,
                life: 5000
            });

            // Redirect to user list
            setTimeout(() => {
                router.push('/it/listUserAccount');
            }, 1500);
        } else {
            // Handle API errors
            const errorDetail = response.data.error?.message || response.data.message || 'Failed to update user';
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: errorDetail,
                life: 5000
            });

            // Handle validation errors from API
            if (response.data.validation_errors) {
                Object.entries(response.data.validation_errors).forEach(([field, messages]) => {
                    errors[field] = Array.isArray(messages) ? messages.join(', ') : messages;
                });
            }
        }
    } catch (err) {
        console.error('Error updating user:', err);

        let errorMessage = 'Something went wrong while updating the user';

        if (err.response?.data) {
            if (err.response.data.validation_errors) {
                Object.entries(err.response.data.validation_errors).forEach(([field, messages]) => {
                    errors[field] = Array.isArray(messages) ? messages.join(', ') : messages;
                });
                errorMessage = 'Please check the form for errors';
            } else if (err.response.data.message) {
                errorMessage = err.response.data.message;
            } else if (err.response.data.error?.message) {
                errorMessage = err.response.data.error.message;
            }
        } else if (err.code === 'NETWORK_ERROR') {
            errorMessage = 'Please check your internet connection';
        }

        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: errorMessage,
            life: 5000
        });
    } finally {
        submitting.value = false;
    }
};

const cancel = () => router.push('/it/listUserAccount');

onMounted(async () => {
    await Promise.all([fetchUserRoles(), fetchUserData()]);
});
</script>

<style scoped>
.card {
    background: white;
    border-radius: 8px;
    padding: 24px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

:deep(.p-select) {
    width: 100%;
}

:deep(.p-password) {
    width: 100%;
}

:deep(.p-password input) {
    width: 100%;
}
</style>
