<template>
    <Fluid>
        <div class="flex flex-col md:flex-row gap-8">
            <div class="card flex flex-col gap-6 w-full">
                <!-- Header -->
                <div class="text-2xl font-bold text-gray-800 border-b pb-2">Create Logistic</div>
                <!-- Contact Details -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="block font-bold text-gray-700 mb-2">Username</label>
                        <InputText v-model="form.username" type="text" placeholder="Enter Username" class="w-full" />
                    </div>
                    <div>
                        <label class="block font-bold text-gray-700 mb-2">Email Address</label>
                        <InputText v-model="form.emailaddress" type="email" placeholder="Enter email Address" class="w-full" />
                    </div>
                    <div>
                        <label class="block font-bold text-gray-700 mb-2">Contact No</label>
                        <InputText v-model="form.phoneno" type="text" placeholder="Enter Contact No" class="w-full" @keypress="allowOnlyNumbers"/>
                    </div>
                </div>
                <!-- Logistic Form -->
                <div class="grid grid-cols-1 gap-6">
                    <!-- Company Details -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block font-bold text-gray-700 mb-2">Company Name</label>
                            <InputText v-model="form.companyname" type="text" placeholder="Enter Company Name" class="w-full" />
                        </div>
                        <div>
                            <label class="block font-bold text-gray-700 mb-2">Contact Person</label>
                            <InputText v-model="form.contactperson" type="text" placeholder="Enter Contact Name" class="w-full" />
                        </div>
                        <div>
                            <label class="block font-bold text-gray-700 mb-2">Contact No</label>
                            <InputText v-model="form.mobileno" type="text" placeholder="Enter Contact No" class="w-full" @keypress="allowOnlyNumbers"/>
                        </div>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block font-bold text-gray-700 mb-2">Address Line 1</label>
                            <InputText v-model="form.addressline1" type="text" placeholder="Enter Address Line 1" class="w-full" />
                        </div>
                        <div>
                            <label class="block font-bold text-gray-700 mb-2">Address Line 2</label>
                            <InputText v-model="form.addressline2" type="text" placeholder="Enter Address Line 2" class="w-full" />
                        </div>
                        <div>
                            <label class="block font-bold text-gray-700 mb-2">City</label>
                            <InputText v-model="form.city" type="text" placeholder="Enter City" class="w-full" />
                        </div>
                        <div>
                            <label class="block font-bold text-gray-700 mb-2">State</label>
                            <Dropdown v-model="form.state" :options="states" placeholder="Select State" class="w-full" />
                        </div>
                        <div>
                            <label class="block font-bold text-gray-700 mb-2">Postcode</label>
                            <InputText v-model="form.postcode" type="text" placeholder="Enter Postcode" class="w-full" />
                        </div>
                    </div>


                    <!-- Storage Location Selection -->
                    <div class="flex justify-between items-center border-b pb-2 mt-4">
                        <div class="text-xl font-bold text-gray-800">🏢 Storage Location</div>
                    </div>
                    <div>
                        <div class="flex items-center justify-between mb-2">
                            <label class="block font-bold text-gray-700">Storage Locations</label>
                            <span class="text-sm text-gray-500">{{ form.storage_list.length }} locations selected</span>
                        </div>

                        <MultiSelect
                            v-model="form.storage_list"
                            :options="storageLocations"
                            optionLabel="code"
                            optionValue="code" 
                            filter
                            display="chip"
                            placeholder="Select Storage Locations"
                            class="w-full"
                            :maxSelectedLabels="3"
                        >
                            <template #option="slotProps">
                                <div class="flex items-center">
                                    <i class="pi pi-warehouse mr-2 text-blue-500" />
                                    <span class="font-semibold">{{ slotProps.option.code }}</span>
                                </div>
                            </template>
                            <template #value="slotProps">
                                <div v-if="slotProps.value" class="inline-flex items-center">
                                    <i class="pi pi-warehouse mr-1 text-sm" />
                                    <span>{{ slotProps.value.length }} locations selected</span>
                                </div>
                                <span v-else>{{ slotProps.placeholder }}</span>
                            </template>
                        </MultiSelect>
                    </div>

                </div>

                <!-- Action Buttons -->
                <div class="flex justify-end gap-4 mt-8">
                    <div class="w-32">
                        <Button label="Cancel" class="w-full p-button-outlined p-button-secondary" @click="handleCancel" />
                    </div>
                    <div class="w-32">
                        <Button label="Create" class="w-full"  @click="submitForm" />
                    </div>
                </div>
            </div>
        </div>
    </Fluid>
    <Dialog
        v-model:visible="passwordDialogVisible"
        modal
        header="3PL Account Created"
        :closable="false"
        style="width: 400px">
        <div class="text-center">
            <p class="text-gray-700 mb-4">
                Temporary Password :
            </p>
            <div class="font-mono text-lg font-bold bg-gray-100 p-3 rounded-md mb-4">
                {{ generatedPassword }}
            </div>
            <Button 
                label="OK" 
                icon="pi pi-check" 
                class="w-full" 
                @click="handleDialogClose()" 
            />
        </div>
    </Dialog>
