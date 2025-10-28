<template>
    <Fluid>
        <div class="flex flex-col md:flex-row gap-8">
            <div class="card flex flex-col gap-6 w-full">
                <!-- Header -->
                <div class="text-2xl font-bold text-gray-800 border-b pb-2 mb-4">Material Exception List</div>

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
                                <Badge :value="data.dealerCount" class="mr-2" />
                                {{ data.dealerCount }} dealer(s)
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

                    <!-- Searchable Dealer List -->
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
                            <span class="text-gray-600">Status:</span>
                            <Tag :value="currentException.status ? 'Active' : 'Inactive'" :severity="currentException.status ? 'success' : 'danger'" class="text-xs" />
                        </div>
                    </div>
                </div>
            </div>

            <template #footer>
                <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="closeDialog" />
                <Button :label="editMode ? 'Update' : 'Add Exception'" icon="pi pi-check" class="p-button-primary" :disabled="!isDialogFormValid" @click="saveException" />
            </template>
        </Dialog>

        <!-- Loading Overlay -->
        <Dialog v-model:visible="loading" :modal="true" :closable="false" :style="{ width: '20rem' }">
            <div class="flex items-center gap-4">
                <i class="pi pi-spinner pi-spin text-2xl"></i>
                <span>Processing...</span>
            </div>
        </Dialog>
    </Fluid>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { FilterMatchMode } from '@primevue/core/api'
import { useToast } from 'primevue/usetoast'
import api from '@/service/api';

const toast = useToast()
const loading = ref(false)
const showAddDialog = ref(false)
const editMode = ref(false)

const filters = reactive({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
})

const currentException = reactive({
    id: null,
    materialCode: '',
    materialDescription: '',
    exceptionType: '',
    dealers: [],
    status: true
})

const materialExceptions = ref([])

const materialOptions = ref([
    { code: '81114NE0305185H', description: 'Premium Car Tyre 205/55R16' },
    { code: '81115NE0306195V', description: 'Engine Oil Synthetic 5W-30' },
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
            { label: 'PS Tyres & Battery Auto Services', value: '1' },
            { label: 'KL City Center', value: '2' }
        ]
    },
    {
        label: 'Johor',
        items: [
            { label: 'Toyo Auto Centre UHP Tyres', value: '3' },
            { label: 'Johor Bahru Motors', value: '4' }
        ]
    },
    {
        label: 'Penang',
        items: [
            { label: 'Tek Ming Auto Service', value: '5' },
            { label: 'Georgetown Auto', value: '6' }
        ]
    },
    {
        label: 'Selangor',
        items: [
            { label: 'Apex Tyre & Car Care', value: '7' },
            { label: 'JS Motorsports', value: '8' },
            { label: 'Petaling Jaya Auto', value: '9' }
        ]
    },
    {
        label: 'Kedah',
        items: [{ label: 'Weng Tat Tyre Service', value: '10' }]
    }
])

// Flattened dealer list for global search & combined display
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

const getTypeSeverity = (type) => (type === 'Include' ? 'success' : 'warning')

const onMaterialChange = () => {
    const selected = materialOptions.value.find(m => m.code === currentException.materialCode)
    if (selected) {
        currentException.materialDescription = selected.description
    }
}

const selectAllDealers = () => {
    currentException.dealers = allDealers.value.map(d => d.value)
}

const clearAllDealers = () => {
    currentException.dealers = []
}

const editException = (data) => {
    editMode.value = true
    Object.assign(currentException, { 
        ...data,
        // Convert dealer IDs back to array format for multiselect
        dealers: Array.isArray(data.dealers) ? data.dealers : []
    })
    showAddDialog.value = true
}

const deleteException = async (id) => {
    if (confirm('Are you sure you want to delete this exception?')) {
        try {
            loading.value = true
            const response = await api.delete(`maintenance/delete-material-exception/${id}`)
            
            if (response.data.status === 1) {
                // Remove from local list
                materialExceptions.value = materialExceptions.value.filter(e => e.id !== id)
                toast.add({ severity: 'success', summary: 'Success', detail: 'Material exception deleted successfully', life: 3000 })
            } else {
                console.error('API returned error:', response.data)
                toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete material exception', life: 3000 })
            }
        } catch (error) {
            console.error('Error deleting material exception:', error)
            toast.add({ severity: 'error', summary: 'Error', detail: 'Error deleting material exception', life: 3000 })
        } finally {
            loading.value = false
        }
    }
}

