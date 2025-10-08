<template>
    <Fluid>
        <div class="flex flex-col md:flex-row gap-8">
            <div class="card flex flex-col gap-6 w-full">
                <!-- Header -->
                <div class="text-2xl font-bold text-gray-800 border-b pb-2">Create Logistic</div>

                <!-- Logistic Form -->
                <div class="grid grid-cols-1 gap-6">
                    <!-- Company Details -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block font-bold text-gray-700 mb-2">Company Name</label>
                            <InputText v-model="form.companyName" type="text" placeholder="Enter Company Name" class="w-full" />
                        </div>
                        <div>
                            <label class="block font-bold text-gray-700 mb-2">Order No</label>
                            <InputText v-model="form.orderNo" type="text" placeholder="Enter Order Number" class="w-full" />
                        </div>
                    </div>

                    <!-- Address Details -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block font-bold text-gray-700 mb-2">Address</label>
                            <InputText v-model="form.address" type="text" placeholder="Enter Address" class="w-full" />
                        </div>
                        <div>
                            <label class="block font-bold text-gray-700 mb-2">City</label>
                            <InputText v-model="form.city" type="text" placeholder="Enter City" class="w-full" />
                        </div>
                    </div>

                    <!-- Location Details -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block font-bold text-gray-700 mb-2">State</label>
                            <Dropdown 
                                v-model="form.state" 
                                :options="states" 
                                placeholder="Select State" 
                                class="w-full" 
                            />
                        </div>
                        <div>
                            <label class="block font-bold text-gray-700 mb-2">Postcode</label>
                            <InputText v-model="form.postcode" type="text" placeholder="Enter Postcode" class="w-full" />
                        </div>
                    </div>

                    <!-- Contact Details -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block font-bold text-gray-700 mb-2">Contact Person</label>
                            <InputText v-model="form.contactPerson" type="text" placeholder="Enter Contact Person" class="w-full" />
                        </div>
                        <div>
                            <label class="block font-bold text-gray-700 mb-2">Contact No</label>
                            <InputText v-model="form.contactNo" type="text" placeholder="Enter Contact Number" class="w-full" />
                        </div>
                    </div>

                    <!-- Additional Details -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block font-bold text-gray-700 mb-2">Email</label>
                            <InputText v-model="form.email" type="email" placeholder="Enter Email" class="w-full" />
                        </div>
                        <div>
                            <label class="block font-bold text-gray-700 mb-2">Status</label>
                            <Dropdown 
                                v-model="form.status" 
                                :options="statusOptions" 
                                optionLabel="label"
                                optionValue="value"
                                placeholder="Select Status" 
                                class="w-full" 
                            />
                        </div>
                    </div>

                    <!-- Shipping Point Section -->
                    <div class="flex justify-between items-center border-b pb-2 mt-4">
                        <div class="text-xl font-bold text-gray-800">🚚 Shipping Point</div>
                    </div>
                    
                    <div>
                        <div class="flex items-center justify-between mb-2">
                            <label class="block font-bold text-gray-700">Dealer List</label>
                            <span class="text-sm text-gray-500">{{ selectedDealers.length }} dealers selected</span>
                        </div>
                        
                        <MultiSelect 
                            v-model="selectedDealers" 
                            :options="groupedDealers" 
                            optionLabel="label" 
                            filter 
                            optionGroupLabel="label" 
                            optionGroupChildren="items" 
                            display="chip" 
                            placeholder="Select Dealers" 
                            class="w-full"
                            :maxSelectedLabels="3"
                        >
                            <template #optiongroup="slotProps">
                                <div class="flex items-center">
                                    <i class="pi pi-map-marker mr-2 text-blue-500" />
                                    <div class="font-semibold">{{ slotProps.option.label }}</div>
                                    <span class="ml-2 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                        {{ slotProps.option.items.length }} dealers
                                    </span>
                                </div>
                            </template>
                            <template #value="slotProps">
                                <div v-if="slotProps.value" class="inline-flex items-center">
                                    <i class="pi pi-building mr-1 text-sm" />
                                    <span>{{ slotProps.value.length }} dealers selected</span>
                                </div>
                            </template>
                        </MultiSelect>
                    </div>

                    <!-- Selected Dealers Preview -->
                    <div v-if="selectedDealers.length > 0" class="border rounded-lg p-4 bg-gray-50">
                        <label class="block font-bold text-gray-700 mb-3">Selected Dealers Preview</label>
                        <DataTable 
                            :value="selectedDealers" 
                            :paginator="true" 
                            :rows="5" 
                            :rowsPerPageOptions="[3, 5, 7, 10]"
                            dataKey="custAccountNo" 
                            :rowHover="true"
                            responsiveLayout="scroll"
                        >
                            <Column header="Dealer Name" style="min-width: 12rem">
                                <template #body="{ data }">
                                    <div class="font-semibold text-gray-800">
                                        {{ data.companyName1 }}
                                    </div>
                                </template>
                            </Column>

                            <Column header="Email" style="min-width: 12rem">
                                <template #body="{ data }">
                                    <div class="text-blue-600">
                                        {{ data.emailAddress }}
                                    </div>
                                </template>
                            </Column>

                            <Column header="Phone" style="min-width: 10rem">
                                <template #body="{ data }">
                                    <div class="text-gray-700">
                                        {{ data.phoneNumber }}
                                    </div>
                                </template>
                            </Column>

                            <Column header="Status" style="min-width: 6rem">
                                <template #body="{ data }">
                                    <Tag 
                                        :value="data.status === 1 ? 'Active' : 'Inactive'" 
                                        :severity="data.status === 1 ? 'success' : 'danger'" 
                                    />
                                </template>
                            </Column>

                            <Column header="Actions" style="min-width: 6rem">
                                <template #body="{ data }">
                                    <Button 
                                        icon="pi pi-trash" 
                                        class="p-button-danger p-button-text p-button-sm" 
                                        @click="removeDealer(data)" 
                                    />
                                </template>
                            </Column>

                            <template #empty>
                                <div class="text-center text-gray-500 py-4">
                                    No dealers selected.
                                </div>
                            </template>
                        </DataTable>
                    </div>
                </div>

                <!-- Action Buttons -->
                <div class="flex justify-end gap-4 mt-8">
                    <div class="w-32">
                        <Button 
                            label="Cancel" 
                            class="w-full p-button-outlined p-button-secondary" 
                            @click="handleCancel" 
                        />
                    </div>
                    <div class="w-32">
                        <Button 
                            label="Create" 
                            class="w-full" 
                            :disabled="!isFormValid"
                            @click="submitForm" 
                        />
                    </div>
                </div>
            </div>
        </div>
    </Fluid>
