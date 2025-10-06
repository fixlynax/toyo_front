<template>
    <div class="flex flex-col md:flex-row gap-8">
        <!-- LEFT SIDE (2/3 width) -->
        <div class="md:w-2/3 flex flex-col">
            <!-- Claim Details -->
            <div class="card flex flex-col w-full">
                <div class="flex items-center justify-between border-b pb-2">
                    <div class="text-2xl font-bold text-gray-800">Claim Details</div>
                    <div class="inline-flex items-center gap-2">
                        <RouterLink to="/marketing/editEvent">
                            <Button label="Report Download" class="p-button-danger" size="small" />
                        </RouterLink>
                    </div>
                </div>
                <div class="mt-6">
                    <div>
                        <span class="block text-sm font-bold text-black-700">Reference Number</span>
                        <span class="text-lg font-medium">{{ warantyDetail.refNo }}</span>
                    </div>
                </div>
            </div>

            <!-- Tire Details -->
            <div class="card flex flex-col w-full">
                <div class="flex items-center justify-between border-b pb-2 mb-4">
                    <div class="text-2xl font-bold text-gray-800">Tire Details</div>
                </div>
                <div class="flex flex-col md:flex-row gap-4 mt-2" v-if="warantyDetail.tires">
                    <div class="w-full">
                        <span class="block text-xm font-bold text-black-700">Serial Number</span>
                        <p class="text-lg font-medium">{{ warantyDetail.tires.serialNo }}</p>
                    </div>
                    <div class="w-full">
                        <span class="block text-xm font-bold text-black-700">Pattern</span>
                        <p class="text-lg font-medium">{{ warantyDetail.tires.pattern }}</p>
                    </div>
                </div>
                <div class="flex flex-col md:flex-row gap-4 mt-2" v-if="warantyDetail.tires.size">
                    <div class="w-full">
                        <span class="block text-xm font-bold text-black-700">Section Width</span>
                        <p class="text-lg font-medium">{{ warantyDetail.tires.sectionWidth }}</p>
                    </div>
                    <div class="w-full">
                        <span class="block text-xm font-bold text-black-700">Tire Series</span>
                        <p class="text-lg font-medium">{{ warantyDetail.tires.tireSeries }}</p>
                    </div>

                    <div class="w-full">
                        <span class="block text-xm font-bold text-black-700">Rim Diameter</span>
                        <p class="text-lg font-medium">{{ warantyDetail.tires.rimDiameter }}</p>
                    </div>
                    <div class="w-full">
                        <span class="block text-xm font-bold text-black-700">Speed Ply Rating</span>
                        <p class="text-lg font-medium">{{ warantyDetail.tires.speedPlyRating }}</p>
                    </div>
                </div>

                <div class="flex flex-col md:flex-row gap-4 mt-2" v-if="warantyDetail.tires.treadDepths">
                    <div class="w-full">
                        <span class="block text-xm font-bold text-black-700">Tread Depth Tire</span>
                        <p class="text-lg font-medium">{{ warantyDetail.tires.treadDepths }}</p>
                    </div>
                </div>
            </div>

            <div class="flex flex-col md:flex-row gap-8">
                <!-- LEFT SIDE (2/3 width) -->
                <div class="md:w-1/2 flex flex-col">
                    <!-- Customer Information (moved to left) -->
                    <div class="card flex flex-col w-full">
                        <div class="flex items-center justify-between border-b pb-2 mb-2">
                            <div class="text-2xl font-bold text-gray-800">👤 Customer Information</div>
                        </div>
                        <div class="flex flex-col md:flex-row gap-4 mt-2" v-if="warantyDetail.customerInfo">
                            <div class="w-full">
                                <span class="block text-xm font-bold text-black-700">Customer Name</span>
                                <p class="text-lg font-medium">{{ warantyDetail.customerInfo.name }}</p>
                            </div>
                            <div class="w-full">
                                <span class="block text-xm font-bold text-black-700">Vehicle</span>
                                <p class="text-lg font-medium">{{ warantyDetail.customerInfo.vehicle }}</p>
                            </div>
                        </div>
                        <div class="flex flex-col md:flex-row gap-4 mt-2" v-if="warantyDetail.customerInfo.regNo">
                            <div class="w-full">
                                <span class="block text-xm font-bold text-black-700">Registration Number</span>
                                <p class="text-lg font-medium">{{ warantyDetail.customerInfo.regNo }}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="md:w-1/2 flex flex-col">
                    <!-- Dealer Information (moved to left) -->
                    <div class="card flex flex-col w-full">
                        <div class="flex items-center justify-between border-b pb-2 mb-2">
                            <div class="text-2xl font-bold text-gray-800">🏬 Dealer Information</div>
                        </div>
                        <div class="flex flex-col md:flex-row gap-4 mt-2" v-if="warantyDetail.dealerInfo">
                            <div class="w-full">
                                <span class="block text-xm font-bold text-black-700">Dealer Name</span>
                                <p class="text-lg font-medium">{{ warantyDetail.dealerName }}</p>
                            </div>
                            <div class="w-full">
                                <span class="block text-xm font-bold text-black-700">Dealer Code</span>
                                <p class="text-lg font-medium">{{ warantyDetail.dealerInfo.dealerCode }}</p>
                            </div>
                        </div>
                        <div class="flex flex-col md:flex-row gap-4 mt-2" v-if="warantyDetail.dealerInfo.contactPerson">
                            <div class="w-full">
                                <span class="block text-xm font-bold text-black-700">Contact Person</span>
                                <p class="text-lg font-medium">{{ warantyDetail.dealerInfo.contactPerson }}</p>
                            </div>
                            <div class="w-full">
                                <span class="block text-xm font-bold text-black-700">Contact Number</span>
                                <p class="text-lg font-medium">{{ warantyDetail.dealerInfo.contactNo }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- RIGHT SIDE (1/3 width) -->
        <div class="md:w-1/3 flex flex-col">
            <!-- Problem Issue -->
            <div class="card flex flex-col w-full">
                <div class="flex items-center justify-between border-b pb-2 mb-4">
                    <div class="text-2xl font-bold text-gray-800">Problem Issue</div>
                </div>
                <div class="grid grid-cols-1 gap-4 mb-4">
                    <img v-for="(photo, index) in warantyDetail.problem.imageURL" :key="index" :src="photo" alt="Problem Image" class="rounded-xl shadow-sm object-cover w-full h-80" />
                </div>
                <div class="grid grid-cols-1 gap-4 text-sm text-gray-700">
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

            <!-- CTC Details -->
            <div class="card flex flex-col w-full">
                <div class="flex items-center justify-between border-b pb-2 mb-4">
                    <div class="text-2xl font-bold text-gray-800">CTC Details</div>
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
                <!-- Rejection status -->
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
                <!-- Approve / Reject buttons -->
                <div v-else class="flex justify-end mt-6 gap-2">
                    <Button label="Reject" class="p-button-danger" size="small" @click="onReject" />
                    <Button label="Approve" class="p-button-success" size="small" @click="onApprove" />
                </div>
                <!-- Reject reason -->
                <div v-if="ctcFinalStatus === 'rejected'" class="mt-4 p-4 border rounded bg-gray-50">
                    <p class="font-bold text-xl mb-2">Rejection Reason</p>
                    <p>{{ rejectReason }}</p>
                </div>
                <!-- Reject input -->
                <div v-if="showRejectInput" class="mt-4 p-4 border rounded bg-gray-50">
                    <h3 class="font-bold text-xl mb-2">Reject Reason</h3>
                    <textarea v-model="rejectReason" class="w-full border p-2 rounded" placeholder="Enter reason..." rows="3"></textarea>
                    <div class="flex justify-end mt-2 space-x-2">
                        <Button label="Cancel" class="p-button-secondary" size="small" @click="cancelReject" />
                        <Button label="Submit" class="p-button-danger" size="small" @click="submitReject" :disabled="!rejectReason.trim()" />
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
                <!-- Scrap approval/rejection -->
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
                <!-- Reject reason for scrap -->
                <div v-if="scrapFinalStatus === 'rejected'" class="mt-4 p-4 border rounded bg-gray-50">
                    <p class="font-bold text-xl mb-2">Reject Reason</p>
                    <p>{{ rejectReason2 }}</p>
                </div>
                <!-- Reject input for scrap -->
                <div v-if="showRejectReason2" class="mt-4 p-4 border rounded bg-gray-50">
                    <h3 class="font-bold text-xl mb-2">Reject Scrap</h3>
                    <textarea v-model="rejectReason2" class="w-full border p-2 rounded" placeholder="Enter reason here..." rows="3"></textarea>
                    <div class="flex justify-end mt-2 space-x-2">
                        <Button label="Cancel" class="p-button-secondary" size="small" @click="cancelRejectScrap" />
                        <Button label="Submit" class="p-button-danger" size="small" @click="submitRejectScrap" :disabled="!rejectReason2.trim()" />
                    </div>
                </div>
            </div>

            <!-- Claim Details / Workflow -->
            <!-- Including claim variable, approval/rejection, and related workflow -->
            <div class="card flex flex-col w-full">
                <div class="flex items-center justify-between border-b pb-2 mb-4">
                    <div class="text-2xl font-bold text-gray-800">Claim Details</div>
                </div>
                <!-- Claim Variable -->
                <div v-if="claimFinalStatus" class="mb-4">
                    <div class="flex justify-between items-center mb-2">
                        <span class="font-bold">Claim Status</span>
                        <span
                            class="px-4 py-2 rounded text-white"
                            :class="{
                                'bg-green-700': claimFinalStatus === 'approved',
                                'bg-red-700': claimFinalStatus === 'rejected'
                            }"
                            >{{ claimFinalStatusText }}</span
                        >
                    </div>
                </div>
                <!-- Buttons for Approve / Reject -->
                <div v-if="!claimFinalStatus" class="flex justify-end gap-2 mb-4">
                    <Button label="Reject" class="p-button-danger" size="small" @click="onRejectClaim" />
                    <Button label="Approve" class="p-button-success" size="small" @click="onApproveClaim" />
                </div>

                <!-- Approve Claim Workflow -->
                <div v-if="showApproveClaim" class="mt-4 p-4 border rounded bg-gray-50">
                    <h3 class="font-bold text-xl mb-2">Approve Claim</h3>
                    <select v-model="claimAction" class="w-full border p-2 rounded">
                        <option value="">-- Select Action --</option>
                        <option value="replacement">Replacement</option>
                        <option value="reimbursement">Reimbursement</option>
                    </select>
                    <div v-if="claimAction === 'replacement'" class="mt-4">
                        <h4 class="font-semibold mb-2">Replacement Order</h4>
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
                    <div v-if="claimAction === 'reimbursement'" class="mt-4">
                        <h4 class="font-semibold mb-2">Reimbursement Details</h4>
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
                                <span class="block font-bold">Invoice Amount</span>
                                <p>{{ warantyDetail.reimbursement.invoiceAmount }}</p>
                            </div>
                        </div>
                    </div>
                    <div class="flex justify-end mt-2 space-x-2">
                        <Button label="Cancel" class="p-button-secondary" size="small" @click="cancelApproveClaim" />
                        <Button label="Submit" class="p-button-success" size="small" @click="submitApproveClaim" :disabled="!claimAction" />
                    </div>
                </div>

                <!-- Reject Claim Reason -->
                <div v-if="showRejectClaim" class="mt-4 p-4 border rounded bg-gray-50">
                    <h3 class="font-bold mb-2">Reject Claim</h3>
                    <p class="mb-2 text-gray-700">Reason for rejection:</p>
                    <textarea v-model="claimRejectReason" class="w-full border p-2 rounded" placeholder="Enter reason..." rows="3"></textarea>
                    <div class="flex justify-end mt-2 space-x-2">
                        <Button label="Cancel" class="p-button-secondary" size="small" @click="cancelRejectClaim" />
                        <Button label="Submit" class="p-button-danger" size="small" @click="submitRejectClaim" :disabled="!claimRejectReason.trim()" />
                    </div>
                </div>

                <!-- Final status display for claim -->
                <div v-if="claimFinalStatus" class="mt-4 p-6 border rounded bg-green-50">
                    <div v-if="claimAction === 'replacement'">
                        <h4 class="font-semibold mb-2">Replacement Detail</h4>
                        <!-- Replacement order details same as above -->
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                            <div>
                                <span class="font-bold">Order No</span>
                                <p>{{ warantyDetail.replacementOrder.orderNo }}</p>
                            </div>
                            <div>
                                <span class="font-bold">Name</span>
                                <p>{{ warantyDetail.replacementOrder.name }}</p>
                            </div>
                            <div>
                                <span class="font-bold">Item</span>
                                <p>{{ warantyDetail.replacementOrder.item }}</p>
                            </div>
                            <div>
                                <span class="font-bold">Quantity</span>
                                <p>{{ warantyDetail.replacementOrder.quantity }}</p>
                            </div>
                            <div>
                                <span class="font-bold">Total</span>
                                <p>{{ warantyDetail.replacementOrder.total }}</p>
                            </div>
                            <div>
                                <span class="font-bold">Sub Total</span>
                                <p>{{ warantyDetail.replacementOrder.subTotal }}</p>
                            </div>
                        </div>
                    </div>
                    <div v-if="claimAction === 'reimbursement'">
                        <h4 class="font-semibold mb-2">Reimbursement Detail</h4>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                            <div>
                                <span class="font-bold">Ref No</span>
                                <p>{{ warantyDetail.reimbursement.refNo }}</p>
                            </div>
                            <div>
                                <span class="font-bold">Order No</span>
                                <p>{{ warantyDetail.reimbursement.orderNo }}</p>
                            </div>
                            <div>
                                <span class="font-bold">Status</span>
                                <p>{{ warantyDetail.reimbursement.status }}</p>
                            </div>
                            <div>
                                <span class="font-bold">Invoice Amount</span>
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

            <!-- Invoice Details (added as per your request) -->
            <div class="card flex flex-col w-full">
                <div class="flex items-center justify-between border-b pb-2 mb-4">
                    <div class="text-2xl font-bold text-gray-800">Invoice Details</div>
                </div>
                <!-- Sample invoice details, replace or extend as needed -->
                <div class="grid grid-cols-1 gap-4 text-sm text-gray-700">
                    <div>
                        <span class="block font-bold">Invoice No</span>
                        <p>{{ warantyDetail.summary.invoiceNo }}</p>
                    </div>
                    <!-- Add more invoice fields if available -->
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';

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
        sectionWidth: 255,
        tireSeries: 80,
        rimDiameter: 17,
        loadIndex: 112,
        speedPlyRating: 'S',
        runFlat: false,
        treadDepths: 6.5
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

