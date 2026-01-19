<script setup>
import LoadingPage from '@/components/LoadingPage.vue';
import api from '@/service/api';
import { FilterMatchMode } from '@primevue/core/api';
import { useToast } from 'primevue/usetoast';
import { computed, onBeforeMount, ref } from 'vue';

const toast = useToast();

// 🟢 State
const filters = ref({});
const materialData = ref([]);
const loading = ref(true);
const selectedStorage = ref(''); // Default storage location
const exportLoading = ref(false);
const visibleRows = ref([]);
const selectedExportIds = ref(new Set());
const storageLocations = ref([]); // Changed to ref, will be populated from API
const loadingLocations = ref(true); // Added loading state for storage locations

// 🟢 New state for stock batch dialog
const showStockBatchDialog = ref(false);
const selectedMaterial = ref(null);
const stockBatchDetails = ref([]);

// 🟢 Removed hardcoded storage locations - will be fetched from API

// 🟢 Filters
function initFilters() {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS }
    };
}

// 🟢 Status indicators for stock levels
const getStockStatus = (balance) => {
    const stock = parseFloat(balance);
    if (stock <= 0) return { label: 'Out Of Stock', severity: 'danger' };
    if (stock < 10) return { label: 'Low Stock', severity: 'warn' };
    return { label: 'Available', severity: 'success' };
};

// 🟢 Fetch Storage Locations from API
const fetchStorageLocations = async () => {
    try {
        loadingLocations.value = true;
        const response = await api.get('salesman/getStorageLocation');

        if (response.data.status === 1 && Array.isArray(response.data.admin_data)) {
            // Format the API response to match dropdown structure
            storageLocations.value = response.data.admin_data
                .filter((location) => location && location.trim() !== '') // Filter out empty/null values
                .map((location) => ({
                    code: location.trim(),
                    name: location.trim()
                }));

            // Set default storage location to first available if exists
            if (storageLocations.value.length > 0) {
                selectedStorage.value = storageLocations.value[0].code;
            } else {
                toast.add({
                    severity: 'warn',
                    summary: 'No Storage Locations',
                    detail: 'No storage locations configured for your account',
                    life: 3000
                });
            }
        } else {
            storageLocations.value = [];
            toast.add({
                severity: 'warn',
                summary: 'No Storage Data',
                detail: 'No storage locations available',
                life: 3000
            });
        }
    } catch (error) {
        console.error('Error fetching storage locations:', error);
        storageLocations.value = [];
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load storage locations',
            life: 3000
        });
    } finally {
        loadingLocations.value = false;
    }
};

// 🟢 Fetch Material Stock Levels
const fetchMaterialStock = async (storageLocation) => {
    if (!storageLocation) {
        materialData.value = [];
        visibleRows.value = [];
        loading.value = false;
        return;
    }

    try {
        loading.value = true;
        const response = await api.post('salesman/getMaterialStockLevel', {
            storageLocation: storageLocation
        });

        if (response.data.status === 1 && Array.isArray(response.data.admin_data)) {
            materialData.value = response.data.admin_data.map((material) => ({
                id: material.id,
                materialid: material.materialid,
                material: material.material,
                materialtype: material.materialtype,
                pattern: material.pattern,
                pattern_name: material.pattern_name,
                sectionwidth: material.sectionwidth,
                tireseries: material.tireseries,
                rimdiameter: material.rimdiameter,
                speedplyrating: material.speedplyrating,
                volume: material.volume,
                // Prices
                price01: material.price01,
                price02: material.price02,
                price03: material.price03,
                price04: material.price04,
                price05: material.price05,
                price01_validitystartdate: material.price01_validitystartdate,
                price02_validitystartdate: material.price02_validitystartdate,
                price03_validitystartdate: material.price03_validitystartdate,
                price04_validitystartdate: material.price04_validitystartdate,
                price05_validitystartdate: material.price05_validitystartdate,
                price_01_validityenddate: material.price_01_validityenddate,
                price_02_validityenddate: material.price_02_validityenddate,
                price_03_validityenddate: material.price_03_validityenddate,
                price_04_validityenddate: material.price_04_validityenddate,
                price_05_validityenddate: material.price_05_validityenddate,
                // Origin
                origin: material.origin,
                isSell: material.isSell,
                isWarranty: material.isWarranty,
                isTWP: material.isTWP,
                updated: material.updated,
                // Stock level data
                stock_level: material.stock_level
                    ? {
                          materialid: material.stock_level.materialid,
                          storagelocation: material.stock_level.storagelocation,
                          plant: material.stock_level.plant,
                          stocklevelmaster: material.stock_level.stocklevelmaster,
                          DOM: material.stock_level.DOM,
                          stockBalance: material.stock_level.stockBalance ? parseFloat(material.stock_level.stockBalance) : 0,
                          created: material.stock_level.created,
                          updated: material.stock_level.updated
                      }
                    : null,
                // Add stock_batch to material object
                stock_batch: material.stock_batch || []
            }));
            visibleRows.value = materialData.value;
        } else {
            materialData.value = [];
            visibleRows.value = [];
            toast.add({
                severity: 'warn',
                summary: 'No Data',
                detail: 'Out Of Stock data available for selected location',
                life: 3000
            });
        }
    } catch (error) {
        console.error('Error fetching material stock levels:', error);
        materialData.value = [];
        visibleRows.value = [];
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load material stock levels',
            life: 3000
        });
    } finally {
        loading.value = false;
    }
};

