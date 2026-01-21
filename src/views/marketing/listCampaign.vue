<template>
    <div class="card">
        <div class="text-2xl font-bold text-gray-800 border-b pb-2 mb-6">Campaign Management List</div>

        <!-- Show LoadingPage only during initial page load -->
        <LoadingPage v-if="initialLoading" :message="'Loading Campaign Management Details...'" :sub-message="'Fetching campaign data'" />

        <!-- Show content area when not in initial loading -->
        <div v-else>
            <DataTable
                @filter="onFilter"
                :value="listData"
                :paginator="true"
                :rows="10"
                :rowsPerPageOptions="[10, 20, 50, 100]"
                dataKey="id"
                removableSort
                :rowHover="true"
                :loading="tableLoading"
                :filters="filters"
                filterDisplay="menu"
                :globalFilterFields="['campaignNo', 'title', 'publishDate', 'period', 'totalSub', 'status']"
                class="rounded-table"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
                paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
            >
                <!-- ========================= -->
                <!-- Header Section -->
                <!-- ========================= -->
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
                            <!-- <Button type="button" icon="pi pi-cog" class="p-button" /> -->
                        </div>

                        <!-- Right: Create Campaign Button -->
                        <div class="flex items-center gap-2 ml-auto">
                            <!-- Single Export Button (like in reference code - green success button) -->
                            <Button type="button" label="Export" icon="pi pi-file-export" class="p-button-success" :loading="exportLoading" @click="handleExport" :disabled="exportLoading" />

                            <RouterLink v-if="canUpdate" to="/marketing/createCampaign">
                                <Button type="button" label="Create" />
                            </RouterLink>
                        </div>
                    </div>
                </template>

                <template #empty>
                    <div class="text-center py-8 text-gray-500">No Campaign found.</div>
                </template>

                <template #loading>
                    <div class="text-center py-4">
                        <ProgressSpinner style="width: 30px; height: 30px" />
                        <p class="mt-2 text-gray-600">Loading campaign data...</p>
                    </div>
                </template>

                <!-- Export All Checkbox Column (EXACTLY like reference code) -->
                <Column header="Export All" style="min-width: 8rem">
                    <template #header>
                        <div class="flex justify-center">
                            <Checkbox :binary="true" :model-value="isAllSelected()" @change="() => toggleSelectAll()" />
                        </div>
                    </template>

                    <template #body="{ data }">
                        <div class="flex justify-center">
                            <Checkbox :binary="true" :model-value="selectedExportIds.has(data.id)" @change="() => handleToggleExport(data.id)" />
                        </div>
                    </template>
                </Column>

                <Column field="campaignNo" header="Campaign No" style="min-width: 8rem" sortable>
                    <template #body="{ data }">
                        <RouterLink :to="`/marketing/detailCampaign/${data.id}`" class="hover:underline font-bold text-primary-400">
                            {{ data.campaignNo }}
                        </RouterLink>
                    </template>
                </Column>

                <Column field="title" header="Title" style="min-width: 8rem">
                    <template #body="{ data }">
                        {{ data.title }}
                    </template>
                </Column>

                <Column field="publishDate" header="Publish Date" style="min-width: 6rem" sortable>
                    <template #body="{ data }">{{ data?.publishDate ? formatDate(data.publishDate) : 'Not Assigned' }}</template>
                </Column>

                <Column field="period" header="Period" style="min-width: 8rem">
                    <template #body="{ data }"> {{ formatDate(data.startDate) }} - {{ formatDate(data.endDate) }} </template>
                </Column>

                <Column field="totalSub" header="Total Sub" style="min-width: 6rem" sortable>
                    <template #body="{ data }">
                        {{ data.totalSub }}
                    </template>
                </Column>

                <Column field="status" header="Status" style="min-width: 6rem">
                    <template #body="{ data }">
                        <Tag :value="data.status === 1 ? 'Active' : 'Inactive'" :severity="getOverallStatusSeverity(data.status)" />
                    </template>
                </Column>
            </DataTable>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';
import { FilterMatchMode } from '@primevue/core/api';
import api from '@/service/api';
import LoadingPage from '@/components/LoadingPage.vue';
import { useMenuStore } from '@/store/menu';
import { useToast } from 'primevue/usetoast';

