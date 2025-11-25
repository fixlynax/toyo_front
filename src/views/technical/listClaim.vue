<script setup>
import LoadingPage from '@/components/LoadingPage.vue';
import api from '@/service/api';
import { FilterMatchMode } from '@primevue/core/api';
import { onMounted, ref, computed } from 'vue';

const listData = ref([]);
const loading = ref(true);
const exportLoading = ref(false);

const activeTab = ref(0);

const tabs = [
    { label: 'Processing', value: 'Processing' },
    { label: 'In Progress', value: 'In Progress' },
    { label: 'Completed', value: 'Completed' },
    { label: 'Rejected', value: 'Rejected' }
];

// Define status categories based on your requirements
// const statusCategories = {
//     Processing: ['Pending Dealer', 'Pending CTC', 'Processing'],
//     'In Progress': ['In Progress', 'Pending Scrap', 'Pending Manager Approve', 'Pending Invoice', 'Pending Invoice Approve'],
//     Completed: ['Completed', 'Admin Approved', 'Dealer Approved', 'Settled'],
//     Reject: ['Reject', 'Admin Rejected', 'Dealer Rejected']
// };

const getOverallStatusSeverity = (status) => {
    switch (status) {
        case 'Pending Dealer':
        case 'Pending CTC':
        case 'Pending Scrap':
        case 'Pending Manager Approve':
        case 'Pending Invoice':
        case 'Pending Invoice Approve':
            return 'warn';
        case 'Dealer Approved':
        case 'Admin Approved':
        case 'Completed':
        case 'Settled':
            return 'success';
        case 'Dealer Rejected':
        case 'Admin Rejected':
        case 'Rejected':
            return 'danger';
        case 'Processing':
            return 'info';
        case 'In Progress':
            return 'warning';
        default:
            return 'secondary';
    }
};

const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});

const filteredList = computed(() => {
    const tabValue = tabs[activeTab.value].value;

    return listData.value.filter(item => item.status === tabValue);
});

const fetchClaims = async () => {
    loading.value = true;
    try {
        const response = await api.get('warranty_claim');
        if (response.data.status === 1) {
            listData.value = response.data.admin_data.map((item) => ({
                id: item.claim_id,
                refNo: item.claimRefNo,
                dealerName: item.dealer,
                claimType: item.warrantyType || '-',
                dealer_sales_office: item.dealer_sales_office || '-',
                claimDate: item.claim_date || '-',
                submissionDate: item.submit_date || '-',
                warrantyRegCertNo: item.warrantyRegCertNo || '-',
                status: item.status,
                stage: item.stage || '-'
            }));
        } else {
            listData.value = [];
        }
    } catch (error) {
        console.error('Error fetching claims:', error);
        listData.value = [];
    } finally {
        loading.value = false;
    }
};

