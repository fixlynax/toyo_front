<template>
    <Fluid>
        <div class="flex flex-col md:flex-row gap-8">
            <div class="card flex flex-col gap-6 w-full">
                <!-- Header -->
                <div class="text-2xl font-bold text-gray-800 border-b pb-2 mb-4">Material Exception List</div>

                <!-- Description -->
                <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-2">
                    <div class="flex items-start">
                        <i class="pi pi-info-circle text-blue-500 text-lg mt-1 mr-3"></i>
                        <div>
                            <div class="font-semibold text-blue-800 mb-1">About Material Exceptions</div>
                            <div class="text-blue-700 text-sm">Special material list to exclude or include from selected dealers. Used for customer-specific products and special pricing (R8R Pattern).</div>
                        </div>
                    </div>
                </div>

                <!-- Material Exceptions Table -->
                <DataTable :value="materialExceptions" :paginator="true" :rows="10" :rowsPerPageOptions="[5, 10, 20, 50]" dataKey="id" :rowHover="true" :loading="loading" :filters="filters" responsiveLayout="scroll">
                    <template #header>
                        <div class="flex justify-between items-center">
                            <span class="text-sm text-gray-500"> {{ materialExceptions.length }} exception(s) found </span>
                            <div class="flex gap-2">
                                <Button label="Add Exception" icon="pi pi-plus" class="p-button-primary" @click="showAddDialog = true" />
                            </div>
                        </div>
                    </template>

                    <template #empty>
                        <div class="text-center text-gray-500 py-8">
                            <i class="pi pi-inbox text-4xl mb-2"></i>
                            <div>No material exceptions found.</div>
                            <div class="text-sm mt-1">Add your first material exception to get started.</div>
                            <Button label="Add First Exception" icon="pi pi-plus" class="p-button-outlined mt-4" @click="showAddDialog = true" />
                        </div>
                    </template>

                    <template #loading>
                        <div class="text-center py-4">
                            <i class="pi pi-spinner pi-spin text-2xl mr-2"></i>
                            Loading material exceptions...
                        </div>
                    </template>

                    <Column header="Material" style="min-width: 12rem">
                        <template #body="{ data }">
                            <div class="flex items-center gap-2">
                                <i class="pi pi-box text-blue-500"></i>
                                <div>
                                    <div class="font-semibold text-gray-800">
                                        {{ data.materialCode }}
                                    </div>
                                    <div class="text-sm text-gray-600">
                                        {{ data.materialDescription }}
                                    </div>
                                </div>
                            </div>
                        </template>
                    </Column>

                    <Column header="Type" style="min-width: 8rem">
                        <template #body="{ data }">
                            <Tag :value="data.exceptionType" :severity="getTypeSeverity(data.exceptionType)" />
                        </template>
                    </Column>

                    <Column header="Dealers" style="min-width: 10rem">
                        <template #body="{ data }">
                            <div class="text-sm">
                                <Badge :value="data.dealers.length" class="mr-2" />
                                {{ data.dealers.length }} dealer(s)
                            </div>
                        </template>
                    </Column>

                    <Column header="Pattern" style="min-width: 8rem">
                        <template #body="{ data }">
                            <div class="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                                {{ data.pattern }}
                            </div>
                        </template>
                    </Column>

                    <Column header="Special Price" style="min-width: 10rem">
                        <template #body="{ data }">
                            <div v-if="data.specialPrice" class="text-green-600 font-semibold">RM {{ formatPrice(data.specialPrice) }}</div>
                            <div v-else class="text-gray-400 text-sm">Standard Price</div>
                        </template>
                    </Column>

                    <Column header="Status" style="min-width: 8rem">
                        <template #body="{ data }">
                            <Tag :value="data.status ? 'Active' : 'Inactive'" :severity="data.status ? 'success' : 'danger'" />
                        </template>
                    </Column>

                    <Column header="Actions" style="min-width: 10rem">
                        <template #body="{ data }">
                            <div class="flex gap-1">
                                <Button icon="pi pi-pencil" class="p-button-info p-button-text p-button-sm" v-tooltip="'Edit'" @click="editException(data)" />
                                <Button icon="pi pi-trash" class="p-button-danger p-button-text p-button-sm" v-tooltip="'Delete'" @click="deleteException(data.id)" />
                            </div>
                        </template>
                    </Column>
                </DataTable>
            </div>
        </div>

        <!-- Add/Edit Dialog -->
        <Dialog v-model:visible="showAddDialog" :header="editMode ? 'Edit Material Exception' : 'Add Material Exception'" :modal="true" class="p-fluid" :style="{ width: '60rem' }">
            <div class="grid grid-cols-1 gap-4">
                <!-- Material Selection -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="block font-bold text-gray-700 mb-2">Material Code *</label>
                        <Dropdown v-model="currentException.materialCode" :options="materialOptions" optionLabel="code" optionValue="code" placeholder="Select Material" class="w-full" filter @change="onMaterialChange" />
                    </div>
                    <div>
                        <label class="block font-bold text-gray-700 mb-2">Material Description</label>
                        <InputText v-model="currentException.materialDescription" type="text" placeholder="Material description" class="w-full" disabled />
                    </div>
                </div>

                <!-- Exception Type and Pattern -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="block font-bold text-gray-700 mb-2">Exception Type *</label>
                        <Dropdown v-model="currentException.exceptionType" :options="exceptionTypeOptions" optionLabel="label" optionValue="value" placeholder="Select Type" class="w-full" />
                    </div>
                    <div>
                        <label class="block font-bold text-gray-700 mb-2">Pattern *</label>
                        <InputText v-model="currentException.pattern" type="text" placeholder="Enter R8R pattern" class="w-full" />
                    </div>
                </div>

                <!-- Special Price -->
                <div>
                    <label class="block font-bold text-gray-700 mb-2">Special Price</label>
                    <div class="flex items-center gap-2">
                        <span class="text-gray-600">RM</span>
                        <InputNumber v-model="currentException.specialPrice" mode="currency" currency="MYR" locale="en-MY" placeholder="Enter special price" class="w-full" :min="0" :maxFractionDigits="2" />
                    </div>
                    <div class="text-sm text-gray-500 mt-1">Leave empty to use standard pricing</div>
                </div>

                <!-- Dealer Selection -->
                <div>
                    <div class="flex items-center justify-between mb-2">
                        <label class="block font-bold text-gray-700">Dealer List *</label>
                        <span class="text-sm text-gray-500">{{ currentException.dealers.length }} dealers selected</span>
                    </div>

                    <div class="flex gap-2 mb-3">
                        <Button label="Select All" class="p-button-outlined p-button-secondary p-button-sm" @click="selectAllDealers" />
                        <Button label="Clear All" class="p-button-outlined p-button-danger p-button-sm" @click="clearAllDealers" />
                    </div>

                    <MultiSelect v-model="currentException.dealers" :options="dealerOptions" optionLabel="label" optionValue="value" filter display="chip" placeholder="Select Dealers" class="w-full" :maxSelectedLabels="3">
                        <template #optiongroup="slotProps">
                            <div class="flex items-center">
                                <i class="pi pi-map-marker mr-2 text-blue-500" />
                                <div class="font-semibold">{{ slotProps.option.label }}</div>
                                <span class="ml-2 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full"> {{ slotProps.option.items.length }} dealers </span>
                            </div>
                        </template>
                    </MultiSelect>
                </div>

                <!-- Status -->
                <div>
                    <label class="block font-bold text-gray-700 mb-2">Status</label>
                    <div class="flex items-center gap-3">
                        <InputSwitch v-model="currentException.status" />
                        <span :class="currentException.status ? 'text-green-600' : 'text-gray-600'">
                            {{ currentException.status ? 'Active' : 'Inactive' }}
                        </span>
                    </div>
                </div>

                <!-- Preview -->
                <div v-if="currentException.materialCode && currentException.dealers.length > 0" class="border rounded-lg p-4 bg-gray-50">
                    <label class="block font-bold text-gray-700 mb-2">Preview</label>
                    <div class="text-sm space-y-2">
                        <div class="flex justify-between">
                            <span class="text-gray-600">Material:</span>
                            <span class="font-semibold">{{ currentException.materialCode }} - {{ currentException.materialDescription }}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-600">Type:</span>
                            <Tag :value="currentException.exceptionType" :severity="getTypeSeverity(currentException.exceptionType)" class="text-xs" />
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-600">Dealers:</span>
                            <span class="font-semibold">{{ currentException.dealers.length }} selected</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-600">Pattern:</span>
                            <span class="font-mono font-semibold">{{ currentException.pattern }}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-600">Price:</span>
                            <span class="font-semibold" :class="currentException.specialPrice ? 'text-green-600' : 'text-gray-600'">
                                {{ currentException.specialPrice ? `RM ${formatPrice(currentException.specialPrice)}` : 'Standard Price' }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <template #footer>
                <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="closeDialog" />
                <Button :label="editMode ? 'Update' : 'Add Exception'" icon="pi pi-check" class="p-button-primary" :disabled="!isDialogFormValid" @click="saveException" />
            </template>
        </Dialog>
    </Fluid>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { FilterMatchMode } from '@primevue/core/api';

const loading = ref(false);
const showAddDialog = ref(false);
const editMode = ref(false);

// Filters for search
const filters = reactive({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});

// Current exception for add/edit
const currentException = reactive({
    materialCode: '',
    materialDescription: '',
    exceptionType: '',
    pattern: '',
    specialPrice: null,
    dealers: [],
    status: true
});

// Sample data
const materialExceptions = ref([
    {
        id: 1,
        materialCode: 'MAT-001',
        materialDescription: 'Premium Car Tyre 205/55R16',
        exceptionType: 'Include',
        pattern: 'R8R-SPECIAL-001',
        specialPrice: 350.5,
        dealers: ['6080100900', '6080102300'],
        status: true,
        createdBy: 'Admin',
        createdAt: new Date('2024-01-15')
    },
    {
        id: 2,
        materialCode: 'MAT-002',
        materialDescription: 'Engine Oil Synthetic 5W-30',
        exceptionType: 'Exclude',
        pattern: 'R8R-EXCLUDE-001',
        specialPrice: null,
        dealers: ['6080102301', '6080102302', '6080114400'],
        status: true,
        createdBy: 'Admin',
        createdAt: new Date('2024-01-10')
    },
    {
        id: 3,
        materialCode: 'MAT-003',
        materialDescription: 'Brake Pad Set Front',
        exceptionType: 'Include',
        pattern: 'R8R-SPECIAL-002',
        specialPrice: 120.75,
        dealers: ['6080100900'],
        status: false,
        createdBy: 'Admin',
        createdAt: new Date('2024-01-05')
    },
    {
        id: 4,
        materialCode: 'MAT-004',
        materialDescription: 'Air Filter Premium',
        exceptionType: 'Include',
        pattern: 'R8R-SPECIAL-003',
        specialPrice: 45.2,
        dealers: ['6080102300', '6080125300'],
        status: true,
        createdBy: 'Admin',
        createdAt: new Date('2024-01-20')
    }
]);

// Options
const materialOptions = ref([
    { code: 'MAT-001', description: 'Premium Car Tyre 205/55R16', category: 'Tyres' },
    { code: 'MAT-002', description: 'Engine Oil Synthetic 5W-30', category: 'Lubricants' },
    { code: 'MAT-003', description: 'Brake Pad Set Front', category: 'Brakes' },
    { code: 'MAT-004', description: 'Air Filter Premium', category: 'Filters' },
    { code: 'MAT-005', description: 'Battery 12V 60Ah', category: 'Electrical' },
    { code: 'MAT-006', description: 'Spark Plug Iridium', category: 'Ignition' },
    { code: 'MAT-007', description: 'Shock Absorber Set', category: 'Suspension' },
    { code: 'MAT-008', description: 'Wheel Bearing Kit', category: 'Steering' }
]);

const exceptionTypeOptions = ref([
    { label: 'Include', value: 'Include' },
    { label: 'Exclude', value: 'Exclude' }
]);

const dealerOptions = ref([
    {
        label: 'Kuala Lumpur',
        items: [
            { label: 'PS Tyres & Battery Auto Services (6080100900)', value: '6080100900' },
            { label: 'KL City Center (6080102500)', value: '6080102500' }
        ]
    },
    {
        label: 'Johor',
        items: [
            { label: 'Toyo Auto Centre UHP Tyres (6080102300)', value: '6080102300' },
            { label: 'Johor Bahru Motors (6080102400)', value: '6080102400' }
        ]
    },
    {
        label: 'Penang',
        items: [
            { label: 'Tek Ming Auto Service (6080102301)', value: '6080102301' },
            { label: 'Georgetown Auto (6080102600)', value: '6080102600' }
        ]
    },
    {
        label: 'Selangor',
        items: [
            { label: 'Apex Tyre & Car Care (6080102302)', value: '6080102302' },
            { label: 'JS Motorsports (6080114400)', value: '6080114400' },
            { label: 'Petaling Jaya Auto (6080102700)', value: '6080102700' }
        ]
    },
    {
        label: 'Kedah',
        items: [{ label: 'Weng Tat Tyre Service (6080125300)', value: '6080125300' }]
    }
]);

// Computed properties
const isDialogFormValid = computed(() => {
    return currentException.materialCode !== '' && currentException.exceptionType !== '' && currentException.pattern.trim() !== '' && currentException.dealers.length > 0;
});

// Methods
const formatPrice = (price) => {
    return new Intl.NumberFormat('en-MY', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(price);
};

const getTypeSeverity = (type) => {
    return type === 'Include' ? 'success' : 'warning';
};

const onMaterialChange = () => {
    const selectedMaterial = materialOptions.value.find((m) => m.code === currentException.materialCode);
    if (selectedMaterial) {
        currentException.materialDescription = selectedMaterial.description;
    }
};

const selectAllDealers = () => {
    const allDealers = [];
    dealerOptions.value.forEach((group) => {
        group.items.forEach((dealer) => {
            allDealers.push(dealer.value);
        });
    });
    currentException.dealers = allDealers;
};

const clearAllDealers = () => {
    currentException.dealers = [];
};

const addException = () => {
    showAddDialog.value = true;
    editMode.value = false;
};

const editException = (exception) => {
    editMode.value = true;
    Object.assign(currentException, {
        materialCode: exception.materialCode,
        materialDescription: exception.materialDescription,
        exceptionType: exception.exceptionType,
        pattern: exception.pattern,
        specialPrice: exception.specialPrice,
        dealers: [...exception.dealers],
        status: exception.status
    });
    showAddDialog.value = true;
};

const deleteException = (id) => {
    const exception = materialExceptions.value.find((e) => e.id === id);
    if (exception && confirm(`Are you sure you want to delete the material exception for ${exception.materialCode}?`)) {
        materialExceptions.value = materialExceptions.value.filter((e) => e.id !== id);
        console.log(`Material exception ${id} has been deleted`);
    }
};

const saveException = () => {
    if (editMode.value) {
        // Update existing exception
        const index = materialExceptions.value.findIndex((e) => e.id === currentException.id);
        if (index !== -1) {
            materialExceptions.value[index] = {
                ...materialExceptions.value[index],
                ...currentException,
                dealers: [...currentException.dealers]
            };
        }
    } else {
        // Create new exception
        // Check if material and pattern combination already exists
        const existingException = materialExceptions.value.find((e) => e.materialCode === currentException.materialCode && e.pattern === currentException.pattern);

        if (existingException) {
            alert('A material exception with this material and pattern already exists. Please edit the existing entry instead.');
            return;
        }

        const newException = {
            id: Date.now(),
            materialCode: currentException.materialCode,
            materialDescription: currentException.materialDescription,
            exceptionType: currentException.exceptionType,
            pattern: currentException.pattern,
            specialPrice: currentException.specialPrice,
            dealers: [...currentException.dealers],
            status: currentException.status,
            createdBy: 'Admin',
            createdAt: new Date()
        };
        materialExceptions.value.unshift(newException);
    }

    closeDialog();
    console.log('Material exception saved:', currentException);
};

const closeDialog = () => {
    showAddDialog.value = false;
    editMode.value = false;
    // Reset form
    Object.assign(currentException, {
        materialCode: '',
        materialDescription: '',
        exceptionType: '',
        pattern: '',
        specialPrice: null,
        dealers: [],
        status: true
    });
};

// Initialize
onMounted(() => {
    // Simulate loading
    loading.value = true;
    setTimeout(() => {
        loading.value = false;
    }, 1000);
});
</script>

<style scoped>
:deep(.p-multiselect),
:deep(.p-dropdown) {
    width: 100%;
}

:deep(.p-inputnumber) {
    width: 100%;
}
</style>
