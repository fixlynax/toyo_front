<template>
    <div class="card rounded-2xl shadow-sm">
        <!-- Header -->
        <div class="flex justify-between items-center mb-4">
            <h5 class="m-0 text-2xl font-bold text-gray-800">DO - Normal Shipment</h5>
        </div>

        <!-- 🟢 Loading Page -->
        <LoadingPage v-if="loading" :message="'Loading Disable Orders NS...'" :sub-message="'Fetching your Disable Orders NS list'" />

        <!-- 🟢 Data Table -->
        <DataTable
            v-else
            :value="disabledOrders"
            dataKey="id"
            :rows="10"
            :filters="filters1"
            :globalFilterFields="['storageLocation', 'orderType', 'message']"
            responsiveLayout="scroll"
            stripedRows
            rowHover
            class="rounded-xl overflow-hidden"
        >
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
                <div class="text-center p-6">
                    <i class="pi pi-inbox text-3xl text-gray-400 mb-2"></i>
                    <div>No disabled orders found.</div>
                    <Button label="Create One" icon="pi pi-plus" class="p-button-text mt-3" @click="showCreatePopup" />
                </div>
            </template>

            <!-- 🏷 Storage Location -->
            <Column header="Storage Location" style="min-width: 12rem">
                <template #body="{ data }">
                    <div class="text-sm text-gray-700">{{ data.storageLocation }}</div>
                </template>
            </Column>

            <!-- 🏷 Order Types (text colors only) -->
            <Column header="Order Types" style="min-width: 12rem">
                <template #body="{ data }">
                    <div class="flex flex-wrap gap-2">
                        <span 
                            v-for="(type, index) in normalizeOrderTypes(data.orderType)" 
                            :key="index"
                            :class="getOrderTypeTextColor(type)"
                            class="text-sm font-medium"
                        >
                            {{ getOrderTypeLabel(type) }}
                        </span>
                    </div>
                </template>
            </Column>

            <!-- 📅 Period -->
            <Column header="Period" style="min-width: 8rem">
                <template #body="{ data }">
                    <div class="text-sm leading-tight">
                        <div class="font-semibold">{{ formatDate(data.startPeriod) }}</div>
                        <div class="text-gray-500 text-xs">to</div>
                        <div class="font-semibold">{{ formatDate(data.endPeriod) }}</div>
                    </div>
                </template>
            </Column>

            <!-- 🔖 Status -->
            <Column header="Status" style="min-width: 8rem">
                <template #body="{ data }">
                    <div class="flex justify-start">
                        <Tag v-if="getStatus(data) !== '-'" :value="getStatus(data)" :severity="getStatusSeverity(data)" />
                        <span v-else class="text-gray-400 text-sm">-</span>
                    </div>
                </template>
            </Column>

            <!-- 💬 Message -->
            <Column header="Message" style="min-width: 14rem">
                <template #body="{ data }">
                    <div class="text-sm text-gray-700 line-clamp-2">
                        {{ data.message || '-' }}
                    </div>
                </template>
            </Column>

            <!-- ⚙️ Actions -->
            <Column header="Actions" style="min-width: 10rem" bodyClass="text-center">
                <template #body="{ data }">
                    <div class="flex justify-center gap-2">
                        <Button icon="pi pi-pencil" class="p-button-text p-button-info p-button-sm" v-tooltip="'Edit'" @click="editItem(data)" />
                        <Button icon="pi pi-trash" class="p-button-text p-button-danger p-button-sm" v-tooltip="'Delete'" @click="deleteItem(data.id)" />
                    </div>
                </template>
            </Column>
        </DataTable>

        <!-- 🟢 Create Popup -->
        <Dialog v-model:visible="createPopupVisible" header="Create Disable Order" modal class="rounded-2xl shadow-md" :style="{ width: '40rem', maxWidth: '95vw' }" :closable="false">
            <div class="p-fluid formgrid grid gap-4 mt-2">
                <!-- Storage Location -->
                <div class="field col-12">
                    <label for="storageLocations" class="font-semibold text-gray-700"> Storage Locations <span class="text-red-500">*</span> </label>
                    <Dropdown
                        id="storageLocations"
                        v-model="newOrder.storageLocation"
                        :options="storageLocationOptions"
                        optionLabel="label"
                        optionValue="value"
                        placeholder="Select Storage Location"
                        class="w-full"
                        :class="{ 'p-invalid': submitted && !newOrder.storageLocation }"
                    />
                    <small v-if="submitted && !newOrder.storageLocation" class="p-error block mt-1">Storage Location is required</small>
                </div>

                <!-- Order Type -->
                <div class="field col-12">
                    <label for="orderTypes" class="font-semibold text-gray-700"> Order Types <span class="text-red-500">*</span> </label>
                    <Dropdown
                        id="orderTypes"
                        v-model="newOrder.orderType"
                        :options="orderTypeOptions"
                        optionLabel="label"
                        optionValue="value"
                        placeholder="Select Order Type"
                        class="w-full"
                        :class="{ 'p-invalid': submitted && !newOrder.orderType }"
                    />
                    <small v-if="submitted && !newOrder.orderType" class="p-error block mt-1">Order Type is required</small>
                </div>

                <!-- Period -->
                <div class="field col-12">
                    <label for="period" class="font-semibold text-gray-700"> Period <span class="text-red-500">*</span> </label>
                    <div class="flex gap-2 flex-col md:flex-row">
                        <Calendar v-model="newOrder.startPeriod" showTime hourFormat="24" :minDate="minDate" placeholder="Start Date/Time" class="flex-1" :class="{ 'p-invalid': submitted && !newOrder.startPeriod }" />
                        <Calendar v-model="newOrder.endPeriod" showTime hourFormat="24" :minDate="newOrder.startPeriod || minDate" placeholder="End Date/Time" class="flex-1" :class="{ 'p-invalid': submitted && !newOrder.endPeriod }" />
                    </div>
                    <small v-if="submitted && (!newOrder.startPeriod || !newOrder.endPeriod)" class="p-error block mt-1"> Both start and end date are required </small>
                    <small v-if="newOrder.endPeriod && newOrder.startPeriod && newOrder.endPeriod <= this.newOrder.startPeriod" class="p-error block mt-1"> End date must be after start date </small>
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
                    <Button label="Create" icon="pi pi-check" class="p-button-primary" @click="createNewOrder" :loading="creating" />
                </div>
            </template>
        </Dialog>

        <!-- 🟢 Edit Popup -->
        <Dialog v-model:visible="editPopupVisible" header="Edit Disable Order" modal class="rounded-2xl shadow-md" :style="{ width: '40rem', maxWidth: '95vw' }" :closable="false">
            <div class="p-fluid formgrid grid gap-4 mt-2" v-if="editingOrder">
                <!-- Storage Location -->
                <div class="field col-12">
                    <label for="editStorageLocations" class="font-semibold text-gray-700"> Storage Locations <span class="text-red-500">*</span> </label>
                    <Dropdown
                        id="editStorageLocations"
                        v-model="editingOrder.storageLocation"
                        :options="storageLocationOptions"
                        optionLabel="label"
                        optionValue="value"
                        placeholder="Select Storage Location"
                        class="w-full"
                        :class="{ 'p-invalid': submitted && !editingOrder.storageLocation }"
                    />
                    <small v-if="submitted && !editingOrder.storageLocation" class="p-error block mt-1">Storage Location is required</small>
                </div>

                <!-- Order Type -->
                <div class="field col-12">
                    <label for="editOrderTypes" class="font-semibold text-gray-700"> Order Types <span class="text-red-500">*</span> </label>
                    <Dropdown
                        id="editOrderTypes"
                        v-model="editingOrder.orderType"
                        :options="orderTypeOptions"
                        optionLabel="label"
                        optionValue="value"
                        placeholder="Select Order Type"
                        class="w-full"
                        :class="{ 'p-invalid': submitted && !editingOrder.orderType }"
                    />
                    <small v-if="submitted && !editingOrder.orderType" class="p-error block mt-1">Order Type is required</small>
                </div>

                <!-- Period -->
                <div class="field col-12">
                    <label for="editPeriod" class="font-semibold text-gray-700"> Period <span class="text-red-500">*</span> </label>
                    <div class="flex gap-2 flex-col md:flex-row">
                        <Calendar v-model="editingOrder.startPeriod" showTime hourFormat="24" :minDate="minDate" placeholder="Start Date/Time" class="flex-1" :class="{ 'p-invalid': submitted && !editingOrder.startPeriod }" />
                        <Calendar v-model="editingOrder.endPeriod" showTime hourFormat="24" :minDate="editingOrder.startPeriod || minDate" placeholder="End Date/Time" class="flex-1" :class="{ 'p-invalid': submitted && !editingOrder.endPeriod }" />
                    </div>
                    <small v-if="submitted && (!editingOrder.startPeriod || !editingOrder.endPeriod)" class="p-error block mt-1"> Both start and end date are required </small>
                    <small v-if="editingOrder.endPeriod && editingOrder.startPeriod && editingOrder.endPeriod <= editingOrder.startPeriod" class="p-error block mt-1"> End date must be after start date </small>
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
                    <Button label="Update" icon="pi pi-check" class="p-button-primary" @click="updateOrder" :loading="updating" />
                </div>
            </template>
        </Dialog>
    </div>
