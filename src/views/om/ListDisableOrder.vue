<template>
    <div class="card">
        <!-- Header -->
        <div class="flex justify-between items-center mb-4">
            <h5 class="m-0 text-2xl font-bold text-gray-800">Disable Order List</h5>
        </div>

        <!-- DataTable -->
        <DataTable :value="disabledOrders" :loading="loading" dataKey="id" :rows="10" paginator :rowsPerPageOptions="[5, 10, 20]" :filters="filters1" responsiveLayout="scroll" stripedRows rowHover>
            <template #header>
                <div class="flex justify-between items-center">
                    <span class="text-sm text-gray-500">Total: {{ disabledOrders.length }}</span>
                    <div class="flex gap-2">
                        <RouterLink to="/it/createPage">
                            <Button label="Add New" icon="pi pi-plus" class="p-button-sm p-button-primary" />
                        </RouterLink>
                    </div>
                </div>
            </template>

            <template #empty>
                <div class="text-center p-6">
                    <i class="pi pi-inbox text-3xl text-gray-400 mb-2"></i>
                    <div>No disabled orders found.</div>
                    <RouterLink to="/it/createPage">
                        <Button label="Create One" icon="pi pi-plus" class="p-button-text mt-3" />
                    </RouterLink>
                </div>
            </template>

            <!-- Columns -->
            <Column header="Order Types" style="min-width: 10rem">
                <template #body="{ data }">
                    <div class="flex flex-wrap gap-1">
                        <Tag v-for="type in data.orderTypes" :key="type" :value="type" :severity="getOrderTypeSeverity(type)" />
                    </div>
                </template>
            </Column>

            <Column header="Maintenance Type" style="min-width: 10rem">
                <template #body="{ data }">
                    <Tag :value="data.maintenanceType === 'shipping_point' ? 'Shipping Point' : 'Storage Location'" :severity="data.maintenanceType === 'shipping_point' ? 'info' : 'warning'" />
                </template>
            </Column>

            <Column header="Locations" style="min-width: 10rem">
                <template #body="{ data }">
                    <Badge :value="data.locations.length" />
                    locations
                </template>
            </Column>
            <Column header="Period" style="min-width: 8rem">
                <template #body="{ data }">
                    <div class="text-sm leading-tight">
                        <div class="font-semibold">{{ formatDate(data.startDateTime) }}</div>
                        <div class="text-gray-500 text-xs text-center">to</div>
                        <div class="font-semibold">{{ formatDate(data.endDateTime) }}</div>
                    </div>
                </template>
            </Column>

            <Column header="Status" style="min-width: 8rem">
                <template #body="{ data }">
                    <Tag :value="getStatus(data)" :severity="getStatusSeverity(data)" />
                </template>
            </Column>

            <Column header="Message" style="min-width: 14rem">
                <template #body="{ data }">
                    <div class="text-sm text-gray-700 line-clamp-2">{{ data.message }}</div>
                </template>
            </Column>

            <Column header="Actions" style="min-width: 10rem" bodyClass="text-center">
                <template #body="{ data }">
                    <div class="flex gap-2">
                        <Button icon="pi pi-power-off" class="p-button-text p-button-success p-button-sm" v-tooltip="'Enable Order'" :disabled="getStatus(data) === 'Expired'" @click="enableOrder(data.id)" />
                        <Button icon="pi pi-pencil" class="p-button-text p-button-info p-button-sm" v-tooltip="'Edit'" @click="editItem(data)" />
                        <Button icon="pi pi-trash" class="p-button-text p-button-danger p-button-sm" v-tooltip="'Delete'" @click="deleteItem(data.id)" />
                    </div>
                </template>
            </Column>
        </DataTable>
    </div>
</template>

<script>
export default {
    name: 'ListPageLayout',
    data() {
        return {
            disabledOrders: [],
            loading: true,
            filters1: {
                global: { value: null, matchMode: 'contains' }
            }
        };
    },
    methods: {
        formatDate(date) {
            return new Date(date).toLocaleString('en-MY', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        },

        getStatus(order) {
            const now = new Date();
            if (now < new Date(order.startDateTime)) return 'Scheduled';
            if (now <= new Date(order.endDateTime)) return 'Active';
            return 'Expired';
        },

        getStatusSeverity(order) {
            switch (this.getStatus(order)) {
                case 'Scheduled':
                    return 'warning';
                case 'Active':
                    return 'danger';
                case 'Expired':
                    return 'secondary';
                default:
                    return 'info';
            }
        },

        getOrderTypeSeverity(type) {
            switch (type) {
                case 'Clearance':
                    return 'warning';
                case 'Direct Shipment':
                    return 'info';
                case 'Normal':
                    return 'success';
                case 'Both':
                    return 'danger';
                default:
                    return 'secondary';
            }
        },

        enableOrder(id) {
            if (confirm('Enable this order?')) {
                this.disabledOrders = this.disabledOrders.filter((o) => o.id !== id);
            }
        },

        editItem(item) {
            console.log('Editing:', item);
        },

        deleteItem(id) {
            if (confirm('Delete this order?')) {
                this.disabledOrders = this.disabledOrders.filter((o) => o.id !== id);
            }
        }
    },
    mounted() {
        // Sample data for disabled orders
        this.disabledOrders = [
            {
                id: 1,
                orderTypes: ['Normal', 'Clearance'],
                maintenanceType: 'shipping_point',
                locations: ['SP001', 'SP002'],
                startDateTime: new Date('2024-01-20T08:00:00'),
                endDateTime: new Date('2024-01-20T12:00:00'),
                message: 'System maintenance for SP001 and SP002'
            },
            {
                id: 2,
                orderTypes: ['Direct Shipment'],
                maintenanceType: 'storage_location',
                locations: ['SL001'],
                startDateTime: new Date('2024-01-21T14:00:00'),
                endDateTime: new Date('2024-01-21T16:00:00'),
                message: 'Inventory counting for SL001'
            }
        ];

        this.loading = false;
    }
};
</script>
