<script setup>
import api from '@/service/api';
import { FilterMatchMode, FilterOperator } from '@primevue/core/api';
import { onBeforeMount, ref, computed } from 'vue';
import { RouterLink } from 'vue-router';

// PrimeVue Components
import TabMenu from 'primevue/tabmenu';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Tag from 'primevue/tag';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';

// 🟢 State variables
const filters1 = ref({});
const listData = ref([]);
const loading = ref(true);

// 🟢 Initialize filters
function initFilters1() {
    filters1.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] }
    };
}

// 🟢 Status Map
const statusMap = {
    0: { label: 'Pending', severity: 'warning' },
    66: { label: 'Processing', severity: 'info' },
    77: { label: 'Delivery', severity: 'secondary' },
    1: { label: 'Completed', severity: 'success' },
    99: { label: 'Return Order', severity: 'danger' }
};

// 🟢 Tab setup
const statusTabs = [
    { label: 'All', status: null },
    { label: 'Pending', status: 0 },
    { label: 'Processing', status: 66 },
    { label: 'Delivery', status: 77 },
    { label: 'Completed', status: 1 }
];
const activeTabIndex = ref(0);

// 🟢 Fetch data
onBeforeMount(async () => {
    try {
        initFilters1();
        loading.value = true;
        const response = await api.get('order/list-order');

        console.log('API Response:', response.data);

        // FIX: Check for status === 1 (success) instead of 0
        if (response.data.status === 1 && Array.isArray(response.data.admin_data)) {
            // Transform the API data to match frontend expectations
            listData.value = response.data.admin_data.map(order => ({
                id: order.id,
                orderNo: order.order_no,
                custAccountNo: order.custaccountno,
                // FIX: Use dealerName from API response
                companyName: order.dealerName ,
                sapOrderType: order.sapordertype,
                orderType: order.orderDesc,
                deliveryType: order.deliveryType,
                shipToAccountNo: order.shiptoCustAccNo ,
                deliveryDate: order.deliveryDate,
                soNo: order.so_no,
                doNo: order.do_no,
                invoiceNo: order.inv_no,
                orderStatus: order.orderstatus,
                subtotal: order.subtotal,
                total: order.total,
                orderArray: order.order_array
            }));
            
            console.log('Transformed data:', listData.value);
        } else {
            console.error('API returned error or invalid data:', response.data);
            listData.value = [];
        }
    } catch (error) {
        console.error('Error fetching order list:', error);
        listData.value = [];
    } finally {
        loading.value = false;
    }
});

// 🟢 Helper functions for data mapping
function mapOrderType(sapOrderType) {
    const typeMap = {
        'ZRP1': 0, // Normal
        'ZDS1': 1, // DS
        'ZOU1': 2  // Own-use
    };
    return typeMap[sapOrderType] ?? 0; // Default to Normal
}

function mapDeliveryMethod(deliveryType) {
    if (!deliveryType) return 0; // Default to Deliver
    return deliveryType.toLowerCase() === 'deliver' ? 0 : 1;
}

// 🟢 Filtered Data (based on selected tab)
const filteredOrders = computed(() => {
    const selectedStatus = statusTabs[activeTabIndex.value]?.status;
    // FIX: Handle null/undefined properly for "All" tab
    if (selectedStatus === null || selectedStatus === undefined) {
        return listData.value;
    }
    return listData.value.filter((order) => order.orderStatus === selectedStatus);
});

// 🟢 Format date for display
const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    } catch {
        return dateString;
    }
};
</script>

