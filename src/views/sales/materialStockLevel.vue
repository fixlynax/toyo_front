<script setup>
import api from '@/service/api';
import { FilterMatchMode } from '@primevue/core/api';
import { onBeforeMount, ref, computed } from 'vue';
import LoadingPage from '@/components/LoadingPage.vue';
import { useToast } from 'primevue/usetoast';

const toast = useToast();

// 🟢 State
const filters = ref({});
const materialData = ref([]);
const loading = ref(true);
const selectedStorage = ref('TMJB'); // Default storage location
const exportLoading = ref(false);
const visibleRows = ref([]);
const selectedExportIds = ref(new Set());

// 🟢 Hardcoded storage locations
const storageLocations = [
    { code: 'RETP', name: 'RETP' },
    { code: 'RER', name: 'RER' },
    { code: 'TMJB', name: 'TMJB' },
    { code: 'TMSB', name: 'TMSB' },
    { code: 'TMSA', name: 'TMSA' },
    { code: 'TMSK', name: 'TMSK' },
    { code: 'TMDS', name: 'TMDS' }
];

// 🟢 Filters
function initFilters() {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS }
    };
}

// 🟢 Status indicators for stock levels
const getStockStatus = (balance) => {
    const stock = parseFloat(balance);
    if (stock <= 0) return { label: 'Out of Stock', severity: 'danger' };
    if (stock < 50) return { label: 'Low Stock', severity: 'warning' };
    if (stock < 100) return { label: 'Limited', severity: 'info' };
    return { label: 'In Stock', severity: 'success' };
};

