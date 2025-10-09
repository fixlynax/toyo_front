<template>
    <div class="card">
        <div class="text-2xl font-bold text-gray-800 border-b pb-2">List of SCM ETA</div>
        <DataTable :value="etas" :paginator="true" :rows="10" dataKey="id" :rowHover="true" :loading="loading" filterDisplay="menu" :filters="filters" @filter="onFilter">
            <template #header>
                <div class="flex items-center justify-between gap-4 w-full flex-wrap">
                    <!-- Left: Search Field -->
                    <div class="flex items-center gap-2 w-full max-w-md">
                        <IconField class="flex-1">
                            <InputIcon>
                                <i class="pi pi-search" />
                            </InputIcon>
                            <InputText v-model="filters['global'].value" placeholder="Quick Search" class="w-full" />
                        </IconField>
                    </div>

                    <!-- Right: Bulk Update Button -->
                    <Button type="button" label="Bulk Update" class="p-button-primary" />
                </div>
            </template>

            <template #empty> No ETA data found. </template>
            <template #loading> Loading ETA data. Please wait. </template>

            <!-- Columns -->
            <Column field="shippingPoint.dealerName" header="Shipping Point" style="min-width: 12rem">
                <template #body="{ data }">
                    <div>
                        <div class="font-medium">{{ data.shippingPoint.dealerName }}</div>
                        <div class="text-sm text-gray-500">{{ data.shippingPoint.email }}</div>
                        <div class="text-sm text-gray-500">{{ data.shippingPoint.phone }}</div>
                        <Tag :value="data.shippingPoint.status" :severity="getStatusSeverity(data.shippingPoint.status)" class="mt-1" />
                    </div>
                </template>
            </Column>
            <Column field="state" header="State" style="min-width: 8rem"/>
            <Column field="postcode" header="Postcode" style="min-width: 8rem"/>
            <Column field="city" header="City" style="min-width: 10rem"/>
            <Column field="cutOffTime" header="Cut-off Time" style="min-width: 10rem"/>
            <Column field="leadTime" header="Lead Time" style="min-width: 8rem"/>
            <Column field="eta" header="ETA" style="min-width: 8rem"/>
        </DataTable>
    </div>
</template>

<script setup>
import { ref, onBeforeMount } from 'vue';
import { FilterMatchMode } from '@primevue/core/api';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import IconField from 'primevue/iconfield';
import InputText from 'primevue/inputtext';
import InputIcon from 'primevue/inputicon';
import Tag from 'primevue/tag';

const etas = ref([]);
const loading = ref(true);

const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});

onBeforeMount(async () => {
    // Sample data for SCM ETA
    etas.value = [
        {
            id: 1,
            shippingPoint: {
                dealerName: 'AutoWorld KL',
                email: 'kl@autoworld.com',
                phone: '+603-12345678',
                status: 'Active'
            },
            state: 'Selangor',
            postcode: '50000',
            city: 'Kuala Lumpur',
            cutOffTime: '5:00 PM',
            leadTime: '2 days',
            eta: '2-3 days'
        },
        {
            id: 2,
            shippingPoint: {
                dealerName: 'TyreHub Penang',
                email: 'penang@tyrehub.com',
                phone: '+604-87654321',
                status: 'Active'
            },
            state: 'Penang',
            postcode: '10000',
            city: 'Georgetown',
            cutOffTime: '4:00 PM',
            leadTime: '1 day',
            eta: '1-2 days'
        },
        {
            id: 3,
            shippingPoint: {
                dealerName: 'SpeedTire Johor',
                email: 'johor@speedtire.com',
                phone: '+607-11223344',
                status: 'Inactive'
            },
            state: 'Johor',
            postcode: '80000',
            city: 'Johor Bahru',
            cutOffTime: '6:00 PM',
            leadTime: '3 days',
            eta: '3-4 days'
        },
        {
            id: 4,
            shippingPoint: {
                dealerName: 'MegaAuto Perak',
                email: 'perak@megaauto.com',
                phone: '+605-55667788',
                status: 'Active'
            },
            state: 'Perak',
            postcode: '30000',
            city: 'Ipoh',
            cutOffTime: '5:30 PM',
            leadTime: '2 days',
            eta: '2-3 days'
        },
        {
            id: 5,
            shippingPoint: {
                dealerName: 'EliteTyres Kedah',
                email: 'kedah@elitettyres.com',
                phone: '+604-99887766',
                status: 'Active'
            },
            state: 'Kedah',
            postcode: '05000',
            city: 'Alor Setar',
            cutOffTime: '4:30 PM',
            leadTime: '1 day',
            eta: '1-2 days'
        }
    ];
    loading.value = false;
});

function getStatusSeverity(status) {
    return status === 'Active' ? 'success' : 'danger';
}

function onFilter() {
    // Trigger recompute
}
</script>
