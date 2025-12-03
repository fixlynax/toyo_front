<template>
    <div class="card">
        <Toast />

        <div class="flex justify-between items-center mb-4">
            <div class="text-2xl font-bold text-black">Account Details</div>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="p-4 mb-4 text-red-700 bg-red-100 rounded-lg border border-red-200">
            <div class="flex items-center">
                <i class="pi pi-exclamation-triangle mr-2"></i>
                <span>Error loading account detail data: {{ error }}</span>
            </div>
            <Button label="Try Again" icon="pi pi-refresh" class="p-button-text p-button-sm mt-2" @click="refreshData" />
        </div>

        <!-- Loading State -->
        <LoadingPage v-if="loading" :message="'Loading Account Detail Data...'" :sub-message="'Fetching account detail information'" />

        <!-- Data Table -->
        <DataTable
            v-else
            :value="filteredData"
            :paginator="true"
            :rows="10"
            dataKey="id"
            class="rounded-table text-sm"
            :rowHover="true"
            :filters="filters1"
            :rowsPerPageOptions="[10, 20, 50, 100]"
            removableSort
            sortField="sortableDate"
            :sortOrder="-1"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
            paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
            v-model:selection="selectedFiles"
        >
            <template #header>
                <div class="flex flex-col gap-4 w-full">
                    <!-- Top Row: Search and Buttons -->
                    <div class="flex items-center justify-between gap-4 w-full flex-wrap">
                        <div class="flex items-center gap-2 w-full max-w-md">
                            <IconField class="flex-1">
                                <InputIcon><i class="pi pi-search" /></InputIcon>
                                <InputText v-model="filters1['global'].value" placeholder="Quick Search..." class="w-full" />
                            </IconField>
                        </div>
                        <div class="flex gap-2">
                            <Button
                                icon="pi pi-download"
                                label="Download Selected"
                                class="p-button p-button-sm"
                                @click="handleBulkDownload"
                                :disabled="selectedFiles.length === 0 || downloadLoading === 'bulk'"
                                :loading="downloadLoading === 'bulk'"
                                v-tooltip="selectedFiles.length > 0 ? `Download ${selectedFiles.length} selected account details` : 'Select account details to download'"
                            />
                            <Button icon="pi pi-refresh" class="p-button-info p-button-sm" @click="refreshData" :disabled="loading" v-tooltip="'Refresh data'" />
                        </div>
                    </div>
                    <!-- Date Range Filter -->
                    <div class="flex items-center gap-4 mb-1 flex-wrap">
                        <div class="flex items-center gap-2">
                            <span class="text-sm font-medium text-gray-700">Date Range:</span>
                            <div class="flex items-center gap-2">
                                <Calendar v-model="dateRange[0]" placeholder="Start Date" dateFormat="yy-mm-dd" showIcon class="w-40" :disabled="loading" />
                                <span class="text-gray-500">to</span>
                                <Calendar v-model="dateRange[1]" placeholder="End Date" dateFormat="yy-mm-dd" showIcon class="w-40" :disabled="loading" />
                            </div>
                            <Button v-if="dateRange[0] || dateRange[1]" icon="pi pi-times" class="p-button-text p-button-sm" @click="clearDateRange" title="Clear date filter" />
                        </div>
                        <div v-if="!hasDateFilterApplied" class="text-sm text-blue-600 italic">Select a date range to filter by document date</div>
                    </div>
                </div>
            </template>

            <template #empty>
                <div class="text-center py-8 text-gray-500">
                    <template v-if="!hasDateFilterApplied">
                        <div class="flex flex-col items-center gap-2">
                            <i class="pi pi-calendar text-3xl text-blue-400"></i>
                            <span class="text-lg">Select a date range to view account details</span>
                            <span class="text-sm text-gray-400">Choose both start and end dates to filter results</span>
                        </div>
                    </template>
                    <template v-else-if="hasDateFilterApplied && (!dateRange[0] || !dateRange[1])">
                        <div class="flex flex-col items-center gap-2">
                            <i class="pi pi-exclamation-circle text-3xl text-yellow-400"></i>
                            <span class="text-lg">Please select both start and end dates</span>
                        </div>
                    </template>
                    <template v-else>
                        <i class="pi pi-file-excel text-4xl mb-2"></i>
                        <div>No account detail records found in the selected date range.</div>
                    </template>
                </div>
            </template>

            <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>

            <Column field="docsDate" header="Document Date Time" style="min-width: 12rem" sortable>
                <template #body="{ data }">
                    <span class="font-medium">{{ data.docsDate }}</span>
                    <div class="text-xs text-gray-500">{{ formatDateForDisplay(data.docsDate) }}</div>
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

            <!-- Amount Due -->
            <Column field="amtdue" header="Amount Due" style="min-width: 12rem; text-align: right" sortable>
                <template #body="{ data }">
                    <div class="flex justify-start items-center w-full">
                        <span class="font-bold" :class="data.amtdue < 0 ? 'text-red-500' : 'text-black'">
                            {{ formatCurrency(data.amtdue) }}
                        </span>
                    </div>
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
                            v-tooltip.top="data.download ? 'View Account Detail' : 'View not available'"
                        />
                        <Button
                            icon="pi pi-download"
                            class="p-button-xm"
                            :severity="data.download ? 'success' : 'secondary'"
                            :disabled="!data.download || downloadLoading === data.id"
                            :loading="downloadLoading === data.id"
                            @click="handleDownload(data)"
                            v-tooltip.top="data.download ? 'Download Account Detail' : 'Download not available'"
                        />
                    </div>
                </template>
            </Column>
        </DataTable>
    </div>
