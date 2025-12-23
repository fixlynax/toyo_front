<template>
    <div class="card">
        <Toast />

        <div class="flex justify-between items-center mb-4">
            <div class="text-2xl font-bold text-black">Statement</div>
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
                                v-tooltip="selectedFiles.length > 0 ? `Download ${selectedFiles.length} selected statements` : 'Select statements to download'"
                            />
                            <Button icon="pi pi-refresh" class="p-button-info p-button-sm" @click="refreshData" :disabled="loading" v-tooltip="'Refresh data'" />
                        </div>
                    </div>

                    <!-- Filter Row: Date Range and Customer Account No. -->
                    <div class="flex items-center gap-4 mb-1 flex-wrap">
                        <!-- Customer Account No. Filter -->
                        <div class="flex items-center gap-2">
                            <span class="text-sm font-medium text-gray-700">Customer Account No.:</span>
                            <InputNumber
                                v-model="customerAccountFilter"
                                placeholder="Filter by account no."
                                class="w-50"
                                :disabled="loading"
                                :useGrouping="false"
                                :maxFractionDigits="0"
                                :min="0"
                                :max="9999999999"
                                inputId="customer-account-filter"
                            />
                            <Button v-if="customerAccountFilter" icon="pi pi-times" class="p-button-text p-button-sm" @click="clearCustomerAccountFilter" title="Clear account filter" />
                        </div>

                        <!-- Date Range Filter -->
                        <div class="flex items-center gap-2">
                            <span class="text-sm font-medium text-gray-700">Date Range:</span>
                            <div class="flex items-center gap-2">
                                <Calendar 
                                    v-model="dateRange[0]" 
                                    placeholder="Start Date" 
                                    dateFormat="yy-mm-dd" 
                                    showIcon 
                                    class="w-40" 
                                    :disabled="loading" 
                                    :maxDate="maxSelectableDate"
                                    :minDate="minSelectableDate"
                                    :selectOtherMonths="true"
                                    :showOtherMonths="true"
                                    @date-select="onStartDateSelect"
                                />
                                <span class="text-gray-500">to</span>
                                <Calendar 
                                    v-model="dateRange[1]" 
                                    placeholder="End Date" 
                                    dateFormat="yy-mm-dd" 
                                    showIcon 
                                    class="w-40" 
                                    :disabled="loading" 
                                    :maxDate="maxSelectableDate"
                                    :minDate="minSelectableDate"
                                    :selectOtherMonths="true"
                                    :showOtherMonths="true"
                                    @date-select="onEndDateSelect"
                                />
                            </div>
                            <Button v-if="dateRange[0] || dateRange[1]" icon="pi pi-times" class="p-button-text p-button-sm" @click="clearDateRange" title="Clear date filter" />
                        </div>

                        <!-- Filter Button -->
                        <Button
                            icon="pi pi-filter"
                            label="Filter"
                            class="p-button-primary p-button-sm"
                            @click="applyFilter"
                            :disabled="loading"
                            :loading="filterLoading"
                            v-tooltip="'Apply date and account number filters'"
                        />
                    </div>
                </div>
            </template>

            <template #empty>
                <div class="text-center py-8 text-gray-500">
                    <template v-if="!hasDateFilterApplied">
                        <div class="flex flex-col items-center gap-2">
                            <i class="pi pi-refresh text-3xl text-blue-400"></i>
                            <span class="text-lg">Loading statements...</span>
                            <span class="text-sm text-gray-400">Showing data for the current month</span>
                        </div>
                    </template>
                    <template v-else>
                        <i class="pi pi-file-excel text-4xl mb-2"></i>
                        <div>No statement records found in the selected date range.</div>
                        <Button label="Clear Filter" icon="pi pi-times" class="p-button-text p-button-sm mt-2" @click="clearDateRange" />
                    </template>
                </div>
            </template>

            <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>

            <Column field="sortableDate" header="Document Date" style="min-width: 8rem" sortable>
                <template #body="{ data }">
                    <span class="font-medium">{{ data.docsDate }}</span>
                    <!-- <div class="text-xs text-gray-500">{{ formatDateForDisplay(data.docsDate) }}</div> -->
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

<script setup>
import { onBeforeMount, ref, reactive, computed } from 'vue';
import api from '@/service/api';
import { FilterMatchMode, FilterOperator } from '@primevue/core/api';
import LoadingPage from '@/components/LoadingPage.vue';
import { useToast } from 'primevue/usetoast';
import Calendar from 'primevue/calendar';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';

const toast = useToast();

// 🟢 State Management
const filters1 = reactive({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    dealerName: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
    dealerId: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] }
});

