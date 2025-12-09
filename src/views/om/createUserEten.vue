<template>
    <Fluid>
        <div class="card flex flex-col gap-6 w-full">
            <div class="text-2xl font-bold text-gray-800 border-b pb-4">Create Eten User</div>

            <!-- User Information Card -->
            <Card class="mb-4">
                <template #title>
                    <div class="flex items-center gap-2">
                        <i class="pi pi-user text-primary"></i>
                        <span class="text-xl font-semibold">User Information</span>
                    </div>
                </template>
                <template #content>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <!-- First Name -->
                        <div class="space-y-2">
                            <label class="block font-semibold text-gray-700 required">First Name</label>
                            <InputText v-model="form.first_name" class="w-full" placeholder="Enter first name" :class="{ 'p-invalid': errors.first_name }" />
                            <small class="text-red-500 text-sm" v-if="errors.first_name"> <i class="pi pi-exclamation-circle mr-1"></i>{{ errors.first_name }} </small>
                        </div>

                        <!-- Last Name -->
                        <div class="space-y-2">
                            <label class="block font-semibold text-gray-700">Last Name</label>
                            <InputText v-model="form.last_name" class="w-full" placeholder="Enter last name" />
                        </div>

                        <!-- Email -->
                        <div class="space-y-2">
                            <label class="block font-semibold text-gray-700 required">Email</label>
                            <InputText v-model="form.email" type="email" class="w-full" placeholder="Enter email" :class="{ 'p-invalid': errors.email }" />
                            <small class="text-red-500 text-sm" v-if="errors.email"> <i class="pi pi-exclamation-circle mr-1"></i>{{ errors.email }} </small>
                        </div>

                        <!-- Mobile Number -->
                        <div class="space-y-2">
                            <label class="block font-semibold text-gray-700 required">Mobile Number</label>
                            <div class="flex gap-2">
                                <div class="w-32">
                                    <Dropdown v-model="form.countryCode" :options="countryCodes" optionLabel="label" optionValue="value" class="w-full" placeholder="Code" :class="{ 'p-invalid': errors.countryCode }" />
                                </div>
                                <div class="flex-1">
                                    <InputText v-model="form.mobileNum" class="w-full" placeholder="Enter mobile number" :class="{ 'p-invalid': errors.mobileNum }" />
                                </div>
                            </div>
                            <small class="text-red-500 text-sm" v-if="errors.countryCode || errors.mobileNum">
                                <i class="pi pi-exclamation-circle mr-1"></i>
                                {{ errors.countryCode || errors.mobileNum }}
                            </small>
                        </div>

                        <!-- Master User -->
                        <div class="space-y-2">
                            <label class="block font-semibold text-gray-700 required">Master User</label>
                            <Dropdown v-model="form.isMaster" :options="masterOptions" disabled optionLabel="label" optionValue="value" class="w-full" placeholder="Select" :class="{ 'p-invalid': errors.isMaster }" />
                            <small class="text-gray-500 text-sm flex items-center gap-1">
                                <i class="pi pi-info-circle"></i>
                                Master users have access to all modules
                            </small>
                            <small class="text-red-500 text-sm" v-if="errors.isMaster"> <i class="pi pi-exclamation-circle mr-1"></i>{{ errors.isMaster }} </small>
                        </div>
                    </div>
                </template>
            </Card>

            <!-- Modules Access Card - Only show for non-master users -->
            <Card class="mb-4" v-if="form.isMaster === 0">
                <template #title>
                    <div class="flex items-center gap-2">
                        <i class="pi pi-th-large text-primary"></i>
                        <span class="text-xl font-semibold">Modules Access</span>
                    </div>
                </template>
                <template #content>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <!-- Only showing the two modules that API accepts -->
                        <div class="flex items-center">
                            <Checkbox v-model="form.mod_warranty" :inputId="'mod_warranty'" :binary="true" class="mr-3" />
                            <label for="mod_warranty" class="text-gray-700 cursor-pointer"> Warranty Management </label>
                        </div>
                        <div class="flex items-center">
                            <Checkbox v-model="form.mod_order" :inputId="'mod_order'" :binary="true" class="mr-3" />
                            <label for="mod_order" class="text-gray-700 cursor-pointer"> Order Management </label>
                        </div>
                    </div>
                    <small class="text-red-500 text-sm mt-2" v-if="errors.modules"> <i class="pi pi-exclamation-circle mr-1"></i>{{ errors.modules }} </small>
                    <div class="mt-4 p-3 bg-blue-50 rounded border border-blue-200">
                        <div class="flex items-center gap-2 text-blue-700">
                            <i class="pi pi-info-circle"></i>
                            <span class="text-sm">Select modules that this user should have access to</span>
                        </div>
                    </div>
                    <div class="flex flex-col md:flex-row justify-end gap-3 mt-6">
                        <Button label="Cancel" icon="pi pi-times" class="p-button-outlined p-button-secondary" style="width: fit-content" @click="handleCancel" :disabled="loading" />
                        <Button label="Create User" icon="pi pi-check" style="width: fit-content" @click="handleSubmit" :loading="loading" />
                    </div>
                </template>
            </Card>

            <!-- Master User Notice -->
            <Card class="mb-4" v-if="form.isMaster === 1">
                <template #content>
                    <div class="p-4 bg-yellow-50 rounded border border-yellow-200">
                        <div class="flex items-center gap-3">
                            <i class="pi pi-shield text-yellow-600 text-xl"></i>
                            <div>
                                <h4 class="font-semibold text-yellow-800">Master User Access</h4>
                                <p class="text-yellow-700 text-sm mt-1">This user will have full access to all modules and system functionalities. Only one master user is allowed per dealer account.</p>
                            </div>
                        </div>
                    </div>
                    <div class="flex flex-col md:flex-row justify-end gap-3 mt-6">
                        <Button label="Cancel" icon="pi pi-times" class="p-button-outlined p-button-secondary" style="width: fit-content" @click="handleCancel" :disabled="loading" />
                        <Button label="Create User" icon="pi pi-check" style="width: fit-content" @click="handleSubmit" :loading="loading" />
                    </div>
                </template>
            </Card>
        </div>
    </Fluid>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import api from '@/service/api';
