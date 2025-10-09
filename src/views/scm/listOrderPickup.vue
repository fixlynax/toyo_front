<template>
    <div class="card">
        <div class="text-2xl font-bold text-gray-800 border-b pb-2">Order Pickup List</div>
        <DataTable :value="filteredPickups" :paginator="true" :rows="10" dataKey="id" :rowHover="true" :loading="loading" filterDisplay="menu" :filters="filters" @filter="onFilter">
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
                        </div>
                    </div>
                </div>
            </template>

            <template #empty>
                <div class="text-center py-4 text-gray-500">No pickup orders found.</div>
            </template>
            <template #loading>
                <div class="text-center py-4">Loading pickup orders data. Please wait.</div>
            </template>

            <!-- Columns -->
            <Column field="orderNo" header="Order No" style="min-width: 8rem">
                <template #body="{ data }">
                    <RouterLink :to="'/scm/detailOrderPickup'" class="hover:underline font-bold">
                        {{ data.orderNo }}
                    </RouterLink>
                </template>
            </Column>
            <Column field="driverName" header="Driver Name" style="min-width: 10rem" />
            <Column field="vehicleNo" header="Vehicle No" style="min-width: 10rem" />
            <Column field="mobileNo" header="Mobile No" style="min-width: 10rem" />
            <Column header="Status" style="min-width: 8rem">
                <template #body="{ data }">
                    <Tag :value="getStatusLabel(data.orderStatus)" :severity="getStatusSeverity(data.orderStatus)" />
                </template>
            </Column>
        </DataTable>
    </div>
</template>

<script setup>
import { ref, computed, onBeforeMount } from 'vue';
import { FilterMatchMode } from '@primevue/core/api';

// Import your pickup service (create this service if it doesn't exist)
// import { ListPickupService } from '@/service/listPickup';

const pickups = ref([]);
const loading = ref(true);
const error = ref(null);

const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});

const filteredPickups = computed(() => {
    let filtered = pickups.value;

    // Global search
    if (filters.value.global.value) {
        const search = filters.value.global.value.toLowerCase();
        filtered = filtered.filter(
            (pickup) =>
                (pickup.orderNo?.toLowerCase() || '').includes(search) ||
                (pickup.driverName?.toLowerCase() || '').includes(search) ||
                (pickup.vehicleNo?.toLowerCase() || '').includes(search) ||
                (pickup.mobileNo?.toLowerCase() || '').includes(search) ||
                (getStatusLabel(pickup.orderStatus)?.toLowerCase() || '').includes(search)
        );
    }

    return filtered;
});

onBeforeMount(async () => {
    await loadPickupData();
});

async function loadPickupData() {
    try {
        loading.value = true;
        error.value = null;

        // Option 1: Use your actual API service
        // pickups.value = await ListPickupService.getListPickup();

        // Option 2: Use the sample data with orderStatus field
        pickups.value = [
            {
                id: 1,
                orderNo: 'PU001',
                driverName: 'Ahmad Zaki',
                vehicleNo: 'ABC 1234',
                mobileNo: '+60123456789',
                orderStatus: 1 // Completed
            },
            {
                id: 2,
                orderNo: 'PU002',
                driverName: 'Siti Aminah',
                vehicleNo: 'XYZ 5678',
                mobileNo: '+60198765432',
                orderStatus: 77 // Delivery
            },
            {
                id: 3,
                orderNo: 'PU003',
                driverName: 'Raj Kumar',
                vehicleNo: 'DEF 9012',
                mobileNo: '+60134567890',
                orderStatus: 0 // Pending
            },
            {
                id: 4,
                orderNo: 'PU004',
                driverName: 'Lee Wei Ming',
                vehicleNo: 'GHI 3456',
                mobileNo: '+60145678901',
                orderStatus: 1 // Completed
            },
            {
                id: 5,
                orderNo: 'PU005',
                driverName: 'Fatimah Hassan',
                vehicleNo: 'JKL 7890',
                mobileNo: '+60156789012',
                orderStatus: 66 // Processing
            },
            {
                id: 6,
                orderNo: 'PU006',
                driverName: 'Mohd Ali',
                vehicleNo: 'MNO 1234',
                mobileNo: '+60167890123',
                orderStatus: 0 // Pending
            },
            {
                id: 7,
                orderNo: 'PU007',
                driverName: 'Nur Aisyah',
                vehicleNo: 'PQR 5678',
                mobileNo: '+60178901234',
                orderStatus: 1 // Completed
            },
            {
                id: 8,
                orderNo: 'PU008',
                driverName: 'Tan Wei Jie',
                vehicleNo: 'STU 9012',
                mobileNo: '+60189012345',
                orderStatus: 0 // Pending
            }
        ];
    } catch (err) {
        error.value = 'Failed to load pickup orders data.';
        console.error('Error loading pickup data:', err);
    } finally {
        loading.value = false;
    }
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
    // Trigger recompute - this is handled automatically by the computed property
}
</script>
