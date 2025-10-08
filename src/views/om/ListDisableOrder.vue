<template>
    <Fluid>
        <div class="flex flex-col md:flex-row gap-8">
            <div class="card flex flex-col gap-6 w-full">
                <!-- Header -->
                <div class="text-2xl font-bold text-gray-800 border-b pb-2 mb-4">
                    List Disable Order
                </div>

                <!-- Action Buttons -->
                <div class="flex justify-between items-center mb-4">
                    <div class="flex gap-2">
                        <Button 
                            label="Add New Disable Order" 
                            icon="pi pi-plus" 
                            class="p-button-primary"
                            @click="showCreateDialog = true"
                        />
                    </div>
                    <div class="flex items-center gap-2">
                        <IconField>
                            <InputIcon>
                                <i class="pi pi-search" />
                            </InputIcon>
                            <InputText
                                v-model="filters.global.value"
                                placeholder="Search disabled orders..."
                                class="w-64"
                            />
                        </IconField>
                    </div>
                </div>

                <!-- Disabled Orders Table -->
                <DataTable 
                    :value="disabledOrders" 
                    :paginator="true" 
                    :rows="10"
                    :rowsPerPageOptions="[5, 10, 20, 50]"
                    dataKey="id" 
                    :rowHover="true"
                    :loading="loading"
                    :filters="filters"
                    responsiveLayout="scroll"
                >
                    <template #header>
                        <div class="flex justify-between items-center">
                            <span class="text-lg font-semibold">Disabled Orders Management</span>
                            <span class="text-sm text-gray-500">
                                Total: {{ disabledOrders.length }} records
                            </span>
                        </div>
                    </template>

                    <template #empty>
                        <div class="text-center text-gray-500 py-8">
                            <i class="pi pi-inbox text-4xl mb-2"></i>
                            <div>No disabled orders found.</div>
                            <Button 
                                label="Create First Disable Order" 
                                icon="pi pi-plus" 
                                class="p-button-outlined mt-4"
                                @click="showCreateDialog = true"
                            />
                        </div>
                    </template>

                    <template #loading>
                        <div class="text-center py-4">
                            <i class="pi pi-spinner pi-spin text-2xl mr-2"></i>
                            Loading disabled orders...
                        </div>
                    </template>

                    <Column header="Order Types" style="min-width: 12rem">
                        <template #body="{ data }">
                            <div class="flex flex-wrap gap-1">
                                <Tag 
                                    v-for="type in data.orderTypes" 
                                    :key="type"
                                    :value="type"
                                    class="text-xs"
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
                            <div class="text-sm">
                                <Badge :value="data.locations.length" class="mr-2" />
                                {{ data.locations.length }} locations
                            </div>
                        </template>
                    </Column>

                    <Column header="Period" style="min-width: 15rem">
                        <template #body="{ data }">
                            <div class="text-sm">
                                <div class="font-semibold text-gray-800">
                                    {{ formatDate(data.startDateTime) }}
                                </div>
                                <div class="text-gray-500 text-xs">to</div>
                                <div class="font-semibold text-gray-800">
                                    {{ formatDate(data.endDateTime) }}
                                </div>
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

                    <Column header="Message" style="min-width: 15rem">
                        <template #body="{ data }">
                            <div class="text-sm text-gray-700 line-clamp-2">
                                {{ data.message }}
                            </div>
                        </template>
                    </Column>

                    <Column header="Actions" style="min-width: 10rem">
                        <template #body="{ data }">
                            <div class="flex gap-1">
                                <Button 
                                    icon="pi pi-power-off" 
                                    class="p-button-success p-button-text p-button-sm" 
                                    v-tooltip="'Enable Order'"
                                    :disabled="getStatus(data) === 'Expired'"
                                    @click="enableOrder(data.id)" 
                                />
                                <Button 
                                    icon="pi pi-pencil" 
                                    class="p-button-info p-button-text p-button-sm" 
                                    v-tooltip="'Edit'"
                                    @click="editOrder(data)" 
                                />
                                <Button 
                                    icon="pi pi-trash" 
                                    class="p-button-danger p-button-text p-button-sm" 
                                    v-tooltip="'Delete'"
                                    @click="deleteOrder(data.id)" 
                                />
                            </div>
                        </template>
                    </Column>
                </DataTable>
            </div>
        </div>

        <!-- Create/Edit Dialog -->
        <Dialog 
            v-model:visible="showCreateDialog" 
            :header="editMode ? 'Edit Disable Order' : 'Create Disable Order'" 
            :modal="true"
            class="p-fluid" 
            :style="{ width: '50rem' }"
        >
            <div class="grid grid-cols-1 gap-4">
                <!-- Order Type -->
                <div>
                    <label class="block font-bold text-gray-700 mb-2">Order Type *</label>
                    <MultiSelect 
                        v-model="currentOrder.orderTypes" 
                        :options="orderTypeOptions" 
                        optionLabel="label"
                        placeholder="Select Order Types" 
                        class="w-full"
                        display="chip"
                    />
                </div>

                <!-- Maintenance Type -->
                <div>
                    <label class="block font-bold text-gray-700 mb-2">Maintenance Type *</label>
                    <Dropdown 
                        v-model="currentOrder.maintenanceType" 
                        :options="maintenanceTypeOptions" 
                        optionLabel="label"
                        optionValue="value"
                        placeholder="Select Maintenance Type" 
                        class="w-full" 
                    />
                </div>

                <!-- Locations -->
                <div v-if="currentOrder.maintenanceType">
                    <label class="block font-bold text-gray-700 mb-2">
                        {{ currentOrder.maintenanceType === 'shipping_point' ? 'Shipping Points' : 'Storage Locations' }} *
                    </label>
                    <MultiSelect 
                        v-model="currentOrder.locations" 
                        :options="currentOrder.maintenanceType === 'shipping_point' ? shippingPointOptions : storageLocationOptions" 
                        optionLabel="label"
                        optionValue="value"
                        filter 
                        display="chip" 
                        placeholder="Select Locations"
                        class="w-full"
                    />
                </div>

                <!-- Period -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="block font-bold text-gray-700 mb-2">Start Date & Time *</label>
                        <Calendar 
                            v-model="currentOrder.startDateTime" 
                            showTime 
                            hourFormat="24" 
                            placeholder="Select Start Date/Time"
                            class="w-full"
                        />
                    </div>
                    <div>
                        <label class="block font-bold text-gray-700 mb-2">End Date & Time *</label>
                        <Calendar 
                            v-model="currentOrder.endDateTime" 
                            showTime 
                            hourFormat="24" 
                            placeholder="Select End Date/Time"
                            class="w-full"
                        />
                    </div>
                </div>

                <!-- Message -->
                <div>
                    <label class="block font-bold text-gray-700 mb-2">Message *</label>
                    <Textarea 
                        v-model="currentOrder.message" 
                        rows="3" 
                        placeholder="Enter maintenance message..."
                        class="w-full" 
                        :autoResize="true"
                    />
                </div>
            </div>

            <template #footer>
                <Button 
                    label="Cancel" 
                    icon="pi pi-times" 
                    class="p-button-text" 
                    @click="closeDialog" 
                />
                <Button 
                    :label="editMode ? 'Update' : 'Turn On Disable'" 
                    icon="pi pi-check" 
                    class="p-button-primary"
                    :disabled="!isDialogFormValid"
                    @click="saveOrder" 
                />
            </template>
        </Dialog>
    </Fluid>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { FilterMatchMode } from '@primevue/core/api';

