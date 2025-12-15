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
                        <label class="block font-bold text-gray-700 mb-2">Username<span style="color: red"> *</span></label>
                        <InputText v-model="form.username" placeholder="Enter username" class="w-full" />
                        <small v-if="errors.username" class="text-red-500 text-sm">{{ errors.username }}</small>
                    </div>

                    <!-- Email -->
                    <div class="md:col-span-1">
                        <label class="block font-bold text-gray-700 mb-2">Email<span style="color: red"> *</span></label>
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
                        <label class="block font-bold text-gray-700 mb-2">User Role<span style="color: red"> *</span></label>
                        <Select v-model="form.user_role_id" :options="userRoleOptions" optionLabel="label" optionValue="value" placeholder="Select user role" class="w-full" :loading="loadingRoles" />
                        <small v-if="errors.user_role_id" class="text-red-500 text-sm">{{ errors.user_role_id }}</small>
                    </div>

                    <!-- Department -->
                    <div class="md:col-span-1">
                        <label class="block font-bold text-gray-700 mb-2">Department<span style="color: red"> *</span></label>
                        <Select v-model="form.department_id" :options="departmentOptions" optionLabel="name" optionValue="id" placeholder="Select department" class="w-full" :loading="loadingDropdowns" @change="handleDepartmentChange" />
                        <small v-if="errors.department_id" class="text-red-500 text-sm">{{ errors.department_id }}</small>
                    </div>

                    <!-- Sales Office -->
                    <div class="md:col-span-1">
                        <label class="block font-bold text-gray-700 mb-2">Sales Office</label>
                        <MultiSelect
                            v-model="form.salesOffice"
                            :options="salesOfficeOptions"
                            optionLabel="name"
                            optionValue="name"
                            placeholder="Select sales office(s)"
                            class="w-full multiselect-custom"
                            :loading="loadingDropdowns"
                            @change="handleSalesOfficeChange"
                            :filter="true"
                            display="chip"
                            :showToggleAll="true"
                            filterPlaceholder="Search sales offices..."
                        >
                            <template #header>
                                <div class="flex justify-between items-center p-2 border-b">
                                    <span class="font-semibold">Select Sales Offices</span>
                                    <div class="flex gap-2">
                                        <Button v-if="salesOfficeOptions.length > 0" @click="selectAllSalesOffices" size="small" class="p-button-text p-button-sm" :disabled="form.salesOffice?.length === salesOfficeOptions.length">
                                            Select All
                                        </Button>
                                        <Button v-if="form.salesOffice?.length > 0" @click="clearAllSalesOffices" size="small" class="p-button-text p-button-sm"> Clear All </Button>
                                    </div>
                                </div>
                            </template>
                            <template #option="slotProps">
                                <div class="flex items-center">
                                    <span>{{ slotProps.option.name }}</span>
                                </div>
                            </template>
                        </MultiSelect>
                        <small v-if="errors.salesOffice" class="text-red-500 text-sm">{{ errors.salesOffice }}</small>
                    </div>

                    <!-- Sales District -->
                    <div class="md:col-span-1">
                        <label class="block font-bold text-gray-700 mb-2">Sales District</label>
                        <MultiSelect
                            v-model="form.salesDistrict"
                            :options="groupedDistrictOptions"
                            optionGroupLabel="office"
                            optionGroupChildren="districts"
                            optionLabel="district_name"
                            optionValue="district_no"
                            placeholder="Select sales district(s)"
                            class="w-full multiselect-custom"
                            :loading="loadingDropdowns"
                            :disabled="!form.salesOffice || form.salesOffice.length === 0"
                            :filter="true"
                            display="chip"
                            :showToggleAll="true"
                            filterPlaceholder="Search districts..."
                        >
                            <template #header>
                                <div class="flex justify-between items-center p-2 border-b">
                                    <span class="font-semibold">Select Sales Districts</span>
                                    <div class="flex gap-2">
                                        <Button
                                            v-if="allDistrictOptionsForSelectedOffices.length > 0"
                                            @click="selectAllSalesDistricts"
                                            size="small"
                                            class="p-button-text p-button-sm"
                                            :disabled="form.salesDistrict?.length === allDistrictOptionsForSelectedOffices.length"
                                        >
                                            Select All
                                        </Button>
                                        <Button v-if="form.salesDistrict?.length > 0" @click="clearAllSalesDistricts" size="small" class="p-button-text p-button-sm"> Clear All </Button>
                                    </div>
                                </div>
                            </template>
                            <template #optiongroup="slotProps">
                                <div class="flex items-center font-semibold text-gray-700 bg-gray-50 p-2">
                                    <span>{{ slotProps.option.office }}</span>
                                </div>
                            </template>
                            <template #option="slotProps">
                                <div class="flex items-center ml-4">
                                    <span>{{ slotProps.option.district_name }} ({{ slotProps.option.district_no }})</span>
                                </div>
                            </template>
                        </MultiSelect>
                        <small v-if="errors.salesDistrict" class="text-red-500 text-sm">{{ errors.salesDistrict }}</small>
                    </div>

                    <!-- Storage Location -->
                    <div class="md:col-span-1">
                        <label class="block font-bold text-gray-700 mb-2">Storage Location</label>
                        <MultiSelect
                            v-model="form.storageLocation"
                            :options="storageLocationOptions"
                            optionLabel="label"
                            optionValue="value"
                            placeholder="Select storage location(s)"
                            class="w-full multiselect-custom"
                            :loading="loadingDropdowns"
                            :filter="true"
                            display="chip"
                            :showToggleAll="true"
                            filterPlaceholder="Search locations..."
                        >
                            <template #header>
                                <div class="flex justify-between items-center p-2 border-b">
                                    <span class="font-semibold">Select Storage Locations</span>
                                    <div class="flex gap-2">
                                        <Button v-if="storageLocationOptions.length > 0" @click="selectAllStorageLocations" size="small" class="p-button-text p-button-sm" :disabled="form.storageLocation?.length === storageLocationOptions.length">
                                            Select All
                                        </Button>
                                        <Button v-if="form.storageLocation?.length > 0" @click="clearAllStorageLocations" size="small" class="p-button-text p-button-sm"> Clear All </Button>
                                    </div>
                                </div>
                            </template>
                            <template #option="slotProps">
                                <div class="flex items-center">
                                    <span>{{ slotProps.option.label }}</span>
                                </div>
                            </template>
                        </MultiSelect>
                        <small v-if="errors.storageLocation" class="text-red-500 text-sm">{{ errors.storageLocation }}</small>
                    </div>

                    <!-- Status -->
                    <div class="md:col-span-1">
                        <label class="block font-bold text-gray-700 mb-2">Status</label>
                        <Select v-model="form.status" :options="statusOptions" optionLabel="label" optionValue="value" placeholder="Select status" class="w-full" />
                    </div>

                    <!-- Is Manager Selection (only show if department has approval_option = 1) -->
                    <div class="md:col-span-1" v-if="showIsManagerCheckbox">
                        <label class="block font-bold text-gray-700 mb-2">Is Manager</label>
                        <Select v-model="form.isManager" :options="isManagerOptions" optionLabel="label" optionValue="value" placeholder="Select" class="w-full" :disabled="!form.department_id" />
                        <small v-if="errors.isManager" class="text-red-500 text-sm">{{ errors.isManager }}</small>
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
import { ref, reactive, onMounted, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import InputText from 'primevue/inputtext';
import Select from 'primevue/select';
import MultiSelect from 'primevue/multiselect';
import Button from 'primevue/button';
import api from '@/service/api';

const route = useRoute();
const router = useRouter();
const toast = useToast();

const form = ref({
    user_id: null,
    username: '',
    email: '',
    department_id: null,
    storageLocation: [],
    first_name: '',
    last_name: '',
    mobilephone: '',
    user_role_id: null,
    salesOffice: [], // Stores office names like "KL", "KB"
    salesDistrict: [], // Stores district numbers as STRINGS
    isManager: 0, // Initialize as 0 (No)
    status: 1
});

const errors = reactive({});
const loading = ref(true);
const submitting = ref(false);
const loadingRoles = ref(false);
const loadingDropdowns = ref(false);
const selectedDepartment = ref(null);
const dropdownDataReady = ref(false);

const statusOptions = [
    { label: 'Active', value: 1 },
    { label: 'Inactive', value: 0 }
];

const isManagerOptions = [
    { label: 'Yes', value: 1 },
    { label: 'No', value: 0 }
];

// Data from API
const userRoleOptions = ref([]);
const departmentOptions = ref([]);
const salesOfficeOptions = ref([]);
const allDistrictOptions = ref([]); // Store all districts for filtering
const storageLocationOptions = ref([]);

// Computed properties
const showIsManagerCheckbox = computed(() => {
    return selectedDepartment.value?.approval_option === 1;
});

const allDistrictOptionsForSelectedOffices = computed(() => {
    if (!form.value.salesOffice || form.value.salesOffice.length === 0) {
        return [];
    }

    const selectedOfficeNames = form.value.salesOffice;
    return allDistrictOptions.value.filter((district) => selectedOfficeNames.includes(district.office_name));
});

const groupedDistrictOptions = computed(() => {
    if (!form.value.salesOffice || form.value.salesOffice.length === 0) {
        return [];
    }

    const selectedOfficeNames = form.value.salesOffice;
    const groupedOptions = [];

    salesOfficeOptions.value
        .filter((office) => selectedOfficeNames.includes(office.name))
        .forEach((office) => {
            const officeDistricts = allDistrictOptions.value.filter((district) => district.office_name === office.name);

            if (officeDistricts.length > 0) {
                groupedOptions.push({
                    office: office.name,
                    districts: officeDistricts.map((district) => ({
                        district_no: district.district_no.toString(), // Ensure string
                        district_name: district.district_name,
                        label: `${district.district_name} (${district.district_no})`,
                        value: district.district_no.toString() // Ensure string for comparison
                    }))
                });
            }
        });

    return groupedOptions;
});

// Select All / Clear All functions
const selectAllSalesOffices = () => {
    form.value.salesOffice = salesOfficeOptions.value.map((office) => office.name);
};

const clearAllSalesOffices = () => {
    form.value.salesOffice = [];
    form.value.salesDistrict = [];
};

const selectAllSalesDistricts = () => {
    form.value.salesDistrict = allDistrictOptionsForSelectedOffices.value.map((district) => district.district_no.toString());
};

const clearAllSalesDistricts = () => {
    form.value.salesDistrict = [];
};

const selectAllStorageLocations = () => {
    form.value.storageLocation = storageLocationOptions.value.map((location) => location.value);
};

const clearAllStorageLocations = () => {
    form.value.storageLocation = [];
};

// Fetch user roles from API
const fetchUserRoles = async () => {
    try {
        loadingRoles.value = true;
        const response = await api.get('admin/list-user-role');

        if (response.data.status === 1) {
            userRoleOptions.value = response.data.data.map((role) => ({
                label: `${role.name}${role.is_super_admin ? ' (Super Admin)' : ''}${role.is_sales_person ? ' (Sales Person)' : ''}`,
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

// Fetch dropdown selections from API
const fetchDropdownSelections = async () => {
    try {
        loadingDropdowns.value = true;
        const response = await api.get('getDropdownSelection');

        if (response.data.status === 1) {
            const data = response.data.admin_data;

            // Departments
            departmentOptions.value = data.departments || [];

            // Sales Offices
            salesOfficeOptions.value = data.sales_offices || [];

            // Prepare district options with office_name reference
            allDistrictOptions.value = [];
            data.sales_offices?.forEach((office) => {
                office.districts?.forEach((district) => {
                    // Ensure district_no is stored as string for consistent comparison
                    const districtNoStr = district.district_no.toString();
                    allDistrictOptions.value.push({
                        ...district,
                        office_id: office.id,
                        office_name: office.name,
                        district_no: districtNoStr, // Store as string
                        label: `${district.district_name} (${district.district_no})`,
                        value: districtNoStr // Store as string
                    });
                });
            });

            // Storage Locations
            storageLocationOptions.value = (data.storage_location || []).map((location) => ({
                label: location,
                value: location
            }));

            dropdownDataReady.value = true;
            console.log('Dropdown data loaded:', {
                salesOffices: salesOfficeOptions.value.length,
                districts: allDistrictOptions.value.length,
                storageLocations: storageLocationOptions.value.length
            });
        } else {
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to load dropdown options',
                life: 4000
            });
        }
    } catch (error) {
        console.error('Error fetching dropdown selections:', error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load dropdown options',
            life: 4000
        });
    } finally {
        loadingDropdowns.value = false;
    }
};

// Handle department change
const handleDepartmentChange = () => {
    selectedDepartment.value = departmentOptions.value.find((dept) => dept.id === form.value.department_id);

    if (selectedDepartment.value?.approval_option !== 1) {
        form.value.isManager = 0;
    }
};

// Handle sales office change
const handleSalesOfficeChange = () => {
    // Don't clear districts if we're loading data
    if (!loading.value) {
        form.value.salesDistrict = [];
    }
};

// Fetch user data by ID
const fetchUserData = async () => {
    try {
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

        // Use the dedicated user detail endpoint
        const response = await api.get(`admin/user-detail/${userId}`);

        if (response.data.status === 1) {
            const user = response.data.admin_data;

            if (user) {
                // Wait for dropdown data to be ready before processing
                if (!dropdownDataReady.value) {
                    // If dropdown data isn't ready yet, wait a bit and try again
                    setTimeout(() => {
                        fetchUserData();
                    }, 100);
                    return;
                }

                console.log('User data from API:', user);

                // Process multi-select data
                const processMultiSelectData = () => {
                    // Sales Office: Convert comma-separated string to array
                    let salesOfficeArray = [];
                    if (user.salesOffice && user.salesOffice.trim()) {
                        salesOfficeArray = user.salesOffice.split(',').map(item => item.trim());
                        // Filter to only include offices that exist in the dropdown options
                        salesOfficeArray = salesOfficeArray.filter(officeName => 
                            salesOfficeOptions.value.some(office => office.name === officeName)
                        );
                        console.log('Processed sales offices:', salesOfficeArray);
                    }

                    // Sales District: Convert comma-separated string to array of district numbers AS STRINGS
                    let salesDistrictArray = [];
                    if (user.salesDistrict && user.salesDistrict.trim()) {
                        salesDistrictArray = user.salesDistrict.split(',').map(item => item.trim());
                        
                        // Convert all to strings for consistent comparison
                        salesDistrictArray = salesDistrictArray.map(district => district.toString());
                        
                        // Filter to only include districts that exist in the dropdown options
                        salesDistrictArray = salesDistrictArray.filter(districtNo => {
                            const exists = allDistrictOptions.value.some(district => 
                                district.district_no.toString() === districtNo.toString()
                            );
                            if (!exists) {
                                console.log('District not found in dropdown:', districtNo);
                            }
                            return exists;
                        });
                        console.log('Processed sales districts:', salesDistrictArray);
                    }

                    // Storage Location: Convert comma-separated string to array
                    let storageLocationArray = [];
                    if (user.storageLocation && user.storageLocation.trim()) {
                        storageLocationArray = user.storageLocation.split(',').map(item => item.trim());
                        // Filter to only include locations that exist in the dropdown options
                        storageLocationArray = storageLocationArray.filter(location => 
                            storageLocationOptions.value.some(option => option.value === location)
                        );
                        console.log('Processed storage locations:', storageLocationArray);
                    }

                    return { salesOfficeArray, salesDistrictArray, storageLocationArray };
                };

                const { salesOfficeArray, salesDistrictArray, storageLocationArray } = processMultiSelectData();

                // Update form data
                form.value = {
                    user_id: user.id,
                    username: user.username || '',
                    email: user.email || '',
                    first_name: user.first_name || '',
                    last_name: user.last_name || '',
                    mobilephone: user.mobilephone || '',
                    user_role_id: user.user_role_id || null,
                    department_id: user.department_id || null,
                    salesOffice: salesOfficeArray,
                    salesDistrict: salesDistrictArray, // Now as strings
                    storageLocation: storageLocationArray,
                    isManager: user.isManager || 0,
                    status: user.status || 1
                };

                // Update selected department for isManager checkbox
                if (form.value.department_id) {
                    selectedDepartment.value = departmentOptions.value.find((dept) => dept.id === form.value.department_id);
                }

                console.log('Final form data loaded:', {
                    username: user.username,
                    salesOffice: form.value.salesOffice,
                    salesDistrict: form.value.salesDistrict,
                    storageLocation: form.value.storageLocation,
                    department_id: user.department_id,
                    isManager: user.isManager
                });

                // Debug: Check if districts are properly matched
                if (salesDistrictArray.length > 0) {
                    console.log('Checking district matching:');
                    salesDistrictArray.forEach(districtNo => {
                        const found = allDistrictOptions.value.find(d => 
                            d.district_no.toString() === districtNo.toString()
                        );
                        console.log(`District ${districtNo}:`, found ? 'Found ✓' : 'Not found ✗');
                    });
                }
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

// Watch for dropdown data to be ready, then fetch user data
watch(dropdownDataReady, (newVal) => {
    if (newVal && loading.value) {
        fetchUserData();
    }
});

// Validation function
const validateForm = () => {
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

    // Department validation
    if (!form.value.department_id) {
        errors.department_id = 'Department is required';
        isValid = false;
    }

    // First name validation
    if (form.value.first_name && form.value.first_name.length > 100) {
        errors.first_name = 'First name must not exceed 100 characters';
        isValid = false;
    }

    // Last name validation
    if (form.value.last_name && form.value.last_name.length > 100) {
        errors.last_name = 'Last name must not exceed 100 characters';
        isValid = false;
    }

    // Mobile phone validation
    if (form.value.mobilephone && form.value.mobilephone.length > 30) {
        errors.mobilephone = 'Mobile phone must not exceed 30 characters';
        isValid = false;
    }

    // User role validation
    if (!form.value.user_role_id) {
        errors.user_role_id = 'User role is required';
        isValid = false;
    }

    // Sales Office validation
    if (form.value.salesOffice && Array.isArray(form.value.salesOffice) && form.value.salesOffice.length > 0) {
        const salesOfficeStr = form.value.salesOffice.join(',');
        if (salesOfficeStr.length > 300) {
            errors.salesOffice = 'Sales office selection exceeds maximum length';
            isValid = false;
        }
    }

    // Sales District validation
    if (form.value.salesDistrict && Array.isArray(form.value.salesDistrict) && form.value.salesDistrict.length > 0) {
        const salesDistrictStr = form.value.salesDistrict.join(',');
        if (salesDistrictStr.length > 300) {
            errors.salesDistrict = 'Sales district selection exceeds maximum length';
            isValid = false;
        }
    }

    // Storage Location validation
    if (form.value.storageLocation && Array.isArray(form.value.storageLocation) && form.value.storageLocation.length > 0) {
        const storageLocationStr = form.value.storageLocation.join(',');
        if (storageLocationStr.length > 1000) {
            errors.storageLocation = 'Storage location selection exceeds maximum length';
            isValid = false;
        }
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
            department_id: form.value.department_id,
            isManager: form.value.isManager,
            status: form.value.status || 1,
            salesOffice: form.value.salesOffice && form.value.salesOffice.length > 0 ? form.value.salesOffice.join(',') : null,
            salesDistrict: form.value.salesDistrict && form.value.salesDistrict.length > 0 ? form.value.salesDistrict.join(',') : null,
            storageLocation: form.value.storageLocation && form.value.storageLocation.length > 0 ? form.value.storageLocation.join(',') : null
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
            const errorDetail = response.data.error?.message || response.data.message || 'Failed to update user';
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: errorDetail,
                life: 5000
            });

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
    // First fetch dropdown data, then user data will be fetched automatically via watch
    await fetchUserRoles();
    await fetchDropdownSelections();
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

/* Style for disabled multiselect */
:deep(.p-multiselect.p-disabled) {
    opacity: 0.6;
    cursor: not-allowed;
}

/* Custom styling for multiselect components */
:deep(.multiselect-custom .p-multiselect-panel) {
    max-height: 300px;
}

:deep(.multiselect-custom .p-multiselect-header) {
    padding: 0.75rem;
    border-bottom: 1px solid #e5e7eb;
}

:deep(.multiselect-custom .p-multiselect-items-wrapper) {
    max-height: 250px;
}

:deep(.multiselect-custom .p-multiselect-item) {
    padding: 0.5rem 1rem;
}

:deep(.multiselect-custom .p-checkbox-box) {
    border-radius: 4px;
}

/* Better chip styling */
:deep(.multiselect-custom .p-multiselect-token) {
    background: #3b82f6;
    color: white;
    border-radius: 16px;
    padding: 0.25rem 0.75rem;
    margin: 0.125rem;
}

:deep(.multiselect-custom .p-multiselect-token .p-multiselect-token-icon) {
    margin-left: 0.5rem;
    color: white;
}

/* Group header styling */
:deep(.multiselect-custom .p-multiselect-item-group) {
    background-color: #f9fafb;
    font-weight: 600;
    color: #374151;
    padding: 0.5rem 1rem;
    border-bottom: 1px solid #e5e7eb;
}

/* Improve filter input */
:deep(.multiselect-custom .p-multiselect-filter-container) {
    padding: 0.75rem;
}

:deep(.multiselect-custom .p-multiselect-filter-container .p-inputtext) {
    width: 100%;
    padding: 0.5rem 0.75rem;
    border-radius: 6px;
    border: 1px solid #d1d5db;
}

/* Custom header buttons */
:deep(.multiselect-custom .p-multiselect-header .p-button) {
    padding: 0.25rem 0.5rem;
    font-size: 0.75rem;
}

:deep(.multiselect-custom .p-multiselect-header .p-button:not(:disabled):hover) {
    background-color: #f3f4f6;
}
</style>