// 🟢 Fetch Material Stock Levels
const fetchMaterialStock = async (storageLocation) => {
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
                stock_level: material.stock_level ? {
                    materialid: material.stock_level.materialid,
                    storagelocation: material.stock_level.storagelocation,
                    plant: material.stock_level.plant,
                    stocklevelmaster: material.stock_level.stocklevelmaster,
                    DOM: material.stock_level.DOM,
                    stockBalance: material.stock_level.stockBalance ? parseFloat(material.stock_level.stockBalance) : 0,
                    created: material.stock_level.created,
                    updated: material.stock_level.updated
                } : null
            }));
            visibleRows.value = materialData.value;
        } else {
            materialData.value = [];
            visibleRows.value = [];
            toast.add({ 
                severity: 'warn', 
                summary: 'No Data', 
                detail: 'No stock data available for selected location', 
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
    await fetchMaterialStock(selectedStorage.value);
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

// 🟢 Format Date
const formatDate = (dateString) => {
    if (!dateString) return '-';
    
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return '-';
        
        return date.toLocaleDateString('en-MY', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    } catch (error) {
        console.error('Error formatting date:', error);
        return '-';
    }
};

// 🟢 Format Price
const formatPrice = (price) => {
    if (!price || price === '0.00' || price === '0') return '-';
    try {
        return `RM ${parseFloat(price).toFixed(2)}`;
    } catch (error) {
        console.error('Error formatting price:', error);
        return '-';
    }
};

// 🟢 Get current price (latest valid price)
const getCurrentPrice = (material) => {
    const today = new Date();
    const prices = [
        { price: material.price01, validFrom: material.price01_validitystartdate, validTo: material.price_01_validityenddate },
        { price: material.price02, validFrom: material.price02_validitystartdate, validTo: material.price_02_validityenddate },
        { price: material.price03, validFrom: material.price03_validitystartdate, validTo: material.price_03_validityenddate },
        { price: material.price04, validFrom: material.price04_validitystartdate, validTo: material.price_04_validityenddate },
        { price: material.price05, validFrom: material.price05_validitystartdate, validTo: material.price_05_validityenddate }
    ];
    
    // Find the most recent price that is valid (not null and within validity period)
    for (const priceInfo of prices) {
        if (priceInfo.price && priceInfo.price !== '0.00' && priceInfo.price !== '0') {
            if (!priceInfo.validFrom) return priceInfo.price; // No start date, assume always valid
            
            const validFrom = new Date(priceInfo.validFrom);
            let isValid = validFrom <= today;
            
            // Check end date if exists
            if (priceInfo.validTo && priceInfo.validTo !== '9999-12-31') {
                const validTo = new Date(priceInfo.validTo);
                isValid = isValid && today <= validTo;
            }
            
            if (isValid) return priceInfo.price;
        }
    }
    
    return null;
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
    const allIds = visibleRows.value.map(item => item.id);

    if (isAllSelected()) {
        selectedExportIds.value = new Set([...selectedExportIds.value].filter(id => !allIds.includes(id)));
    } else {
        selectedExportIds.value = new Set([...selectedExportIds.value, ...allIds]);
    }
};

// 🟢 Computed: are all visible rows selected?
const isAllSelected = () => {
    return visibleRows.value.length > 0 && visibleRows.value.every(item => selectedExportIds.value.has(item.id));
};

// 🟢 Stock summary computed properties
const stockSummary = computed(() => {
    const total = materialData.value.length;
    const inStock = materialData.value.filter(m => m.stock_level?.stockBalance > 0).length;
    const outOfStock = materialData.value.filter(m => !m.stock_level || m.stock_level.stockBalance <= 0).length;
    const lowStock = materialData.value.filter(m => m.stock_level?.stockBalance > 0 && m.stock_level.stockBalance < 50).length;
    
    return { total, inStock, outOfStock, lowStock };
});

// 🟢 Format boolean values for display
const formatBoolean = (value) => {
    return value === 1 || value === true ? 'Yes' : 'No';
};
</script>

<template>
    <div class="card">
        <div class="text-2xl font-bold text-gray-800 border-b pb-2 mb-4">Material Stock Level</div>

        <LoadingPage v-if="loading" :message="'Loading Material Stock...'" :sub-message="'Fetching stock levels from warehouse'" />

        <DataTable
            v-if="!loading"
            :value="materialData"
            @filter="onTableFilter"
            :paginator="true"
            :rows="10"
            :rowsPerPageOptions="[5, 10, 20]"
            dataKey="materialid"
            removableSort
            class="rounded-table"
            :rowHover="true"
            :filters="filters"
            filterDisplay="menu"
            :globalFilterFields="['materialid', 'material', 'pattern_name', 'origin', 'sectionwidth', 'tireseries', 'rimdiameter', 'speedplyrating']"
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
                            <Dropdown 
                                v-model="selectedStorage" 
                                :options="storageLocations" 
                                optionLabel="name" 
                                optionValue="code" 
                                placeholder="Select Storage" 
                                class="w-48" 
                                :filter="true"
                                @change="handleStorageChange"
                            >
                                <template #option="slotProps">
                                    <div class="flex items-center gap-2">
                                        <i class="pi pi-warehouse text-blue-600"></i>
                                        <span>{{ slotProps.option.name }}</span>
                                    </div>
                                </template>
                                <template #value="slotProps">
                                    <div v-if="slotProps.value" class="flex items-center gap-2">
                                        <i class="pi pi-warehouse text-blue-600"></i>
                                        <span>{{ storageLocations.find(s => s.code === slotProps.value)?.name }}</span>
                                    </div>
                                    <span v-else>{{ slotProps.placeholder }}</span>
                                </template>
                            </Dropdown>
                        </div>
                    </div>

                    <!-- Right: Export Button & Stock Summary -->
                    <div class="flex items-center gap-4 ml-auto">
                        <!-- Stock Summary -->
                        <div class="flex items-center gap-4 bg-gray-50 px-4 py-2 rounded-lg border">
                            <!-- <div class="flex items-center gap-2">
                                <span class="text-sm font-medium text-gray-700">Total:</span>
                                <span class="font-bold text-gray-800">{{ stockSummary.total }}</span>
                            </div> -->
                            <div class="flex items-center gap-2">
                                <i class="pi pi-check-circle text-green-600"></i>
                                <span class="text-sm font-medium text-gray-700">In Stock:</span>
                                <span class="font-bold text-green-600">{{ stockSummary.inStock }}</span>
                            </div>
                            <div class="flex items-center gap-2">
                                <i class="pi pi-exclamation-triangle text-yellow-600"></i>
                                <span class="text-sm font-medium text-gray-700">Low:</span>
                                <span class="font-bold text-yellow-600">{{ stockSummary.lowStock }}</span>
                            </div>
                            <div class="flex items-center gap-2">
                                <i class="pi pi-times-circle text-red-600"></i>
                                <span class="text-sm font-medium text-gray-700">Out:</span>
                                <span class="font-bold text-red-600">{{ stockSummary.outOfStock }}</span>
                            </div>
                        </div>
                        
                        <!-- Export Button -->
                        <Button 
                            type="button" 
                            label="Export" 
                            icon="pi pi-file-export" 
                            class="p-button-success" 
                            :loading="exportLoading" 
                            @click="handleExport" 
                            :disabled="materialData.length === 0"
                        />
                    </div>
                </div>
            </template>

            <template #empty>
                <div class="text-center py-8 text-gray-500">
                    <div class="flex flex-col items-center gap-2">
                        <i class="pi pi-box text-3xl text-blue-400"></i>
                        <span class="text-lg">No materials found</span>
                        <span class="text-sm text-gray-400">No stock data available for {{ selectedStorage }}</span>
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

            <!-- Origin -->
            <Column field="origin" header="Origin" style="min-width: 3rem" sortable>
                <template #body="{ data }">
                    {{ data.origin }}
                </template>
            </Column>

            <!-- Size Details -->
            <Column header="Size" style="min-width: 10rem" sortable :sort-field="'sectionwidth'">
                <template #body="{ data }">
                    <div class="flex flex-col leading-relaxed text-sm text-gray-700">
                        <div class="flex">
                            <span class="w-18 text-gray-800 font-semibold">Section Width:</span>
                            <span>{{ data.sectionwidth }}</span>
                        </div>
                        <div class="flex">
                            <span class="w-15 text-gray-800 font-semibold">Tyre Series:</span>
                            <span>{{ data.tireseries }}</span>
                        </div>
                        <div class="flex">
                            <span class="w-15 text-gray-800 font-semibold">Rim Diameter:</span>
                            <span>{{ data.rimdiameter }}"</span>
                        </div>
                        <div class="flex">
                            <span class="w-15 text-gray-800 font-semibold">Speed Rating:</span>
                            <span>{{ data.speedplyrating }}</span>
                        </div>
                    </div>
                </template>
            </Column>

            <!-- Stock Information -->
            <Column header="Stock Info" style="min-width: 14rem">
                <template #body="{ data }">
                    <template v-if="data.stock_level">
                        <div class="flex flex-col leading-relaxed text-sm text-gray-700">
                            <div class="flex items-center justify-between mb-1">
                                <span class="text-gray-800 font-semibold">Balance:</span>
                                <div class="flex items-center gap-2">
                                    <span :class="{
                                        'font-bold text-lg': true,
                                        'text-green-600': data.stock_level.stockBalance > 50,
                                        'text-yellow-600': data.stock_level.stockBalance > 0 && data.stock_level.stockBalance <= 50,
                                        'text-red-600': data.stock_level.stockBalance <= 0
                                    }">
                                        {{ data.stock_level.stockBalance || 0 }}
                                    </span>
                                    <Tag :value="getStockStatus(data.stock_level.stockBalance).label" 
                                         :severity="getStockStatus(data.stock_level.stockBalance).severity" 
                                         class="text-xs" />
                                </div>
                            </div>
                            <div class="flex">
                                <span class="w-20 text-gray-600">Location:</span>
                                <span class="font-medium">{{ data.stock_level.storagelocation }}</span>
                            </div>
                            <div class="flex">
                                <span class="w-20 text-gray-600">Plant:</span>
                                <span class="font-medium">{{ data.stock_level.plant }}</span>
                            </div>
                            <div class="flex">
                                <span class="w-20 text-gray-600">DOM:</span>
                                <span class="font-medium">{{ data.stock_level.DOM || '-' }}</span>
                            </div>
                            <div class="flex">
                                <span class="w-20 text-gray-600">Updated:</span>
                                <span class="font-medium text-xs">{{ formatDate(data.stock_level.updated) }}</span>
                            </div>
                        </div>
                    </template>
                    <template v-else>
                        <div class="text-center text-gray-400 italic py-2">No stock data</div>
                    </template>
                </template>
            </Column>

            <!-- Batch Details -->
            <!-- <Column header="Batch Details" style="min-width: 12rem">
                <template #body="{ data }">
                    <template v-if="data.stock_level && data.stock_level.stocklevelmaster">
                        <div class="max-h-32 overflow-y-auto pr-2">
                            <div class="space-y-2">
                                <div v-for="(batch, index) in parseStockLevelMaster(data.stock_level.stocklevelmaster)" 
                                    :key="index"
                                    class="p-2 bg-gray-50 rounded border border-gray-200">
                                    <div class="flex justify-between items-center mb-1">
                                        <span class="font-mono text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">#{{ batch.batchno || `Batch ${index + 1}` }}</span>
                                        <span class="font-bold">
                                            {{ parseFloat(batch.stockbalance || batch.stockBalance || 0).toFixed(0) }} units
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="text-xs text-gray-500 mt-2 text-center">
                            {{ parseStockLevelMaster(data.stock_level.stocklevelmaster).length }} batch(es)
                            • Total: {{ calculateTotalFromBatches(data.stock_level.stocklevelmaster) }}
                        </div>
                    </template>
                    <template v-else>
                        <div class="text-center text-gray-400 italic py-2">No batch details</div>
                    </template>
                </template>
            </Column> -->

            <!-- Price Information -->
            <Column header="Price(RM)" style="min-width: 15rem">
                <template #body="{ data }">
                    <div class="flex flex-col leading-relaxed text-sm text-gray-700">
                        <div class="flex items-center justify-between mb-2 pb-1 border-b">
                            <span class="text-gray-800 font-semibold">Current:</span>
                            <span class="font-bold text-green-700 text-lg">
                                {{ formatPrice(getCurrentPrice(data)) }}
                            </span>
                        </div>
                        
                        <div v-if="data.price01 && data.price01 !== '0.00'" class="flex items-center justify-between">
                            <span class="text-gray-600">Price 1:</span>
                            <span class="font-medium">{{ formatPrice(data.price01) }}</span>
                        </div>
                        
                        <div v-if="data.price02 && data.price02 !== '0.00'" class="flex items-center justify-between">
                            <span class="text-gray-600">Price 2:</span>
                            <span class="font-medium">{{ formatPrice(data.price02) }}</span>
                        </div>
                        
                        <div v-if="data.price03 && data.price03 !== '0.00'" class="flex items-center justify-between">
                            <span class="text-gray-600">Price 3:</span>
                            <span class="font-medium">{{ formatPrice(data.price03) }}</span>
                        </div>
                        
                        <div v-if="data.price04 && data.price04 !== '0.00'" class="flex items-center justify-between">
                            <span class="text-gray-600">Price 4:</span>
                            <span class="font-medium">{{ formatPrice(data.price04) }}</span>
                        </div>
                        
                        <div v-if="data.price05 && data.price05 !== '0.00'" class="flex items-center justify-between">
                            <span class="text-gray-600">Price 5:</span>
                            <span class="font-medium">{{ formatPrice(data.price05) }}</span>
                        </div>
                        
                        <div v-if="!data.price01 && !data.price02 && !data.price03 && !data.price04 && !data.price05" 
                             class="text-center text-gray-400 py-2">
                            No price data
                        </div>
                    </div>
                </template>
            </Column>

            <!-- Price Validity -->
            <Column header="Valid" style="min-width: 8rem">
                <template #body="{ data }">
                    <div class="flex flex-col leading-relaxed text-sm text-gray-700">
                        <div v-if="data.price01_validitystartdate" class="flex">
                            <span class="text-xs">{{ formatDate(data.price01_validitystartdate) }} - {{ formatDate(data.price_01_validityenddate) }}</span>
                        </div>
                        <div v-if="data.price02_validitystartdate" class="flex">
                            <span class="text-xs">{{ formatDate(data.price02_validitystartdate) }} - {{ formatDate(data.price_02_validityenddate) }}</span>
                        </div>
                        <div v-if="data.price03_validitystartdate" class="flex">
                            <span class="text-xs">{{ formatDate(data.price03_validitystartdate) }} - {{ formatDate(data.price_03_validityenddate) }}</span>
                        </div>
                        <div v-if="data.price04_validitystartdate" class="flex">
                            <span class="text-xs">{{ formatDate(data.price04_validitystartdate) }} - {{ formatDate(data.price_04_validityenddate) }}</span>
                        </div>
                        <div v-if="data.price05_validitystartdate" class="flex">
                            <span class="text-xs">{{ formatDate(data.price05_validitystartdate) }} - {{ formatDate(data.price_05_validityenddate) }}</span>
                        </div>
                        <div v-if="!data.price01_validitystartdate && !data.price02_validitystartdate && !data.price03_validitystartdate && !data.price04_validitystartdate && !data.price05_validitystartdate" 
                             class="text-center text-gray-400 text-xs py-1">
                            No validity dates
                        </div>
                    </div>
                </template>
            </Column>

            <!-- Product Status -->
            <Column header="Status" style="min-width: 10rem">
                <template #body="{ data }">
                    <div class="flex flex-col space-y-1">
                        <div class="flex items-center justify-between">
                            <span class="text-gray-600 text-sm">Sell:</span>
                            <Tag :value="formatBoolean(data.isSell)" 
                                 :severity="data.isSell ? 'success' : 'secondary'" 
                                 class="text-xs" />
                        </div>
                        <div class="flex items-center justify-between">
                            <span class="text-gray-600 text-sm">Warranty:</span>
                            <Tag :value="formatBoolean(data.isWarranty)" 
                                 :severity="data.isWarranty ? 'info' : 'secondary'" 
                                 class="text-xs" />
                        </div>
                        <div class="flex items-center justify-between">
                            <span class="text-gray-600 text-sm">TWP:</span>
                            <Tag :value="formatBoolean(data.isTWP)" 
                                 :severity="data.isTWP ? 'warning' : 'secondary'" 
                                 class="text-xs" />
                        </div>
                    </div>
                </template>
            </Column>

            <!-- Last Updated -->
            <Column field="updated" header="Updated" style="min-width: 8rem" sortable>
                <template #body="{ data }">
                    <div class="text-sm">
                        {{ formatDate(data.updated) }}
                    </div>
                </template>
            </Column>
        </DataTable>
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
        &[data-stock-balance="0"] {
            background-color: #fef2f2 !important;
            &:hover {
                background-color: #fee2e2 !important;
            }
        }
        
        &[data-stock-balance*="low"] {
            background-color: #fffbeb !important;
            &:hover {
                background-color: #fef3c7 !important;
            }
        }
    }
}
</style>