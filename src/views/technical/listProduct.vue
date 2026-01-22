<template>
    <div class="card">
        <div class="text-2xl font-bold text-gray-800 border-b pb-2">Product List</div>

        <DataTable
            :value="tyres"
            @filter="onTableFilter"
            :paginator="true"
            :rows="10"
            :rowsPerPageOptions="[10, 20, 50, 100]"
            dataKey="materialid"
            removableSort
            class="rounded-table"
            :rowHover="true"
            :loading="loading"
            :filters="filters"
            filterDisplay="menu"
            :globalFilterFields="[
            'materialid',
            'pattern',
            'origin',
            'sectionwidth',
            'tireseries',
            'rimdiameter',
            'speedplyrating',

            'price01_validitystartdate',
            'price_01_validityenddate',
            'price02_validitystartdate',
            'price_02_validityenddate',
            'price03_validitystartdate',
            'price_03_validityenddate',
            'price04_validitystartdate',
            'price_04_validityenddate',
            'price05_validitystartdate',
            'price_05_validityenddate',

            'status'
            ]"
            paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
        >
            <template #header>
                <div class="flex items-center justify-between gap-4 w-full flex-wrap">
                    <!-- Left: Search Field + Sort Menu Button -->
                    <div class="flex items-center gap-2 w-full max-w-md">
                        <IconField class="flex-1">
                            <InputIcon>
                                <i class="pi pi-search" />
                            </InputIcon>
                            <InputText v-model="filters['global'].value" placeholder="Quick Search" class="w-full" />
                        </IconField>
                    </div>

                    <!-- Right: Export & Batch Buttons -->
                    <div class="flex items-center gap-2 ml-auto">
                        <!-- <Button 
                        type="button" 
                        label="Material" 
                        icon="pi pi-sync" 
                        class="p-button"
                        :loading="materialLoading"
                        @click="handleMaterial"
                        />
                        <Button 
                        type="button" 
                        label="Stock Level" 
                        icon="pi pi-sync" 
                        class="p-button"
                        :loading="stockLevelLoading"
                        @click="handleStockLevel"
                        /> -->
                        <Button type="button" label="Export" icon="pi pi-file-export" class="p-button-success" :loading="exportLoading" @click="handleExport" />
                        <Button v-if="canUpdate" type="button" label="Import" icon="pi pi-file-import" class="p-button" @click="importInput?.click()" :loading="importLoading" />
                        <input  v-if="canUpdate" ref="importInput" type="file" accept=".xlsx,.xls" style="display: none" @change="handleImport" />
                        <!-- <Button 
                        type="button" 
                        icon="pi pi-refresh" 
                        class="p-button"
                        :loading="refreshLoading"
                        @click="refreshData"
                        /> -->
                    </div>
                </div>
            </template>

            <template #empty> No data found. </template>
            <template #loading> Loading data. Please wait... </template>

            <Column header="Export All" style="min-width: 8rem">
                <template #header>
                    <div class="flex justify-center">
                        <Checkbox :key="tyres.length" :binary="true" :model-value="isAllSelected()" @change="() => toggleSelectAll()" />
                    </div>
                </template>

                <template #body="{ data }">
                    <div class="flex justify-center">
                        <Checkbox :binary="true" :model-value="selectedExportIds.has(data.id)" @change="() => handleToggleExport(data.id)" />
                    </div>
                </template>
            </Column>
            
            <Column field="materialid" header="Material" style="min-width: 6rem" sortable>
                <template #body="{ data }">
                    <div class="flex flex-col">
                            <!-- Top -->
                            <div class="font-semibold">{{ data.materialid }}</div>

                            <!-- Bottom -->
                            <div class="text-gray-600 text-sm">{{ data.material }}</div>
                        </div>  
                </template>
            </Column>

            <Column field="pattern" header="Pattern" style="min-width: 8rem" sortable>
                <template #body="{ data }">
                    {{ data.pattern }}
                </template>
            </Column>

            <Column field="origin" header="Origin" style="min-width: 8rem" sortable>
                <template #body="{ data }">
                    {{ data.origin }}
                </template>
            </Column>

            <Column field="sectionwidth" header="Size" style="min-width: 12rem" sortable>
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

            
            <!-- Sell Column with Checkbox -->
            <Column field="sell" header="Sell" style="min-width: 6rem" v-if="canUpdate">
                <template #body="{ data }">
                    <div class="flex justify-center">
                        <Checkbox v-model="data.sell" :binary="true" :disabled="data.updatingSell" @change="handleToggleSell(data)" :class="data.sell ? 'p-checkbox-checked' : ''" />
                        <i v-if="data.updatingSell" class="pi pi-spin pi-spinner ml-2"></i>
                    </div>
                </template>
            </Column>

            <!-- Warranty Column with Checkbox -->
            <Column field="warranty" header="Warranty" style="min-width: 8rem" v-if="canUpdate">
                <template #body="{ data }">
                    <div class="flex justify-center">
                        <Checkbox v-model="data.warranty" :binary="true" :disabled="data.updatingWarranty" @change="handleToggleWarranty(data)" :class="data.warranty ? 'p-checkbox-checked' : ''" />
                        <i v-if="data.updatingWarranty" class="pi pi-spin pi-spinner ml-2"></i>
                    </div>
                </template>
            </Column>

            <!-- TWP Column with Checkbox -->
            <Column field="twp" header="TWP" style="min-width: 8rem" v-if="canUpdate">
                <template #body="{ data }">
                    <div class="flex justify-center">
                        <Checkbox v-model="data.twp" :binary="true" :disabled="data.updatingTWP" @change="handleToggleTWP(data)" :class="data.twp ? 'p-checkbox-checked' : ''" />
                        <i v-if="data.updatingTWP" class="pi pi-spin pi-spinner ml-2"></i>
                    </div>
                </template>
            </Column>
            <Column field="price" header="Price(RM)" style="min-width: 12rem" sortable>
                <template #body="{ data }">
                    <div class="flex flex-col leading-relaxed text-sm text-gray-700">
                        <div class="flex">
                            <span class="w-15 text-gray-800 font-semibold">Price 1:</span>
                            <span>{{ data.price01 }}</span>
                        </div>
                        <div class="flex">
                            <span class="w-15 text-gray-800 font-semibold">Price 2:</span>
                            <span>{{ data.price02 }}</span>
                        </div>
                        <div class="flex">
                            <span class="w-15 text-gray-800 font-semibold">Price 3:</span>
                            <span>{{ data.price03 }}</span>
                        </div>
                        <div class="flex">
                            <span class="w-15 text-gray-800 font-semibold">Price 4:</span>
                            <span>{{ data.price04 }}</span>
                        </div>
                        <div class="flex">
                            <span class="w-15 text-gray-800 font-semibold">Price 5:</span>
                            <span>{{ data.price05 }}</span>
                        </div>
                    </div>
                </template>
            </Column>

            <Column header="Valid" style="min-width: 15rem">
                <template #body="{ data }">
                    <div class="flex flex-col leading-relaxed text-sm text-gray-700">
                        <div class="flex">
                            <span >{{ data.price01_validitystartdate }} - {{ data.price_01_validityenddate }}</span>
                        </div>
                        <div class="flex">
                            <span >{{ data.price02_validitystartdate }} - {{data.price_02_validityenddate }}</span>
                        </div>
                        <div class="flex">
                            <span>{{ data.price03_validitystartdate }} - {{ data.price_03_validityenddate }}</span>
                        </div>
                        <div class="flex">
                            <span >{{ data.price04_validitystartdate }} - {{ data.price_04_validityenddate }}</span>
                        </div>
                        <div class="flex">
                            <span >{{ data.price05_validitystartdate }} - {{ data.price_05_validityenddate }}</span>
                        </div>
                    </div>
                </template>
            </Column>
        </DataTable>
    </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';
