<template>
    <Fluid>
        <Toast />
        <!-- Edit User Section -->
        <div class="flex flex-col md:flex-row gap-8">
            <div class="card flex flex-col gap-6 w-full">
                <!-- Header -->
                <div class="flex items-center justify-between border-b pb-2">
                    <div class="flex items-center gap-3">
                    <Button icon="pi pi-arrow-left" class="p-button-text p-button-secondary" @click="$router.back()" />
                    <div class="text-2xl font-bold text-gray-800 border-b pb-2">Edit Member</div>
                    </div>
                </div>

                <!-- Loading State -->
                <LoadingPage v-if="loading" :message="'Loading User Details...'" :sub-message="'Fetching member data'" />

                <!-- User Form -->
                <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="md:col-span-2">
                        <label class="block font-bold text-gray-700">Member Code</label>
                        <InputText disabled v-model="memberDetail.memberCode" class="w-full" />
                    </div>

                    <div>
                        <label class="block font-bold text-gray-700">First Name <span class="text-red-500">*</span></label>
                        <InputText v-model="memberDetail.firstName" class="w-full" :class="{ 'p-invalid': errors.first_name }" />
                        <small v-if="errors.first_name" class="p-error">{{ errors.first_name[0] }}</small>
                    </div>

                    <div>
                        <label class="block font-bold text-gray-700">Last Name <span class="text-red-500">*</span></label>
                        <InputText v-model="memberDetail.lastName" class="w-full" :class="{ 'p-invalid': errors.last_name }" />
                        <small v-if="errors.last_name" class="p-error">{{ errors.last_name[0] }}</small>
                    </div>

                    <div>
                        <label class="block font-bold text-gray-700">Country Code <span class="text-red-500">*</span></label>
                        <Dropdown 
                            v-model="memberDetail.countryCode" 
                            :options="codeOptions" 
                            optionLabel="label" 
                            optionValue="value" 
                            class="w-full" 
                            :class="{ 'p-invalid': errors.country_code }"
                            placeholder="Select Country Code"
                        />
                        <small v-if="errors.country_code" class="p-error">{{ errors.country_code[0] }}</small>
                    </div>

                    <div>
                        <label class="block font-bold text-gray-700">Mobile Number <span class="text-red-500">*</span></label>
                        <InputText v-model="memberDetail.mobileNumber" class="w-full" :class="{ 'p-invalid': errors.mobile_number }" />
                        <small v-if="errors.mobile_number" class="p-error">{{ errors.mobile_number[0] }}</small>
                    </div>

                    <div>
                        <label class="block font-bold text-gray-700">Email <span class="text-red-500">*</span></label>
                        <InputText v-model="memberDetail.emailAddress" class="w-full" :class="{ 'p-invalid': errors.email }" />
                        <small v-if="errors.email" class="p-error">{{ errors.email[0] }}</small>
                    </div>

                    <div>
                        <label class="block font-bold text-gray-700">Date of Birth <span class="text-red-500">*</span></label>
                        <Calendar v-model="memberDetail.dob" dateFormat="dd-mm-yy" class="w-full" :class="{ 'p-invalid': errors.date_of_birth }" />
                        <small v-if="errors.date_of_birth" class="p-error">{{ errors.date_of_birth[0] }}</small>
                    </div>

                    <div>
                        <label class="block font-bold text-gray-700">Gender <span class="text-red-500">*</span></label>
                        <Dropdown 
                            v-model="memberDetail.gender" 
                            :options="genderOptions" 
                            optionLabel="label" 
                            optionValue="value" 
                            class="w-full" 
                            :class="{ 'p-invalid': errors.gender }"
                            placeholder="Select Gender"
                        />
                        <small v-if="errors.gender" class="p-error">{{ errors.gender[0] }}</small>
                    </div>

                    <div>
                        <label class="block font-bold text-gray-700">Race <span class="text-red-500">*</span></label>
                        <Dropdown 
                            v-model="memberDetail.race" 
                            :options="raceOptions" 
                            optionLabel="label" 
                            optionValue="value" 
                            class="w-full" 
                            :class="{ 'p-invalid': errors.race }"
                            placeholder="Select Race"
                        />
                        <small v-if="errors.race" class="p-error">{{ errors.race[0] }}</small>
                    </div>

                    <div>
                        <label class="block font-bold text-gray-700">City <span class="text-red-500">*</span></label>
                        <InputText v-model="memberDetail.city" class="w-full" :class="{ 'p-invalid': errors.city }" />
                        <small v-if="errors.city" class="p-error">{{ errors.city[0] }}</small>
                    </div>

                    <div>
                        <label class="block font-bold text-gray-700">State <span class="text-red-500">*</span></label>
                        <Dropdown 
                            v-model="memberDetail.state" 
                            :options="stateOptions" 
                            optionLabel="label" 
                            optionValue="value" 
                            class="w-full" 
                            :class="{ 'p-invalid': errors.state }"
                            placeholder="Select State"
                        />
                        <small v-if="errors.state" class="p-error">{{ errors.state[0] }}</small>
                    </div>

                    <div>
                        <label class="block font-bold text-gray-700">Postal Code <span class="text-red-500">*</span></label>
                        <InputText v-model="memberDetail.postcode" class="w-full" :class="{ 'p-invalid': errors.postal_code }" />
                        <small v-if="errors.postal_code" class="p-error">{{ errors.postal_code[0] }}</small>
                    </div>

                    <div>
                        <label class="block font-bold text-gray-700">Country <span class="text-red-500">*</span></label>
                        <InputText v-model="memberDetail.country" class="w-full" :class="{ 'p-invalid': errors.country }" />
                        <small v-if="errors.country" class="p-error">{{ errors.country[0] }}</small>
                    </div>

                    <!-- <div>
                        <label class="block font-bold text-gray-700">Member Level <span class="text-red-500">*</span></label>
                        <Dropdown 
                            v-model="memberDetail.memberLevel" 
                            :options="levelOptions" 
                            optionLabel="label" 
                            optionValue="value" 
                            class="w-full" 
                            :class="{ 'p-invalid': errors.member_level }"
                            placeholder="Select Member Level"
                        />
                        <small v-if="errors.member_level" class="p-error">{{ errors.member_level[0] }}</small>
                    </div> -->

                    <div>
                        <label class="block font-bold text-gray-700 mb-1">Password</label>
                        <div class="relative w-full">
                            <InputText 
                                :type="showPassword ? 'text' : 'password'" 
                                v-model="memberDetail.password" 
                                class="w-full pr-10" 
                                placeholder="Enter new password"
                            />
                            <button type="button" @click="showPassword = !showPassword" class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700">
                                <i v-if="showPassword" class="pi pi-eye-slash"></i>
                                <i v-else class="pi pi-eye"></i>
                            </button>
                        </div>
                        <small class="text-gray-500 text-xs mt-1">Leave blank to keep current password</small>
                    </div>

                    <!-- Action Buttons -->
                    <div class="md:col-span-2 flex justify-end gap-3 mt-4">
                        <Button label="Cancel" severity="secondary" @click="$router.back()" />
                        <Button label="Update" :loading="submitting" @click="updateUser" />
                    </div>
                </div>
            </div>
        </div>
    </Fluid>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import api from '@/service/api';
