<template>
    <div class="card">
        <div class="text-2xl font-bold text-gray-800 border-b pb-2">List Return Order</div>
        <!-- 🟢 Only show LoadingPage during initial load, hide DataTable completely -->
        <LoadingPage v-if="loading" :message="'Loading Return Orders...'" :sub-message="'Fetching your Return Order list'" />

        <DataTable
        v-else
            :value="listData"
            :paginator="true"
            :rows="10"
            :rowsPerPageOptions="[5, 10, 20]"
            dataKey="id"
            :rowHover="true"
            :filters="filters"
            filterDisplay="menu"
            :globalFilterFields="['returnRequestNo', 'custAccountNo', 'customerName', 'deliveryDate', 'orderStatus']"
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
                        <Button type="button" icon="pi pi-cog" class="p-button" />
                    </div>
                </div>
            </template>

            <template #empty> No return orders found. </template>
            <template #loading> Loading return orders. Please wait... </template>

            
            <Column field="returnRequestNo" header="Return Req No." style="min-width: 8rem">
                <template #body="{ data }">
                    <RouterLink :to="`/om/detailReturnOrder/${data.id}`" class="hover:underline font-bold">
                        {{ data.returnRequestNo }}
                    </RouterLink>
                </template>
            </Column>

            <Column field="custAccountNo" header="Acc No." style="min-width: 8rem">
                <template #body="{ data }">
                    {{ data.custAccountNo }}
                </template>
            </Column>

            <Column field="customerName" header="Requester Name" style="min-width: 8rem">
                <template #body="{ data }">
                    {{ data.customerName }}
                </template>
            </Column>
            
            <Column field="reasonCode" header="Reason Code" style="min-width: 8rem">
                <template #body="{ data }">
                    {{ data.reasonCode || 'N/A' }}
                </template>
            </Column>
            
            <Column field="reasonMessage" header="Reason Message" style="min-width: 8rem">
                <template #body="{ data }">
                    {{ data.reasonMessage || 'N/A' }}
                </template>
            </Column>

            <Column field="createdDate" header="Date" style="min-width: 8rem">
                <template #body="{ data }">
                    {{ formatDate(data.createdDate) }}
                </template>
            </Column>

            <Column field="orderStatus" header="Status" style="min-width: 8rem">
                <template #body="{ data }">
                    <Tag :value="getOverallStatusLabel(data.orderStatus)" :severity="getOverallStatusSeverity(data.orderStatus)" />
                </template>
            </Column>
        </DataTable>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { FilterMatchMode } from '@primevue/core/api';
import api from '@/service/api';
import LoadingPage from '@/components/LoadingPage.vue';

// Data variables
const listData = ref([]);
const loading = ref(true);

// Filters for quick search
const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});

// Status map for cleaner handling
const STATUS_MAP = {
    0: { label: 'Pending Approval', severity: 'warning' },
    1: { label: 'Approved', severity: 'info' },
    2: { label: 'Processing', severity: 'success' },
    3: { label: 'Completed', severity: 'primary' }
};


const getOverallStatusSeverity = (status) => {
    return STATUS_MAP[Number(status)]?.severity || 'danger';
};

const getOverallStatusLabel = (status) => {
    return STATUS_MAP[Number(status)]?.label || 'Unknown';
};

// Format date as ISO string (YYYY-MM-DD)
const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    try {
        const date = new Date(dateStr);
        return date.toISOString().split('T')[0]; // keeps only YYYY-MM-DD
    } catch (error) {
        console.error('Error formatting date:', dateStr, error);
        return '-';
    }
};


onMounted(async () => {
    try {
        loading.value = true;
        const response = await api.get('order/list-return-order');

        console.log('API Response:', response.data);

        if (response.data.status === 'PENDING' && Array.isArray(response.data.admin_data)) {
            // Map the API data to our frontend structure
            listData.value = response.data.admin_data.map(returnOrder => {
                return {
                    id: returnOrder.id,
                    returnRequestNo: returnOrder.return_orderNo_ref || 'N/A',
                    custAccountNo: returnOrder.custaccountno || 'N/A',
                    customerName: returnOrder.dealerName || 'N/A',
                    reasonCode: returnOrder.reason_code,
                    reasonMessage: returnOrder.reason_message,
                    createdDate: returnOrder.created,
                    orderStatus: returnOrder.orderstatus
                };
            });
            
            console.log('Mapped data:', listData.value);
        } else {
            console.error('API returned error or invalid data:', response.data);
            listData.value = [];
        }
    } catch (error) {
        console.error('Error fetching return order list:', error);
        listData.value = [];
    } finally {
        loading.value = false;
    }
});
</script>

<style scoped lang="scss">
:deep(.p-datatable-frozen-tbody) {
    font-weight: bold;
}

:deep(.p-datatable-scrollable .p-frozen-column) {
    font-weight: bold;
}
</style>