// Claim Final Status
const claimFinalStatus = ref('');
const claimAction = ref('');
const claimRejectReason = ref('');
const showApproveClaim = ref(false);
const showRejectClaim = ref('');
const showRejectReason2 = ref(false);

// CTC Status
const ctcFinalStatus = ref('');
const rejectReason = ref('');

// Scrap Status
const scrapFinalStatus = ref('');
const rejectReason2 = ref('');

// Computed texts
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
const claimFinalStatusText = computed(() => {
    if (claimFinalStatus.value === 'approved') return 'Approved';
    if (claimFinalStatus.value === 'rejected') return 'Rejected';
    return '';
});

// Handlers
const onApprove = () => {
    ctcFinalStatus.value = 'approved';
    rejectReason.value = '';
};
const onReject = () => {
    rejectReason.value = '';
    ctcFinalStatus.value = 'rejected';
};
const cancelReject = () => {
    rejectReason.value = '';
    ctcFinalStatus.value = '';
};
const submitReject = () => {
    if (rejectReason.value.trim()) {
        ctcFinalStatus.value = 'rejected';
    }
};

// Scrap handlers
const onApproveScrap = () => {
    scrapFinalStatus.value = 'approved';
    rejectReason2.value = '';
};
const onRejectScrap = () => {
    rejectReason2.value = '';
    scrapFinalStatus.value = 'rejected';
};
const cancelRejectScrap = () => {
    rejectReason2.value = '';
    scrapFinalStatus.value = '';
};
const submitRejectScrap = () => {
    if (rejectReason2.value.trim()) {
        scrapFinalStatus.value = 'rejected';
    }
};

// Claim handlers
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
