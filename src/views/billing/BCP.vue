<template>
    <ConfirmDialog v-if="!confirmDialogMounted" />

    <div class="card p-6 space-y-6">
        <div class="text-2xl font-bold text-gray-800 border-b pb-2">Business Contingency Plan (BCP)</div>

        <!-- Step Indicators -->
        <div class="flex items-center space-x-4 mb-8">
            <div class="flex items-center space-x-2">
                <div class="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center">1</div>
                <div class="font-semibold">Enter Details</div>
            </div>
            <div class="flex-1 border-t"></div>
            <div class="flex items-center space-x-2" :class="sapDetails ? 'opacity-100' : 'opacity-40'">
                <div class="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center">2</div>
                <div class="font-semibold">SAP Details</div>
            </div>
            <div class="flex-1 border-t"></div>
            <div class="flex items-center space-x-2" :class="etenResult ? 'opacity-100' : 'opacity-40'">
                <div class="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center">3</div>
                <div class="font-semibold">ETEN Created</div>
            </div>
        </div>

        <!-- Step 1: Form Inputs -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="space-y-2">
                <label class="block font-bold text-gray-700">Customer Account No *</label>
                <InputText v-model="form.custaccountno" class="w-full" placeholder="e.g., CUST001" :class="{ 'p-invalid': fieldErrors.custaccountno }" @input="clearFieldError('custaccountno')" />
                <small v-if="fieldErrors.custaccountno" class="text-red-500">{{ fieldErrors.custaccountno }}</small>
            </div>
            <div class="space-y-2">
                <label class="block font-bold text-gray-700">ETEN Order No *</label>
                <InputText v-model="form.orderno" class="w-full" placeholder="e.g., ETEN001" :class="{ 'p-invalid': fieldErrors.orderno }" @input="clearFieldError('orderno')" />
                <small v-if="fieldErrors.orderno" class="text-red-500">{{ fieldErrors.orderno }}</small>
                <small class="text-gray-500 text-xs block">
                    <i class="pi pi-info-circle mr-1"></i>
                    Enter new ETEN order number to create
                </small>
            </div>

            <div class="space-y-2">
                <label class="block font-bold text-gray-700">SAP Sales Order No *</label>
                <InputText v-model="form.saporderno" class="w-full" placeholder="e.g., SO123456" :class="{ 'p-invalid': fieldErrors.saporderno }" @input="clearFieldError('saporderno')" />
                <small v-if="fieldErrors.saporderno" class="text-red-500">{{ fieldErrors.saporderno }}</small>
            </div>
        </div>

        <!-- Order Description Dropdown -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="space-y-2">
                <label class="block font-bold text-gray-700">Order Description *</label>
                <Dropdown
                    v-model="form.orderdesc"
                    :options="orderDescOptions"
                    optionLabel="label"
                    optionValue="value"
                    placeholder="Select Order Description"
                    class="w-full"
                    :class="{ 'p-invalid': fieldErrors.orderdesc }"
                    @change="clearFieldError('orderdesc')"
                />
                <small v-if="fieldErrors.orderdesc" class="text-red-500">{{ fieldErrors.orderdesc }}</small>
                <small class="text-gray-500 text-xs block">
                    <i class="pi pi-info-circle mr-1"></i>
                    Order description type for SAP
                </small>
            </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-col md:flex-row gap-4 mt-8">
            <Button label="Check SAP Details" icon="pi pi-search" class="w-full md:w-auto" @click="checkSAPDetails" :loading="loading.sapCheck" :disabled="!form.orderno || !form.custaccountno || !form.saporderno || !form.orderdesc" severity="info" />

            <Button label="Clear Form" icon="pi pi-times" class="w-full md:w-auto p-button-outlined" @click="resetForm" severity="secondary" />
        </div>

        <!-- Warning for duplicate order -->
        <div v-if="isDuplicateOrder" class="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div class="flex items-center">
                <i class="pi pi-exclamation-triangle mr-2 text-yellow-500"></i>
                <div>
                    <span class="font-medium text-yellow-700">Order Already Exists</span>
                    <p class="text-yellow-600 text-sm mt-1">This ETEN order number already exists in the system. Please use a different ETEN order number.</p>
                </div>
            </div>
        </div>

        <!-- Error Message -->
        <div v-if="errorMessage" class="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div class="flex items-center">
                <i class="pi pi-exclamation-triangle mr-2 text-red-500"></i>
                <div>
                    <span class="font-medium text-red-700">Error</span>
                    <p class="text-red-600 text-sm mt-1">{{ errorMessage }}</p>
                </div>
            </div>
        </div>

        <!-- Loading State for SAP Details -->
        <div v-if="loading.sapCheck" class="mt-6 border rounded-lg p-8 bg-gray-50">
            <div class="flex flex-col items-center justify-center space-y-4">
                <ProgressSpinner style="width: 40px; height: 40px" strokeWidth="4" />
                <div class="text-center">
                    <div class="text-gray-700 font-medium">Fetching SAP Order Details</div>
                    <div class="text-gray-500 text-sm mt-1">Checking order: {{ form.orderno }} | Customer: {{ form.custaccountno }} | SAP: {{ form.saporderno }} | Type: {{ getOrderDescLabel(form.orderdesc) }}</div>
                </div>
            </div>
        </div>

        <div v-if="sapDetails && sapDetails.admin_data && !isDuplicateOrder" class="flex flex-col w-full">
            <!-- Sales Order Details -->
            <div class="card p-4">
                <div class="text-xl font-bold text-primary-600 border-b pb-2 mb-4">📄 Sales Order Details</div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="block font-bold text-gray-700">Customer Account</label>
                        <p class="text-gray-900">{{ sapDetails.admin_data.custaccountno || 'N/A' }}</p>
                    </div>
                    <div>
                        <label class="block font-bold text-gray-700">Ship To</label>
                        <p class="text-gray-900">{{ sapDetails.admin_data.shipto || 'N/A' }}</p>
                    </div>
                    <div>
                        <label class="block font-bold text-gray-700">SAP Order No</label>
                        <p class="text-gray-900">{{ sapDetails.admin_data.saporderno || 'N/A' }}</p>
                    </div>
                    <div>
                        <label class="block font-bold text-gray-700">ETEN Order No</label>
                        <p class="text-green-600 font-semibold">{{ sapDetails.admin_data.etenorderno || 'N/A' }}</p>
                    </div>
                    <div>
                        <label class="block font-bold text-gray-700">Order Description</label>
                        <p class="text-gray-900">{{ sapDetails.admin_data.orderdesc || 'N/A' }}</p>
                    </div>
                </div>
            </div>

            <!-- SAP Information -->
            <div class="card p-4">
                <div class="text-xl font-bold text-primary-600 border-b pb-2 mb-4">ℹ️ Order Information</div>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label class="block font-bold text-gray-700">Order Dates</label>
                        <p class="text-gray-900">{{ formatDate(sapDetails.admin_data.orderdate) }}</p>
                    </div>
                    <div>
                        <label class="block font-bold text-gray-700">Request Delivery Date</label>
                        <p class="text-gray-900">{{ formatDate(sapDetails.admin_data.requestdeliverydate) }}</p>
                    </div>
                    <div>
                        <label class="block font-bold text-gray-700">Sales Organization</label>
                        <p class="text-gray-900">{{ sapDetails.admin_data.salesorg }}</p>
                    </div>
                    <div>
                        <label class="block font-bold text-gray-700">Price Group</label>
                        <p class="text-gray-900">{{ sapDetails.admin_data.pricegroup || '-' }}</p>
                    </div>
                    <div>
                        <label class="block font-bold text-gray-700">Shipping Condition</label>

                        <p class="text-gray-900">{{ sapDetails.admin_data.shippingcond || '-' }}</p>
                    </div>
                    <div>
                        <label class="block font-bold text-gray-700">Storage Location</label>

                        <p class="text-gray-900">{{ sapDetails.admin_data.storagelocation || '-' }}</p>
                    </div>
                </div>
            </div>

            <!-- Order Items -->
            <div class="card p-4">
                <div class="text-xl font-bold text-primary-600 border-b pb-2 mb-4">📦 Order Items ({{ sapItems.length }})</div>
                <DataTable :value="sapItems" class="p-datatable-sm" stripedRows :paginator="sapItems.length > 5" :rows="5">
                    <Column field="materialid" header="Material ID" />
                    <Column field="qty" header="Quantity" />
                    <Column field="unitprice" header="Unit Price">
                        <template #body="{ data }">RM {{ formatCurrency(data.unitprice || 0) }}</template>
                    </Column>
                    <Column field="totalamount" header="Total Amount">
                        <template #body="{ data }" class="text-right text-green-600 font-medium">RM {{ formatCurrency(data.totalamount || 0) }}</template>
                    </Column>
                </DataTable>

                <div class="flex justify-end mt-4 text-lg font-bold text-primary-600">Total: RM {{ formatCurrency(calculateTotalItemsValue()) }}</div>
            </div>
            <div class="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div class="flex items-center">
                    <i class="pi pi-check-circle text-green-500 text-xl mr-3"></i>
                    <div class="flex-1">
                        <div class="font-medium text-green-700">Ready to Create ETEN Order</div>
                        <div class="text-green-600 text-sm mt-1">SAP details verified. Click "Create ETEN Order" to proceed.</div>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                            <div class="text-green-600 text-sm"><span class="font-medium">Customer:</span> {{ sapDetails.admin_data.custaccountno }}</div>
                            <div class="text-green-600 text-sm"><span class="font-medium">SAP Order:</span> {{ sapDetails.admin_data.saporderno }}</div>
                            <div class="text-green-600 text-sm"><span class="font-medium">Order Desc:</span> {{ getOrderDescLabel(form.orderdesc) }}</div>
                            <div class="text-green-600 text-sm"><span class="font-medium">Items:</span> {{ sapItems.length }} items</div>
                        </div>
                    </div>
                    <div class="text-right">
                        <div class="text-lg font-bold text-green-700">RM {{ formatCurrency(calculateTotalItemsValue()) }}</div>
                        <div class="text-sm text-green-600">Total Value</div>
                    </div>
                </div>
            </div>
            <div class="flex justify-end mt-6">
                <Button
                    label="Create ETEN Order"
                    icon="pi pi-check"
                    class="w-full md:w-auto"
                    @click="createETENOrder"
                    :loading="loading.orderCreate"
                    :disabled="!form.orderno || !sapDetails || !sapDetails.admin_data || isDuplicateOrder || !form.orderdesc"
                    severity="success"
                    :class="{ 'opacity-50': isDuplicateOrder }"
                />
            </div>
        </div>

        <!-- Step 3: ETEN Result -->
        <div v-if="etenResult" class="mt-6 border rounded-lg p-6 bg-green-50">
            <div class="flex items-center justify-between mb-6">
                <div>
                    <div class="font-bold text-xl text-green-800">ETEN Order Created Successfully!</div>
                    <div class="text-green-600 text-sm mt-1">Order has been created and stock updated in the system</div>
                </div>
                <Badge value="COMPLETED" severity="success" />
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div class="bg-white p-4 rounded-lg shadow-sm border border-green-100">
                    <div class="text-sm text-gray-500 mb-1">ETEN Order No</div>
                    <div class="font-semibold text-lg text-green-600">{{ etenResult.admin_data.order_no }}</div>
                    <div class="text-xs text-gray-500 mt-1">Created at: {{ formatDateTime(etenResult.admin_data.created) }}</div>
                </div>

                <div class="bg-white p-4 rounded-lg shadow-sm border border-green-100">
                    <div class="text-sm text-gray-500 mb-1">Customer Account</div>
                    <div class="font-semibold text-lg">{{ etenResult.admin_data.custaccountno }}</div>
                    <div class="text-xs text-gray-500 mt-1">Ship To: {{ etenResult.admin_data.shipto }}</div>
                </div>

                <div class="bg-white p-4 rounded-lg shadow-sm border border-green-100">
                    <div class="text-sm text-gray-500 mb-1">SAP Reference</div>
                    <div class="font-semibold text-lg">{{ etenResult.admin_data.so_no }}</div>
                    <div class="text-xs text-gray-500 mt-1">SAP Order Type: {{ etenResult.admin_data.sapordertype }}</div>
                </div>

                <div class="bg-white p-4 rounded-lg shadow-sm border border-green-100">
                    <div class="text-sm text-gray-500 mb-1">Order Description</div>
                    <div class="font-semibold text-lg">{{ getOrderDescLabel(etenResult.admin_data.orderDesc) }}</div>
                    <div class="text-xs text-gray-500 mt-1">{{ etenResult.admin_data.orderDesc || 'NORMAL' }}</div>
                </div>
            </div>

            <!-- Financial Information -->
            <div class="bg-white p-4 rounded-lg shadow-sm border border-green-100 mb-6">
                <div class="text-sm text-gray-500 mb-1">Total Amount</div>
                <div class="font-semibold text-2xl text-green-600">RM {{ formatCurrency(etenResult.admin_data.total || 0) }}</div>
                <div class="text-sm text-gray-500 mt-1">Subtotal: RM {{ formatCurrency(etenResult.admin_data.subtotal || 0) }}</div>
            </div>

            <!-- Order Status Information -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div class="bg-white p-3 rounded-lg border">
                    <div class="text-sm text-gray-500 mb-1">Order Status</div>
                    <Badge :value="getOrderStatus(etenResult.admin_data.orderstatus)" :severity="getOrderStatusSeverity(etenResult.admin_data.orderstatus)" />
                </div>
                <div class="bg-white p-3 rounded-lg border">
                    <div class="text-sm text-gray-500 mb-1">Channel</div>
                    <div class="font-medium">{{ etenResult.admin_data.channel || 'ADMIN' }}</div>
                </div>
                <div class="bg-white p-3 rounded-lg border">
                    <div class="text-sm text-gray-500 mb-1">Storage Location</div>
                    <div class="font-medium">{{ etenResult.admin_data.storagelocation || 'N/A' }}</div>
                </div>
            </div>

            <!-- Order Items Created -->
            <div class="mt-6">
                <div class="font-semibold text-lg mb-3 text-green-800 flex items-center">
                    <i class="pi pi-box mr-2"></i>
                    Items Created
                </div>
                <DataTable :value="etenItems" class="p-datatable-sm" stripedRows :paginator="etenItems.length > 5" :rows="5">
                    <Column field="materialid" header="Material ID" style="min-width: 120px"></Column>
                    <Column field="itemno" header="Line No" style="width: 80px"></Column>
                    <Column field="quantity" header="Quantity" style="width: 100px">
                        <template #body="{ data }">
                            <span class="font-semibold">{{ data.qty || 0 }}</span>
                        </template>
                    </Column>
                    <Column field="price" header="Unit Price" style="width: 120px">
                        <template #body="{ data }">
                            <div class="text-right">
                                <div class="font-medium">RM {{ formatCurrency(data.unitprice || 0) }}</div>
                            </div>
                        </template>
                    </Column>
                    <Column field="total" header="Total Amount" style="width: 120px">
                        <template #body="{ data }">
                            <div class="text-right">
                                <div class="font-medium text-green-600">RM {{ formatCurrency(data.totalamt || 0) }}</div>
                            </div>
                        </template>
                    </Column>
                    <Column field="category" header="Category" style="width: 100px">
                        <template #body="{ data }">
                            {{ data.itemcategory || 'N/A' }}
                        </template>
                    </Column>
                </DataTable>
            </div>

            <!-- Success Message -->
            <div class="mt-6 p-4 bg-green-100 border border-green-300 rounded-lg">
                <div class="flex items-center">
                    <i class="pi pi-check-circle text-green-600 text-2xl mr-3"></i>
                    <div>
                        <div class="font-bold text-green-800">Order Successfully Processed</div>
                        <div class="text-green-700 mt-1">The ETEN order has been created, stock levels updated, and all necessary system records have been processed.</div>
                        <div class="text-green-700 text-sm mt-1">Order Description: {{ getOrderDescLabel(etenResult.admin_data.orderDesc) }}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';
