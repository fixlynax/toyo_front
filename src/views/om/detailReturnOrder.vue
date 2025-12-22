<template>
    <Fluid>
        <div class="flex flex-col md:flex-row gap-8">
            <div class="md:w-2/3 flex flex-col">
                <div class="card flex flex-col gap-6 w-full">
                    <div class="flex items-center gap-2 border-b">
                        <RouterLink to="/om/listReturnOrder">
                            <Button icon="pi pi-arrow-left font-bold" class="p-button-text p-button-secondary text-xl" size="big" v-tooltip="'Back'" />
                        </RouterLink>
                        <div class="text-2xl font-bold text-gray-800">Customer Information</div>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <span class="text-sm text-gray-500">Customer Name</span>
                            <p class="text-lg font-medium">
                                {{ dealerShop.companyName1 || '-' }} {{ dealerShop.companyName2 || '' }} <br />(<span class="font-semibold text-primarnotdy">{{ dealerShop.custAccountNo || '-' }}</span
                                >)
                            </p>
                        </div>
                        <div>
                            <span class="text-sm text-gray-500">Location</span>
                            <p class="text-lg font-medium">
                                {{ formatAddress(dealerShop) }}
                            </p>
                        </div>
                        <div>
                            <span class="text-sm text-gray-500">Channel</span>
                            <p class="text-lg font-medium">{{ orderData.channel || '-' }}</p>
                        </div>
                        <div>
                            <span class="text-sm text-gray-500">Distribution Channel</span>
                            <p class="text-lg font-medium">{{ orderData.distributionchannel || '-' }}</p>
                        </div>
                        <div class="w-full">
                            <span class="text-sm text-gray-700">Sales Org</span>
                            <p class="text-lg font-medium">{{ orderData.salesorg || '-' }}</p>
                        </div>
                        <div class="w-full">
                            <span class="text-sm text-gray-700">Price Group</span>
                            <p class="text-lg font-medium">{{ orderData.pricegroup || '-' }}</p>
                        </div>
                        <div>
                            <span class="text-sm text-gray-500">Email Address</span>
                            <p class="text-lg font-medium">{{ dealerShop.emailAddress || '-' }}</p>
                        </div>
                        <div>
                            <span class="text-sm text-gray-500">Contact Number</span>
                            <p class="text-lg font-medium">{{ dealerShop.phoneNumber || '-' }}</p>
                        </div>
                    </div>
                </div>

                <div class="card flex flex-col w-full bg-white shadow-sm rounded-2xl border border-gray-100">
                    <!-- Header -->
                    <div class="font-semibold text-xl border-b pb-3 px-4 flex items-center gap-2 text-gray-800">📦 <span>Return Item</span></div>
                    <div class="grid grid-cols-2 gap-4 mt-4">
                        <div>
                            <span class="text-sm text-gray-500">Return Order No.</span>
                            <p class="text-lg font-semibold text-primary">{{ order.return_orderNo_ref || '-' }}</p>
                        </div>
                        <div>
                            <span class="text-sm text-gray-500">SAP Return No.</span>
                            <p class="text-lg font-bold">{{ order.sapreturnno || '-' }}</p>
                        </div>
                    </div>
                    <div class="grid grid-cols-2 gap-4 mt-4">
                        <div>
                            <span class="text-sm text-gray-500">Return Code</span>
                            <p class="text-lg font-semibold">{{ order.reason_code || '-' }}</p>
                        </div>
                        <div>
                            <span class="text-sm text-gray-500">Return Reason</span>
                            <p class="text-lg font-medium">{{ order.reason_message || '-' }}</p>
                        </div>
                    </div>

                    <div class="grid grid-cols-2 gap-4 mt-4">
                        <div>
                            <span class="text-sm text-gray-500">Return Image</span>

                            <!-- Image Display -->
                            <div v-if="order.imageURL" class="mt-2">
                                <div class="rounded-xl overflow-hidden shadow-sm bg-gray-100 relative min-h-[12rem]">
                                    <!-- Loading State -->
                                    <div v-if="imageLoading" class="absolute inset-0 flex items-center justify-center">
                                        <div class="text-center">
                                            <i class="pi pi-spin pi-spinner text-3xl text-primary mb-2"></i>
                                            <p class="text-sm text-gray-600">Loading image...</p>
                                        </div>
                                    </div>

                                    <!-- Error State -->
                                    <div v-else-if="imageError" class="absolute inset-0 flex items-center justify-center bg-gray-100">
                                        <div class="text-center p-4">
                                            <i class="pi pi-image text-4xl text-gray-400 mb-2"></i>
                                            <p class="text-gray-500 text-sm">Failed to load image</p>
                                            <p class="text-xs text-gray-400 mt-1">URL: {{ order.imageURL.substring(0, 50) }}...</p>
                                        </div>
                                    </div>

                                    <!-- Image -->
                                    <a :href="order.imageURL" target="_blank" rel="noopener noreferrer" class="block">
                                        <img
                                            :src="order.imageURL"
                                            alt="Return Image"
                                            class="w-full h-48 object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
                                            :class="{ 'opacity-0': imageLoading || imageError }"
                                            @load="handleImageLoad"
                                            @error="handleImageError"
                                        />
                                    </a>
                                </div>
                                <p class="text-xs text-gray-500 mt-1 text-center">Click image to view full size</p>
                            </div>

                            <!-- No Image State -->
                            <div v-else class="mt-2">
                                <div class="rounded-xl overflow-hidden shadow-sm bg-gray-100 h-48 flex items-center justify-center">
                                    <div class="text-center">
                                        <i class="pi pi-image text-4xl text-gray-300 mb-2"></i>
                                        <p class="text-gray-400">No image available</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <span class="text-sm text-gray-500">Return Remark</span>
                            <p class="text-lg font-medium">{{ order.remarks || '-' }}</p>
                        </div>
                    </div>

                    <!-- Table -->
                    <DataTable :value="returnOrderArray" dataKey="materialid" class="rounded-table mt-6">
                        <Column field="itemno" header="Item No">
                            <template #body="{ data }">
                                {{ formatItemNo(data.salesdoclineitem || data.itemno) }}
                            </template>
                        </Column>
                        <Column header="Material">
                            <template #body="{ data }">
                                {{ data.materialid }} <br />
                                {{ data.materialdescription }}
                                <span v-if="data.salesprogramid" class="block text-xs text-gray-500">SP: {{ data.salesprogramid }}</span>
                                <!-- <Tag v-if="data.itemcategory === 'ZR3F'" value="ZR3F" severity="warning" size="small" class="mt-1" /> -->
                            </template>
                        </Column>

                        <Column field="itemcategory" header="Item Category">
                            <template #body="{ data }">
                                {{ data.itemcategory || 'ZR02' }}
                            </template>
                        </Column>

                        <Column field="qty" header="Quantity" class="text-right">
                            <template #body="{ data }">
                                {{ parseInt(data.qty) || 0 }}
                            </template>
                        </Column>

                        <!-- 🟦 Unit Price Column -->
                        <Column field="unitprice" header="Unit Price (RM)" class="text-right">
                            <template #body="{ data }">
                                {{ getItemPrice(data).toFixed(2) }}
                            </template>

                            <!-- ✅ Footer for label -->
                            <template #footer>
                                <div class="flex justify-start pr-2 font-bold text-gray-700">Subtotal</div>
                            </template>
                        </Column>

                        <!-- 🟦 Total Amount Column -->
                        <Column field="totalamt" header="Total Amount (RM)" class="text-right">
                            <template #body="{ data }">
                                {{ calculateItemTotal(data).toFixed(2) }}
                            </template>

                            <!-- ✅ Footer for total value -->
                            <template #footer>
                                <div class="flex justify-start pr-3 font-semibold text-blue-600">{{ subtotal.toFixed(2) }}</div>
                            </template>
                        </Column>
                    </DataTable>
                </div>
            </div>

            <div class="md:w-1/3 flex flex-col">
                <div class="card flex flex-col w-full">
                    <div class="flex items-center justify-between border-b pb-3 mb-4">
                        <div class="text-2xl font-bold text-gray-800">Order Info</div>
                        <Tag :value="getOrderStatusText(order.orderstatus, order.creditnoteno)" :severity="getOrderStatusSeverity(order.orderstatus, order.creditnoteno)" />
                    </div>

                    <div class="overflow-x-auto">
                        <table class="w-full text-sm text-left text-gray-700">
                            <tbody>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Order No</td>
                                    <td class="px-4 py-2 text-right font-bold text-primary">{{ orderData.order_no || '-' }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Channel</td>
                                    <td class="px-4 py-2 text-right font-bold">{{ orderData.channel || '-' }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Order Type</td>
                                    <td class="px-4 py-2 text-right font-semibold">{{ orderData.deliveryType || '-' }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Order Description</td>
                                    <td class="px-4 py-2 text-right font-semibold">{{ orderData.orderDesc || '-' }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">SO No</td>
                                    <td class="px-4 py-2 text-right font-semibold">{{ orderData.so_no || '-' }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">DO No</td>
                                    <td class="px-4 py-2 text-right font-semibold">{{ orderData.do_no || '-' }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Invoice No</td>
                                    <td class="px-4 py-2 text-right font-semibold">{{ orderData.inv_no || '-' }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">SAP Order Type</td>
                                    <td class="px-4 py-2 text-right font-semibold">{{ orderData.sapordertype || '-' }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Division</td>
                                    <td class="px-4 py-2 text-right font-semibold">{{ orderData.division || '-' }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Storage Location</td>
                                    <td class="px-4 py-2 text-right font-semibold">{{ orderData.storagelocation || '-' }}</td>
                                </tr>
                                <!-- <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Delivery Status</td>
                                    <td class="px-4 py-2 text-right font-semibold">{{ getDeliveryStatusText(order.delivery_status) }}</td>
                                </tr> -->
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Created</td>
                                    <td class="px-4 py-2 text-right font-semibold">{{ formatDate(order.created) || '-' }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <!-- Action Buttons -->
                    <div class="flex justify-end mt-4 gap-2" v-if="order.orderstatus === 0">
                        <Button label="Reject" severity="danger" size="small" @click="onRejectReturnOrder" :loading="loadingAction === 'reject'" />
                        <Button label="Approve" severity="success" size="small" @click="openEditPopup" :loading="loadingAction === 'approve'" />
                    </div>
                </div>
            </div>
        </div>

        <!-- Edit Return Items Dialog -->
        <Dialog v-model:visible="showEditDialog" modal header="Edit Return Items" :style="{ width: '800px' }" :closable="false">
            <div class="p-4">
                <div class="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                    <p class="text-sm text-yellow-800 font-medium">
                        <i class="pi pi-info-circle mr-2"></i>
                        Only items with category <span class="font-bold">ZR3F</span> can be edited. You can modify quantities or remove these items.
                    </p>
                </div>

                <DataTable :value="editableItems" class="p-datatable-sm" dataKey="id" stripedRows>
                    <Column header="Material" style="width: 200px">
                        <template #body="{ data }">
                            <div class="font-medium">{{ data.materialid }}</div>
                            <div class="text-sm text-gray-600">{{ data.materialdescription }}</div>
                        </template>
                    </Column>

                    <Column field="itemcategory" header="Category" style="width: 100px">
                        <template #body="{ data }">
                            <Tag :value="data.itemcategory" :severity="data.itemcategory === 'ZR3F' ? 'warning' : 'info'" size="small" />
                        </template>
                    </Column>

                    <Column header="Original Qty" style="width: 100px">
                        <template #body="{ data }">
                            <div class="text-center">{{ data.originalQty }}</div>
                        </template>
                    </Column>

                    <Column header="New Qty" style="width: 150px">
                        <template #body="{ data }">
                            <div v-if="data.itemcategory === 'ZR3F'">
                                <InputNumber v-model="data.qty" :min="0" :max="9999" showButtons buttonLayout="horizontal" :step="1" class="w-full" :disabled="data.removed || data.itemcategory !== 'ZR3F'">
                                    <template #incrementbuttonicon>
                                        <span class="pi pi-plus" />
                                    </template>
                                    <template #decrementbuttonicon>
                                        <span class="pi pi-minus" />
                                    </template>
                                </InputNumber>
                            </div>
                            <div v-else class="text-center text-gray-500">
                                {{ data.qty }}
                            </div>
                        </template>
                    </Column>

                    <!-- <Column header="Status" style="width: 100px">
                        <template #body="{ data }">
                            <span v-if="data.removed" class="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">Removed</span>
                            <span v-else-if="data.qty !== data.originalQty" class="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">Modified</span>
                            <span v-else class="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">No Change</span>
                        </template>
                    </Column> -->

                    <Column header="Actions" style="width: 120px">
                        <template #body="{ data }">
                            <div v-if="data.itemcategory === 'ZR3F'" class="text-center">
                                <Button v-if="!data.removed" icon="pi pi-trash" severity="danger" text rounded @click="removeZR3FItem(data)" v-tooltip="'Remove item'" />

                                <Button v-if="data.removed" icon="pi pi-undo" severity="secondary" text rounded @click="restoreZR3FItem(data)" v-tooltip="'Restore item'" />
                            </div>
                            <div v-else class="text-center text-gray-400">
                                <i class="pi pi-lock"></i>
                            </div>
                        </template>
                    </Column>
                </DataTable>

                <!-- <div class="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-md">
                    <div class="flex justify-between items-center">
                        <div>
                            <p class="text-sm font-medium text-blue-800">Total ZR3F Items: {{ zr3fItemCount }} ({{ editableZR3FItems.length }} editable)</p>
                            <p v-if="hasZR3FChanges" class="text-sm text-blue-600 mt-1">
                                <i class="pi pi-exclamation-circle mr-1"></i>
                                Changes detected: {{ changeSummary }}
                            </p>
                            <p v-else class="text-sm text-green-600 mt-1">
                                <i class="pi pi-check-circle mr-1"></i>
                                No changes to ZR3F items
                            </p>
                        </div>
                        <div class="text-right">
                            <p class="text-sm text-gray-600">Click "Proceed" to approve with changes</p>
                        </div>
                    </div>
                </div> -->
            </div>

            <template #footer>
                <Button label="Cancel" icon="pi pi-times" severity="secondary" @click="closeEditDialog" :disabled="loadingAction === 'approve'" />
                <Button label="Proceed" icon="pi pi-check" severity="success" @click="proceedWithApproval" :loading="loadingAction === 'approve'" />
            </template>
        </Dialog>

        <Toast />
    </Fluid>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import api from '@/service/api';
import Dialog from 'primevue/dialog';
import InputNumber from 'primevue/inputnumber';
import Tag from 'primevue/tag';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';

const route = useRoute();
const toast = useToast();
const returnOrderNo = route.params.retOrdNo;

const order = ref({});
const dealerShop = ref({});
const orderData = ref({});
const orderDelivery = ref({});
const returnOrderArray = ref([]);
const loading = ref(true);
const loadingAction = ref(null);
const error = ref(null);

// Add new reactive variables for edit functionality
const showEditDialog = ref(false);
const editableItems = ref([]);
const originalItems = ref([]);

// Image handling variables
const imageLoading = ref(false);
const imageError = ref(false);

// Check if there are ZR3F items
const hasZR3FItems = computed(() => {
    return returnOrderArray.value.some((item) => item.itemcategory === 'ZR3F');
});

const zr3FItems = computed(() => {
    return returnOrderArray.value.filter((item) => item.itemcategory === 'ZR3F');
});

const editableZR3FItems = computed(() => {
    return editableItems.value.filter((item) => item.itemcategory === 'ZR3F');
});

const zr3fItemCount = computed(() => {
    return zr3FItems.value.length;
});

const hasZR3FChanges = computed(() => {
    return editableItems.value.some((item) => item.itemcategory === 'ZR3F' && (item.removed || item.qty !== item.originalQty));
});

const changeSummary = computed(() => {
    const changedItems = editableItems.value.filter((item) => item.itemcategory === 'ZR3F' && (item.removed || item.qty !== item.originalQty));

    if (changedItems.length === 0) return 'No changes';

    const removed = changedItems.filter((item) => item.removed).length;
    const qtyChanged = changedItems.filter((item) => !item.removed && item.qty !== item.originalQty).length;

    const parts = [];
    if (removed > 0) parts.push(`${removed} removed`);
    if (qtyChanged > 0) parts.push(`${qtyChanged} quantity changed`);

    return parts.join(', ');
});

// ✅ Enhanced price mapping functions
const getItemPrice = (item) => {
    const materialId = item.materialid;
    const itemNo = item.salesdoclineitem || item.itemno;

    // Format item number for comparison (pad with zeros to 6 digits)
    const formattedItemNo = itemNo.toString().padStart(6, '0');

    // First, try to find the item in fullfill_order_array with exact match
    if (orderData.value.fullfill_order_array && Array.isArray(orderData.value.fullfill_order_array)) {
        const originalItem = orderData.value.fullfill_order_array.find((orderItem) => orderItem.materialid === materialId && orderItem.itemno === formattedItemNo);

        if (originalItem && originalItem.unitprice !== undefined && originalItem.unitprice !== null) {
            return Number(originalItem.unitprice) || 0;
        }
    }

    // If not found, check if there's a unitprice already in the return item (from API)
    if (item.unitprice !== undefined && item.unitprice !== null) {
        return Number(item.unitprice) || 0;
    }

    // Last resort: try to find by material ID only (fallback)
    if (orderData.value.fullfill_order_array && Array.isArray(orderData.value.fullfill_order_array)) {
        const fallbackItem = orderData.value.fullfill_order_array.find((orderItem) => orderItem.materialid === materialId);

        if (fallbackItem && fallbackItem.unitprice !== undefined && fallbackItem.unitprice !== null) {
            return Number(fallbackItem.unitprice) || 0;
        }
    }

    return 0;
};

// Method to calculate item total
const calculateItemTotal = (item) => {
    const qty = parseInt(item.qty) || 0;
    const price = getItemPrice(item);
    return qty * price;
};

// Computed property for subtotal
const subtotal = computed(() => {
    return returnOrderArray.value.reduce((sum, item) => {
        return sum + calculateItemTotal(item);
    }, 0);
});

// ✅ Status mapping functions
const getDeliveryStatusText = (status) => {
    const statusMap = {
        PENDING: 'Pending',
        APPROVED: 'Approved',
        REJECTED: 'Rejected',
        PENDING_COLLECTION: 'Pending Collection',
        COMPLETED: 'Completed',
        NEW: 'New'
    };
    return statusMap[status?.toUpperCase()] || status || '-';
};

const getOrderStatusText = (status, creditnoteno) => {
    // Check for the new condition: status = 9 and creditnoteno = null
    if (status === 9 && (creditnoteno === null || creditnoteno === undefined || creditnoteno === '')) {
        return 'Return Received';
    }

    const statusMap = {
        0: 'Pending',
        1: 'Approved',
        2: 'Rejected',
        77: 'Pending Collection',
        9: 'Completed'
    };
    return statusMap[status] || `Status: ${status}`;
};

const getOrderStatusSeverity = (status, creditnoteno) => {
    // Check for the new condition: status = 9 and creditnoteno = null
    if (status === 9 && (creditnoteno === null || creditnoteno === undefined || creditnoteno === '')) {
        return 'info'; // Using 'info' severity for Return Received status
    }

    const severityMap = {
        0: 'warn',
        1: 'success',
        2: 'danger',
        77: 'warn',
        9: 'success'
    };
    return severityMap[status] || 'secondary';
};

// Helper methods
const formatAddress = (dealerShop) => {
    if (!dealerShop) return '-';
    const addressParts = [dealerShop.addressLine2, dealerShop.addressLine3, dealerShop.addressLine4, dealerShop.city, dealerShop.state, dealerShop.postcode].filter((part) => part && part.trim() !== '');
    return addressParts.join(' ') || '-';
};

const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-MY', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
};

// Method to format item number for display
const formatItemNo = (itemNo) => {
    if (!itemNo) return '-';
    return itemNo.toString().padStart(6, '0');
};

// Toast helper
const showToast = (severity, summary, detail) => {
    toast.add({
        severity,
        summary,
        detail,
        life: 5000
    });
};

// Image handling methods
const handleImageLoad = () => {
    imageLoading.value = false;
    imageError.value = false;
};

const handleImageError = () => {
    imageLoading.value = false;
    imageError.value = true;
};

// Simplified image processing - no API call
const processPrivateImage = async () => {
    if (order.value.imageURL && typeof order.value.imageURL === 'string') {
        try {
            imageLoading.value = true;
            imageError.value = false;

            // Directly use the image URL without API processing
            // The image URL will be used as-is in the template
            console.log('Using direct image URL:', order.value.imageURL);
        } catch (error) {
            console.error('Error processing image:', error);
            imageError.value = true;
        } finally {
            imageLoading.value = false;
        }
    } else {
        // No image URL, set loading to false
        imageLoading.value = false;
    }
};

// Fetch order details
const fetchReturnOrderDetail = async () => {
    try {
        loading.value = true;
        error.value = null;

        const response = await api.get(`order/detail-return-order/${returnOrderNo}`);
        console.log('Order Data:', orderData.value);

        if (response.data.status === 1 && response.data.admin_data && response.data.admin_data.length > 0) {
            const orderDataResponse = response.data.admin_data[0];
            order.value = orderDataResponse;
            dealerShop.value = orderDataResponse.dealer?.dealer_shop || {};
            orderData.value = orderDataResponse.order_data || {};
            orderDelivery.value = orderDataResponse.delivery_information || {};
            returnOrderArray.value = orderDataResponse.return_order_array || [];

            // Process the return image (simplified - no API call)
            await processPrivateImage();

            console.log('Order Data:', orderData.value);
            console.log('Return Items:', returnOrderArray.value);
            console.log('Has ZR3F items:', hasZR3FItems.value);

            console.log('imageURL:', order.value.imageURL);
        } else {
            error.value = 'No data found for this return order';
            showToast('error', 'Error', error.value);
        }
    } catch (err) {
        console.error('Error fetching return order details:', err);
        showToast('error', 'Error', 'Failed to load return order details');
    } finally {
        loading.value = false;
    }
};

// Open edit dialog
const openEditPopup = () => {
    // Check for ZR3F items directly from the array
    const hasZR3F = returnOrderArray.value.some((item) => item.itemcategory === 'ZR3F');

    console.log('Opening edit popup, has ZR3F items:', hasZR3F);
    console.log('All items:', returnOrderArray.value);

    if (!hasZR3F) {
        console.log('No ZR3F items found, proceeding directly to approval');
        // If no ZR3F items, proceed directly to approval
        onApproveReturnOrder();
        return;
    }

    // Prepare editable items
    editableItems.value = returnOrderArray.value.map((item, index) => ({
        ...item,
        id: `${item.materialid}_${item.salesdoclineitem || item.itemno}_${index}`,
        originalQty: parseInt(item.qty) || 0,
        qty: parseInt(item.qty) || 0,
        removed: false,
        index: index
    }));

    originalItems.value = JSON.parse(JSON.stringify(editableItems.value));
    showEditDialog.value = true;
};

// Close edit dialog
const closeEditDialog = () => {
    showEditDialog.value = false;
    editableItems.value = [];
    originalItems.value = [];
};

// Remove ZR3F item
const removeZR3FItem = (item) => {
    if (item.itemcategory === 'ZR3F') {
        item.removed = true;
        item.qty = 0;
    }
};

// Restore ZR3F item
const restoreZR3FItem = (item) => {
    if (item.itemcategory === 'ZR3F') {
        item.removed = false;
        item.qty = item.originalQty;
    }
};

// Proceed with approval after editing
const proceedWithApproval = async () => {
    try {
        loadingAction.value = 'approve';

        // Check if there are any changes to ZR3F items
        const hasChanges = hasZR3FChanges.value;

        // Prepare the payload
        const payload = new URLSearchParams();
        payload.append('status', '1');

        if (hasChanges) {
            // Prepare the modified return_order_array
            const modifiedArray = editableItems.value
                .filter((item) => !item.removed)
                .map((item) => ({
                    materialid: item.materialid,
                    salesdoclineitem: item.salesdoclineitem || item.itemno,
                    itemcategory: item.itemcategory,
                    plant: item.plant,
                    qty: item.qty.toString()
                }));

            payload.append('return_order_array', JSON.stringify(modifiedArray));
            console.log('Sending modified array to backend:', modifiedArray);
        } else {
            // Send original array if no changes
            const originalArray = returnOrderArray.value.map((item) => ({
                materialid: item.materialid,
                salesdoclineitem: item.salesdoclineitem || item.itemno,
                itemcategory: item.itemcategory,
                plant: item.plant,
                qty: item.qty.toString()
            }));

            payload.append('return_order_array', JSON.stringify(originalArray));
            console.log('No changes to ZR3F items, sending original array');
        }

        console.log('Sending approval request for return order:', returnOrderNo);

        const response = await api.postExtra(`order/update-return-order/${returnOrderNo}`, payload, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Accept: 'application/json'
            }
        });

        console.log('Approve response:', response.data);

        if (response.data.status === 1) {
            const message = hasChanges ? 'Return order approved successfully with modifications!' : 'Return order approved successfully!';

            showToast('success', 'Success', message);
            order.value.orderstatus = 1;

            if (response.data.admin_data) {
                Object.assign(order.value, response.data.admin_data);
            }

            // Update local data
            await fetchReturnOrderDetail();
            closeEditDialog();
        } else {
            // Handle SAP errors from backend
            let errorMessage = 'Failed to approve return order';
            let sapError = null;

            if (response.data.error) {
                const errorData = response.data.error;
                errorMessage = errorData.message || errorData.code || errorMessage;

                // Check if it's an SAP error
                if (errorData.code && errorData.code.startsWith('SAP')) {
                    sapError = errorMessage;
                    errorMessage = `SAP Error: ${errorMessage}`;
                }
            } else if (response.data.message) {
                errorMessage = response.data.message;
                // Try to extract SAP error from message
                if (errorMessage.includes('SAP') || errorMessage.includes('sap')) {
                    sapError = errorMessage;
                }
            }

            // Show detailed error in toast
            if (sapError) {
                showToast('error', 'SAP Error', sapError);
            } else {
                showToast('error', 'Error', errorMessage);
            }
        }
    } catch (err) {
        console.error('Approve error:', err);
        let errorMessage = 'Failed to approve return order';
        let sapError = null;

        if (err.response?.data?.error?.message) {
            errorMessage = err.response.data.error.message;
            if (errorMessage.includes('SAP') || errorMessage.includes('sap')) {
                sapError = errorMessage;
            }
        } else if (err.response?.data?.message) {
            errorMessage = err.response.data.message;
            if (errorMessage.includes('SAP') || errorMessage.includes('sap')) {
                sapError = errorMessage;
            }
        } else if (err.message) {
            errorMessage = err.message;
        }

        // Show detailed error in toast
        if (sapError) {
            showToast('error', 'SAP Error', sapError);
        } else {
            showToast('error', 'Error', errorMessage);
        }
    } finally {
        loadingAction.value = null;
    }
};

// ✅ Modified onApproveReturnOrder (for no ZR3F items)
const onApproveReturnOrder = async () => {
    try {
        loadingAction.value = 'approve';

        // Prepare payload - when no ZR3F items, we still need to send the return_order_array
        const payload = new URLSearchParams();
        payload.append('status', '1');

        // Send the original array when there are no ZR3F items
        const originalArray = returnOrderArray.value.map((item) => ({
            materialid: item.materialid,
            salesdoclineitem: item.salesdoclineitem || item.itemno,
            itemcategory: item.itemcategory,
            plant: item.plant,
            qty: item.qty.toString()
        }));

        payload.append('return_order_array', JSON.stringify(originalArray));

        console.log('Approving return order (no ZR3F items):', returnOrderNo);
        console.log('Sending original array:', originalArray);

        const response = await api.postExtra(`order/update-return-order/${returnOrderNo}`, payload, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Accept: 'application/json'
            }
        });

        console.log('Approve response:', response.data);

        if (response.data.status === 1) {
            showToast('success', 'Success', 'Return order approved successfully!');
            order.value.orderstatus = 1;

            if (response.data.admin_data) {
                Object.assign(order.value, response.data.admin_data);
            }

            // Update local data
            await fetchReturnOrderDetail();
        } else {
            const errorData = response.data.error;
            let errorMessage = 'Failed to approve return order';
            let sapError = null;

            if (errorData) {
                errorMessage = errorData.message || errorData.code || errorMessage;
                if (errorMessage.includes('SAP') || errorMessage.includes('sap')) {
                    sapError = errorMessage;
                }
            } else if (response.data.message) {
                errorMessage = response.data.message;
                if (errorMessage.includes('SAP') || errorMessage.includes('sap')) {
                    sapError = errorMessage;
                }
            }

            if (sapError) {
                showToast('error', 'SAP Error', sapError);
            } else {
                showToast('error', 'Error', errorMessage);
            }
        }
    } catch (err) {
        console.error('Approve error:', err);
        let errorMessage = 'Failed to approve return order';
        let sapError = null;

        if (err.response?.data?.error?.message) {
            errorMessage = err.response.data.error.message;
            if (errorMessage.includes('SAP') || errorMessage.includes('sap')) {
                sapError = errorMessage;
            }
        } else if (err.response?.data?.message) {
            errorMessage = err.response.data.message;
            if (errorMessage.includes('SAP') || errorMessage.includes('sap')) {
                sapError = errorMessage;
            }
        } else if (err.message) {
            errorMessage = err.message;
        }

        if (sapError) {
            showToast('error', 'SAP Error', sapError);
        } else {
            showToast('error', 'Error', errorMessage);
        }
    } finally {
        loadingAction.value = null;
    }
};

// ✅ Fixed Reject return order
const onRejectReturnOrder = async () => {
    try {
        loadingAction.value = 'reject';

        const payload = new URLSearchParams();
        payload.append('status', '2');
        // For reject, we don't need to send return_order_array since we're not modifying items
        const originalArray = returnOrderArray.value.map((item) => ({
            materialid: item.materialid,
            salesdoclineitem: item.salesdoclineitem || item.itemno,
            itemcategory: item.itemcategory,
            plant: item.plant,
            qty: item.qty.toString()
        }));
        payload.append('return_order_array', JSON.stringify(originalArray));

        console.log('Rejecting return order:', returnOrderNo);

        const response = await api.postExtra(`order/update-return-order/${returnOrderNo}`, payload, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Accept: 'application/json'
            }
        });

        console.log('Reject response:', response.data);

        if (response.data.status === 1) {
            showToast('success', 'Success', 'Return order rejected successfully!');
            order.value.orderstatus = 2;

            if (response.data.admin_data) {
                Object.assign(order.value, response.data.admin_data);
            }
        } else {
            const errorData = response.data.error;
            let errorMessage = 'Failed to reject return order';

            if (errorData) {
                errorMessage = errorData.message || errorData.code || errorMessage;
            } else if (response.data.message) {
                errorMessage = response.data.message;
            }

            showToast('error', 'Error', errorMessage);
        }
    } catch (err) {
        console.error('Reject error:', err);
        let errorMessage = 'Failed to reject return order';

        if (err.response?.data?.error?.message) {
            errorMessage = err.response.data.error.message;
        } else if (err.response?.data?.message) {
            errorMessage = err.response.data.message;
        } else if (err.message) {
            errorMessage = err.message;
        }

        showToast('error', 'Error', errorMessage);
    } finally {
        loadingAction.value = null;
    }
};

// Fetch initial data
onMounted(() => fetchReturnOrderDetail());
</script>

<style scoped>
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
</style>