// 🟢 Handle storage location change
const handleStorageChange = () => {
    if (selectedStorage.value) {
        fetchMaterialStock(selectedStorage.value);
    } else {
        materialData.value = [];
        visibleRows.value = [];
        loading.value = false;
    }
};

// 🟢 Initial load
onBeforeMount(async () => {
    initFilters();
    await fetchStorageLocations(); // First fetch storage locations

    // Only fetch material stock if we have a storage location selected
    if (selectedStorage.value) {
        await fetchMaterialStock(selectedStorage.value); // Then fetch stock data
    } else {
        loading.value = false; // Make sure loading is false if no storage selected
    }
});

// 🟢 Parse stock level master JSON
const parseStockLevelMaster = (stockLevelMaster) => {
    try {
        if (!stockLevelMaster) return [];

        if (typeof stockLevelMaster === 'string') {
            const parsed = JSON.parse(stockLevelMaster);
            // Handle different structures
            if (parsed.stocklevelmaster) {
                return Array.isArray(parsed.stocklevelmaster) ? parsed.stocklevelmaster : [parsed.stocklevelmaster];
            } else if (Array.isArray(parsed)) {
                return parsed;
            } else {
                return [parsed];
            }
        }

        if (Array.isArray(stockLevelMaster)) {
            return stockLevelMaster;
        }

        return [stockLevelMaster];
    } catch (error) {
        console.error('Error parsing stocklevelmaster:', error, stockLevelMaster);
        return [];
    }
};

// 🟢 Calculate total stock from stock level master
const calculateTotalFromBatches = (stockLevelMaster) => {
    try {
        const batches = parseStockLevelMaster(stockLevelMaster);
        return batches.reduce((total, batch) => {
            return total + parseFloat(batch.stockbalance || batch.stockBalance || 0);
        }, 0);
    } catch (error) {
        console.error('Error calculating total stock:', error);
        return 0;
    }
};

// 🟢 Format Date Time
const formatDateTime = (dateString) => {
    if (!dateString) return '-';

    const date = new Date(dateString);
    const options = {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    };

    let formatted = date.toLocaleString('en-MY', options);

    // Convert AM/PM to uppercase regardless of case
    return formatted.replace(/\b(am|pm)\b/gi, (match) => match.toUpperCase());
};

