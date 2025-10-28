<template>
    <div class="card rounded-2xl shadow-sm">
        <!-- Header -->
        <div class="flex justify-between items-center mb-4">
            <h5 class="m-0 text-2xl font-bold text-gray-800">DO - Direct Shipment</h5>
        </div>

        <!-- DataTable -->
        <DataTable
            :value="disabledOrders"
            :loading="loading"
            dataKey="id"
            :rows="10"
            :filters="filters1"
            responsiveLayout="scroll"
            stripedRows
            rowHover
            class="rounded-xl overflow-hidden"
        >
            <template #header>
                <div class="flex justify-between items-center">
                    <span class="text-sm text-gray-500">Total: {{ disabledOrders.length }}</span>
                </div>
            </template>

            <template #empty>
                <div class="text-center p-6">
                    <i class="pi pi-inbox text-3xl text-gray-400 mb-2"></i>
                    <div>No disabled orders found.</div>
                    <Button label="Create One" icon="pi pi-plus" class="p-button-text mt-3" @click="showCreatePopup" />
                </div>
            </template>

            <!-- Columns -->
            <Column header="Storage Location" style="min-width: 12rem">
                <template #body="{ data }">
                    <div class="text-sm text-gray-700">
                        {{ data.storageLocations.join(', ') }}
                    </div>
                </template>
            </Column>

            <Column header="Order Types" style="min-width: 12rem">
                <template #body="{ data }">
                    <div class="flex flex-wrap gap-1">
                        <Tag
                            v-for="type in data.orderTypes"
                            :key="type"
                            :value="getOrderTypeLabel(type)"
                            :severity="getOrderTypeSeverity(type)"
                        />
                    </div>
                </template>
            </Column>

            <Column header="Period" style="min-width: 8rem">
                <template #body="{ data }">
                    <div class="text-sm leading-tight">
                        <div class="font-semibold">{{ formatDate(data.startDateTime) }}</div>
                        <div class="text-gray-500 text-xs">to</div>
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
                    <div class="text-sm text-gray-700 line-clamp-2">
                        {{ data.message }}
                    </div>
                </template>
            </Column>

            <Column header="Actions" style="min-width: 10rem" bodyClass="text-center">
                <template #body="{ data }">
                    <div class="flex justify-center gap-2">
                        <Button icon="pi pi-pencil" class="p-button-text p-button-info p-button-sm" v-tooltip="'Edit'" @click="editItem(data)" />
                        <Button icon="pi pi-trash" class="p-button-text p-button-danger p-button-sm" v-tooltip="'Delete'" @click="deleteItem(data.id)" />
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
                <!-- Storage Locations -->
                <div class="field col-12">
                    <label for="storageLocations" class="font-semibold text-gray-700">
                        Storage Locations <span class="text-red-500">*</span>
                    </label>
                    <MultiSelect
                        id="storageLocations"
                        v-model="newOrder.storageLocations"
                        :options="storageLocationOptions"
                        optionLabel="label"
                        optionValue="value"
                        display="chip"
                        filter
                        placeholder="Select Storage Locations"
                        class="w-full"
                        :class="{ 'p-invalid': submitted && !newOrder.storageLocations.length }"
                    />
                    <small v-if="submitted && !newOrder.storageLocations.length" class="p-error block mt-1">Storage Locations is required</small>
                </div>

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
                    <small v-if="submitted && !newOrder.orderTypes.length" class="p-error block mt-1">Order Types is required</small>
                </div>

                <!-- Period -->
                <div class="field col-12">
                    <label for="period" class="font-semibold text-gray-700">
                        Period <span class="text-red-500">*</span>
                    </label>
                    <div class="flex gap-2 flex-col md:flex-row">
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
                    <small v-if="submitted && (!newOrder.startDateTime || !newOrder.endDateTime)" class="p-error block mt-1">
                        Both start and end date are required
                    </small>
                    <small v-if="newOrder.endDateTime && newOrder.startDateTime && newOrder.endDateTime <= newOrder.startDateTime" class="p-error block mt-1">
                        End date must be after start date
                    </small>
                </div>

                <!-- Message -->
                <div class="field col-12">
                    <label for="message" class="font-semibold text-gray-700">Message</label>
                    <Textarea id="message" v-model="newOrder.message" rows="3" autoResize placeholder="Enter message (optional)" class="w-full" />
                </div>
            </div>

            <template #footer>
                <div class="flex justify-end gap-3">
                    <Button label="Cancel" icon="pi pi-times" class="p-button-text text-gray-600 hover:text-gray-800" @click="hideCreatePopup" />
                    <Button label="Create" icon="pi pi-check" class="p-button-primary" @click="createNewOrder" />
                </div>
            </template>
        </Dialog>

        <!-- Edit Popup Dialog -->
        <Dialog
            v-model:visible="editPopupVisible"
            header="Edit Disable Order"
            modal
            class="rounded-2xl shadow-md"
            :style="{ width: '40rem', maxWidth: '95vw' }"
            :closable="false"
        >
            <div class="p-fluid formgrid grid gap-4 mt-2" v-if="editingOrder">
                <!-- Order Types -->
                <div class="field col-12">
                    <label for="editOrderTypes" class="font-semibold text-gray-700">
                        Order Types <span class="text-red-500">*</span>
                    </label>
                    <MultiSelect
                        id="editOrderTypes"
                        v-model="editingOrder.orderTypes"
                        :options="orderTypeOptions"
                        optionLabel="label"
                        optionValue="value"
                        display="chip"
                        filter
                        placeholder="Select Order Types"
                        class="w-full"
                        :class="{ 'p-invalid': submitted && !editingOrder.orderTypes.length }"
                    />
                    <small v-if="submitted && !editingOrder.orderTypes.length" class="p-error block mt-1">Order Types is required</small>
                </div>

                <!-- Period -->
                <div class="field col-12">
                    <label for="editPeriod" class="font-semibold text-gray-700">
                        Period <span class="text-red-500">*</span>
                    </label>
                    <div class="flex gap-2 flex-col md:flex-row">
                        <Calendar
                            v-model="editingOrder.startDateTime"
                            showTime
                            hourFormat="24"
                            :minDate="minDate"
                            placeholder="Start Date/Time"
                            class="flex-1"
                            :class="{ 'p-invalid': submitted && !editingOrder.startDateTime }"
                        />
                        <Calendar
                            v-model="editingOrder.endDateTime"
                            showTime
                            hourFormat="24"
                            :minDate="editingOrder.startDateTime || minDate"
                            placeholder="End Date/Time"
                            class="flex-1"
                            :class="{ 'p-invalid': submitted && !editingOrder.endDateTime }"
                        />
                    </div>
                    <small v-if="submitted && (!editingOrder.startDateTime || !editingOrder.endDateTime)" class="p-error block mt-1">
                        Both start and end date are required
                    </small>
                    <small v-if="editingOrder.endDateTime && editingOrder.startDateTime && editingOrder.endDateTime <= editingOrder.startDateTime" class="p-error block mt-1">
                        End date must be after start date
                    </small>
                </div>

                <!-- Message -->
                <div class="field col-12">
                    <label for="editMessage" class="font-semibold text-gray-700">Message</label>
                    <Textarea id="editMessage" v-model="editingOrder.message" rows="3" autoResize placeholder="Enter message (optional)" class="w-full" />
                </div>
            </div>

            <template #footer>
                <div class="flex justify-end gap-3">
                    <Button label="Cancel" icon="pi pi-times" class="p-button-text text-gray-600 hover:text-gray-800" @click="hideEditPopup" />
                    <Button label="Update" icon="pi pi-check" class="p-button-primary" @click="updateOrder" />
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
            editPopupVisible: false,
            submitted: false,
            newOrder: {
                storageLocations: [],
                orderTypes: [],
                startDateTime: null,
                endDateTime: null,
                message: ''
            },
            editingOrder: null,
            storageLocationOptions: [
                { label: 'TMJB', value: 'TMJB' },
                { label: 'TMSA', value: 'TMSA' },
                { label: 'TMSB', value: 'TMSB' },
                { label: 'TMSK', value: 'TMSK' },
                { label: 'RETP', value: 'RETP' }
            ],
            orderTypeOptions: [
                { label: 'Normal', value: 'NORMAL' },
                { label: 'All', value: 'ALL' },
                { label: 'Own Use', value: 'OWN' }
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
            if (!date) return 'N/A';
            return new Date(date).toLocaleString('en-MY', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        },

        getStatus(order) {
            if (!order.startDateTime || !order.endDateTime) return 'Unknown';
            
            const now = new Date();
            const start = new Date(order.startDateTime);
            const end = new Date(order.endDateTime);
            
            if (now < start) return 'Scheduled';
            if (now <= end) return 'Active';
            return 'Inactive';
        },

        getStatusSeverity(order) {
            switch (this.getStatus(order)) {
                case 'Scheduled':
                    return 'warning';
                case 'Active':
                    return 'danger';
                case 'Inactive':
                    return 'secondary';
                default:
                    return 'info';
            }
        },

        getOrderTypeLabel(value) {
            const map = { 
                'OWN': 'Own Use', 
                'NORMAL': 'Normal', 
                'ALL': 'All'
            };
            return map[value] || value;
        },

        getOrderTypeSeverity(value) {
            switch (value) {
                case 'OWN':
                    return 'success';
                case 'NORMAL':
                    return 'info';
                case 'ALL':
                    return 'warning';
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
                storageLocations: [],
                orderTypes: [],
                startDateTime: null,
                endDateTime: null,
                message: ''
            };
            this.submitted = false;
        },

        createNewOrder() {
            this.submitted = true;

            // Validation
            if (
                !this.newOrder.storageLocations.length ||
                !this.newOrder.orderTypes.length ||
                !this.newOrder.startDateTime ||
                !this.newOrder.endDateTime
            ) {
                return;
            }

            if (this.newOrder.endDateTime <= this.newOrder.startDateTime) {
                this.$toast.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'End date must be after start date',
                    life: 3000
                });
                return;
            }

            // Create new order
            const newOrder = {
                id: this.disabledOrders.length > 0 ? Math.max(...this.disabledOrders.map((o) => o.id)) + 1 : 1,
                storageLocations: [...this.newOrder.storageLocations],
                orderTypes: [...this.newOrder.orderTypes],
                startDateTime: new Date(this.newOrder.startDateTime),
                endDateTime: new Date(this.newOrder.endDateTime),
                message: this.newOrder.message || 'No message provided'
            };

            this.disabledOrders.unshift(newOrder);

            this.$toast.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Disable order created successfully',
                life: 3000
            });

            this.hideCreatePopup();
        },

        editItem(item) {
            this.editingOrder = { 
                ...item,
                // Ensure we create new arrays to avoid reference issues
                storageLocations: [...item.storageLocations],
                orderTypes: [...item.orderTypes],
                // Ensure dates are Date objects
                startDateTime: new Date(item.startDateTime),
                endDateTime: new Date(item.endDateTime)
            };
            this.editPopupVisible = true;
            this.submitted = false;
        },

        updateOrder() {
            this.submitted = true;

            // Validation
            if (
                !this.editingOrder.storageLocations.length ||
                !this.editingOrder.orderTypes.length ||
                !this.editingOrder.startDateTime ||
                !this.editingOrder.endDateTime
            ) {
                return;
            }

            if (this.editingOrder.endDateTime <= this.editingOrder.startDateTime) {
                this.$toast.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'End date must be after start date',
                    life: 3000
                });
                return;
            }

            // Find and update the order
            const index = this.disabledOrders.findIndex(order => order.id === this.editingOrder.id);
            if (index !== -1) {
                // Use splice to ensure reactivity
                this.disabledOrders.splice(index, 1, { 
                    ...this.editingOrder,
                    startDateTime: new Date(this.editingOrder.startDateTime),
                    endDateTime: new Date(this.editingOrder.endDateTime)
                });
            }

            this.$toast.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Disable order updated successfully',
                life: 3000
            });

            this.hideEditPopup();
        },

        hideEditPopup() {
            this.editPopupVisible = false;
            this.editingOrder = null;
            this.submitted = false;
        },

        deleteItem(id) {
            if (confirm('Are you sure you want to delete this order?')) {
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
        // Sample data based on your image structure
        this.disabledOrders = [
            {
                id: 1,
                storageLocations: ['TMJB'],
                orderTypes: ['NORMAL', 'OWN'],
                startDateTime: new Date('2025-01-20T08:00:00'),
                endDateTime: new Date('2025-01-20T12:00:00'),
                message: 'Maintenance for TMJB location'
            },
            {
                id: 2,
                storageLocations: ['TMSA'],
                orderTypes: ['NORMAL', 'OWN'],
                startDateTime: new Date('2025-01-21T14:00:00'),
                endDateTime: new Date('2025-01-21T16:00:00'),
                message: 'Inventory counting for TMSA'
            },
            {
                id: 3,
                storageLocations: ['RETP'],
                orderTypes: ['ALL'],
                startDateTime: new Date('2025-01-22T09:00:00'),
                endDateTime: new Date('2025-01-22T17:00:00'),
                message: 'System upgrade for RETP'
            },
            {
                id: 4,
                storageLocations: ['TMSB', 'TMSK'],
                orderTypes: ['NORMAL'],
                startDateTime: new Date('2025-01-24T08:00:00'),
                endDateTime: new Date('2025-01-24T12:00:00'),
                message: 'Multiple location maintenance'
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

/* Responsive improvements */
@media (max-width: 768px) {
    .flex-col {
        flex-direction: column;
    }
    
    .gap-2 > * {
        margin-bottom: 0.5rem;
    }
}
</style>