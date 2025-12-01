<template>
    <div class="card">
        <div class="text-2xl font-bold text-gray-800 border-b pb-2 mb-6">Warranty Registration List</div>

        <!-- Show LoadingPage only during initial page load -->
        <LoadingPage v-if="initialLoading" :message="'Loading Warrantys...'" :sub-message="'Fetching Warranty data'" />

        <!-- Show content area when not in initial loading -->
        <div v-else>
            <DataTable
                :value="listData"
                :paginator="true"
                :rows="10"
                :rowsPerPageOptions="[10, 25, 50, 100]"
                dataKey="id"
                :rowHover="true"
                :loading="tableLoading"
                :filters="filters"
                filterDisplay="menu"
                :globalFilterFields="['warranty_cert_no', 'invoice_no', 'member_code', 'full_name', 'mfgcode', 'tyresize', 'tyrespec']"
                class="rounded-table"
            >
            
                <template #header>
                    <div class="flex items-center justify-between gap-4 w-full flex-wrap">
                        <!-- Left: Search Field + Cog Button -->
                        <div class="flex items-center gap-2 w-full max-w-md">
                            <IconField class="flex-1">
                                <InputIcon>
                                    <i class="pi pi-search" />
                                </InputIcon>
                                <InputText v-model="filters['global'].value" placeholder="Quick Search" class="w-full" />
                            </IconField>
                            <!-- <Button type="button" icon="pi pi-cog" class="p-button" /> -->
                        </div>

                        <!-- Right: Create Warranty Button -->
                        <RouterLink to="/marketing/createWarranty">
                            <Button type="button" label="Create" />
                        </RouterLink>
                    </div>
                </template>

                <template #empty>
                    <div class="text-center py-8 text-gray-500">No Warranty registrations found.</div>
                </template>

                <template #loading>
                    <div class="text-center py-4">
                        <ProgressSpinner style="width: 30px; height: 30px" />
                        <p class="mt-2 text-gray-600">Loading Warranty data...</p>
                    </div>
                </template>

                <Column field="warranty_cert_no" header="Warranty Cert No" style="min-width: 10rem">
                    <template #body="{ data }">
                        <RouterLink :to="`/marketing/detailWarrantyRegistration/${data.id}`" class="hover:underline font-bold text-primary-400">
                            {{ data.warranty_cert_no }}
                        </RouterLink>
                    </template>
                </Column>

                <Column field="invoice_no" header="Invoice No" style="min-width: 8rem">
                    <template #body="{ data }">
                        {{ data.invoice_no || 'N/A' }}
                    </template>
                </Column>

                <Column field="full_name" header="TC Member" style="min-width: 8rem">
                   <template #body="{ data }"> 
                        <div v-if="data.member_code || data.full_name">
                            <div v-if="data.member_code">{{ data.member_code }}</div>
                            <div>{{ data.full_name || 'N/A' }}</div>
                        </div>
                        <div v-else>N/A</div>
                   </template>
                </Column>

                <Column field="tyre_info" header="Tyre" style="min-width: 10rem">
                    <template #body="{ data }">
                        <div v-if="data.mfgcode || data.tyresize || data.tyrespec">
                            <div><strong>MFG:</strong> {{ data.mfgcode || 'N/A' }}</div>
                            <div><strong>Size:</strong> {{ data.tyresize || 'N/A' }}</div>
                            <div><strong>Spec:</strong> {{ data.tyrespec || 'N/A' }}</div>
                            <div><strong>Week:</strong> {{ data.weekcode || 'N/A' }}</div>
                        </div>
                        <div v-else>N/A</div>
                    </template>
                </Column>

                <Column field="registered_on" header="Registered Date" style="min-width: 8rem">
                    <template #body="{ data }">
                        {{ formatDate(data.registered_on) }}
                    </template>
                </Column>

                <Column field="status" header="Status" style="min-width: 6rem">
                    <template #body="{ data }">
                        <Tag :value="data.status === 1 ? 'Active' : 'Inactive'" :severity="getOverallStatusSeverity(data.status)" />
                    </template>
                </Column>
            </DataTable>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import api from '@/service/api';
import { FilterMatchMode } from '@primevue/core/api';
import LoadingPage from '@/components/LoadingPage.vue';

// Data variables
const listData = ref([]);
const initialLoading = ref(true); // For initial page load
const tableLoading = ref(false); // For table operations

// Filters for quick search
const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});

onMounted(async () => {
    try {
        initialLoading.value = true;
        tableLoading.value = true;

        // Call the warranty_registration/normal API endpoint
        const response = await api.post('warranty_registration/normal', {
            status: 1,
            admin_data: [] // You can pass empty array or filter criteria if needed
        });

        // Debug: Log the response to see the structure
        console.log('API Response:', response);

        if (response.data.status === 1 && Array.isArray(response.data.admin_data)) {
            listData.value = response.data.admin_data.map((warranty) => ({
                id: warranty.id,
                warranty_cert_no: warranty.warranty_cert_no || 'N/A',
                invoice_no: warranty.invoice_no || 'N/A',
                member_code: warranty.member_code || null,
                full_name: warranty.full_name || null,
                mfgcode: warranty.mfgcode || 'N/A',
                tyresize: warranty.tyresize || 'N/A',
                tyrespec: warranty.tyrespec || 'N/A',
                weekcode: warranty.weekcode || 'N/A',
                registered_on: warranty.registered_on || 'N/A',
                status: warranty.status || 0
            }));
            
            console.log('Processed data:', listData.value);
        } else {
            console.error('API returned error or invalid data:', response.data);
            listData.value = [];
        }
    } catch (error) {
        console.error('Error fetching Warranty registration list:', error);
        listData.value = [];
    } finally {
        initialLoading.value = false;
        tableLoading.value = false;
    }
});

function formatDate(dateString) {
    if (!dateString || dateString === 'N/A') return 'N/A';
    
    try {
        // Handle DD/MM/YYYY format
        const [day, month, year] = dateString.split('/');
        
        // Validate date components
        if (!day || !month || !year) return dateString;
        
        const date = new Date(`${year}-${month}-${day}`);
        
        if (isNaN(date.getTime())) return dateString;
        
        return date.toLocaleDateString('en-MY', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    } catch (error) {
        console.error('Error formatting date:', error, dateString);
        return dateString;
    }
}

const getOverallStatusSeverity = (status) => {
    return status === 1 ? 'success' : 'danger';
};
</script>

<style scoped lang="scss">
:deep(.p-datatable-frozen-tbody) {
    font-weight: bold;
}

:deep(.p-datatable-scrollable .p-frozen-column) {
    font-weight: bold;
}

// Rounded table styles
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
    
    // For the last row in the table body
    .p-datatable-tbody > tr:last-child > td {
        &:first-child {
            border-bottom-left-radius: 0;
        }
        &:last-child {
            border-bottom-right-radius: 0;
        }
    }
    
    // When table is empty
    .p-datatable-tbody > tr.p-datatable-emptymessage > td {
        border-bottom-left-radius: 12px;
        border-bottom-right-radius: 12px;
    }
    
    // Style for the tyre info column
    .tyre-info-cell {
        line-height: 1.4;
        font-size: 0.875rem;
    }
}
</style>