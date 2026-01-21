<template>
    <Fluid>
        <div class="flex flex-col md:flex-row gap-8">
            <div class="card flex flex-col gap-6 w-full">
                <div class="text-2xl font-bold text-gray-800 border-b pb-2">Material Exception</div>

                <LoadingPage v-if="loading" :message="'Loading Material Exception...'" :sub-message="'Fetching your Material Exception list'" />

                <DataTable
                    v-else
                    :value="materialExceptions"
                    :paginator="true"
                    :rows="10"
                    :rowsPerPageOptions="[10, 20, 50, 100]"
                    dataKey="id"
                    :rowHover="true"
                    :filters="filters"
                    :globalFilterFields="['materialCode', 'exceptionType']"
                    responsiveLayout="scroll"
                    class="rounded-table"
                    v-model:expandedRows="expandedRows"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
                    paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                >
                    <template #header>
                        <div class="flex items-center justify-between gap-4 w-full flex-wrap">
                            <div class="flex items-center gap-2 w-full max-w-md">
                                <IconField class="flex-1">
                                    <InputIcon>
                                        <i class="pi pi-search" />
                                    </InputIcon>
                                    <InputText v-model="filters['global'].value" placeholder="Quick Search" class="w-full" />
                                </IconField>
                                <!-- <Button type="button" icon="pi pi-cog" class="p-button" /> -->
                            </div>
                            <div>
                                <Button v-if="canUpdate" label="Create" icon="pi pi-plus" class="p-button-primary" @click="openAddDialog" />
                            </div>
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

                    <Column expander style="width: 3rem" />

                    <Column header="Material" style="min-width: 12rem">
                        <template #body="{ data }">
                            <div class="flex items-center gap-2">
                                <i class="pi pi-box text-blue-500"></i>
                                <div>
                                    <div class="font-bold text-gray-800">{{ data.materialCode }}</div>
                                    <div class="text-sm text-gray-600">{{ data.materialDescription }}</div>
                                </div>
                            </div>
                        </template>
                    </Column>

                    <Column header="Type" style="min-width: 10rem">
                        <template #body="{ data }">
                            <span :class="['px-3 py-1 text-base font-semibold rounded-full', data.exceptionType === 'INCLUDE' ? 'text-green-700' : data.exceptionType === 'EXCLUDE' ? 'text-red-700' : 'text-gray-700']">
                                {{ data.exceptionType }}
                            </span>
                        </template>
                    </Column>

                    <Column header="Dealer" style="min-width: 10rem">
                        <template #body="{ data }">
                            <div class="text-xm font-semibold">
                                <Badge :value="data.dealerCount" class="mr-2" />
                                dealer(s)
                            </div>
                        </template>
                    </Column>

                    <Column header="Status" style="min-width: 10rem">
                        <template #body="{ data }">
                            <Tag :value="data.status ? 'Active' : 'Inactive'" :severity="data.status ? 'success' : 'danger'" />
                        </template>
                    </Column>

                    <Column v-if="canUpdate" header="Action" style="min-width: 10rem">
                        <template #body="{ data }">
                            <div class="flex gap-1">
                                <Button icon="pi pi-pencil" class="p-button-info p-button-text p-button-sm" v-tooltip="'Edit'" @click="editException(data)" />
                            </div>
                        </template>
                    </Column>

                    <!-- Expanded Dealers Table -->
                    <template #expansion="{ data }">
                        <div class="p-4 bg-gray-50 border-t border-gray-200 rounded-b-lg">
                            <DataTable :value="data.dealers" :rows="5" :paginator="data.dealers && data.dealers.length > 5" responsiveLayout="scroll" size="small" class="rounded-table">
                                <Column header="Customer Name" style="min-width: 15rem">
                                    <template #body="{ data: dealer }">
                                        <div class="font-medium text-gray-800">{{ dealer.label }}</div>
                                    </template>
                                </Column>
                                <Column header="Customer Account No" style="min-width: 10rem">
                                    <template #body="{ data: dealer }">
                                        {{ dealer.custAccountNo }}
                                    </template>
                                </Column>
                                <Column header="Address" style="min-width: 20rem">
                                    <template #body="{ data: dealer }">
                                        <div class="text-sm text-gray-600">{{ dealer.address || '-' }}</div>
                                    </template>
                                </Column>
                            </DataTable>
                        </div>
                    </template>
                </DataTable>
            </div>
        </div>

        <!-- Add/Edit Dialog -->
        <Dialog v-model:visible="showAddDialog" :header="editMode ? 'Edit Material Exception' : 'Add Material Exception'" :modal="true" class="p-fluid" :style="{ width: '60rem' }" :closable="!dialogLoading">
            <div v-if="dialogLoading" class="text-center py-8"><i class="pi pi-spinner pi-spin text-2xl mr-2"></i> Loading form data...</div>

            <div v-else class="grid grid-cols-1 gap-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="block font-bold text-gray-700 mb-2">Material Code *</label>
                        <Dropdown v-if="!editMode" v-model="currentException.materialCode" :options="materialOptions" optionLabel="materialid" optionValue="materialid" placeholder="Select Material" class="w-full" filter @change="onMaterialChange" />
                        <InputText v-else v-model="currentException.materialCode" type="text" placeholder="Material Code" class="w-full" disabled />
                        <small class="text-gray-500">Only materials not in existing exceptions are shown</small>
                    </div>
                    <div>
                        <label class="block font-bold text-gray-700 mb-2">Material Description</label>
                        <InputText v-model="currentException.materialDescription" type="text" placeholder="Material description" class="w-full" disabled />
                    </div>
                </div>

                <div>
                    <label class="block font-bold text-gray-700 mb-2">Exception Type *</label>
                    <Dropdown v-model="currentException.exceptionType" :options="exceptionTypeOptions" optionLabel="label" optionValue="value" placeholder="Select Type" class="w-full" />
                </div>

                <div>
                    <div class="flex items-center justify-between mb-2">
                        <label class="block font-bold text-gray-700">Dealer List *</label>
                        <span class="text-sm text-gray-500">{{ currentException.dealers.length }} dealers selected</span>
                    </div>

                    <div class="flex gap-2 mb-3">
                        <Button label="Select All" class="p-button-outlined p-button-secondary p-button-sm" @click="selectAllDealers" />
                        <Button label="Clear All" class="p-button-outlined p-button-danger p-button-sm" @click="clearAllDealers" />
                    </div>

                    <MultiSelect v-model="currentException.dealers" :options="allDealers" optionLabel="label" optionValue="value" filter display="chip" placeholder="Search or Select Dealers" class="w-full" :maxSelectedLabels="10">
                        <template #option="slotProps">
                            <div class="flex flex-col">
                                <div class="font-medium text-gray-800">{{ slotProps.option.label }}</div>
                                <small class="text-gray-500">{{ slotProps.option.group }}</small>
                            </div>
                        </template>
                    </MultiSelect>
                </div>

                <div>
                    <label class="block font-bold text-gray-700 mb-2">Status</label>
                    <div class="flex items-center gap-3">
                        <InputSwitch v-model="currentException.status" />
                        <span :class="currentException.status ? 'text-green-600' : 'text-gray-600'">
                            {{ currentException.status ? 'Active' : 'Inactive' }}
                        </span>
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
import { useMenuStore } from '@/store/menu';

