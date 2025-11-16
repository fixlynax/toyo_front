<script setup>
import { onBeforeMount, ref, reactive } from 'vue';
import api from '@/service/api';
import { FilterMatchMode, FilterOperator } from '@primevue/core/api';
import LoadingPage from '@/components/LoadingPage.vue';

// Reactive filters
const filters1 = reactive({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    dealerName: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
    dealerId: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] }
});

const listData = ref([]);
const loading = ref(true);
const downloadLoading = ref(null);
const error = ref(null);

// API service functions for Account Detail
const AccountDetailService = {
    async getAccountDetailList() {
        try {
            const response = await api.get('credit/acctdtl');
            if (response.data.status === 1) {
                // Transform the API data to match your table structure
                return response.data.admin_data.map((item) => ({
                    id: item.file_path, // Using file_path as unique ID
                    docsDate: item.datetime.split(' ')[0], // Extract date part from datetime
                    dealerId: item.account_no,
                    dealerName: item.custName,
                    dateRange: item.datetime, // Using full datetime as date range
                    amtdue: parseFloat(item.amount), // Convert to number for formatting
                    company: item.company,
                    filePath: item.file_path,
                    download: true // All files are downloadable since they exist in storage
                }));
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
                {
                    file_path: filePath
                },
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
    }
};

const handleDownload = async (data) => {
    if (!data.filePath || !data.download) return;

    downloadLoading.value = data.id;
    try {
        // Sanitize filename to remove invalid characters
        const sanitizeFileName = (name) => (name ? name.replace(/[/\\?%*:|"<>]/g, '-') : 'Unknown');
        const fileName = `AccountDetail_${sanitizeFileName(data.dealerName)}_${data.docsDate.replace(/\//g, '-')}.pdf`;
        await AccountDetailService.downloadFile(data.filePath, fileName);
    } catch (error) {
        console.error('Download failed:', error);
        // You can add a toast notification here
    } finally {
        downloadLoading.value = null;
    }
};

onBeforeMount(async () => {
    try {
        listData.value = await AccountDetailService.getAccountDetailList();
        error.value = null; // Reset error on success
    } catch (err) {
        console.error('Failed to load account detail data:', err);
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
        listData.value = await AccountDetailService.getAccountDetailList();
    } catch (err) {
        console.error('Failed to refresh account detail data:', err);
        error.value = err.message;
    } finally {
        loading.value = false;
    }
};
</script>

<template>
    <div class="card">
        <div class="flex justify-between items-center mb-4">
            <div class="text-2xl font-bold text-gray-800">Account Detail</div>
            <Button icon="pi pi-refresh" class="p-button-outlined p-button-sm" @click="refreshData" :disabled="loading" v-tooltip="'Refresh data'" />
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
            :value="listData"
            :paginator="true"
            :rows="10"
            dataKey="id"
            class="rounded-table"
            :rowHover="true"
            :filters="filters1"
            :rowsPerPageOptions="[5, 10, 20, 50]"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
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
                <div class="text-center py-8 text-gray-500">
                    <i class="pi pi-file-excel text-4xl mb-2"></i>
                    <div>No account detail records found.</div>
                </div>
            </template>

            <Column field="docsDate" header="Document Date" style="min-width: 8rem">
                <template #body="{ data }">
                    <span class="font-medium">{{ data.docsDate }}</span>
                </template>
            </Column>

            <Column field="dealerId" header="Customer Acc No." style="min-width: 10rem">
                <template #body="{ data }">
                    <span class="font-mono">{{ data.dealerId }}</span>
                </template>
            </Column>

            <Column field="dealerName" header="Dealer Name" style="min-width: 10rem">
                <template #body="{ data }">
                    <span v-if="data.dealerName">{{ data.dealerName }}</span>
                    <span v-else class="text-gray-400">-</span>
                </template>
            </Column>

                        <Column field="company" header="Company" style="min-width: 10rem">
                <template #body="{ data }">
                    <Chip :label="data.company" class="bg-blue-100 text-blue-800" />
                </template>
            </Column>

            <Column field="dateRange" header="Date Time" style="min-width: 10rem">
                <template #body="{ data }">
                    <span class="font-mono text-sm">{{ data.dateRange }}</span>
                </template>
            </Column>

            <!-- Amount Due -->
            <Column field="amtdue" header="Amount Due (RM)" style="min-width: 10rem; text-align: right">
                <template #body="{ data }">
                    <div class="flex justify-start items-center w-full">
                        <span 
                            class="font-semibold text-lg" 
                            :class="data.amtdue < 0 ? 'text-red-500' : 'text-gray-800'"
                        >
                            RM {{ data.amtdue.toFixed(2) }}
                        </span>
                    </div>
                </template>
            </Column>

            <Column header="Download" style="min-width: 6rem; text-align: center">
                <template #body="{ data }">
                    <Button
                        icon="pi pi-download"
                        class="p-button-sm"
                        :severity="data.download ? 'success' : 'secondary'"
                        :disabled="!data.download || downloadLoading === data.id"
                        :loading="downloadLoading === data.id"
                        @click="handleDownload(data)"
                        v-tooltip.top="data.download ? 'Download Account Detail' : 'Download not available'"
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
            border-bottom-right-radius:0;
        }
    }
    
    .p-datatable-tbody > tr.p-datatable-emptymessage > td {
        border-bottom-left-radius: 12px;
        border-bottom-right-radius: 12px;
    }
}
</style>