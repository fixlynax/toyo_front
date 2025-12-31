<template>
    <div class="card flex flex-col w-full">
        <div class="text-2xl font-bold text-gray-800 border-b pb-2">📦 List Back Order</div>
        <TabMenu :model="statusTabs" v-model:activeIndex="activeTabIndex" class="mb-6" />

        <!-- 🟢 Only show LoadingPage during initial load, hide DataTable completely -->
        <LoadingPage v-if="loading" :sub-message="'Fetching your Back Order list'" class="min-h-[720px]" />

        <!-- 🟢 Only show DataTable when NOT loading -->
        <DataTable
            v-if="!loading"
            :value="filteredList"
            :paginator="true"
            :rows="10"
            :rowsPerPageOptions="[10, 20, 50, 100 ]"
            dataKey="id"
            :rowHover="true"
            :filters="filters"
            filterDisplay="menu"
            :globalFilterFields="['orderNo', 'expiry', 'custAccountNo', 'customerName', 'deliveryType', 'orderDate']"
            responsiveLayout="scroll"
            stripedRows
            sortField="created"
            :sortOrder="-1"
            class="rounded-table"
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
                </div>
            </template>

            <template #empty> No back orders found. </template>
            <!-- Removed #loading template since we're using external LoadingPage -->
            <Column field="createdDate" header="Created Date" style="min-width: 8rem">
                <template #body="{ data }">
                    {{ formatDate(data.created) }}
                </template>
            </Column>
            <Column field="orderNo" header="Order No." style="min-width: 10rem">
                <template #body="{ data }">
                    <RouterLink :to="`/scm/detailSCMBackOrder/${data.orderNo}`" class="hover:underline font-bold text-primary-400">
                        {{ data.orderNo }}
                    </RouterLink>
                </template>
            </Column>

            <Column field="customerName" header="Customer Name" style="min-width: 10rem">
                <template #body="{ data }">
                   <span class="font-bold">{{ data.customerName }}</span>
                    <br>
                     {{ data.custAccountNo }}
                </template>
            </Column>
            <Column field="deliveryType" header="Delivery" style="min-width: 10rem" />

            <Column field="orderDate" header="Order Date" style="min-width: 8rem">
                <template #body="{ data }">
                    {{ formatDate(data.orderDate) }}
                </template>
            </Column>

            <Column field="shipTo" header="Ship To Acc No." style="min-width: 8rem" />

            <Column field="expiry" header="Back Order Expiry" style="min-width: 10rem">
                <template #body="{ data }">
                    {{ formatDate(data.expiry) }}
                </template>
            </Column>

            <Column field="orderStatus" header="Status" style="min-width: 8rem; text-align: center">
                <template #body="{ data }">
                    <Tag :value="getStatusLabel(data.orderStatus)" :severity="getStatusSeverity(data.orderStatus)" />
                </template>
            </Column>

            <Column field="progress" header="Progress" style="min-width: 10rem">
                <template #body="{ data }">
                    <div class="flex items-center gap-2">
                        <ProgressBar :value="data.progress" class="w-full" :showValue="false" :class="getProgressBarClass(data.progress)" />
                        <span class="text-sm font-semibold">{{ data.progress }}%</span>
                    </div>
                </template>
            </Column>
        </DataTable>
    </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import { FilterMatchMode } from '@primevue/core/api';
import api from '@/service/api';
import { RouterLink } from 'vue-router';
import LoadingPage from '@/components/LoadingPage.vue';

const listData = ref([]);
const filteredList = ref([]);
const loading = ref(true);
const activeTabIndex = ref(0);

const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});

const statusTabs = [
    { label: 'Pending', status: 0, type: 'PENDING' },
    { label: 'Completed', status: 1, type: 'COMPLETED' },
    { label: 'Cancelled', status: 2, type: 'CANCELLED' },
    { label: 'Expired', status: 3, type: 'EXPIRED' }
];
const fetchBackOrders = async () => {
    try {
        const formData = new FormData();
        const selectedType = statusTabs[activeTabIndex.value].type;

        // Append all form fields
        formData.append('type', selectedType);
        loading.value = true;
        const response = await api.post('order/list-back-order', formData);

        if (response.data.status === 1 && response.data.admin_data) {
            const adminData = response.data.admin_data;
            adminData.sort((a, b) => new Date(b.created) - new Date(a.created));
            listData.value = adminData.map((order) => ({
                id: order.id,
                orderNo: order.bo_orderno || '-',
                custAccountNo: order.custaccountno,
                customerName: order.dealerName,
                deliveryType: order.deliveryType || '-',
                orderDate: order.created,
                shipTo: order.shipto || order.custaccountno,
                expiry: order.expiry,
                created: order.created,
                orderStatus: order.orderstatus,
                progress: calculateProgress(order),
                status: order.status
            }));

            filterByTab(); // Initial filter
        } else {
            listData.value = [];
            filteredList.value = [];
        }
    } catch (error) {
        console.error('Error fetching back order list:', error);
        listData.value = [];
        filteredList.value = [];
    } finally {
        loading.value = false;
    }
}
onMounted(async () => {
    fetchBackOrders();
});

