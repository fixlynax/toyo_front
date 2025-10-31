<script setup>
import api from '@/service/api';
import { FilterMatchMode, FilterOperator } from '@primevue/core/api';
import { onBeforeMount, ref, computed, watch } from 'vue';
import { RouterLink } from 'vue-router';
import LoadingPage from '@/components/LoadingPage.vue';

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

// 🟢 Tab setup - Added "All" tab and fixed status mapping
const statusTabs = [
    { label: 'Pending', status: 0 },
    { label: 'Processing', status: 66 },
    { label: 'Delivery', status: 77 },
    { label: 'Completed', status: 1 }
];
const activeTabIndex = ref(0); // Fixed: Start with first tab (Pending)

// 🟢 Fetch data function
const fetchOrders = async (status = null) => {
    try {
        loading.value = true;

        // Map frontend status to backend status labels
        const statusMapping = {
            0: 'PENDING',
            66: 'PROCESSING',
            77: 'DELIVERY',
            1: 'COMPLETE',
        };

        const tabs = statusMapping[status] || 'PENDING';

        const response = await api.post('order/list-order', { tabs });

        console.log('API Response:', response.data);

        if (response.data.status === 1 && Array.isArray(response.data.admin_data)) {
            // Transform the API data to match frontend expectations
            listData.value = response.data.admin_data.map((order) => ({
                id: order.id,
                orderNo: order.order_no,
                custAccountNo: order.custaccountno,
                companyName: order.dealerName || `${order.companyName1 || ''} ${order.companyName2 || ''}`.trim(),
                sapOrderType: order.sapordertype,
                orderType: order.orderDesc,
                deliveryType: order.deliveryType,
                shipToAccountNo: order.shiptoCustAccNo,
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
};

// 🟢 Watch for tab changes and fetch data
watch(activeTabIndex, (newIndex) => {
    const selectedStatus = statusTabs[newIndex]?.status;
    fetchOrders(selectedStatus);
});

// 🟢 Initial data fetch
onBeforeMount(async () => {
    initFilters1();
    const selectedStatus = statusTabs[activeTabIndex.value]?.status;
    await fetchOrders(selectedStatus);
});

// 🟢 Helper functions for data mapping
function mapOrderType(sapOrderType) {
    const typeMap = {
        ZRP1: 0, // Normal
        ZDS1: 1, // DS
        ZOU1: 2 // Own-use
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

    // For specific status tabs, filter the data
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

        <!-- 🟢 Use LoadingPage for initial load, hide everything else -->
        <LoadingPage v-if="loading" :message="'Loading Orders...'" :sub-message="'Fetching your order list'" />

        <!-- 🟢 Content only shows when not loading -->
        <div v-else>
            <!-- 🟢 Status Tab Menu -->
            <TabMenu :model="statusTabs" v-model:activeIndex="activeTabIndex" class="mb-4" />

            <!-- 🟢 DataTable without loading prop -->
            <DataTable 
                :value="filteredOrders" 
                :paginator="true" 
                :rows="10" 
                dataKey="id" 
                :rowHover="true" 
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
                                <InputText v-model="filters1['global'].value" placeholder="Quick Search" class="w-full" />
                            </IconField>
                            <Button type="button" icon="pi pi-cog" class="p-button" />
                        </div>
                    </div>
                </template>

                <template #empty>
                    <div class="text-center py-4 text-gray-500">No orders found.</div>
                </template>

                <!-- 🟢 Order Info -->
                <Column header="Order No" style="min-width: 6rem">
                    <template #body="{ data }">
                        <RouterLink :to="`/om/detailOrder/${data.id}`" class="hover:underline font-bold text-blue-600">
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
                        {{ data.companyName1 || '-' }}
                    </template>
                </Column>

                <!-- 🟢 Order Type -->
                <Column field="orderType" header="Order Type" style="min-width: 7rem">
                    <template #body="{ data }">
                        <span v-if="data.orderType === 'NORMAL'">Normal</span>
                        <span v-else-if="data.orderType === 'DS'">DS</span>
                        <span v-else-if="data.orderType === 'OWN-USE'">Own-use</span>
                        <span v-else>{{ data.orderType || data.sapOrderType || '-' }}</span>
                    </template>
                </Column>

                <!-- 🟢 Delivery Method -->
                <Column field="deliveryType" header="Delivery" style="min-width: 7rem">
                    <template #body="{ data }">
                        <span v-if="data.deliveryType === 'DELIVER'">Deliver</span>
                        <span v-else-if="data.deliveryType === 'PICKUP'">Pickup</span>
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
                        <Tag :value="statusMap[data.orderStatus]?.label || 'Unknown'" :severity="statusMap[data.orderStatus]?.severity || 'danger'" />
                    </template>
                </Column>

                <!-- 🟢 Total Amount -->
                <Column header="Total" style="min-width: 8rem">
                    <template #body="{ data }">
                        <span v-if="data.total">RM {{ parseFloat(data.total).toFixed(2) }}</span>
                        <span v-else>-</span>
                    </template>
                </Column>
            </DataTable>
        </div>
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
    border-color: #3b82f6;
}

:deep(.p-datatable .p-datatable-thead > tr > th) {
    background-color: #f8fafc;
    font-weight: 600;
}
</style>