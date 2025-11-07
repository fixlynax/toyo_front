<template>
    <Fluid>
        <div class="card flex flex-col gap-8 w-full">
            <div class="text-2xl font-bold text-gray-800 border-b pb-2">Edit Eten User</div>

            <!-- User Info -->
            <div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="md:col-span-2">
                        <label class="block font-bold text-gray-700">Member Code</label>
                        <InputText disabled v-model="memberDetail.etenUserID" class="w-full" />
                    </div>
                    <div>
                        <label class="block font-bold text-gray-700">First Name</label>
                        <InputText v-model="form.first_name" class="w-full" placeholder="Enter first name" />
                        <small class="text-red-500" v-if="errors.first_name">{{ errors.first_name }}</small>
                    </div>
                    <div>
                        <label class="block font-bold text-gray-700">Last Name</label>
                        <InputText v-model="form.last_name" class="w-full" placeholder="Enter last name" />
                    </div>
                    <div>
                        <label class="block font-bold text-gray-700">Email</label>
                        <InputText v-model="form.email" type="email" class="w-full" placeholder="Enter email" />
                        <small class="text-red-500" v-if="errors.email">{{ errors.email }}</small>
                    </div>
                    <div class="grid grid-cols-2 gap-2">
                        <div>
                            <label class="block font-bold text-gray-700">Country Code</label>
                            <Dropdown v-model="form.countryCode" :options="countryCodes" optionLabel="label" optionValue="value" 
                                     class="w-full" placeholder="Select" />
                            <small class="text-red-500" v-if="errors.countryCode">{{ errors.countryCode }}</small>
                        </div>
                        <div>
                            <label class="block font-bold text-gray-700">Mobile No</label>
                            <InputText v-model="form.mobileNum" class="w-full" placeholder="Enter mobile number" />
                            <small class="text-red-500" v-if="errors.mobileNum">{{ errors.mobileNum }}</small>
                        </div>
                    </div>
                    <div>
                        <label class="block font-bold text-gray-700">Password</label>
                        <Password v-model="form.password" :feedback="false" toggleMask class="w-full" placeholder="Enter password" />
                        <small class="text-red-500" v-if="errors.password">{{ errors.password }}</small>
                        <small class="text-gray-500">Leave blank to keep current password</small>
                    </div>
                    <div>
                        <label class="block font-bold text-gray-700">Confirm Password</label>
                        <Password v-model="form.confirm_password" :feedback="false" toggleMask class="w-full" placeholder="Confirm password" />
                        <small class="text-red-500" v-if="errors.confirm_password">{{ errors.confirm_password }}</small>
                    </div>
                    <div>
                        <label class="block font-bold text-gray-700">Master User</label>
                        <Dropdown v-model="form.isMaster" :options="masterOptions" optionLabel="label" optionValue="value" 
                                 class="w-full" placeholder="Select" />
                        <small class="text-gray-500">Master users have access to all modules</small>
                        <small class="text-red-500" v-if="errors.isMaster">{{ errors.isMaster }}</small>
                    </div>
                    <div>
                        <label class="block font-bold text-gray-700">Status</label>
                        <Dropdown v-model="form.status" :options="statusOptions" optionLabel="label" optionValue="value" 
                                 class="w-full" placeholder="Select status" />
                        <small class="text-red-500" v-if="errors.status">{{ errors.status }}</small>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modules -->
        <div class="card flex flex-col gap-8 w-full" v-if="form.isMaster === 0">
            <div>
                <h3 class="text-xl font-semibold text-gray-700 border-b p-2 mb-4">🧩 Modules Access</h3>
                <div class="grid grid-cols-2 gap-4">
                    <div v-for="module in moduleOptions" :key="module.value">
                        <Checkbox class="mr-2" v-model="form.modules" :inputId="module.value" :value="module.value" />
                        <label :for="module.value">{{ module.label }}</label>
                    </div>
                </div>
            </div>
        </div>

        <div class="card flex flex-col gap-8 w-full">
            <div class="flex flex-col md:flex-row justify-end gap-2 mt-4">
                <div class="w-40">
                    <Button label="Cancel" class="w-full p-button-secondary" @click="$router.back()" />
                </div>
                <div class="w-40">
                    <Button label="Update" class="w-full" @click="handleUpdate" :loading="loading" />
                </div>
            </div>
        </div>
    </Fluid>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import api from '@/service/api'
import { useToast } from 'primevue/usetoast';

const toast = useToast();
const router = useRouter();
const route = useRoute();
const loading = ref(false);
const loadingData = ref(false);

const countryCodes = ref([
    { label: 'Malaysia (+60)', value: '60' },
    { label: 'Singapore (+65)', value: '65' }
]);

const masterOptions = ref([
    { label: 'No', value: 0 },
    { label: 'Yes', value: 1 }
]);

const statusOptions = ref([
    { label: 'Active', value: 1 },
    { label: 'Inactive', value: 0 }
]);

const moduleOptions = [
    { label: 'Warranty Management', value: 'mod_warranty' },
    { label: 'Order Management', value: 'mod_order' },
    { label: 'Billing Management', value: 'mod_billing' },
    { label: 'Sales Management', value: 'mod_sale' },
    { label: 'User Management', value: 'mod_user' }
];

const form = ref({
    first_name: '',
    last_name: '',
    email: '',
    mobileNum: '',
    countryCode: '60',
    password: '',
    confirm_password: '',
    dealerAccountNo: '',
    shiptoID: null,
    modules: [],
    isMaster: 0,
    status: 1,
});

const errors = ref({});
const memberDetail = ref({});
const originalData = ref({});