watch(activeTabIndex, () => {
    fetchBackOrders();
});

const filterByTab = () => {
    const selected = statusTabs[activeTabIndex.value];
    if (!selected) {
        filteredList.value = listData.value;
        return;
    }
    filteredList.value = listData.value.filter((item) => item.orderStatus == selected.status);
};

const calculateProgress = (order) => {
    try {
        if (order.fullfill_percentage !== null && order.fullfill_percentage !== undefined) {
            const progress = parseInt(order.fullfill_percentage);
            return isNaN(progress) ? 0 : Math.min(100, Math.max(0, progress));
        }

        if (order.backorder_array && order.remaining_array) {
            const backorderItems = Array.isArray(order.backorder_array) ? order.backorder_array : JSON.parse(order.backorder_array);
            const remainingItems = Array.isArray(order.remaining_array) ? order.remaining_array : JSON.parse(order.remaining_array);

            if (Array.isArray(backorderItems) && Array.isArray(remainingItems)) {
                const totalOrdered = backorderItems.reduce((sum, item) => sum + parseInt(item.qty || 0), 0);
                const totalRemaining = remainingItems.reduce((sum, item) => sum + parseInt(item.qty || 0), 0);

                if (totalOrdered > 0) {
                    const fulfilled = totalOrdered - totalRemaining;
                    const progress = Math.round((fulfilled / totalOrdered) * 100);
                    return Math.min(100, Math.max(0, progress));
                }
            }
        }

        return 0;
    } catch (error) {
        console.error('Error calculating progress:', error);
        return 0;
    }
};

const getProgressBarClass = (progress) => {
    if (progress <= 40) return 'progress-low';
    if (progress <= 60) return 'progress-fair';
    if (progress < 100) return 'progress-good';
    return 'progress-excellent';
};

const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch (error) {
        return dateString;
    }
};

const getStatusLabel = (status) => {
    switch (status) {
        case 0:
            return 'Pending';
        case 1:
            return 'Completed';
        default:
            return 'Unknown';
    }
};

const getStatusSeverity = (status) => {
    switch (status) {
        case 0:
            return 'info';
        case 1:
            return 'success';
        default:
            return 'contrast';
    }
};
</script>

<style scoped lang="scss">
:deep(.p-progressbar) {
    height: 0.8rem;
    border-radius: 9999px;
    background-color: #f3f4f6; // Neutral background
    box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.08);
    overflow: hidden;

    .p-progressbar-value {
        border-radius: 9999px;
        transition:
            width 0.4s ease,
            background 0.4s ease;
    }

    // 🔴 Low: 0–40%
    &.progress-low {
        .p-progressbar-value {
            background: linear-gradient(90deg, #f87171);
            box-shadow: 0 0 6px rgba(239, 68, 68, 0.3);
        }
    }

    // 🟠 Fair: 41–60%
    &.progress-fair {
        .p-progressbar-value {
            background: linear-gradient(90deg, #fb923c);
            box-shadow: 0 0 6px rgba(251, 146, 60, 0.3);
        }
    }

    // 🟡 Good: 61–99%
    &.progress-good {
        .p-progressbar-value {
            background: linear-gradient(90deg, #fde047);
            box-shadow: 0 0 6px rgba(250, 204, 21, 0.3);
        }
    }

    // 🟢 Excellent: 100%
    &.progress-excellent {
        .p-progressbar-value {
            background: linear-gradient(90deg, #34d399);
            box-shadow: 0 0 6px rgba(52, 211, 153, 0.4);
        }
    }
}

:deep(.p-datatable-frozen-tbody) {
    font-weight: bold;
}

:deep(.p-datatable-scrollable .p-frozen-column) {
    font-weight: bold;
}

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
