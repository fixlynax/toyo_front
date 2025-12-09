<template>
    <div class="card">
        <Toast />

        <div class="flex justify-between items-center mb-4">
            <Button @click="$route.back()" icon="pi pi-arrow-left font-bold" class="p-button-text p-button-secondary text-xl" size="big" v-tooltip="'Back'" />
            <div class="text-2xl font-bold text-black">Others - Customer: {{ custAccNo }}</div>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="p-4 mb-4 text-red-700 bg-red-100 rounded-lg border border-red-200">
            <div class="flex items-center">
                <i class="pi pi-exclamation-triangle mr-2"></i>
                <span>Error loading other files data: {{ error }}</span>
            </div>
            <Button label="Try Again" icon="pi pi-refresh" class="p-button-text p-button-sm mt-2" @click="refreshData" />
        </div>

        <!-- Loading State -->
        <LoadingPage v-if="loading" :message="'Loading Other Files Data...'" :sub-message="'Fetching other files information'" />

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
                                v-tooltip="selectedFiles.length > 0 ? `Download ${selectedFiles.length} selected files` : 'Select files to download'"
                            />
                            <Button icon="pi pi-refresh" class="p-button-info p-button-sm" @click="refreshData" :disabled="loading" v-tooltip="'Refresh data'" />
                            <Button type="button" icon="pi pi-upload" label="Upload" class="p-button-info p-button-sm" @click="handleUploadClick" :loading="uploadLoading" :disabled="uploadLoading" />
                            <i
                                class="pi pi-info-circle cursor-pointer font-bold text-primary-400 text-lg mr-1"
                                v-tooltip="{
                                    value: 'Please name your file using the following format before uploading:<br><br>T_{DocumentType}_{CustomerAccountNo}_{YYYYMMDD}.pdf<br><br>Example: T_CP58_6020500600_20251101.pdf',
                                    escape: false
                                }"
                            ></i>
                            <input type="file" ref="fileInputRef" @change="handleFileUpload" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" style="display: none" multiple />
                        </div>
                    </div>

                    <!-- Date Range Filter -->
                    <div class="flex items-center gap-4 mb-1 flex-wrap">
                        <div class="flex items-center gap-2">
                            <span class="text-sm font-medium text-gray-700">Date Range:</span>
                            <div class="flex items-center gap-2">
                                <Calendar v-model="dateRange[0]" placeholder="Start Date" dateFormat="yy-mm-dd" showIcon class="w-40" :disabled="loading" @date-select="handleDateChange" />
                                <span class="text-gray-500">to</span>
                                <Calendar v-model="dateRange[1]" placeholder="End Date" dateFormat="yy-mm-dd" showIcon class="w-40" :disabled="loading" @date-select="handleDateChange" />
                            </div>
                            <Button v-if="dateRange[0] || dateRange[1]" icon="pi pi-times" class="p-button-text p-button-sm" @click="clearDateRange" title="Clear date filter" />
                        </div>
                        <div v-if="!hasDateFilterApplied" class="text-sm text-blue-600 italic">Select a date range to view other files</div>
                    </div>
                </div>
            </template>

            <template #empty>
                <div class="text-center py-8 text-gray-500">
                    <template v-if="!hasDateFilterApplied">
                        <div class="flex flex-col items-center gap-2">
                            <i class="pi pi-calendar text-3xl text-blue-400"></i>
                            <span class="text-lg">Select a date range to view other files</span>
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
                        <div>No other files records found in the selected date range.</div>
                        <Button label="Clear Filter" icon="pi pi-times" class="p-button-text p-button-sm mt-2" @click="clearDateRange" />
                    </template>
                </div>
            </template>

            <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>

            <Column field="docsDate" header="Document Date" style="min-width: 8rem" sortable>
                <template #body="{ data }">
                    <span class="font-medium">{{ data.docsDate }}</span>
                    <div class="text-xs text-gray-500">{{ formatDateForDisplay(data.docsDate) }}</div>
                </template>
            </Column>

            <Column field="docType" header="Document Type" style="min-width: 10rem" sortable>
                <template #body="{ data }">
                    <span class="font-medium">{{ data.docType }}</span>
                </template>
            </Column>

            <Column field="dealerId" header="Customer Acc No" style="min-width: 10rem" sortable>
                <template #body="{ data }">
                    <span v-if="data.dealerId" class="font-medium">{{ data.dealerId }}</span>
                    <span v-else class="text-black">-</span>
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
                            v-tooltip.top="data.download ? 'View File' : 'View not available'"
                        />
                        <Button
                            icon="pi pi-download"
                            class="p-button-xm"
                            :severity="data.download ? 'success' : 'secondary'"
                            :disabled="!data.download || downloadLoading === data.id"
                            :loading="downloadLoading === data.id"
                            @click="handleDownload(data)"
                            v-tooltip.top="data.download ? 'Download File' : 'Download not available'"
                        />
                    </div>
                </template>
            </Column>
        </DataTable>

        <!-- Upload Progress Dialog -->
        <Dialog v-model:visible="uploadDialogVisible" modal header="Upload Files" :style="{ width: '500px' }" :closable="false" :closeOnEscape="false">
            <div class="upload-dialog-content">
                <!-- Overall Progress -->
                <div v-if="uploadSummary.pending > 0" class="mb-4">
                    <div class="flex justify-between mb-2">
                        <span class="font-medium">Overall Progress</span>
                        <span>{{ uploadProgress }}%</span>
                    </div>
                    <ProgressBar :value="uploadProgress" />
                </div>

                <!-- Files List -->
                <div class="files-list max-h-60 overflow-y-auto">
                    <div
                        v-for="(file, index) in uploadingFiles"
                        :key="index"
                        class="file-item p-3 border-b border-gray-200 last:border-b-0"
                        :class="{
                            'bg-green-50': file.status === 'success',
                            'bg-red-50': file.status === 'error',
                            'bg-blue-50': file.status === 'uploading'
                        }"
                    >
                        <div class="flex items-center justify-between">
                            <div class="file-info">
                                <div class="font-medium truncate max-w-xs">{{ file.name }}</div>
                                <div class="text-sm text-gray-500">
                                    {{ formatFileSize(file.size) }}
                                    <span class="mx-2">•</span>
                                    <span
                                        :class="{
                                            'text-green-600': file.status === 'success',
                                            'text-red-600': file.status === 'error',
                                            'text-blue-600': file.status === 'uploading',
                                            'text-gray-500': file.status === 'pending'
                                        }"
                                    >
                                        {{ file.status === 'success' ? 'Success' : file.status === 'error' ? 'Failed' : file.status === 'uploading' ? 'Uploading...' : 'Pending' }}
                                    </span>
                                </div>
                            </div>
                            <div class="file-status">
                                <i v-if="file.status === 'success'" class="pi pi-check-circle text-green-500 text-xl"></i>
                                <i v-else-if="file.status === 'error'" class="pi pi-times-circle text-red-500 text-xl"></i>
                                <i v-else-if="file.status === 'uploading'" class="pi pi-spin pi-spinner text-blue-500 text-xl"></i>
                                <i v-else class="pi pi-clock text-gray-400 text-xl"></i>
                            </div>
                        </div>

                        <!-- Error message -->
                        <div v-if="file.error" class="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded">
                            {{ file.error }}
                        </div>
                    </div>
                </div>

                <!-- Summary -->
                <div class="mt-4 pt-4 border-t border-gray-200">
                    <div class="grid grid-cols-3 gap-4 text-center">
                        <div>
                            <div class="text-2xl font-bold text-blue-600">{{ uploadSummary.total }}</div>
                            <div class="text-sm text-gray-500">Total</div>
                        </div>
                        <div>
                            <div class="text-2xl font-bold text-green-600">{{ uploadSummary.success }}</div>
                            <div class="text-sm text-gray-500">Success</div>
                        </div>
                        <div>
                            <div class="text-2xl font-bold text-red-600">{{ uploadSummary.failed }}</div>
                            <div class="text-sm text-gray-500">Failed</div>
                        </div>
                    </div>
                </div>
            </div>

            <template #footer>
                <Button label="Close" icon="pi pi-times" @click="closeUploadDialog" class="p-button-text" :disabled="uploadSummary.pending > 0" />
                <Button
                    label="Refresh List"
                    icon="pi pi-refresh"
                    @click="
                        refreshData();
                        closeUploadDialog();
                    "
                    class="p-button-success"
                    v-if="uploadSummary.pending === 0 && uploadSummary.success > 0"
                />
            </template>
        </Dialog>
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
import Dialog from 'primevue/dialog';
import ProgressBar from 'primevue/progressbar';
import { useRoute } from 'vue-router';

