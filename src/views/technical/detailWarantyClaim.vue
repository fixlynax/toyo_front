<template>
    <div class="flex flex-col md:flex-row gap-8">
        <!-- LEFT SIDE -->
        <div class="md:w-2/3 flex flex-col">
            <!-- Warranty Info -->
            <div class="card flex flex-col w-full">
                <div class="flex items-center justify-between border-b pb-2">
                    <div class="text-2xl font-bold text-gray-800">Claim Details</div>
                    <div class="inline-flex items-center gap-2">
                        <!-- Edit Event -->
                        <RouterLink to="/marketing/editEvent">
                            <Button label="Report Download" class="p-button-danger" size="small" />
                        </RouterLink>
                    </div>
                </div>

                <!-- Reference -->
                <div class="mt-6">
                    <div>
                        <span class="block text-sm font-bold text-black-700">Reference Number</span>
                        <span class="text-lg font-medium">{{ warantyDetail.refNo }}</span>
                    </div>
                    <RouterLink to="/marketing/editEtenUser"></RouterLink>
                </div>
            </div>

            <!-- Problem Issue -->
            <div class="card flex flex-col w-full">
                <div class="flex items-center justify-between border-b pb-2 mb-4">
                    <div class="text-2xl font-bold text-gray-800">Problem Issue</div>
                </div>

                <div class="grid grid-cols-1 gap-4 mb-4">
                    <img v-for="(photo, index) in warantyDetail.problem.imageURL" :key="index" :src="photo" alt="Problem Image" class="rounded-xl shadow-sm object-cover w-full h-80" />
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                    <div>
                        <span class="block text-sm font-bold text-black-700">Problem</span>
                        <p class="font-medium text-lg">{{ warantyDetail.problem.issue }}</p>
                    </div>

                    <div>
                        <span class="block text-sm font-bold text-black-700">Damage Code</span>
                        <p class="font-medium text-lg">{{ warantyDetail.problem.damageCode }}</p>
                    </div>
                </div>
            </div>

            <!-- Scrap Details -->
            <div class="card flex flex-col w-full">
                <div class="flex items-center justify-between border-b pb-2 mb-4">
                    <div class="text-2xl font-bold text-gray-800">Scrap Details</div>
                </div>
                <div class="grid grid-cols-1 gap-4 mb-4">
                    <img v-for="(photo, index) in warantyDetail.scrapDetails.imageURL1" :key="index" :src="photo" alt="Scrap Image" class="rounded-xl shadow-sm object-cover w-full h-80" />
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                    <div>
                        <span class="block text-sm font-bold text-black-700">Claim Date</span>
                        <p class="font-medium text-lg">{{ warantyDetail.claimDate }}</p>
                    </div>
                    <div>
                        <span class="block text-sm font-bold text-black-700">Claim Ref No</span>
                        <p class="font-medium text-lg">{{ warantyDetail.summary.scrapNo }}</p>
                    </div>
                    <div>
                        <span class="block text-sm font-bold text-black-700">Dealer Name</span>
                        <p class="font-medium text-lg">{{ warantyDetail.dealerName }}</p>
                    </div>
                    <div>
                        <span class="block text-sm font-bold text-black-700">Claim Type</span>
                        <p class="font-medium text-lg">{{ warantyDetail.claimType }}</p>
                    </div>
                </div>

                <div v-if="scrapFinalStatus" class="flex justify-end text-sm mt-4">
                    <span
                        class="px-4 py-2 rounded text-white"
                        :class="{
                            'bg-green-700': scrapFinalStatus === 'approved',
                            'bg-red-700': scrapFinalStatus === 'rejected'
                        }"
                    >
                        {{ scrapFinalStatusText }}
                    </span>
                </div>
                <div v-else class="flex justify-end mt-6 gap-2">
                    <Button label="Reject" class="p-button-danger" size="small" @click="onRejectScrap" />
                    <Button label="Approve" class="p-button-success" size="small" @click="onApproveScrap" />
                </div>

                <div v-if="scrapFinalStatus === 'rejected'" class="mt-4 p-4 border rounded bg-gray-50">
                    <p class="font-bold text-xl mb-2">Reject Reason</p>
                    <p>{{ rejectReason2 }}</p>
                </div>

                <div v-if="showRejectReason2" class="mt-4 p-4 border rounded bg-gray-50">
                    <h3 class="font-bold text-xl mb-2">Reject Scrap</h3>
                    <p class="mb-2 text-gray-700">Reason for rejection:</p>
                    <textarea v-model="rejectReason2" class="w-full border p-2 rounded" placeholder="Enter reason here..." rows="3"></textarea>
                    <div class="flex justify-end mt-2 space-x-2">
                        <Button label="Cancel" class="p-button-secondary" size="small" @click="cancelRejectScrap" />
                        <Button label="Submit" class="p-button-danger" size="small" @click="submitRejectScrap" :disabled="!rejectReason2.trim()">
                            <template #default></template>
                        </Button>
                    </div>
                </div>
            </div>

            <!-- CTC Details -->
            <div v-if="scrapFinalStatus === 'approved'" class="card flex flex-col w-full">
                <div class="flex items-center justify-between border-b pb-2 mb-4">
                    <div class="text-2xl font-bold text-gray-800">CTC Details</div>
                    <div class="inline-flex items-center gap-2">
                        <RouterLink to="/technical/createCTC">
                            <Button label="Create" class="p-button-info" size="small" />
                        </RouterLink>
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                    <div>
                        <span class="block text-sm font-bold text-black-700">Claim Date</span>
                        <p class="font-medium text-lg">{{ warantyDetail.collectDate }}</p>
                    </div>
                    <div>
                        <span class="block text-sm font-bold text-black-700">Collect Time</span>
                        <p class="font-medium text-lg">{{ warantyDetail.collectTime }}</p>
                    </div>
                </div>

                <div v-if="ctcFinalStatus" class="flex justify-end text-sm mt-4">
                    <span
                        class="px-4 py-2 rounded text-white"
                        :class="{
                            'bg-green-700': ctcFinalStatus === 'approved',
                            'bg-red-700': ctcFinalStatus === 'rejected'
                        }"
                    >
                        {{ ctcFinalStatusText }}
                    </span>
                </div>
                <div v-else class="flex justify-end mt-6 gap-2">
                    <Button label="Reject" class="p-button-danger" size="small" @click="onReject" />
                    <Button label="Approve" class="p-button-success" size="small" @click="onApprove" />
                </div>

                <div v-if="ctcFinalStatus === 'rejected'" class="mt-4 p-4 border rounded bg-gray-50">
                    <p class="font-bold text-xl mb-2">Rejection Reason</p>
                    <p>{{ rejectReason }}</p>
                </div>

                <div v-if="showRejectInput" class="mt-4 p-4 border rounded bg-gray-50">
                    <h3 class="font-bold text-xl mb-2">Reject Reason</h3>
                    <textarea v-model="rejectReason" class="w-full border p-2 rounded" placeholder="Enter reason..." rows="3"></textarea>
                    <div class="flex justify-end mt-2 space-x-2">
                        <Button label="Cancel" class="p-button-secondary" size="small" @click="cancelReject" />
                        <Button label="Submit" class="p-button-danger" size="small" @click="submitReject" :disabled="!rejectReason.trim()" />
                    </div>
                </div>
            </div>

            <!-- Claim Variable -->
            <div v-if="ctcFinalStatus === 'approved'" class="card flex flex-col w-full">
                <div class="flex items-center justify-between border-b pb-2 mb-4">
                    <div class="text-2xl font-bold text-gray-800">Claim Variable</div>
                    <div class="inline-flex items-center gap-2">
                        <RouterLink to="/technical/createOrder">
                            <Button label="Create" class="p-button-info" size="small" />
                        </RouterLink>
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                    <div>
                        <span class="block text-xm font-bold text-black-700">Claim %</span>
                        <p class="font-medium text-lg">{{ warantyDetail.claimVariable.Claim }}</p>
                    </div>
                    <div>
                        <span class="block text-xm font-bold text-black-700">Usable %</span>
                        <p class="font-medium text-lg">{{ warantyDetail.claimVariable.Usable }}</p>
                    </div>
                    <div>
                        <span class="block text-xm font-bold text-black-700">Worn %</span>
                        <p class="font-medium text-lg">{{ warantyDetail.claimVariable.Worn }}</p>
                    </div>
                    <div>
                        <span class="block text-xm font-bold text-black-700">Damage Code</span>
                        <p class="font-medium text-lg">{{ warantyDetail.problem.damageCode }}</p>
                    </div>
                </div>

                <!-- Final status shown -->
                <div v-if="claimFinalStatus" class="flex justify-end text-sm mt-4">
                    <span
                        class="px-4 py-2 rounded text-white"
                        :class="{
                            'bg-green-700': claimFinalStatus === 'approved',
                            'bg-red-700': claimFinalStatus === 'rejected'
                        }"
                    >
                        {{ claimFinalStatusText }}
                    </span>
                </div>

                <!-- Approve / Reject buttons -->
                <div v-else class="flex justify-end mt-6 gap-2">
                    <Button label="Reject" class="p-button-danger" size="small" @click="onRejectClaim" />
                    <Button label="Approve" class="p-button-success" size="small" @click="onApproveClaim" />
                </div>

                <!-- Approve workflow: Replacement or Reimbursement -->
                <div v-if="showApproveClaim" class="mt-4 p-4 border rounded bg-gray-50">
                    <h3 class="font-bold text-xl mb-2">Approve Claim</h3>
                    <select v-model="claimAction" class="w-full border p-2 rounded">
                        <option value="">-- Select Action --</option>
                        <option value="replacement">Replacement</option>
                        <option value="reimbursement">Reimbursement</option>
                    </select>
                    <div v-if="claimAction === 'replacement'" class="mt-4">
                        <h3 class="text-xl font-bold text-gray-800 mb-2">Replacement Order</h3>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                            <div>
                                <span class="block font-bold">Order No</span>
                                <p>{{ warantyDetail.replacementOrder.orderNo }}</p>
                            </div>
                            <div>
                                <span class="block font-bold">Name</span>
                                <p>{{ warantyDetail.replacementOrder.name }}</p>
                            </div>
                            <div>
                                <span class="block font-bold">Item</span>
                                <p>{{ warantyDetail.replacementOrder.item }}</p>
                            </div>
                            <div>
                                <span class="block font-bold">Quantity</span>
                                <p>{{ warantyDetail.replacementOrder.quantity }}</p>
                            </div>
                            <div>
                                <span class="block font-bold">Total</span>
                                <p>{{ warantyDetail.replacementOrder.total }}</p>
                            </div>
                            <div>
                                <span class="block font-bold">Sub Total</span>
                                <p>{{ warantyDetail.replacementOrder.subTotal }}</p>
                            </div>
                        </div>
                    </div>

                    <!-- Reimbursement -->
                    <div v-if="claimAction === 'reimbursement'" class="mt-4">
                        <h3 class="text-xl font-bold text-gray-800 mb-2">Reimbursement Details</h3>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                            <div>
                                <span class="block font-bold">Ref No</span>
                                <p>{{ warantyDetail.reimbursement.refNo }}</p>
                            </div>
                            <div>
                                <span class="block font-bold">Order No</span>
                                <p>{{ warantyDetail.reimbursement.orderNo }}</p>
                            </div>
                            <div>
                                <span class="block font-bold">Status</span>
                                <p>{{ warantyDetail.reimbursement.status }}</p>
                            </div>
                            <div>
                                <span class="block font-bold">Invoice Ammount</span>
                                <p>{{ warantyDetail.reimbursement.invoiceAmount }}</p>
                            </div>
                        </div>
                    </div>

                    <div class="flex justify-end mt-2 space-x-2">
                        <Button label="Cancel" class="p-button-secondary" size="small" @click="cancelApproveClaim" />
                        <Button label="Submit" class="p-button-success" size="small" @click="submitApproveClaim" :disabled="!claimAction" />
                    </div>
                </div>

                <!-- Reject workflow: Reason input -->
                <div v-if="showRejectClaim" class="mt-4 p-4 border rounded bg-gray-50">
                    <h3 class="font-bold c mb-2">Reject Claim</h3>
                    <p class="mb-2 text-gray-700">Reason for rejection:</p>
                    <textarea v-model="claimRejectReason" class="w-full border p-2 rounded" placeholder="Enter reason here..." rows="3"></textarea>
                    <div class="flex justify-end mt-2 space-x-2">
                        <Button label="Cancel" class="p-button-secondary" size="small" @click="cancelRejectClaim" />
                        <Button label="Submit" class="p-button-danger" size="small" @click="submitRejectClaim" :disabled="!claimRejectReason.trim()" />
                    </div>
                </div>

                <!-- Show extra details when approved/rejected -->
                <div v-if="claimFinalStatus === 'approved'" class="mt-4 p-6 border rounded bg-green-50">
                    <div v-if="claimAction === 'replacement'" class="mt-4">
                        <h3 class="text-xl font-bold text-gray-800 mb-2">Replacement Detail</h3>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                            <div>
                                <span class="block font-bold">Order No</span>
                                <p>{{ warantyDetail.replacementOrder.orderNo }}</p>
                            </div>
                            <div>
                                <span class="block font-bold">Name</span>
                                <p>{{ warantyDetail.replacementOrder.name }}</p>
                            </div>
                            <div>
                                <span class="block font-bold">Item</span>
                                <p>{{ warantyDetail.replacementOrder.item }}</p>
                            </div>
                            <div>
                                <span class="block font-bold">Quantity</span>
                                <p>{{ warantyDetail.replacementOrder.quantity }}</p>
                            </div>
                            <div>
                                <span class="block font-bold">Total</span>
                                <p>{{ warantyDetail.replacementOrder.total }}</p>
                            </div>
                            <div>
                                <span class="block font-bold">Sub Total</span>
                                <p>{{ warantyDetail.replacementOrder.subTotal }}</p>
                            </div>
                        </div>
                    </div>

                    <!-- Reimbursement -->
                    <div v-if="claimAction === 'reimbursement'" class="mt-4">
                        <h3 class="text-2xl font-bold text-gray-800 mb-2">Reimbursement Detail</h3>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                            <div>
                                <span class="block font-bold">Ref No</span>
                                <p>{{ warantyDetail.reimbursement.refNo }}</p>
                            </div>
                            <div>
                                <span class="block font-bold">Order No</span>
                                <p>{{ warantyDetail.reimbursement.orderNo }}</p>
                            </div>
                            <div>
                                <span class="block font-bold">Status</span>
                                <p>{{ warantyDetail.reimbursement.status }}</p>
                            </div>
                            <div>
                                <span class="block font-bold">Invoice Ammount</span>
                                <p>{{ warantyDetail.reimbursement.invoiceAmount }}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-if="claimFinalStatus === 'rejected'" class="mt-4 p-4 border rounded bg-red-50">
                    <h3 class="font-bold text-xl mb-2">Reject Reason</h3>
                    <p>{{ claimRejectReason }}</p>
                </div>
            </div>
        </div>

        <!-- RIGHT SIDE (unchanged, your original tables remain) -->
        <div class="md:w-1/3 flex flex-col">
            <!-- Customer Information -->
            <div class="card flex flex-col w-full">
                <div class="flex items-center justify-between border-b pb-2 mb-2">
                    <div class="text-2xl font-bold text-gray-800">👤 Customer Information</div>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full text-sm text-left text-gray-700">
                        <tbody>
                            <tr class="border-b">
                                <td class="px-4 py-2 font-medium">Customer Name</td>
                                <td class="px-4 py-2 text-right">{{ warantyDetail.customerInfo.name }}</td>
                            </tr>
                            <tr class="border-b">
                                <td class="px-4 py-2 font-medium">Vehicle</td>
                                <td class="px-4 py-2 text-right">{{ warantyDetail.customerInfo.vehicle }}</td>
                            </tr>
                            <tr class="border-b">
                                <td class="px-4 py-2 font-medium">Registration Number</td>
                                <td class="px-4 py-2 text-right">{{ warantyDetail.customerInfo.regNo }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Dealer Information -->
            <div class="card flex flex-col w-full">
                <div class="flex items-center justify-between border-b pb-2 mb-2">
                    <div class="text-2xl font-bold text-gray-800">🏬 Dealer Information</div>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full text-sm text-left text-gray-700">
                        <tbody>
                            <tr class="border-b">
                                <td class="px-4 py-2 font-medium">Dealer Name</td>
                                <td class="px-4 py-2 text-right">{{ warantyDetail.dealerName }}</td>
                            </tr>
                            <tr class="border-b">
                                <td class="px-4 py-2 font-medium">Dealer Code</td>
                                <td class="px-4 py-2 text-right">{{ warantyDetail.dealerInfo.dealerCode }}</td>
                            </tr>
                            <tr class="border-b">
                                <td class="px-4 py-2 font-medium">Contact Person</td>
                                <td class="px-4 py-2 text-right">{{ warantyDetail.dealerInfo.contactPerson }}</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-medium">Contact Number</td>
                                <td class="px-4 py-2 text-right">{{ warantyDetail.dealerInfo.contactNo }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div class="card flex flex-col w-full">
                <div class="flex items-center justify-between border-b pb-2 mb-2">
                    <div class="text-2xl font-bold text-gray-800">🏬 Tires Details</div>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full text-sm text-left text-gray-700">
                        <tbody>
                            <tr class="border-b">
                                <td class="px-4 py-2 font-medium">Serial Number</td>
                                <td class="px-4 py-2 text-right">{{ warantyDetail.tires.serialNo }}</td>
                            </tr>
                            <tr class="border-b">
                                <td class="px-4 py-2 font-medium">Pattern</td>
                                <td class="px-4 py-2 text-right">{{ warantyDetail.tires.pattern }}</td>
                            </tr>
                            <tr class="border-b">
                                <td class="px-4 py-2 font-medium">Size</td>
                                <td class="px-4 py-2 text-right">{{ warantyDetail.tires.size }}</td>
                            </tr>
                            <tr class="border-b">
                                <td class="px-4 py-2 font-medium">Tread Depth Tire 1</td>
                                <td class="px-4 py-2 text-right">{{ warantyDetail.tires.treadDepths[0] }}</td>
                            </tr>
                            <tr class="border-b">
                                <td class="px-4 py-2 font-medium">Tread Depth Tire 2</td>
                                <td class="px-4 py-2 text-right">{{ warantyDetail.tires.treadDepths[1] }}</td>
                            </tr>
                            <tr class="border-b">
                                <td class="px-4 py-2 font-medium">Tread Depth Tire 3</td>
                                <td class="px-4 py-2 text-right">{{ warantyDetail.tires.treadDepths[2] }}</td>
                            </tr>
                            <tr class="border-b">
                                <td class="px-4 py-2 font-medium">Tread Depth Tire 4</td>
                                <td class="px-4 py-2 text-right">{{ warantyDetail.tires.treadDepths[3] }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const showDecision = ref(false);
const decision = ref(null);
const selectedAction = ref('');
const showSubmit = ref(false);

const warantyDetail = ref({
    id: 1,
    refNo: 'CLM-2025-001',
    claimDate: '2025-09-01',
    collectDate: '2025-09-07',
    collectTime: '3:00PM',
    dealerName: 'AutoWorld KL',
    claimType: 'Tire Defect',
    status: 0,
    summary: {
        ctcNo: 'CTC-2025-001',
        scrapNo: 'SCR-8765',
        invoiceNo: 'INV-4567'
    },
    dealerInfo: {
        dealerCode: 'DLR-001',
        contactPerson: 'Ahmad Zaki',
        contactNo: '+6012-3456789'
    },
    customerInfo: {
        name: 'Lee Wei Ming',
        vehicle: 'Toyota Hilux 2.8G',
        regNo: 'WXY 4567'
    },
    tires: {
        size: '265/65R17',
        pattern: 'Open Country A/T',
        serialNo: 'TYR-99887766',
        treadDepths: [6.5, 6.7, 6.6, 6.4]
    },
    problem: {
        issue: 'Sidewall crack within 6 months of purchase',
        imageURL: ['/demo/images/sidewall-damage.jpg'],
        damageCode: 'D-102 (Sidewall Separation)'
    },
    claimVariable: {
        Claim: 95,
        Usable: 80,
        Worn: 20
    },
    scrapDetails: {
        scrapNo: 'SCR-8765',
        imageURL1: ['/demo/images/toyo.jpg']
    },
    replacementOrder: {
        orderNo: 'ORD-5569',
        name: 'Proxes',
        item: 'Proxes R45',
        quantity: '4',
        total: '500.00',
        subTotal: '2000.00'
    },
    reimbursement: {
        refNo: 'TBD-1109',
        orderNo: 'TY-119',
        status: 'Approved',
        invoiceAmount: '2000.00'
    }
});

const handleApprove = () => {
    decision.value = 'approve';
    showDecision.value = true;
    selectedAction.value = '';
    showSubmit.value = false;
};

const handleReject = () => {
    decision.value = 'reject';
    showDecision.value = true;
    selectedAction.value = '';
    showSubmit.value = false;
};

const submitDecision = () => {
    if (decision.value === 'approve') {
        console.log('✅ Submitted Approval:', selectedAction.value);
        alert(`Submitted Approval: ${selectedAction.value}`);
    } else if (decision.value === 'reject') {
        console.log('❌ Submitted Rejection:', selectedAction.value);
        alert(`Submitted Rejection: ${selectedAction.value}`);
    }
    cancelDecision();
};

const cancelDecision = () => {
    decision.value = null;
    selectedAction.value = '';
    showSubmit.value = false;
    showDecision.value = false;
};

// CTC section states
const ctcFinalStatus = ref('');
const showRejectInput = ref(false);
const rejectReason = ref('');

// Scrap section states
const scrapFinalStatus = ref('');
const showRejectReason2 = ref(false);
const rejectReason2 = ref('');

// Computed display texts
const ctcFinalStatusText = computed(() => {
    if (ctcFinalStatus.value === 'approved') return 'Approved';
    if (ctcFinalStatus.value === 'rejected') return 'Rejected';
    return '';
});

const scrapFinalStatusText = computed(() => {
    if (scrapFinalStatus.value === 'approved') return 'Approved';
    if (scrapFinalStatus.value === 'rejected') return 'Rejected';
    return '';
});

// CTC handlers
const onApprove = () => {
    ctcFinalStatus.value = 'approved';
    showRejectInput.value = false;
    rejectReason.value = '';
};

const onReject = () => {
    showRejectInput.value = true;
    rejectReason.value = '';
};

const cancelReject = () => {
    showRejectInput.value = false;
    rejectReason.value = '';
};

const submitReject = () => {
    if (rejectReason.value.trim()) {
        ctcFinalStatus.value = 'rejected';
        showRejectInput.value = false;
    }
};

// Scrap handlers
const onApproveScrap = () => {
    scrapFinalStatus.value = 'approved';
    showRejectReason2.value = false;
    rejectReason2.value = '';
};

const onRejectScrap = () => {
    showRejectReason2.value = true;
    rejectReason2.value = '';
};

const cancelRejectScrap = () => {
    showRejectReason2.value = false;
    rejectReason2.value = '';
};

const submitRejectScrap = () => {
    if (rejectReason2.value.trim()) {
        scrapFinalStatus.value = 'rejected';
        showRejectReason2.value = false;
    }
};

const claimFinalStatus = ref('');
const claimAction = ref('');
const claimRejectReason = ref('');
const showApproveClaim = ref(false);
const showRejectClaim = ref(false);

const claimFinalStatusText = computed(() => {
    if (claimFinalStatus.value === 'approved') return 'Approved';
    if (claimFinalStatus.value === 'rejected') return 'Rejected';
    return '';
});

// Handlers
const onApproveClaim = () => {
    showApproveClaim.value = true;
    showRejectClaim.value = false;
    claimAction.value = '';
};

const onRejectClaim = () => {
    showRejectClaim.value = true;
    showApproveClaim.value = false;
    claimRejectReason.value = '';
};

const cancelApproveClaim = () => {
    showApproveClaim.value = false;
    claimAction.value = '';
};

const cancelRejectClaim = () => {
    showRejectClaim.value = false;
    claimRejectReason.value = '';
};

const submitApproveClaim = () => {
    if (claimAction.value) {
        claimFinalStatus.value = 'approved';
        showApproveClaim.value = false;
    }
};

const submitRejectClaim = () => {
    if (claimRejectReason.value.trim()) {
        claimFinalStatus.value = 'rejected';
        showRejectClaim.value = false;
    }
};
</script>
