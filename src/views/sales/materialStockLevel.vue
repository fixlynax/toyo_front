<script setup>
import api from '@/service/api';
import { FilterMatchMode, FilterOperator } from '@primevue/core/api';
import { onBeforeMount, ref, computed } from 'vue';
import LoadingPage from '@/components/LoadingPage.vue';

// 🟢 State
const filters = ref({});
const materialData = ref([]);
const loading = ref(true);
const selectedStorage = ref('TMJB'); // Default storage location
const searchQuery = ref('');

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
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        materialid: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        pattern_name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] }
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
                    stockBalance: parseFloat(material.stock_level.stockBalance),
                    updated: material.stock_level.updated
                } : null
            }));
        } else {
            materialData.value = [];
        }
    } catch (error) {
        console.error('Error fetching material stock levels:', error);
        materialData.value = [];
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
        loading.value = false;
    }
};

// 🟢 Initial load
onBeforeMount(async () => {
    initFilters();
    await fetchMaterialStock(selectedStorage.value);
});

// 🟢 Computed - Filtered materials
const filteredMaterials = computed(() => {
    if (!searchQuery.value) return materialData.value;
    
    const query = searchQuery.value.toLowerCase();
    return materialData.value.filter(material => 
        material.materialid.toLowerCase().includes(query) ||
        material.material.toLowerCase().includes(query) ||
        material.pattern_name.toLowerCase().includes(query) ||
        (material.stock_level?.storagelocation?.toLowerCase() || '').includes(query)
    );
});

// 🟢 Parse stock level master JSON
const parseStockLevelMaster = (stockLevelMaster) => {
    try {
        if (typeof stockLevelMaster === 'string') {
            const parsed = JSON.parse(stockLevelMaster);
            return parsed.stocklevelmaster || parsed;
        }
        return stockLevelMaster;
    } catch (error) {
        console.error('Error parsing stocklevelmaster:', error);
        return null;
    }
};

// 🟢 Calculate total stock from stock level master
const calculateTotalStock = (stockLevelMaster) => {
    try {
        const stockData = parseStockLevelMaster(stockLevelMaster);
        
        if (!stockData) return 0;
        
        if (Array.isArray(stockData)) {
            return stockData.reduce((total, item) => {
                return total + parseFloat(item.stockbalance || 0);
            }, 0);
        } else if (stockData.stockbalance) {
            return parseFloat(stockData.stockbalance);
        }
        
        return 0;
    } catch (error) {
        console.error('Error calculating total stock:', error);
        return 0;
    }
};

// 🟢 Format Date
const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleString('en-MY', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
};

// 🟢 Format Price
const formatPrice = (price) => {
    if (!price) return '-';
    return `RM ${parseFloat(price).toFixed(2)}`;
};

// 🟢 Clear Search
const clearSearch = () => {
    searchQuery.value = '';
};

// 🟢 Get current price (latest valid price)
const getCurrentPrice = (material) => {
    const today = new Date();
    const prices = [
        { price: material.price05, validFrom: material.price05_validitystartdate },
        { price: material.price04, validFrom: material.price04_validitystartdate },
        { price: material.price03, validFrom: material.price03_validitystartdate },
        { price: material.price02, validFrom: material.price02_validitystartdate },
        { price: material.price01, validFrom: material.price01_validitystartdate }
    ];
    
    // Find the most recent price that is valid (not null and valid date is today or earlier)
    for (const priceInfo of prices) {
        if (priceInfo.price) {
            if (!priceInfo.validFrom) return priceInfo.price; // No validity date, assume always valid
            const validFrom = new Date(priceInfo.validFrom);
            if (validFrom <= today) return priceInfo.price;
        }
    }
    
    return null;
};
</script>

