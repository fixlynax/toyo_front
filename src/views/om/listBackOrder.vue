<template>
    <div class="card flex flex-col w-full">
        <div class="text-2xl font-bold text-gray-800 border-b pb-2">📦 List Back Order</div>

        <LoadingPage v-if="loading" :sub-message="'Loading Catalogue Item'" class="min-h-[720px]" />

        <LoadingPage v-if="loading" :sub-message="'Loading Catalogue Item'" class="min-h-[720px]" />

        <!-- 🟢 Only show LoadingPage during initial load, hide DataTable completely -->
        <LoadingPage v-if="loading" :message="'Loading Back Orders...'" :sub-message="'Fetching your Back Order list'" />

        <!-- 🟢 Only show DataTable when NOT loading -->
        <DataTable
            v-if="!loading"
            :value="listData"
            :paginator="true"
            :rows="10"
            :rowsPerPageOptions="[5, 10, 20]"
            dataKey="id"
            :rowHover="true"
            :filters="filters"
            filterDisplay="menu"
            :globalFilterFields="['custAccountNo', 'customerName', 'deliveryDate', 'expiry', 'orderStatus']"
            responsiveLayout="scroll"
            stripedRows
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

            <Column field="orderNo" header="Order No." style="min-width: 10rem">
                <template #body="{ data }">
                    <RouterLink :to="`/om/detailBackOrder/${data.id}`" class="hover:underline font-bold text-black-600">
                        {{ data.orderNo }}
                    </RouterLink>
                </template>
            </Column>

            <Column field="custAccountNo" header="Dealer Acc No" style="min-width: 10rem" />
            <Column field="customerName" header="Dealer Name" style="min-width: 10rem" />
            <Column field="deliveryType" header="Delivery" style="min-width: 10rem" />

            <Column field="orderDate" header="Order Date" style="min-width: 8rem">
                <template #body="{ data }">
                    {{ formatDate(data.orderDate) }}
                </template>
            </Column>

            <Column field="shipTo" header="Ship To Acc No." style="min-width: 8rem" />

            <Column field="deliveryDate" header="Delivery Date" style="min-width: 8rem">
                <template #body="{ data }">
                    {{ formatDate(data.deliveryDate) }}
                </template>
            </Column>

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
import { onMounted, ref } from 'vue';
import { FilterMatchMode } from '@primevue/core/api';
import api from '@/service/api';
import ProgressBar from 'primevue/progressbar';
import Tag from 'primevue/tag';
import { RouterLink } from 'vue-router';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import LoadingPage from '@/components/LoadingPage.vue';

const listData = ref([]);
const loading = ref(true);
const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});

onMounted(async () => {
    try {
        loading.value = true;
        const response = await api.get('order/list-back-order');

        console.log('API Response:', response.data);

        if (response.data.status === 1 && response.data.admin_data) {
            const adminData = response.data.admin_data;

            listData.value = adminData.map((order) => {
                // Calculate progress percentage
                const progress = calculateProgress(order);

                return {
                    id: order.id,
                    orderNo: order.bo_orderno || '-',
                    custAccountNo: order.custaccountno,
                    customerName: order.dealerName,
                    customerName: order.dealerName,
                    deliveryType: order.deliveryType || '-',
                    orderDate: order.created,
                    shipTo: order.shipto || order.custaccountno,
                    deliveryDate: order.deliveryDate,
                    expiry: order.expiry,
                    orderStatus: order.orderstatus,
                    progress: order.fullfill_percentage,
                    status: order.status
                };
            });
        } else {
            console.error('API returned error or invalid data:', response.data);
            listData.value = [];
        }
    } catch (error) {
        console.error('Error fetching back order list:', error);
        listData.value = [];
    } finally {
        loading.value = false;
    }
});

const calculateProgress = (order) => {
    try {
        // Use fullfill_percentage if available
        if (order.fullfill_percentage !== null && order.fullfill_percentage !== undefined) {
            const progress = parseInt(order.fullfill_percentage);
            return isNaN(progress) ? 0 : Math.min(100, Math.max(0, progress)); // Ensure between 0-100
        }

        // Calculate from backorder_array and remaining_array
        if (order.backorder_array && order.remaining_array) {
            const backorderItems = Array.isArray(order.backorder_array) ? order.backorder_array : JSON.parse(order.backorder_array);

            const remainingItems = Array.isArray(order.remaining_array) ? order.remaining_array : JSON.parse(order.remaining_array);

            if (Array.isArray(backorderItems) && Array.isArray(remainingItems)) {
                const totalOrdered = backorderItems.reduce((sum, item) => sum + parseInt(item.qty || 0), 0);
                const totalRemaining = remainingItems.reduce((sum, item) => sum + parseInt(item.qty || 0), 0);

                if (totalOrdered > 0) {
                    const fulfilled = totalOrdered - totalRemaining;
                    const progress = Math.round((fulfilled / totalOrdered) * 100);
                    return Math.min(100, Math.max(0, progress)); // Ensure between 0-100
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
    if (progress < 25) {
        return 'progress-low'; // Red for <25%
    } else if (progress < 75) {
        return 'progress-medium'; // Yellow/Orange for <75%
    } else {
        return 'progress-high'; // Green for >=75%
    }
};

const formatDate = (dateString) => {
    if (!dateString) return '-';

    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
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
            return 'warn';
        case 1:
            return 'success';
        default:
            return 'secondary';
    }
};
</script>

<style scoped lang="scss">
:deep(.p-progressbar) {
    height: 0.75rem;

    &.progress-low {
        .p-progressbar-value {
            background: linear-gradient(90deg, #ef4444, #dc2626) !important; // Red gradient
        }
    }

    &.progress-medium {
        .p-progressbar-value {
            background: linear-gradient(90deg, #f59e0b, #d97706) !important; // Amber/Orange gradient
        }
    }

    &.progress-high {
        .p-progressbar-value {
            background: linear-gradient(90deg, #10b981, #059669) !important; // Green gradient
        }
    }
}
</style>
