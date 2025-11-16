<template>
    <!-- TOP STATS GRID -->
    <div class="grid grid-cols-12 gap-6">
        <div v-for="card in statsCards" :key="card.label" class="col-span-12 sm:col-span-6 xl:col-span-3">
            <div class="card hover:shadow-md transition-shadow duration-300">
                <div class="flex justify-between items-center mb-4">
                    <div>
                        <span class="block text-sm text-gray-500 mb-2">{{ card.label }}</span>
                        <div class="text-2xl font-semibold text-gray-900 dark:text-white">
                            {{ card.value }}
                        </div>
                    </div>
                    <div class="flex items-center justify-center rounded-lg" :class="card.iconBg" style="width: 2.75rem; height: 2.75rem">
                        <i :class="['!text-xl', card.icon, card.iconColor]"></i>
                    </div>
                </div>
                <div class="text-sm">
                    <span class="text-primary font-semibold">{{ card.submitted }}</span>
                    <span class="text-gray-500"> submitted • </span>
                    <span class="text-red-500 font-semibold">{{ card.pending }}</span>
                    <span class="text-gray-500"> pending</span>
                </div>
            </div>
        </div>
    </div>

    <!-- LIST CLAIM - PENDING ONLY -->
    <div class="card mt-8">
        <div class="flex items-center justify-between border-b pb-3 mb-3">
            <div>
                <div class="text-xl font-bold text-gray-800">Warranty Claim</div>
                <div class="text-sm text-gray-500 mt-1">
                    Showing {{ filteredPendingClaims.length }} pending case
                </div>
            </div>
        </div>

        <DataTable :value="filteredPendingClaims" :paginator="true" :rows="10" dataKey="id" :rowHover="true" :loading="loading" class="p-datatable-sm" :filters="filters1" filterDisplay="menu">
    

            <!-- STATES -->
            <template #empty>
                <div class="py-6 text-gray-500 text-center">No pending claims found.</div>
            </template>
            <template #loading>
                <div class="py-6 text-gray-500 text-center">Loading pending claims...</div>
            </template>

            <!-- COLUMNS -->
            <Column field="refNo" header="Ref No" style="min-width: 12rem">
                <template #body="{ data }">
                    <div class="flex flex-col">
                        <RouterLink :to="`/technical/detailWarantyClaim/${data.id}`" class="hover:underline text-gray-800 font-bold">
                            {{ data.refNo }}
                        </RouterLink>
                        <span class="text-gray-700 text-sm mt-1">🔧 {{ data.claimType }}</span>
                    </div>
                </template>
            </Column>

            <Column field="submissionDate" header="Submission Date" style="min-width: 10rem">
                <template #body="{ data }">
                    <span class="text-gray-800">{{ data.submissionDate }}</span>
                </template>
            </Column>

            <Column header="Dealer Name" style="min-width: 14rem">
                <template #body="{ data }">
                    <div class="flex flex-col">
                        <div class="font-semibold">{{ data.dealerName }}</div>
                        <div class="text-gray-600 text-sm">{{ data.warrantyRegCertNo }}</div>
                    </div>
                </template>
            </Column>

            <Column field="claimType" header="Claim Type" style="min-width: 8rem">
                <template #body="{ data }">{{ data.claimType }}</template>
            </Column>

            <Column header="Status" style="min-width: 10rem">
                <template #body="{ data }">
                    <Tag :value="data.status" :severity="getOverallStatusSeverity(data.status)" />
                </template>
            </Column>

            <!-- Additional columns for pending details -->
            <Column header="Pending Items" style="min-width: 12rem">
                <template #body="{ data }">
                    <div class="flex flex-wrap gap-1">
                        <span v-if="data.pendingCTC" class="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">CTC</span>
                        <span v-if="data.pendingScrap" class="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded">Scrap</span>
                        <span v-if="data.pendingInvoice" class="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">Invoice</span>
                        <span v-if="!data.pendingCTC && !data.pendingScrap && !data.pendingInvoice" class="text-gray-500 text-xs">-</span>
                    </div>
                </template>
            </Column>
        </DataTable>
    </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';
import { FilterMatchMode, FilterOperator } from '@primevue/core/api';
import api from '@/service/api';

const listData = ref([]);
const detailedClaims = ref([]);
const loading = ref(true);
const exportLoading = ref(false);

const filters1 = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    refNo: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
    dealerName: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
    claimType: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
    submissionDate: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] }
});

// Pending status definitions
const pendingStatuses = [
    'Pending Dealer', 
    'Pending CTC', 
    'Pending Scrap', 
    'Pending Manager Approve', 
    'Pending Invoice', 
    'Pending Invoice Approve',
    'Processing',
    'In Progress'
];

// Filtered pending claims for the table
const filteredPendingClaims = computed(() => {
    return listData.value.filter(claim => 
        pendingStatuses.includes(claim.status) || 
        claim.pendingCTC || 
        claim.pendingScrap || 
        claim.pendingInvoice
    );
});

