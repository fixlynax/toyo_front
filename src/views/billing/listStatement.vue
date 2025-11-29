<script setup>
import { onBeforeMount, ref, reactive } from 'vue';
import api from '@/service/api';
import { FilterMatchMode, FilterOperator } from '@primevue/core/api';
import LoadingPage from '@/components/LoadingPage.vue';
import { useToast } from 'primevue/usetoast';

const toast = useToast();

// Reactive filters
const filters1 = reactive({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    dealerName: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
    dealerId: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] }
});

const listData = ref([]);
const loading = ref(true);
const downloadLoading = ref(null);
const viewLoading = ref(null);
const error = ref(null);

// Selection state for bulk download
const selectedFiles = ref([]);

// API service functions for Statement
const StatementService = {
    async getStatementList() {
        try {
            const response = await api.get('credit/statement');
            if (response.data.status === 1) {
                // Transform the API data to match your table structure
                return response.data.admin_data.map((item) => ({
                    id: item.file_path,
                    docsDate: item.date,
                    dealerId: item.account_no,
                    dealerName: item.custName,
                    company: item.company,
                    filePath: item.file_path,
                    fileUrl: item.file_url, // Include file_url for direct viewing
                    download: true
                }));
            } else {
                throw new Error('Failed to fetch statement data');
            }
        } catch (error) {
            console.error('Error fetching statement list:', error);
            throw error;
        }
    },

    async downloadFile(filePath, fileName) {
        try {
            const response = await api.postExtra(
                'credit/download',
                { file_path: filePath },
                {
                    responseType: 'blob',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            // Create blob and download
            const blob = new Blob([response.data], { type: response.headers['content-type'] });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = fileName || filePath.split('/').pop();
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // Clean up URL after download
            setTimeout(() => {
                window.URL.revokeObjectURL(url);
            }, 100);

            return true;
        } catch (error) {
            console.error('Error downloading file:', error);
            throw error;
        }
    },

    async viewFile(filePath, fileUrl) {
        try {
            // First, try using the download endpoint with blob method (more reliable)
            const response = await api.postExtra(
                'credit/download',
                { file_path: filePath },
                {
                    responseType: 'blob',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            // Create blob with proper MIME type
            const blob = new Blob([response.data], {
                type: 'application/pdf' // Statements are always PDF
            });
            const blobUrl = window.URL.createObjectURL(blob);

            // Try to open in new window
            const newWindow = window.open(blobUrl, '_blank');

            if (newWindow) {
                // Clean up when the new window loads
                newWindow.onload = () => {
                    setTimeout(() => {
                        window.URL.revokeObjectURL(blobUrl);
                    }, 1000);
                };

                // Fallback cleanup if onload doesn't fire
                setTimeout(() => {
                    window.URL.revokeObjectURL(blobUrl);
                }, 5000);
            } else {
                // If popup is blocked, create download link as fallback
                const link = document.createElement('a');
                link.href = blobUrl;
                link.target = '_blank';
                link.style.display = 'none';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                // Clean up after fallback
                setTimeout(() => {
                    window.URL.revokeObjectURL(blobUrl);
                }, 1000);
            }

            return true;
        } catch (error) {
            console.error('Error viewing file via download endpoint:', error);

            // If blob method fails, try the pre-signed URL as fallback
            if (fileUrl) {
                try {
                    console.log('Trying pre-signed URL as fallback:', fileUrl);
                    window.open(fileUrl, '_blank');
                    return true;
                } catch (fallbackError) {
                    console.error('Pre-signed URL also failed:', fallbackError);
                    throw new Error('Both download methods failed');
                }
            }

            throw error;
        }
    }
};

const handleDownload = async (data) => {
    if (!data.filePath || !data.download) {
        toast.add({
            severity: 'warn',
            summary: 'Cannot Download',
            detail: 'Statement is not available for download',
            life: 3000
        });
        return;
    }

    downloadLoading.value = data.id;
    try {
        // Sanitize filename to remove invalid characters
        const sanitizeFileName = (name) => (name ? name.replace(/[/\\?%*:|"<>]/g, '-') : 'Unknown');
        const fileName = `Statement_${sanitizeFileName(data.dealerName)}_${data.docsDate.replace(/\//g, '-')}.pdf`;
        await StatementService.downloadFile(data.filePath, fileName);

        // Show success toast
        toast.add({
            severity: 'success',
            summary: 'Download Successful',
            detail: 'Statement has been downloaded successfully',
            life: 3000
        });
    } catch (error) {
        console.error('Download failed:', error);

        let errorDetail = 'Failed to download statement. Please try again.';
        if (error.response?.status === 404) {
            errorDetail = 'Statement file not found on the server.';
        } else if (error.response?.status === 403) {
            errorDetail = 'You do not have permission to download this statement.';
        }

        // Show error toast
        toast.add({
            severity: 'error',
            summary: 'Download Failed',
            detail: errorDetail,
            life: 5000
        });
    } finally {
        downloadLoading.value = null;
    }
};

const handleView = async (data) => {
    if (!data.filePath || !data.download) {
        toast.add({
            severity: 'warn',
            summary: 'Cannot View Statement',
            detail: 'Statement is not available for viewing',
            life: 3000
        });
        return;
    }

    viewLoading.value = data.id;
    try {
        await StatementService.viewFile(data.filePath, data.fileUrl);

        // Show success toast
        toast.add({
            severity: 'success',
            summary: 'Statement Opened',
            detail: 'Statement has been opened in a new tab',
            life: 3000
        });
    } catch (error) {
        console.error('View failed:', error);

        let errorDetail = 'Failed to open statement. Please try again.';
        if (error.message.includes('popup') || error.message.includes('blocked')) {
            errorDetail = 'Popup was blocked. Please allow popups for this site and try again.';
        } else if (error.response?.status === 404) {
            errorDetail = 'Statement file not found on the server. The file may have been moved or deleted.';
        } else if (error.response?.status === 403) {
            errorDetail = 'You do not have permission to view this statement.';
        } else if (error.message.includes('Both download methods failed')) {
            errorDetail = 'Statement cannot be accessed. Please contact administrator.';
        }

        // Show error toast
        toast.add({
            severity: 'error',
            summary: 'View Failed',
            detail: errorDetail,
            life: 5000
        });
    } finally {
        viewLoading.value = null;
    }
};

const handleBulkDownload = async () => {
    if (selectedFiles.value.length === 0) {
        toast.add({
            severity: 'warn',
            summary: 'No Statements Selected',
            detail: 'Please select statements to download',
            life: 3000
        });
        return;
    }

    downloadLoading.value = 'bulk';
    try {
        let successCount = 0;
        let errorCount = 0;

        for (const file of selectedFiles.value) {
            try {
                const sanitizeFileName = (name) => (name ? name.replace(/[/\\?%*:|"<>]/g, '-') : 'Unknown');
                const fileName = `Statement_${sanitizeFileName(file.dealerName)}_${file.docsDate.replace(/\//g, '-')}.pdf`;
                await StatementService.downloadFile(file.filePath, fileName);
                successCount++;

                // Small delay between downloads to prevent overwhelming the server
                await new Promise((resolve) => setTimeout(resolve, 100));
            } catch (error) {
                console.error(`Failed to download statement: ${file.filePath}`, error);
                errorCount++;
            }
        }

        // Show appropriate toast based on results
        if (errorCount === 0) {
            toast.add({
                severity: 'success',
                summary: 'Bulk Download Successful',
                detail: `${successCount} statements have been downloaded successfully`,
                life: 3000
            });
        } else if (successCount === 0) {
            toast.add({
                severity: 'error',
                summary: 'Bulk Download Failed',
                detail: 'All statements failed to download. Please try again.',
                life: 5000
            });
        } else {
            toast.add({
                severity: 'warn',
                summary: 'Partial Download',
                detail: `${successCount} statements downloaded successfully, ${errorCount} statements failed`,
                life: 5000
            });
        }

        // Clear selection after download
        selectedFiles.value = [];
    } catch (error) {
        console.error('Bulk download failed:', error);
        // Show error toast
        toast.add({
            severity: 'error',
            summary: 'Download Failed',
            detail: 'Failed to download statements. Please try again.',
            life: 5000
        });
    } finally {
        downloadLoading.value = null;
    }
};

onBeforeMount(async () => {
    await loadInitialData();
});

const loadInitialData = async () => {
    loading.value = true;
    error.value = null;
    try {
        listData.value = await StatementService.getStatementList();
    } catch (err) {
        console.error('Failed to load statement data:', err);
        error.value = err.message;
        listData.value = [];

        toast.add({
            severity: 'error',
            summary: 'Load Failed',
            detail: 'Failed to load statement data',
            life: 5000
        });
    } finally {
        loading.value = false;
    }
};

// Refresh function
const refreshData = async () => {
    loading.value = true;
    error.value = null;
    try {
        listData.value = await StatementService.getStatementList();

        toast.add({
            severity: 'success',
            summary: 'Data Refreshed',
            detail: 'Statement data has been refreshed',
            life: 3000
        });
    } catch (err) {
        console.error('Failed to refresh statement data:', err);
        error.value = err.message;

        toast.add({
            severity: 'error',
            summary: 'Refresh Failed',
            detail: 'Failed to refresh statement data',
            life: 5000
        });
    } finally {
        loading.value = false;
    }
};
</script>

<template>
    <div class="card">
        <Toast />

        <div class="flex justify-between items-center mb-4">
            <div class="text-2xl font-bold text-black">List Statement</div>
            <div class="flex gap-2">
                <Button
                    icon="pi pi-download"
                    label="Download Selected"
                    class="p-button-outlined p-button-sm"
                    @click="handleBulkDownload"
                    :disabled="selectedFiles.length === 0 || downloadLoading === 'bulk'"
                    :loading="downloadLoading === 'bulk'"
                    v-tooltip="selectedFiles.length > 0 ? `Download ${selectedFiles.length} selected statements` : 'Select statements to download'"
                />
                <Button icon="pi pi-refresh" class="p-button-outlined p-button-sm" @click="refreshData" :disabled="loading" v-tooltip="'Refresh data'" />
            </div>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="p-4 mb-4 text-red-700 bg-red-100 rounded-lg border border-red-200">
            <div class="flex items-center">
                <i class="pi pi-exclamation-triangle mr-2"></i>
                <span>Error loading statement data: {{ error }}</span>
            </div>
            <Button label="Try Again" icon="pi pi-refresh" class="p-button-text p-button-sm mt-2" @click="refreshData" />
        </div>

        <!-- Loading State -->
        <LoadingPage v-if="loading" :message="'Loading Statement Data...'" :sub-message="'Fetching statement information'" />

        <!-- Data Table -->
        <DataTable
            v-else
            :value="listData"
            :paginator="true"
            :rows="10"
            dataKey="id"
            class="rounded-table text-sm"
            :rowHover="true"
            :filters="filters1"
            :rowsPerPageOptions="[10, 20, 50, 100]"
            removableSort
            sortField="docsDate"
            :sortOrder="1"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
            paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
            v-model:selection="selectedFiles"
        >
            <template #header>
                <div class="flex items-center justify-between gap-4 w-full flex-wrap">
                    <div class="flex items-center gap-2 w-full max-w-md">
                        <IconField class="flex-1">
                            <InputIcon>
                                <i class="pi pi-search" />
                            </InputIcon>
                            <InputText v-model="filters1['global'].value" placeholder="Quick Search..." class="w-full" />
                        </IconField>
                    </div>
                </div>
            </template>

            <template #empty>
                <div class="text-center py-8 text-black">
                    <i class="pi pi-file-excel text-4xl mb-2"></i>
                    <div>No statement records found.</div>
                </div>
            </template>

            <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>

            <Column field="docsDate" header="Document Date" style="min-width: 8rem" sortable>
                <template #body="{ data }">
                    <span class="font-medium">{{ data.docsDate }}</span>
                </template>
            </Column>

            <Column field="dealerId" header="Customer Acc No." style="min-width: 10rem" sortable>
                <template #body="{ data }">
                    <span class="font-medium">{{ data.dealerId }}</span>
                </template>
            </Column>

            <Column field="dealerName" header="Customer Name" style="min-width: 10rem" sortable>
                <template #body="{ data }">
                    <span v-if="data.dealerName">{{ data.dealerName }}</span>
                    <span v-else class="text-black">-</span>
                </template>
            </Column>

            <Column header="Action" style="min-width: 10rem; text-align: left">
                <template #body="{ data }">
                    <div class="flex gap-2">
                        <Button
                            icon="pi pi-eye"
                            class="p-button-xm p-button-info"
                            :disabled="!data.download || viewLoading === data.id"
                            :loading="viewLoading === data.id"
                            @click="handleView(data)"
                            v-tooltip.top="data.download ? 'View Statement' : 'View not available'"
                        />
                        <Button
                            icon="pi pi-download"
                            class="p-button-xm"
                            :severity="data.download ? 'success' : 'secondary'"
                            :disabled="!data.download || downloadLoading === data.id"
                            :loading="downloadLoading === data.id"
                            @click="handleDownload(data)"
                            v-tooltip.top="data.download ? 'Download Statement' : 'Download not available'"
                        />
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