const listData = ref([]);
const loading = ref(false);
const filterLoading = ref(false);
const downloadLoading = ref(null);
const viewLoading = ref(null);
const error = ref(null);
const dateRange = ref([null, null]);
const customerAccountFilter = ref('');
const hasDateFilterApplied = ref(false);
const sortField = ref('sortableDate');

// Selection state for bulk download
const selectedFiles = ref([]);

// 🟢 Helper function to calculate default date range (current month)
const getCurrentMonthDateRange = () => {
    const today = new Date();
    const startDate = new Date(today.getFullYear(), today.getMonth(), 1); // First day of current month
    const endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0); // Last day of current month
    
    return [startDate, endDate];
};

// 🟢 Helper function to get min and max selectable dates (24 months range)
const getMinMaxSelectableDates = () => {
    const today = new Date();
    const maxDate = new Date(today); // Today as max date
    const minDate = new Date(today);
    minDate.setMonth(today.getMonth() - 24); // 24 months ago as min date
    
    return {
        minDate,
        maxDate
    };
};

// 🟢 Computed min and max selectable dates (24 months range)
const minSelectableDate = computed(() => getMinMaxSelectableDates().minDate);
const maxSelectableDate = computed(() => getMinMaxSelectableDates().maxDate);

// 🟢 API service functions for Statement
const StatementService = {
    async getStatementList(startDate = null, endDate = null, accountNo = null) {
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

            const response = await api.post('credit/statement', params);
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

// 🟢 Calendar date selection handlers
const onStartDateSelect = () => {
    // If end date is before start date, reset end date
    if (dateRange.value[1] && dateRange.value[0] && dateRange.value[1] < dateRange.value[0]) {
        dateRange.value[1] = null;
    }
};

const onEndDateSelect = () => {
    // If start date is after end date, reset start date
    if (dateRange.value[0] && dateRange.value[1] && dateRange.value[0] > dateRange.value[1]) {
        dateRange.value[0] = null;
    }
};

// 🟢 Apply Filter Button Handler
const applyFilter = async () => {
    // Validate date range - either both dates or none
    if ((dateRange.value[0] && !dateRange.value[1]) || (!dateRange.value[0] && dateRange.value[1])) {
        toast.add({
            severity: 'warn',
            summary: 'Invalid Date Range',
            detail: 'Please select both start and end dates, or clear both',
            life: 3000
        });
        return;
    }

    // Validate customer account number format (only numbers, max 10 digits)
    if (customerAccountFilter.value) {
        const accountStr = customerAccountFilter.value.toString();
        if (!/^\d+$/.test(accountStr)) {
            toast.add({
                severity: 'error',
                summary: 'Invalid Account Number',
                detail: 'Customer account number must contain only numbers',
                life: 3000
            });
            return;
        }

        if (accountStr.length > 10) {
            toast.add({
                severity: 'error',
                summary: 'Invalid Account Number',
                detail: 'Customer account number must be at most 10 digits',
                life: 3000
            });
            return;
        }
    }

    // Validate date range is within 24 months
    if (dateRange.value[0] && dateRange.value[1]) {
        const startDate = new Date(dateRange.value[0]);
        const endDate = new Date(dateRange.value[1]);
        const today = new Date();
        
        // Check if start date is within 24 months
        const twentyFourMonthsAgo = new Date(today);
        twentyFourMonthsAgo.setMonth(today.getMonth() - 24);
        
        if (startDate < twentyFourMonthsAgo) {
            toast.add({
                severity: 'error',
                summary: 'Invalid Date Range',
                detail: 'Start date cannot be more than 24 months ago',
                life: 3000
            });
            return;
        }
        
        // Check if end date is in the future
        if (endDate > today) {
            toast.add({
                severity: 'error',
                summary: 'Invalid Date Range',
                detail: 'End date cannot be in the future',
                life: 3000
            });
            return;
        }
        
        // Check if date range exceeds 24 months
        const monthsDifference = (endDate.getFullYear() - startDate.getFullYear()) * 12 + 
                                (endDate.getMonth() - startDate.getMonth());
        if (monthsDifference > 24) {
            toast.add({
                severity: 'error',
                summary: 'Invalid Date Range',
                detail: 'Date range cannot exceed 24 months',
                life: 3000
            });
            return;
        }
    }

    filterLoading.value = true;

    try {
        // If no dates but has account filter, use default date range (current month)
        if (!dateRange.value[0] && !dateRange.value[1] && customerAccountFilter.value) {
            // Apply default date range
            const defaultDates = getCurrentMonthDateRange();
            dateRange.value = [defaultDates[0], defaultDates[1]];
        }
        
        // If no dates and no account filter, use default date range (current month)
        if (!dateRange.value[0] && !dateRange.value[1] && !customerAccountFilter.value) {
            // Apply default date range
            const defaultDates = getCurrentMonthDateRange();
            dateRange.value = [defaultDates[0], defaultDates[1]];
        }

        // Load data with filters
        await loadFilteredData();
    } catch (error) {
        console.error('Filter application failed:', error);
        toast.add({
            severity: 'error',
            summary: 'Filter Failed',
            detail: 'Failed to apply filters. Please try again.',
            life: 5000
        });
    } finally {
        filterLoading.value = false;
    }
};

// 🟢 Clear customer account filter
const clearCustomerAccountFilter = () => {
    customerAccountFilter.value = '';
    // Note: This doesn't trigger filter automatically
    // User needs to click Filter button again if they want to apply changes
};

// 🟢 Load filtered data (modified to be called by applyFilter)
const loadFilteredData = async () => {
    // Convert customerAccountFilter to string for API call
    const accountFilterValue = customerAccountFilter.value ? customerAccountFilter.value.toString() : null;

    loading.value = true;
    error.value = null;
    selectedFiles.value = []; // Clear selection when applying new filter

    try {
        listData.value = await StatementService.getStatementList(dateRange.value[0], dateRange.value[1], accountFilterValue);
        hasDateFilterApplied.value = true;

        // Sort the data by document date from new to old (YYYY-MM-DD format)
        listData.value.sort((a, b) => {
            if (!a.sortableDate || !b.sortableDate) return 0;
            return b.sortableDate.localeCompare(a.sortableDate);
        });

        // let filterMessage = `Showing statements`;
        // if (dateRange.value[0] && dateRange.value[1]) {
        //     filterMessage += ` from ${formatDateForDisplay(dateRange.value[0])} to ${formatDateForDisplay(dateRange.value[1])}`;
        // }
        // if (accountFilterValue) {
        //     filterMessage += ` for account: ${accountFilterValue}`;
        // }

        // toast.add({
        //     severity: 'success',
        //     summary: 'Filter Applied',
        //     detail: filterMessage,
        //     life: 3000
        // });
    } catch (err) {
        console.error('Failed to load filtered data:', err);
        error.value = err.message;
        listData.value = [];
        hasDateFilterApplied.value = false;

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
            detail: 'Statement is not available for download',
            life: 3000
        });
        return;
    }

    downloadLoading.value = data.id;
    try {
        const sanitizeFileName = (name) => (name ? name.replace(/[/\\?%*:|"<>]/g, '-') : 'Unknown');
        const fileName = `Statement_${sanitizeFileName(data.dealerName)}_${data.docsDate.replace(/\//g, '-')}.pdf`;
        await StatementService.downloadFile(data.filePath, fileName);

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
            summary: 'Cannot View Statement',
            detail: 'Statement is not available for viewing',
            life: 3000
        });
        return;
    }

    viewLoading.value = data.id;
    try {
        await StatementService.viewFile(data.filePath, data.fileUrl);

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

                await new Promise((resolve) => setTimeout(resolve, 100));
            } catch (error) {
                console.error(`Failed to download statement: ${file.filePath}`, error);
                errorCount++;
            }
        }

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

        selectedFiles.value = [];
    } catch (error) {
        console.error('Bulk download failed:', error);
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

// 🟢 Initial load
onBeforeMount(async () => {
    loading.value = true;
    hasDateFilterApplied.value = false;
    
    try {
        // Set default date range (current month)
        const defaultDates = getCurrentMonthDateRange();
        dateRange.value = [defaultDates[0], defaultDates[1]];
        
        // Load data with default date range
        await loadFilteredData();
    } catch (err) {
        console.error('Initial load failed:', err);
        error.value = err.message;
        listData.value = [];
    } finally {
        loading.value = false;
    }
});

// 🟢 Refresh function
const refreshData = async () => {
    loading.value = true;
    error.value = null;
    try {
        const accountFilterValue = customerAccountFilter.value ? customerAccountFilter.value.toString() : null;
        listData.value = await StatementService.getStatementList(dateRange.value[0], dateRange.value[1], accountFilterValue);

        listData.value.sort((a, b) => {
            if (!a.sortableDate || !b.sortableDate) return 0;
            return b.sortableDate.localeCompare(a.sortableDate);
        });

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

// 🟢 Clear Date Range
const clearDateRange = () => {
    // Instead of clearing to null, reset to default date range (current month)
    const defaultDates = getCurrentMonthDateRange();
    dateRange.value = [defaultDates[0], defaultDates[1]];
    customerAccountFilter.value = '';
    
    // Reload data with default date range
    refreshData();

    toast.add({
        severity: 'info',
        summary: 'Filter Reset',
        detail: 'Date filter has been reset to default (current month).',
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

/* Custom styling for InputNumber */
:deep(.p-inputnumber) {
    .p-inputtext {
        padding: 0.6rem;
        text-align: left;
    }
}
</style>