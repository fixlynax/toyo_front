<template>
    <div class="card rounded-2xl shadow-sm">
        <!-- Header -->
        <div class="flex justify-between items-center mb-4">
            <h5 class="m-0 text-2xl font-bold text-gray-800">Disable Order List</h5>
            <Button 
                label="Add New" 
                icon="pi pi-plus" 
                class="p-button-sm p-button-primary" 
                @click="showCreatePopup"
            />
        </div>

        <!-- DataTable -->
        <DataTable
            :value="disabledOrders"
            :loading="loading"
            dataKey="id"
            :rows="10"
            paginator
            :rowsPerPageOptions="[5, 10, 20]"
            :filters="filters1"
            responsiveLayout="scroll"
            stripedRows
            rowHover
            class="rounded-xl overflow-hidden"
        >
            <template #header>
                <div class="flex justify-between items-center">
                    <span class="text-sm text-gray-500">
                        Total: {{ disabledOrders.length }}
                    </span>
                </div>
            </template>

            <template #empty>
                <div class="text-center p-6">
                    <i class="pi pi-inbox text-3xl text-gray-400 mb-2"></i>
                    <div>No disabled orders found.</div>
                    <Button
                        label="Create One"
                        icon="pi pi-plus"
                        class="p-button-text mt-3"
                        @click="showCreatePopup"
                    />
                </div>
            </template>

            <!-- Columns -->
            <Column header="Order Types" style="min-width: 10rem">
                <template #body="{ data }">
                    <div class="flex flex-wrap gap-1">
                        <Tag
                            v-for="type in data.orderTypes"
                            :key="type"
                            :value="type"
                            :severity="getOrderTypeSeverity(type)"
                        />
                    </div>
                </template>
            </Column>

            <Column header="Maintenance Type" style="min-width: 10rem">
                <template #body="{ data }">
                    <Tag
                        :value="data.maintenanceType === 'shipping_point' ? 'Shipping Point' : 'Storage Location'"
                        :severity="data.maintenanceType === 'shipping_point' ? 'info' : 'warning'"
                    />
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
                    <div class="text-sm leading-tight text-center">
                        <div class="font-semibold">{{ formatDate(data.startDateTime) }}</div>
                        <div class="text-gray-500 text-xs">to</div>
                        <div class="font-semibold">{{ formatDate(data.endDateTime) }}</div>
                    </div>
                </template>
            </Column>

            <Column header="Status" style="min-width: 8rem">
                <template #body="{ data }">
                    <Tag
                        :value="getStatus(data)"
                        :severity="getStatusSeverity(data)"
                    />
                </template>
            </Column>

            <Column header="Message" style="min-width: 14rem">
                <template #body="{ data }">
                    <div class="text-sm text-gray-700 line-clamp-2">
                        {{ data.message }}
                    </div>
                </template>
            </Column>

            <Column header="Actions" style="min-width: 10rem" bodyClass="text-center">
                <template #body="{ data }">
                    <div class="flex justify-center gap-2">
                        <Button
                            icon="pi pi-power-off"
                            class="p-button-text p-button-success p-button-sm"
                            v-tooltip="'Enable Order'"
                            :disabled="getStatus(data) === 'Expired'"
                            @click="enableOrder(data.id)"
                        />
                        <Button
                            icon="pi pi-pencil"
                            class="p-button-text p-button-info p-button-sm"
                            v-tooltip="'Edit'"
                            @click="editItem(data)"
                        />
                        <Button
                            icon="pi pi-trash"
                            class="p-button-text p-button-danger p-button-sm"
                            v-tooltip="'Delete'"
                            @click="deleteItem(data.id)"
                        />
                    </div>
                </template>
            </Column>
        </DataTable>

        <!-- Create Popup Dialog -->
        <Dialog
            v-model:visible="createPopupVisible"
            header="Create Disable Order"
            modal
            class="rounded-2xl shadow-md"
            :style="{ width: '40rem', maxWidth: '95vw' }"
            :closable="false"
        >
            <div class="p-fluid formgrid grid gap-4 mt-2">
                <!-- Order Types -->
                <div class="field col-12">
                    <label for="orderTypes" class="font-semibold text-gray-700">
                        Order Types <span class="text-red-500">*</span>
                    </label>
                    <MultiSelect
                        id="orderTypes"
                        v-model="newOrder.orderTypes"
                        :options="orderTypeOptions"
                        optionLabel="label"
                        optionValue="value"
                        display="chip"
                        filter
                        placeholder="Select Order Types"
                        class="w-full"
                        :class="{ 'p-invalid': submitted && !newOrder.orderTypes.length }"
                    />
                    <small
                        v-if="submitted && !newOrder.orderTypes.length"
                        class="p-error block mt-1"
                    >
                        Order Types is required
                    </small>
                </div>

                <!-- Maintenance Type -->
                <div class="field col-12 md:col-6">
                    <label for="maintenanceType" class="font-semibold text-gray-700">
                        Maintenance Type <span class="text-red-500">*</span>
                    </label>
                    <Dropdown
                        id="maintenanceType"
                        v-model="newOrder.maintenanceType"
                        :options="maintenanceTypeOptions"
                        optionLabel="label"
                        optionValue="value"
                        placeholder="Select Maintenance Type"
                        class="w-full"
                        :class="{ 'p-invalid': submitted && !newOrder.maintenanceType }"
                    />
                    <small
                        v-if="submitted && !newOrder.maintenanceType"
                        class="p-error block mt-1"
                    >
                        Maintenance Type is required
                    </small>
                </div>

                <!-- Locations -->
                <div class="field col-12 md:col-6">
                    <label for="locations" class="font-semibold text-gray-700">
                        Locations <span class="text-red-500">*</span>
                    </label>
                    <MultiSelect
                        id="locations"
                        v-model="newOrder.locations"
                        :options="locationOptions"
                        optionLabel="label"
                        optionValue="value"
                        display="chip"
                        placeholder="Select Locations"
                        class="w-full"
                        :class="{ 'p-invalid': submitted && !newOrder.locations.length }"
                    />
                    <small
                        v-if="submitted && !newOrder.locations.length"
                        class="p-error block mt-1"
                    >
                        At least one location is required
                    </small>
                </div>

                <!-- Period -->
                <div class="field col-12">
                    <label for="period" class="font-semibold text-gray-700">
                        Period <span class="text-red-500">*</span>
                    </label>
                    <div class="flex gap-2">
                        <Calendar
                            v-model="newOrder.startDateTime"
                            showTime
                            hourFormat="24"
                            :minDate="minDate"
                            placeholder="Start Date/Time"
                            class="flex-1"
                            :class="{ 'p-invalid': submitted && !newOrder.startDateTime }"
                        />
                        <Calendar
                            v-model="newOrder.endDateTime"
                            showTime
                            hourFormat="24"
                            :minDate="newOrder.startDateTime || minDate"
                            placeholder="End Date/Time"
                            class="flex-1"
                            :class="{ 'p-invalid': submitted && !newOrder.endDateTime }"
                        />
                    </div>
                    <small
                        v-if="submitted && (!newOrder.startDateTime || !newOrder.endDateTime)"
                        class="p-error block mt-1"
                    >
                        Both start and end date are required
                    </small>
                </div>

                <!-- Message -->
                <div class="field col-12">
                    <label for="message" class="font-semibold text-gray-700">Message</label>
                    <Textarea
                        id="message"
                        v-model="newOrder.message"
                        rows="3"
                        autoResize
                        placeholder="Enter message (optional)"
                        class="w-full"
                    />
                </div>
            </div>

            <template #footer>
                <div class="flex justify-end gap-3">
                    <Button
                        label="Cancel"
                        icon="pi pi-times"
                        class="p-button-text text-gray-600 hover:text-gray-800"
                        @click="hideCreatePopup"
                    />
                    <Button
                        label="Create"
                        icon="pi pi-check"
                        class="p-button-primary"
                        @click="createNewOrder"
                    />
                </div>
            </template>
        </Dialog>
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
            },
            createPopupVisible: false,
            submitted: false,
            newOrder: {
                orderTypes: [],
                maintenanceType: null,
                locations: [],
                startDateTime: null,
                endDateTime: null,
                message: ''
            },
            orderTypeOptions: [
                { label: 'Normal', value: 'Normal' },
                { label: 'Clearance', value: 'Clearance' },
                { label: 'Direct Shipment', value: 'Direct Shipment' },
                { label: 'Both', value: 'Both' }
            ],
            maintenanceTypeOptions: [
                { label: 'Shipping Point', value: 'shipping_point' },
                { label: 'Storage Location', value: 'storage_location' }
            ],
            locationOptions: [
                { label: 'SP001 - Main Shipping Point', value: 'SP001' },
                { label: 'SP002 - Secondary Shipping', value: 'SP002' },
                { label: 'SL001 - Warehouse A', value: 'SL001' },
                { label: 'SL002 - Warehouse B', value: 'SL002' },
                { label: 'SL003 - Cold Storage', value: 'SL003' }
            ]
        };
    },
    computed: {
        minDate() {
            return new Date();
        }
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

        showCreatePopup() {
            this.createPopupVisible = true;
            this.resetForm();
        },

        hideCreatePopup() {
            this.createPopupVisible = false;
            this.resetForm();
        },

        resetForm() {
            this.newOrder = {
                orderTypes: [],
                maintenanceType: null,
                locations: [],
                startDateTime: null,
                endDateTime: null,
                message: ''
            };
            this.submitted = false;
        },

        createNewOrder() {
            this.submitted = true;

            // Validate required fields
            if (!this.newOrder.orderTypes.length || 
                !this.newOrder.maintenanceType || 
                !this.newOrder.locations.length || 
                !this.newOrder.startDateTime || 
                !this.newOrder.endDateTime) {
                return;
            }

            // Validate date logic
            if (this.newOrder.endDateTime <= this.newOrder.startDateTime) {
                alert('End date must be after start date');
                return;
            }

            // Create new order object
            const newOrder = {
                id: Math.max(...this.disabledOrders.map(o => o.id), 0) + 1,
                orderTypes: [...this.newOrder.orderTypes],
                maintenanceType: this.newOrder.maintenanceType,
                locations: [...this.newOrder.locations],
                startDateTime: new Date(this.newOrder.startDateTime),
                endDateTime: new Date(this.newOrder.endDateTime),
                message: this.newOrder.message || 'No message provided'
            };

            // Add to the list
            this.disabledOrders.unshift(newOrder);

            // Show success message
            this.$toast.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Disable order created successfully',
                life: 3000
            });

            // Close popup and reset form
            this.hideCreatePopup();
        },

        enableOrder(id) {
            if (confirm('Enable this order?')) {
                this.disabledOrders = this.disabledOrders.filter((o) => o.id !== id);
                this.$toast.add({
                    severity: 'success',
                    summary: 'Enabled',
                    detail: 'Order has been enabled',
                    life: 3000
                });
            }
        },

        editItem(item) {
            console.log('Editing:', item);
            // You can implement edit functionality similarly
        },

        deleteItem(id) {
            if (confirm('Delete this order?')) {
                this.disabledOrders = this.disabledOrders.filter((o) => o.id !== id);
                this.$toast.add({
                    severity: 'info',
                    summary: 'Deleted',
                    detail: 'Order has been deleted',
                    life: 3000
                });
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

<style scoped>
.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

:deep(.p-dialog .p-dialog-header) {
    background-color: #f8f9fa;
    border-bottom: 1px solid #e9ecef;
}

:deep(.p-dialog .p-dialog-content) {
    padding: 1.5rem;
}
</style>