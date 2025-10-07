<template>
    <Fluid>
        <div class="flex flex-col md:flex-row gap-8">
            <div class="card flex flex-col gap-6 w-full">
                <!-- Header -->
                <div class="text-2xl font-bold text-gray-800 border-b pb-2">Edit Sales Program</div>

                <!-- Sales Program Form -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="md:col-span-2">
                        <label class="block font-bold text-gray-700">Title</label>
                        <InputText v-model="salesProgram.title" class="w-full" />
                    </div>

                    <div class="md:col-span-2">
                        <label class="block font-bold text-gray-700">Description</label>
                        <Textarea v-model="salesProgram.desc" rows="3" class="w-full" />
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 md:col-span-2">
                        <div>
                            <label class="block font-bold text-gray-700">Start Date</label>
                            <Calendar v-model="salesProgram.startDate" dateFormat="yy-mm-dd" class="w-full" />
                        </div>

                        <div>
                            <label class="block font-bold text-gray-700">End Date</label>
                            <Calendar v-model="salesProgram.endDate" dateFormat="yy-mm-dd" class="w-full" />
                        </div>

                        <div>
                            <label class="block font-bold text-gray-700">Price Group</label>
                            <InputText v-model="salesProgram.priceGroup" class="w-full" />
                        </div>
                    </div>

                    <div>
                        <label class="block font-bold text-gray-700">Program Type</label>
                        <Dropdown v-model="salesProgram.type" :options="typeOptions" optionLabel="label" optionValue="value" class="w-full" />
                    </div>

                    <div>
                        <label class="block font-bold text-gray-700">Status</label>
                        <Dropdown v-model="salesProgram.status" :options="statusOptions" optionLabel="label" optionValue="value" class="w-full" />
                    </div>
                </div>

                <!-- Upload Image -->
                <div>
                    <label class="block font-bold text-gray-700 mb-2">Sales Program Image</label>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <FileUpload mode="basic" name="image" accept="image/*" customUpload @select="onImageSelect($event, 'image')" chooseLabel="Change Program Image" class="w-full" />
                            <img v-if="salesProgram.image" :src="salesProgram.image" alt="Current Program Image" class="mt-2 rounded-lg shadow-md object-cover w-full h-80" />
                            <div v-else class="mt-2 text-gray-500 italic">No image uploaded</div>
                        </div>
                    </div>
                </div>

                <!-- Program Items Section -->
                <div>
                    <div class="flex items-center justify-between border-b pb-2 mb-4 mt-6">
                        <div class="text-xl font-bold text-gray-800">📋 Program Items</div>
                        <Button icon="pi pi-plus" label="Add Item" style="width: fit-content" class="p-button-success p-button-sm" :disabled="programItems.length >= 20" @click="addProgramItem" />
                    </div>

                    <div v-if="programItems.length > 0" class="space-y-4">
                        <div v-for="(item, index) in programItems" :key="item.id || index" class="border rounded-lg p-4 shadow-sm bg-gray-50">
                            <div class="flex items-center justify-between mb-3">
                                <label class="font-semibold">Item {{ index + 1 }} <span v-if="item.id" class="text-gray-500 text-sm">(ID: {{ item.id }})</span></label>
                                <Button icon="pi pi-trash" class="p-button-danger p-button-text p-button-sm" @click="removeProgramItem(index)" />
                            </div>

                            <!-- FOC Fields -->
                            <div v-if="salesProgram.type === 'FOC'" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <!-- Buy Material Section -->
                                <div class="md:col-span-2">
                                    <label class="block font-bold text-gray-700 mb-2">Buy Material</label>
                                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label class="block text-sm font-medium text-gray-600">Material ID</label>
                                            <InputText v-model="item.buy_materialid" class="w-full" placeholder="e.g., 81114NE0304175H" />
                                        </div>
                                        <div>
                                            <label class="block text-sm font-medium text-gray-600">Material Name</label>
                                            <InputText v-model="item.buy_materialName" class="w-full" placeholder="e.g., Toyo Proxes Sport 225/45R17" />
                                        </div>
                                    </div>
                                </div>

                                <!-- Free Material Section -->
                                <div class="md:col-span-2">
                                    <label class="block font-bold text-gray-700 mb-2">Free Material</label>
                                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label class="block text-sm font-medium text-gray-600">Material ID</label>
                                            <InputText v-model="item.free_materialid" class="w-full" placeholder="e.g., 81114NE0304176H" />
                                        </div>
                                        <div>
                                            <label class="block text-sm font-medium text-gray-600">Material Name</label>
                                            <InputText v-model="item.free_materialName" class="w-full" placeholder="e.g., Toyo Proxes Sport 225/45R17" />
                                        </div>
                                    </div>
                                </div>

                                <!-- Quantities -->
                                <div class="grid grid-cols-2 gap-4 md:col-span-2">
                                    <div>
                                        <label class="block font-bold text-gray-700">Buy Quantity</label>
                                        <InputNumber v-model="item.buyQty" class="w-full" :min="1" />
                                    </div>
                                    <div>
                                        <label class="block font-bold text-gray-700">Free Quantity</label>
                                        <InputNumber v-model="item.freeQty" class="w-full" :min="1" />
                                    </div>
                                </div>
                            </div>

                            <!-- MARKDOWN Fields -->
                            <div v-if="salesProgram.type === 'MARKDOWN'" class="grid grid-cols-1 gap-4">
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label class="block font-bold text-gray-700">Material ID</label>
                                        <InputText v-model="item.materialid" class="w-full" placeholder="e.g., 81114NE0304176H" />
                                    </div>
                                    <div>
                                        <label class="block font-bold text-gray-700">Material Name</label>
                                        <InputText v-model="item.materialName" class="w-full" placeholder="e.g., Toyo Proxes Sport 225/45R17" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div v-else class="text-gray-500 italic">No program items added yet.</div>
                </div>

                <!-- eTEN Selection -->
                <div>
                    <div class="flex items-center justify-between border-b pb-2 mb-4 mt-6">
                        <div class="text-xl font-bold text-gray-800">👨🏻‍💻 eTEN Selection</div>
                    </div>

                    <div class="mb-4">
                        <label class="block font-bold text-gray-700 mb-2">Select eTEN Dealers</label>
                        <MultiSelect 
                            v-model="selectedEtenList" 
                            :options="groupedEtenDealers" 
                            optionLabel="label" 
                            filter 
                            optionGroupLabel="label" 
                            optionGroupChildren="items" 
                            display="chip" 
                            placeholder="Select eTEN Dealers" 
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

                    <!-- Selected eTEN Dealers Table -->
                    <div v-if="selectedEtenList.length > 0">
                        <label class="block font-bold text-gray-700 mb-2">Selected Dealers ({{ selectedEtenList.length }})</label>
                        <DataTable :value="selectedEtenList" :paginator="true" :rows="5" dataKey="custAccountNo" :rowHover="true" responsiveLayout="scroll">
                            <Column header="Dealer" style="min-width: 12rem">
                                <template #body="{ data }">
                                    <div class="flex flex-col">
                                        <span class="font-bold text-gray-800">{{ data.companyName1 }}</span>
                                        <span class="text-gray-600 text-xs mt-1">🔑 {{ data.custAccountNo }}</span>
                                        <span class="text-gray-600 text-xs mt-1">📍 {{ data.state }}</span>
                                    </div>
                                </template>
                            </Column>

                            <Column header="Contact" style="min-width: 10rem">
                                <template #body="{ data }">
                                    <div class="flex flex-col">
                                        <span class="font-bold text-gray-800 text-xm">{{ data.emailAddress }}</span>
                                        <span class="text-gray-800 text-xs">{{ data.mobilreNumber }}</span>
                                    </div>
                                </template>
                            </Column>

                            <Column header="Status" style="min-width: 6rem">
                                <template #body="{ data }">
                                    <Tag :value="data.status === 1 ? 'Active' : 'Inactive'" :severity="data.status === 1 ? 'success' : 'danger'" />
                                </template>
                            </Column>

                            <Column header="Actions" style="min-width: 6rem">
                                <template #body="{ data }">
                                    <Button 
                                        icon="pi pi-trash" 
                                        class="p-button-danger p-button-text p-button-sm" 
                                        @click="removeSingleEten(data)" 
                                    />
                                </template>
                            </Column>
                        </DataTable>
                    </div>
                </div>

                <!-- Action Buttons -->
                <div class="flex justify-end gap-4 mt-8">
                    <div class="w-32">
                        <Button label="Cancel" class="w-full p-button-outlined p-button-secondary" @click="handleCancel" />
                    </div>
                    <div class="w-32">
                        <Button label="Update" class="w-full" @click="submitForm" />
                    </div>
                </div>
            </div>
        </div>
    </Fluid>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// Pre-filled existing sales program data
