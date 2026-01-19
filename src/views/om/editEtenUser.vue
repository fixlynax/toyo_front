<template>
    <Fluid>
        <div class="card flex flex-col gap-6 w-full">
            <div class="text-2xl font-bold text-gray-800 border-b pb-4">Edit Eten User</div>

            <!-- User Information Card -->
            <Card class="mb-4">
                <template #title>
                    <div class="flex items-center gap-2 mb-4">
                        <i class="pi pi-user text-primary"></i>
                        <span class="text-xl font-semibold">User Information</span>
                    </div>
                </template>
                <template #content>
                    <!-- Member Code (Readonly) -->
                    <div class="mb-6 p-4 bg-gray-50 rounded-lg hidden">
                        <label class="block font-semibold text-gray-700 mb-2">Member Code</label>
                        <InputText disabled v-model="memberDetail.etenUserID" class="w-full" />
                    </div>

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
                                    <InputText disabled v-model="form.countryCode" class="w-full" placeholder="+60" />
                                </div>
                                <div class="flex-1">
                                    <InputText v-model="form.mobileNum" class="w-full" placeholder="Enter mobile number" :class="{ 'p-invalid': errors.mobileNum }" />
                                </div>
                            </div>
                            <small class="text-red-500 text-sm" v-if="errors.mobileNum">
                                <i class="pi pi-exclamation-circle mr-1"></i>
                                {{ errors.mobileNum }}
                            </small>
                        </div>

                        <!-- Master User - Hidden since API forces isMaster to 0 -->
                        <div class="space-y-2" hidden>
                            <label class="block font-semibold text-gray-700 required">Master User</label>
                            <Dropdown v-model="form.isMaster" :options="masterOptions" optionLabel="label" optionValue="value" class="w-full" placeholder="Select" :class="{ 'p-invalid': errors.isMaster }" />
                            <small class="text-gray-500 text-sm flex items-center gap-1">
                                <i class="pi pi-info-circle"></i>
                                Master users have access to all modules
                            </small>
                            <small class="text-red-500 text-sm" v-if="errors.isMaster"> <i class="pi pi-exclamation-circle mr-1"></i>{{ errors.isMaster }} </small>
                        </div>

                        <!-- Status -->
                        <div class="space-y-2">
                            <label class="block font-semibold text-gray-700 required">Status</label>
                            <Dropdown v-model="form.status" :options="statusOptions" optionLabel="label" optionValue="value" class="w-full" placeholder="Select status" :class="{ 'p-invalid': errors.status }" />
                            <small class="text-red-500 text-sm" v-if="errors.status"> <i class="pi pi-exclamation-circle mr-1"></i>{{ errors.status }} </small>
                        </div>
                    </div>
                </template>
            </Card>

            <!-- Modules Access Card - Only show editable modules -->
            <Card class="mb-4" v-if="form.isMaster === 0">
                <template #title>
                    <div class="flex items-center gap-2">
                        <i class="pi pi-th-large text-primary"></i>
                        <span class="text-xl font-semibold">Modules Access</span>
                    </div>
                </template>
                <template #content>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <!-- Only showing the two modules that are editable -->
                        <div class="flex items-center">
                            <Checkbox v-model="form.mod_order" :inputId="'mod_order'" :binary="true" class="mr-3" />
                            <label for="mod_order" class="text-gray-700 cursor-pointer"> Order Approval </label>
                        </div>
                        <div class="flex items-center">
                            <Checkbox v-model="form.mod_order_placing" :inputId="'mod_order_placing'" :binary="true" class="mr-3" :disabled="!form.mod_order" />
                            <label for="mod_order_placing" class="text-gray-700 cursor-pointer" :class="{ 'opacity-60': !form.mod_order }">
                                Order Placing
                                <span v-if="!form.mod_order" class="text-xs text-blue-600 ml-1"> (requires Order Approval) </span>
                            </label>
                        </div>
                        <div class="flex items-center">
                            <Checkbox v-model="form.mod_warranty" :inputId="'mod_warranty'" :binary="true" class="mr-3" />
                            <label for="mod_warranty" class="text-gray-700 cursor-pointer"> Warranty </label>
                        </div>
                        <div class="flex items-center">
                            <Checkbox v-model="form.mod_billing" :inputId="'mod_billing'" :binary="true" class="mr-3" />
                            <label for="mod_billing" class="text-gray-700 cursor-pointer"> Billing </label>
                        </div>
                        <div class="flex items-center">
                            <Checkbox v-model="form.mod_sale" :inputId="'mod_sale'" :binary="true" class="mr-3" />
                            <label for="mod_sale" class="text-gray-700 cursor-pointer"> Sales Forecast </label>
                        </div>
                    </div>
                    <small class="text-red-500 text-sm mt-2" v-if="errors.modules"> <i class="pi pi-exclamation-circle mr-1"></i>{{ errors.modules }} </small>
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
                </template>
            </Card>

            <!-- Action Buttons -->
            <Card>
                <template #content>
                    <div class="flex flex-col md:flex-row justify-end gap-3">
                        <div class="w-50">
                            <Button label="Cancel" icon="pi pi-times" class="p-button-outlined p-button-secondary w-full md:w-auto" @click="handleCancel" :disabled="loading" />
                        </div>
                        <div class="w-30">
                            <Button label="Update User" icon="pi pi-check" class="w-full md:w-auto" @click="handleUpdate" :loading="loading" />
                        </div>
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
const loadingData = ref(false);

