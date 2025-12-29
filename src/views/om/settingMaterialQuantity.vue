<template>
    <div class="card">
        <div class="text-2xl font-bold text-gray-800 border-b pb-2 mb-4">Setting Material Quantity</div>

        <LoadingPage v-if="globalLoading" message="Loading..." />

        <div v-else>
            <div class="p-4 mb-4 bg-gray-50 rounded-lg">
                <div class="flex items-center gap-4 flex-wrap">
                    <div class="flex-1">
                        <Dropdown v-model="selectedDealer" :options="dealerOptions" optionLabel="label" optionValue="value" placeholder="Select a dealer" class="w-full" :loading="loadingDealers" :disabled="loadingDealers" @change="onDealerChange" />
                    </div>

                    <div v-if="selectedDealer" class="flex items-end gap-2">
                        <Button label="Clear Selection" icon="pi pi-times" severity="secondary" @click="clearDealerSelection" />
                    </div>
                </div>
            </div>

            <div v-if="selectedDealer && !loadingMaterials">
                <DataTable
                    :value="materialList"
                    :paginator="true"
                    :rows="10"
                    :rowsPerPageOptions="[5, 10, 20, 50]"
                    dataKey="material_id"
                    removableSort
                    :rowHover="true"
                    :loading="tableLoading"
                    :filters="filters"
                    filterDisplay="menu"
                    class="rounded-table"
                    :globalFilterFields="['pattern_name', 'material_id', 'material_desc']"
                    paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
                >
                    <template #header>
                        <div class="flex items-center justify-between gap-4 w-full flex-wrap">
                            <div class="flex items-center gap-2 w-full max-w-md">
                                <IconField class="flex-1">
                                    <InputIcon>
                                        <i class="pi pi-search" />
                                    </InputIcon>
                                    <InputText v-model="filters['global'].value" placeholder="Search by pattern, material ID, or description" class="w-full" />
                                </IconField>
                            </div>

                            <div class="flex items-center gap-2 ml-auto">
                                <Button type="button" label="Export Excel" icon="pi pi-file-export" class="p-button-success" @click="exportMaterials" :loading="exportLoading" />
                                <Button type="button" label="Bulk Update" icon="pi pi-file-import" class="p-button-primary" @click="triggerImport" :loading="importLoading" :disabled="!selectedDealer" />
                                <input ref="importFileInput" type="file" accept=".xlsx,.xls,.csv" style="display: none" @change="handleImport" />
                                <Button type="button" icon="pi pi-refresh" class="p-button-secondary" @click="fetchMaterials" :loading="tableLoading" />
                            </div>
                        </div>
                    </template>

                    <template #empty>
                        <div class="text-center py-8 text-gray-500">
                            <i class="pi pi-inbox text-4xl mb-2"></i>
                            <p>No material data found for selected dealer.</p>
                        </div>
                    </template>

                    <template #loading>
                        <div class="text-center py-8">
                            <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="4" />
                            <p class="mt-2">Loading material data...</p>
                        </div>
                    </template>

                    <Column field="pattern_name" header="Pattern" style="min-width: 12rem" sortable>
                        <template #body="{ data }">
                            <div>
                                <div class="font-medium">{{ data.pattern_name }}</div>
                                <div class="text-xs text-gray-500">{{ data.pattern_code }}</div>
                            </div>
                        </template>
                    </Column>

                    <Column field="material_id" header="Material ID" style="min-width: 10rem" sortable />

                    <Column field="material_desc" header="Description" style="min-width: 15rem" sortable />

                    <Column field="max_qty" header="Max Quantity" style="min-width: 8rem" sortable>
                        <template #body="{ data }">
                            <div
                                class="font-semibold"
                                :class="{
                                    'text-green-600': data.max_qty > 0,
                                    'text-gray-400': data.max_qty === 0
                                }"
                            >
                                {{ data.max_qty || 0 }}
                            </div>
                        </template>
                    </Column>
                </DataTable>
            </div>

            <div v-else-if="!selectedDealer && !loadingMaterials" class="text-center py-12 bg-gray-50 rounded-lg">
                <i class="pi pi-users text-5xl text-gray-300 mb-4"></i>
                <h3 class="text-xl font-semibold text-gray-600 mb-2">Select a Dealer</h3>
                <p class="text-gray-500 mb-4">Please select a dealer from the dropdown above to view and manage their materials.</p>
            </div>
        </div>

        <Dialog v-model:visible="showImportResult" header="Import Results" :modal="true" :style="{ width: '600px' }">
            <div class="p-4">
                <div class="mb-4">
                    <div class="flex items-center gap-2 mb-2">
                        <i class="pi pi-check-circle text-green-500"></i>
                        <span class="font-medium">Successfully imported: {{ importResult.saved_count }} records</span>
                    </div>
                    <div v-if="importResult.not_saved_records && importResult.not_saved_records.length > 0">
                        <div class="flex items-center gap-2 mb-2">
                            <i class="pi pi-exclamation-triangle text-yellow-500"></i>
                            <span class="font-medium">Failed to import: {{ importResult.not_saved_records.length }} records</span>
                        </div>
                        <DataTable :value="importResult.not_saved_records" class="p-datatable-sm">
                            <Column field="row" header="Row"></Column>
                            <Column field="materialid" header="Material ID"></Column>
                            <Column field="reason" header="Reason"></Column>
                        </DataTable>
                    </div>
                </div>
            </div>
            <template #footer>
                <Button label="Close" icon="pi pi-times" @click="showImportResult = false" class="p-button-text" />
                <Button label="Refresh Data" icon="pi pi-refresh" @click="handleImportComplete" class="p-button-primary" />
            </template>
        </Dialog>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { FilterMatchMode } from '@primevue/core/api';
