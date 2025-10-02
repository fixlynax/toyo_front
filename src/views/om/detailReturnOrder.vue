<template>
    <Fluid>
        <div class="flex flex-col md:flex-row gap-8">
            <!-- LEFT SIDE -->
            <div class="md:w-2/3">
                <div class="flex flex-col md:flex-row gap-8">
                    <div class="card flex flex-col gap-6 w-full">
                        <div class="text-2xl font-bold text-gray-800 border-b pb-2">Return Order Detail</div>

                        <div class="flex items-center justify-between w-full">
                            <div>
                                <span class="block text-sm text-gray-500">Return Request Number</span>
                                <span class="text-lg font-medium">{{ returnOrder.returnRequestNo }}</span>
                            </div>
                        </div>

                        <!-- Dealer Info -->
                        <div class="font-semibold text-xl border-b pb-2 mt-8">🏬 Dealer Information</div>
                        <div class="flex flex-col md:flex-row gap-4">
                            <div class="w-full">
                                <span class="text-sm text-gray-500">Dealer Name</span>
                                <p class="text-lg font-medium">{{ returnOrder.customerName }}</p>
                            </div>
                            <div class="w-full">
                                <span class="text-sm text-gray-500">Dealer Account Number</span>
                                <p class="text-lg font-medium">{{ returnOrder.custAccountNo }}</p>
                            </div>
                        </div>

                        <div class="flex flex-col md:flex-row gap-4">
                            <div class="w-full">
                                <span class="text-sm text-gray-500">Location</span>
                                <p class="text-lg font-medium">{{ returnOrder.location }}</p>
                            </div>
                            <div class="w-full">
                                <span class="text-sm text-gray-500">Distribution Channel</span>
                                <p class="text-lg font-medium">{{ returnOrder.distributionChannel }}</p>
                            </div>
                        </div>

                        <div class="flex flex-col md:flex-row gap-4">
                            <div class="w-full">
                                <span class="text-sm text-gray-500">Contact Person</span>
                                <p class="text-lg font-medium">{{ warantyDetail.contactPerson }}</p>
                            </div>
                            <div class="w-full">
                                <span class="text-sm text-gray-500">Contact Number</span>
                                <p class="text-lg font-medium">{{ warantyDetail.contactNo }}</p>
                            </div>
                        </div>

                        <!-- Return Info -->
                        <div class="font-semibold text-xl border-b pb-2 mt-8">📦 Return Information</div>
                        <DataTable :value="[returnOrder]" :rows="1" dataKey="id" :rowHover="false" responsiveLayout="scroll" class="text-sm">
                            <!-- Return Reason -->
                            <Column header="Return Reason" style="min-width: 8rem">
                                <template #body="{ data }">
                                    <div class="flex flex-col">
                                        <span class="font-bold text-xl">{{ data.returnMaterial }}</span>
                                        <span class="font-semibold text-xm italic">{{ data.returnReason }}</span>
                                    </div>
                                </template>
                            </Column>

                            <!-- Quantity -->
                            <Column header="Quantity" style="min-width: 6rem">
                                <template #body="{ data }">
                                    <span class="font-medium text-xl">{{ data.quantity }}</span>
                                </template>
                            </Column>

                            <!-- Total -->
                            <Column header="Total" style="min-width: 6rem">
                                <template #body="{ data }">
                                    <span class="font-medium text-xl">{{ data.total }}</span>
                                </template>
                            </Column>
                        </DataTable>

                        <!-- Approval / Reject -->
                        <div v-if="returnFinalStatus" class="flex justify-end text-sm mt-2">
                            <span
                                class="px-4 py-2 rounded text-white"
                                :class="{
                                    'bg-green-700': returnFinalStatus === 'approved',
                                    'bg-red-700': returnFinalStatus === 'rejected'
                                }"
                            >
                                {{ returnFinalStatusText }}
                            </span>
                        </div>
                        <div v-else class="flex justify-end mt-2 gap-2">
                            <Button label="Reject" style="width: 8em" class="p-button-danger" size="small" @click="onRejectReturnOrder" />
                            <Button label="Approve" style="width: 8em" class="p-button-success" size="small" @click="onApproveReturnOrder" />
                        </div>

                        <!-- Reject Reason Display -->
                        <div v-if="returnFinalStatus === 'rejected'" class="p-4 border rounded bg-gray-50">
                            <p class="font-bold text-xl mb-2">Reject Reason</p>
                            <p>{{ rejectReason }}</p>
                        </div>

                        <div v-if="showRejectReason" class="p-4 border rounded bg-gray-50">
                            <h3 class="font-bold text-xl mb-2">Reject Return Order</h3>
                            <p class="mb-2 text-gray-700">Select a reason for rejection:</p>
                            <Dropdown v-model="rejectReason" :options="rejectReasonOptions" placeholder="-- Please Select --" optionLabel="label" optionValue="value" class="w-full" />
                            <div class="flex justify-end mt-2 space-x-2">
                                <Button label="Cancel" style="width: 8em" class="p-button-secondary" size="small" @click="cancelRejectReturnOrder" />
                                <Button label="Submit" style="width: 8em" class="p-button-danger" size="small" @click="submitRejectReturnOrder" :disabled="!rejectReason" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- RIGHT SIDE -->
            <div class="md:w-1/3">
                <!-- Advance Info -->
                <div class="card flex flex-col w-full">
                    <div class="flex items-center justify-between border-b pb-3 mb-4">
                        <div class="text-2xl font-bold text-gray-800">Advance Info</div>
                        <Tag :value="form.status === 1 ? 'Complete' : 'Pending'" :severity="form.status === 1 ? 'success' : 'warn'" />
                    </div>

                    <!-- Table -->
                    <div class="overflow-x-auto">
                        <table class="w-full text-sm text-left text-gray-700">
                            <tbody>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Division</td>
                                    <td class="px-4 py-2 text-right">{{ returnOrder.division }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Order Number</td>
                                    <td class="px-4 py-2 text-right">{{ returnOrder.orderNo }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">SO Number</td>
                                    <td class="px-4 py-2 text-right">{{ returnOrder.soNo }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">DO Number</td>
                                    <td class="px-4 py-2 text-right">{{ returnOrder.doNo }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Invoice Number</td>
                                    <td class="px-4 py-2 text-right">{{ returnOrder.invoiceNo }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Customer Info -->
                <div class="card flex flex-col w-full mt-6">
                    <div class="text-2xl font-bold text-gray-800 border-b pb-2 mb-3">👤 Customer Info</div>
                    <div class="overflow-x-auto">
                        <table class="w-full text-sm text-left text-gray-700">
                            <tbody>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Customer Name</td>
                                    <td class="px-4 py-2 text-right">{{ customerInfo.name }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Vehicle</td>
                                    <td class="px-4 py-2 text-right">{{ customerInfo.vehicle }}</td>
                                </tr>
                                <tr>
                                    <td class="px-4 py-2 font-medium">Registration Number</td>
                                    <td class="px-4 py-2 text-right">{{ customerInfo.regNo }}</td>
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
import { ref, computed } from 'vue';

const form = ref({
    memberCode: 'E346572',
    custAccountNo: '6080100900',
    companyName1: 'PS Tyres & Battery Auto Services Sdn. Bhd',
    status: 0
});

const returnOrder = ref({
    id: 1,
    returnRequestNo: 'RR1001',
    orderNo: 'TYO1001',
    soNo: 'SO1001',
    doNo: 'DO1001',
    invoiceNo: 'INV1001',
    returnMaterial: 'TYRE-R15-001',
    returnReason: 'Defective tyre - air leakage',
    quantity: 4,
    total: 1200.0,
    custAccountNo: '6080100900',
    customerName: 'PS Tyres & Battery Auto Services Sdn. Bhd',
    location: '123 Toyo Road, Toyo Industrial Park, 50000 Kuala Lumpur, Malaysia',
    distributionChannel: 'ETEN',
    division: 'DIV01',
    orderStatus: 1
});

const customerInfo = ref({
    name: 'Lee Wei Ming',
    vehicle: 'Toyota Hilux 2.8G',
    regNo: 'WXY 4567'
});

const warantyDetail = ref({
    contactPerson: 'Ahmad Zaki',
    contactNo: '+6012-3456789'
});

// Approval / Reject handling
const returnFinalStatus = ref(null); // "approved" or "rejected"
const rejectReason = ref('');
const showRejectReason = ref(false);

// Predefined reject reasons
const rejectReasonOptions = ref([
    { label: 'Incorrect material returned', value: 'Incorrect material returned' },
    { label: 'Quantity mismatch', value: 'Quantity mismatch' },
    { label: 'Expired return period', value: 'Expired return period' },
    { label: 'Damaged item not acceptable', value: 'Damaged item not acceptable' },
    { label: 'Other (not eligible)', value: 'Other (not eligible)' }
]);


// Display text
const returnFinalStatusText = computed(() => {
    if (returnFinalStatus.value === 'approved') return 'Approved';
    if (returnFinalStatus.value === 'rejected') return 'Rejected';
    return '';
});

// ✅ Approve Return Order
function onApproveReturnOrder() {
    returnFinalStatus.value = 'approved';
    showRejectReason.value = false;
    rejectReason.value = '';
}

// ✅ Open Reject Return Order form
function onRejectReturnOrder() {
    showRejectReason.value = true;
    rejectReason.value = '';
}

// ✅ Cancel Reject Return Order
function cancelRejectReturnOrder() {
    showRejectReason.value = false;
    rejectReason.value = '';
}

// ✅ Submit Reject Return Order
function submitRejectReturnOrder() {
    if (!rejectReason.value) return;
    returnFinalStatus.value = 'rejected';
    showRejectReason.value = false;
}
</script>
