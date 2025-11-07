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

            <!-- 💬 Message -->
            <Column header="Message" style="min-width: 14rem">
                <template #body="{ data }">
                    <div class="text-sm text-gray-700 line-clamp-2">
                        {{ data.message || '-' }}
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
        <Dialog v-model:visible="createPopupVisible" header="Create Disable Order" modal class="rounded-2xl shadow-md" :style="{ width: '50rem', maxWidth: '95vw' }" :closable="false">
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

                <!-- Order Type - MultiSelect -->
                <div class="field col-12">
                    <label for="orderTypes" class="font-semibold text-gray-700"> Order Types <span class="text-red-500">*</span> </label>
                    <MultiSelect
                        id="orderTypes"
                        v-model="newOrder.orderType"
                        :options="orderTypeOptions"
                        optionLabel="label"
                        optionValue="value"
                        placeholder="Select Order Types"
                        display="chip"
                        class="w-full"
                        :class="{ 'p-invalid': submitted && (!newOrder.orderType || newOrder.orderType.length === 0) }"
                    />
                    <small v-if="submitted && (!newOrder.orderType || newOrder.orderType.length === 0)" class="p-error block mt-1">At least one Order Type is required</small>
                    <small class="text-gray-500 block mt-1">Selecting ALL or all three types (NORMAL, OWN, DIRECTSHIP) will send as 'ALL'</small>
                </div>

                <!-- Start Date & Time -->
                <div class="field col-12 md:col-6">
                    <label for="startDate" class="font-semibold text-gray-700"> Start Date <span class="text-red-500">*</span> </label>
                    <Calendar
                        id="startDate"
                        v-model="newOrder.startDate"
                        :minDate="minDate"
                        dateFormat="yy-mm-dd"
                        placeholder="YYYY-MM-DD"
                        class="w-full"
                        :class="{ 'p-invalid': submitted && !newOrder.startDate }"
                    />
                    <small v-if="submitted && !newOrder.startDate" class="p-error block mt-1">Start Date is required</small>
                </div>

                <div class="field col-12 md:col-6">
                    <label for="startTime" class="font-semibold text-gray-700"> Start Time <span class="text-red-500">*</span> </label>
                    <Calendar
                        id="startTime"
                        v-model="newOrder.startTime"
                        timeOnly
                        hourFormat="24"
                        placeholder="HH:MM"
                        class="w-full"
                        :class="{ 'p-invalid': submitted && !newOrder.startTime }"
                    />
                    <small v-if="submitted && !newOrder.startTime" class="p-error block mt-1">Start Time is required</small>
                </div>

                <!-- End Date & Time -->
                <div class="field col-12 md:col-6">
                    <label for="endDate" class="font-semibold text-gray-700"> End Date <span class="text-red-500">*</span> </label>
                    <Calendar
                        id="endDate"
                        v-model="newOrder.endDate"
                        :minDate="newOrder.startDate || minDate"
                        dateFormat="yy-mm-dd"
                        placeholder="YYYY-MM-DD"
                        class="w-full"
                        :class="{ 'p-invalid': submitted && !newOrder.endDate }"
                    />
                    <small v-if="submitted && !newOrder.endDate" class="p-error block mt-1">End Date is required</small>
                </div>

                <div class="field col-12 md:col-6">
                    <label for="endTime" class="font-semibold text-gray-700"> End Time <span class="text-red-500">*</span> </label>
                    <Calendar
                        id="endTime"
                        v-model="newOrder.endTime"
                        timeOnly
                        hourFormat="24"
                        placeholder="HH:MM"
                        class="w-full"
                        :class="{ 'p-invalid': submitted && !newOrder.endTime }"
                    />
                    <small v-if="submitted && !newOrder.endTime" class="p-error block mt-1">End Time is required</small>
                </div>

                <!-- Status -->
                <div class="field col-12">
                    <label class="font-semibold text-gray-700 mb-3 block">Status <span class="text-red-500">*</span></label>
                    <div class="flex gap-4">
                        <div class="flex items-center">
                            <RadioButton 
                                v-model="newOrder.status" 
                                inputId="status_active" 
                                name="status" 
                                :value="1" 
                                :class="{ 'p-invalid': submitted && newOrder.status === null }"
                            />
                            <label for="status_active" class="ml-2">Active</label>
                        </div>
                        <div class="flex items-center">
                            <RadioButton 
                                v-model="newOrder.status" 
                                inputId="status_inactive" 
                                name="status" 
                                :value="0" 
                                :class="{ 'p-invalid': submitted && newOrder.status === null }"
                            />
                            <label for="status_inactive" class="ml-2">Inactive</label>
                        </div>
                    </div>
                    <small v-if="submitted && newOrder.status === null" class="p-error block mt-1">Status is required</small>
                </div>

                <!-- Message -->
                <div class="field col-12">
                    <label for="message" class="font-semibold text-gray-700">Message <span class="text-red-500">*</span></label>
                    <Textarea 
                        id="message" 
                        v-model="newOrder.message" 
                        rows="3" 
                        autoResize 
                        placeholder="Enter message" 
                        class="w-full" 
                        :class="{ 'p-invalid': submitted && !newOrder.message }"
                    />
                    <small v-if="submitted && !newOrder.message" class="p-error block mt-1">Message is required</small>
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
        <Dialog v-model:visible="editPopupVisible" header="Edit Disable Order" modal class="rounded-2xl shadow-md" :style="{ width: '50rem', maxWidth: '95vw' }" :closable="false">
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

                <!-- Order Type - MultiSelect -->
                <div class="field col-12">
                    <label for="editOrderTypes" class="font-semibold text-gray-700"> Order Types <span class="text-red-500">*</span> </label>
                    <MultiSelect
                        id="editOrderTypes"
                        v-model="editingOrder.orderType"
                        :options="orderTypeOptions"
                        optionLabel="label"
                        optionValue="value"
                        placeholder="Select Order Types"
                        display="chip"
                        class="w-full"
                        :class="{ 'p-invalid': submitted && (!editingOrder.orderType || editingOrder.orderType.length === 0) }"
                    />
                    <small v-if="submitted && (!editingOrder.orderType || editingOrder.orderType.length === 0)" class="p-error block mt-1">At least one Order Type is required</small>
                    <small class="text-gray-500 block mt-1">Selecting ALL or all three types (NORMAL, OWN, DIRECTSHIP) will send as 'ALL'</small>
                </div>

                <!-- Start Date & Time -->
                <div class="field col-12 md:col-6">
                    <label for="editStartDate" class="font-semibold text-gray-700"> Start Date <span class="text-red-500">*</span> </label>
                    <Calendar
                        id="editStartDate"
                        v-model="editingOrder.startDate"
                        :minDate="minDate"
                        dateFormat="yy-mm-dd"
                        placeholder="YYYY-MM-DD"
                        class="w-full"
                        :class="{ 'p-invalid': submitted && !editingOrder.startDate }"
                    />
                    <small v-if="submitted && !editingOrder.startDate" class="p-error block mt-1">Start Date is required</small>
                </div>

                <div class="field col-12 md:col-6">
                    <label for="editStartTime" class="font-semibold text-gray-700"> Start Time <span class="text-red-500">*</span> </label>
                    <Calendar
                        id="editStartTime"
                        v-model="editingOrder.startTime"
                        timeOnly
                        hourFormat="24"
                        placeholder="HH:MM"
                        class="w-full"
                        :class="{ 'p-invalid': submitted && !editingOrder.startTime }"
                    />
                    <small v-if="submitted && !editingOrder.startTime" class="p-error block mt-1">Start Time is required</small>
                </div>

                <!-- End Date & Time -->
                <div class="field col-12 md:col-6">
                    <label for="editEndDate" class="font-semibold text-gray-700"> End Date <span class="text-red-500">*</span> </label>
                    <Calendar
                        id="editEndDate"
                        v-model="editingOrder.endDate"
                        :minDate="editingOrder.startDate || minDate"
                        dateFormat="yy-mm-dd"
                        placeholder="YYYY-MM-DD"
                        class="w-full"
                        :class="{ 'p-invalid': submitted && !editingOrder.endDate }"
                    />
                    <small v-if="submitted && !editingOrder.endDate" class="p-error block mt-1">End Date is required</small>
                </div>

                <div class="field col-12 md:col-6">
                    <label for="editEndTime" class="font-semibold text-gray-700"> End Time <span class="text-red-500">*</span> </label>
                    <Calendar
                        id="editEndTime"
                        v-model="editingOrder.endTime"
                        timeOnly
                        hourFormat="24"
                        placeholder="HH:MM"
                        class="w-full"
                        :class="{ 'p-invalid': submitted && !editingOrder.endTime }"
                    />
                    <small v-if="submitted && !editingOrder.endTime" class="p-error block mt-1">End Time is required</small>
                </div>

                <!-- Status -->
                <div class="field col-12">
                    <label class="font-semibold text-gray-700 mb-3 block">Status <span class="text-red-500">*</span></label>
                    <div class="flex gap-4">
                        <div class="flex items-center">
                            <RadioButton 
                                v-model="editingOrder.status" 
                                inputId="editStatus_active" 
                                name="editStatus" 
                                :value="1" 
                                :class="{ 'p-invalid': submitted && editingOrder.status === null }"
                            />
                            <label for="editStatus_active" class="ml-2">Active</label>
                        </div>
                        <div class="flex items-center">
                            <RadioButton 
                                v-model="editingOrder.status" 
                                inputId="editStatus_inactive" 
                                name="editStatus" 
                                :value="0" 
                                :class="{ 'p-invalid': submitted && editingOrder.status === null }"
                            />
                            <label for="editStatus_inactive" class="ml-2">Inactive</label>
                        </div>
                    </div>
                    <small v-if="submitted && editingOrder.status === null" class="p-error block mt-1">Status is required</small>
                </div>

                <!-- Message -->
                <div class="field col-12">
                    <label for="editMessage" class="font-semibold text-gray-700">Message <span class="text-red-500">*</span></label>
                    <Textarea 
                        id="editMessage" 
                        v-model="editingOrder.message" 
                        rows="3" 
                        autoResize 
                        placeholder="Enter message" 
                        class="w-full" 
                        :class="{ 'p-invalid': submitted && !editingOrder.message }"
                    />
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
            newOrder: { 
                storageLocation: null, 
                orderType: [], 
                startDate: null, 
                startTime: null, 
                endDate: null, 
                endTime: null, 
                message: '',
                status: 1
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
                { label: 'Own', value: 'OWN' },
                { label: 'Directship', value: 'DIRECTSHIP' },
                { label: 'All', value: 'ALL' }
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

        formatDateForApi(date) {
            if (!date) return null;
            return date.toISOString().split('T')[0]; // YYYY-MM-DD
        },

        formatTimeForApi(date) {
            if (!date) return null;
            return date.toTimeString().split(' ')[0].substring(0, 5); // HH:MM
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
                    return null;
            }
        },

        // 🟨🟧⚪ Order Type Helpers
        normalizeOrderTypes(orderType) {
            if (Array.isArray(orderType)) return orderType;
            if (typeof orderType === 'string') return orderType.split(',').map((t) => t.trim().toUpperCase());
            return [];
        },

        getOrderTypeLabel(value) {
            const map = { OWN: 'Own Use', NORMAL: 'Normal', ALL: 'All', DIRECTSHIP: 'Directship' };
            return map[value] || value;
        },

        getOrderTypeTextColor(value) {
            switch (value) {
                case 'OWN': return 'text-own-color';
                case 'NORMAL': return 'text-normal-color';
                case 'ALL': return 'text-all-color';
                case 'DIRECTSHIP': return 'text-purple-600';
                default: return 'text-gray-600';
            }
        },

        // Format order types for API
        formatOrderTypesForApi(selectedTypes) {
            if (!selectedTypes || selectedTypes.length === 0) return '';
            
            // Check if ALL is selected or all three types (NORMAL, OWN, DIRECTSHIP) are selected
            const hasAll = selectedTypes.includes('ALL');
            const hasNormal = selectedTypes.includes('NORMAL');
            const hasOwn = selectedTypes.includes('OWN');
            const hasDirectship = selectedTypes.includes('DIRECTSHIP');
            
            // If ALL is selected OR all three types are selected, send 'ALL'
            if (hasAll || (hasNormal && hasOwn && hasDirectship)) {
                return 'ALL';
            }
            
            // Otherwise, send the selected types as comma-separated string
            return selectedTypes.join(',');
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
                storageLocation: null, 
                orderType: [], 
                startDate: null, 
                startTime: null, 
                endDate: null, 
                endTime: null, 
                message: '',
                status: 1
            };
            this.submitted = false;
        },

        async createNewOrder() {
            this.submitted = true;
            
            // Validation
            if (!this.newOrder.storageLocation || 
                !this.newOrder.orderType || 
                this.newOrder.orderType.length === 0 ||
                !this.newOrder.startDate ||
                !this.newOrder.startTime ||
                !this.newOrder.endDate ||
                !this.newOrder.endTime ||
                this.newOrder.status === null ||
                !this.newOrder.message) {
                return;
            }

            // Validate date order
            const startDateTime = new Date(this.newOrder.startDate);
            const startTime = new Date(this.newOrder.startTime);
            startDateTime.setHours(startTime.getHours(), startTime.getMinutes());

            const endDateTime = new Date(this.newOrder.endDate);
            const endTime = new Date(this.newOrder.endTime);
            endDateTime.setHours(endTime.getHours(), endTime.getMinutes());

            if (endDateTime <= startDateTime) {
                this.$toast.add({ severity: 'error', summary: 'Error', detail: 'End date/time must be after start date/time', life: 3000 });
                return;
            }

            this.creating = true;
            try {
                const payload = {
                    storageloc: this.newOrder.storageLocation,
                    ordertype: this.formatOrderTypesForApi(this.newOrder.orderType),
                    startdate: this.formatDateForApi(this.newOrder.startDate),
                    starttime: this.formatTimeForApi(this.newOrder.startTime),
                    enddate: this.formatDateForApi(this.newOrder.endDate),
                    endtime: this.formatTimeForApi(this.newOrder.endTime),
                    message: this.newOrder.message,
                    status: this.newOrder.status
                };

                console.log('Sending payload:', payload);

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
            // Parse the existing order type
            const orderTypes = this.normalizeOrderTypes(item.orderType);
            
            // Parse dates and times from the existing period
            const startDate = new Date(item.startPeriod);
            const endDate = new Date(item.endPeriod);

            this.editingOrder = { 
                ...item, 
                orderType: orderTypes,
                startDate: startDate,
                startTime: new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), startDate.getHours(), startDate.getMinutes()),
                endDate: endDate,
                endTime: new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate(), endDate.getHours(), endDate.getMinutes()),
                status: item.status
            };
            this.editPopupVisible = true;
            this.submitted = false;
        },

        async updateOrder() {
            this.submitted = true;
            
            // Validation
            if (!this.editingOrder.storageLocation || 
                !this.editingOrder.orderType || 
                this.editingOrder.orderType.length === 0 ||
                !this.editingOrder.startDate ||
                !this.editingOrder.startTime ||
                !this.editingOrder.endDate ||
                !this.editingOrder.endTime ||
                this.editingOrder.status === null ||
                !this.editingOrder.message) {
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
                    ordertype: this.formatOrderTypesForApi(this.editingOrder.orderType),
                    startdate: this.formatDateForApi(this.editingOrder.startDate),
                    starttime: this.formatTimeForApi(this.editingOrder.startTime),
                    enddate: this.formatDateForApi(this.editingOrder.endDate),
                    endtime: this.formatTimeForApi(this.editingOrder.endTime),
                    message: this.editingOrder.message,
                    status: this.editingOrder.status
                };

                console.log('Sending update payload:', payload);

                const response = await api.post(`maintenance/update-disable-order/${this.editingOrder.id}`, payload);
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