const loading = ref(false);
const showCreateDialog = ref(false);
const editMode = ref(false);

// Filters for search
const filters = reactive({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});

// Current order for create/edit
const currentOrder = reactive({
    orderTypes: [],
    maintenanceType: '',
    locations: [],
    startDateTime: null,
    endDateTime: null,
    message: ''
});

// Sample data
const disabledOrders = ref([
    {
        id: 1,
        orderTypes: ['Normal', 'Clearance'],
        maintenanceType: 'shipping_point',
        locations: ['SP001', 'SP002'],
        startDateTime: new Date('2024-01-20T08:00:00'),
        endDateTime: new Date('2024-01-20T12:00:00'),
        message: 'System maintenance for shipping points SP001 and SP002'
    },
    {
        id: 2,
        orderTypes: ['Direct Shipment'],
        maintenanceType: 'storage_location',
        locations: ['SL001'],
        startDateTime: new Date('2024-01-21T14:00:00'),
        endDateTime: new Date('2024-01-21T16:00:00'),
        message: 'Inventory counting for storage location SL001'
    },
    {
        id: 3,
        orderTypes: ['Both'],
        maintenanceType: 'shipping_point',
        locations: ['SP003', 'SP004', 'SP005'],
        startDateTime: new Date('2024-01-22T09:00:00'),
        endDateTime: new Date('2024-01-22T11:00:00'),
        message: 'Regular maintenance schedule for multiple shipping points'
    }
]);

// Options
const orderTypeOptions = ref([
    { label: 'Clearance', value: 'Clearance' },
    { label: 'Direct Shipment', value: 'Direct Shipment' },
    { label: 'Normal', value: 'Normal' },
    { label: 'Both', value: 'Both' }
]);