// Fixed country code - only +60
const countryCode = ref('60');

const masterOptions = ref([
    { label: 'No', value: 0 },
    { label: 'Yes', value: 1 }
]);

const statusOptions = ref([
    { label: 'Active', value: 1 },
    { label: 'Inactive', value: 0 }
]);

const form = ref({
    first_name: '',
    last_name: '',
    email: '',
    mobileNum: '',
    countryCode: '60', // Fixed to +60
    dealerAccountNo: '',
    shiptoID: null,
    mod_warranty: false,
    mod_order: false,
    mod_sale: false,
    mod_billing: false,
    mod_order_placing: false,
    isMaster: 0,
    status: 1
});

const errors = ref({});
const memberDetail = ref({});
const originalData = ref({});

// Computed property to check if user is activated (has activation date)
const isUserActivated = computed(() => {
    return memberDetail.value.activated !== null && memberDetail.value.activated !== undefined && memberDetail.value.activated !== '';
});

// Computed property to check if form has been modified
const isFormModified = computed(() => {
    const original = originalData.value;
    const current = form.value;

    return (
        current.first_name !== original.firstName ||
        current.last_name !== original.lastName ||
        current.email !== original.emailAddress ||
        current.mobileNum !== original.mobileNumber ||
        current.isMaster !== original.isMaster ||
        current.status !== original.status ||
        current.mod_warranty !== (original.allow_warranty === 1) ||
        current.mod_order !== (original.allow_order === 1) ||
        current.mod_billing !== (original.allow_billing === 1) ||
        current.mod_sale !== (original.allow_sale === 1) ||
        current.mod_order_placing !== (original.allow_order_placing === 1)
    );
});

// Computed property to check invalid module selection
const hasInvalidModuleSelection = computed(() => {
    return form.value.mod_order_placing && !form.value.mod_order;
});

// Watch for isMaster changes to handle module access
watch(
    () => form.value.isMaster,
    (newValue) => {
        if (newValue === 1) {
            // If master user, enable all available modules
            form.value.mod_warranty = true;
            form.value.mod_order = true;
            form.value.mod_billing = true;
            form.value.mod_sale = true;
            form.value.mod_order_placing = true;
        } else {
            // If switching from master to non-master, clear modules
            form.value.mod_warranty = false;
            form.value.mod_order = false;
            form.value.mod_billing = false;
            form.value.mod_sale = false;
            form.value.mod_order_placing = false;
        }
    }
);

// Watch for mod_order_placing changes to enforce dependency
watch(
    () => form.value.mod_order_placing,
    (newValue) => {
        if (newValue && !form.value.mod_order) {
            // If order placing is selected but order is not selected, automatically select it
            form.value.mod_order = true;
        }
    }
);

// Watch for mod_order changes to handle dependency
watch(
    () => form.value.mod_order,
    (newValue) => {
        if (!newValue && form.value.mod_order_placing) {
            // If order is deselected while order placing is selected, deselect order placing
            form.value.mod_order_placing = false;
        }
    }
);

onMounted(() => {
    loadUserData();
});

