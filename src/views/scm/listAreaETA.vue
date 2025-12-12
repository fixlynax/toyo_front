<template>
    <div class="card">
        <div class="text-2xl font-bold text-gray-800 border-b pb-2 mb-4">List of SCM ETA</div>
        <LoadingPage v-if="loading" message="Loading Area ETA Details..." />
        <div v-else>
            <DataTable
                :value="ETAList"
                :paginator="true"
                :rows="10"
                :rowsPerPageOptions="[5, 10, 20, 50, 100]"
                dataKey="id"
                removableSort
                :rowHover="true"
                :loading="loading"
                :filters="filters"
                filterDisplay="menu"
                class="rounded-table"
                :globalFilterFields="['storageLocation', 'state', 'city']"
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
                                <InputText v-model="filters['global'].value" placeholder="Quick Search" class="w-full" />
                            </IconField>
                        </div>
                        <!-- Right: Export & Batch Buttons -->
                        <div class="flex items-center gap-2 ml-auto" v-if="canUpdate">
                            <Button type="button" label="Export" icon="pi pi-file-export" class="p-button" @click="fetchExportETA" :loading="exportLoading" />
                            <Button type="button" label="Bulk Update" icon="pi pi-file-import" class="p-button" @click="importInput?.click()" :loading="importLoading" />
                            <input ref="importInput" type="file" accept=".xlsx,.xls" style="display: none" @change="handleImport" />
                        </div>
                    </div>
                </template>

                <template #empty> No ETA data found. </template>
                <template #loading> Loading ETA data. Please wait. </template>

                <!-- <Column field="created" header="Create Date" style="min-width: 8rem">
                    <template #body="{ data }">
                        {{ formatDate(data.created) }}
                    </template>
                </Column> -->

                <!-- Columns -->
                <!-- <Column field="shippingPoint.dealerName" header="Shipping Point" style="min-width: 12rem">
                    <template #body="{ data }">
                        <div>
                            <div class="font-medium">{{ data.shippingPoint.dealerName }}</div>
                            <div class="text-sm text-gray-500">{{ data.shippingPoint.email }}</div>
                            <div class="text-sm text-gray-500">{{ data.shippingPoint.phone }}</div>
                            <Tag :value="data.shippingPoint.status" :severity="getStatusSeverity(data.shippingPoint.status)" class="mt-1" />
                        </div>
                    </template>
                </Column> -->
                <Column field="storageLocation" header="Storage Location" style="min-width: 10rem" sortable />
                <Column field="state" header="State" style="min-width: 8rem" sortable />
                <Column field="city" header="City" style="min-width: 10rem" sortable />
                <Column field="dailyCutOffTime" header="Cut-off Time" style="min-width: 10rem" sortable />
                <Column field="deliveryLeadTime" header="Lead Time" style="min-width: 8rem" sortable />
            </DataTable>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onBeforeMount, onMounted } from 'vue';
import { FilterMatchMode } from '@primevue/core/api';
import api from '@/service/api';
import LoadingPage from '@/components/LoadingPage.vue';
import { useToast } from 'primevue/usetoast';
import { useMenuStore } from '@/store/menu';

const menuStore = useMenuStore();
const canUpdate = computed(() => menuStore.canWrite('Area ETA'));
const denyAccess = computed(() => menuStore.canTest('Area ETA'));
const toast = useToast();
const loading = ref(true);
const importInput = ref();
const importLoading = ref(false);
const exportLoading = ref(false);
const showFilterMenu = ref(false);
const ETAList = ref([]);
const filteredList = ref([]);
const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});

onMounted(async () => {
    fetchData();
});

function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('en-MY', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
}
function formatTime(timeString) {
    if (!timeString) return '';
    const [hours, minutes, seconds] = timeString.split(':');
    const date = new Date();
    date.setHours(hours, minutes, seconds);
    return date.toLocaleTimeString('en-MY', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    });
}
function formatDateFull(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('en-MY', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    });
}
const fetchData = async () => {
    try {
        loading.value = true;
        const response = await api.get('scm-setting-scm-eta/list');
        if (response.data.status === 1 && Array.isArray(response.data.admin_data)) {
            ETAList.value = response.data.admin_data.sort((a, b) => {
                return new Date(b.updated) - new Date(a.updated);
            });
        } else {
            console.error('API returned error or invalid data:', response.data);
            ETAList.value = [];
            filteredList.value = [];
            toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to load data', life: 3000 });
        }
    } catch (error) {
        console.error('Error fetching product list:', error);
        ETAList.value = [];
        filteredList.value = [];
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to load data', life: 3000 });
    } finally {
        loading.value = false;
    }
};

const fetchExportETA = async () => {
    try {
        loading.value = true;
        exportLoading.value = true;
        const response = await api.postExtra(
            'excel/export-ETA',
            {},
            {
                responseType: 'arraybuffer', // crucial for binary
                headers: {
                    'Content-Type': 'application/json' // still OK for POST body
                }
            }
        );

        const blob = new Blob([response.data], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });

        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'ETA_Download.xlsx';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    } catch (err) {
        console.error('error fetching ETA export:', err);
    } finally {
        loading.value = false;
        exportLoading.value = false;
    }
};
const handleImport = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
        importLoading.value = true;

        const formData = new FormData();
        formData.append('scmeta_excel', file);
        const response = await api.postExtra('excel/import-ETA', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        if (response.data.status === 1) {
            // Refresh data after import
            await fetchData();

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
                detail: response.data.message || 'Server did not confirm success',
                life: 3000
            });
        }
    } catch (error) {
        console.error('Error importing data:', error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to import data', life: 3000 });
    } finally {
        importLoading.value = false;
        if (importInput.value) {
            importInput.value.value = '';
        }
    }
};
function getStatusSeverity(status) {
    return status === 'Active' ? 'success' : 'danger';
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