import api from '@/service/api';

const toast = useToast();
const confirm = useConfirm();

const orderDescOptions = ref([{ label: 'NORMAL', value: 'NORMAL' }]);

// State Management
const loading = ref({
    sapCheck: false,
    orderCreate: false
});

const form = ref({
    orderno: '',
    custaccountno: '',
    saporderno: '',
    orderdesc: 'NORMAL'
});

const fieldErrors = ref({});
const errorMessage = ref('');
const sapDetails = ref(null);
const etenResult = ref(null);

const confirmDialogMounted = ref(false);
onMounted(() => (confirmDialogMounted.value = true));

const isDuplicateOrder = computed(() => {
    return sapDetails.value?.status === 0 && sapDetails.value?.message?.includes('already exist');
});

const sapItems = computed(() => {
    if (!sapDetails.value?.admin_data?.order_items) return [];

    const items = sapDetails.value.admin_data.order_items;

    if (Array.isArray(items)) {
        return items;
    }

    return [items];
});

const etenItems = computed(() => {
    if (!etenResult.value?.admin_data?.fullfill_order_array) return [];

    try {
        const items = JSON.parse(etenResult.value.admin_data.fullfill_order_array);
        return Array.isArray(items) ? items : [];
    } catch (error) {
        console.error('Error parsing ETEN items:', error);
        return [];
    }
});