</template>

<script setup>
import { reactive, ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import MultiSelect from 'primevue/multiselect';
import Dropdown from 'primevue/dropdown';

const router = useRouter();

// reactive form data with sample data pre-filled
const form = reactive({
    companyName: 'Speedy Express Logistics Sdn Bhd',
    orderNo: 'LOG-2024-001',
    address: 'No. 123, Jalan Teknologi 5',
    city: 'Cyberjaya',
    state: 'Selangor',
    postcode: '63000',
    contactPerson: 'Ahmad bin Ismail',
    contactNo: '+60 12-345 6789',
    email: 'ahmad@speedylogistics.com.my',
    status: '1'
});

// dealer selection data with some pre-selected dealers
const selectedDealers = ref([]);

// Sample dealer data
const dealers = ref([
    {
        memberCode: 'E346572',
        custAccountNo: '6080100900',
        companyName1: 'PS Tyres & Battery Auto Services Sdn. Bhd',
        phoneNumber: '+60 3-1234 5678',
        mobilreNumber: '+60 19-1234 567',
        state: 'Kuala Lumpur',
        emailAddress: 'sales@toyotires.com.my',
        status: 1
    },
    {
        memberCode: 'E234176',
        custAccountNo: '6080102300',
        companyName1: 'Toyo Auto Centre UHP Tyres Sdn Bhd',
        phoneNumber: '+60 7-2345 678',
        mobilreNumber: '+60 16-2345 678',
        state: 'Johor',
        emailAddress: 'johor@toyotires.com.my',
        status: 1
    },
    {
        memberCode: 'E127568',
        custAccountNo: '6080102301',
        companyName1: 'Tek Ming Auto Service Sdn. Bhd.',
        phoneNumber: '+60 4-3456 789',
        mobilreNumber: '+60 12-3456 789',
        state: 'Penang',
        emailAddress: 'penang@toyotires.com.my',
        status: 1
    },
    {
        memberCode: 'E127823',
        custAccountNo: '6080102302',
        companyName1: 'Apex Tyre & Car Care',
        phoneNumber: '+60 82-4567 890',
        mobilreNumber: '+60 18-4567 890',
        state: 'Selangor',
        emailAddress: 'selangor@toyotires.com.my',
        status: 0
    },
    {
        memberCode: 'E748235',
        custAccountNo: '6080114400',
        companyName1: 'JS Motorsports Sdn Bhd',
        phoneNumber: '+60 4-5678 901',
        mobilreNumber: '+60 17-5678 901',
        state: 'Selangor',
        emailAddress: 'petaling@toyotires.com.my',
        status: 1
    },
    {
        memberCode: 'E325632',
        custAccountNo: '6080125300',
        companyName1: 'Weng Tat Tyre Service',
        phoneNumber: '+60 8-7654 321',
        mobilreNumber: '+60 19-8765 432',
        state: 'Kedah',
        emailAddress: 'labuan@toyotires.com.my',
        status: 0
    }
]);

// Group dealers by state for the MultiSelect
const groupedDealers = computed(() => {
    const states = {};
    
    dealers.value.forEach(dealer => {
        if (!states[dealer.state]) {
            states[dealer.state] = [];
        }
        states[dealer.state].push({
            ...dealer,
            label: `${dealer.companyName1} (${dealer.custAccountNo})`
        });
    });

    return Object.keys(states).map(state => ({
        label: state,
        items: states[state]
    }));
});

// list of states
const states = [
    'Johor', 'Kedah', 'Kelantan', 'Melaka', 'Negeri Sembilan',
    'Pahang', 'Penang', 'Perak', 'Perlis', 'Sabah', 'Sarawak',
    'Selangor', 'Terengganu', 'Kuala Lumpur', 'Putrajaya', 'Labuan'
];

// status options
const statusOptions = ref([
    { label: 'Active', value: '1' },
    { label: 'Inactive', value: '0' }
]);

// form validation
const isFormValid = computed(() => {
    return form.companyName.trim() !== '' && 
           form.orderNo.trim() !== '' && 
           form.address.trim() !== '' && 
           form.city.trim() !== '' && 
           form.state.trim() !== '' && 
           form.postcode.trim() !== '' && 
           form.contactPerson.trim() !== '' && 
           form.contactNo.trim() !== '' && 
           form.email.trim() !== '';
});

// Initialize labels for dealers and pre-select some dealers
onMounted(() => {
    dealers.value.forEach(dealer => {
        dealer.label = `${dealer.companyName1} (${dealer.custAccountNo})`;
    });

    // Pre-select some dealers for demonstration
    selectedDealers.value = [
        dealers.value[0], // PS Tyres & Battery Auto Services
        dealers.value[1], // Toyo Auto Centre UHP Tyres
        dealers.value[4]  // JS Motorsports
    ];
});

const removeDealer = (dealer) => {
    const index = selectedDealers.value.findIndex(d => d.custAccountNo === dealer.custAccountNo);
    if (index !== -1) {
        selectedDealers.value.splice(index, 1);
    }
};

const handleCancel = () => {
    if (form.companyName || form.orderNo || selectedDealers.value.length > 0) {
        if (confirm('You have unsaved changes. Are you sure you want to cancel?')) {
            router.back();
        }
    } else {
        router.back();
    }
};

const submitForm = () => {
    if (!isFormValid.value) {
        alert('Please fill in all required fields.');
        return;
    }

    const formData = {
        ...form,
        selectedDealers: selectedDealers.value
    };
    
    console.log('Submitted data:', formData);
    alert('Logistic created successfully!');
    
    // Reset form
    Object.assign(form, {
        companyName: '',
        orderNo: '',
        address: '',
        city: '',
        state: '',
        postcode: '',
        contactPerson: '',
        contactNo: '',
        email: '',
        status: '1'
    });
    selectedDealers.value = [];
    
    // Navigate back to logistic list
    router.push('/scm/listLogistic');
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