<template>
    <Fluid>
        <div class="flex flex-col md:flex-row gap-8">
            <div class="card flex flex-col gap-6 w-full">
                <!-- Header -->
                <div class="text-2xl font-bold text-gray-800 border-b pb-2">Edit Logistic</div>

                <!-- Logistic Form -->
                <div class="grid grid-cols-1 gap-6">
                    <!-- Company Details -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block font-bold text-gray-700 mb-2">Company Name</label>
                            <InputText v-model="form.companyName" type="text" placeholder="Enter Company Name" class="w-full" />
                        </div>
                        <div>
                            <label class="block font-bold text-gray-700 mb-2">Contact Person</label>
                            <InputText v-model="form.contactPerson" type="text" placeholder="Enter Contact Person" class="w-full" />
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
                            <Dropdown v-model="form.state" :options="states" placeholder="Select State" class="w-full" />
                        </div>
                        <div>
                            <label class="block font-bold text-gray-700 mb-2">Postcode</label>
                            <InputText v-model="form.postcode" type="text" placeholder="Enter Postcode" class="w-full" />
                        </div>
                    </div>

                    <!-- Contact Details -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block font-bold text-gray-700 mb-2">Contact No</label>
                            <InputText v-model="form.contactNo" type="text" placeholder="Enter Contact No" class="w-full" />
                        </div>
                        <div>
                            <label class="block font-bold text-gray-700 mb-2">Username</label>
                            <InputText v-model="form.username" type="text" placeholder="Enter Username" class="w-full" />
                        </div>
                    </div>

                    <!-- Additional Details -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block font-bold text-gray-700 mb-2">Password</label>
                            <InputText v-model="form.password" type="password" placeholder="Enter Password" class="w-full" />
                        </div>
                        <div>
                            <label class="block font-bold text-gray-700 mb-2">Status</label>
                            <Dropdown v-model="form.status" :options="statusOptions" optionLabel="label" optionValue="value" placeholder="Select Status" class="w-full" />
                        </div>
                    </div>

                    <!-- Shipping Point Section -->
                    <div class="flex justify-between items-center border-b pb-2 mt-4">
                        <div class="text-xl font-bold text-gray-800">🚚 Shipping Points</div>
                    </div>
                    
                    <div>
                        <div class="flex items-center justify-between mb-2">
                            <label class="block font-bold text-gray-700">Shipping Points</label>
                            <span class="text-sm text-gray-500">{{ selectedShippingPoints.length }} points selected</span>
                        </div>

                        <MultiSelect
                            v-model="selectedShippingPoints"
                            :options="shippingPoints"
                            optionLabel="code"
                            filter
                            display="chip"
                            placeholder="Select Shipping Points"
                            class="w-full"
                            :maxSelectedLabels="3"
                        >
                            <template #option="slotProps">
                                <div class="flex items-center">
                                    <i class="pi pi-truck mr-2 text-blue-500" />
                                    <span class="font-semibold">{{ slotProps.option.code }}</span>
                                </div>
                            </template>
                            <template #value="slotProps">
                                <div v-if="slotProps.value" class="inline-flex items-center">
                                    <i class="pi pi-truck mr-1 text-sm" />
                                    <span>{{ slotProps.value.length }} points selected</span>
                                </div>
                                <span v-else>{{ slotProps.placeholder }}</span>
                            </template>
                        </MultiSelect>
                    </div>

                    <!-- Selected Shipping Points Preview -->
                    <div v-if="selectedShippingPoints.length > 0" class="border rounded-lg p-4 bg-gray-50">
                        <label class="block font-bold text-gray-700 mb-3">Selected Shipping Points</label>
                        <DataTable :value="selectedShippingPoints" :paginator="true" :rows="5" :rowsPerPageOptions="[3, 5, 7, 10]" dataKey="code" :rowHover="true" responsiveLayout="scroll">
                            <Column header="Code" style="min-width: 8rem">
                                <template #body="{ data }">
                                    <div class="font-semibold text-gray-800">
                                        {{ data.code }}
                                    </div>
                                </template>
                            </Column>

                            <Column header="Name" style="min-width: 12rem">
                                <template #body="{ data }">
                                    <div class="text-gray-700">
                                        {{ data.name }}
                                    </div>
                                </template>
                            </Column>

                            <Column header="Description" style="min-width: 15rem">
                                <template #body="{ data }">
                                    <div class="text-gray-600">
                                        {{ data.description }}
                                    </div>
                                </template>
                            </Column>

                            <Column header="Actions" style="min-width: 6rem">
                                <template #body="{ data }">
                                    <Button icon="pi pi-trash" class="p-button-danger p-button-text p-button-sm" @click="removeShippingPoint(data)" />
                                </template>
                            </Column>

                            <template #empty>
                                <div class="text-center text-gray-500 py-4">No shipping points selected.</div>
                            </template>
                        </DataTable>
                    </div>

                    <!-- Action Buttons -->
                    <div class="flex justify-end gap-4">
                        <div class="w-32">
                            <Button label="Cancel" class="w-full p-button-outlined p-button-secondary" @click="handleCancel" />
                        </div>
                        <div class="w-32">
                            <Button label="Save" class="w-full" :disabled="!isFormValid" @click="submitForm" />
                        </div>
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
    companyName: "JNT",
    contactPerson: "John Doe",
    contactNo: "123-456-7890",
    address: "Toyo Tires Malaysia, Jalan Toyo, Off Jalan Klang Lama",
    city: "Shah Alam",
    postcode: "47301",
    state: "Selangor",
    username: "jnt_user01",
    password: "password123",
    status: "1"
});

// shipping point selection data
const selectedShippingPoints = ref([]);

// Shipping points data
const shippingPoints = ref([
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

// status options
const statusOptions = ref([
    { label: 'Active', value: '1' },
    { label: 'Inactive', value: '0' }
]);

// form validation
const isFormValid = computed(() => {
    return (
        form.companyName.trim() !== '' &&
        form.contactPerson.trim() !== '' &&
        form.address.trim() !== '' &&
        form.city.trim() !== '' &&
        form.state.trim() !== '' &&
        form.postcode.trim() !== '' &&
        form.contactNo.trim() !== '' &&
        form.username.trim() !== '' &&
        form.password.trim() !== '' &&
        form.status.trim() !== ''
    );
});

// Initialize with some pre-selected shipping points for demonstration
onMounted(() => {
    selectedShippingPoints.value = [
        shippingPoints.value[0], // Main Shipping Point
        shippingPoints.value[2] // South Region Shipping
    ];
});

const removeShippingPoint = (point) => {
    const index = selectedShippingPoints.value.findIndex((p) => p.code === point.code);
    if (index !== -1) {
        selectedShippingPoints.value.splice(index, 1);
    }
};

const handleCancel = () => {
    if (form.companyName || form.contactPerson || selectedShippingPoints.value.length > 0) {
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
        selectedShippingPoints: selectedShippingPoints.value
    };

    console.log('Submitted data:', formData);
    alert('Logistic updated successfully!');

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