function formatDate(dateString) {
    if (!dateString) return '';

    // Expected: DD-MM-YYYY
    const [day, month, year] = dateString.split('-');
    const date = new Date(`${year}-${month}-${day}`);

    if (isNaN(date)) return '';

    return date.toLocaleDateString('en-MY', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
}
// Export functionality
const exportToCSV = () => {
    exportLoading.value = true;

    try {
        // Use filtered data for export
        const exportData = filteredList.value.map((item) => ({
            'Ref No': item.refNo,
            'Dealer Name': item.dealerName,
            'Claim Type': item.claimType,
            'Submission Date': item.submissionDate,
            'Warranty Cert No': item.warrantyRegCertNo,
            Status: item.status,
            Stage: item.stage
        }));

        if (exportData.length === 0) {
            alert('No data to export for the current filter.');
            exportLoading.value = false;
            return;
        }

        // Create CSV content
        const headers = Object.keys(exportData[0]).join(',');
        const rows = exportData.map((item) =>
            Object.values(item)
                .map((field) => `"${String(field).replace(/"/g, '""')}"`)
                .join(',')
        );

        const csvContent = [headers, ...rows].join('\n');

        // Create and download file
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);

        link.setAttribute('href', url);
        link.setAttribute('download', `warranty_claims_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (error) {
        console.error('Export error:', error);
        alert('Error exporting data. Please try again.');
    } finally {
        exportLoading.value = false;
    }
};


onMounted(fetchClaims);
</script>

<template>
    <div class="card">
        <div class="text-2xl font-bold text-gray-800 border-b pb-2">List Claim</div>

        <!-- Custom Tabs with Counts -->
        <div class="border-b border-gray-200 mb-4">
            <div class="flex space-x-8">
                <button
                    v-for="(tab, index) in tabs"
                    :key="tab.value"
                    @click="activeTab = index"
                    class="px-1 py-3 text-sm font-medium relative transition-colors duration-200"
                    :class="[activeTab === index ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700']"
                >
                    <div class="flex items-center gap-2">
                        <span>{{ tab.label }}</span>
                    </div>
                </button>
            </div>
        </div>

        <LoadingPage v-if="loading" message="Loading Warranty Claim List..." />

        <div v-else>
            <DataTable :value="filteredList" :paginator="true" :rows="10" dataKey="id" :rowHover="true" :filters="filters" filterDisplay="menu" :globalFilterFields="['refNo', 'dealerName', 'claimType', 'claimDate', 'status', 'stage', 'warrantyRegCertNo']">
                <template #header>
                    <div class="flex items-center justify-between gap-4 w-full flex-wrap">
                        <div class="flex items-center gap-2 w-full max-w-md">
                            <IconField class="flex-1">
                                <InputIcon>
                                    <i class="pi pi-search" />
                                </InputIcon>
                                <InputText v-model="filters['global'].value" placeholder="Quick Search" class="w-full" />
                            </IconField>
                            <Button type="button" icon="pi pi-cog" class="p-button" />
                        </div>

                        <div class="flex items-center gap-2 ml-auto">
                            <Button type="button" label="Export " icon="pi pi-download" class="p-button-success" @click="exportToCSV" :loading="exportLoading" :disabled="filteredList.length === 0" />
                        </div>
                    </div>
                </template>

                <template #empty>No warranty claims found.</template>

                <Column field="refNo" header="Ref No" style="min-width: 15rem">
                    <template #body="{ data }">
                        <RouterLink :to="`/technical/detailWarantyClaim/${data.id}`" class="hover:underline font-bold text-blue-600">
                            {{ data.refNo }}
                        </RouterLink>
                    </template>
                </Column>

                <Column field="submissionDate" header="Submission Date" style="min-width: 15rem">
                    <template #body="{ data }">{{ data?.submissionDate ? formatDate(data.submissionDate) : 'Not Assigned' }}</template>
                </Column>

                <Column header="Dealer Name" style="min-width: 12rem">
                    <template #body="{ data }">
                        <div class="flex flex-col">
                            <!-- Top -->
                            <div class="font-semibold">{{ data.dealerName }}</div>
                            <!-- Bottom -->
                            <div class="text-gray-600 text-sm">{{ data.warrantyRegCertNo }}</div>
                        </div>
                    </template>
                </Column>
                <Column field="dealer_sales_office" header="Dealer Sales Office" style="min-width: 15rem">
                    <template #body="{ data }">{{ data.dealer_sales_office }}</template>
                </Column>
                <Column field="claimType" header="Claim Type" style="min-width: 15rem">
                    <template #body="{ data }">{{ data.claimType }}</template>
                </Column>

                <Column field="status" header="Status" style="min-width: 10rem">
                    <template #body="{ data }">
                        <Tag :value="data.status" :severity="getOverallStatusSeverity(data.status)" />
                    </template>
                </Column>

                <Column field="stage" header="Stage" style="min-width: 10rem">
                    <template #body="{ data }">
                        {{ data.stage }}
                    </template>
                </Column>
            </DataTable>
        </div>
    </div>
</template>

<style scoped>
:deep(.p-datatable .p-datatable-thead > tr > th) {
    background-color: #f9fafb;
    border-color: #e5e7eb;
    padding: 12px 16px;
    font-weight: 600;
    color: #374151;
}

:deep(.p-datatable .p-datatable-tbody > tr > td) {
    padding: 12px 16px;
    border-color: #e5e7eb;
}

:deep(.p-datatable .p-datatable-tbody > tr) {
    transition: background-color 0.2s;
}

:deep(.p-datatable .p-datatable-tbody > tr:hover) {
    background-color: #f3f4f6;
}
</style>