import LoadingPage from '@/components/LoadingPage.vue';

const route = useRoute();
const router = useRouter();
const toast = useToast();
const memberId = ref(route.params.id);
const loading = ref(true);
const submitting = ref(false);
const showPassword = ref(false);
const errors = ref({});

// Options for dropdowns
const raceOptions = [
    { label: 'Malay', value: 'Malay' },
    { label: 'Chinese', value: 'Chinese' },
    { label: 'Indian', value: 'Indian' },
    { label: 'Other', value: 'Other' }
];

const stateOptions = [
    { label: 'Johor', value: 'Johor' },
    { label: 'Kelantan', value: 'Kelantan' },
    { label: 'Kuala Lumpur', value: 'Kuala Lumpur' },
    { label: 'Kedah', value: 'Kedah' },
    { label: 'Melaka', value: 'Melaka' },
    { label: 'Negeri Sembilan', value: 'Negeri Sembilan' },
    { label: 'Pulau Pinang', value: 'Pulau Pinang' },
    { label: 'Pahang', value: 'Pahang' },
    { label: 'Perak', value: 'Perak' },
    { label: 'Perlis', value: 'Perlis' },
    { label: 'Selangor', value: 'Selangor' },
    { label: 'Sabah', value: 'Sabah' },
    { label: 'Sarawak', value: 'Sarawak' },
    { label: 'Terengganu', value: 'Terengganu' }
];

const levelOptions = [
    { label: 'Silver', value: 'Silver' },
    { label: 'Gold', value: 'Gold' },
    { label: 'Platinum', value: 'Platinum' }
];

const genderOptions = [
    { label: 'Male', value: 'Male' },
    { label: 'Female', value: 'Female' }
];

const codeOptions = [
    { label: '+60', value: '+60' },
    { label: '+65', value: '+65' }
];

// Member detail data - using same structure as detail component
const memberDetail = ref({
    id: null,
    memberCode: '',
    memberLevel: '',
    firstName: '',
    lastName: '',
    countryCode: '',
    mobileNumber: '',
    emailAddress: '',
    gender: '',
    dob: null,
    race: '',
    city: '',
    state: '',
    postcode: '',
    country: '',
    password: ''
});

