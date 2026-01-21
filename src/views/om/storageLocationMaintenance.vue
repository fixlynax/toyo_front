<template>
    <div class="card rounded-2xl shadow-sm">
        <!-- Header with Tabs -->
        <div class="flex flex-col gap-4 mb-6">
            <div class="flex justify-between items-center">
                <h5 class="m-0 text-2xl font-bold text-gray-800">Storage Location Maintenance</h5>
            </div>

            <!-- Tabs using TabMenu -->
            <TabMenu v-model:activeIndex="activeTabIndex" :model="tabItems" class="custom-tabmenu" />
        </div>

        <!-- 🟢 Loading Page -->
        <LoadingPage v-if="loading" :message="`Loading ${activeTabName} Orders...`" :sub-message="`Fetching your ${activeTabName} orders list`" />

        <!-- Content based on active tab -->
        <template v-else>
            <!-- Normal Location Tab Content -->
            <div v-if="activeTabName === 'Normal Location'">
                <!-- Data Table -->
                <DataTable :value="normalLocationOrders" dataKey="id" :rows="10" :filters="filters" :globalFilterFields="['storageLocation', 'orderType', 'message']" responsiveLayout="scroll" stripedRows rowHover class="rounded-table">
                    <template #header>
                        <div class="flex items-center justify-between gap-4 w-full flex-wrap">
                            <!-- Search -->
                            <div class="flex items-center gap-2 w-full max-w-md">
                                <IconField class="flex-1">
                                    <InputIcon>
                                        <i class="pi pi-search" />
                                    </InputIcon>
                                    <InputText v-model="filters['global'].value" placeholder="Quick Search" class="w-full" />
                                </IconField>
                            </div>
                        </div>
                    </template>

                    <template #empty>
                        <div class="text-center p-6">
                            <i class="pi pi-inbox text-3xl text-gray-400 mb-2"></i>
                            <div>No disabled orders found.</div>
                        </div>
                    </template>

                    <!-- 🏷 Storage Location -->
                    <Column header="Storage Location" style="min-width: 12rem">
                        <template #body="{ data }">
                            <div class="text-sl font-bold text-gray-700">{{ data.storageLocation }}</div>
                        </template>
                    </Column>

                    <!-- 🏷 Order Types (text colors only) -->
                    <Column header="Order Types" style="min-width: 12rem">
                        <template #body="{ data }">
                            <div class="flex flex-wrap gap-2">
                                <span v-for="(type, index) in normalizeOrderTypes(data.orderType)" :key="index" :class="getOrderTypeTextColor(type)" class="text-sl font-medium">
                                    {{ getOrderTypeLabel(type) }}
                                </span>
                            </div>
                        </template>
                    </Column>

                    <!-- 📅 Period -->
                    <Column header="Period" style="min-width: 8rem">
                        <template #body="{ data }">
                            <div class="leading-tight">
                                <div class="font-semibold text-sl">{{ formatDate(data.startPeriod) }} ⟶ {{ formatDate(data.endPeriod) }}</div>
                            </div>
                        </template>
                    </Column>

                    <!-- 💬 Message -->
                    <Column header="Message" style="min-width: 14rem">
                        <template #body="{ data }">
                            <div class="font-bold text-sl text-black-700 line-clamp-2">
                                {{ data.message || '-' }}
                            </div>
                        </template>
                    </Column>

                    <!-- 🔖 Status -->
                    <Column header="Status" style="min-width: 8rem">
                        <template #body="{ data }">
                            <div class="flex justify-start">
                                <Tag :value="getStatus(data)" :severity="getStatusSeverity(data)" />
                            </div>
                        </template>
                    </Column>

                    <!-- ⚙️ Actions -->
                    <Column v-if="canUpdate" header="Action" style="min-width: 10rem" bodyClass="text-center">
                        <template #body="{ data }">
                            <div class="flex justify-left gap-2">
                                <Button icon="pi pi-pencil" class="p-button-text p-button-info p-button-sm" v-tooltip="'Edit'" @click="editItem(data, 'normal')" />
                            </div>
                        </template>
                    </Column>
                </DataTable>
            </div>

            <!-- TMDS Location Tab Content -->
            <div v-else-if="activeTabName === 'TMDS Location'">
                <!-- Data Table -->
                <DataTable :value="tmdsLocationOrders" dataKey="id" :rows="10" :filters="filters" :globalFilterFields="['storageLocation', 'orderType', 'message']" responsiveLayout="scroll" stripedRows rowHover class="rounded-table">
                    <template #header>
                        <div class="flex items-center justify-between gap-4 w-full flex-wrap">
                            <!-- Search -->
                            <div class="flex items-center gap-2 w-full max-w-md">
                                <IconField class="flex-1">
                                    <InputIcon>
                                        <i class="pi pi-search" />
                                    </InputIcon>
                                    <InputText v-model="filters['global'].value" placeholder="Quick Search" class="w-full" />
                                </IconField>
                            </div>
                        </div>
                    </template>

                    <template #empty>
                        <div class="text-center p-6">
                            <i class="pi pi-inbox text-3xl text-gray-400 mb-2"></i>
                            <div>No disabled orders found.</div>
                        </div>
                    </template>

                    <!-- 🏷 Storage Location -->
                    <Column header="Storage Location" style="min-width: 12rem">
                        <template #body="{ data }">
                            <div class="text-sl text-black-700 font-bold">{{ data.storageLocation }}</div>
                        </template>
                    </Column>

                    <!-- 🏷 Order Type -->
                    <Column header="Order Type" style="min-width: 12rem">
                        <template #body="{ data }">
                            <div class="flex flex-wrap gap-2">
                                <span class="text-purple-600 font-bold text-sl">
                                    {{ getTmdsOrderTypeLabel(data.orderType) }}
                                </span>
                            </div>
                        </template>
                    </Column>

                    <!-- 📅 Period -->
                    <Column header="Period" style="min-width: 8rem">
                        <template #body="{ data }">
                            <div class="leading-tight">
                                <div class="font-semibold text-sl">{{ formatDate(data.startPeriod) }} ⟶ {{ formatDate(data.endPeriod) }}</div>
                            </div>
                        </template>
                    </Column>

                    <!-- 💬 Message -->
                    <Column header="Message" style="min-width: 14rem">
                        <template #body="{ data }">
                            <div class="font-bold text-sl text-black-700 line-clamp-2">
                                {{ data.message || '-' }}
                            </div>
                        </template>
                    </Column>

                    <!-- 🔖 Status -->
                    <Column header="Status" style="min-width: 8rem">
                        <template #body="{ data }">
                            <div class="flex justify-start">
                                <Tag v-if="getTmdsStatus(data) !== '-'" :value="getTmdsStatus(data)" :severity="getTmdsStatusSeverity(data)" />
                                <span v-else class="font-bold text-sl text-black-700">-</span>
                            </div>
                        </template>
                    </Column>

                    <!-- ⚙️ Actions -->
                    <Column v-if="canUpdate" header="Action" style="min-width: 10rem" bodyClass="text-center">
                        <template #body="{ data }">
                            <div class="flex justify-left gap-2">
                                <Button icon="pi pi-pencil" class="p-button-text p-button-info p-button-sm" v-tooltip="'Edit'" @click="editItem(data, 'tmds')" />
                            </div>
                        </template>
                    </Column>
                </DataTable>
            </div>
        </template>

        <!-- 🟢 Edit Popup -->
        <Dialog v-model:visible="editPopupVisible" :header="editPopupTitle" modal class="rounded-2xl shadow-md" :style="{ width: '50rem', maxWidth: '95vw' }" :closable="false">
            <div class="p-fluid formgrid grid gap-4 mt-2" v-if="editingOrder">
                <!-- Storage Location -->
                <div class="field col-12">
                    <label for="storageLocations" class="font-semibold text-gray-700"> Storage Locations <span class="text-red-500">*</span> </label>
                    <InputText id="storageLocations" v-model="editingOrder.storageLocation" disabled class="w-full" />
                </div>

                <!-- Order Type -->
                <div class="field col-12">
                    <label for="orderTypes" class="font-semibold text-gray-700"> Order Types <span class="text-red-500">*</span> </label>
                    <MultiSelect
                        v-if="editingTab === 'normal'"
                        id="orderTypes"
                        v-model="editingOrder.orderType"
                        :options="orderTypeOptions"
                        optionLabel="label"
                        optionValue="value"
                        placeholder="Select Order Types"
                        display="chip"
                        class="w-full"
                        :class="{ 'p-invalid': submitted && (!editingOrder.orderType || editingOrder.orderType.length === 0) }"
                    />
                    <div v-else class="p-inputtext p-component w-full bg-gray-100 text-gray-700">Direct Shipment</div>
                    <small v-if="submitted && editingTab === 'normal' && (!editingOrder.orderType || editingOrder.orderType.length === 0)" class="p-error block mt-1">At least one Order Type is required</small>
                    <small class="text-gray-500 block mt-1" v-if="editingTab === 'normal'">Selecting ALL or all three types (NORMAL, OWN, DIRECTSHIP) will send as 'ALL'</small>
                    <small class="text-gray-500 block mt-1" v-else>Direct Shipment orders are fixed to DIRECTSHIP</small>
                </div>

                <!-- Start Date & Time -->
                <div class="field col-12 md:col-6">
                    <label for="startDate" class="font-semibold text-gray-700"> Start Date <span class="text-red-500">*</span> </label>
                    <Calendar id="startDate" v-model="editingOrder.startDate" :minDate="minDate" dateFormat="yy-mm-dd" placeholder="YYYY-MM-DD" class="w-full" :class="{ 'p-invalid': submitted && !editingOrder.startDate }" />
                    <small v-if="submitted && !editingOrder.startDate" class="p-error block mt-1">Start Date is required</small>
                </div>

                <div class="field col-12 md:col-6">
                    <label for="startTime" class="font-semibold text-gray-700"> Start Time <span class="text-red-500">*</span> </label>
                    <Calendar id="startTime" v-model="editingOrder.startTime" timeOnly hourFormat="24" placeholder="HH:MM" class="w-full" :class="{ 'p-invalid': submitted && !editingOrder.startTime }" />
                    <small v-if="submitted && !editingOrder.startTime" class="p-error block mt-1">Start Time is required</small>
                </div>

                <!-- End Date & Time -->
                <div class="field col-12 md:col-6">
                    <label for="endDate" class="font-semibold text-gray-700"> End Date <span class="text-red-500">*</span> </label>
                    <Calendar id="endDate" v-model="editingOrder.endDate" :minDate="editingOrder.startDate || minDate" dateFormat="yy-mm-dd" placeholder="YYYY-MM-DD" class="w-full" :class="{ 'p-invalid': submitted && !editingOrder.endDate }" />
                    <small v-if="submitted && !editingOrder.endDate" class="p-error block mt-1">End Date is required</small>
                </div>

                <div class="field col-12 md:col-6">
                    <label for="endTime" class="font-semibold text-gray-700"> End Time <span class="text-red-500">*</span> </label>
                    <Calendar id="endTime" v-model="editingOrder.endTime" timeOnly hourFormat="24" placeholder="HH:MM" class="w-full" :class="{ 'p-invalid': submitted && !editingOrder.endTime }" />
                    <small v-if="submitted && !editingOrder.endTime" class="p-error block mt-1">End Time is required</small>
                </div>

                <!-- Status -->
                <div class="field col-12">
                    <label class="font-semibold text-gray-700 mb-3 block">Status <span class="text-red-500">*</span></label>
                    <div class="flex gap-4">
                        <div class="flex items-center">
                            <RadioButton v-model="editingOrder.status" inputId="status_active" name="status" :value="1" :class="{ 'p-invalid': submitted && editingOrder.status === null }" />
                            <label for="status_active" class="ml-2">Close</label>
                        </div>
                        <div class="flex items-center">
                            <RadioButton v-model="editingOrder.status" inputId="status_inactive" name="status" :value="0" :class="{ 'p-invalid': submitted && editingOrder.status === null }" />
                            <label for="status_inactive" class="ml-2">Open</label>
                        </div>
                    </div>
                    <small v-if="submitted && editingOrder.status === null" class="p-error block mt-1">Status is required</small>
                </div>

                <!-- Message -->
                <div class="field col-12">
                    <label for="message" class="font-semibold text-gray-700">Message <span class="text-red-500">*</span></label>
                    <Textarea id="message" v-model="editingOrder.message" rows="3" autoResize placeholder="Enter message" class="w-full" :class="{ 'p-invalid': submitted && !editingOrder.message }" />
                    <small v-if="submitted && !editingOrder.message" class="p-error block mt-1">Message is required</small>
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
import { useMenuStore } from '@/store/menu';
import { computed } from 'vue';

