<template>
    <Fluid>
        <div class="flex flex-col md:flex-row gap-8">
            <div class="card flex flex-col gap-6 w-full">
                <!-- Header -->
                <div class="text-2xl font-bold text-gray-800 border-b pb-2">Create User</div>

                <!-- Form -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <!-- Username -->
                    <div class="md:col-span-1">
                        <label class="block font-bold text-gray-700 mb-2">Username<span style="color:red"> *</span></label>
                        <InputText v-model="form.username" placeholder="Enter username" class="w-full" />
                        <small v-if="errors.username" class="text-red-500 text-sm">{{ errors.username }}</small>
                    </div>

                    <!-- Email -->
                    <div class="md:col-span-1">
                        <label class="block font-bold text-gray-700 mb-2">Email<span style="color:red"> *</span></label>
                        <InputText v-model="form.email" placeholder="Enter email" class="w-full" />
                        <small v-if="errors.email" class="text-red-500 text-sm">{{ errors.email }}</small>
                    </div>

                    <!-- First Name -->
                    <div class="md:col-span-1">
                        <label class="block font-bold text-gray-700 mb-2">First Name<span style="color:red"> *</span></label>
                        <InputText v-model="form.first_name" placeholder="Enter first name" class="w-full" />
                        <small v-if="errors.first_name" class="text-red-500 text-sm">{{ errors.first_name }}</small>
                    </div>

                    <!-- Last Name -->
                    <div class="md:col-span-1">
                        <label class="block font-bold text-gray-700 mb-2">Last Name<span style="color:red"> *</span></label>
                        <InputText v-model="form.last_name" placeholder="Enter last name" class="w-full" />
                        <small v-if="errors.last_name" class="text-red-500 text-sm">{{ errors.last_name }}</small>
                    </div>

                    <!-- Mobile Phone -->
                    <div class="md:col-span-1">
                        <label class="block font-bold text-gray-700 mb-2">Mobile Phone<span style="color:red"> *</span></label>
                        <InputText v-model="form.mobilephone" placeholder="Enter mobile phone" class="w-full" />
                        <small v-if="errors.mobilephone" class="text-red-500 text-sm">{{ errors.mobilephone }}</small>
                    </div>

                    <!-- User Role -->
                    <div class="md:col-span-1">
                        <label class="block font-bold text-gray-700 mb-2">User Role<span style="color:red"> *</span></label>
                        <Select v-model="form.user_role_id" :options="userRoleOptions" optionLabel="label" optionValue="value" placeholder="Select user role" class="w-full" :loading="loadingRoles" />
                        <small v-if="errors.user_role_id" class="text-red-500 text-sm">{{ errors.user_role_id }}</small>
                    </div>

                    <!-- Sales Office -->
                    <div class="md:col-span-1">
                        <label class="block font-bold text-gray-700 mb-2">Sales Office<span style="color:red"> *</span></label>
                        <MultiSelect v-model="form.salesOffice" :options="salesOfficeOptions" placeholder="Select sales office(s)" class="w-full" />
                        <small v-if="errors.salesOffice" class="text-red-500 text-sm">{{ errors.salesOffice }}</small>
                    </div>

                    <!-- Sales District -->
                    <div class="md:col-span-1">
                        <label class="block font-bold text-gray-700 mb-2">Sales District<span style="color:red"> *</span></label>
                        <MultiSelect v-model="form.salesDistrict" :options="salesDistrictOptions" placeholder="Select sales district(s)" class="w-full" />
                        <small v-if="errors.salesDistrict" class="text-red-500 text-sm">{{ errors.salesDistrict }}</small>
                    </div>

                    <!-- Department -->
                    <div class="md:col-span-1">
                        <label class="block font-bold text-gray-700 mb-2">Department<span style="color:red"> *</span></label>
                        <InputText v-model="form.department" placeholder="Enter department" class="w-full" />
                        <small v-if="errors.department" class="text-red-500 text-sm">{{ errors.department }}</small>
                    </div>

                    <!-- Storage Location -->
                    <div class="md:col-span-1">
                        <label class="block font-bold text-gray-700 mb-2">Storage Location<span style="color:red"> *</span></label>
                        <MultiSelect v-model="form.storageLocation" :options="storageLocationOptions" placeholder="Select storage location(s)" class="w-full" />
                        <small v-if="errors.storageLocation" class="text-red-500 text-sm">{{ errors.storageLocation }}</small>
                    </div>

                    <!-- Status -->
                    <div class="md:col-span-1">
                        <label class="block font-bold text-gray-700 mb-2">Status </label>
                        <Select v-model="form.status" :options="statusOptions" optionLabel="label" optionValue="value" placeholder="Select status" class="w-full" />
                        <small v-if="errors.status" class="text-red-500 text-sm">{{ errors.status }}</small>
                    </div>
                </div>

                <!-- Action Buttons -->
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
import { ref, reactive, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import InputText from 'primevue/inputtext';
import Select from 'primevue/select';
import MultiSelect from 'primevue/multiselect';
import Button from 'primevue/button';
import api from '@/service/api';

const router = useRouter();
const toast = useToast();

const form = ref({
    username: '',
    email: '',
    department: '',
    storageLocation: [],
    first_name: '',
    last_name: '',
    mobilephone: '',
    user_role_id: null,
    salesOffice: [],
    salesDistrict: [],
    status: 1
});

const errors = reactive({});

const statusOptions = [
    { label: 'Active', value: 1 },
    { label: 'Inactive', value: 0 }
];

// Hardcoded sales office options
const salesOfficeOptions = ref([
    { label: 'New York Office', value: 'new_york' },
    { label: 'Los Angeles Office', value: 'los_angeles' },
    { label: 'Chicago Office', value: 'chicago' },
    { label: 'Houston Office', value: 'houston' },
    { label: 'Miami Office', value: 'miami' },
    { label: 'San Francisco Office', value: 'san_francisco' },
    { label: 'Seattle Office', value: 'seattle' },
    { label: 'Boston Office', value: 'boston' }
]);

// Hardcoded sales district options
const salesDistrictOptions = ref([
    { label: 'Northeast District', value: 'northeast' },
    { label: 'Southeast District', value: 'southeast' },
    { label: 'Midwest District', value: 'midwest' },
    { label: 'Southwest District', value: 'southwest' },
    { label: 'West Coast District', value: 'west_coast' },
    { label: 'Northwest District', value: 'northwest' },
    { label: 'Central District', value: 'central' },
    { label: 'Mountain District', value: 'mountain' }
]);

// Hardcoded storage location options
const storageLocationOptions = ref([
    { label: 'Main Warehouse', value: 'main_warehouse' },
    { label: 'Cold Storage', value: 'cold_storage' },
    { label: 'Dry Storage', value: 'dry_storage' },
    { label: 'High-Value Vault', value: 'high_value_vault' },
    { label: 'Bulk Storage Area', value: 'bulk_storage' },
    { label: 'Returns Section', value: 'returns_section' },
    { label: 'Picking Zone A', value: 'picking_zone_a' },
    { label: 'Picking Zone B', value: 'picking_zone_b' },
    { label: 'Shipping Dock Storage', value: 'shipping_dock' },
    { label: 'Receiving Area Storage', value: 'receiving_area' },
    { label: 'Overflow Storage', value: 'overflow_storage' },
    { label: 'Archives Room', value: 'archives_room' }
]);

const userRoleOptions = ref([]);
const submitting = ref(false);
const loadingRoles = ref(false);

// List of allowed email domains (you can add more as needed)
const allowedEmailDomains = ref([
    'gmail.com',
    'yahoo.com',
    'hotmail.com',
    'outlook.com',
    'company.com' // Add your company domain here
]);

// Computed property to extract domain from email
const emailDomain = computed(() => {
    if (!form.value.email.includes('@')) return null;
    return form.value.email.split('@')[1]?.toLowerCase();
});

// Email domain validation function
const validateEmailDomain = () => {
    if (!form.value.email.trim()) return true; // Let required validation handle empty

    const domain = emailDomain.value;
    if (!domain) return false;

    return allowedEmailDomains.value.some((allowedDomain) => domain === allowedDomain.toLowerCase());
};

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
    } else if (!validateEmailDomain()) {
        // Show allowed domains in the error message
        const allowedDomainsList = allowedEmailDomains.value.join(', ');
        errors.email = `Email domain is not allowed. Allowed domains are: ${allowedDomainsList}`;
        isValid = false;
    }

    // Department validation
    if (!form.value.department.trim()) {
        errors.department = 'Department is required';
        isValid = false;
    } else if (form.value.department.length > 100) {
        errors.department = 'Department must not exceed 100 characters';
        isValid = false;
    }

    // Storage Location validation
    if (!form.value.storageLocation || form.value.storageLocation.length === 0) {
        errors.storageLocation = 'At least one storage location must be selected';
        isValid = false;
    }

    // First name validation
    if (!form.value.first_name.trim()) {
        errors.first_name = 'First name is required';
        isValid = false;
    } else if (form.value.first_name.length > 100) {
        errors.first_name = 'First name must not exceed 100 characters';
        isValid = false;
    }

    // Last name validation
    if (!form.value.last_name.trim()) {
        errors.last_name = 'Last name is required';
        isValid = false;
    } else if (form.value.last_name.length > 100) {
        errors.last_name = 'Last name must not exceed 100 characters';
        isValid = false;
    }

    // Mobile phone validation
    if (!form.value.mobilephone.trim()) {
        errors.mobilephone = 'Mobile phone is required';
        isValid = false;
    } else if (form.value.mobilephone.length > 30) {
        errors.mobilephone = 'Mobile phone must not exceed 30 characters';
        isValid = false;
    }

    // User role validation
    if (!form.value.user_role_id) {
        errors.user_role_id = 'User role is required';
        isValid = false;
    }

    // Sales Office validation
    if (!form.value.salesOffice || form.value.salesOffice.length === 0) {
        errors.salesOffice = 'At least one sales office must be selected';
        isValid = false;
    }

    // Sales District validation
    if (!form.value.salesDistrict || form.value.salesDistrict.length === 0) {
        errors.salesDistrict = 'At least one sales district must be selected';
        isValid = false;
    }

    // Status validation
    if (form.value.status === null || form.value.status === undefined) {
        errors.status = 'Status is required';
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
            username: form.value.username,
            email: form.value.email,
            department: form.value.department,
            storageLocation: form.value.storageLocation,
            first_name: form.value.first_name,
            last_name: form.value.last_name,
            mobilephone: form.value.mobilephone,
            user_role_id: form.value.user_role_id,
            salesOffice: form.value.salesOffice,
            salesDistrict: form.value.salesDistrict,
            status: form.value.status
        };

        // Log payload for debugging
        console.log('Creating user with payload:', JSON.stringify(payload, null, 2));

        // Call the API endpoint
        const response = await api.post('admin/create-user', payload);

        if (response.data.status === 1) {
            toast.add({
                severity: 'success',
                summary: 'Success',
                detail: response.data.message || `User "${form.value.username}" created successfully!`,
                life: 5000
            });

            // Redirect to user list
            setTimeout(() => {
                router.push('/it/listUserAccount');
            }, 1500);
        } else {
            // Handle API errors
            const errorDetail = response.data.error?.message || response.data.message || 'Failed to create user';
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
        console.error('Error creating user:', err);

        let errorMessage = 'Something went wrong while creating the user';

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

onMounted(() => {
    fetchUserRoles();
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

:deep(.p-multiselect) {
    width: 100%;
}
</style>