// Helper Functions
const calculateTotalItemsValue = () => {
    if (!sapItems.value.length) return 0;
    return sapItems.value.reduce((total, item) => {
        return total + (parseFloat(item.totalamount) || 0);
    }, 0);
};

const clearFieldError = (fieldName) => {
    if (fieldErrors.value[fieldName]) {
        fieldErrors.value[fieldName] = '';
    }
    errorMessage.value = '';
};

const getOrderDescLabel = (value) => {
    const option = orderDescOptions.value.find((opt) => opt.value === value);
    return option ? option.label : value;
};

const validateForm = () => {
    const errors = {};

    if (!form.value.orderno?.trim()) {
        errors.orderno = 'ETEN order number is required';
    }

    if (!form.value.custaccountno?.trim()) {
        errors.custaccountno = 'Customer account number is required';
    }

    if (!form.value.saporderno?.trim()) {
        errors.saporderno = 'SAP sales order number is required';
    }

    if (!form.value.orderdesc) {
        errors.orderdesc = 'Order description is required';
    }

    fieldErrors.value = errors;
    return Object.keys(errors).length === 0;
};

const formatCurrency = (value) => {
    const num = parseFloat(value);
    if (isNaN(num)) return '0.00';
    return num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            return dateString;
        }
        return date.toLocaleDateString('en-MY', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    } catch (error) {
        return dateString;
    }
};