const maintenanceTypeOptions = ref([
    { label: 'Shipping Point', value: 'shipping_point' },
    { label: 'Storage Location', value: 'storage_location' }
]);

const shippingPointOptions = ref([
    { label: 'SP001 - Main Warehouse', value: 'SP001' },
    { label: 'SP002 - North Region', value: 'SP002' },
    { label: 'SP003 - South Region', value: 'SP003' },
    { label: 'SP004 - East Region', value: 'SP004' },
    { label: 'SP005 - West Region', value: 'SP005' }
]);

const storageLocationOptions = ref([
    { label: 'SL001 - Finished Goods', value: 'SL001' },
    { label: 'SL002 - Raw Materials', value: 'SL002' },
    { label: 'SL003 - Spare Parts', value: 'SL003' },
    { label: 'SL004 - Returns', value: 'SL004' },
    { label: 'SL005 - Quality Control', value: 'SL005' }
]);

// Computed properties
const isDialogFormValid = computed(() => {
    return currentOrder.orderTypes.length > 0 && 
           currentOrder.maintenanceType !== '' && 
           currentOrder.locations.length > 0 && 
           currentOrder.startDateTime && 
           currentOrder.endDateTime && 
           currentOrder.message.trim() !== '' &&
           currentOrder.startDateTime < currentOrder.endDateTime;
});

// Methods
const formatDate = (date) => {
    return new Date(date).toLocaleString('en-MY', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

const getStatus = (order) => {
    const now = new Date();
    const start = new Date(order.startDateTime);
    const end = new Date(order.endDateTime);
    
    if (now < start) return 'Scheduled';
    if (now >= start && now <= end) return 'Active';
    return 'Expired';
};

const getStatusSeverity = (order) => {
    const status = getStatus(order);
    switch (status) {
        case 'Scheduled': return 'warning';
        case 'Active': return 'danger';
        case 'Expired': return 'secondary';
        default: return 'info';
    }
};

const getOrderTypeSeverity = (type) => {
    switch (type) {
        case 'Clearance': return 'warning';
        case 'Direct Shipment': return 'info';
        case 'Normal': return 'success';
        case 'Both': return 'danger';
        default: return 'secondary';
    }
};

const enableOrder = (id) => {
    const order = disabledOrders.value.find(order => order.id === id);
    if (order && confirm(`Are you sure you want to enable orders for this maintenance period?`)) {
        disabledOrders.value = disabledOrders.value.filter(order => order.id !== id);
        // Show success message
        console.log(`Order ${id} has been enabled`);
    }
};

const editOrder = (order) => {
    editMode.value = true;
    Object.assign(currentOrder, {
        orderTypes: order.orderTypes,
        maintenanceType: order.maintenanceType,
        locations: order.locations,
        startDateTime: new Date(order.startDateTime),
        endDateTime: new Date(order.endDateTime),
        message: order.message
    });
    showCreateDialog.value = true;
};

const deleteOrder = (id) => {
    if (confirm('Are you sure you want to delete this disabled order entry?')) {
        disabledOrders.value = disabledOrders.value.filter(order => order.id !== id);
        console.log(`Order ${id} has been deleted`);
    }
};

const saveOrder = () => {
    if (editMode.value) {
        // Update existing order
        const index = disabledOrders.value.findIndex(order => 
            order.orderTypes.join() === currentOrder.orderTypes.join() &&
            order.maintenanceType === currentOrder.maintenanceType
        );
        if (index !== -1) {
            disabledOrders.value[index] = {
                ...disabledOrders.value[index],
                ...currentOrder,
                orderTypes: [...currentOrder.orderTypes],
                locations: [...currentOrder.locations]
            };
        }
    } else {
        // Create new order
        const newOrder = {
            id: Date.now(),
            orderTypes: [...currentOrder.orderTypes],
            maintenanceType: currentOrder.maintenanceType,
            locations: [...currentOrder.locations],
            startDateTime: new Date(currentOrder.startDateTime),
            endDateTime: new Date(currentOrder.endDateTime),
            message: currentOrder.message
        };
        disabledOrders.value.unshift(newOrder);
    }
    
    closeDialog();
    console.log('Order saved:', currentOrder);
};

const closeDialog = () => {
    showCreateDialog.value = false;
    editMode.value = false;
    // Reset form
    Object.assign(currentOrder, {
        orderTypes: [],
        maintenanceType: '',
        locations: [],
        startDateTime: null,
        endDateTime: null,
        message: ''
    });
};

// Initialize
onMounted(() => {
    // Simulate loading
    loading.value = true;
    setTimeout(() => {
        loading.value = false;
    }, 1000);
});
</script>