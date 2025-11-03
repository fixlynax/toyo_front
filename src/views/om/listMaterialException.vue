<template>
    <Fluid>
        <div class="flex flex-col md:flex-row gap-8">
            <div class="card flex flex-col gap-6 w-full">
                <!-- Header -->
                <div class="text-2xl font-bold text-gray-800 border-b pb-2 mb-1">Material Exception List</div>

                <!-- 🟢 Only show LoadingPage during initial load, hide DataTable completely -->
                <LoadingPage v-if="loading" :message="'Loading Material Exception...'" :sub-message="'Fetching your Material Exception list'" />

                <!-- Material Exceptions Table -->
                <DataTable v-else :value="materialExceptions" :paginator="true" :rows="10" :rowsPerPageOptions="[10, 25, 50, 100]" dataKey="id" :rowHover="true" :filters="filters" responsiveLayout="scroll" class="rounded-table">
                    <template #header>
                        <div class="flex items-center justify-between gap-4 w-full flex-wrap">
                            <!-- Left: Search Field + Cog Button -->
                            <div class="flex items-center gap-2 w-full max-w-md">
                                <IconField class="flex-1">
                                    <InputIcon>
                                        <i class="pi pi-search" />
                                    </InputIcon>
                                    <InputText v-model="filters['global'].value" placeholder="Quick Search" class="w-full" />
                                </IconField>
                                <Button type="button" icon="pi pi-cog" class="p-button" />
                            </div>

                            <!-- Right: Create Event Button -->
                            <Button label="Create" icon="pi pi-plus" style="width: fit-content" class="p-button-primary" @click="openAddDialog" />
                        </div>
                    </template>

                    <template #empty>
                        <div class="text-center text-gray-500 py-8">
                            <i class="pi pi-inbox text-4xl mb-2"></i>
                            <div>No material exceptions found.</div>
                            <div class="text-sm mt-1">Add your first material exception to get started.</div>
                            <Button label="Add First Exception" icon="pi pi-plus" class="p-button-outlined mt-4" @click="openAddDialog" />
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
        <Dialog v-model:visible="showAddDialog" :header="editMode ? 'Edit Material Exception' : 'Add Material Exception'" :modal="true" class="p-fluid" :style="{ width: '60rem' }" :closable="!dialogLoading">
            <div v-if="dialogLoading" class="text-center py-8">
                <i class="pi pi-spinner pi-spin text-2xl mr-2"></i>
                Loading form data...
            </div>

            <div v-else class="grid grid-cols-1 gap-4">
                <!-- Material Selection -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="block font-bold text-gray-700 mb-2">Material Code *</label>
                        <!-- only display when add mode -->
                        <Dropdown v-if="!editMode" v-model="currentException.materialCode" :options="materialOptions" optionLabel="materialid" optionValue="materialid" placeholder="Select Material" class="w-full" filter @change="onMaterialChange" />

                        <!-- 🟣 Show InputText only when EDIT mode -->
                        <InputText v-else v-model="currentException.materialCode" type="text" placeholder="Material Code" class="w-full" disabled />

                        <small class="text-gray-500"> Only materials not in existing exceptions are shown </small>
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
                    <MultiSelect v-model="currentException.dealers" :options="allDealers" optionLabel="label" optionValue="value" filter display="chip" placeholder="Search or Select Dealers" class="w-full" :maxSelectedLabels="10">
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
                <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="closeDialog" :disabled="dialogLoading" />
                <Button :label="editMode ? 'Update' : 'Add Exception'" icon="pi pi-check" class="p-button-primary" :disabled="!isDialogFormValid || dialogLoading" @click="saveException" />
            </template>
        </Dialog>
    </Fluid>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { FilterMatchMode } from '@primevue/core/api';
import { useToast } from 'primevue/usetoast';
import api from '@/service/api';
import LoadingPage from '@/components/LoadingPage.vue';

const toast = useToast();
const loading = ref(false);
const dialogLoading = ref(false);
const showAddDialog = ref(false);
const editMode = ref(false);

const filters = reactive({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});

const currentException = reactive({
    id: null,
    materialCode: '',
    materialDescription: '',
    exceptionType: '',
    dealers: [],
    status: true
});

const materialExceptions = ref([]);
const materialOptions = ref([]);
const dealerOptions = ref([]);

const exceptionTypeOptions = ref([
    { label: 'INCLUDE', value: 'INCLUDE' },
    { label: 'EXCLUDE', value: 'EXCLUDE' }
]);

// Flattened dealer list for global search & combined display
const allDealers = computed(() =>
    dealerOptions.value.flatMap((group) =>
        group.items.map((d) => ({
            label: `${d.label} (${d.value})`,
            value: d.value,
            group: group.label
        }))
    )
);

const isDialogFormValid = computed(() => {
    return currentException.materialCode && currentException.exceptionType && currentException.dealers.length > 0;
});

const getTypeSeverity = (type) => (type === 'INCLUDE' ? 'success' : 'warning');