const salesProgram = ref({
    programId: 'ABC4321',
    title: 'Year End Discount',
    desc: 'Exclusive year-end discounts on selected Toyo Tires models. Limited time offer!',
    startDate: '2025-09-01',
    endDate: '2025-10-30',
    priceGroup: '06',
    type: 'FOC',
    status: 1,
    image: '/demo/images/event-toyo-2.jpg',
    created: '2025-09-08'
});

const typeOptions = [
    { label: 'FOC (Free of Charge)', value: 'FOC' },
    { label: 'MARKDOWN', value: 'MARKDOWN' }
];

const statusOptions = [
    { label: 'Active', value: 1 },
    { label: 'Inactive', value: 0 }
];

const itemStatusOptions = [
    { label: 'Active', value: 1 },
    { label: 'Inactive', value: 0 }
];

// Pre-filled existing program items
const programItems = ref([
    {
        id: 1,
        buy_materialid: '81114NE0304175H',
        buy_materialName: 'Toyo Proxes Sport 225/45R17',
        buyQty: 4,
        free_materialid: '81114NE0304176H',
        free_materialName: 'Toyo Proxes Sport 225/45R17',
        freeQty: 1,
        status: 1,
        created: '2025-10-01',
    },
    {
        id: 2,
        buy_materialid: '81114NE0304180H',
        buy_materialName: 'Toyo Open Country A/T III 265/70R17',
        buyQty: 4,
        free_materialid: '81114NE0304181H',
        free_materialName: 'Toyo Open Country A/T III 265/70R17',
        freeQty: 1,
        status: 1,
        created: '2025-10-05',
    }
]);