const menuStore = useMenuStore();
const canUpdate = computed(() => menuStore.canWrite('Material Exception'));

const toast = useToast();
const loading = ref(false);
const dialogLoading = ref(false);
const showAddDialog = ref(false);
const editMode = ref(false);
const expandedRows = ref([]);

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

const allDealers = computed(() =>
    dealerOptions.value.flatMap((group) =>
        group.items.map((d) => ({
            label: `${d.label}`,
            value: d.value,
            group: group.label
        }))
    )
);

const isDialogFormValid = computed(() => currentException.materialCode && currentException.exceptionType && currentException.dealers.length > 0);

const onMaterialChange = () => {
    const selected = materialOptions.value.find((m) => m.materialid === currentException.materialCode);
    if (selected) {
        currentException.materialDescription = selected.material;
    }
};

const selectAllDealers = () => (currentException.dealers = allDealers.value.map((d) => d.value));
const clearAllDealers = () => (currentException.dealers = []);

const openAddDialog = async () => {
    showAddDialog.value = true;
    dialogLoading.value = true;
    try {
        await Promise.all([fetchMaterials(), fetchDealers()]);
    } catch {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to load form data', life: 3000 });
    } finally {
        dialogLoading.value = false;
    }
};

const editException = async (data) => {
    editMode.value = true;
    dialogLoading.value = true;
    showAddDialog.value = true;
    try {
        await fetchDealers();
        Object.assign(currentException, { 
            ...data, 
            materialCode: data.materialCode, // materialid
            materialDescription: data.materialDescription, // material description
            dealers: data.dealers.map((d) => d.id) 
        });
    } finally {
        dialogLoading.value = false;
    }
};

