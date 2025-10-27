<template>
    <div class="card flex flex-col w-full">
        <div class="text-2xl font-bold text-gray-800 border-b pb-2">📦 List Back Order</div>

        <DataTable
            :value="listData"
            :paginator="true"
            :rows="10"
            :rowsPerPageOptions="[5, 10, 20]"
            dataKey="id"
            :rowHover="true"
            :loading="loading"
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
            <template #loading> Loading back orders data. Please wait. </template>

            <Column field="OrderNo" header="Order No." style="min-width: 10rem">
                <template #body="{ data }">
                    <RouterLink to="/om/detailBackOrder" class="hover:underline font-bold text-black-600">
                        {{ data.custAccountNo }}
                    </RouterLink>
                </template>
            </Column>
            <Column field="custAccountNo" header="Dealer Acc No" style="min-width: 10rem">
                <template #body="{ data }">
                        {{ data.custAccountNo }}
                </template>
            </Column>

            <Column field="customerName" header="Dealer Name" style="min-width: 10rem">
                <template #body="{ data }">
                    {{ data.customerName }}
                </template>
            </Column>
            <!-- <Column field="customerName" header="Order Type" style="min-width: 10rem">
                <template #body="{ data }">
                    {{ data.orderType }}
                </template>
            </Column> -->
            <Column field="customerName" header="Delivery" style="min-width: 10rem">
                <template #body="{ data }">
                    {{ data.deliveryType }}
                </template>
            </Column>

            <Column field="deliveryDate" header="Order Date" style="min-width: 8rem">
                <template #body="{ data }">
                    {{ data.deliveryDate }}
                </template>
            </Column>

            <Column field="deliveryDate" header="Ship To Acc No." style="min-width: 8rem">
                <template #body="{ data }">
                    {{ data.shipTo }}
                </template>
            </Column>

            <Column field="deliveryDate" header="Delivery Date" style="min-width: 8rem">
                <template #body="{ data }">
                    {{ data.deliveryDate }}
                </template>
            </Column>

            <Column field="expiry" header="Back Order Expiry" style="min-width: 10rem">
                <template #body="{ data }">
                    {{ data.expiry }}
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
                        <ProgressBar :value="data.progress" class="w-full" :showValue="false" />
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
import { ListBackOrderService } from '@/service/ListBackOrder';
import ProgressBar from 'primevue/progressbar';
import Tag from 'primevue/tag';
import { RouterLink } from 'vue-router';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';

const listData = ref([]);
const loading = ref(true);
const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});

onMounted(async () => {
    loading.value = true;
    listData.value = await ListBackOrderService.getListBackOrderData();
    loading.value = false;
});

const getStatusLabel = (status) => {
    switch (status) {
        case 1:
            return 'Pending';
        case 2:
            return 'Expired';
        case 3:
            return 'Cancelled';
        case 4:
            return 'Completed';
        default:
            return 'Unknown';
    }
};

const getStatusSeverity = (status) => {
    switch (status) {
        case 1:
            return 'warn';
        case 2:
            return 'danger';
        case 3:
            return 'secondary';
        case 4:
            return 'success';
        default:
            return 'info';
    }
};
</script>

<style scoped lang="scss">
:deep(.p-progressbar) {
    height: 0.75rem;
}
</style>