const onMaterialChange = () => {
    const selected = materialOptions.value.find((m) => m.materialid === currentException.materialCode);
    if (selected) {
        currentException.materialDescription = selected.material || `Material ${selected.materialid}`;
    }
};

const selectAllDealers = () => {
    currentException.dealers = allDealers.value.map((d) => d.value);
};

const clearAllDealers = () => {
    currentException.dealers = [];
};

const openAddDialog = async () => {
    showAddDialog.value = true;
    dialogLoading.value = true;

    try {
        // Load materials and dealers in parallel
        await Promise.all([fetchMaterials(), fetchDealers()]);
    } catch (error) {
        console.error('Error loading dialog data:', error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to load form data', life: 3000 });
    } finally {
        dialogLoading.value = false;
    }
};

const editException = async (data) => {
    editMode.value = true;

    // Load dealers first, then set the form data
    dialogLoading.value = true;
    showAddDialog.value = true;

    try {
        await fetchDealers();

        // Convert dealer IDs to numbers for proper comparison with multiselect values
        const dealerIds = Array.isArray(data.dealers) ? data.dealers.map((id) => parseInt(id)) : [];

        Object.assign(currentException, {
            ...data,
            dealers: dealerIds
        });
    } catch (error) {
        console.error('Error loading dealers for edit:', error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to load dealer data', life: 3000 });
    } finally {
        dialogLoading.value = false;
    }
};

const deleteException = async (id) => {
    if (confirm('Are you sure you want to delete this exception?')) {
        try {
            loading.value = true;
            const response = await api.delete(`maintenance/delete-material-exception/${id}`);

            if (response.data.status === 1) {
                // Remove from local list
                materialExceptions.value = materialExceptions.value.filter((e) => e.id !== id);
                toast.add({ severity: 'success', summary: 'Success', detail: 'Material exception deleted successfully', life: 3000 });
            } else {
                console.error('API returned error:', response.data);
                toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete material exception', life: 3000 });
            }
        } catch (error) {
            console.error('Error deleting material exception:', error);
            toast.add({ severity: 'error', summary: 'Error', detail: 'Error deleting material exception', life: 3000 });
        } finally {
            loading.value = false;
        }
    }
};

const saveException = async () => {
    try {
        loading.value = true;
        dialogLoading.value = true;

        // Prepare data for API - matching backend expected structure
        const formData = new FormData();
        formData.append('materialid', currentException.materialCode); // Fixed parameter name
        formData.append('status', currentException.status ? '1' : '0');
        formData.append('type', currentException.exceptionType);
        formData.append('etenUserID', currentException.dealers.join(',')); // Fixed parameter name

        let response;
        if (editMode.value) {
            // Update existing - use PUT method with ID in URL and form data
            response = await api.post(`maintenance/update-material-exception/${currentException.id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
        } else {
            // Create new - use POST method with form data
            response = await api.post('maintenance/create-material-exception', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
        }

        if (response.data.status === 1) {
            // Refresh the list
            await fetchMaterialExceptions();
            closeDialog();
            toast.add({
                severity: 'success',
                summary: 'Success',
                detail: `Material exception ${editMode.value ? 'updated' : 'created'} successfully`,
                life: 3000
            });
        } else {
            console.error('API returned error:', response.data);
            const errorMessage = response.data.error?.message || `Failed to ${editMode.value ? 'update' : 'create'} material exception`;
            toast.add({ severity: 'error', summary: 'Error', detail: errorMessage, life: 3000 });
        }
    } catch (error) {
        console.error('Error saving material exception:', error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: `Error ${editMode.value ? 'updating' : 'creating'} material exception`,
            life: 3000
        });
    } finally {
        loading.value = false;
        dialogLoading.value = false;
    }
};

const closeDialog = () => {
    showAddDialog.value = false;
    editMode.value = false;
    dialogLoading.value = false;
    Object.assign(currentException, {
        id: null,
        materialCode: '',
        materialDescription: '',
        exceptionType: '',
        dealers: [],
        status: true
    });
};

// Fetch materials for dropdown (only materials not in existing exceptions)
const fetchMaterials = async () => {
    try {
        const formData = new FormData();
        formData.append('type', 'EXCEPTION');

        const response = await api.post('list-material', formData);

        if (response.data.status === 1 && response.data.admin_data) {
            materialOptions.value = response.data.admin_data.map((material) => ({
                materialid: material.materialid,
                material: material.material,
                pattern_name: material.pattern_name,
                sectionwidth: material.sectionwidth,
                tireseries: material.tireseries,
                rimdiameter: material.rimdiameter
            }));
        } else {
            console.error('API returned error or invalid data:', response.data);
            materialOptions.value = [];
        }
    } catch (error) {
        console.error('Error fetching materials:', error);
        materialOptions.value = [];
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to load materials', life: 3000 });
    }
};

// Fetch dealers for dropdown (enhanced hierarchy mapping)
const fetchDealers = async () => {
    try {
        const formData = new FormData();
        formData.append('mainBranch', 1);

        const response = await api.post('list_dealer', formData);

        if (response.data.status === 1 && response.data.admin_data) {
            const adminData = response.data.admin_data;
            const formattedDealers = [];

            /**
             * Recursive function to map branch hierarchy
             * @param {Object} branch - current branch object
             * @param {String} prefix - visual indentation for labels
             * @param {String} parentState - inherited state if missing
             */
            const mapBranchHierarchy = (branch, prefix = '', parentState = '') => {
                const shop = branch.shop;
                const state = shop.state || parentState || 'Unknown';
                const isSubBranch = !!prefix; // true if nested

                formattedDealers.push({
                    // 🟢 Main branch → just name
                    // 🟢 Sub branch → name + acc no
                    label: isSubBranch ? `${prefix}${shop.companyName1} (${shop.custAccountNo})` : `${prefix}${shop.companyName1}`,
                    value: shop.id,
                    group: state,
                    type: isSubBranch ? 'Sub Branch' : 'Main Branch'
                });

                // 🧩 Recurse into sub-branches if any
                if (branch.subBranches && Object.keys(branch.subBranches).length > 0) {
                    Object.values(branch.subBranches).forEach((subBranch) => {
                        mapBranchHierarchy(subBranch, prefix + '╰┈➤ ', state);
                    });
                }
            };

            // 🧩 Loop through all main branches
            Object.values(adminData).forEach((branch) => mapBranchHierarchy(branch));

            // 🏷️ Group by state for grouped dropdown
            const groupedDealers = {};
            formattedDealers.forEach((dealer) => {
                if (!groupedDealers[dealer.group]) {
                    groupedDealers[dealer.group] = {
                        label: dealer.group,
                        items: []
                    };
                }

                groupedDealers[dealer.group].items.push({
                    label: dealer.label,
                    value: dealer.value
                });
            });

            // 🟩 Final grouped structure
            dealerOptions.value = Object.values(groupedDealers);
        } else {
            console.error('API returned error or invalid data:', response.data);
            dealerOptions.value = [];
        }
    } catch (error) {
        console.error('Error fetching dealers:', error);
        dealerOptions.value = [];
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load dealers',
            life: 3000
        });
    }
};

const fetchMaterialExceptions = async () => {
    try {
        loading.value = true;
        const response = await api.get('maintenance/list-material-exception');

        console.log('API Response:', response.data);

        if (response.data.status === 1 && response.data.admin_data) {
            const adminData = response.data.admin_data;

            materialExceptions.value = adminData.map((item) => {
                // Determine exception type based on your criteria
                let exceptionType = '';
                let dealerIds = [];
                let dealerCount = 0;

                // Check for Include type: i_eten_userID not null && e_eten_userID null
                if (item.i_eten_userID && item.i_eten_userID !== '0' && item.i_eten_userID !== '' && (!item.e_eten_userID || item.e_eten_userID === '0' || item.e_eten_userID === '')) {
                    exceptionType = 'INCLUDE';
                    dealerIds = item.i_eten_userID
                        .split(',')
                        .filter((id) => id.trim() !== '')
                        .map((id) => parseInt(id));
                    dealerCount = dealerIds.length;
                }
                // Check for Exclude type: i_eten_userID null && e_eten_userID not null
                else if ((!item.i_eten_userID || item.i_eten_userID === '0' || item.i_eten_userID === '') && item.e_eten_userID && item.e_eten_userID !== '0' && item.e_eten_userID !== '') {
                    exceptionType = 'EXCLUDE';
                    dealerIds = item.e_eten_userID
                        .split(',')
                        .filter((id) => id.trim() !== '')
                        .map((id) => parseInt(id));
                    dealerCount = dealerIds.length;
                }
                // Handle edge cases or invalid data
                else {
                    exceptionType = 'Unknown';
                    // Try to get dealer count from dealerSum if available
                    dealerCount = item.dealerSum || 0;
                }

                return {
                    id: item.id,
                    materialCode: item.materialid,
                    materialDescription: `Material ${item.materialid}`, // Will be updated when we fetch materials
                    exceptionType: exceptionType,
                    dealers: dealerIds,
                    dealerCount: dealerCount,
                    status: item.status === 1,
                    created: item.created,
                    // Keep original fields for reference
                    original_i_eten_userID: item.i_eten_userID,
                    original_e_eten_userID: item.e_eten_userID
                };
            });

            // Update material descriptions with actual data
            await fetchMaterials();
            materialExceptions.value = materialExceptions.value.map((exception) => {
                const materialInfo = materialOptions.value.find((m) => m.materialid === exception.materialCode);
                return {
                    ...exception,
                    materialDescription: materialInfo ? materialInfo.material : `Material ${exception.materialCode}`
                };
            });
        } else {
            console.error('API returned error or invalid data:', response.data);
            materialExceptions.value = [];
        }
    } catch (error) {
        console.error('Error fetching material exceptions:', error);
        materialExceptions.value = [];
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to load material exceptions', life: 3000 });
    } finally {
        loading.value = false;
    }
};

onMounted(() => {
    fetchMaterialExceptions();
});
</script>