import { useToast } from 'primevue/usetoast';

const toast = useToast();
const router = useRouter();
const route = useRoute();
const loading = ref(false);

const countryCodes = ref([
    { label: '(+60) Malaysia', value: '60' },
    // { label: 'Singapore (+65)', value: '65' }
]);

const masterOptions = ref([
    { label: 'No', value: 0 },
    { label: 'Yes', value: 1 }
]);

const form = ref({
    first_name: '',
    last_name: '',
    email: '',
    mobileNum: '',
    countryCode: '60',
    dealerAccountNo: '',
    shiptoID: null,
    mod_warranty: false,
    mod_order: false,
    isMaster: 0
});

const errors = ref({});

// Computed property to check if form has been modified
const isFormModified = computed(() => {
    return form.value.first_name || form.value.last_name || form.value.email || form.value.mobileNum;
});

// Watch for isMaster changes to handle module access
watch(
    () => form.value.isMaster,
    (newValue) => {
        if (newValue === 1) {
            // If master user, enable all available modules
            form.value.mod_warranty = true;
            form.value.mod_order = true;
        }
    }
);

onMounted(() => {
    // Set dealer account number from route parameter
    form.value.dealerAccountNo = route.params.custAccNo;
});

const validateForm = () => {
    errors.value = {};

    // First Name validation
    if (!form.value.first_name.trim()) {
        errors.value.first_name = 'First name is required';
    } else if (form.value.first_name.trim().length < 2) {
        errors.value.first_name = 'First name must be at least 2 characters';
    }

    // Email validation
    if (!form.value.email.trim()) {
        errors.value.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(form.value.email)) {
        errors.value.email = 'Please enter a valid email address';
    }

    // Country Code validation
    if (!form.value.countryCode) {
        errors.value.countryCode = 'Country code is required';
    }

    // Mobile Number validation
    if (!form.value.mobileNum.trim()) {
        errors.value.mobileNum = 'Mobile number is required';
    } else if (!/^\d+$/.test(form.value.mobileNum.replace(/\s/g, ''))) {
        errors.value.mobileNum = 'Mobile number must contain only digits';
    } else if (form.value.mobileNum.replace(/\s/g, '').length < 8) {
        errors.value.mobileNum = 'Mobile number is too short';
    } else if (form.value.mobileNum.startsWith('0')) {
        errors.value.mobileNum = 'Mobile number should not start with 0 (enter without country code)';
    }

    // Master user validation
    if (form.value.isMaster === null || form.value.isMaster === undefined || form.value.isMaster === '') {
        errors.value.isMaster = 'Please specify if this is a master user';
    }

    // Module validation for non-master users
    if (form.value.isMaster === 0 && !form.value.mod_warranty && !form.value.mod_order) {
        errors.value.modules = 'Please select at least one module for non-master users';
    }

    console.log('Validation errors:', errors.value);
    return Object.keys(errors.value).length === 0;
};

