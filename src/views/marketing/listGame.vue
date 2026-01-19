<template>
    <div class="card">
        <div class="text-2xl font-bold text-gray-800 border-b pb-2 mb-6">Game Management List</div>

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
                :globalFilterFields="['gameNo', 'gameName', 'title', 'type', 'publishDate', 'status']"
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
                            <Button 
                                type="button" 
                                label="Export" 
                                icon="pi pi-file-export" 
                                class="p-button-success" 
                                :loading="exportLoading" 
                                @click="handleExport" 
                                :disabled="exportLoading"
                            />
                            
                            <RouterLink v-if="canUpdate" to="/marketing/CreateGame">
                                <Button type="button" label="Create" />
                            </RouterLink>
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
                <Column header="Export All" style="min-width: 8rem">
                    <template #header>
                        <div class="flex justify-center">
                            <Checkbox 
                                :binary="true" 
                                :model-value="isAllSelected()" 
                                @change="() => toggleSelectAll()" 
                            />
                        </div>
                    </template>

                    <template #body="{ data }">
                        <div class="flex justify-center">
                            <Checkbox 
                                :binary="true" 
                                :model-value="selectedExportIds.has(data.id)" 
                                @change="() => handleToggleExport(data.id)" 
                            />
                        </div>
                    </template>
                </Column>

                <Column field="gameNo" header="Game No" style="min-width: 6rem" sortable="">
                    <template #body="{ data }">
                        <RouterLink :to="`/marketing/detailGame/${data.id}`" class="hover:underline font-bold text-primary-400">
                            {{ data.gameNo }}
                        </RouterLink>
                    </template>
                </Column>

                <Column field="gameName" header="Game Name" style="min-width: 8rem">
                    <template #body="{ data }">
                        {{ data.title }}
                    </template>
                </Column>

                <Column field="type" header="Type" style="min-width: 6rem">
                    <template #body="{ data }">
                        {{ data.type }}
                    </template>
                </Column>

                <Column field="game Duration" header="Duration" style="min-width: 10rem">
                    <template #body="{ data }">
                        {{ formatDate(data.startDate) }}
                        <span class="font-semibold"> - </span>
                        {{ formatDate(data.endDate) }}
                    </template>
                </Column>
                
                <Column field="publishDate" header="Publish Date" style="min-width: 8rem" sortable>
                    <template #body="{ data }">
                        {{ formatDate(data.publishDate) }}
                    </template>
                </Column>
                
                <Column field="Total Participant" header="Total Participant" style="min-width: 8rem" sortable>
                    <template #body="{ data }">
                        {{ data.totalParticipant }}
                    </template>
                </Column>

                <Column field="status" header="Status" style="min-width: 8rem">
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
import api from '@/service/api';
import { FilterMatchMode } from '@primevue/core/api';
import LoadingPage from '@/components/LoadingPage.vue';
import { useMenuStore } from '@/store/menu';
import { useToast } from 'primevue/usetoast';

const toast = useToast();
const menuStore = useMenuStore();
const canUpdate = computed(() => menuStore.canWrite('Game Management'));
const denyAccess = computed(() => menuStore.canTest('Game Management'));

// Data variables (EXACTLY like reference code)
const listData = ref([]);
const initialLoading = ref(true);
const tableLoading = ref(false);
const exportLoading = ref(false);
const selectedExportIds = ref(new Set()); // Using Set like reference code
const visibleRows = ref([]); // For tracking filtered rows
const exportLoading1 = ref(false);

// Filters
const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});

// EXACTLY like reference code
const onTableFilter = (event) => {
    visibleRows.value = event.filteredValue || listData.value;
};