</template>

<script setup>
import { reactive, ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import MultiSelect from 'primevue/multiselect';
import Dropdown from 'primevue/dropdown';
import { useToast } from 'primevue/usetoast';
import api from '@/service/api';

const passwordDialogVisible = ref(false);
const generatedPassword = ref('');
const toast = useToast();
const router = useRouter();
const loading = ref(true);

// reactive form data
const form = reactive({
    username: '',
    companyname: '',
    addressline1: '',
    addressline2: '',
    city: '',
    state: '',
    postcode: '',
    emailaddress: '',
    phoneno: '',
    contactperson: '',
    mobileno: '',
    storage_list: []
});

const allowOnlyNumbers = (event) => {
  // Allow only digits (0-9)
  const char = String.fromCharCode(event.charCode);
  if (!/[0-9]/.test(char)) {
    event.preventDefault();
  }
};

// Storage locations data - TMJB, TMSA, RETP, RER, TMSB, TMSK
const storageLocations = ref([
    {
        code: 'TMJB',
        name: 'Toyo Malaysia Johor Bahru',
        description: 'Main storage facility in Johor Bahru'
    },
    {
        code: 'TMSA',
        name: 'Toyo Malaysia Shah Alam',
        description: 'Central warehouse in Shah Alam'
    },
    {
        code: 'RETP',
        name: 'Regional East Processing Terminal',
        description: 'East coast regional processing center'
    },
    {
        code: 'RER',
        name: 'Regional East Repository',
        description: 'East coast regional storage repository'
    },
    {
        code: 'TMSB',
        name: 'Toyo Malaysia Sabah',
        description: 'Borneo region storage facility'
    },
    {
        code: 'TMSK',
        name: 'Toyo Malaysia Sarawak',
        description: 'Sarawak regional warehouse'
    }
]);

// list of states
const states = ['Johor', 'Kedah', 'Kelantan', 'Melaka', 'Negeri Sembilan', 'Pahang', 'Penang', 'Perak', 'Perlis', 'Sabah', 'Sarawak', 'Selangor', 'Terengganu', 'Kuala Lumpur', 'Putrajaya', 'Labuan'];


// form validation
const isFormValid = computed(() => {
    return (
        form.username.trim() !== '' &&
        form.companyname.trim() !== '' &&
        form.addressline1.trim() !== '' &&
        form.addressline2.trim() !== '' &&
        form.city.trim() !== '' &&
        form.state.trim() !== '' &&
        form.postcode.trim() !== '' &&
        form.emailaddress.trim() !== '' &&
        form.phoneno.trim() !== '' &&
        form.contactperson.trim() !== '' &&
        form.mobileno.trim() !== '' &&
        form.storage_list && form.storage_list.length > 0
    );
});

const handleCancel = () => {
    if (form.companyname || form.contactperson || form.storage_list.value.length > 0) {
        if (confirm('You have unsaved changes. Are you sure you want to cancel?')) {
            router.back();
        }
    } else {
        router.back();
    }
};
const handleDialogClose = () => {
    passwordDialogVisible.value = false;
    router.push('/scm/listLogistic');
};

const submitForm  = async () => {
    // console.log((form));
    if (!isFormValid.value) {
        alert('Please fill in all required fields.');
        return;
    }
    const formData = new FormData();
    formData.append('username', form.username);
    formData.append('companyname', form.companyname);
    formData.append('addressline1', form.addressline1);
    formData.append('addressline2', form.addressline2);
    formData.append('city', form.city);
    formData.append('state', form.state);
    formData.append('postcode', form.postcode);
    formData.append('emailaddress', form.emailaddress);
    formData.append('phoneno', form.phoneno);
    formData.append('contactperson', form.contactperson);
    formData.append('mobileno', form.mobileno);
    formData.append('storage_list', JSON.stringify(form.storage_list));

    try {
        loading.value = true;
        const response = await api.postExtra('create3pl', formData, {
            // headers: { 'Content-Type': 'multipart/form-data' }
        });
        if (response.data.status === 1) {
            toast.add({ severity: 'success', summary: 'Success', detail: 'New 3PL created', life: 3000 });
            // ✅ Capture password from response
            generatedPassword.value = response.data.admin_data["3pl_password"] || 'N/A';

            // ✅ Show dialog
            passwordDialogVisible.value = true;
        } else {
            toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to create 3PL', life: 3000 });
        }
        console.log(response);
    } catch (error) {
            console.error('Error submitting form:', error);
            toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to create 3PL', life: 3000 });
    } finally {
        loading.value = false;
        Object.assign(form, {
            username: '',
            companyname: '',
            addressline1: '',
            addressline2: '',
            city: '',
            state: '',
            postcode: '',
            emailaddress: '',
            phoneno: '',
            contactperson: '',
            mobileno: '',
            storage_list: []
        });
    }

};
</script>

<style scoped>
:deep(.p-multiselect) {
    width: 100%;
}

:deep(.p-dropdown) {
    width: 100%;
}
</style>