const loadUserData = async () => {
    loadingData.value = true;
    try {
        const userId = route.params.id;
        const response = await api.get(`detail_dealer_user/${userId}`);

        if (response.data.status === 1) {
            const userData = response.data.admin_data.userData;
            memberDetail.value = userData;
            originalData.value = { ...userData };

            // Populate form with existing user data
            form.value.first_name = userData.firstName || '';
            form.value.last_name = userData.lastName || '';
            form.value.email = userData.emailAddress || '';
            form.value.countryCode = '60'; // Fixed to +60
            form.value.mobileNum = userData.mobileNumber || '';
            form.value.isMaster = userData.isMaster || 0;
            form.value.status = userData.status || 1;
            form.value.dealerAccountNo = userData.dealer_shop?.custAccountNo || '';

            // Set modules based on permissions
            form.value.mod_warranty = userData.allow_warranty === 1;
            form.value.mod_order = userData.allow_order === 1;
            form.value.mod_billing = userData.allow_billing === 1;
            form.value.mod_sale = userData.allow_sale === 1;
            form.value.mod_order_placing = userData.allow_order_placing === 1;

            console.log('Loaded user data:', userData);
            console.log('Dealer Account No:', form.value.dealerAccountNo);
            console.log('User activated status:', isUserActivated.value);
        } else {
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to load user data',
                life: 5000
            });
        }
    } catch (error) {
        console.error('Error loading user data:', error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'An error occurred while loading user data',
            life: 5000
        });
    } finally {
        loadingData.value = false;
    }
};

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

    // Mobile Number validation
    if (!form.value.mobileNum.trim()) {
        errors.value.mobileNum = 'Mobile number is required';
    } else if (!/^\d+$/.test(form.value.mobileNum.replace(/\s/g, ''))) {
        errors.value.mobileNum = 'Mobile number must contain only digits';
    } else if (form.value.mobileNum.replace(/\s/g, '').length < 8) {
        errors.value.mobileNum = 'Mobile number is too short';
    }

    // Status validation
    if (form.value.status === null || form.value.status === undefined || form.value.status === '') {
        errors.value.status = 'Please select user status';
    }

    // Module validation for non-master users
    if (form.value.isMaster === 0) {
        // if (!form.value.mod_warranty && !form.value.mod_order && !form.value.mod_billing && !form.value.mod_sale && !form.value.mod_order_placing) {
        if (!form.value.mod_warranty && !form.value.mod_order && !form.value.mod_billing && !form.value.mod_sale) {
            errors.value.modules = 'Please select at least one module for non-master users';
        }

        // NEW VALIDATION: If order placing is selected, order must also be selected
        if (form.value.mod_order_placing && !form.value.mod_order) {
            errors.value.modules = 'Order Management must be selected when Order Placing Management is selected';
        }
    }

    console.log('Validation errors:', errors.value);
    return Object.keys(errors.value).length === 0;
};

const createFormData = () => {
    const formData = new FormData();

    // Append all required form fields according to API
    formData.append('first_name', form.value.first_name.trim());
    formData.append('last_name', form.value.last_name.trim());
    formData.append('email', form.value.email.trim().toLowerCase());
    formData.append('countryCode', form.value.countryCode); // Fixed to +60
    formData.append('mobileNum', form.value.mobileNum.replace(/\s/g, ''));
    formData.append('dealerAccountNo', form.value.dealerAccountNo);
    formData.append('shiptoID', form.value.shiptoID || '');
    formData.append('isMaster', form.value.isMaster);
    formData.append('status', form.value.status);

    // Append module permissions
    // Only this mod_ are editable in UI
    formData.append('mod_warranty', form.value.isMaster === 1 ? 1 : form.value.mod_warranty ? 1 : 0);
    formData.append('mod_order', form.value.isMaster === 1 ? 1 : form.value.mod_order ? 1 : 0);
    formData.append('mod_billing', form.value.isMaster === 1 ? 1 : form.value.mod_billing ? 1 : 0);
    formData.append('mod_sale', form.value.isMaster === 1 ? 1 : form.value.mod_sale ? 1 : 0);
    // formData.append('mod_order_placing', form.value.isMaster === 1 ? 1 : form.value.mod_order_placing ? 1 : 0);

    // Always send these modules but set values based on isMaster
    // They are not shown in UI but required by API
    formData.append('mod_user', form.value.isMaster === 1 ? 1 : 0);

    // Debug: Log all form data
    console.log('Form Data to be sent:');
    for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
    }

    return formData;
};

const handleUpdate = async () => {
    if (!validateForm()) {
        toast.add({
            severity: 'error',
            summary: 'Validation Error',
            detail: 'Please fix the errors in the form before submitting',
            life: 5000
        });
        return;
    }

    // Additional validation for dealerAccountNo
    if (!form.value.dealerAccountNo) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Dealer account number is missing',
            life: 5000
        });
        return;
    }

    loading.value = true;

    try {
        const formData = createFormData();
        const userId = route.params.id;

        console.log('Sending update request for user ID:', userId);
        console.log('Full form data:', Object.fromEntries(formData));

        const response = await api.post(`update_dealer_user/${userId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        console.log('API Response:', response);

        if (response.data.status === 1) {
            toast.add({
                severity: 'success',
                summary: 'Success',
                detail: 'User updated successfully',
                life: 5000
            });

            router.back();
        } else {
            // Handle specific API errors
            const errorMessage = response.data.error?.message || 'Failed to update user';

            // Check for specific error codes
            if (response.data.error?.code === '419') {
                toast.add({
                    severity: 'warn',
                    summary: 'Master User Exists',
                    detail: 'A master user already exists for this dealer account. Only one master user is allowed.',
                    life: 6000
                });
            } else if (response.data.error?.code === '402') {
                toast.add({
                    severity: 'error',
                    summary: 'Validation Error',
                    detail: 'Please check your input data. Email or mobile number might already exist.',
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
        console.error('Error updating user:', error);

        let errorMessage = 'An error occurred while updating user';

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
        if (confirm('You have unsaved changes. Are you sure you want to cancel?')) {
            router.back();
        }
    } else {
        router.back();
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