const saveException = async () => {
    try {
        loading.value = true

        // Prepare data for API
        const apiData = {
            materialid: currentException.materialCode,
            status: currentException.status ? 1 : 0
        }

        // Split dealers into include and exclude based on exception type
        if (currentException.exceptionType === 'Include') {
            apiData.i_eten_userID = currentException.dealers.join(',')
            apiData.e_eten_userID = '0'
        } else if (currentException.exceptionType === 'Exclude') {
            apiData.i_eten_userID = '0'
            apiData.e_eten_userID = currentException.dealers.join(',')
        }

        let response
        if (editMode.value) {
            // Update existing
            apiData.id = currentException.id
            response = await api.put('maintenance/update-material-exception', apiData)
        } else {
            // Create new
            response = await api.post('maintenance/create-material-exception', apiData)
        }

        if (response.data.status === 1) {
            // Refresh the list
            await fetchMaterialExceptions()
            closeDialog()
            toast.add({ 
                severity: 'success', 
                summary: 'Success', 
                detail: `Material exception ${editMode.value ? 'updated' : 'created'} successfully`, 
                life: 3000 
            })
        } else {
            console.error('API returned error:', response.data)
            toast.add({ severity: 'error', summary: 'Error', detail: `Failed to ${editMode.value ? 'update' : 'create'} material exception`, life: 3000 })
        }
    } catch (error) {
        console.error('Error saving material exception:', error)
        toast.add({ severity: 'error', summary: 'Error', detail: `Error ${editMode.value ? 'updating' : 'creating'} material exception`, life: 3000 })
    } finally {
        loading.value = false
    }
}

const closeDialog = () => {
    showAddDialog.value = false
    editMode.value = false
    Object.assign(currentException, {
        id: null,
        materialCode: '',
        materialDescription: '',
        exceptionType: '',
        dealers: [],
        status: true
    })
}

const fetchMaterialExceptions = async () => {
    try {
        loading.value = true
        const response = await api.get('maintenance/list-material-exception')

        console.log('API Response:', response.data)

        if (response.data.status === 1 && response.data.admin_data) {
            const adminData = response.data.admin_data
            
            materialExceptions.value = adminData.map(item => {
                // Calculate dealer counts
                const includeDealers = item.i_eten_userID && item.i_eten_userID !== '0' 
                    ? item.i_eten_userID.split(',') 
                    : []
                const excludeDealers = item.e_eten_userID && item.e_eten_userID !== '0' 
                    ? item.e_eten_userID.split(',') 
                    : []
                
                const totalDealers = includeDealers.length + excludeDealers.length

                // Determine exception type
                let exceptionType = 'Include'
                if (item.i_eten_userID === '0' && item.e_eten_userID && item.e_eten_userID !== '0') {
                    exceptionType = 'Exclude'
                } else if (item.i_eten_userID && item.i_eten_userID !== '0' && item.e_eten_userID && item.e_eten_userID !== '0') {
                    exceptionType = 'Mixed'
                }

                // Combine all dealer IDs
                const allDealerIds = [...includeDealers, ...excludeDealers]

                // Find material description
                const materialInfo = materialOptions.value.find(m => m.code === item.materialid)

                return {
                    id: item.id,
                    materialCode: item.materialid,
                    materialDescription: materialInfo ? materialInfo.description : `Material ${item.materialid}`,
                    exceptionType: exceptionType,
                    dealers: allDealerIds,
                    dealerCount: totalDealers,
                    status: item.status === 1,
                    created: item.created
                }
            })
        } else {
            console.error('API returned error or invalid data:', response.data)
            materialExceptions.value = []
        }
    } catch (error) {
        console.error('Error fetching material exceptions:', error)
        materialExceptions.value = []
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to load material exceptions', life: 3000 })
    } finally {
        loading.value = false
    }
}

onMounted(() => {
    fetchMaterialExceptions()
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