onMounted(async () => {
    try {
        initialLoading.value = true;
        tableLoading.value = true;

        const response = await api.get('game/gameList');

        if (response.data.status === 1 && Array.isArray(response.data.admin_data)) {
            listData.value = response.data.admin_data.map((game) => ({
                id: game.id,
                gameNo: game.gameNo || 'N/A',
                title: game.title || 'Untitled',
                type: game.type || 'N/A',
                publishDate: game.publishDate || 'N/A',
                status: game.status,
                totalParticipant: game.total_participant || 'No Participants',
                startDate: game.startDate || '-',
                endDate: game.endDate || '-',
                quota: game.quota || 'N/A'
            }));
            visibleRows.value = [...listData.value]; // Initialize visible rows
        } else {
            toast.add({ 
                severity: 'error', 
                summary: 'Error', 
                detail: response.data.message || 'Failed to load data', 
                life: 3000 
            });
            listData.value = [];
            visibleRows.value = [];
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
        visibleRows.value = [];
    } finally {
        initialLoading.value = false;
        tableLoading.value = false;
    }
});

const getOverallStatusSeverity = (status) => {
    return status === 1 ? 'success' : 'danger';
};

function formatDate(dateString) {
    if (!dateString) return '';

    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return dateString;
        
        return date.toLocaleDateString('en-MY', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    } catch (error) {
        console.error('Date formatting error:', error);
        return dateString;
    }
}

// EXACTLY like reference code - handle individual checkbox toggle
const handleToggleExport = (id) => {
    if (selectedExportIds.value.has(id)) {
        selectedExportIds.value.delete(id);
    } else {
        selectedExportIds.value.add(id);
    }
};

// EXACTLY like reference code - toggle all visible rows
const toggleSelectAll = () => {
    const allIds = visibleRows.value.map(item => item.id);

    if (isAllSelected()) {
        // Remove all visible IDs at once (EXACTLY like reference code)
        selectedExportIds.value = new Set([...selectedExportIds.value].filter(id => !allIds.includes(id)));
    } else {
        // Add all visible IDs at once (EXACTLY like reference code)
        selectedExportIds.value = new Set([...selectedExportIds.value, ...allIds]);
    }
};

// EXACTLY like reference code - check if all visible rows are selected
const isAllSelected = () => {
    return visibleRows.value.length > 0 && visibleRows.value.every(item => selectedExportIds.value.has(item.id));
};

// EXACTLY like reference code - Export function with the same pattern
// CORRECTED Export function - matches API documentation
const handleExport = async () => {
    const idsArray = Array.from(selectedExportIds.value).map(id => Number(id));

    if (idsArray.length === 0) {
        alert('Please select at least one row.');
        return;
    }

    exportLoading.value = true;

    try {
        // Approach 1: Standard JSON format
        let requestBody = { game_ids: idsArray };
        
        // Try multiple approaches like the reference code
        let response;
        
        try {
            // First try: Standard format
            response = await api.postExtra(
                'excel/game-list',
                requestBody,
                {
                    responseType: 'blob',
                    headers: { 'Content-Type': 'application/json' }
                }
            );
        } catch (error1) {
            console.log('Standard format failed, trying alternative...');
            
            // Second try: Alternative format (if server expects different structure)
            const alternativeBody = {
                game_ids: JSON.stringify(idsArray) // Some APIs expect stringified arrays
            };
            
            response = await api.postExtra(
                'excel/game-list',
                alternativeBody,
                {
                    responseType: 'blob',
                    headers: { 'Content-Type': 'application/json' }
                }
            );
        }

        // Check if response is a blob
        if (!response.data || !(response.data instanceof Blob)) {
            throw new Error('Server did not return Excel file');
        }

        // Get filename from server or generate default
        let filename = `Game_Export_${new Date().toISOString().split('T')[0]}.xlsx`;
        const contentDisposition = response.headers['content-disposition'];
        
        if (contentDisposition) {
            const filenameMatch = contentDisposition.match(/filename\*?=["']?([^"']+)["']?/i);
            if (filenameMatch && filenameMatch[1]) {
                filename = decodeURIComponent(filenameMatch[1]);
            }
        }

        // Create and download blob
        const blob = new Blob([response.data], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });

        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        // Cleanup
        setTimeout(() => {
            window.URL.revokeObjectURL(url);
        }, 100);

        toast.add({ 
            severity: 'success', 
            summary: 'Export Successful', 
            detail: `Exported ${idsArray.length} game(s) to ${filename}`, 
            life: 3000 
        });
        
        selectedExportIds.value.clear();
        
    } catch (error) {
        console.error('Export Error:', error);
        
        // Enhanced error handling like reference code
        if (error.response) {
            // Check if error is in blob format
            if (error.response.data instanceof Blob) {
                try {
                    const errorText = await error.response.data.text();
                    console.error('Error from server:', errorText);
                    
                    try {
                        const errorJson = JSON.parse(errorText);
                        toast.add({
                            severity: 'error',
                            summary: 'Export Failed',
                            detail: errorJson.message || errorJson.error || 'Server error occurred',
                            life: 3000
                        });
                    } catch (parseError) {
                        toast.add({
                            severity: 'error',
                            summary: 'Export Failed',
                            detail: 'Server returned unexpected format',
                            life: 3000
                        });
                    }
                } catch (blobError) {
                    toast.add({
                        severity: 'error',
                        summary: 'Export Failed',
                        detail: `Server error: ${error.response.status}`,
                        life: 3000
                    });
                }
            } else {
                // Regular error response
                const errorMsg = error.response.data?.message || 
                                error.response.data?.error || 
                                `Server error: ${error.response.status}`;
                toast.add({
                    severity: 'error',
                    summary: 'Export Failed',
                    detail: errorMsg,
                    life: 3000
                });
            }
        } else {
            toast.add({
                severity: 'error',
                summary: 'Export Failed',
                detail: error.message || 'Failed to export data',
                life: 3000
            });
        }
        
        // Try FormData approach as last resort
        await tryFormDataApproach();
    } finally {
        exportLoading.value = false;
    }
};

// Add FormData fallback method
const tryFormDataApproach = async () => {
    try {
        const idsArray = Array.from(selectedExportIds.value).map(id => Number(id));
        const formData = new FormData();
        
        // Append as comma-separated string
        formData.append('game_ids', idsArray.join(','));
        
        const response = await api.postExtra(
            'excel/game-list',
            formData,
            {
                responseType: 'blob',
                headers: { 'Content-Type': 'multipart/form-data' }
            }
        );
        
        if (response.data instanceof Blob) {
            const blob = new Blob([response.data], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            });
            
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `Game_Export_${idsArray.join('_')}.xlsx`;
            a.click();
            
            toast.add({
                severity: 'success',
                summary: 'Export Successful',
                detail: 'File downloaded using alternative method',
                life: 3000
            });
        }
    } catch (formDataError) {
        console.error('FormData approach also failed:', formDataError);
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