</template>

<script>
import api from '@/service/api';
import LoadingPage from '@/components/LoadingPage.vue';

export default {
    name: 'ListPageLayout',
    data() {
        return {
            disabledOrders: [],
            loading: true,
            creating: false,
            updating: false,
            filters1: { global: { value: null, matchMode: 'contains' } },
            createPopupVisible: false,
            editPopupVisible: false,
            submitted: false,
            newOrder: { storageLocation: null, orderType: null, startPeriod: null, endPeriod: null, message: '' },
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
        async fetchDisabledOrders() {
            this.loading = true;
            try {
                const response = await api.get('maintenance/list-disable-order');
                if (response.data.status === 1) {
                    this.disabledOrders = response.data.admin_data.map((item) => ({
                        ...item,
                        startPeriod: this.parseApiDate(item.startPeriod),
                        endPeriod: this.parseApiDate(item.endPeriod)
                    }));
                } else {
                    this.$toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to fetch disabled orders', life: 3000 });
                }
            } catch (error) {
                console.error('Error fetching disabled orders:', error);
                this.$toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to fetch disabled orders', life: 3000 });
            } finally {
                this.loading = false;
            }
        },

        parseApiDate(dateString) {
            if (!dateString) return null;
            return new Date(dateString.replace(' ', 'T'));
        },

        formatDateForApi(date) {
            if (!date) return null;
            return date.toISOString().replace('T', ' ').substring(0, 19);
        },

        formatDate(date) {
            if (!date) return '-';
            return new Date(date).toLocaleString('en-MY', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        },

        getStatus(order) {
            if (!order.startPeriod || !order.endPeriod) return '-';
            const now = new Date();
            const start = new Date(order.startPeriod);
            const end = new Date(order.endPeriod);
            if (now < start) return 'Scheduled';
            if (now <= end) return 'Active';
            return 'Inactive';
        },

        getStatusSeverity(order) {
            const status = this.getStatus(order);
            switch (status) {
                case 'Scheduled':
                    return 'warning';
                case 'Active':
                    return 'success';
                case 'Inactive':
                    return 'danger';
                default:
                    return null; // Return null for '-' to prevent tag rendering
            }
        },

        // 🟨🟧⚪ Order Type Helpers
        normalizeOrderTypes(orderType) {
            if (Array.isArray(orderType)) return orderType;
            if (typeof orderType === 'string') return orderType.split(',').map((t) => t.trim().toUpperCase());
            return [];
        },

        getOrderTypeLabel(value) {
            const map = { OWN: 'Own Use', NORMAL: 'Normal', ALL: 'All' };
            return map[value] || value;
        },

        getOrderTypeTextColor(value) {
            switch (value) {
                case 'OWN': return 'text-own-color';
                case 'NORMAL': return 'text-normal-color';
                case 'ALL': return 'text-all-color';
                default: return 'text-gray-600';
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
            this.newOrder = { storageLocation: null, orderType: null, startPeriod: null, endPeriod: null, message: '' };
            this.submitted = false;
        },

        async createNewOrder() {
            this.submitted = true;
            if (!this.newOrder.storageLocation || !this.newOrder.orderType || !this.newOrder.startPeriod || !this.newOrder.endPeriod) return;
            if (this.newOrder.endPeriod <= this.newOrder.startPeriod) {
                this.$toast.add({ severity: 'error', summary: 'Error', detail: 'End date must be after start date', life: 3000 });
                return;
            }
            this.creating = true;
            try {
                const payload = {
                    storageLocation: this.newOrder.storageLocation,
                    orderType: this.newOrder.orderType,
                    startPeriod: this.formatDateForApi(this.newOrder.startPeriod),
                    endPeriod: this.formatDateForApi(this.newOrder.endPeriod),
                    message: this.newOrder.message || 'No message provided'
                };
                const response = await api.post('maintenance/create-disable-order', payload);
                if (response.data.status === 1) {
                    this.$toast.add({ severity: 'success', summary: 'Success', detail: 'Disable order created successfully', life: 3000 });
                    this.hideCreatePopup();
                    this.fetchDisabledOrders();
                } else {
                    this.$toast.add({ severity: 'error', summary: 'Error', detail: response.data.message || 'Failed to create order', life: 3000 });
                }
            } catch (error) {
                console.error('Error creating order:', error);
                this.$toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to create disable order', life: 3000 });
            } finally {
                this.creating = false;
            }
        },

        editItem(item) {
            this.editingOrder = { ...item, startPeriod: new Date(item.startPeriod), endPeriod: new Date(item.endPeriod) };
            this.editPopupVisible = true;
            this.submitted = false;
        },

        async updateOrder() {
            this.submitted = true;
            if (!this.editingOrder.storageLocation || !this.editingOrder.orderType || !this.editingOrder.startPeriod || !this.editingOrder.endPeriod) return;
            if (this.editingOrder.endPeriod <= this.editingOrder.startPeriod) {
                this.$toast.add({ severity: 'error', summary: 'Error', detail: 'End date must be after start date', life: 3000 });
                return;
            }
            this.updating = true;
            try {
                const payload = {
                    id: this.editingOrder.id,
                    storageLocation: this.editingOrder.storageLocation,
                    orderType: this.editingOrder.orderType,
                    startPeriod: this.formatDateForApi(this.editingOrder.startPeriod),
                    endPeriod: this.formatDateForApi(this.editingOrder.endPeriod),
                    message: this.editingOrder.message || 'No message provided'
                };
                const response = await api.post('maintenance/update-disable-order', payload);
                if (response.data.status === 1) {
                    this.$toast.add({ severity: 'success', summary: 'Success', detail: 'Disable order updated successfully', life: 3000 });
                    this.hideEditPopup();
                    this.fetchDisabledOrders();
                } else {
                    this.$toast.add({ severity: 'error', summary: 'Error', detail: response.data.message || 'Failed to update order', life: 3000 });
                }
            } catch (error) {
                console.error('Error updating order:', error);
                this.$toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to update disable order', life: 3000 });
            } finally {
                this.updating = false;
            }
        },

        hideEditPopup() {
            this.editPopupVisible = false;
            this.editingOrder = null;
        },

        async deleteItem(id) {
            if (confirm('Are you sure you want to delete this order?')) {
                try {
                    const response = await api.delete(`maintenance/delete-disable-order/${id}`);
                    if (response.data.status === 1) {
                        this.$toast.add({ severity: 'info', summary: 'Deleted', detail: 'Order has been deleted', life: 3000 });
                        this.fetchDisabledOrders();
                    } else {
                        this.$toast.add({ severity: 'error', summary: 'Error', detail: response.data.message || 'Failed to delete order', life: 3000 });
                    }
                } catch (error) {
                    console.error('Error deleting order:', error);
                    this.$toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete order', life: 3000 });
                }
            }
        }
    },

    async mounted() {
        await this.fetchDisabledOrders();
    },

    components: { LoadingPage }
};
</script>

<style scoped>
.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-2: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

/* 🟨🟧⚪ Custom Text Colors Only */
.text-own-color {
    color: #1578b1;
    font-weight: 700;
}

.text-normal-color {
    color: #d32d8e;
    font-weight: 700;
}

.text-all-color {
    color: #c7ba0b;
    font-weight: 700;
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