export default {
    name: 'StorageLocationMaintenance',
    components: {
        LoadingPage
    },
    data() {
        return {
            activeTabIndex: 0,
            tabItems: [{ label: 'Normal Location' }, { label: 'TMDS Location' }],
            normalLocationOrders: [],
            tmdsLocationOrders: [],
            loading: false,
            updating: false,
            filters: { global: { value: null, matchMode: 'contains' } },
            editPopupVisible: false,
            submitted: false,
            editingOrder: null,
            editingTab: 'normal',
            orderTypeOptions: [
                { label: 'Normal', value: 'NORMAL' },
                { label: 'Own', value: 'OWN' },
                { label: 'Direct Shipment', value: 'DIRECTSHIP' },
                { label: 'All', value: 'ALL' }
            ]
        };
    },

    computed: {
        minDate() {
            return new Date();
        },
        canUpdate() {
            const menuStore = useMenuStore();
            return menuStore.canWrite('Storage Location Maintenance');
        },
        activeTabName() {
            return this.tabItems[this.activeTabIndex]?.label || 'Normal Location';
        },
        editPopupTitle() {
            return `Edit Disable Order - ${this.editingTab === 'normal' ? 'Normal Location' : 'TMDS Location'}`;
        }
    },

    methods: {
        async fetchOrders() {
            this.loading = true;
            try {
                // Fetch Normal Location Orders
                const normalResponse = await api.get('maintenance/list-disable-order');
                if (normalResponse.data.status === 1) {
                    this.normalLocationOrders = normalResponse.data.admin_data.map((item) => ({
                        ...item,
                        startPeriod: this.parseApiDate(item.startPeriod),
                        endPeriod: this.parseApiDate(item.endPeriod)
                    }));
                } else {
                    this.$toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to fetch normal location orders', life: 3000 });
                }

                // Fetch TMDS Location Orders
                const tmdsResponse = await api.get('maintenance/list-ds-disable-order');
                if (tmdsResponse.data.status === 1) {
                    this.tmdsLocationOrders = tmdsResponse.data.admin_data.map((item) => ({
                        ...item,
                        startPeriod: this.parseApiDate(item.startPeriod),
                        endPeriod: this.parseApiDate(item.endPeriod)
                    }));
                } else {
                    this.$toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to fetch TMDS location orders', life: 3000 });
                }
            } catch (error) {
                console.error('Error fetching orders:', error);
                this.$toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to fetch orders', life: 3000 });
            } finally {
                this.loading = false;
            }
        },

        parseApiDate(dateString) {
            if (!dateString) return null;
            return new Date(dateString.replace(' ', 'T'));
        },

        formatDate(date) {
            if (!date) return '-';
            const formatted = new Date(date).toLocaleString('en-MY', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            });
            return formatted.replace(/\b(am|pm)\b/gi, (match) => match.toUpperCase());
        },

        formatDateForApi(date) {
            if (!date) return null;
            return date.toISOString().split('T')[0];
        },

        formatTimeForApi(date) {
            if (!date) return null;
            return date.toTimeString().split(' ')[0].substring(0, 5);
        },

        // Normal Location Methods
        getStatus(order) {
            return order.status === 1 ? 'Close' : 'Open';
        },

        getStatusSeverity(order) {
            return order.status === 1 ? 'danger' : 'success';
        },

        normalizeOrderTypes(orderType) {
            if (Array.isArray(orderType)) return orderType;
            if (typeof orderType === 'string') return orderType.split(',').map((t) => t.trim().toUpperCase());
            return [];
        },

        getOrderTypeLabel(value) {
            const map = { OWN: 'Own Use', NORMAL: 'Normal', ALL: 'All', DIRECTSHIP: 'Direct Shipment' };
            return map[value] || value;
        },

        getOrderTypeTextColor(value) {
            switch (value) {
                case 'OWN':
                    return 'text-own-color';
                case 'NORMAL':
                    return 'text-normal-color';
                case 'ALL':
                    return 'text-all-color';
                case 'DIRECTSHIP':
                    return 'text-purple-600';
                default:
                    return 'text-gray-600';
            }
        },

        formatOrderTypesForApi(selectedTypes) {
            if (!selectedTypes || selectedTypes.length === 0) return '';
            const hasAll = selectedTypes.includes('ALL');
            const hasNormal = selectedTypes.includes('NORMAL');
            const hasOwn = selectedTypes.includes('OWN');
            const hasDirectship = selectedTypes.includes('DIRECTSHIP');
            if (hasAll || (hasNormal && hasOwn && hasDirectship)) {
                return 'ALL';
            }
            return selectedTypes.join(',');
        },

        // TMDS Location Methods
        getTmdsStatus(order) {
            if (!order.startPeriod || !order.endPeriod) return '-';
            const now = new Date();
            const start = new Date(order.startPeriod);
            const end = new Date(order.endPeriod);
            if (now < start) return 'Scheduled';
            if (now <= end) return 'Close';
            return 'Open';
        },

        getTmdsStatusSeverity(order) {
            const status = this.getTmdsStatus(order);
            switch (status) {
                case 'Scheduled':
                    return 'warning';
                case 'Close':
                    return 'danger';
                case 'Open':
                    return 'success';
                default:
                    return null;
            }
        },

        getTmdsOrderTypeLabel(value) {
            const map = { DIRECTSHIP: 'Direct Shipment' };
            return map[value] || value;
        },

        // Edit Methods
        editItem(item, tab) {
            this.editingTab = tab;

            // Parse the existing order
            const startDate = new Date(item.startPeriod);
            const endDate = new Date(item.endPeriod);

            this.editingOrder = {
                ...item,
                orderType: tab === 'normal' ? this.normalizeOrderTypes(item.orderType) : null,
                startDate: startDate,
                startTime: new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), startDate.getHours(), startDate.getMinutes()),
                endDate: endDate,
                endTime: new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate(), endDate.getHours(), endDate.getMinutes()),
                status: item.status
            };
            this.submitted = false;
            this.editPopupVisible = true;
        },

        hideEditPopup() {
            this.editPopupVisible = false;
            this.editingOrder = null;
            this.submitted = false;
        },

        async updateOrder() {
            this.submitted = true;

            // Validation based on tab
            const validation =
                this.editingTab === 'normal'
                    ? !this.editingOrder.storageLocation ||
                      !this.editingOrder.orderType ||
                      this.editingOrder.orderType.length === 0 ||
                      !this.editingOrder.startDate ||
                      !this.editingOrder.startTime ||
                      !this.editingOrder.endDate ||
                      !this.editingOrder.endTime ||
                      this.editingOrder.status === null ||
                      !this.editingOrder.message
                    : !this.editingOrder.storageLocation || !this.editingOrder.startDate || !this.editingOrder.startTime || !this.editingOrder.endDate || !this.editingOrder.endTime || this.editingOrder.status === null || !this.editingOrder.message;

            if (validation) {
                return;
            }

            // Validate date order
            const startDateTime = new Date(this.editingOrder.startDate);
            const startTime = new Date(this.editingOrder.startTime);
            startDateTime.setHours(startTime.getHours(), startTime.getMinutes());

            const endDateTime = new Date(this.editingOrder.endDate);
            const endTime = new Date(this.editingOrder.endTime);
            endDateTime.setHours(endTime.getHours(), endTime.getMinutes());

            if (endDateTime <= startDateTime) {
                this.$toast.add({ severity: 'error', summary: 'Error', detail: 'End date/time must be after start date/time', life: 3000 });
                return;
            }

            this.updating = true;
            try {
                const payload = {
                    storageloc: this.editingOrder.storageLocation,
                    ordertype: this.editingTab === 'normal' ? this.formatOrderTypesForApi(this.editingOrder.orderType) : 'DIRECTSHIP',
                    startdate: this.formatDateForApi(this.editingOrder.startDate),
                    starttime: this.formatTimeForApi(this.editingOrder.startTime),
                    enddate: this.formatDateForApi(this.editingOrder.endDate),
                    endtime: this.formatTimeForApi(this.editingOrder.endTime),
                    message: this.editingOrder.message,
                    status: this.editingOrder.status
                };

                console.log('Sending update payload:', payload);

                const endpoint = this.editingTab === 'normal' ? `maintenance/update-disable-order/${this.editingOrder.id}` : `maintenance/update-ds-disable-order/${this.editingOrder.id}`;

                const response = await api.post(endpoint, payload);
                if (response.data.status === 1) {
                    this.$toast.add({ severity: 'success', summary: 'Success', detail: 'Order updated successfully', life: 3000 });
                    this.hideEditPopup();
                    this.fetchOrders();
                } else {
                    this.$toast.add({ severity: 'error', summary: 'Error', detail: response.data.message || 'Failed to update order', life: 3000 });
                }
            } catch (error) {
                console.error('Error updating order:', error);
                this.$toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to update order', life: 3000 });
            } finally {
                this.updating = false;
            }
        }
    },

    async mounted() {
        await this.fetchOrders();
    },

    watch: {
        activeTabIndex() {
            // Clear search filter when switching tabs
            this.filters.global.value = null;
        }
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

.text-purple-600 {
    color: #6b21a8;
    font-weight: 700;
}

:deep(.p-dialog .p-dialog-header) {
    background-color: #f8f9fa;
    border-bottom: 1px solid #e9ecef;
}

:deep(.p-dialog .p-dialog-content) {
    padding: 1.5rem;
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

/* Custom TabMenu Styling */
:deep(.custom-tabmenu) {
    .p-tabmenu-nav {
        background: transparent;
        border: none;
        padding: 0;
    }

    .p-tabmenuitem {
        margin-right: 1rem;

        .p-menuitem-link {
            padding: 1rem 1.5rem;
            border: none;
            border-bottom: 3px solid transparent;
            background: transparent;
            color: #6b7280;
            font-weight: 500;
            transition: all 0.2s ease;

            &:not(.p-disabled):hover {
                background: #f3f4f6;
                border-color: #d1d5db;
                color: #374151;
            }

            &.p-highlight {
                border-color: #3b82f6;
                color: #3b82f6;
                background: transparent;

                &:hover {
                    border-color: #2563eb;
                    color: #2563eb;
                }
            }
        }
    }
}

/* Responsive improvements */
@media (max-width: 768px) {
    .flex-col {
        flex-direction: column;
    }

    .gap-2 > * {
        margin-bottom: 0.5rem;
    }

    :deep(.custom-tabmenu) {
        .p-tabmenuitem {
            margin-right: 0.5rem;

            .p-menuitem-link {
                padding: 0.75rem 1rem;
                font-size: 0.875rem;
            }
        }
    }
}
</style>