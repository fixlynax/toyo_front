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
    { label: 'All', value: 'All' },
    { label: 'Processing', value: 'Processing' },
    { label: 'In Progress', value: 'In Progress' },
    { label: 'Completed', value: 'Completed' },
    { label: 'Reject', value: 'Reject' }
];

const getOverallStatusSeverity = (status) => {
    switch (status) {
        case 'Pending Dealer':
            return 'warn';
        case 'Dealer Approved':
            return 'success';
        case 'Dealer Rejected':
            return 'danger';
        case 'Processing':
            return 'info';
        case 'In Progress':
            return 'warning';
        case 'Admin Approved':
            return 'success';
        case 'Admin Rejected':
            return 'danger';
        case 'Completed':
            return 'success';
        case 'Reject':
            return 'danger';
        default:
            return 'secondary';
    }
};

const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});

const filteredList = computed(() => {
    const status = tabs[activeTab.value].value;
    if (status === 'All') {
    // Return everything if "All" tab selected
    return listData.value;
  }
    return listData.value.filter(item => item.status === status);
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
                claimType: item.warrantyType,
                claimDate: item.claim_date,
                status: item.status
            }));
        } else {
            listData.value = [];
        }
    } catch (error) {
        listData.value = [];
    } finally {
        loading.value = false;
    }
};

// Export functionality
const exportToCSV = () => {
    exportLoading.value = true;
    
    try {
        // Prepare data for export
        const exportData = listData.value.map(item => ({
            'Ref No': item.refNo,
            'Dealer Name': item.dealerName,
            'Claim Type': item.claimType,
            'Claim Date': item.claimDate,
            'Status': item.status
        }));

        // Create CSV content
        const headers = Object.keys(exportData[0]).join(',');
        const rows = exportData.map(item => 
            Object.values(item).map(field => 
                `"${String(field).replace(/"/g, '""')}"`
            ).join(',')
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
        // You can add a toast notification here if needed
        alert('Error exporting data. Please try again.');
    } finally {
        exportLoading.value = false;
    }
};

// Alternative export function using JSON (uncomment if needed)
const exportToJSON = () => {
    exportLoading.value = true;
    
    try {
        const exportData = listData.value.map(item => ({
            refNo: item.refNo,
            dealerName: item.dealerName,
            claimType: item.claimType,
            claimDate: item.claimDate,
            status: item.status
        }));

        const dataStr = JSON.stringify(exportData, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        link.setAttribute('href', url);
        link.setAttribute('download', `warranty_claims_${new Date().toISOString().split('T')[0]}.json`);
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

// Export to Excel (if you have xlsx library)
const exportToExcel = async () => {
    exportLoading.value = true;
    
    try {
        // Check if xlsx is available
        if (typeof XLSX === 'undefined') {
            // If xlsx is not available, fall back to CSV
            console.warn('XLSX library not found. Falling back to CSV export.');
            exportToCSV();
            return;
        }

        const exportData = listData.value.map(item => ({
            'Ref No': item.refNo,
            'Dealer Name': item.dealerName,
            'Claim Type': item.claimType,
            'Claim Date': item.claimDate,
            'Status': item.status
        }));

        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Warranty Claims');
        
        XLSX.writeFile(workbook, `warranty_claims_${new Date().toISOString().split('T')[0]}.xlsx`);
        
    } catch (error) {
        console.error('Excel export error:', error);
        // Fallback to CSV
        exportToCSV();
    } finally {
        exportLoading.value = false;
    }
};

onMounted(fetchClaims);
</script>

<template>
    <div class="card">
        <div class="text-2xl font-bold text-gray-800 border-b pb-2">List Claim</div>
        <TabMenu :model="tabs" v-model:activeIndex="activeTab" class="mb-4" />
        <LoadingPage v-if="loading" message="Loading Warranty Claim List..." />

        <div v-else>
            <DataTable
                :value="filteredList"
                :paginator="true"
                :rows="10"
                dataKey="id"
                :rowHover="true"
                :filters="filters"
                filterDisplay="menu"
                :globalFilterFields="['refNo', 'dealerName', 'claimType', 'claimDate', 'status']"
            >
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
                            <Button 
                                type="button" 
                                label="Export" 
                                icon="pi pi-download" 
                                class="p-button-success" 
                                @click="exportToCSV"
                                :loading="exportLoading"
                                :disabled="listData.length === 0"
                            />
                        </div>
                    </div>
                </template>

                <template #empty>No warranty claims found.</template>

                <Column field="refNo" header="Ref No" style="min-width: 8rem">
                    <template #body="{ data }">
                        <RouterLink :to="`/technical/detailWarantyClaim/${data.id}`" class="hover:underline font-bold">
                            {{ data.refNo }}
                        </RouterLink>
                    </template>
                </Column>

                <Column field="dealerName" header="Dealer Name" style="min-width: 6rem">
                    <template #body="{ data }">{{ data.dealerName }}</template>
                </Column>

                <Column field="claimType" header="Claim Type" style="min-width: 6rem">
                    <template #body="{ data }">{{ data.claimType }}</template>
                </Column>

                <Column field="claimDate" header="Claim Date" style="min-width: 6rem">
                    <template #body="{ data }">{{ data.claimDate }}</template>
                </Column>

                <Column header="Status" style="min-width: 6rem">
                    <template #body="{ data }">
                        <Tag :value="data.status" :severity="getOverallStatusSeverity(data.status)" />
                    </template>
                </Column>
            </DataTable>
        </div>
    </div>
</template>