<template>
    <Fluid>
        <div class="flex flex-col md:flex-row gap-8">
            <!-- LEFT SIDE -->
            <div class="md:w-2/3">
                <div class="flex flex-col md:flex-row gap-8">
                    <div class="card flex flex-col gap-6 w-full">
                        <div class="text-2xl font-bold text-gray-800 border-b pb-2">
                            Back Order Detail
                        </div>

                        <div class="flex items-center justify-between w-full">
                            <div>
                                <span class="block text-sm text-gray-500">Return Request Number</span>
                                <span class="text-lg font-medium">{{ returnOrder.returnRequestNo }}</span>
                            </div>

                            <RouterLink to="/om/editreturnOrder">
                                <Button type="button" label="Edit" />
                            </RouterLink>
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
                        <div class="flex flex-col md:flex-row gap-8">
                            <div>
                                <span class="block text-sm font-bold text-black-700">Return Reason</span>
                                <p class="font-medium text-lg">{{ returnOrder.returnReason }}</p>
                            </div>
                            <div>
                                <span class="block text-sm font-bold text-black-700">Return Material</span>
                                <p class="font-medium text-lg">{{ returnOrder.returnMaterial }}</p>
                            </div>
                            <div>
                                <span class="block text-sm font-bold text-black-700">Quantity</span>
                                <p class="font-medium text-lg">{{ returnOrder.quantity }}</p>
                            </div>
                            <div>
                                <span class="block text-sm font-bold text-black-700">Total</span>
                                <p class="font-medium text-lg">{{ returnOrder.total }}</p>
                            </div>
                        </div>

                        <!-- Approval / Reject -->
                        <div v-if="returnFinalStatus" class="flex justify-end text-sm mt-4">
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
                        <div v-else class="flex justify-end mt-6 gap-2">
                            <Button label="Reject" class="p-button-danger" size="small" @click="onRejectScrap" />
                            <Button label="Approve" class="p-button-success" size="small" @click="onApproveScrap" />
                        </div>

                        <!-- Reject Reason Display -->
                        <div v-if="returnFinalStatus === 'rejected'" class="mt-4 p-4 border rounded bg-gray-50">
                            <p class="font-bold text-xl mb-2">Reject Reason</p>
                            <p>{{ rejectReason }}</p>
                        </div>

                        <!-- Reject Scrap Select -->
                        <div v-if="showRejectReason" class="mt-4 p-4 border rounded bg-gray-50">
                            <h3 class="font-bold text-xl mb-2">Reject Scrap</h3>
                            <p class="mb-2 text-gray-700">Select a reason for rejection:</p>
                            <select v-model="rejectReason" class="w-full border p-2 rounded">
                                <option value="">-- Please Select --</option>
                                <option v-for="reason in rejectReasonOptions" :key="reason" :value="reason">
                                    {{ reason }}
                                </option>
                            </select>
                            <div class="flex justify-end mt-2 space-x-2">
                                <Button label="Cancel" class="p-button-secondary" size="small" @click="cancelRejectReturn" />
                                <Button label="Submit" class="p-button-danger" size="small" @click="submitRejectScrap" :disabled="!rejectReason" />
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
                        <Tag 
                            :value="form.status === 1 ? 'Complete' : 'Pending'" 
                            :severity="form.status === 1 ? 'success' : 'warn'" 
                        />
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
                                <tr>
                                    <td class="px-4 py-2 font-medium"></td>
                                    <td class="px-2 py-2 text-right">
                                        <RouterLink to="/billing">
                                            <Button label="Push Order" size="small" />
                                        </RouterLink>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Customer Info -->
                <div class="card flex flex-col w-full mt-6">
                    <div class="text-2xl font-bold text-gray-800 border-b pb-2 mb-3">
                        👤 Customer Info
                    </div>
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
    total: 1200.00,
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
    "Incorrect material returned",
    "Quantity mismatch",
    "Expired return period",
    "Damaged item not acceptable",
    "Other (not eligible)"
]);

const returnFinalStatusText = computed(() => {
    if (returnFinalStatus.value === 'approved') return 'Approved';
    if (returnFinalStatus.value === 'rejected') return 'Rejected';
    return '';
});

// Approve function
function onApproveScrap() {
    returnFinalStatus.value = 'approved';
    showRejectReason.value = false;
    rejectReason.value = '';
}

// Open reject reason form
function onRejectScrap() {
    showRejectReason.value = true;
    rejectReason.value = ''; // reset selection
}

// Cancel reject
function cancelRejectReturn() {
    showRejectReason.value = false;
    rejectReason.value = '';
}

// Submit reject
function submitRejectScrap() {
    if (!rejectReason.value) return;
    returnFinalStatus.value = 'rejected';
    showRejectReason.value = false;
}
</script>
