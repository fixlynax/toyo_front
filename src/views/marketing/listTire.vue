<template>
    <div class="card">
        <div class="text-2xl font-bold text-gray-800 border-b pb-2 mb-6">Tire Management List</div>

        <!-- Show LoadingPage only during initial page load -->
        <LoadingPage v-if="initialLoading" :message="'Loading Game Management Details...'" :sub-message="'Fetching game data'" />

        <!-- Show content area when not in initial loading -->
        <div v-else>
            <DataTable
                ref="dt"
                :value="listData"
                @filter="onTableFilter"
                :paginator="true"
                :rows="10"
                :rowsPerPageOptions="[10, 20, 50, 100]"
                dataKey="id"
                removableSort
                :rowHover="true"
                :loading="tableLoading"
                :filters="filters"
                filterDisplay="menu"
                :globalFilterFields="['custAccountNo', 'shopName', 'regionName', 'areaName', 'address', 'channel', 'signboardType']"
                class="rounded-table"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
                paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
            >
                <template #header>
                    <div class="flex items-center justify-between gap-4 w-full flex-wrap">
                        <!-- Left: Search Field -->
                        <div class="flex items-center gap-2 w-full max-w-md">
                            <IconField class="flex-1">
                                <InputIcon>
                                    <i class="pi pi-search" />
                                </InputIcon>
                                <InputText v-model="filters['global'].value" placeholder="Quick Search" class="w-full" />
                            </IconField>
                        </div>

                        <!-- Right: Single Export Button (exactly like reference code) -->
                        <div class="flex items-center gap-2 ml-auto">
                            <!-- Single Export Button (like in reference code - green success button) -->
                            <Button type="button" label="Export" icon="pi pi-file-export" class="p-button-success" :loading="exportLoading1" @click="handleExport" />
                            <Button type="button" label="Bulk Update" icon="pi pi-file-import" :loading="importLoading1" @click="importFileInput?.click()" />
                            <input ref="importFileInput" type="file" class="hidden" accept=".xlsx,.xls" @change="handleImport" />
                        </div>
                    </div>
                </template>

                <template #empty>
                    <div class="text-center py-8 text-gray-500">No Games found.</div>
                </template>

                <template #loading>
                    <div class="text-center py-4">
                        <ProgressSpinner style="width: 30px; height: 30px" />
                        <p class="mt-2 text-gray-600">Loading game data...</p>
                    </div>
                </template>

                <!-- Export All Checkbox Column (EXACTLY like reference code) -->

                <Column field="custAccountNo" header="Account No" style="min-width: 8rem" sortable>
                    <template #body="{ data }">
                        <span class="font-bold text-primary-400">
                            {{ data.custAccountNo }}
                        </span>
                    </template>
                </Column>

                <Column field="shopName" header="Shop Name" style="min-width: 8rem" sortable>
                    <template #body="{ data }">
                        {{ data.shopName }}
                    </template>
                </Column>

                <Column field="regionName" header="Region" style="min-width: 8rem" sortable>
                    <template #body="{ data }"> {{ data.regionName }}</template>
                </Column>

                <Column field="address" header="Address" style="min-width: 10rem" sortable>
                    <template #body="{ data }">
                        {{ data.address }}
                    </template>
                </Column>

                <Column field="signboardType" header="SignBoard Type" style="min-width: 10rem" sortable>
                    <template #body="{ data }">
                        {{ data.signboardType }}
                    </template>
                </Column>

                <Column field="channel" header="Channel" style="min-width: 10rem" sortable>
                    <template #body="{ data }">
                        {{ data.channel }}
                    </template>
                </Column>

                <!-- <Column field="created" header="Created" style="min-width: 10rem" sortable>
                    <template #body="{ data }">
                        {{ formatDateTime(data.created) }}
                    </template>
                </Column>

                <Column field="updated" header="Updated" style="min-width: 10rem" sortable>
                    <template #body="{ data }">
                        {{ formatDateTime(data.updated) }}
                    </template>
                </Column> -->
            </DataTable>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';
import api from '@/service/api';
import { FilterMatchMode } from '@primevue/core/api';
import LoadingPage from '@/components/LoadingPage.vue';
import { useMenuStore } from '@/store/menu';
import { useToast } from 'primevue/usetoast';
const importLoading1 = ref(false);
const importFileInput = ref();
const toast = useToast();
const menuStore = useMenuStore();

// Data variables (EXACTLY like reference code)
const listData = ref([]);
const initialLoading = ref(true);
const tableLoading = ref(false);
const selectedExportIds = ref(new Set()); // Using Set like reference code
const exportLoading1 = ref(false);

// Filters
const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});

onMounted(async () => {
    await fetchTire();
});
const fetchTire = async () => {
    try {
        initialLoading.value = true;
        tableLoading.value = true;

        const response = await api.get('tire-shop');

        if (response.data.status === 1 && Array.isArray(response.data.admin_data)) {
            listData.value = response.data.admin_data;
        } else {
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: response.data.message || 'Failed to load data',
                life: 3000
            });
            listData.value = [];
        }
    } catch (error) {
        console.error('Error fetching game list:', error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load data',
            life: 3000
        });
        listData.value = [];
    } finally {
        initialLoading.value = false;
        tableLoading.value = false;
    }
};

function formatDateTime(dateTimeString) {
    if (!dateTimeString) return '-';

    // Replace space with T if needed
    const normalized = dateTimeString.includes('T') ? dateTimeString : dateTimeString.replace(' ', 'T');

    const date = new Date(normalized);

    if (isNaN(date)) return '-';

    return date
        .toLocaleString('en-MY', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        })
        .toUpperCase();
}

const handleExport = async () => {
    try {
        exportLoading1.value = true;

        const formData = new FormData();

        const response = await api.getDownload('export-tire-shop', {
            responseType: 'blob',
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        const blob = new Blob([response.data], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });

        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'TireList.xlsx';
        a.click();
        window.URL.revokeObjectURL(url);

        toast.add({ severity: 'success', summary: 'Success', detail: 'Export completed', life: 3000 });
        selectedExportIds.value.clear();
    } catch (error) {
        console.error('Error exporting data:', error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to export data', life: 3000 });
    } finally {
        exportLoading1.value = false;
    }
};

const handleImport = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
        importLoading1.value = true;

        const formData = new FormData();
        formData.append('excel_file', file);
        // Note: Removed dealer_ids as API doesn't expect it

        const response = await api.postExtra('import-tire-shop', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        if (response.data.status === 1) {
            toast.add({
                severity: 'success',
                summary: 'Success',
                detail: `Imported ${response.data.saved_count} records successfully (${response.data.saved_count}/${response.data.total_count})`,
                life: 5000
            });
            await fetchTire();
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
        importLoading1.value = false;
        if (importFileInput.value) {
            importFileInput.value.value = '';
        }
    }
};
</script>

<style scoped lang="scss">
:deep(.p-datatable-frozen-tbody) {
    font-weight: bold;
}

:deep(.p-datatable-scrollable .p-frozen-column) {
    font-weight: bold;
}

// Rounded table styles (EXACTLY like reference code)
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

// Style for Export button to match reference code
:deep(.p-button-success) {
    background: linear-gradient(135deg, #10b981, #059669);
    border-color: #059669;

    &:enabled:hover {
        background: linear-gradient(135deg, #059669, #047857);
        border-color: #047857;
    }
}

// Style checkboxes like reference code
:deep(.p-checkbox) {
    .p-checkbox-box {
        border-radius: 6px;
        border: 2px solid #d1d5db;

        &.p-highlight {
            background: #059669;
            border-color: #059669;
        }
    }
}
</style>