</template>

<script setup>
import { onBeforeMount, ref, reactive, computed, watch } from 'vue';
import api from '@/service/api';
import { FilterMatchMode, FilterOperator } from '@primevue/core/api';
import LoadingPage from '@/components/LoadingPage.vue';
import { useToast } from 'primevue/usetoast';
import Calendar from 'primevue/calendar';
import Button from 'primevue/button';

const toast = useToast();

// 🟢 State Management
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
const dateRange = ref([null, null]);
const hasDateFilterApplied = ref(false);

// Selection state for bulk download
const selectedFiles = ref([]);

// 🟢 API service functions for Account Detail
const AccountDetailService = {
    async getAccountDetailList() {
        try {
            const response = await api.get('credit/acctdtl');
            if (response.data.status === 1) {
                // Transform the API data to match your table structure
                return response.data.admin_data.map((item) => {
                    // Extract and parse the date from datetime
                    const dateTimeStr = item.datetime;
                    let parsedDate = null;
                    let sortableDate = null;

                    // Parse the date from various formats
                    if (dateTimeStr) {
                        // Try to parse DD/MM/YYYY HH:MM:SS format
                        if (dateTimeStr.includes('/')) {
                            const datePart = dateTimeStr.split(' ')[0]; // Get date part
                            const [day, month, year] = datePart.split('/');
                            if (day && month && year) {
                                parsedDate = new Date(`${year}-${month}-${day}`);
                                sortableDate = parsedDate.getTime();
                            }
                        }
                        // Try ISO format
                        else {
                            parsedDate = new Date(dateTimeStr);
                            sortableDate = parsedDate.getTime();
                        }
                    }

                    return {
                        id: item.file_path,
                        docsDate: item.datetime,
                        sortableDate: sortableDate, // For proper sorting
                        dealerId: item.account_no,
                        dealerName: item.custName,
                        amtdue: parseFloat(item.amount),
                        company: item.company,
                        filePath: item.file_path,
                        fileUrl: item.file_url,
                        download: true,
                        parsedDate: parsedDate // For date filtering
                    };
                });
            } else {
                throw new Error('Failed to fetch account detail data');
            }
        } catch (error) {
            console.error('Error fetching account detail list:', error);
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

            const blob = new Blob([response.data], { type: response.headers['content-type'] });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = fileName || filePath.split('/').pop();
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

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

            const blob = new Blob([response.data], {
                type: 'application/pdf'
            });
            const blobUrl = window.URL.createObjectURL(blob);
            const newWindow = window.open(blobUrl, '_blank');

            if (newWindow) {
                newWindow.onload = () => {
                    setTimeout(() => {
                        window.URL.revokeObjectURL(blobUrl);
                    }, 1000);
                };

                setTimeout(() => {
                    window.URL.revokeObjectURL(blobUrl);
                }, 5000);
            } else {
                const link = document.createElement('a');
                link.href = blobUrl;
                link.target = '_blank';
                link.style.display = 'none';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                setTimeout(() => {
                    window.URL.revokeObjectURL(blobUrl);
                }, 1000);
            }

            return true;
        } catch (error) {
            console.error('Error viewing file via download endpoint:', error);

            if (fileUrl) {
                try {
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

// 🟢 Watcher for date range changes
watch(
    dateRange,
    (newRange, oldRange) => {
        if (newRange[0] && newRange[1]) {
            hasDateFilterApplied.value = true;
        } else if (newRange[0] === null && newRange[1] === null && hasDateFilterApplied.value) {
            hasDateFilterApplied.value = false;
        }
    },
    { deep: true }
);

// 🟢 Computed - Filter data by date range
const filteredData = computed(() => {
    if (!hasDateFilterApplied.value) {
        return [];
    }

    let filtered = [...listData.value];

    // Apply date range filter based on parsedDate
    if (dateRange.value[0] && dateRange.value[1]) {
        filtered = filtered.filter((item) => {
            if (!item.parsedDate || isNaN(item.parsedDate.getTime())) return false;

            const orderDate = new Date(item.parsedDate);
            orderDate.setHours(0, 0, 0, 0);

            const startDate = dateRange.value[0] ? new Date(dateRange.value[0]) : null;
            const endDate = dateRange.value[1] ? new Date(dateRange.value[1]) : null;

            if (startDate) startDate.setHours(0, 0, 0, 0);
            if (endDate) endDate.setHours(23, 59, 59, 999);

            const isAfterStart = !startDate || orderDate >= startDate;
            const isBeforeEnd = !endDate || orderDate <= endDate;

            return isAfterStart && isBeforeEnd;
        });
    }

    return filtered;
});

// 🟢 Handle Download
const handleDownload = async (data) => {
    if (!data.filePath || !data.download) {
        toast.add({
            severity: 'warn',
            summary: 'Cannot Download',
            detail: 'Account detail is not available for download',
            life: 3000
        });
        return;
    }

    downloadLoading.value = data.id;
    try {
        const sanitizeFileName = (name) => (name ? name.replace(/[/\\?%*:|"<>]/g, '-') : 'Unknown');
        const datePart = data.docsDate ? data.docsDate.split(' ')[0] : new Date().toISOString().split('T')[0];
        const fileName = `AccountDetail_${sanitizeFileName(data.dealerName)}_${datePart.replace(/\//g, '-')}.pdf`;
        await AccountDetailService.downloadFile(data.filePath, fileName);

        toast.add({
            severity: 'success',
            summary: 'Download Successful',
            detail: 'Account detail has been downloaded successfully',
            life: 3000
        });
    } catch (error) {
        console.error('Download failed:', error);

        let errorDetail = 'Failed to download account detail. Please try again.';
        if (error.response?.status === 404) {
            errorDetail = 'Account detail file not found on the server.';
        } else if (error.response?.status === 403) {
            errorDetail = 'You do not have permission to download this account detail.';
        }

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

// 🟢 Handle View
const handleView = async (data) => {
    if (!data.filePath || !data.download) {
        toast.add({
            severity: 'warn',
            summary: 'Cannot View Account Detail',
            detail: 'Account detail is not available for viewing',
            life: 3000
        });
        return;
    }

    viewLoading.value = data.id;
    try {
        await AccountDetailService.viewFile(data.filePath, data.fileUrl);

        toast.add({
            severity: 'success',
            summary: 'File Opened',
            detail: 'Account detail has been opened in a new tab',
            life: 3000
        });
    } catch (error) {
        console.error('View failed:', error);

        let errorDetail = 'Failed to open account detail. Please try again.';
        if (error.message.includes('popup') || error.message.includes('blocked')) {
            errorDetail = 'Popup was blocked. Please allow popups for this site and try again.';
        } else if (error.response?.status === 404) {
            errorDetail = 'Account detail file not found on the server. The file may have been moved or deleted.';
        } else if (error.response?.status === 403) {
            errorDetail = 'You do not have permission to view this account detail.';
        } else if (error.message.includes('Both download methods failed')) {
            errorDetail = 'Account detail cannot be accessed. Please contact administrator.';
        }

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

// 🟢 Handle Bulk Download
const handleBulkDownload = async () => {
    if (selectedFiles.value.length === 0) {
        toast.add({
            severity: 'warn',
            summary: 'No Files Selected',
            detail: 'Please select account details to download',
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
                const datePart = file.docsDate ? file.docsDate.split(' ')[0] : new Date().toISOString().split('T')[0];
                const fileName = `AccountDetail_${sanitizeFileName(file.dealerName)}_${datePart.replace(/\//g, '-')}.pdf`;
                await AccountDetailService.downloadFile(file.filePath, fileName);
                successCount++;

                await new Promise((resolve) => setTimeout(resolve, 100));
            } catch (error) {
                console.error(`Failed to download account detail: ${file.filePath}`, error);
                errorCount++;
            }
        }

        if (errorCount === 0) {
            toast.add({
                severity: 'success',
                summary: 'Bulk Download Successful',
                detail: `${successCount} account details have been downloaded successfully`,
                life: 3000
            });
        } else if (successCount === 0) {
            toast.add({
                severity: 'error',
                summary: 'Bulk Download Failed',
                detail: 'All account details failed to download. Please try again.',
                life: 5000
            });
        } else {
            toast.add({
                severity: 'warn',
                summary: 'Partial Download',
                detail: `${successCount} account details downloaded successfully, ${errorCount} account details failed`,
                life: 5000
            });
        }

        selectedFiles.value = [];
    } catch (error) {
        console.error('Bulk download failed:', error);
        toast.add({
            severity: 'error',
            summary: 'Download Failed',
            detail: 'Failed to download account details. Please try again.',
            life: 5000
        });
    } finally {
        downloadLoading.value = null;
    }
};

// 🟢 Initial load
onBeforeMount(async () => {
    await loadInitialData();
});

const loadInitialData = async () => {
    loading.value = true;
    error.value = null;
    try {
        listData.value = await AccountDetailService.getAccountDetailList();
    } catch (err) {
        console.error('Failed to load account detail data:', err);
        error.value = err.message;
        listData.value = [];

        toast.add({
            severity: 'error',
            summary: 'Load Failed',
            detail: 'Failed to load account detail data',
            life: 5000
        });
    } finally {
        loading.value = false;
    }
};

// 🟢 Refresh function
const refreshData = async () => {
    loading.value = true;
    error.value = null;
    try {
        listData.value = await AccountDetailService.getAccountDetailList();

        toast.add({
            severity: 'success',
            summary: 'Data Refreshed',
            detail: 'Account detail data has been refreshed',
            life: 3000
        });
    } catch (err) {
        console.error('Failed to refresh account detail data:', err);
        error.value = err.message;

        toast.add({
            severity: 'error',
            summary: 'Refresh Failed',
            detail: 'Failed to refresh account detail data',
            life: 5000
        });
    } finally {
        loading.value = false;
    }
};

// 🟢 Helper Functions
const formatCurrency = (value) => {
    if (value === null || value === undefined || value === '') return '-';

    return new Intl.NumberFormat('en-MY', {
        style: 'currency',
        currency: 'MYR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(Number(value));
};

const formatDateForDisplay = (dateString) => {
    if (!dateString) return '';

    try {
        // Parse the date string (assuming DD/MM/YYYY HH:MM:SS format)
        const [datePart, timePart] = dateString.split(' ');
        if (datePart && datePart.includes('/')) {
            const [day, month, year] = datePart.split('/');
            const date = new Date(`${year}-${month}-${day}`);

            if (isNaN(date.getTime())) return '';

            return date.toLocaleDateString('en-MY', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        }
        return '';
    } catch (error) {
        console.error('Error formatting date for display:', error);
        return '';
    }
};

// 🟢 Clear Date Range
const clearDateRange = () => {
    dateRange.value = [null, null];
    hasDateFilterApplied.value = false;
    selectedFiles.value = []; // Clear selection when clearing date filter
};
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
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 1rem;
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

    :deep(.p-paginator-current) {
        margin-right: auto;
        order: -1;
    }
}

/* Custom styling for the date filter */
:deep(.p-calendar) {
    .p-inputtext {
        padding: 0.5rem;
    }
}
</style>