const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return 'N/A';
    try {
        const date = new Date(dateTimeString);
        return (
            date.toLocaleDateString('en-MY') +
            ' ' +
            date.toLocaleTimeString('en-MY', {
                hour: '2-digit',
                minute: '2-digit'
            })
        );
    } catch (error) {
        return dateTimeString;
    }
};

const getOrderStatus = (statusCode) => {
    const statusMap = {
        66: 'BCP Created',
        1: 'Pending',
        2: 'Processing',
        3: 'Completed',
        4: 'Cancelled'
    };
    return statusMap[statusCode] || `Status ${statusCode}`;
};

const getOrderStatusSeverity = (statusCode) => {
    const severityMap = {
        66: 'success',
        1: 'info',
        2: 'warning',
        3: 'success',
        4: 'danger'
    };
    return severityMap[statusCode] || 'info';
};

const resetForm = () => {
    form.value = {
        orderno: '',
        custaccountno: '',
        saporderno: '',
        orderdesc: 'NORMAL'
    };
    fieldErrors.value = {};
    errorMessage.value = '';
    sapDetails.value = null;
    etenResult.value = null;
};

const checkSAPDetails = async () => {
    if (!validateForm()) return;

    loading.value.sapCheck = true;
    errorMessage.value = '';
    sapDetails.value = null;
    etenResult.value = null;

    try {
        const response = await api.post('credit/getSAPBCP', {
            orderno: form.value.orderno,
            custaccountno: form.value.custaccountno,
            so_no: form.value.saporderno,
            orderdesc: form.value.orderdesc
        });

        sapDetails.value = response.data;

        if (response.data.status === 1) {
            toast.add({
                severity: 'success',
                summary: 'SAP Details Found',
                detail: 'SAP order details retrieved successfully',
                life: 3000
            });
        } else if (response.data.status === 0) {
            if (response.data.message?.includes('already exist')) {
                toast.add({
                    severity: 'warn',
                    summary: 'Order Exists',
                    detail: 'This ETEN order already exists. Please use a different order number.',
                    life: 4000
                });
            } else {
                errorMessage.value = response.data.message || 'No response from SAP. Please check the order details and try again.';
                toast.add({
                    severity: 'error',
                    summary: 'SAP Check Failed',
                    detail: errorMessage.value,
                    life: 5000
                });
            }
        }
    } catch (error) {
        console.error('Error checking SAP details:', error);
        errorMessage.value = error.response?.data?.message || 'Failed to connect to SAP. Please try again later.';

        toast.add({
            severity: 'error',
            summary: 'Connection Error',
            detail: errorMessage.value,
            life: 5000
        });
    } finally {
        loading.value.sapCheck = false;
    }
};

