<script setup>
import { onBeforeMount, ref, reactive } from 'vue';
import api from '@/service/api';
import { FilterMatchMode, FilterOperator } from '@primevue/core/api';
import LoadingPage from '@/components/LoadingPage.vue';

// Reactive filters
const filters1 = reactive({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    dealerName: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
    docsNo: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] }
});

const listData = ref([]);
const loading = ref(true);
const downloadLoading = ref(null);
const error = ref(null);
const uploadLoading = ref(false);
const fileInputRef = ref(null);

// API service functions for Other Files
const OtherService = {
    async getOtherList() {
        try {
            const response = await api.get('credit/other');
            if (response.data.status === 1) {
                // Transform the API data to match your table structure
                return response.data.admin_data.map((item) => ({
                    id: item.file_path, // Using file_path as unique ID
                    docsDate: item.date,
                    docsNo: item.docno,
                    dealerId: item.account_no,
                    dealerName: item.custName,
                    company: item.company,
                    filePath: item.file_path,
                    download: true // All files are downloadable since they exist in storage
                }));
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

            // Create blob and download
            const blob = new Blob([response.data], { type: response.headers['content-type'] });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = fileName || filePath.split('/').pop();
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            return true;
        } catch (error) {
            console.error('Error downloading file:', error);
            throw error;
        }
    },

    async uploadFile(file) {
        try {
            const formData = new FormData();
            formData.append('file', file);

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

const handleDownload = async (data) => {
    if (!data.filePath || !data.download) return;

    downloadLoading.value = data.id;
    try {
        // Sanitize filename to remove invalid characters
        const sanitizeFileName = (name) => (name ? name.replace(/[/\\?%*:|"<>]/g, '-') : 'Unknown');
        const fileName = `Other_${sanitizeFileName(data.dealerName)}_${data.docsNo}.pdf`;
        await OtherService.downloadFile(data.filePath, fileName);
    } catch (error) {
        console.error('Download failed:', error);
        // You can add a toast notification here
    } finally {
        downloadLoading.value = null;
    }
};

const handleUploadClick = () => {
    fileInputRef.value?.click();
};

const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
    }

    // Validate file type (optional - you can customize allowed types)
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
        alert('Please select a valid file type (PDF, JPEG, PNG, DOC, DOCX)');
        return;
    }

    uploadLoading.value = true;
    try {
        const result = await OtherService.uploadFile(file);
        console.log('Upload successful:', result);

        // Refresh the list after successful upload
        await refreshData();

        // Show success message (you can replace with toast notification)
        alert('File uploaded successfully!');

        // Reset file input
        event.target.value = '';
    } catch (error) {
        console.error('Upload failed:', error);
        alert(`Upload failed: ${error.message}`);
    } finally {
        uploadLoading.value = false;
    }
};

onBeforeMount(async () => {
    try {
        listData.value = await OtherService.getOtherList();
        error.value = null; // Reset error on success
    } catch (err) {
        console.error('Failed to load other files data:', err);
        error.value = err.message;
        // Optional: You can set listData to empty array on error
        listData.value = [];
    } finally {
        loading.value = false;
    }
});

// Optional: Refresh function
const refreshData = async () => {
    loading.value = true;
    error.value = null;
    try {
        listData.value = await OtherService.getOtherList();
    } catch (err) {
        console.error('Failed to refresh other files data:', err);
        error.value = err.message;
    } finally {
        loading.value = false;
    }
};
</script>

<template>
    <div class="card">
        <div class="flex justify-between items-center mb-4">
            <div class="text-2xl font-bold text-black">List Other</div>
            <div class="flex gap-2">
                <Button icon="pi pi-refresh" class="p-button-outlined p-button-sm" @click="refreshData" :disabled="loading" v-tooltip="'Refresh data'" />
                <Button type="button" icon="pi pi-upload" label="Upload" class="p-button-outlined p-button-sm" @click="handleUploadClick" :loading="uploadLoading" :disabled="uploadLoading" />
                <input type="file" ref="fileInputRef" @change="handleFileUpload" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" style="display: none" />
            </div>
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
                        <Button type="button" icon="pi pi-cog" class="p-button-outlined" v-tooltip="'Table settings'" />
                    </div>
                </div>
            </template>

            <template #empty>
                <div class="text-center py-8 text-black">
                    <i class="pi pi-file-excel text-4xl mb-2"></i>
                    <div>No other files records found.</div>
                </div>
            </template>

            <Column field="docsDate" header="Document Date" style="min-width: 8rem" sortable>
                <template #body="{ data }">
                    <span class="font-medium">{{ data.docsDate }}</span>
                </template>
            </Column>

            <Column field="docsNo" header="Document No" style="min-width: 10rem" sortable>
                <template #body="{ data }">
                    <span class="font-medium">{{ data.docsNo }}</span>
                </template>
            </Column>

            <Column field="dealerId" header="Customer Acc No" style="min-width: 10rem" sortable>
                <template #body="{ data }">
                    <span v-if="data.dealerId" class="font-medium">{{ data.dealerId }}</span>
                    <span v-else class="text-black">-</span>
                </template>
            </Column>

            <Column field="dealerName" header="Customer Name" style="min-width: 10rem">
                <template #body="{ data }">
                    <span v-if="data.dealerName">{{ data.dealerName }}</span>
                    <span v-else class="text-black">-</span>
                </template>
            </Column>

            <Column header="Action" style="min-width: 6rem; text-align: left" sortable>
                <template #body="{ data }">
                    <Button
                        icon="pi pi-download"
                        class="p-button-xm"
                        :severity="data.download ? 'success' : 'secondary'"
                        :disabled="!data.download || downloadLoading === data.id"
                        :loading="downloadLoading === data.id"
                        @click="handleDownload(data)"
                        v-tooltip.top="data.download ? 'Download Other File' : 'Download not available'"
                    />
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