import api from '@/service/api';
import LoadingPage from '@/components/LoadingPage.vue';
import { useToast } from 'primevue/usetoast';
import { useMenuStore } from '@/store/menu';

const toast = useToast();
const menuStore = useMenuStore();
const importFileInput = ref();

const canUpdate = computed(() => menuStore.canWrite('Material Management'));

const globalLoading = ref(false);
const loadingDealers = ref(false);
const loadingMaterials = ref(false);
const tableLoading = ref(false);
const exportLoading = ref(false);
const importLoading = ref(false);
const showImportResult = ref(false);

const dealerList = ref([]);
const selectedDealer = ref(null);
const selectedDealerData = ref(null); // NEW: Store the full dealer data
const materialList = ref([]);
const importResult = ref({});

const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});

const dealerOptions = computed(() => {
    return dealerList.value.map((dealer) => {
        // Debug log to check structure
        console.log('Dealer item:', dealer);

        // Get shop data (it could be direct or nested)
        const shopData = dealer.shop || dealer;

        return {
            label: `${shopData.companyName1} (${shopData.custAccountNo})`,
            value: shopData.id, // This should be the shop ID
            data: dealer // Store the full dealer data
        };
    });
});

const getSelectedDealerName = () => {
    if (!selectedDealer.value || !selectedDealerData.value) return '';

    const shopData = selectedDealerData.value.shop || selectedDealerData.value;
    return shopData.companyName1 || '';
};

const fetchDealers = async () => {
    try {
        loadingDealers.value = true;
        const response = await api.post('list_dealer', {
            tabs: 'ORDER'
        });

        if (response.data.status === 1) {
            // Handle both response structures
            let dealers = response.data.admin_data;

            // If admin_data is an object (original structure), convert to array
            if (dealers && typeof dealers === 'object' && !Array.isArray(dealers)) {
                dealers = Object.values(dealers);
            }

            // Ensure we have an array
            dealerList.value = Array.isArray(dealers) ? dealers : [];

            console.log('Dealers loaded:', dealerList.value.length, 'items');
            if (dealerList.value.length > 0) {
                console.log('First dealer full data:', dealerList.value[0]);
                console.log('First dealer shop ID:', dealerList.value[0].shop?.id || dealerList.value[0].id);
                console.log('First dealer custAccountNo:', dealerList.value[0].shop?.custAccountNo || dealerList.value[0].custAccountNo);
            }
        } else {
            dealerList.value = [];
            toast.add({
                severity: 'warn',
                summary: 'Warning',
                detail: 'No dealers found',
                life: 3000
            });
        }
    } catch (error) {
        console.error('Error fetching dealers:', error);
        dealerList.value = [];
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load dealers',
            life: 3000
        });
    } finally {
        loadingDealers.value = false;
        globalLoading.value = false;
    }
};

const onDealerChange = async () => {
    if (!selectedDealer.value) {
        materialList.value = [];
        selectedDealerData.value = null;
        return;
    }

    // Find and store the selected dealer data
    selectedDealerData.value = dealerList.value.find((dealer) => {
        const shopData = dealer.shop || dealer;
        return shopData.id === selectedDealer.value;
    });

    console.log('Selected dealer ID:', selectedDealer.value);
    console.log('Selected dealer data:', selectedDealerData.value);

    if (selectedDealerData.value) {
        const shopData = selectedDealerData.value.shop || selectedDealerData.value;
        console.log('Shop ID to use:', shopData.id);
        console.log('CustAccountNo:', shopData.custAccountNo);
    }

    await fetchMaterials();
};