const createFormData = () => {
    const formData = new FormData();

    // Append all form fields according to API requirements
    formData.append('first_name', form.value.first_name.trim());
    formData.append('last_name', form.value.last_name.trim());
    formData.append('email', form.value.email.trim().toLowerCase());
    formData.append('countryCode', form.value.countryCode);
    formData.append('mobileNum', form.value.mobileNum.replace(/\s/g, ''));
    formData.append('dealerAccountNo', form.value.dealerAccountNo);
    formData.append('shiptoID', form.value.shiptoID || '');
    formData.append('isMaster', form.value.isMaster);

    // Append module permissions (only the two that API accepts)
    formData.append('mod_warranty', form.value.isMaster === 1 ? 1 : form.value.mod_warranty ? 1 : 0);
    formData.append('mod_order', form.value.isMaster === 1 ? 1 : form.value.mod_order ? 1 : 0);

    return formData;
};

const handleSubmit = async () => {
    if (!validateForm()) {
        toast.add({
            severity: 'error',
            summary: 'Validation Error',
            detail: 'Please fix the errors in the form before submitting',
            life: 5000
        });
        return;
    }

    loading.value = true;

    try {
        const formData = createFormData();

        // Debug: Log form data before sending
        console.log('Submitting form data:');
        for (let [key, value] of formData.entries()) {
            console.log(key + ': ' + value);
        }

        const response = await api.post('add_dealer_user', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        console.log('API Response:', response);

        if (response.data.status === 1) {
            toast.add({
                severity: 'success',
                summary: 'Success',
                detail: 'User created successfully. Temporary password has been sent via email.',
                life: 5000
            });

            // Redirect to detailEten page after successful creation
            router.push('/om/detailEten/' + form.value.dealerAccountNo);
        } else {
            // Handle specific API errors
            const errorMessage = response.data.error?.message || 'Failed to create user';

            // Check for specific error codes
            if (response.data.error?.code === '419') {
                toast.add({
                    severity: 'warn',
                    summary: 'Master User Exists',
                    detail: 'A master user already exists for this dealer account. Only one master user is allowed.',
                    life: 6000
                });
            } else if (response.data.error?.code === '402') {
                // Validation error from API
                toast.add({
                    severity: 'error',
                    summary: 'Validation Error',
                    detail: 'Please check your input. Email or mobile number might already be registered.',
                    life: 5000
                });
            } else {
                toast.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: errorMessage,
                    life: 5000
                });
            }
        }
    } catch (error) {
        console.error('Error creating user:', error);

        let errorMessage = 'An error occurred while creating user';

        if (error.response?.data?.error?.message) {
            errorMessage = error.response.data.error.message;
        } else if (error.response?.data?.message) {
            errorMessage = error.response.data.message;
        } else if (error.code === 'NETWORK_ERROR') {
            errorMessage = 'Network error. Please check your connection.';
        }

        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: errorMessage,
            life: 5000
        });
    } finally {
        loading.value = false;
    }
};

const handleCancel = () => {
    if (isFormModified.value) {
        // Show confirmation dialog if form has changes
        if (confirm('You have unsaved changes. Are you sure you want to cancel?')) {
            router.push('/om/detailEten/' + form.value.dealerAccountNo);
        }
    } else {
        router.push('/om/detailEten/' + form.value.dealerAccountNo);
    }
};
</script>

<style scoped>
.required::after {
    content: ' *';
    color: #ef4444;
}

:deep(.p-card) {
    box-shadow:
        0 1px 3px 0 rgba(0, 0, 0, 0.1),
        0 1px 2px 0 rgba(0, 0, 0, 0.06);
}

:deep(.p-card .p-card-title) {
    font-size: 1.25rem;
    color: #374151;
}
</style>