<template>
    <div class="card">
        <div class="text-2xl font-bold text-gray-800 border-b pb-2">Material Stock Levels</div>

        <!-- Header with Search and Filters -->
        <div class="mb-6 p-4 bg-gray-50 rounded-lg border">
            <div class="flex flex-col gap-4 w-full">
                <!-- Search Row -->
                <div class="flex items-center gap-4 w-full">
                    <div class="flex items-center gap-2 w-full max-w-md">
                        <IconField class="flex-1">
                            <InputIcon><i class="pi pi-search" /></InputIcon>
                            <InputText v-model="searchQuery" placeholder="Search by Material ID, Name, or Pattern" class="w-full" />
                        </IconField>
                        <Button v-if="searchQuery" icon="pi pi-times" class="p-button-text p-button-sm" @click="clearSearch" title="Clear search" />
                    </div>
                </div>

                <!-- Filter Row: Storage Location -->
                <div class="flex items-center gap-6 flex-wrap">
                    <!-- Storage Location Dropdown -->
                    <div class="flex items-center gap-2">
                        <span class="text-sm font-medium text-gray-700 whitespace-nowrap">Storage Location:</span>
                        <div class="flex items-center gap-2">
                            <Dropdown 
                                v-model="selectedStorage" 
                                :options="storageLocations" 
                                optionLabel="name" 
                                optionValue="code" 
                                placeholder="Select Storage Location" 
                                class="w-64" 
                                :filter="true"
                                @change="handleStorageChange"
                            >
                                <template #option="slotProps">
                                    <div class="flex items-center gap-2">
                                        <span class="text-blue-600 font-bold">🏭</span>
                                        <span>{{ slotProps.option.name }}</span>
                                        <span class="text-xs text-gray-400 ml-auto">{{ slotProps.option.code }}</span>
                                    </div>
                                </template>
                                <template #value="slotProps">
                                    <div v-if="slotProps.value" class="flex items-center gap-2">
                                        <!-- <span class="text-blue-600 font-bold">🏭</span> -->
                                        <span>{{ storageLocations.find(s => s.code === slotProps.value)?.name }}</span>
                                    </div>
                                    <span v-else>{{ slotProps.placeholder }}</span>
                                </template>
                            </Dropdown>
                        </div>
                    </div>

                    <!-- Stock Summary -->
                    <div class="flex items-center gap-4">
                        <!-- <div class="flex items-center gap-2">
                            <span class="text-sm font-medium text-gray-700">Total Materials:</span>
                            <span class="font-bold text-gray-800">{{ materialData.length }}</span>
                        </div> -->
                        <div class="flex items-center gap-2">
                            <span class="text-sm font-medium text-gray-700">In Stock:</span>
                            <span class="font-bold text-green-600">{{ materialData.filter(m => m.stock_level?.stockBalance > 0).length }}</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <span class="text-sm font-medium text-gray-700">Out of Stock:</span>
                            <span class="font-bold text-red-600">{{ materialData.filter(m => !m.stock_level || m.stock_level.stockBalance <= 0).length }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <LoadingPage v-if="loading" :message="'Loading Material Stock...'" :sub-message="'Fetching stock levels from warehouse'" />

        <!-- DataTable -->
        <DataTable
            v-if="!loading"
            :value="filteredMaterials"
            :paginator="true"
            :rows="15"
            dataKey="id"
            :rowHover="true"
            :filters="filters"
            :rowsPerPageOptions="[15, 30, 50, 100]"
            filterDisplay="menu"
            :globalFilterFields="['materialid', 'material', 'pattern_name', 'origin', 'speedplyrating']"
            class="rounded-table"
            removableSort
            sortField="material"
            :sortOrder="1"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} materials"
            paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
        >
            <template #empty>
                <div class="text-center py-8 text-gray-500">
                    <div class="flex flex-col items-center gap-2">
                        <i class="pi pi-box text-3xl text-blue-400"></i>
                        <span class="text-lg">No materials found</span>
                        <span class="text-sm text-gray-400">No stock data available for the selected storage location</span>
                    </div>
                </div>
            </template>

            <!-- Columns -->

            <!-- Material ID & Name -->
            <Column field="materialid" header="Material ID" style="min-width: 12rem" sortable>
                <template #body="{ data }">
                    <div class="flex flex-col">
                        <span class="font-bold text-blue-600">{{ data.materialid }}</span>
                        <span class="text-sm text-gray-600 truncate max-w-xs">{{ data.material }}</span>
                    </div>
                </template>
            </Column>

            <!-- Pattern & Specifications -->
            <Column header="Pattern & Specs" style="min-width: 14rem">
                <template #body="{ data }">
                    <div class="flex flex-col space-y-1">
                        <div class="flex items-center gap-2">
                            <span class="font-semibold text-gray-700">Pattern:</span>
                            <Tag :value="data.pattern_name" severity="info" class="text-xs" />
                        </div>
                        <div class="grid grid-cols-2 gap-1 text-sm">
                            <div class="flex justify-between">
                                <span class="text-gray-600">Size:</span>
                                <span class="font-medium">{{ data.sectionwidth }}/{{ data.tireseries }}R{{ data.rimdiameter }}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-gray-600">Rating:</span>
                                <span class="font-medium">{{ data.speedplyrating }}</span>
                            </div>
                        </div>
                    </div>
                </template>
            </Column>

            <!-- Stock Information -->
            <Column header="Stock Info" style="min-width: 10rem">
                <template #body="{ data }">
                    <template v-if="data.stock_level">
                        <div class="flex flex-col space-y-2">
                            <div class="flex items-center justify-between">
                                <span class="font-semibold text-gray-700">Balance:</span>
                                <div class="flex items-center gap-2">
                                    <span :class="{
                                        'font-bold text-xl': true,
                                        'text-green-600': data.stock_level.stockBalance > 50,
                                        'text-yellow-600': data.stock_level.stockBalance > 0 && data.stock_level.stockBalance <= 50,
                                        'text-red-600': data.stock_level.stockBalance <= 0
                                    }">
                                        {{ data.stock_level.stockBalance }}
                                    </span>
                                    <Tag :value="getStockStatus(data.stock_level.stockBalance).label" 
                                         :severity="getStockStatus(data.stock_level.stockBalance).severity" 
                                         class="text-xs" />
                                </div>
                            </div>
                            <div class="flex justify-between text-sm">
                                <span class="text-gray-600">DOM:</span>
                                <span class="font-medium">{{ data.stock_level.DOM || '-' }}</span>
                            </div>
                            <div class="flex justify-between text-sm">
                                <span class="text-gray-600">Updated:</span>
                                <span class="font-medium text-xs">{{ formatDate(data.stock_level.updated) }}</span>
                            </div>
                        </div>
                    </template>
                    <template v-else>
                        <div class="text-center text-gray-400 italic">No stock data</div>
                    </template>
                </template>
            </Column>

            <!-- Price Information -->
            <Column header="Price (RM)" style="min-width: 12rem">
                <template #body="{ data }">
                    <div class="flex flex-col space-y-1 text-sm">
                        <div class="flex justify-between items-center">
                            <span class="font-semibold text-gray-600">Current:</span>
                            <span class="font-bold text-green-700">
                                {{ formatPrice(getCurrentPrice(data)) }}
                            </span>
                        </div>
                        
                        <div v-if="data.price01" class="flex justify-between items-center">
                            <span class="text-gray-500">P1:</span>
                            <span>{{ formatPrice(data.price01) }}</span>
                        </div>
                        
                        <div v-if="data.price02" class="flex justify-between items-center">
                            <span class="text-gray-500">P2:</span>
                            <span>{{ formatPrice(data.price02) }}</span>
                        </div>
                        
                        <div v-if="data.price03" class="flex justify-between items-center">
                            <span class="text-gray-500">P3:</span>
                            <span>{{ formatPrice(data.price03) }}</span>
                        </div>
                        
                        <div v-if="!data.price01 && !data.price02 && !data.price03" class="text-center text-gray-400 py-1">
                            No price data
                        </div>
                    </div>
                </template>
            </Column>

            <!-- Stock Details (Batch Breakdown) -->
            <Column header="Batch Details" style="min-width: 14rem">
                <template #body="{ data }">
                    <template v-if="data.stock_level && data.stock_level.stocklevelmaster">
                        <div class="max-h-40 overflow-y-auto pr-2">
                            <div class="space-y-1">
                                <div v-for="(batch, index) in (Array.isArray(parseStockLevelMaster(data.stock_level.stocklevelmaster)) 
                                    ? parseStockLevelMaster(data.stock_level.stocklevelmaster) 
                                    : [parseStockLevelMaster(data.stock_level.stocklevelmaster)])" 
                                    :key="index"
                                    class="flex justify-between items-center text-xs border-b border-gray-100 pb-1">
                                    <div class="flex items-center gap-1">
                                        <span class="font-mono bg-gray-100 px-1 rounded">#{{ batch.batchno || 'N/A' }}</span>
                                        <span v-if="batch.stockbalance" class="text-gray-600">
                                            ({{ parseFloat(batch.stockbalance).toFixed(0) }})
                                        </span>
                                    </div>
                                    <span class="font-medium">
                                        {{ parseFloat(batch.stockbalance || 0).toFixed(0) }} units
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div class="text-xs text-gray-500 mt-1 text-center">
                            {{ (Array.isArray(parseStockLevelMaster(data.stock_level.stocklevelmaster)) 
                                ? parseStockLevelMaster(data.stock_level.stocklevelmaster).length 
                                : 1) }} batch(es)
                        </div>
                    </template>
                    <template v-else>
                        <div class="text-center text-gray-400 italic">No batch details</div>
                    </template>
                </template>
            </Column>

            <!-- Product Info -->
            <Column header="Product Info" style="min-width: 10rem">
                <template #body="{ data }">
                    <div class="flex flex-col space-y-1 text-sm">
                        <div class="flex justify-between">
                            <span class="text-gray-600">Type:</span>
                            <span class="font-medium">{{ data.materialtype }}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-600">Origin:</span>
                            <span class="font-medium">{{ data.origin }}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-600">Volume:</span>
                            <span class="font-medium">{{ data.volume }}</span>
                        </div>
                        <div class="flex gap-2 mt-1">
                            <Tag v-if="data.isSell" value="Sellable" severity="success" class="text-xs" />
                            <Tag v-if="data.isWarranty" value="Warranty" severity="info" class="text-xs" />
                            <Tag v-if="data.isTWP" value="TWP" severity="warning" class="text-xs" />
                        </div>
                    </div>
                </template>
            </Column>

            <!-- Last Updated -->
            <Column field="updated" header="Last Updated" style="min-width: 8rem" sortable>
                <template #body="{ data }">
                    <div class="text-sm">
                        {{ formatDate(data.updated) }}
                    </div>
                </template>
            </Column>
        </DataTable>
    </div>
</template>

<style scoped lang="scss">
:deep(.p-datatable .p-datatable-thead > tr > th) {
    background-color: #f8fafc;
    font-weight: 600;
    border-bottom: 2px solid #e5e7eb;
}

:deep(.rounded-table) {
    border-radius: 12px;
    overflow: hidden;
    border: 1px solid #e5e7eb;
}

:deep(.p-dropdown) {
    min-width: 200px;
}

:deep(.p-dropdown-item) {
    padding: 0.5rem 1rem;
}

/* Custom styling for stock status tags */
:deep(.p-tag) {
    font-size: 0.75rem;
    padding: 0.125rem 0.5rem;
}

/* Scrollbar styling for batch details */
:deep(.p-datatable-tbody) {
    .batch-details-cell {
        .scroll-container {
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
    &.low-stock {
        background-color: #fef3c7 !important;
        &:hover {
            background-color: #fde68a !important;
        }
    }
    
    &.out-of-stock {
        background-color: #fee2e2 !important;
        &:hover {
            background-color: #fecaca !important;
        }
    }
}
</style>