const fetchMaterials = async () => {
    if (!selectedDealer.value || !selectedDealerData.value) return;

    try {
        loadingMaterials.value = true;
        tableLoading.value = true;

        const shopData = selectedDealerData.value.shop || selectedDealerData.value;
        console.log('Fetching materials for dealer:', {
            selectedDealerId: selectedDealer.value,
            shopId: shopData.id,
            custAccountNo: shopData.custAccountNo
        });

        // Use the shop ID that we stored
        const response = await api.get(`maintenance/getEtenMaterial/${selectedDealer.value}`);

        console.log('API Response:', response.data);

        if (response.data.status === 1) {
            materialList.value = response.data.admin_data;
            console.log('Materials loaded:', materialList.value.length, 'items');
            console.log('Materials data:', materialList.value);

            toast.add({
                severity: 'success',
                summary: 'Success',
                detail: `Loaded ${materialList.value.length} materials`,
                life: 3000
            });
        } else {
            materialList.value = [];
            console.log('No materials found or API error:', response.data);
            toast.add({
                severity: 'warn',
                summary: 'Warning',
                detail: 'No materials found for this dealer',
                life: 3000
            });
        }
    } catch (error) {
        console.error('Error fetching materials:', error);
        console.error('Error details:', error.response?.data || error.message);
        materialList.value = [];
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load materials',
            life: 3000
        });
    } finally {
        loadingMaterials.value = false;
        tableLoading.value = false;
    }
};

const exportMaterials = async () => {
    if (!selectedDealer.value || !selectedDealerData.value) {
        toast.add({
            severity: 'warn',
            summary: 'Warning',
            detail: 'Please select a dealer first',
            life: 3000
        });
        return;
    }

    try {
        exportLoading.value = true;

        const response = await api.getDownload(`maintenance/exportEtenMaterial/${selectedDealer.value}`, {
            responseType: 'arraybuffer'
        });

        const blob = new Blob([response.data], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });

        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;

        const shopData = selectedDealerData.value.shop || selectedDealerData.value;
        const dealerName = shopData.custAccountNo || 'materials';
        a.download = `${dealerName}_material_list.xlsx`;

        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        toast.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Export completed successfully',
            life: 3000
        });
    } catch (error) {
        console.error('Error exporting materials:', error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to export materials',
            life: 3000
        });
    } finally {
        exportLoading.value = false;
    }
};

const triggerImport = () => {
    if (!selectedDealer.value) {
        toast.add({
            severity: 'warn',
            summary: 'Warning',
            detail: 'Please select a dealer first',
            life: 3000
        });
        return;
    }

    if (importFileInput.value) {
        importFileInput.value.click();
    }
};

const handleImport = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!selectedDealer.value) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No dealer selected',
            life: 3000
        });
        return;
    }

    try {
        importLoading.value = true;

        const formData = new FormData();
        formData.append('excel_file', file);

        const response = await api.postExtra(`maintenance/importEtenMaterial/${selectedDealer.value}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        if (response.data.status === 1) {
            importResult.value = response.data;
            showImportResult.value = true;

            toast.add({
                severity: 'success',
                summary: 'Success',
                detail: `Imported ${response.data.saved_count} records successfully`,
                life: 5000
            });
        } else {
            toast.add({
                severity: 'error',
                summary: 'Import Failed',
                detail: response.data.error || 'Failed to import file',
                life: 5000
            });
        }
    } catch (error) {
        console.error('Error importing file:', error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Import failed. Please check the file format.',
            life: 5000
        });
    } finally {
        importLoading.value = false;
        if (importFileInput.value) {
            importFileInput.value.value = '';
        }
    }
};

const handleImportComplete = async () => {
    showImportResult.value = false;
    await fetchMaterials();
};

const clearDealerSelection = () => {
    selectedDealer.value = null;
    selectedDealerData.value = null;
    materialList.value = [];
};

onMounted(async () => {
    globalLoading.value = true;
    await fetchDealers();
});
</script>

<style scoped>
:deep(.rounded-table) {
    border-radius: 12px;
    overflow: hidden;
    border: 1px solid #e5e7eb;

    .p-datatable-header {
        border-top-left-radius: 12px;
        border-top-right-radius: 12px;
        background-color: #f9fafb;
        border-bottom: 1px solid #e5e7eb;
        padding: 1rem 1.5rem;
    }

    .p-paginator-bottom {
        border-bottom-left-radius: 12px;
        border-bottom-right-radius: 12px;
        background-color: #f9fafb;
        border-top: 1px solid #e5e7eb;
    }

    .p-datatable-thead > tr > th {
        background-color: #f3f4f6;
        font-weight: 600;
        color: #374151;

        &:first-child {
            border-top-left-radius: 0;
        }
        &:last-child {
            border-top-right-radius: 0;
        }
    }

    .p-datatable-tbody > tr {
        transition: background-color 0.2s;

        &:hover {
            background-color: #f9fafb;
        }
    }
}

.dealer-selector {
    transition: all 0.3s ease;
}

@media (max-width: 768px) {
    :deep(.rounded-table) {
        .p-datatable-header {
            flex-direction: column;
            gap: 1rem;
        }

        .flex.items-center.justify-between {
            flex-direction: column;
            align-items: stretch;
        }

        .ml-auto {
            margin-left: 0;
            margin-top: 1rem;
        }
    }
}
</style>