import { FilterMatchMode } from '@primevue/core/api';
import api from '@/service/api';
import { useToast } from 'primevue/usetoast';
import LoadingPage from '@/components/LoadingPage.vue';
import { useMenuStore } from '@/store/menu';

const menuStore = useMenuStore();
const canUpdate = computed(() => menuStore.canWrite('Product List'));
const denyAccess = computed(() => menuStore.canTest('Product List'));

const toast = useToast();

// Data variables
const tyres = ref([]);
const loading = ref(true);
const exportLoading = ref(false);
const importLoading = ref(false);
const refreshLoading = ref(false);
const materialLoading = ref(false);
const stockLevelLoading = ref(false);
const importInput = ref();
const selectedExportIds = ref(new Set());

const visibleRows = ref(tyres.value);

// Filters for quick search
const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});

// Fetch data function
const fetchData = async () => {
    try {
        loading.value = true;
        const response = await api.get('material');

        if (response.data.status === 1 && Array.isArray(response.data.admin_data)) {
            tyres.value = response.data.admin_data.map((product) => ({
                id: product.id, // Make sure this is included for API calls
                materialid: product.materialid,
                material: product.material,
                twp: product.isTWP === 1,
                warranty: product.isWarranty === 1,
                sell: product.isSell === 1,
                pattern: product.pattern,
                pattern_name: product.pattern_name,
                origin: product.origin,
                sectionwidth: product.sectionwidth,
                tireseries: product.tireseries,
                rimdiameter: product.rimdiameter,
                speedplyrating: product.speedplyrating,
                updatingTWP: false,
                updatingWarranty: false,
                price01: product.price01,
                price02: product.price02,
                price03: product.price03,
                price04: product.price04,
                price05: product.price05,
                price01_validitystartdate: formatDate(product.price01_validitystartdate),
                price_01_validityenddate: formatDate(product.price_01_validityenddate),
                price02_validitystartdate: formatDate(product.price02_validitystartdate),
                price_02_validityenddate: formatDate(product.price_02_validityenddate),
                price03_validitystartdate: formatDate(product.price03_validitystartdate),
                price_03_validityenddate: formatDate(product.price_03_validityenddate),
                price04_validitystartdate: formatDate(product.price04_validitystartdate),
                price_04_validityenddate: formatDate(product.price_04_validityenddate),
                price05_validitystartdate: formatDate(product.price05_validitystartdate),
                price_05_validityenddate: formatDate(product.price_05_validityenddate),
                updatingSell: false
            }));
        } else {
            tyres.value = [];
            toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to load data', life: 3000 });
        }
    } catch (error) {
        console.error('Error fetching product list:', error);
        tyres.value = [];
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to load data', life: 3000 });
    } finally {
        loading.value = false;
        refreshLoading.value = false;
    }
};