// Watch for isMaster changes to handle module access
watch(() => form.value.isMaster, (newValue) => {
    if (newValue === 1) {
        // If master user, select all modules
        form.value.modules = moduleOptions.map(module => module.value);
    }
});

onMounted(() => {
    // Set dealer account number from route parameter
    // form.value.dealerAccountNo = route.params.custAccNo;
    
    // Load user data for editing
    loadUserData();
});

const loadUserData = async () => {
    loadingData.value = true;
    try {
        const userId = route.params.id; // Get user ID from route parameters
        const response = await api.get(`detail_dealer_user/${userId}`);
        
        if (response.data.status === 1) {
            const userData = response.data.admin_data.userData;
            memberDetail.value = userData;
            originalData.value = { ...userData };
            
            // Populate form with existing user data
            form.value.first_name = userData.firstName || '';
            form.value.last_name = userData.lastName || '';
            form.value.email = userData.emailAddress || '';
            form.value.countryCode = userData.countryCode || '60';
            form.value.mobileNum = userData.mobileNumber || '';
            form.value.isMaster = userData.isMaster || 0;
            form.value.status = userData.status || 1;
            
            // Password fields are left empty for security
            form.value.password = '';
            form.value.confirm_password = '';
            
            // Set modules based on permissions
            if (userData.isMaster === 1) {
                form.value.modules = moduleOptions.map(module => module.value);
            } else {
                const selectedModules = [];
                if (userData.allow_warranty === 1) selectedModules.push('mod_warranty');
                if (userData.allow_order === 1) selectedModules.push('mod_order');
                if (userData.allow_billing === 1) selectedModules.push('mod_billing');
                if (userData.allow_sale === 1) selectedModules.push('mod_sale');
                if (userData.allow_user === 1) selectedModules.push('mod_user');
                form.value.modules = selectedModules;
            }
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

    if (!form.value.first_name.trim()) {
        errors.value.first_name = 'First name is required';
    }

    if (!form.value.email.trim()) {
        errors.value.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(form.value.email)) {
        errors.value.email = 'Please enter a valid email address';
    }

    if (!form.value.countryCode) {
        errors.value.countryCode = 'Country code is required';
    }

    if (!form.value.mobileNum.trim()) {
        errors.value.mobileNum = 'Mobile number is required';
    }

    // Password validation - only required if user is changing password
    if (form.value.password || form.value.confirm_password) {
        if (form.value.password.length < 6) {
            errors.value.password = 'Password must be at least 6 characters';
        }

        if (form.value.password !== form.value.confirm_password) {
            errors.value.confirm_password = 'Passwords do not match';
        }
    }

    return Object.keys(errors.value).length === 0;
};

const createFormData = () => {
    const formData = new FormData();
    
    // Append all form fields
    formData.append('first_name', form.value.first_name || '');
    formData.append('last_name', form.value.last_name || '');
    formData.append('email', form.value.email || '');
    formData.append('countryCode', form.value.countryCode || '');
    formData.append('mobileNum', form.value.mobileNum || '');
    
    // Only append password if it's changed (not empty)
    if (form.value.password) {
        formData.append('password', form.value.password || '');
        formData.append('confirm_password', form.value.confirm_password || '');
    } else {
        // If password is not changed, use the original password
        formData.append('password', 'currentpassword'); // This will be ignored by backend if same
        formData.append('confirm_password', 'currentpassword');
    }
    
    formData.append('dealerAccountNo', form.value.dealerAccountNo || '');
    formData.append('shiptoID', form.value.shiptoID || '');
    formData.append('isMaster', form.value.isMaster || 0);
    formData.append('status', form.value.status || 1);
    
    // Append module permissions
    formData.append('mod_warranty', form.value.isMaster === 1 ? 1 : (form.value.modules.includes('mod_warranty') ? 1 : 0));
    formData.append('mod_order', form.value.isMaster === 1 ? 1 : (form.value.modules.includes('mod_order') ? 1 : 0));
    formData.append('mod_billing', form.value.isMaster === 1 ? 1 : (form.value.modules.includes('mod_billing') ? 1 : 0));
    formData.append('mod_sale', form.value.isMaster === 1 ? 1 : (form.value.modules.includes('mod_sale') ? 1 : 0));
    formData.append('mod_user', form.value.isMaster === 1 ? 1 : (form.value.modules.includes('mod_user') ? 1 : 0));

    return formData;
};

const handleUpdate = async () => {
    if (!validateForm()) {
        toast.add({
            severity: 'error',
            summary: 'Validation Error',
            detail: 'Please fix the errors in the form',
            life: 5000
        });
        return;
    }

    loading.value = true;

    try {
        // Create FormData object and append all fields
        const formData = createFormData();

        // Log form data for debugging (remove in production)
        console.log('Updating form data:');
        for (let [key, value] of formData.entries()) {
            console.log(`${key}: ${value}`);
        }

        const userId = route.params.id; // Get user ID from route parameters
        const response = await api.post(`update_dealer_user/${userId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        if (response.data.status === 0) {
            toast.add({
                severity: 'success',
                summary: 'Success',
                detail: 'User updated successfully',
                life: 5000
            });

            // // Redirect to detailEten page after successful update
             router.back();
        } else {
            // Handle API errors
            const errorMessage = response.data.error?.message || 'Failed to update user';
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: errorMessage,
                life: 5000
            });
        }
    } catch (error) {
        console.error('Error updating user:', error);
        
        let errorMessage = 'An error occurred while updating user';
        if (error.response?.data?.error?.message) {
            errorMessage = error.response.data.error.message;
        } else if (error.response?.data?.message) {
            errorMessage = error.response.data.message;
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
    router.push('/om/detailEten/' + form.value.dealerAccountNo);
};
</script>