// Pre-filled selected eTEN dealers
const selectedEtenList = ref([
    {
        memberCode: 'E346572',
        custAccountNo: '6080100900',
        companyName1: 'PS Tyres & Battery Auto Services Sdn. Bhd',
        phoneNumber: '+60 3-1234 5678',
        mobilreNumber: '+60 19-1234 567',
        state: 'Kuala Lumpur',
        emailAddress: 'sales@toyotires.com.my',
        status: 1,
        label: 'PS Tyres & Battery Auto Services Sdn. Bhd (6080100900)'
    },
    {
        memberCode: 'E234176',
        custAccountNo: '6080102300',
        companyName1: 'Toyo Auto Centre UHP Tyres Sdn Bhd',
        phoneNumber: '+60 7-2345 678',
        mobilreNumber: '+60 16-2345 678',
        state: 'Johor',
        emailAddress: 'johor@toyotires.com.my',
        status: 1,
        label: 'Toyo Auto Centre UHP Tyres Sdn Bhd (6080102300)'
    }
]);

// Sample eTEN data for selection
const etenDealers = ref([
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
        status: 1
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
    }
]);

// Group dealers by state for the MultiSelect
const groupedEtenDealers = computed(() => {
    const states = {};
    
    etenDealers.value.forEach(dealer => {
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

// Initialize labels for pre-selected dealers
onMounted(() => {
    selectedEtenList.value.forEach(dealer => {
        dealer.label = `${dealer.companyName1} (${dealer.custAccountNo})`;
    });
});

const addProgramItem = () => {
    if (salesProgram.value.type === 'FOC') {
        programItems.value.push({
            buy_materialid: '',
            buy_materialName: '',
            buyQty: 1,
            free_materialid: '',
            free_materialName: '',
            freeQty: 1,
            status: 1
        });
    } else if (salesProgram.value.type === 'MARKDOWN') {
        programItems.value.push({
            materialid: '',
            materialName: '',
            status: 1
        });
    }
};

const removeProgramItem = (index) => {
    programItems.value.splice(index, 1);
};

const removeSingleEten = (dealer) => {
    const index = selectedEtenList.value.findIndex(d => d.custAccountNo === dealer.custAccountNo);
    if (index !== -1) {
        selectedEtenList.value.splice(index, 1);
    }
};

const onImageSelect = (eventFile, field) => {
    const file = eventFile.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            salesProgram.value[field] = e.target.result;
        };
        reader.readAsDataURL(file);
    }
};

const handleCancel = () => {
    router.back();
};

const submitForm = () => {
    console.log('Updated Sales Program Data:', salesProgram.value);
    console.log('Updated Program Items:', programItems.value);
    console.log('Updated eTEN Selection:', selectedEtenList.value);
    
    // Here you would typically make an API call to update the sales program
    alert('Sales program updated successfully!');
    router.push('/sales-program');
};

// Watch for type changes to clear program items if type changes
watch(() => salesProgram.value.type, (newType, oldType) => {
    if (newType !== oldType) {
        if (confirm('Changing program type will clear all existing items. Continue?')) {
            programItems.value = [];
        } else {
            salesProgram.value.type = oldType;
        }
    }
});
</script>