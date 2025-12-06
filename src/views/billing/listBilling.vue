<template>
    <div class="card">
        <Toast />

        <div class="flex justify-between items-center mb-4">
            <div class="text-2xl font-bold text-black">E-Invoice</div>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="p-4 mb-4 text-red-700 bg-red-100 rounded-lg border border-red-200">
            <div class="flex items-center">
                <i class="pi pi-exclamation-triangle mr-2"></i>
                <span>Error loading billing data: {{ error }}</span>
            </div>
            <Button label="Try Again" icon="pi pi-refresh" class="p-button-text p-button-sm mt-2" @click="refreshData" />
        </div>

        <!-- Loading State -->
        <LoadingPage v-if="loading" :message="'Loading Billing Data...'" :sub-message="'Fetching billing information'" />

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
            :sortField="sortField"
            :sortOrder="-1"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
            paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
            v-model:selection="selectedFiles"
            @sort="onSort"
        >
            <template #header>
                <div class="flex flex-col gap-4 w-full">
                    <!-- Top Row: Search and Buttons -->
                    <div class="flex items-center justify-between gap-4 w-full flex-wrap">
                        <div class="flex items-center gap-2 w-full max-w-md">
                            <IconField class="flex-1">
                                <InputIcon>
                                    <i class="pi pi-search" />
                                </InputIcon>
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
                                v-tooltip="selectedFiles.length > 0 ? `Download ${selectedFiles.length} selected billing documents` : 'Select billing documents to download'"
                            />
                            <Button icon="pi pi-refresh" class="p-button-info p-button-sm" @click="refreshData" :disabled="loading" v-tooltip="'Refresh data'" />
                        </div>
                    </div>

                    <!-- Filter Row: Date Range and Customer Account No. -->
                    <div class="flex items-center gap-4 mb-1 flex-wrap">
                        <!-- Customer Account No. Filter -->
                        <div class="flex items-center gap-2">
                            <span class="text-sm font-medium text-gray-700">Customer Account No.:</span>
                            <InputText v-model="customerAccountFilter" placeholder="Filter by account number" class="w-48" :disabled="loading" @input="handleCustomerAccountFilter" />
                            <Button v-if="customerAccountFilter" icon="pi pi-times" class="p-button-text p-button-sm" @click="clearCustomerAccountFilter" title="Clear account filter" />
                        </div>

                        <!-- Date Range Filter -->
                        <div class="flex items-center gap-2">
                            <span class="text-sm font-medium text-gray-700">Date Range:</span>
                            <div class="flex items-center gap-2">
                                <Calendar v-model="dateRange[0]" placeholder="Start Date" dateFormat="yy-mm-dd" showIcon class="w-40" :disabled="loading" @date-select="handleDateChange" />
                                <span class="text-gray-500">to</span>
                                <Calendar v-model="dateRange[1]" placeholder="End Date" dateFormat="yy-mm-dd" showIcon class="w-40" :disabled="loading" @date-select="handleDateChange" />
                            </div>
                            <Button v-if="dateRange[0] || dateRange[1]" icon="pi pi-times" class="p-button-text p-button-sm" @click="clearDateRange" title="Clear date filter" />
                        </div>
                    </div>
                </div>
            </template>

            <template #empty>
                <div class="text-center py-8 text-gray-500">
                    <template v-if="!hasDateFilterApplied">
                        <div class="flex flex-col items-center gap-2">
                            <i class="pi pi-calendar text-3xl text-blue-400"></i>
                            <span class="text-lg">Select a date range to view</span>
                            <span class="text-sm text-gray-400">Choose both start and end dates to load data</span>
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
                        <div>No billing records found in the selected date range.</div>
                        <Button label="Clear Filter" icon="pi pi-times" class="p-button-text p-button-sm mt-2" @click="clearDateRange" />
                    </template>
                </div>
            </template>

            <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>

            <Column field="sortableDate" header="Document Date" style="min-width: 8rem" sortable>
                <template #body="{ data }">
                    <span class="font-medium">{{ data.docsDate }}</span>
                    <div class="text-xs text-gray-500">{{ formatDateForDisplay(data.docsDate) }}</div>
                </template>
            </Column>

            <Column field="docsNo" header="Document No" style="min-width: 10rem" sortable>
                <template #body="{ data }">
                    <span class="font-medium">{{ data.docsNo }}</span>
                </template>
            </Column>

            <Column field="docsType" header="Document Type" style="min-width: 8rem" sortable>
                <template #body="{ data }">
                    <Tag :value="data.docsType" :severity="data.docsType === 'Invoice' ? 'success' : data.docsType === 'Credit Note' ? 'warning' : 'info'" />
                </template>
            </Column>

            <Column field="referenceDocsNo" header="Reference Doc No" style="min-width: 8rem" sortable>
                <template #body="{ data }">
                    <span v-if="data.referenceDocsNo" class="font-medium">{{ data.referenceDocsNo }}</span>
                    <span v-else class="text-black">-</span>
                </template>
            </Column>

            <Column field="dealerId" header="Customer Acc No" style="min-width: 10rem" sortable>
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
                            v-tooltip.top="data.download ? `View ${data.docsType}` : 'View not available'"
                        />
                        <Button
                            icon="pi pi-download"
                            class="p-button-xm"
                            :severity="data.download ? 'success' : 'secondary'"
                            :disabled="!data.download || downloadLoading === data.id"
                            :loading="downloadLoading === data.id"
                            @click="handleDownload(data)"
                            v-tooltip.top="data.download ? `Download ${data.docsType}` : 'Download not available'"
                        />
                    </div>
                </template>
            </Column>
        </DataTable>
    </div>