const toast = useToast();
const route = useRoute();

// 🟢 State Management
const filters1 = reactive({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    dealerName: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
    docType: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] }
});

const listData = ref([]);
const loading = ref(false); // Start with false since we don't load initially
const downloadLoading = ref(null);
const viewLoading = ref(null);
const error = ref(null);
const uploadLoading = ref(false);
const fileInputRef = ref(null);
const dateRange = ref([null, null]);
const hasDateFilterApplied = ref(false);
const custAccNo = ref(route.params.custAccNo || '');

// Debounce timer for date changes
let debounceTimer = null;

// Upload progress state
const uploadProgress = ref(0);
const uploadDialogVisible = ref(false);
const uploadingFiles = ref([]);
const totalFilesToUpload = ref(0);
const successfullyUploaded = ref(0);
const failedUploads = ref(0);

// Selection state for bulk download
const selectedFiles = ref([]);

// 🟢 API service functions for Other Files
const OtherService = {
    async getOtherList(startDate = null, endDate = null) {
        try {
            let params = {
                custAccountNo: custAccNo.value // Add customer account number
            };

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

            const response = await api.post('credit/other', params);
            if (response.data.status === 1) {
                // Transform the API data to match your table structure
                return response.data.admin_data.map((item) => {
                    // Parse the date for sorting and filtering
                    const dateStr = item.date;
                    let parsedDate = null;
                    let sortableDate = null;

                    // Parse the date from various formats
                    if (dateStr) {
                        // Try to parse DD/MM/YYYY format
                        if (dateStr.includes('/')) {
                            const [day, month, year] = dateStr.split('/');
                            if (day && month && year) {
                                parsedDate = new Date(`${year}-${month}-${day}`);
                                sortableDate = parsedDate.getTime();
                            }
                        }
                        // Try YYYY-MM-DD format
                        else if (dateStr.includes('-')) {
                            parsedDate = new Date(dateStr);
                            sortableDate = parsedDate.getTime();
                        }
                        // Try ISO format
                        else {
                            parsedDate = new Date(dateStr);
                            sortableDate = parsedDate.getTime();
                        }
                    }

                    return {
                        id: item.file_path,
                        docsDate: item.date,
                        sortableDate: sortableDate, // For proper sorting
                        docType: item.docType,
                        dealerId: item.account_no,
                        dealerName: item.custName,
                        company: item.company,
                        filePath: item.file_path,
                        fileUrl: item.file_url,
                        download: true,
                        parsedDate: parsedDate, // For date filtering
                        fileExtension: item.file_path.split('.').pop()?.toLowerCase() || ''
                    };
                });
            } else {
                throw new Error('Failed to fetch other files data');
            }
        } catch (error) {
            console.error('Error fetching other files list:', error);
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

            const mimeType = this.getMimeType(filePath);
            const blob = new Blob([response.data], {
                type: mimeType
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
    },

    // Helper method to determine MIME type from file extension
    getMimeType(filePath) {
        const extension = filePath.split('.').pop()?.toLowerCase();
        const mimeTypes = {
            pdf: 'application/pdf',
            jpg: 'image/jpeg',
            jpeg: 'image/jpeg',
            png: 'image/png',
            doc: 'application/msword',
            docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        };
        return mimeTypes[extension] || 'application/octet-stream';
    },

    async uploadFile(files) {
        try {
            const formData = new FormData();

            // Append each file
            if (Array.isArray(files)) {
                files.forEach((file) => {
                    formData.append('file[]', file);
                });
            } else {
                formData.append('file', files);
            }

            const response = await api.postExtra('credit/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.data.status === 1) {
                return response.data;
            } else {
                throw new Error(response.data.message || 'Upload failed');
            }
        } catch (error) {
            console.error('Error uploading file:', error);
            throw error;
        }
    }
};

// 🟢 Handle date change with debouncing
const handleDateChange = () => {
    // Clear any existing timer
    if (debounceTimer) {
        clearTimeout(debounceTimer);
    }

    // Set new timer to debounce the API call
    debounceTimer = setTimeout(async () => {
        // Only fetch data if both dates are selected
        if (dateRange.value[0] && dateRange.value[1]) {
            await loadFilteredData();
        } else if (dateRange.value[0] === null && dateRange.value[1] === null && hasDateFilterApplied.value) {
            // If both dates are cleared and we had data, clear the data
            hasDateFilterApplied.value = false;
            listData.value = [];
            selectedFiles.value = [];
        }
    }, 500); // 500ms debounce delay
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
        listData.value = await OtherService.getOtherList(dateRange.value[0], dateRange.value[1]);
        hasDateFilterApplied.value = true;

        toast.add({
            severity: 'success',
            summary: 'Filter Applied',
            detail: `Showing other files from ${formatDateForDisplay(dateRange.value[0])} to ${formatDateForDisplay(dateRange.value[1])}`,
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
            detail: 'Failed to load other files data',
            life: 5000
        });
    } finally {
        loading.value = false;
    }
};

// 🟢 Watcher for date range changes (alternative approach)
watch(
    dateRange,
    (newRange) => {
        // Only trigger if both dates are set
        if (newRange[0] && newRange[1]) {
            handleDateChange();
        }
    },
    { deep: true }
);

// 🟢 Watcher for route changes to update customer account number
watch(
    () => route.params.custAccNo,
    (newCustAccNo) => {
        if (newCustAccNo) {
            custAccNo.value = newCustAccNo;
            // Clear existing data when customer account changes
            if (hasDateFilterApplied.value) {
                // If date filter is already applied, refresh data with new customer
                refreshData();
            }
        }
    }
);

// 🟢 Computed - Filter data by search (only after date filter applied)
const filteredData = computed(() => {
    if (!hasDateFilterApplied.value) {
        return [];
    }

    // Return all data when date filter is applied (search filtering is handled by DataTable)
    return listData.value;
});

// 🟢 Computed - Upload Summary
const uploadSummary = computed(() => {
    const total = totalFilesToUpload.value;
    const success = successfullyUploaded.value;
    const failed = failedUploads.value;
    const pending = total - success - failed;

    return {
        total,
        success,
        failed,
        pending
    };
});

// 🟢 Handle Download
const handleDownload = async (data) => {
    if (!data.filePath || !data.download) {
        toast.add({
            severity: 'warn',
            summary: 'Cannot Download',
            detail: 'File is not available for download',
            life: 3000
        });
        return;
    }

    downloadLoading.value = data.id;
    try {
        const sanitizeFileName = (name) => (name ? name.replace(/[/\\?%*:|"<>]/g, '-') : 'Unknown');
        const fileExtension = data.fileExtension || 'file';
        const fileName = `${sanitizeFileName(data.dealerName)}_${data.docType}_${data.docsDate.replace(/\//g, '-')}.${fileExtension}`;
        await OtherService.downloadFile(data.filePath, fileName);

        toast.add({
            severity: 'success',
            summary: 'Download Successful',
            detail: 'File has been downloaded successfully',
            life: 3000
        });
    } catch (error) {
        console.error('Download failed:', error);

        let errorDetail = 'Failed to download file. Please try again.';
        if (error.response?.status === 404) {
            errorDetail = 'File not found on the server.';
        } else if (error.response?.status === 403) {
            errorDetail = 'You do not have permission to download this file.';
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
            summary: 'Cannot View File',
            detail: 'File is not available for viewing',
            life: 3000
        });
        return;
    }

    viewLoading.value = data.id;
    try {
        await OtherService.viewFile(data.filePath, data.fileUrl);

        toast.add({
            severity: 'success',
            summary: 'File Opened',
            detail: 'File has been opened in a new tab',
            life: 3000
        });
    } catch (error) {
        console.error('View failed:', error);

        let errorDetail = 'Failed to open file. Please try again.';
        if (error.message.includes('popup') || error.message.includes('blocked')) {
            errorDetail = 'Popup was blocked. Please allow popups for this site and try again.';
        } else if (error.response?.status === 404) {
            errorDetail = 'File not found on the server. The file may have been moved or deleted.';
        } else if (error.response?.status === 403) {
            errorDetail = 'You do not have permission to view this file.';
        } else if (error.message.includes('Both download methods failed')) {
            errorDetail = 'File cannot be accessed. Please contact administrator.';
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
            detail: 'Please select files to download',
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
                const fileExtension = file.fileExtension || 'file';
                const fileName = `${sanitizeFileName(file.dealerName)}_${file.docType}_${file.docsDate.replace(/\//g, '-')}.${fileExtension}`;
                await OtherService.downloadFile(file.filePath, fileName);
                successCount++;

                await new Promise((resolve) => setTimeout(resolve, 100));
            } catch (error) {
                console.error(`Failed to download file: ${file.filePath}`, error);
                errorCount++;
            }
        }

        if (errorCount === 0) {
            toast.add({
                severity: 'success',
                summary: 'Bulk Download Successful',
                detail: `${successCount} files have been downloaded successfully`,
                life: 3000
            });
        } else if (successCount === 0) {
            toast.add({
                severity: 'error',
                summary: 'Bulk Download Failed',
                detail: 'All files failed to download. Please try again.',
                life: 5000
            });
        } else {
            toast.add({
                severity: 'warn',
                summary: 'Partial Download',
                detail: `${successCount} files downloaded successfully, ${errorCount} files failed`,
                life: 5000
            });
        }

        selectedFiles.value = [];
    } catch (error) {
        console.error('Bulk download failed:', error);
        toast.add({
            severity: 'error',
            summary: 'Download Failed',
            detail: 'Failed to download files. Please try again.',
            life: 5000
        });
    } finally {
        downloadLoading.value = null;
    }
};

// 🟢 Handle Upload
const handleUploadClick = () => {
    fileInputRef.value?.click();
};

const handleFileUpload = async (event) => {
    const files = Array.from(event.target.files);
    if (!files.length) return;

    // 🟢 ADDED: Limit of 20 files per upload
    if (files.length > 20) {
        toast.add({
            severity: 'error',
            summary: 'Too Many Files',
            detail: 'Maximum 20 files allowed per upload. Please select 20 files or less.',
            life: 5000
        });
        event.target.value = '';
        return;
    }

    // Validate each file
    const validFiles = [];
    const invalidFiles = [];

    files.forEach((file) => {
        // Validate file size (5MB)
        if (file.size > 5 * 1024 * 1024) {
            invalidFiles.push({
                file,
                reason: 'File size must be less than 5MB'
            });
            return;
        }

        // Validate file type
        const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

        const allowedExtensions = ['.pdf', '.jpg', '.jpeg', '.png', '.doc', '.docx'];
        const fileExtension = '.' + file.name.split('.').pop().toLowerCase();

        if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(fileExtension)) {
            invalidFiles.push({
                file,
                reason: 'Invalid file type. Allowed: PDF, JPEG, PNG, DOC, DOCX'
            });
            return;
        }

        validFiles.push(file);
    });

    // Show validation errors
    if (invalidFiles.length > 0) {
        invalidFiles.forEach(({ file, reason }) => {
            toast.add({
                severity: 'warn',
                summary: 'Invalid File',
                detail: `${file.name}: ${reason}`,
                life: 5000
            });
        });
    }

    if (validFiles.length === 0) {
        event.target.value = '';
        return;
    }

    // Initialize upload dialog
    uploadDialogVisible.value = true;
    uploadLoading.value = true;
    uploadingFiles.value = validFiles.map((file) => ({
        name: file.name,
        size: file.size,
        status: 'pending',
        progress: 0,
        error: null
    }));
    totalFilesToUpload.value = validFiles.length;
    successfullyUploaded.value = 0;
    failedUploads.value = 0;
    uploadProgress.value = 0;

    try {
        // Create FormData
        const formData = new FormData();
        validFiles.forEach((file) => {
            formData.append('file[]', file);
        });

        // Configure axios for progress tracking
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            onUploadProgress: (progressEvent) => {
                if (progressEvent.total) {
                    uploadProgress.value = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                }
            }
        };

        // Update file statuses
        uploadingFiles.value = uploadingFiles.value.map((file) => ({
            ...file,
            status: 'uploading',
            progress: 0
        }));

        // Upload files
        const response = await api.postExtra('credit/upload', formData, config);

        if (response.data.status === 1) {
            // Update status for each file
            response.data.files.forEach((uploadedFile, index) => {
                if (uploadingFiles.value[index]) {
                    uploadingFiles.value[index].status = 'success';
                    uploadingFiles.value[index].progress = 100;
                    successfullyUploaded.value++;
                }
            });

            toast.add({
                severity: 'success',
                summary: 'Upload Successful',
                detail: `${successfullyUploaded.value} of ${totalFilesToUpload.value} files uploaded successfully`,
                life: 5000
            });

            // Refresh the list after successful upload
            await refreshData();
        } else {
            throw new Error(response.data.message || 'Upload failed');
        }
    } catch (error) {
        console.error('Upload failed:', error);

        // Update failed files
        uploadingFiles.value = uploadingFiles.value.map((file) => ({
            ...file,
            status: 'error',
            error: error.message || 'Upload failed',
            progress: 0
        }));
        failedUploads.value = totalFilesToUpload.value - successfullyUploaded.value;

        toast.add({
            severity: 'error',
            summary: 'Upload Failed',
            detail: error.response?.data?.message || 'Failed to upload files. Please try again.',
            life: 5000
        });
    } finally {
        uploadLoading.value = false;

        // Reset file input
        event.target.value = '';

        // Auto-close dialog after 3 seconds if all files are processed
        if (successfullyUploaded.value + failedUploads.value === totalFilesToUpload.value) {
            setTimeout(() => {
                uploadDialogVisible.value = false;
                // Reset upload state after dialog closes
                setTimeout(() => {
                    uploadingFiles.value = [];
                    uploadProgress.value = 0;
                }, 300);
            }, 3000);
        }
    }
};

// Add a method to manually close upload dialog
const closeUploadDialog = () => {
    uploadDialogVisible.value = false;
    uploadingFiles.value = [];
    uploadProgress.value = 0;
    successfullyUploaded.value = 0;
    failedUploads.value = 0;
    totalFilesToUpload.value = 0;
};

// 🟢 Helper function to format file size
const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// 🟢 Initial load - Don't load data initially, require date filter first
onBeforeMount(async () => {
    loading.value = false; // Set loading to false since we won't load data initially
    listData.value = []; // Initialize with empty array
    hasDateFilterApplied.value = false; // No filter applied initially

    // Initialize customer account number from route parameters
    custAccNo.value = route.params.custAccNo || '';
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
        listData.value = await OtherService.getOtherList(dateRange.value[0], dateRange.value[1]);

        toast.add({
            severity: 'success',
            summary: 'Data Refreshed',
            detail: 'Other files data has been refreshed',
            life: 3000
        });
    } catch (err) {
        console.error('Failed to refresh other files data:', err);
        error.value = err.message;

        toast.add({
            severity: 'error',
            summary: 'Refresh Failed',
            detail: 'Failed to refresh other files data',
            life: 5000
        });
    } finally {
        loading.value = false;
    }
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

// 🟢 Clear Date Range
const clearDateRange = () => {
    dateRange.value = [null, null];
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

const handleBack = () => {
    router.back();
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

/* Custom styling for the date filter */
:deep(.p-calendar) {
    .p-inputtext {
        padding: 0.5rem;
    }
}

/* Upload Dialog Styles */
:deep(.upload-dialog-content) {
    .p-progressbar {
        height: 6px;
        border-radius: 3px;
    }

    .file-item {
        transition: all 0.3s ease;
    }

    .files-list::-webkit-scrollbar {
        width: 6px;
    }

    .files-list::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 3px;
    }

    .files-list::-webkit-scrollbar-thumb {
        background: #c1c1c1;
        border-radius: 3px;
    }

    .files-list::-webkit-scrollbar-thumb:hover {
        background: #a8a8a8;
    }
}
</style>