// Stats cards with submitted and pending counts
const statsCards = computed(() => {
    const totalClaims = listData.value.length;
    
    // Count CTC submissions and pending
    const ctcSubmitted = detailedClaims.value.filter(claim => claim.isCTC === 1).length;
    const ctcPending = detailedClaims.value.filter(claim => claim.isCTC === 0 && pendingStatuses.includes(claim.status)).length;
    
    // Count Scrap submissions and pending
    const scrapSubmitted = detailedClaims.value.filter(claim => claim.isScrap === 1).length;
    const scrapPending = detailedClaims.value.filter(claim => claim.isScrap === 0 && pendingStatuses.includes(claim.status)).length;
    
    // Count Invoice submissions and pending (using isReimbursement as invoice indicator)
    const invoiceSubmitted = detailedClaims.value.filter(claim => claim.isReimbursement === 1).length;
    const invoicePending = detailedClaims.value.filter(claim => claim.isReimbursement === 0 && pendingStatuses.includes(claim.status)).length;
    
    // Count total submitted and pending claims
    const claimSubmitted = totalClaims;
    const claimPending = listData.value.filter(claim => pendingStatuses.includes(claim.status)).length;

    return [
        { 
            label: 'CTC', 
            value: ctcSubmitted.toString(), 
            submitted: ctcSubmitted,
            pending: ctcPending,
            icon: 'pi pi-file-edit', 
            iconBg: 'bg-blue-100 dark:bg-blue-400/10', 
            iconColor: 'text-blue-500'
        },
        { 
            label: 'Claims', 
            value: claimSubmitted.toString(), 
            submitted: claimSubmitted,
            pending: claimPending,
            icon: 'pi pi-clipboard', 
            iconBg: 'bg-green-100 dark:bg-green-400/10', 
            iconColor: 'text-green-500'
        },
        { 
            label: 'Scrap', 
            value: scrapSubmitted.toString(), 
            submitted: scrapSubmitted,
            pending: scrapPending,
            icon: 'pi pi-trash', 
            iconBg: 'bg-orange-100 dark:bg-orange-400/10', 
            iconColor: 'text-orange-500'
        },
        { 
            label: 'Invoice', 
            value: invoiceSubmitted.toString(), 
            submitted: invoiceSubmitted,
            pending: invoicePending,
            icon: 'pi pi-receipt', 
            iconBg: 'bg-purple-100 dark:bg-purple-400/10', 
            iconColor: 'text-purple-500'
        }
    ];
});

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
        case 'Reject':
            return 'danger';
        case 'Processing':
            return 'info';
        case 'In Progress':
            return 'warning';
        default:
            return 'secondary';
    }
};

// Export functionality for pending claims only
const exportToCSV = () => {
    exportLoading.value = true;
    
    try {
        const exportData = filteredPendingClaims.value.map(item => ({
            'Ref No': item.refNo,
            'Dealer Name': item.dealerName,
            'Claim Type': item.claimType,
            'Submission Date': item.submissionDate,
            'Warranty Cert No': item.warrantyRegCertNo,
            'Status': item.status,
            'Pending CTC': item.pendingCTC ? 'Yes' : 'No',
            'Pending Scrap': item.pendingScrap ? 'Yes' : 'No',
            'Pending Invoice': item.pendingInvoice ? 'Yes' : 'No'
        }));

        if (exportData.length === 0) {
            alert('No pending claims to export.');
            exportLoading.value = false;
            return;
        }

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
        link.setAttribute('download', `pending_claims_${new Date().toISOString().split('T')[0]}.csv`);
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

// Fetch detailed claim information
const fetchClaimDetails = async (claimId) => {
    try {
        const response = await api.get(`warranty_claim/${claimId}`);
        if (response.data.status === 1) {
            return {
                id: claimId,
                isCTC: response.data.admin_data.claim_info.isCTC || 0,
                isScrap: response.data.admin_data.claim_info.isScrap || 0,
                isReimbursement: response.data.admin_data.claim_info.isReimbursement || 0,
                status: response.data.admin_data.claim_info.status_string || 'Unknown'
            };
        }
    } catch (error) {
        console.error(`Error fetching details for claim ${claimId}:`, error);
    }
    return null;
};

// FETCH DATA
const fetchClaims = async () => {
    loading.value = true;
    try {
        const response = await api.get('warranty_claim');
        if (response.data.status === 1) {
            const claims = response.data.admin_data.map((item) => ({
                id: item.claim_id,
                refNo: item.claimRefNo,
                dealerName: item.dealer,
                claimType: item.warrantyType || '-',
                claimDate: item.claim_date || '-',
                submissionDate: item.submit_date || '-',
                warrantyRegCertNo: item.warrantyRegCertNo || '-',
                status: item.status,
                pendingCTC: false, // Will be updated after fetching details
                pendingScrap: false, // Will be updated after fetching details
                pendingInvoice: false // Will be updated after fetching details
            }));

            listData.value = claims;

            // Fetch detailed information for each claim
            const detailPromises = claims.map(claim => fetchClaimDetails(claim.id));
            const detailedResults = await Promise.all(detailPromises);
            
            detailedClaims.value = detailedResults.filter(result => result !== null);
            
            // Update pending flags in listData
            listData.value = listData.value.map(claim => {
                const detail = detailedResults.find(d => d && d.id === claim.id);
                if (detail) {
                    return {
                        ...claim,
                        pendingCTC: detail.isCTC === 0 && pendingStatuses.includes(claim.status),
                        pendingScrap: detail.isScrap === 0 && pendingStatuses.includes(claim.status),
                        pendingInvoice: detail.isReimbursement === 0 && pendingStatuses.includes(claim.status)
                    };
                }
                return claim;
            });

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

onMounted(fetchClaims);
</script>

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