const saveException = async () => {
    try {
        loading.value = true;
        dialogLoading.value = true;
        const formData = new FormData();
        formData.append('materialid', currentException.materialCode);
        formData.append('status', currentException.status ? '1' : '0');
        formData.append('type', currentException.exceptionType);
        formData.append('etenUserID', currentException.dealers.join(','));

        const endpoint = editMode.value ? `maintenance/update-material-exception/${currentException.id}` : 'maintenance/create-material-exception';

        const response = await api.post(endpoint, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        if (response.data.status === 1) {
            await fetchMaterialExceptions();
            closeDialog();
            toast.add({
                severity: 'success',
                summary: 'Success',
                detail: `Material exception ${editMode.value ? 'updated' : 'created'} successfully`,
                life: 3000
            });
        }
    } finally {
        loading.value = false;
        dialogLoading.value = false;
    }
};

const closeDialog = () => {
    showAddDialog.value = false;
    editMode.value = false;
    dialogLoading.value = false;
    Object.assign(currentException, { id: null, materialCode: '', materialDescription: '', exceptionType: '', dealers: [], status: true });
};

const fetchMaterials = async () => {
    const formData = new FormData();
    formData.append('type', 'EXCEPTION');
    const response = await api.post('list-material', formData);
    materialOptions.value =
        response.data.admin_data?.map((m) => ({
            materialid: m.materialid,
            material: m.material
        })) || [];
};

const fetchDealers = async () => {
    const formData = new FormData();
    formData.append('mainBranch', 0);
    const response = await api.post('list_dealer', formData);
    const formatted = [];
    const mapBranch = (branch, prefix = '', parentState = '') => {
        const shop = branch.shop;
        const state = shop.state || parentState || 'Unknown';
        formatted.push({
            label: `${prefix}${shop.companyName1} (${shop.custAccountNo})`,
            value: shop.id,
            group: state
        });
        if (branch.subBranches) Object.values(branch.subBranches).forEach((sub) => mapBranch(sub, prefix + '╰┈➤ ', state));
    };
    Object.values(response.data.admin_data).forEach((branch) => mapBranch(branch));
    const grouped = {};
    formatted.forEach((d) => {
        if (!grouped[d.group]) grouped[d.group] = { label: d.group, items: [] };
        grouped[d.group].items.push({ label: d.label, value: d.value });
    });
    dealerOptions.value = Object.values(grouped);
};

const fetchMaterialExceptions = async () => {
    loading.value = true;

    try {
        const response = await api.get('maintenance/list-material-exception');
        const adminData = response.data.admin_data || [];

        materialExceptions.value = adminData.map((item) => {
            const includeIds =
                item.i_eten_userID
                    ?.split(',')
                    .map((id) => parseInt(id))
                    .filter(Boolean) || [];
            const excludeIds =
                item.e_eten_userID
                    ?.split(',')
                    .map((id) => parseInt(id))
                    .filter(Boolean) || [];
            const exceptionType = includeIds.length ? 'INCLUDE' : excludeIds.length ? 'EXCLUDE' : 'Unknown';
            const dealerDetails = Array.isArray(item.etenUserList)
                ? item.etenUserList.map((d) => ({
                      id: d.id,
                      label: `${d.companyName1} ${d.companyName2 || ''}`.trim(),
                      custAccountNo: d.custAccountNo || '',
                      address: `${d.addressLine2 || ''} ${d.addressLine3 || ''} ${d.addressLine4 || ''}`.trim(),
                      group: d.state || 'Unknown'
                  }))
                : [];

            return {
                id: item.id,
                materialCode: item.materialid, // materialid from API
                materialDescription: item.materialdescription || item.materialid, // Use materialdescription from API response
                exceptionType,
                dealers: dealerDetails,
                dealerCount: dealerDetails.length,
                status: item.status === 1,
                created: item.created
            };
        });
    } catch (error) {
        console.error('Error fetching material exceptions:', error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to load material exceptions', life: 3000 });
    } finally {
        loading.value = false;
    }
};

onMounted(fetchMaterialExceptions);
</script>

<style scoped>
:deep(.rounded-table) {
    border-radius: 12px;
    overflow: hidden;
    border: 1px solid #e5e7eb;

    .p-datatable-header {
        border-top-left-radius: 12px;
        border-top-right-radius: 12px;
    }

    .p-paginator-bottom {
        border-bottom-left-radius: 12px;
        border-bottom-right-radius: 12px;
    }

    .p-datatable-thead > tr > th {
        &:first-child {
            border-top-left-radius: 12px;
        }
        &:last-child {
            border-top-right-radius: 12px;
        }
    }

    .p-datatable-tbody > tr:last-child > td {
        &:first-child {
            border-bottom-left-radius: 0;
        }
        &:last-child {
            border-bottom-right-radius: 0;
        }
    }

    .p-datatable-tbody > tr.p-datatable-emptymessage > td {
        border-bottom-left-radius: 12px;
        border-bottom-right-radius: 12px;
    }
}
</style>