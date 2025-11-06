<template>
    <Fluid>
        <div class="card flex flex-col gap-8 w-full">
            <div class="text-2xl font-bold text-gray-800 border-b pb-2">Create Eten User</div>

            <!-- User Info -->
            <div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    </div>
                    <div>
                        <label class="block font-bold text-gray-700">Confirm Password</label>
                        <Password v-model="form.confirm_password" :feedback="false" toggleMask class="w-full" placeholder="Confirm password" />
                        <small class="text-red-500" v-if="errors.confirm_password">{{ errors.confirm_password }}</small>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modules -->
        <div class="card flex flex-col gap-8 w-full">
            <div>
                <h3 class="text-xl font-semibold text-gray-700 border-b p-2 mb-4">🧩 Modules Access</h3>
                
                <!-- Master User Toggle -->
                <div class="mb-4 p-3 border rounded">
                    <Checkbox v-model="form.isMaster" :binary="true" inputId="isMaster" />
                    <label for="isMaster" class="ml-2 font-semibold">Master User (Full Access)</label>
                </div>

                <div class="grid grid-cols-2 gap-4" :class="{ 'opacity-50': form.isMaster }" :disabled="form.isMaster">
                    <div v-for="module in moduleOptions" :key="module.value">
                        <Checkbox class="mr-2" v-model="form.modules" :inputId="module.value" :value="module.value" 
                                 :disabled="form.isMaster" />
                        <label :for="module.value">{{ module.label }}</label>
                    </div>
                </div>
            </div>

            <!-- Loading and Messages -->
            <div v-if="loading" class="text-center">
                <ProgressSpinner />
            </div>
            <div v-if="message" class="p-3 rounded" :class="messageType === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
                {{ message }}
            </div>

            <div class="flex flex-col md:flex-row justify-end gap-2 mt-4">
                <div class="w-40">
                    <RouterLink to="/om/detailEten">
                        <Button label="Cancel" class="w-full p-button-secondary" />
                    </RouterLink>
                </div>
                <div class="w-40">
                    <Button label="Submit" class="w-full" @click="submitForm" :disabled="loading" />
                </div>
            </div>
        </div>
    </Fluid>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import api from '@/service/api';

const router = useRouter();
const route = useRoute();

const loading = ref(false);
const message = ref('');
const messageType = ref('');

const form = ref({
    first_name: '',
    last_name: '',
    email: '',
    mobileNum: '',
    countryCode: '60', // default to Malaysia
    password: '',
    confirm_password: '',
    dealerAccountNo: '', // will be set from route
    shiptoID: null,
    mod_warranty: 0,
    mod_order: 0,
    mod_billing: 0,
    mod_sale: 0,
    mod_user: 0,
    isMaster: 0,
    modules: [] // for checkbox binding
});

const errors = ref({});

const countryCodes = [
    { label: 'Malaysia (+60)', value: '60' },
    { label: 'Singapore (+65)', value: '65' }
];

const moduleOptions = [
    { label: 'Warranty Management', value: 'mod_warranty' },
    { label: 'Order Management', value: 'mod_order' },
    { label: 'Billing Management', value: 'mod_billing' },
    { label: 'Sales Management', value: 'mod_sale' },
    { label: 'User Management', value: 'mod_user' }
];

// Watch for module checkbox changes
watch(() => form.value.modules, (newModules) => {
    // Reset all module values
    form.value.mod_warranty = 0;
    form.value.mod_order = 0;
    form.value.mod_billing = 0;
    form.value.mod_sale = 0;
    form.value.mod_user = 0;
    
    // Set selected modules to 1
    newModules.forEach(module => {
        form.value[module] = 1;
    });
});

// Watch for master user toggle
watch(() => form.value.isMaster, (isMaster) => {
    if (isMaster) {
        // If master user, set all modules to 1
        form.value.mod_warranty = 1;
        form.value.mod_order = 1;
        form.value.mod_billing = 1;
        form.value.mod_sale = 1;
        form.value.mod_user = 1;
        
        // Update checkbox array
        form.value.modules = moduleOptions.map(m => m.value);
    }
});

onMounted(() => {
    // Set dealer account number from route parameter
    form.value.dealerAccountNo = route.params.custAccNo;
});

const validateForm = () => {
    errors.value = {};
    
    if (!form.value.first_name.trim()) {
        errors.value.first_name = 'First name is required';
    }
    
    if (!form.value.email.trim()) {
        errors.value.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(form.value.email)) {
        errors.value.email = 'Please enter a valid email';
    }
    
    if (!form.value.countryCode) {
        errors.value.countryCode = 'Country code is required';
    }
    
    if (!form.value.mobileNum.trim()) {
        errors.value.mobileNum = 'Mobile number is required';
    }
    
    if (!form.value.password) {
        errors.value.password = 'Password is required';
    } else if (form.value.password.length < 6) {
        errors.value.password = 'Password must be at least 6 characters';
    }
    
    if (!form.value.confirm_password) {
        errors.value.confirm_password = 'Please confirm password';
    } else if (form.value.password !== form.value.confirm_password) {
        errors.value.confirm_password = 'Passwords do not match';
    }
    
    return Object.keys(errors.value).length === 0;
};

const submitForm = async () => {
    if (!validateForm()) {
        return;
    }

    loading.value = true;
    message.value = '';
    
    try {
        const payload = {
            ...form.value,
            // Remove the modules array as it's only for UI
            modules: undefined
        };

        const response = await api.post('add_dealer_user', payload);
        
        if (response.data.status === 1) {
            message.value = 'User created successfully! Activation email sent.';
            messageType.value = 'success';
            
            // Redirect after success
            setTimeout(() => {
                router.push('/om/detailEten/' + form.value.dealerAccountNo);
            }, 2000);
        } else {
            message.value = response.data.error?.message || 'Failed to create user';
            messageType.value = 'error';
        }
    } catch (error) {
        console.error('Error creating user:', error);
        message.value = 'An error occurred while creating user';
        messageType.value = 'error';
        
        // Handle validation errors from backend
        if (error.response?.data?.error) {
            message.value = error.response.data.error.message || 'Validation failed';
        }
    } finally {
        loading.value = false;
    }
};
</script>