const createETENOrder = () => {
    if (!validateForm()) return;

    if (isDuplicateOrder.value) {
        toast.add({
            severity: 'error',
            summary: 'Duplicate Order',
            detail: 'Cannot create order. This ETEN order number already exists.',
            life: 4000
        });
        return;
    }

    if (!sapDetails.value?.admin_data) {
        toast.add({
            severity: 'warn',
            summary: 'No SAP Details',
            detail: 'Please check SAP details first',
            life: 3000
        });
        return;
    }

    if (!form.value.orderdesc) {
        toast.add({
            severity: 'warn',
            summary: 'Order Description Required',
            detail: 'Please select an order description',
            life: 3000
        });
        return;
    }

    const getConfirmMessage = () => {
        return `Confirm\n
        Order: ${form.value.orderno}\n`;
    };

    confirm.require({
        message: getConfirmMessage(),
        header: 'Create ETEN Order',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Yes, Create Order',
        rejectLabel: 'Cancel',
        acceptClass: 'p-button-success',
        rejectClass: 'p-button-secondary',
        html: true,
        accept: async () => {
            loading.value.orderCreate = true;

            try {
                const sapData = sapDetails.value.admin_data;
                const sapOrderArray = [];

                sapData.order_items.forEach((item, index) => {
                    sapOrderArray.push({
                        materialid: item.materialid || '',
                        lineno: item.lineno || (index + 1).toString().padStart(4, '0'),
                        itemcategory: item.itemcategory || '',
                        qty: item.qty || 0,
                        unitprice: item.unitprice || 0,
                        totalamount: item.totalamount || 0,
                        salesprogramid: item.salesprogramid || ''
                    });
                });

                const bcpData = {
                    custaccountno: sapData.custaccountno || form.value.custaccountno,
                    salesorg: sapData.salesorg || 'TSM',
                    distributionchannel: sapData.distributionchannel || '01',
                    division: sapData.division || '00',
                    pricegroup: sapData.pricegroup || '04',
                    orderdate: sapData.orderdate || new Date().toISOString().split('T')[0],
                    requestdeliverydate: sapData.requestdeliverydate || new Date().toISOString().split('T')[0],
                    orderdesc: form.value.orderdesc, // Use selected orderdesc
                    ordertype: sapData.ordertype || 'ZCPO',
                    orderno: form.value.orderno,
                    shipto: sapData.shipto || sapData.custaccountno,
                    shippingcond: sapData.shippingcond || '01',
                    storagelocation: sapData.storagelocation || 'FG01',
                    saporderno: sapData.saporderno,
                    deliveryno: sapData.deliveryno || '',
                    pgistatus: sapData.pgistatus || '',
                    invoiceno: sapData.invoiceno || '',
                    creditnoteno: sapData.creditnoteno || '',
                    sap_order_array: JSON.stringify(sapOrderArray)
                };

                const response = await api.post('credit/BCP', bcpData);

                if (response.data.status === 1) {
                    etenResult.value = response.data;

                    toast.add({
                        severity: 'success',
                        summary: 'Order Created',
                        detail: `ETEN order ${form.value.orderno} has been created successfully`,
                        life: 4000
                    });

                    form.value.orderno = '';
                } else {
                    throw new Error(response.data.message || 'Failed to create order');
                }
            } catch (error) {
                console.error('Error creating ETEN order:', error);

                const errorDetail = error.response?.data?.message || error.message || 'Failed to create ETEN order';
                errorMessage.value = errorDetail;

                toast.add({
                    severity: 'error',
                    summary: 'Creation Failed',
                    detail: errorDetail,
                    life: 5000
                });
            } finally {
                loading.value.orderCreate = false;
            }
        },
        reject: () => {
            toast.add({
                severity: 'info',
                summary: 'Cancelled',
                detail: 'ETEN order creation was cancelled',
                life: 2000
            });
        }
    });
};
</script>

<style scoped>
:deep(.p-inputtext) {
    padding: 0.75rem;
    border-radius: 6px;
    transition: all 0.2s ease;
}

:deep(.p-inputtext:focus) {
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
}

:deep(.p-inputtext.p-invalid) {
    border-color: #ef4444;
}

:deep(.p-button) {
    padding: 0.75rem 1.5rem;
    border-radius: 6px;
    font-weight: 500;
    transition: all 0.2s ease;
}

:deep(.p-button:not(:disabled):hover) {
    transform: translateY(-1px);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

:deep(.p-datatable) {
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid #e5e7eb;
}

:deep(.p-datatable .p-datatable-thead > tr > th) {
    background-color: #f8fafc;
    font-weight: 600;
    color: #334155;
}

@keyframes stepComplete {
    0% {
        transform: scale(1);
    }
    50% {
        transform: scale(1.1);
    }
    100% {
        transform: scale(1);
    }
}

.opacity-100 .w-8 {
    animation: stepComplete 0.5s ease;
}

@media (max-width: 768px) {
    .card {
        padding: 1rem;
    }

    :deep(.p-datatable) {
        font-size: 0.875rem;
    }

    :deep(.p-button) {
        width: 100%;
    }
}
</style>
