<template>
    <div class="card rounded-2xl shadow-sm">
        <!-- Header -->
        <div class="flex justify-between items-center mb-4">
            <h5 class="m-0 text-2xl font-bold text-gray-800">DO - Direct Shipment</h5>
        </div>

        <!-- 🟢 Loading Page -->
        <LoadingPage 
            v-if="loading" 
            :message="'Loading Disable Orders DS...'" 
            :sub-message="'Fetching your Disable Orders DS list'" 
        />

        <!-- DataTable -->
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

            <!-- Storage Location -->
            <Column header="Storage Location" style="min-width: 12rem">
                <template #body="{ data }">
                    <div class="text-sm text-gray-700">
                        {{ data.storageLocation }}
                    </div>
                </template>
            </Column>

            <!-- ✅ Order Type -->
            <Column header="Order Types" style="min-width: 12rem">
                <template #body="{ data }">
                    <div class="flex flex-wrap gap-2 items-center">
                        <!-- Direct Shipment (text only, maroon color) -->
                        <span
                            v-if="data.orderType === 'DIRECTSHIP'"
                            class="text-maroon-600 font-semibold"
                        >
                            Direct Shipment
                        </span>

                        <!-- Other order types -->
                        <Tag
                            v-else
                            :value="getOrderTypeLabel(data.orderType)"
                            :severity="getOrderTypeSeverity(data.orderType)"
                        />
                    </div>
                </template>
            </Column>

            <!-- Period -->
            <Column header="Period" style="min-width: 8rem">
                <template #body="{ data }">
                    <div class="text-sm leading-tight">
                        <div class="font-semibold">{{ formatDate(data.startPeriod) }}</div>
                        <div class="text-gray-500 text-xs">to</div>
                        <div class="font-semibold">{{ formatDate(data.endPeriod) }}</div>
                    </div>
                </template>
            </Column>

            <!-- ✅ Status -->
            <Column header="Status" style="min-width: 8rem">
                <template #body="{ data }">
                    <!-- Unknown: no tag -->
                    <span
                        v-if="getStatus(data) === 'Unknown'"
                        class="text-gray-500 italic font-medium"
                    >
                        Unknown
                    </span>

                    <!-- Normal statuses -->
                    <Tag
                        v-else
                        :value="getStatus(data)"
                        :severity="getStatusSeverity(data)"
                    />
                </template>
            </Column>

            <!-- Message -->
            <Column header="Message" style="min-width: 14rem">
                <template #body="{ data }">
                    <div class="text-sm text-gray-700 line-clamp-2">
                        {{ data.message }}
                    </div>
                </template>
            </Column>

            <!-- Actions -->
            <Column header="Actions" style="min-width: 10rem" bodyClass="text-center">
                <template #body="{ data }">
                    <div class="flex justify-center gap-2">
                        <Button icon="pi pi-pencil" class="p-button-text p-button-info p-button-sm" v-tooltip="'Edit'" @click="editItem(data)" />
                        <Button icon="pi pi-trash" class="p-button-text p-button-danger p-button-sm" v-tooltip="'Delete'" @click="deleteItem(data.id)" />
                    </div>
                </template>
            </Column>
        </DataTable>

        <!-- Create Popup -->
        <Dialog
            v-model:visible="createPopupVisible"
            header="Create Disable Order"
            modal
            class="rounded-2xl shadow-md"
            :style="{ width: '40rem', maxWidth: '95vw' }"
            :closable="false"
        >
            <div class="p-fluid formgrid grid gap-4 mt-2">
                <div class="field col-12">
                    <label class="font-semibold text-gray-700">Storage Location <span class="text-red-500">*</span></label>
                    <Dropdown
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

                <div class="field col-12">
                    <label class="font-semibold text-gray-700">Order Type <span class="text-red-500">*</span></label>
                    <Dropdown
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

                <div class="field col-12">
                    <label class="font-semibold text-gray-700">Period <span class="text-red-500">*</span></label>
                    <div class="flex gap-2 flex-col md:flex-row">
                        <Calendar
                            v-model="newOrder.startPeriod"
                            showTime
                            hourFormat="24"
                            :minDate="minDate"
                            placeholder="Start Date/Time"
                            class="flex-1"
                            :class="{ 'p-invalid': submitted && !newOrder.startPeriod }"
                        />
                        <Calendar
                            v-model="newOrder.endPeriod"
                            showTime
                            hourFormat="24"
                            :minDate="newOrder.startPeriod || minDate"
                            placeholder="End Date/Time"
                            class="flex-1"
                            :class="{ 'p-invalid': submitted && !newOrder.endPeriod }"
                        />
                    </div>
                    <small v-if="submitted && (!newOrder.startPeriod || !newOrder.endPeriod)" class="p-error block mt-1">
                        Both start and end date are required
                    </small>
                    <small v-if="newOrder.endPeriod && newOrder.startPeriod && newOrder.endPeriod <= newOrder.startPeriod" class="p-error block mt-1">
                        End date must be after start date
                    </small>
                </div>

                <div class="field col-12">
                    <label class="font-semibold text-gray-700">Message</label>
                    <Textarea v-model="newOrder.message" rows="3" autoResize placeholder="Enter message (optional)" class="w-full" />
                </div>
            </div>

            <template #footer>
                <div class="flex justify-end gap-3">
                    <Button label="Cancel" icon="pi pi-times" class="p-button-text text-gray-600 hover:text-gray-800" @click="hideCreatePopup" />
                    <Button label="Create" icon="pi pi-check" class="p-button-primary" @click="createNewOrder" :loading="creating" />
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
            filters1: {
                global: { value: null, matchMode: 'contains' }
            },
            createPopupVisible: false,
            submitted: false,
            newOrder: {
                storageLocation: null,
                orderType: null,
                startPeriod: null,
                endPeriod: null,
                message: ''
            },
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
                { label: 'Own Use', value: 'OWN' },
                { label: 'Direct Shipment', value: 'DIRECTSHIP' }
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
                const response = await api.get('maintenance/list-ds-disable-order');
                if (response.data.status === 1) {
                    this.disabledOrders = response.data.admin_data.map(item => ({
                        ...item,
                        startPeriod: this.parseApiDate(item.startPeriod),
                        endPeriod: this.parseApiDate(item.endPeriod)
                    }));
                }
            } catch (e) {
                console.error(e);
            } finally {
                this.loading = false;
            }
        },

        parseApiDate(dateString) {
            if (!dateString) return null;
            return new Date(dateString.replace(' ', 'T'));
        },

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
            if (!order.startPeriod || !order.endPeriod) return 'Unknown';
            const now = new Date();
            const start = new Date(order.startPeriod);
            const end = new Date(order.endPeriod);
            if (now < start) return 'Scheduled';
            if (now <= end) return 'Active';
            return 'Inactive';
        },

        getStatusSeverity(order) {
            switch (this.getStatus(order)) {
                case 'Scheduled':
                    return 'warning';
                case 'Active':
                    return 'success';
                case 'Inactive':
                    return 'danger';
                default:
                    return 'info';
            }
        },

        getOrderTypeLabel(value) {
            const map = { 
                'OWN': 'Own Use', 
                'NORMAL': 'Normal', 
                'ALL': 'All',
                'DIRECTSHIP': 'Direct Shipment'
            };
            return map[value] || value;
        },

        getOrderTypeSeverity(value) {
            switch (value) {
                case 'OWN': return 'success';
                case 'NORMAL': return 'info';
                case 'ALL': return 'warning';
                default: return 'secondary';
            }
        },

        showCreatePopup() {
            this.createPopupVisible = true;
            this.submitted = false;
        },

        hideCreatePopup() {
            this.createPopupVisible = false;
        }
    },
    mounted() {
        this.fetchDisabledOrders();
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

.text-maroon-600 {
    color: #030303; /* Maroon */
}

:deep(.p-dialog .p-dialog-header) {
    background-color: #f8f9fa;
    border-bottom: 1px solid #e9ecef;
}

:deep(.p-dialog .p-dialog-content) {
    padding: 1.5rem;
}

@media (max-width: 768px) {
    .flex-col {
        flex-direction: column;
    }
}
</style>
