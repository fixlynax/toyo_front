<template>
    <div class="card">
        <div class="text-2xl font-bold text-gray-800 border-b pb-2">Return Order List</div>
        <DataTable 
            :value="returnList"
            :paginator="true"
            :rows="10"
            :rowsPerPageOptions="[5, 10, 20]"
            dataKey="materialid"
            :rowHover="true"
            :loading="loading"
            :filters="filters"
            filterDisplay="menu"
            :globalFilterFields="['return_orderNo_ref', 'custAccountNo', 'companyName1' , 'companyName2' , 'companyName3' , 'companyName4', 'created']">
            <template #header>
                <div class="flex flex-col gap-4 w-full">
                    <!-- Search and Filters Row -->
                    <div class="flex items-center justify-between gap-4 w-full flex-wrap">
                        <!-- Left: Search Field -->
                        <div class="flex items-center gap-2 w-full max-w-md">
                            <IconField class="flex-1">
                                <InputIcon>
                                    <i class="pi pi-search" />
                                </InputIcon>
                                <InputText v-model="filters['global'].value" placeholder="Quick Search" class="w-full" />
                            </IconField>
                            
                            <Button type="button" icon="pi pi-cog" @click="sortMenu.toggle($event)" />
                            <Menu ref="sortMenu" :model="sortItems" :popup="true" />
                        </div>
                        <div class="flex justify-end gap-2">
                            <Button type="button" label="Export" icon="pi pi-download" class="p-button-success" />
                            <Button type="button" label="Bulk" icon="pi pi-upload" />
                        </div>
                    </div>
                </div>
            </template>

            <template #empty> No return orders found. </template>
            <template #loading> Loading return orders data. Please wait. </template>

            <!-- Columns -->
             <Column field="deliveryDate" header="Ref No" dataType="date" style="min-width: 8rem">
                <template #body="{ data }">
                    <RouterLink :to="`/scm/detailReturnOrder/${data.id}`" class="hover:underline font-bold text-primary-400">
                    {{ data.return_orderNo_ref }}
                    </RouterLink>
                </template>
            </Column>
            <Column field="deliveryDate" header="Dealer Name" dataType="date" style="min-width: 8rem">
                <template #body="{ data }">
                    {{ data.return_orderNo_ref }}
                </template>
            </Column>
            <Column field="returnRequestNo" header="Customer Acc No" style="min-width: 10rem">
                <template #body="{ data }">
                    {{ data.custAccountNo }}
                </template>
            </Column>
            <Column field="deliveryDate" header="Company Name" dataType="date" style="min-width: 8rem">
                <template #body="{ data }">
                    {{ `${data.companyName1} ${data.companyName2} ${data.companyName3} ${data.companyName4}` }}
                </template>
            </Column>
            <Column field="size" header="Return Items" style="min-width: 12rem">
                <template #body="{ data }">
                        {{ data.return_order_array.length }}
                </template>
            </Column>
            <Column header="Status" style="min-width: 8rem">
                <template #body="{ data }">
                    <Tag :value="getStatusLabel(data.orderstatus)" :severity="getStatusSeverity(data.orderstatus)" />
                </template>
            </Column>
        </DataTable>
    </div>
</template>

<script setup>
import { ref, onMounted, computed, onBeforeMount } from 'vue';
import { ListReturnOrderService } from '@/service/listReturnOrder';
import { FilterMatchMode } from '@primevue/core/api';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import IconField from 'primevue/iconfield';
import InputText from 'primevue/inputtext';
import InputIcon from 'primevue/inputicon';
import Tag from 'primevue/tag';
import api from '@/service/api';

const returnList = ref([]);
const loading = ref(true);


// Filters for quick search
const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});

const sortMenu = ref();
            // :globalFilterFields="['return_orderNo_ref', 'custAccountNo', 'companyName1', 'created']">
const sortItems = ref([
    {
        label: 'Sort by Ref No (A-Z)',
        icon: 'pi pi-sort-alpha-down',
        command: () => sortBy('return_orderNo_ref', 'asc')
    },
    {
        label: 'Sort by Ref No (Z-A)',
        icon: 'pi pi-sort-alpha-up',
        command: () => sortBy('return_orderNo_ref', 'desc')
    },
    {
        label: 'Sort by Cust Acc No (A-Z)',
        icon: 'pi pi-tag',
        command: () => sortBy('custAccountNo', 'asc')
    },
    {
        label: 'Sort by Company Name',
        icon: 'pi pi-globe',
        command: () => sortBy('companyName1', 'asc')
    },
    {
        label: 'Sort by Status',
        icon: 'pi pi-check-circle',
        command: () => sortBy('orderstatus', 'asc')
    }
]);

const statusOptions = [
    { label: 'Pending', value: 0 },
    { label: 'Completed', value: 1 },
    { label: 'Processing', value: 66 },
    { label: 'Delivery', value: 77 }
];


const fetchData = async () => {
    try {
        loading.value = true;
        const response = await api.get('scm-return-order-list');
        console.log('API Response:', response.data);
        if (response.data.status === 1 && Array.isArray(response.data.admin_data)) {
            returnList.value = response.data.admin_data;
        } else {
            console.error('API returned error or invalid data:', response.data);
            returnList.value = [];
            toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to load data', life: 3000 });
        }
    } catch (error) {
        console.error('Error fetching product list:', error);
        tyres.value = [];
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to load data', life: 3000 });
    } finally {
        loading.value = false;
    }
};
onMounted(() => {
    fetchData();
});
function formatDate(dateString) {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString();
}

function getStatusLabel(status) {
    switch (status) {
        case 0:
            return 'Pending';
        case 1:
            return 'Completed';
        case 66:
            return 'Processing';
        case 77:
            return 'Delivery';
        default:
            return 'Unknown';
    }
}

function getStatusSeverity(status) {
    switch (status) {
        case 0:
            return 'warn';
        case 1:
            return 'success';
        case 66:
            return 'info';
        case 77:
            return 'primary';
        default:
            return 'secondary';
    }
}

function onFilter() {
    // Trigger recompute - handled automatically by computed property
}
</script>