// Fetch member details from API
const fetchMemberDetail = async () => {
    try {
        loading.value = true;

        const response = await api.get(`cares/user/${memberId.value}`);

        if (response.data.status === 1 && response.data.admin_data) {
            const userData = response.data.admin_data;

            // Map API response to form structure - using same field names as detail component
            memberDetail.value = {
                id: userData.id,
                memberCode: userData.memberCode || '-',
                memberLevel: userData.memberLevel || '',
                firstName: userData.firstName || '',
                lastName: userData.lastName || '',
                countryCode: userData.countryCode || '+60',
                mobileNumber: userData.mobileNumber || userData.mobile_number || '',
                emailAddress: userData.emailAddress || '',
                gender: userData.gender || '',
                race: userData.race || '',
                city: userData.city || '',
                state: userData.state || '',
                postcode: userData.postcode || '',
                country: userData.country || 'Malaysia',
                dob: userData.dob ? parseDateString(userData.dob) : null,
                password: '' // Don't prefill password for security
            };

        } else {
            showToast('error', 'Error', 'Failed to load user details');
        }
    } catch (error) {
        console.error('Error fetching member details:', error);
        showToast('error', 'Error', 'Failed to load user details');
    } finally {
        loading.value = false;
    }
};

// Helper function to parse date string to Date object
const parseDateString = (dateString) => {
    if (!dateString || dateString === '-') return null;
    
    // Try different date formats
    const date = new Date(dateString);
    if (!isNaN(date.getTime())) {
        return date;
    }
    
    // If the above fails, try parsing common formats
    const parts = dateString.split(/[-/ ]/);
    if (parts.length >= 3) {
        // Try YYYY-MM-DD format
        const ymd = new Date(parts[0], parts[1] - 1, parts[2]);
        if (!isNaN(ymd.getTime())) return ymd;
        
        // Try DD-MM-YYYY format
        const dmy = new Date(parts[2], parts[1] - 1, parts[0]);
        if (!isNaN(dmy.getTime())) return dmy;
    }
    
    return null;
};

// Update user using FormData with append
const updateUser = async () => {
    try {
        submitting.value = true;
        errors.value = {};

        // Create FormData object
        const formData = new FormData();
        
        // Append all required fields using append()
        formData.append('first_name', memberDetail.value.firstName);
        formData.append('last_name', memberDetail.value.lastName);
        formData.append('email', memberDetail.value.emailAddress);
        formData.append('country_code', memberDetail.value.countryCode);
        formData.append('mobile_number', memberDetail.value.mobileNumber);
        formData.append('gender', memberDetail.value.gender);
        formData.append('race', memberDetail.value.race);
        formData.append('city', memberDetail.value.city);
        formData.append('state', memberDetail.value.state);
        formData.append('postal_code', memberDetail.value.postcode);
        formData.append('country', memberDetail.value.country);
        formData.append('member_level', memberDetail.value.memberLevel);

        // Format date for API (dd-mm-yyyy)
        if (memberDetail.value.dob) {
            const dob = new Date(memberDetail.value.dob);
            const formattedDob = `${dob.getDate().toString().padStart(2, '0')}-${(dob.getMonth() + 1).toString().padStart(2, '0')}-${dob.getFullYear()}`;
            formData.append('date_of_birth', formattedDob);
        }

        // Only append password if it's not empty
        if (memberDetail.value.password) {
            formData.append('password', memberDetail.value.password);
        }


        const response = await api.post(`cares/edit/${memberId.value}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });


        if (response.data.status === 1) {
            showToast('success', 'Success', 'User updated successfully');
            // Redirect back to user detail page after successful update
            setTimeout(() => {
                router.push(`/marketing/detailEtenUser/${memberId.value}`);
            }, 1500);
        } else {
            if (response.data.error) {
                errors.value = response.data.error;
                showToast('error', 'Validation Error', 'Please check the form fields');
            } else {
                showToast('error', 'Error', 'Failed to update user');
            }
        }
    } catch (error) {
        console.error('Error updating user:', error);
        if (error.response?.data?.error) {
            errors.value = error.response.data.error;
            showToast('error', 'Validation Error', 'Please check the form fields');
        } else {
            showToast('error', 'Error', 'Failed to update user');
        }
    } finally {
        submitting.value = false;
    }
};

// Show toast notification
const showToast = (severity, summary, detail) => {
    toast.add({
        severity: severity,
        summary: summary,
        detail: detail,
        life: 5000
    });
};

// Fetch member details when component mounts
onMounted(() => {
    fetchMemberDetail();
});
</script>

<style scoped>
.card {
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
}

:deep(.p-calendar) {
    width: 100%;
}

.text-red-500 {
    color: #ef4444;
}
</style>