</template>

<script setup>
import { onBeforeMount, ref, reactive, computed, watch } from 'vue';
import { FilterMatchMode, FilterOperator } from '@primevue/core/api';
import api from '@/service/api';
import LoadingPage from '@/components/LoadingPage.vue';
import { useToast } from 'primevue/usetoast';
import Calendar from 'primevue/calendar';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Tag from 'primevue/tag';

const toast = useToast();

// 🟢 State Management
const filters1 = reactive({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    dealerName: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
    docsNo: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] }
});

const listData = ref([]);
const loading = ref(false);
const downloadLoading = ref(null);
const viewLoading = ref(null);
const error = ref(null);
const dateRange = ref([null, null]);
const customerAccountFilter = ref('');
const hasDateFilterApplied = ref(false);
const sortField = ref('sortableDate');

// Debounce timers
let debounceTimer = null;
let accountFilterTimer = null;

// Selection state for bulk download
const selectedFiles = ref([]);

// 🟢 API service functions
const BillingService = {
    async getBillingList(startDate = null, endDate = null, accountNo = null) {
        try {
            let params = {};

            // If dates are provided, format them for backend
            if (startDate && endDate) {
                const formatDateForAPI = (date) => {
                    const d = new Date(date);
                    const day = String(d.getDate()).padStart(2, '0');
                    const month = String(d.getMonth() + 1).padStart(2, '0');
                    const year = d.getFullYear();
                    return `${day}/${month}/${year}`;
                };

                params.date_range = `${formatDateForAPI(startDate)} - ${formatDateForAPI(endDate)}`;
            }

            // Add customer account number filter if provided
            if (accountNo && accountNo.trim() !== '') {
                params.custAccountNo = accountNo.trim();
            }

            const response = await api.post('credit/billing', params);
            if (response.data.status === 1) {
                // Transform the API data to match your table structure
                return response.data.admin_data.map((item) => {
                    // Parse the date for sorting and filtering
                    const dateStr = item.date;
                    let sortableDate = null;

                    // Parse the date from various formats
                    if (dateStr) {
                        // Try to parse DD/MM/YYYY format
                        if (dateStr.includes('/')) {
                            try {
                                // Parse the date string
                                const [day, month, year] = dateStr.split('/');

                                // Create a sortable date string in YYYY-MM-DD format
                                // This ensures proper sorting by year, then month, then day
                                sortableDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
                            } catch (error) {
                                console.error('Error parsing date:', dateStr);
                                sortableDate = '0000-00-00'; // Fallback for invalid dates
                            }
                        }
                        // Try YYYY-MM-DD format
                        else if (dateStr.includes('-')) {
                            try {
                                // Ensure it's in YYYY-MM-DD format
                                const [year, month, day] = dateStr.split('-');
                                sortableDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
                            } catch (error) {
                                sortableDate = '0000-00-00';
                            }
                        }
                        // Try ISO format
                        else {
                            try {
                                const parsedDate = new Date(dateStr);
                                sortableDate = parsedDate.toISOString().split('T')[0];
                            } catch (error) {
                                sortableDate = '0000-00-00';
                            }
                        }
                    }

                    return {
                        id: item.file_path,
                        docsDate: item.date,
                        sortableDate: sortableDate, // For proper sorting (YYYY-MM-DD format)
                        docsNo: item.docno,
                        docsType: item.doctype,
                        referenceDocsNo: item.refdocno,
                        dealerId: item.account_no,
                        dealerName: item.custName,
                        company: item.company,
                        filePath: item.file_path,
                        fileUrl: item.file_url,
                        download: true,
                        parsedDate: sortableDate ? new Date(sortableDate) : null // For date filtering
                    };
                });
            } else {
                throw new Error('Failed to fetch billing data');
            }
        } catch (error) {
            console.error('Error fetching billing list:', error);
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

// 🟢 Handle customer account number filter change
const handleCustomerAccountFilter = () => {
    // Clear any existing timer
    if (accountFilterTimer) {
        clearTimeout(accountFilterTimer);
    }

    // Set new timer to debounce the API call
    accountFilterTimer = setTimeout(async () => {
        if (dateRange.value[0] && dateRange.value[1]) {
            await loadFilteredData();
        }
    }, 500);
};

// 🟢 Clear customer account filter
const clearCustomerAccountFilter = () => {
    customerAccountFilter.value = '';
    if (dateRange.value[0] && dateRange.value[1]) {
        loadFilteredData();
    }
};

// 🟢 Load filtered data
const loadFilteredData = async () => {
    if (!dateRange.value[0] || !dateRange.value[1]) {
        return;
    }

    loading.value = true;
    error.value = null;
    selectedFiles.value = []; // Clear selection when applying new filter

    try {
        listData.value = await BillingService.getBillingList(dateRange.value[0], dateRange.value[1], customerAccountFilter.value);
        hasDateFilterApplied.value = true;

        // Sort the data by document date from new to old (YYYY-MM-DD format)
        listData.value.sort((a, b) => {
            if (!a.sortableDate || !b.sortableDate) return 0;
            return b.sortableDate.localeCompare(a.sortableDate);
        });

        let filterMessage = `Showing billing documents from ${formatDateForDisplay(dateRange.value[0])} to ${formatDateForDisplay(dateRange.value[1])}`;
        if (customerAccountFilter.value) {
            filterMessage += ` for account: ${customerAccountFilter.value}`;
        }

        toast.add({
            severity: 'success',
            summary: 'Filter Applied',
            detail: filterMessage,
            life: 3000
        });
    } catch (err) {
        console.error('Failed to load filtered data:', err);
        error.value = err.message;
        listData.value = [];
        hasDateFilterApplied.value = false;

        toast.add({
            severity: 'error',
            summary: 'Load Failed',
            detail: 'Failed to load billing data',
            life: 5000
        });
    } finally {
        loading.value = false;
    }
};

// 🟢 Handle sort event
const onSort = (event) => {
    sortField.value = event.sortField;

    // If sorting by docsDate (which uses sortableDate field), we need to sort by the sortableDate field
    if (event.sortField === 'sortableDate') {
        listData.value.sort((a, b) => {
            if (!a.sortableDate || !b.sortableDate) return 0;

            // For descending order (new to old)
            if (event.sortOrder === -1) {
                return b.sortableDate.localeCompare(a.sortableDate);
            }
            // For ascending order (old to new)
            else {
                return a.sortableDate.localeCompare(b.sortableDate);
            }
        });
    }
};

// 🟢 Handle date change with debouncing
const handleDateChange = () => {
    if (debounceTimer) {
        clearTimeout(debounceTimer);
    }

    debounceTimer = setTimeout(async () => {
        if (dateRange.value[0] && dateRange.value[1]) {
            await loadFilteredData();
        } else if (dateRange.value[0] === null && dateRange.value[1] === null && hasDateFilterApplied.value) {
            hasDateFilterApplied.value = false;
            customerAccountFilter.value = '';
            listData.value = [];
            selectedFiles.value = [];
        }
    }, 500);
};

// 🟢 Watcher for date range changes
watch(
    dateRange,
    (newRange) => {
        if (newRange[0] && newRange[1]) {
            handleDateChange();
        }
    },
    { deep: true }
);

// 🟢 Computed - Filter data by search
const filteredData = computed(() => {
    if (!hasDateFilterApplied.value) {
        return [];
    }
    return listData.value;
});

// 🟢 Handle Download
const handleDownload = async (data) => {
    if (!data.filePath || !data.download) {
        toast.add({
            severity: 'warn',
            summary: 'Cannot Download',
            detail: `${data.docsType} is not available for download`,
            life: 3000
        });
        return;
    }

    downloadLoading.value = data.id;
    try {
        const sanitizeFileName = (name) => (name ? name.replace(/[/\\?%*:|"<>]/g, '-') : 'Unknown');
        const fileName = `${sanitizeFileName(data.docsType)}_${sanitizeFileName(data.dealerName)}_${data.docsNo}.pdf`;
        await BillingService.downloadFile(data.filePath, fileName);

        toast.add({
            severity: 'success',
            summary: 'Download Successful',
            detail: `${data.docsType} has been downloaded successfully`,
            life: 3000
        });
    } catch (error) {
        console.error('Download failed:', error);

        let errorDetail = `Failed to download ${data.docsType}. Please try again.`;
        if (error.response?.status === 404) {
            errorDetail = `${data.docsType} file not found on the server.`;
        } else if (error.response?.status === 403) {
            errorDetail = `You do not have permission to download this ${data.docsType}.`;
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
            summary: 'Cannot View Document',
            detail: `${data.docsType} is not available for viewing`,
            life: 3000
        });
        return;
    }

    viewLoading.value = data.id;
    try {
        await BillingService.viewFile(data.filePath, data.fileUrl);

        toast.add({
            severity: 'success',
            summary: 'File Opened',
            detail: `${data.docsType} has been opened in a new tab`,
            life: 3000
        });
    } catch (error) {
        console.error('View failed:', error);

        let errorDetail = `Failed to open ${data.docsType}. Please try again.`;
        if (error.message.includes('popup') || error.message.includes('blocked')) {
            errorDetail = 'Popup was blocked. Please allow popups for this site and try again.';
        } else if (error.response?.status === 404) {
            errorDetail = `${data.docsType} file not found on the server. The file may have been moved or deleted.`;
        } else if (error.response?.status === 403) {
            errorDetail = `You do not have permission to view this ${data.docsType}.`;
        } else if (error.message.includes('Both download methods failed')) {
            errorDetail = `${data.docsType} cannot be accessed. Please contact administrator.`;
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
            detail: 'Please select billing documents to download',
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
                const fileName = `${sanitizeFileName(file.docsType)}_${sanitizeFileName(file.dealerName)}_${file.docsNo}.pdf`;
                await BillingService.downloadFile(file.filePath, fileName);
                successCount++;

                await new Promise((resolve) => setTimeout(resolve, 100));
            } catch (error) {
                console.error(`Failed to download billing document: ${file.filePath}`, error);
                errorCount++;
            }
        }

        if (errorCount === 0) {
            toast.add({
                severity: 'success',
                summary: 'Bulk Download Successful',
                detail: `${successCount} billing documents have been downloaded successfully`,
                life: 3000
            });
        } else if (successCount === 0) {
            toast.add({
                severity: 'error',
                summary: 'Bulk Download Failed',
                detail: 'All billing documents failed to download. Please try again.',
                life: 5000
            });
        } else {
            toast.add({
                severity: 'warn',
                summary: 'Partial Download',
                detail: `${successCount} billing documents downloaded successfully, ${errorCount} documents failed`,
                life: 5000
            });
        }

        selectedFiles.value = [];
    } catch (error) {
        console.error('Bulk download failed:', error);
        toast.add({
            severity: 'error',
            summary: 'Download Failed',
            detail: 'Failed to download billing documents. Please try again.',
            life: 5000
        });
    } finally {
        downloadLoading.value = null;
    }
};

// 🟢 Initial load
onBeforeMount(async () => {
    loading.value = false;
    listData.value = [];
    hasDateFilterApplied.value = false;
});

// 🟢 Refresh function
const refreshData = async () => {
    if (!hasDateFilterApplied.value) {
        toast.add({
            severity: 'warn',
            summary: 'Date Filter Required',
            detail: 'Please select a date range first',
            life: 3000
        });
        return;
    }

    loading.value = true;
    error.value = null;
    try {
        listData.value = await BillingService.getBillingList(dateRange.value[0], dateRange.value[1], customerAccountFilter.value);

        listData.value.sort((a, b) => {
            if (!a.sortableDate || !b.sortableDate) return 0;
            return b.sortableDate.localeCompare(a.sortableDate);
        });

        toast.add({
            severity: 'success',
            summary: 'Data Refreshed',
            detail: 'Billing data has been refreshed',
            life: 3000
        });
    } catch (err) {
        console.error('Failed to refresh billing data:', err);
        error.value = err.message;

        toast.add({
            severity: 'error',
            summary: 'Refresh Failed',
            detail: 'Failed to refresh billing data',
            life: 5000
        });
    } finally {
        loading.value = false;
    }
};

// 🟢 Clear Date Range
const clearDateRange = () => {
    dateRange.value = [null, null];
    customerAccountFilter.value = '';
    hasDateFilterApplied.value = false;
    listData.value = [];
    selectedFiles.value = [];

    toast.add({
        severity: 'info',
        summary: 'Filter Cleared',
        detail: 'Date filter has been cleared',
        life: 3000
    });
};

// 🟢 Helper Functions
const formatDateForDisplay = (dateString) => {
    if (!dateString) return '';

    try {
        // If dateString is a Date object from calendar
        if (dateString instanceof Date) {
            return dateString.toLocaleDateString('en-MY', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        }

        // Parse the date string (assuming DD/MM/YYYY format)
        if (dateString.includes('/')) {
            const [day, month, year] = dateString.split('/');
            const date = new Date(`${year}-${month}-${day}`);

            if (isNaN(date.getTime())) return '';

            return date.toLocaleDateString('en-MY', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        }
        return dateString;
    } catch (error) {
        console.error('Error formatting date for display:', error);
        return '';
    }
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