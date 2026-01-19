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
                            <p class="text-lg font-semibold">{{ order.sapreturnno || '-' }}</p>
                        </div>
                    </div>
                    <div class="grid grid-cols-2 gap-4 mt-4">
                        <div>
                            <span class="text-sm text-gray-500">Credit Note No.</span>
                            <p class="text-lg font-semibold">{{ order.creditnoteno || '-' }}</p>
                        </div>
                        <div>
                            <span class="text-sm text-gray-500">Return Delivery No.</span>
                            <p class="text-lg font-semibold">{{ orderDelivery.sapreturndeliveryno || '-' }}</p>
                        </div>
                    </div>
                    <div class="grid grid-cols-2 gap-4 mt-4">
                        <div>
                            <span class="text-sm text-gray-500">Return Code</span>
                            <p class="text-lg font-medium">{{ order.reason_code || '-' }}</p>
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
                                    <td class="px-4 py-2 font-medium">Return Channel</td>
                                    <td class="px-4 py-2 text-right font-bold">{{ order.channel || '-' }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Order Type</td>
                                    <td class="px-4 py-2 text-right font-semibold">
                                        <span v-if="orderData.orderDesc === 'NORMAL'">NORMAL</span>
                                        <span v-else-if="orderData.orderDesc === 'DIRECTSHIP'">DS</span>
                                        <span v-else-if="orderData.orderDesc === 'OWN'">OWN USE</span>
                                        <span v-else-if="orderData.orderDesc === 'Warranty'">WARRANTY</span>
                                        <span v-else-if="orderData.orderDesc === 'Back Order'">NORMAL</span>
                                        <span v-else>
                                            {{ orderData.orderDesc || orderData.orderDesc || '-' }}
                                        </span>
                                    </td>
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
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Created On</td>
                                    <td class="px-4 py-2 text-right font-semibold">{{ formatDateTime(order.created) || '-' }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </Fluid>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import api from '@/service/api';
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
const error = ref(null);

// Image handling variables
const imageLoading = ref(false);
const imageError = ref(false);

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

const formatDateTime = (dateString) => {
    if (!dateString) return '-';

    const date = new Date(dateString);
    const options = {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    };

    let formatted = date.toLocaleString('en-MY', options);

    // Convert AM/PM to uppercase regardless of case
    return formatted.replace(/\b(am|pm)\b/gi, (match) => match.toUpperCase());
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

        if (response.data.status === 1 && response.data.admin_data && response.data.admin_data.length > 0) {
            const orderDataResponse = response.data.admin_data[0];
            order.value = orderDataResponse;
            dealerShop.value = orderDataResponse.dealer?.dealer_shop || {};
            orderData.value = orderDataResponse.order_data || {};
            orderDelivery.value = orderDataResponse.delivery_information || {};
            returnOrderArray.value = orderDataResponse.return_order_array || [];

            // Process the return image (simplified - no API call)
            await processPrivateImage();
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