// Toggle functions
const handleToggleExport = (id) => {
    if (selectedExportIds.value.has(id)) {
        selectedExportIds.value.delete(id);
    } else {
        selectedExportIds.value.add(id);
    }
};

const onTableFilter = (event) => {
    // Update visibleRows whenever filtering happens
    visibleRows.value = event.filteredValue || tyres.value;
};

// Toggle all visible rows
const toggleSelectAll = () => {
    const allIds = visibleRows.value.map(item => item.id);

    if (isAllSelected()) {
        // Remove all visible IDs at once
        selectedExportIds.value = new Set([...selectedExportIds.value].filter(id => !allIds.includes(id)));
    } else {
        // Add all visible IDs at once
        selectedExportIds.value = new Set([...selectedExportIds.value, ...allIds]);
    }
};

// Computed: are all visible rows selected?
const isAllSelected = () => {
    return visibleRows.value.length > 0 && visibleRows.value.every(item => selectedExportIds.value.has(item.id));
};

// Toggle functions
const handleToggleTWP = async (data) => {
    try {
        data.updatingTWP = true;
        const newStatus = data.twp ? 1 : 0;
        await api.put(`material/toggleTWP/${data.id}`, {});

        toast.add({ severity: 'success', summary: 'Success', detail: 'TWP status updated', life: 3000 });
    } catch (error) {
        console.error('Error updating TWP:', error);
        data.twp = !data.twp; // Revert on error
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to update TWP status', life: 3000 });
    } finally {
        data.updatingTWP = false;
    }
};

const handleToggleWarranty = async (data) => {
    try {
        data.updatingWarranty = true;
        const newStatus = data.warranty ? 1 : 0;

        await api.put(`material/toggleWarranty/${data.id}`, {
            status: newStatus
        });

        toast.add({ severity: 'success', summary: 'Success', detail: 'Warranty status updated', life: 3000 });
    } catch (error) {
        console.error('Error updating warranty:', error);
        data.warranty = !data.warranty; // Revert on error
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to update warranty status', life: 3000 });
    } finally {
        data.updatingWarranty = false;
    }
};

const handleToggleSell = async (data) => {
    try {
        data.updatingSell = true;
        const newStatus = data.sell ? 1 : 0;

        await api.put(`material/toggleSell/${data.id}`, {
            status: newStatus
        });

        toast.add({ severity: 'success', summary: 'Success', detail: 'Sell status updated', life: 3000 });
    } catch (error) {
        console.error('Error updating sell status:', error);
        data.sell = !data.sell; // Revert on error
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to update sell status', life: 3000 });
    } finally {
        data.updatingSell = false;
    }
};

// Export function
const handleExport = async () => {
    const idsArray = Array.from(selectedExportIds.value).map((id) => Number(id));

    if (idsArray.length === 0) {
        alert('Please select at least one row.');
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
        a.download = 'Material_Download.xlsx';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        toast.add({ severity: 'success', summary: 'Success', detail: 'Export completed', life: 3000 });
        selectedExportIds.value.clear();
    } catch (error) {
        console.error('Error exporting data:', error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to export data', life: 3000 });
    } finally {
        exportLoading.value = false;
    }
};

// Import function
const handleImport = async (event) => {
    const file = event.target.files[0];

    if (!file) return;

    try {
        importLoading.value = true;

        const formData = new FormData();
        formData.append('material_file', file);
        const response = await api.postExtra('material/import', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        if (response.data.status === 1) {
            // Refresh data after import
            await fetchData();

            // Reset file input
            if (importInput.value) {
                importInput.value.value = '';
            }

            toast.add({
                severity: 'success',
                summary: 'Success',
                detail: 'File imported successfully',
                life: 3000
            });
        } else {
            toast.add({
                severity: 'error',
                summary: 'Import Failed',
                detail: response.data.error || 'Failed to import data',
                life: 3000
            });
        }
    } catch (error) {
        console.error('Error importing data:', error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to import data', life: 3000 });
    } finally {
        importLoading.value = false;
    }
};

// Refresh function
// const refreshData = () => {
//     refreshLoading.value = true;
//     fetchData();
// };

onMounted(() => {
    fetchData();
});

function formatDate(dateString) {
    if (!dateString) return '';

    const date = new Date(dateString); // Works for ISO, YYYY-MM-DD, YYYY-MM-DDTHH

    if (isNaN(date)) return '';

    return date.toLocaleDateString('en-MY', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
}
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
