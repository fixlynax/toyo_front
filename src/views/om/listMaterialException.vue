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
                <DataTable
                    :value="materialExceptions"
                    :paginator="true"
                    :rows="10"
                    :rowsPerPageOptions="[5, 10, 20, 50]"
                    dataKey="id"
                    :rowHover="true"
                    :loading="loading"
                    :filters="filters"
                    responsiveLayout="scroll"
                >
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

                    <Column header="Type" style="min-width: 10rem">
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

                    <Column header="Status" style="min-width: 10rem">
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
        <Dialog
            v-model:visible="showAddDialog"
            :header="editMode ? 'Edit Material Exception' : 'Add Material Exception'"
            :modal="true"
            class="p-fluid"
            :style="{ width: '60rem' }"
        >
            <div class="grid grid-cols-1 gap-4">
                <!-- Material Selection -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="block font-bold text-gray-700 mb-2">Material Code *</label>
                        <Dropdown
                            v-model="currentException.materialCode"
                            :options="materialOptions"
                            optionLabel="code"
                            optionValue="code"
                            placeholder="Select Material"
                            class="w-full"
                            filter
                            @change="onMaterialChange"
                        />
                    </div>
                    <div>
                        <label class="block font-bold text-gray-700 mb-2">Material Description</label>
                        <InputText v-model="currentException.materialDescription" type="text" placeholder="Material description" class="w-full" disabled />
                    </div>
                </div>

                <!-- Exception Type -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="block font-bold text-gray-700 mb-2">Exception Type *</label>
                        <Dropdown v-model="currentException.exceptionType" :options="exceptionTypeOptions" optionLabel="label" optionValue="value" placeholder="Select Type" class="w-full" />
                    </div>
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

                    <!-- ✅ FIXED SEARCHABLE DEALER LIST -->
                    <MultiSelect
                        v-model="currentException.dealers"
                        :options="allDealers"
                        optionLabel="label"
                        optionValue="value"
                        filter
                        display="chip"
                        placeholder="Search or Select Dealers"
                        class="w-full"
                        :maxSelectedLabels="3"
                    >
                        <template #option="slotProps">
                            <div class="flex flex-col">
                                <div class="font-medium text-gray-800">{{ slotProps.option.label }}</div>
                                <small class="text-gray-500">{{ slotProps.option.group }}</small>
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
import { ref, reactive, computed, onMounted } from 'vue'
import { FilterMatchMode } from '@primevue/core/api'

const loading = ref(false)
const showAddDialog = ref(false)
const editMode = ref(false)

const filters = reactive({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
})

const currentException = reactive({
    materialCode: '',
    materialDescription: '',
    exceptionType: '',
    pattern: '',
    specialPrice: null,
    dealers: [],
    status: true
})

const materialExceptions = ref([
    {
        id: 1,
        materialCode: 'MAT-001',
        materialDescription: 'Premium Car Tyre 205/55R16',
        exceptionType: 'Include',
        pattern: 'R8R-SPECIAL-001',
        specialPrice: 350.5,
        dealers: ['6080100900', '6080102300'],
        status: true
    },
    {
        id: 2,
        materialCode: 'MAT-002',
        materialDescription: 'Engine Oil Synthetic 5W-30',
        exceptionType: 'Exclude',
        pattern: 'R8R-EXCLUDE-001',
        specialPrice: null,
        dealers: ['6080102301', '6080102302', '6080114400'],
        status: true
    }
])

const materialOptions = ref([
    { code: 'MAT-001', description: 'Premium Car Tyre 205/55R16' },
    { code: 'MAT-002', description: 'Engine Oil Synthetic 5W-30' },
    { code: 'MAT-003', description: 'Brake Pad Set Front' },
    { code: 'MAT-004', description: 'Air Filter Premium' }
])

const exceptionTypeOptions = ref([
    { label: 'Include', value: 'Include' },
    { label: 'Exclude', value: 'Exclude' }
])

const dealerOptions = ref([
    {
        label: 'Kuala Lumpur',
        items: [
            { label: 'PS Tyres & Battery Auto Services', value: '6080100900' },
            { label: 'KL City Center', value: '6080102500' }
        ]
    },
    {
        label: 'Johor',
        items: [
            { label: 'Toyo Auto Centre UHP Tyres', value: '6080102300' },
            { label: 'Johor Bahru Motors', value: '6080102400' }
        ]
    },
    {
        label: 'Penang',
        items: [
            { label: 'Tek Ming Auto Service', value: '6080102301' },
            { label: 'Georgetown Auto', value: '6080102600' }
        ]
    },
    {
        label: 'Selangor',
        items: [
            { label: 'Apex Tyre & Car Care', value: '6080102302' },
            { label: 'JS Motorsports', value: '6080114400' },
            { label: 'Petaling Jaya Auto', value: '6080102700' }
        ]
    },
    {
        label: 'Kedah',
        items: [{ label: 'Weng Tat Tyre Service', value: '6080125300' }]
    }
])

// ✅ Flattened dealer list for global search & combined display
const allDealers = computed(() =>
    dealerOptions.value.flatMap(group =>
        group.items.map(d => ({
            label: `${d.label} (${d.value})`,
            value: d.value,
            group: group.label
        }))
    )
)

const isDialogFormValid = computed(() => {
    return (
        currentException.materialCode &&
        currentException.exceptionType &&
        currentException.dealers.length > 0
    )
})

const formatPrice = price =>
    new Intl.NumberFormat('en-MY', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(price)

const getTypeSeverity = type => (type === 'Include' ? 'success' : 'warning')

const onMaterialChange = () => {
    const selected = materialOptions.value.find(m => m.code === currentException.materialCode)
    if (selected) currentException.materialDescription = selected.description
}

const selectAllDealers = () => {
    currentException.dealers = allDealers.value.map(d => d.value)
}

const clearAllDealers = () => (currentException.dealers = [])

const editException = data => {
    editMode.value = true
    Object.assign(currentException, { ...data })
    showAddDialog.value = true
}

const deleteException = id => {
    if (confirm('Are you sure you want to delete this exception?')) {
        materialExceptions.value = materialExceptions.value.filter(e => e.id !== id)
    }
}

const saveException = () => {
    if (editMode.value) {
        const idx = materialExceptions.value.findIndex(e => e.id === currentException.id)
        if (idx !== -1) materialExceptions.value[idx] = { ...currentException }
    } else {
        materialExceptions.value.unshift({
            ...currentException,
            id: Date.now()
        })
    }
    closeDialog()
}

const closeDialog = () => {
    showAddDialog.value = false
    editMode.value = false
    Object.assign(currentException, {
        materialCode: '',
        materialDescription: '',
        exceptionType: '',
        pattern: '',
        specialPrice: null,
        dealers: [],
        status: true
    })
}

onMounted(() => {
    loading.value = true
    setTimeout(() => (loading.value = false), 800)
})
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