<template>
    <div class="card">
        <div class="text-2xl font-bold text-gray-800 border-b pb-2">List Order</div>

        <!-- 🟢 Status Tab Menu -->
        <TabMenu :model="statusTabs" v-model:activeIndex="activeTabIndex" class="mb-4" />

        <!-- 🟢 DataTable -->
        <DataTable 
            :value="filteredOrders" 
            :paginator="true" 
            :rows="10" 
            dataKey="id" 
            :rowHover="true" 
            :loading="loading" 
            :filters="filters1" 
            filterDisplay="menu"
            :globalFilterFields="['orderNo', 'custAccountNo', 'companyName', 'shipToAccountNo']"
        >
            <!-- 🟢 Header -->
            <template #header>
                <div class="flex items-center justify-between gap-4 w-full flex-wrap">
                    <!-- Search -->
                    <div class="flex items-center gap-2 w-full max-w-md">
                        <IconField class="flex-1">
                            <InputIcon>
                                <i class="pi pi-search" />
                            </InputIcon>
                            <InputText 
                                v-model="filters1['global'].value" 
                                placeholder="Quick Search" 
                                class="w-full" 
                            />
                        </IconField>
                        <Button type="button" icon="pi pi-cog" class="p-button" />
                    </div>
                </div>
            </template>

            <template #empty> 
                <div class="text-center py-4 text-gray-500">
                    No orders found.
                </div>
            </template>
            <template #loading> 
                <div class="text-center py-4">
                    Loading orders data. Please wait.
                </div>
            </template>

            <!-- 🟢 Order Info -->
            <Column header="Order No" style="min-width: 6rem">
                <template #body="{ data }">
                    <RouterLink 
                        :to="`/om/detailOrder/${data.id}`" 
                        class="hover:underline font-bold text-blue-600"
                    >
                        {{ data.orderNo || '-' }}
                    </RouterLink>
                </template>
            </Column>

            <!-- Dealer Info -->
            <Column field="custAccountNo" header="Dealer Acc No" style="min-width: 6rem">
                <template #body="{ data }">
                    {{ data.custAccountNo || '-' }}
                </template>
            </Column>
            <Column field="companyName" header="Dealer Name" style="min-width: 10rem">
                <template #body="{ data }">
                    {{ data.companyName || '-' }}
                </template>
            </Column>

            <!-- 🟢 Order Type -->
            <Column field="orderType" header="Order Type" style="min-width: 7rem">
                <template #body="{ data }">
                    <span v-if="data.orderType === 0">Normal</span>
                    <span v-else-if="data.orderType === 1">DS</span>
                    <span v-else-if="data.orderType === 2">Own-use</span>
                    <span v-else>{{ data.orderDesc || data.sapOrderType || '-' }}</span>
                </template>
            </Column>

            <!-- 🟢 Delivery Method -->
            <Column field="deliveryMethod" header="Delivery" style="min-width: 7rem">
                <template #body="{ data }">
                    <span v-if="data.deliveryMethod === 0">Deliver</span>
                    <span v-else-if="data.deliveryMethod === 1">Pickup</span>
                    <span v-else>{{ data.deliveryType || '-' }}</span>
                </template>
            </Column>

            <!-- 🟢 Ship To Account -->
            <Column field="shipToAccountNo" header="Ship To Acc No" style="min-width: 8rem">
                <template #body="{ data }">
                    {{ data.shipToAccountNo || data.custAccountNo || '-' }}
                </template>
            </Column>

            <!-- 🟢 Delivery Date -->
            <Column header="Delivery Date" style="min-width: 8rem">
                <template #body="{ data }">
                    {{ formatDate(data.deliveryDate) }}
                </template>
            </Column>

            <!-- 🟢 SO / DO / Invoice -->
            <Column header="SAP Ref" style="min-width: 10rem">
                <template #body="{ data }">
                    <div class="flex flex-col text-sm">
                        <span v-if="data.orderStatus === 66 || data.orderStatus === 77 || data.orderStatus === 0">
                            SO: <strong>{{ data.soNo || '-' }}</strong> | DO: <strong>{{ data.doNo || '-' }}</strong>
                        </span>
                        <span v-else-if="data.orderStatus === 1">
                            Invoice: <strong>{{ data.invoiceNo || '-' }}</strong>
                        </span>
                        <span v-else-if="data.orderStatus === 99"> 
                            <strong>Return Order</strong>
                        </span>
                        <span v-else>-</span>
                    </div>
                </template>
            </Column>

            <!-- 🟢 Status -->
            <Column header="Status" style="min-width: 6rem">
                <template #body="{ data }">
                    <Tag 
                        :value="statusMap[data.orderStatus]?.label || 'Unknown'" 
                        :severity="statusMap[data.orderStatus]?.severity || 'danger'" 
                    />
                </template>
            </Column>

            <!-- 🟢 Total Amount -->
            <Column header="Total" style="min-width: 8rem">
                <template #body="{ data }">
                    <span v-if="data.total">${{ parseFloat(data.total).toFixed(2) }}</span>
                    <span v-else>-</span>
                </template>
            </Column>
        </DataTable>
    </div>
</template>

<style scoped lang="scss">
:deep(.p-datatable-frozen-tbody) {
    font-weight: bold;
}

:deep(.p-datatable-scrollable .p-frozen-column) {
    font-weight: bold;
}

:deep(.p-tabmenu .p-tabmenu-nav .p-tabmenuitem.p-highlight .p-menuitem-link) {
    border-color: #3B82F6;
}

:deep(.p-datatable .p-datatable-thead > tr > th) {
    background-color: #f8fafc;
    font-weight: 600;
}
</style>