const menuStore = useMenuStore();
const canUpdate = computed(() => menuStore.canWrite('Campaign Management'));
const denyAccess = computed(() => menuStore.canTest('Campaign Management'));

// Data variables
const listData = ref([]);
const initialLoading = ref(true); // For initial page load
const tableLoading = ref(false); // For table operations
const exportLoading = ref(false);
const toast = useToast();
const visibleRows = ref([]); // For tracking filtered rows
const selectedExportIds = ref(new Set());

// Filters for quick search
const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});

const onFilter = (e) => {
    visibleRows.value = e.filteredValue || listData.value;
};

onMounted(async () => {
    try {
        initialLoading.value = true;
        tableLoading.value = true;

        const response = await api.get('campaign/campaignList');

        if (response.data.status === 1 && Array.isArray(response.data.admin_data)) {
            listData.value = response.data.admin_data.map((campaign) => ({
                id: campaign.id,
                campaignNo: campaign.campaignNo || 'N/A',
                title: campaign.title || 'Untitled',
                publishDate: campaign.publishDate || 'N/A',
                startDate: campaign.startDate || 'N/A',
                endDate: campaign.endDate || 'N/A',
                totalSub: campaign.total_participant || 0,
                status: campaign.status
            }));
        } else {
            toast.add({ severity: 'error', summary: 'Error', detail: response.data.message || 'Failed to load data', life: 3000 });
            listData.value = [];
        }
    } catch (error) {
        console.error('Error fetching campaign list:', error);
        toast.add({ severity: 'error', summary: 'Error', detail: response.data.message || 'Failed to load data', life: 3000 });
        listData.value = [];
    } finally {
        initialLoading.value = false;
        tableLoading.value = false;
    }
});

function formatDate(dateString) {
    if (!dateString) return '';

    // API format: YYYY-MM-DD
    const [year, month, day] = dateString.split('-');
    const date = new Date(`${year}-${month}-${day}`);

    if (isNaN(date)) return '';

    return date.toLocaleDateString('en-MY', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
}

const getOverallStatusSeverity = (status) => {
    return status === 1 ? 'success' : 'danger';
};

const handleExport = async () => {
        const idsArray = Array.from(selectedExportIds.value).map(id => Number(id));

    if (idsArray.length === 0) {
        alert('Please select at least one row.');
        return;
    }
    try {
        exportLoading.value = true;
        
            const response = await api.postExtra(
            'report/campaign',{ campaign_ids: JSON.stringify(idsArray) },
        {
            responseType: 'blob',
            headers: {
            'Content-Type': 'application/json',
            }
        }
        );
        const blob = new Blob([response.data], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
        });

        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'CampaignList_Download.xlsx';
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
// EXACTLY like reference code - toggle all visible rows
const toggleSelectAll = () => {
    const allIds = visibleRows.value.map((item) => item.id);

    if (isAllSelected()) {
        // Remove all visible IDs at once (EXACTLY like reference code)
        selectedExportIds.value = new Set([...selectedExportIds.value].filter((id) => !allIds.includes(id)));
    } else {
        // Add all visible IDs at once (EXACTLY like reference code)
        selectedExportIds.value = new Set([...selectedExportIds.value, ...allIds]);
    }
};

// EXACTLY like reference code - check if all visible rows are selected
const isAllSelected = () => {
    return visibleRows.value.length > 0 && visibleRows.value.every((item) => selectedExportIds.value.has(item.id));
};

// EXACTLY like reference code - handle individual checkbox toggle
const handleToggleExport = (id) => {
    if (selectedExportIds.value.has(id)) {
        selectedExportIds.value.delete(id);
    } else {
        selectedExportIds.value.add(id);
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

// Rounded table styles
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

    // For the last row in the table body
    .p-datatable-tbody > tr:last-child > td {
        &:first-child {
            border-bottom-left-radius: 0;
        }
        &:last-child {
            border-bottom-right-radius: 0;
        }
    }

    // When table is empty
    .p-datatable-tbody > tr.p-datatable-emptymessage > td {
        border-bottom-left-radius: 12px;
        border-bottom-right-radius: 12px;
    }
}
</style>