// 🟢 Export function
const handleExport = async () => {
    const idsArray = Array.from(selectedExportIds.value).map((id) => Number(id));

    if (idsArray.length === 0) {
        toast.add({
            severity: 'warn',
            summary: 'Warning',
            detail: 'Please select at least one row to export',
            life: 3000
        });
        return;
    }

    try {
        exportLoading.value = true;

        const response = await api.postExtra(
            'material/export',
            { material_id: JSON.stringify(idsArray) },
            {
                responseType: 'blob',
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );

        const blob = new Blob([response.data], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });

        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Material_Stock_${selectedStorage.value}_${new Date().toISOString().split('T')[0]}.xlsx`;
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
        selectedExportIds.value.clear();
    } catch (error) {
        console.error('Error exporting data:', error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to export data',
            life: 3000
        });
    } finally {
        exportLoading.value = false;
    }
};

// 🟢 Toggle selection functions
const handleToggleExport = (id) => {
    if (selectedExportIds.value.has(id)) {
        selectedExportIds.value.delete(id);
    } else {
        selectedExportIds.value.add(id);
    }
};

const onTableFilter = (event) => {
    visibleRows.value = event.filteredValue || materialData.value;
};

// 🟢 Toggle all visible rows
const toggleSelectAll = () => {
    const allIds = visibleRows.value.map((item) => item.id);

    if (isAllSelected()) {
        selectedExportIds.value = new Set([...selectedExportIds.value].filter((id) => !allIds.includes(id)));
    } else {
        selectedExportIds.value = new Set([...selectedExportIds.value, ...allIds]);
    }
};

// 🟢 Computed: are all visible rows selected?
const isAllSelected = () => {
    return visibleRows.value.length > 0 && visibleRows.value.every((item) => selectedExportIds.value.has(item.id));
};

// 🟢 Stock summary computed properties
const stockSummary = computed(() => {
    const total = materialData.value.length;
    const inStock = materialData.value.filter((m) => m.stock_level?.stockBalance > 0).length;
    const outOfStock = materialData.value.filter((m) => !m.stock_level || m.stock_level.stockBalance <= 0).length;
    const lowStock = materialData.value.filter((m) => m.stock_level?.stockBalance > 0 && m.stock_level.stockBalance < 50).length;

    return { total, inStock, outOfStock, lowStock };
});

// 🟢 Format boolean values for display
const formatBoolean = (value) => {
    return value === 1 || value === true ? 'Yes' : 'No';
};

// 🟢 Show stock batch details dialog
const showStockBatch = (material) => {
    selectedMaterial.value = material;

    // Prepare stock batch details
    if (material.stock_batch && Array.isArray(material.stock_batch)) {
        stockBatchDetails.value = material.stock_batch;
    } else if (material.stock_batch && typeof material.stock_batch === 'object') {
        stockBatchDetails.value = [material.stock_batch];
    } else {
        stockBatchDetails.value = [];
    }

    showStockBatchDialog.value = true;
};

// 🟢 Close stock batch dialog
const closeStockBatchDialog = () => {
    showStockBatchDialog.value = false;
    selectedMaterial.value = null;
    stockBatchDetails.value = [];
};

// 🟢 Calculate total batch quantity
const calculateBatchTotal = computed(() => {
    return stockBatchDetails.value.reduce((total, batch) => {
        return total + parseFloat(batch.stockbalance || batch.stockBalance || 0);
    }, 0);
});
</script>

<template>
    <div class="card">
        <div class="text-2xl font-bold text-gray-800 border-b pb-2 mb-4">Material Stock Level</div>

        <!-- Loading state for both storage locations and material data -->
        <LoadingPage
            v-if="loadingLocations || (loading && selectedStorage)"
            :message="loadingLocations ? 'Loading Storage Locations...' : 'Loading Material Stock...'"
            :sub-message="loadingLocations ? 'Fetching available storage locations' : 'Fetching stock levels from warehouse'"
        />

        <!-- Show message if no storage locations available -->
        <div v-else-if="!loadingLocations && storageLocations.length === 0" class="text-center py-12">
            <div class="flex flex-col items-center gap-4">
                <i class="pi pi-warehouse text-5xl text-gray-300"></i>
                <h3 class="text-xl font-medium text-gray-600">No Storage Locations</h3>
                <p class="text-gray-500">No storage locations are configured for your account.</p>
            </div>
        </div>

        <!-- Show DataTable when storage locations are loaded and one is selected -->
        <DataTable
            v-else-if="selectedStorage"
            :value="materialData"
            @filter="onTableFilter"
            :paginator="true"
            :rows="10"
            :rowsPerPageOptions="[10, 20, 50, 100]"
            dataKey="materialid"
            removableSort
            class="rounded-table"
            :rowHover="true"
            :filters="filters"
            filterDisplay="menu"
            :globalFilterFields="['materialid', 'material', 'pattern_name', 'origin', 'rimdiameter']"
            paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
            sortField="materialid"
            :sortOrder="1"
        >
            <template #header>
                <div class="flex items-center justify-between gap-4 w-full flex-wrap">
                    <!-- Left: Search Field + Storage Location -->
                    <div class="flex items-center gap-4 w-full max-w-3xl">
                        <!-- Search Field -->
                        <IconField class="flex-1">
                            <InputIcon>
                                <i class="pi pi-search" />
                            </InputIcon>
                            <InputText v-model="filters['global'].value" placeholder="Quick Search by Material ID, Name, Pattern, etc." class="w-full" />
                        </IconField>

                        <!-- Storage Location Dropdown -->
                        <div class="flex items-center gap-2">
                            <span class="text-sm font-medium text-gray-700 whitespace-nowrap">Storage:</span>
                            <Dropdown v-model="selectedStorage" :options="storageLocations" optionLabel="name" optionValue="code" placeholder="Select Storage" class="w-48" :filter="true" @change="handleStorageChange">
                                <template #option="slotProps">
                                    <div class="flex items-center gap-2">
                                        <i class="pi pi-warehouse text-blue-600"></i>
                                        <span>{{ slotProps.option.name }}</span>
                                    </div>
                                </template>
                                <template #value="slotProps">
                                    <div v-if="slotProps.value" class="flex items-center gap-2">
                                        <i class="pi pi-warehouse text-blue-600"></i>
                                        <span>{{ storageLocations.find((s) => s.code === slotProps.value)?.name }}</span>
                                    </div>
                                    <span v-else>{{ slotProps.placeholder }}</span>
                                </template>
                            </Dropdown>
                        </div>
                    </div>

                    <!-- Right: Export Button & Stock Summary -->
                    <div class="flex items-center gap-4 ml-auto">
                        <!-- Export Button -->
                        <Button type="button" label="Export" icon="pi pi-file-export" class="p-button-success" :loading="exportLoading" @click="handleExport" :disabled="materialData.length === 0" />
                    </div>
                </div>
            </template>

            <template #empty>
                <div class="text-center py-8 text-gray-500">
                    <div class="flex flex-col items-center gap-2">
                        <i class="pi pi-box text-3xl text-blue-400"></i>
                        <span class="text-lg">No materials found</span>
                        <span class="text-sm text-gray-400">Out Of Stock data available for {{ selectedStorage }}</span>
                    </div>
                </div>
            </template>

            <template #loading> Loading data. Please wait... </template>

            <!-- Export All Column -->
            <Column header="Export" style="min-width: 3rem">
                <template #header>
                    <div class="flex justify-center">
                        <Checkbox :binary="true" :model-value="isAllSelected()" @change="toggleSelectAll" />
                    </div>
                </template>

                <template #body="{ data }">
                    <div class="flex justify-center">
                        <Checkbox :binary="true" :model-value="selectedExportIds.has(data.id)" @change="() => handleToggleExport(data.id)" />
                    </div>
                </template>
            </Column>

            <!-- Material ID & Name -->
            <Column field="materialid" header="Material" style="min-width: 8rem" sortable>
                <template #body="{ data }">
                    <div class="flex flex-col">
                        <!-- Top -->
                        <div class="font-semibold text-blue-600">{{ data.materialid }}</div>
                        <!-- Bottom -->
                        <div class="text-gray-600 text-sm truncate max-w-xs">{{ data.material }}</div>
                    </div>
                </template>
            </Column>

            <!-- Pattern -->
            <Column field="pattern" header="Pattern" style="min-width: 4rem" sortable>
                <template #body="{ data }">
                    <div class="flex flex-col">
                        <div class="font-medium">{{ data.pattern }}</div>
                        <div class="text-gray-600 text-sm">{{ data.pattern_name }}</div>
                    </div>
                </template>
            </Column>

            <!-- Size Details -->
            <Column header="Rim Diameter" style="min-width: 8rem" sortable :sort-field="'rimdiameter'">
                <template #body="{ data }">
                    <div class="flex flex-col leading-relaxed text-sm text-gray-700">
                        <div class="flex items-center justify-between mb-2">
                            <span class="font-semibold">{{ data.rimdiameter }}"</span>
                        </div>
                    </div>
                </template>
            </Column>

            <!-- Origin -->
            <Column field="origin" header="Origin" style="min-width: 3rem" sortable>
                <template #body="{ data }">
                    {{ data.origin }}
                </template>
            </Column>

            <!-- Stock Information -->
            <Column header="Stock Info" style="min-width: 14rem">
                <template #body="{ data }">
                    <template v-if="data.stock_level">
                        <div class="flex flex-col leading-relaxed text-sm text-gray-700">
                            <div class="flex items-center justify-between mb-2">
                                <span class="text-gray-800 font-semibold">Balance:</span>
                                <div class="flex items-center gap-2">
                                    <span
                                        :class="{
                                            'font-bold text-lg cursor-pointer hover:underline': true,
                                            'text-green-600': data.stock_level.stockBalance > 10,
                                            'text-yellow-600': data.stock_level.stockBalance > 0 && data.stock_level.stockBalance <= 10,
                                            'text-red-600': data.stock_level.stockBalance <= 0
                                        }"
                                        @click="showStockBatch(data)"
                                        title="Click to view batch details"
                                    >
                                        {{ data.stock_level.stockBalance || 0 }}
                                    </span>
                                    <Tag :value="getStockStatus(data.stock_level.stockBalance).label" :severity="getStockStatus(data.stock_level.stockBalance).severity" class="text-xs" />
                                </div>
                            </div>
                            <div class="flex items-center justify-between mb-2">
                                <span class="w-20 text-gray-600">Location:</span>
                                <span class="font-medium">{{ data.stock_level.storagelocation }}</span>
                            </div>
                            <div class="flex items-center justify-between mb-2">
                                <span class="w-20 text-gray-600">Plant:</span>
                                <span class="font-medium">{{ data.stock_level.plant }}</span>
                            </div>
                            <div class="flex items-center justify-between mb-2">
                                <span class="w-20 text-gray-600">DOM:</span>
                                <span class="font-medium">{{ data.stock_level.DOM || '-' }}</span>
                            </div>
                            <div class="flex items-center justify-between mb-2">
                                <span class="w-20 text-gray-600">Updated:</span>
                                <span class="font-medium text-xs">{{ formatDateTime(data.stock_level.updated) }}</span>
                            </div>
                        </div>
                    </template>
                    <template v-else>
                        <div class="text-center text-gray-400 italic py-2">Out Of Stock data</div>
                    </template>
                </template>
            </Column>

            <!-- Product Status -->
            <Column header="Status" style="min-width: 10rem">
                <template #body="{ data }">
                    <div class="flex flex-col space-y-1">
                        <div class="flex items-center justify-between">
                            <span class="text-gray-600 text-sm">Sell:</span>
                            <Tag :value="formatBoolean(data.isSell)" :severity="data.isSell ? 'info' : 'secondary'" class="text-xs" />
                        </div>
                        <div class="flex items-center justify-between">
                            <span class="text-gray-600 text-sm">Warranty:</span>
                            <Tag :value="formatBoolean(data.isWarranty)" :severity="data.isWarranty ? 'info' : 'secondary'" class="text-xs" />
                        </div>
                        <div class="flex items-center justify-between">
                            <span class="text-gray-600 text-sm">TWP:</span>
                            <Tag :value="formatBoolean(data.isTWP)" :severity="data.isTWP ? 'info' : 'secondary'" class="text-xs" />
                        </div>
                    </div>
                </template>
            </Column>

            <!-- Last Updated -->
            <Column field="updated" header="Updated" style="min-width: 8rem" sortable>
                <template #body="{ data }">
                    <div class="text-sm">
                        {{ formatDateTime(data.updated) }}
                    </div>
                </template>
            </Column>
        </DataTable>

        <!-- Show placeholder if no storage is selected but locations are available -->
        <div v-else class="text-center py-12">
            <div class="flex flex-col items-center gap-4">
                <i class="pi pi-warehouse text-5xl text-blue-300"></i>
                <h3 class="text-xl font-medium text-gray-600">Select a Storage Location</h3>
                <p class="text-gray-500">Please select a storage location from the dropdown above to view stock levels.</p>
                <Dropdown v-model="selectedStorage" :options="storageLocations" optionLabel="name" optionValue="code" placeholder="Select Storage" class="w-64" :filter="true" @change="handleStorageChange">
                    <template #option="slotProps">
                        <div class="flex items-center gap-2">
                            <i class="pi pi-warehouse text-blue-600"></i>
                            <span>{{ slotProps.option.name }}</span>
                        </div>
                    </template>
                </Dropdown>
            </div>
        </div>

        <!-- Stock Batch Dialog -->
        <Dialog v-model:visible="showStockBatchDialog" modal header="Stock Batch Detail" :style="{ width: '600px' }">
            <div v-if="selectedMaterial" class="space-y-4">
                <!-- Total Summary -->
                <div class="bg-blue-50 p-3 rounded-lg mb-4">
                    <div class="flex items-center justify-between">
                        <div>
                            <span class="text-sm text-gray-600">Total Quantity:</span>
                            <span class="ml-2 text-xl font-bold text-blue-700">{{ calculateBatchTotal }}</span>
                        </div>
                        <div>
                            <span class="text-sm text-gray-600">Number of Batches:</span>
                            <span class="ml-2 text-lg font-semibold text-gray-700">{{ stockBatchDetails.length }}</span>
                        </div>
                    </div>
                </div>

                <!-- Batch Details Table -->
                <div v-if="stockBatchDetails.length > 0">
                    <!-- <h4 class="text-lg font-medium text-gray-700 mb-2">Batch Details</h4> -->
                    <DataTable :value="stockBatchDetails" class="rounded-table" :scrollable="true" scrollHeight="300px">
                        <Column field="batchno" header="Batch No" style="min-width: 100px">
                            <template #body="{ data }">
                                <span class="font-medium">{{ data.batchno }}</span>
                            </template>
                        </Column>
                        <Column field="stockbalance" header="Stock Balance" style="min-width: 120px">
                            <template #body="{ data }">
                                <div class="text-left">
                                    <span class="font-semibold text-gray-800">{{ parseInt(parseFloat(data.stockbalance || data.stockBalance || 0)) }}</span>
                                </div>
                            </template>
                        </Column>
                        <template #empty>
                            <div class="text-center py-4 text-gray-500">No batch information available</div>
                        </template>
                    </DataTable>
                </div>

                <!-- No Batch Information -->
                <div v-else class="text-center py-6 bg-gray-50 rounded-lg">
                    <i class="pi pi-box text-3xl text-gray-300 mb-2"></i>
                    <p class="text-gray-500">No batch information available for this material</p>
                </div>
            </div>
        </Dialog>
    </div>
</template>
<style scoped>
:deep(.rounded-table) {
    border-radius: 12px;
    overflow: hidden;
    border: 1px solid #e5e7eb;

    .p-datatable-header {
        border-top-left-radius: 12px;
        border-top-right-radius: 12px;
        background-color: #f8fafc;
        padding: 1rem 1.5rem;
    }

    .p-paginator-bottom {
        border-bottom-left-radius: 12px;
        border-bottom-right-radius: 12px;
    }

    .p-datatable-thead > tr > th {
        background-color: #f8fafc;
        font-weight: 600;
        color: #374151;
        border-bottom: 2px solid #e5e7eb;

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

/* Custom styling for stock status tags */
:deep(.p-tag) {
    font-size: 0.75rem;
    padding: 0.125rem 0.5rem;
    min-width: 70px;
    text-align: center;
}

/* Scrollbar styling for batch details */
:deep(.p-datatable-tbody) {
    td {
        .max-h-32 {
            max-height: 8rem;
            &::-webkit-scrollbar {
                width: 4px;
            }
            &::-webkit-scrollbar-track {
                background: #f1f1f1;
                border-radius: 2px;
            }
            &::-webkit-scrollbar-thumb {
                background: #c1c1c1;
                border-radius: 2px;
            }
            &::-webkit-scrollbar-thumb:hover {
                background: #a1a1a1;
            }
        }
    }
}

/* Highlight row based on stock level */
:deep(.p-datatable-tbody > tr) {
    transition: background-color 0.2s;

    &:hover {
        background-color: #f9fafb !important;
    }

    &[data-stock-balance] {
        &[data-stock-balance='0'] {
            background-color: #fef2f2 !important;
            &:hover {
                background-color: #fee2e2 !important;
            }
        }

        &[data-stock-balance*='low'] {
            background-color: #fffbeb !important;
            &:hover {
                background-color: #fef3c7 !important;
            }
        }
    }
}
</style>
