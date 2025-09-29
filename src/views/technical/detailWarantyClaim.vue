<template>
    <div class="p-6">
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
                                <Button label="Report" class="p-button-info" size="small" />
                            </RouterLink>

                            <!-- Delete Event -->
                            <Button label="Download" class="p-button-success" size="small" />
                        </div>
                    </div>

                    <!-- Reference -->
                    <div class="mt-6">
                        <div>
                            <span class="block text-xm font-bold text-black-700">Reference Number</span>
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

                    <div class="grid grid-cols-1 md:grid-cols-1 gap-4 mb-4">
                        <img v-for="(photo, index) in warantyDetail.problem.imageURL" :key="index" :src="photo" alt="catalogue Image 1" class="rounded-xl shadow-sm object-cover w-full h-80" />
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                        <!-- Problem -->
                        <div>
                            <span class="block text-xm font-bold text-black-700">Problem</span>
                            <p class="font-medium text-lg">{{ warantyDetail.problem.issue }}</p>
                        </div>

                        <!-- Damage Code -->
                        <div>
                            <span class="block text-xm font-bold text-black-700">Damage Code</span>
                            <p class="font-medium text-lg">{{ warantyDetail.problem.damageCode }}</p>
                        </div>
                    </div>
                </div>
                <!-- ✅ properly closed Problem Issue card -->

                <!-- CTC Details -->
                <div class="card flex flex-col w-full">
                    <!-- Header -->
                    <div class="flex items-center justify-between border-b pb-2 mb-4">
                        <div class="text-2xl font-bold text-gray-800">CTC Details</div>
                        <div class="inline-flex items-center gap-2">
                            <!-- Create Event -->
                            <RouterLink to="/technical/createOrder">
                                <Button label="Create" class="p-button-info" size="small" />
                            </RouterLink>
                        </div>
                    </div>

                    <!-- Claim Info -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                        <div>
                            <span class="block text-xm font-bold text-black-700">Claim Date</span>
                            <p class="font-medium text-lg">{{ warantyDetail.claimDate }}</p>
                        </div>
                        <div>
                            <span class="block text-xm font-bold text-black-700">Claim Ref No</span>
                            <p class="font-medium text-lg">{{ warantyDetail.summary.ctcNo }}</p>
                        </div>
                        <div>
                            <span class="block text-xm font-bold text-black-700">Dealer Name</span>
                            <p class="font-medium text-lg">{{ warantyDetail.dealerName }}</p>
                        </div>
                        <div>
                            <span class="block text-xm font-bold text-black-700">Claim Type</span>
                            <p class="font-medium text-lg">{{ warantyDetail.claimType }}</p>
                        </div>
                    </div>

                    <!-- Action Buttons -->
                    <div class="flex justify-end mt-6">
                        <div class="flex gap-2">
                            <!-- Reject Button -->
                            <Button label="Reject" class="p-button-danger" size="small" @click="showRejectReason = true" />

                            <!-- Approve Button -->
                            <Button label="Approve" class="p-button-success" size="small" @click="submitApprove" />
                        </div>
                    </div>

                    <!-- ======================= -->
                    <!-- Rejection Reason Section -->
                    <!-- ======================= -->
                    <div v-if="showRejectReason" class="card flex flex-col gap-6 w-full border border-red-300 mt-4 p-4">
                        <!-- Header -->
                        <div class="flex items-center justify-between border-b pb-2">
                            <h2 class="text-2xl font-bold text-red-600">❌ Reject CTC</h2>
                        </div>

                        <!-- Reason Input -->
                        <div>
                            <p class="mb-2 text-gray-700 text-lg">Reason for rejection:</p>
                            <textarea v-model="rejectReason" class="w-full border p-2 rounded" placeholder="Enter reason here..." rows="3"></textarea>
                        </div>

                        <!-- Action Buttons -->
                        <div class="flex justify-end mt-2 space-x-2">
                            <Button label="Cancel" class="p-button-secondary" size="small" @click="showRejectReason = false" />
                            <Button label="Submit" class="p-button-danger" size="small" @click="submitReject" :disabled="!rejectReason.trim()" />
                        </div>
                    </div>
                </div>

                <!-- Scrap Details -->
                <div class="card flex flex-col w-full">
                    <div class="flex items-center justify-between border-b pb-2 mb-4">
                        <div class="text-2xl font-bold text-gray-800">Scrap Details</div>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-1 gap-4 mb-4">
                        <img v-for="(photo, index) in warantyDetail.scrapDetails.imageURL1" :key="index" :src="photo" alt="catalogue Image 1" class="rounded-xl shadow-sm object-cover w-full h-80" />
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                        <div>
                            <span class="block text-xm font-bold text-black-700">Claim Date</span>
                            <p class="font-medium text-lg">{{ warantyDetail.claimDate }}</p>
                        </div>
                        <div>
                            <span class="block text-xm font-bold text-black-700">Claim Ref No</span>
                            <p class="font-medium text-lg">{{ warantyDetail.summary.scrapNo }}</p>
                        </div>
                        <div>
                            <span class="block text-xm font-bold text-black-700">Dealer Name</span>
                            <p class="font-medium text-lg">{{ warantyDetail.dealerName }}</p>
                        </div>
                        <div>
                            <span class="block text-xm font-bold text-black-700">Claim Type</span>
                            <p class="font-medium text-lg">{{ warantyDetail.claimType }}</p>
                        </div>
                    </div>

                    <!-- Action Buttons -->
                    <div class="flex justify-end mt-6">
                        <div class="flex gap-2">
                            <!-- Reject Button -->
                            <Button label="Reject" class="p-button-danger" size="small" @click="showRejectReason = true" />

                            <!-- Approve Button -->
                            <Button label="Approve" class="p-button-success" size="small" @click="submitApprove" />
                        </div>
                    </div>

                    <!-- ======================= -->
                    <!-- Rejection Reason Section -->
                    <!-- ======================= -->
                    <div v-if="showRejectReason" class="card flex flex-col gap-6 w-full border border-red-300 mt-4 p-4">
                        <!-- Header -->
                        <div class="flex items-center justify-between border-b pb-2">
                            <h2 class="text-2xl font-bold text-red-600">❌ Reject CTC</h2>
                        </div>

                        <!-- Reason Input -->
                        <div>
                            <p class="mb-2 text-gray-700 text-lg">Reason for rejection:</p>
                            <textarea v-model="rejectReason" class="w-full border p-2 rounded" placeholder="Enter reason here..." rows="3"></textarea>
                        </div>

                        <!-- Action Buttons -->
                        <div class="flex justify-end mt-2 space-x-2">
                            <Button label="Cancel" class="p-button-secondary" size="small" @click="showRejectReason = false" />
                            <Button label="Submit" class="p-button-danger" size="small" @click="submitReject" :disabled="!rejectReason.trim()" />
                        </div>
                    </div>
                </div>

                <!-- Claim Variable -->
                <div class="card flex flex-col w-full">
                    <div class="flex items-center justify-between border-b pb-2 mb-4">
                        <div class="text-2xl font-bold text-gray-800">Claim Variable</div>
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

                    <!-- Action Buttons (Approve/Reject) -->
                    <div v-if="!showDecision" class="flex justify-end mt-6">
                        <div class="flex gap-2">
                            <Button label="Reject" class="p-button-danger" size="small" @click="handleReject" />
                            <Button label="Approve" class="p-button-success" size="small" @click="handleApprove" />
                        </div>
                    </div>

                    <!-- Approve Options -->
                    <div v-if="decision === 'approve'" class="mt-4 card p-4 border">
                        <h3 class="text-lg font-bold mb-2">Select Approval Type</h3>
                        <select v-model="selectedAction" class="border p-2 rounded w-full mb-4">
                            <option disabled value="">-- Select Option --</option>
                            <option value="replacement">Replacement Order</option>
                            <option value="reimbursement">Reimbursement</option>
                        </select>

                        <!-- Replacement Order -->
                        <div v-if="selectedAction === 'replacement'" class="mt-4">
                            <h3 class="text-2xl font-bold text-gray-800 mb-2">Replacement Order</h3>
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
                        <div v-if="selectedAction === 'reimbursement'" class="mt-4">
                            <h3 class="text-2xl font-bold text-gray-800 mb-2">Reimbursement Details</h3>
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
                            </div>
                        </div>

                        <!-- Buttons -->
                        <div v-if="selectedAction" class="flex justify-end mt-4 space-x-2">
                            <Button label="Cancel" class="p-button-info" size="small" @click="cancelDecision" />
                            <Button label="Submit" class="p-button-danger" size="small" @click="submitDecision" />
                        </div>
                    </div>

                    <!-- Reject Options -->
                    <div v-if="decision === 'reject'" class="mt-4 card p-4 border">
                        <h3 class="text-lg font-bold mb-2">Reason for Rejection</h3>
                        <select v-model="selectedAction" class="border p-2 rounded w-full mb-4">
                            <option disabled value="">-- Select Reason --</option>
                            <option value="expired">Warranty Expired</option>
                            <option value="notCapable">Not Capable for Claim</option>
                            <option value="terms">Not Following Terms & Conditions</option>
                        </select>

                        <!-- Buttons -->
                        <div v-if="selectedAction" class="flex justify-end mt-4 space-x-2">
                            <Button label="Cancel" class="p-button-info" size="small" @click="cancelDecision" />
                            <Button label="Submit" class="p-button-danger" size="small" @click="submitDecision" />
                        </div>
                    </div>
                </div>
            </div>
            <!-- ✅ properly closed CTC Details card -->
            <!-- ✅ close LEFT SIDE -->

            <!-- RIGHT SIDE -->
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
            <!-- ✅ close RIGHT SIDE -->
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const memberDetail = ref({
    id: 10,
    etenUserID: 'EU1010',
    countryCode: '60',
    mobileNumber: '1890123456',
    password: 'hashed_pw_10',
    firstName: 'Faizal',
    lastName: 'Rahman',
    emailAddress: 'faizal.rahman@toyotires.com.my',
    gender: 'Male',
    race: 'Malay',
    state: 'Sabah',
    level: 'Silver',
    memberSince: '2025-04-20',
    lastLogin: '2025-08-01 12:05:00',
    allow_warranty: 0,
    allow_order: 1,
    allow_billing: 0,
    allow_sale: 1,
    allow_user: 0,
    activationCode: 'ACT01234',
    isMaster: 0,
    device: 'Windows Laptop',
    platform: 'Web',
    fcmToken: 'fcm_token_10',
    status: 1,
    activated: 1,
    created: '2025-04-20',
    deleted: 0
});

const showPassword = ref(false);

const showDecision = ref(false); // controls whether Approve/Reject are hidden
const decision = ref(null); // "approve" | "reject"
const selectedAction = ref(''); // chosen action (replacement/reimbursement/reason)
const showSubmit = ref(false);

const warantyDetail = ref({
    id: 1,
    refNo: 'CLM-2025-001',
    claimDate: '2025-09-01',
    dealerName: 'AutoWorld KL',
    claimType: 'Tire Defect',
    status: 0, // Pending
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
        Claim: 95, // 🔑 numeric
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
        status: 'Return'
    }
});

const handleApprove = () => {
    decision.value = 'approve';
    showDecision.value = true; // hide Approve/Reject, show approve options
    selectedAction.value = '';
    showSubmit.value = false;
};

const handleReject = () => {
    decision.value = 'reject';
    showDecision.value = true; // hide Approve/Reject, show reject reasons
    selectedAction.value = '';
    showSubmit.value = false;
};

const submitDecision = () => {
  if (decision.value === "approve") {
    console.log("✅ Submitted Approval:", selectedAction.value);
    alert(`Submitted Approval: ${selectedAction.value}`);
  } else if (decision.value === "reject") {
    console.log("❌ Submitted Rejection:", selectedAction.value);
    alert(`Submitted Rejection: ${selectedAction.value}`);
  }

  // reset back to initial state after submit
  cancelDecision();
};


const cancelDecision = () => {
    // Reset everything
    decision.value = null;
    selectedAction.value = '';
    showSubmit.value = false;
    showDecision.value = false; // 👈 this brings back Approve/Reject buttons
};

const showRejectReason = ref(false);
const rejectReason = ref("");

// ✅ Approve logic
const submitApprove = () => {
  console.log("✅ Approved claim");
  alert("Claim Approved ✅");
  // 👉 You can add API call here
};

// ✅ Reject logic
const submitReject = () => {
  console.log("❌ Rejected with reason:", rejectReason.value);
  alert(`Claim Rejected ❌\nReason: ${rejectReason.value}`);
  
  // Reset after submit
  rejectReason.value = "";
  showRejectReason.value = false;
};

// ✅ Cancel rejection
const cancelReject = () => {
  rejectReason.value = "";
  showRejectReason.value = false;
};
// 1. Suspend/Un-Activated
const isActivated = ref(false);
const confirmSuspend = () => {
    isActivated.value = !isActivated.value;
};

// 2. Block/Un-block Device List
const devices = ref([
    {
        id: 1,
        name: 'Windows Laptop',
        uniqueId: '00008030-001E3D400043402E',
        lastActive: '8/9/2025 10:54 pm',
        isBlocked: true
    }
]);

const toggleBlock = (device) => {
    device.isBlocked = !device.isBlocked;
};

const users = ref([
    { id: 'U001', name: 'John Doe', phone: '0123456789', account: '6080100900', lastLogin: '11/9/2025 8:00am', status: 1 },
    { id: 'U002', name: 'Jane Smith', phone: '0198765432', account: '6080100901', lastLogin: '10/9/2025 8:00am', status: 1 },
    { id: 'U003', name: 'Alex Tan', phone: '0172233445', account: '6080100902', lastLogin: '23/7/2025 8:00am', status: 0 },
    { id: 'U004', name: 'Siti Aminah', phone: '0111122233', account: '6080100903', lastLogin: '09/9/2025 8:00am', status: 1 },
    { id: 'U005', name: 'Michael Lee', phone: '0139988776', account: '6080100904', lastLogin: '07/8/2025 8:00am', status: 0 }
]);

const billingDocs = ref([
    { id: 1, name: 'Invoice #001', type: 'Invoice' },
    { id: 2, name: 'Credit Note #100', type: 'CN' },
    { id: 3, name: 'Debit Note #200', type: 'DN' },
    { id: 4, name: 'SOA Jan 2025', type: 'SOA Statement' },
    { id: 5, name: 'Refund Note #10', type: 'Refund Note' }
]);

const viewDoc = (doc) => {
    console.log('Viewing billing document:', doc);
};

// 4. Finance Documents
const financeDocs = ref([
    { id: 1, name: 'Payment Receipt' },
    { id: 2, name: 'Tax Certificate' },
    { id: 3, name: 'Bank Statement' },
    { id: 4, name: 'Audit Report' },
    { id: 5, name: 'Financial Summary' }
]);

const viewFinance = (doc) => {
    console.log('Viewing finance document:', doc);
};

const manageUser = (user) => {
    console.log('Managing user:', user);
};

const shiptoList = ref([
    {
        id: 1,
        companyName1: 'Tan Know Car Tires',
        companyName2: '',
        companyName3: '',
        companyName4: '',
        addressLine1: 'Lot 123, Jalan Sungai',
        addressLine2: 'Seksyen 15',
        addressLine3: '',
        addressLine4: '',
        city: 'Shah Alam',
        state: 'Selangor',
        postcode: '40150',
        country: 'Malaysia',
        phoneNumber: '03-55123456',
        mobileNumber: '012-3456789',
        emailAddress: 'info@toyotires.my'
    },
    {
        id: 2,
        companyName1: 'Shiro Auto Parts',
        companyName2: 'Warehouse Division',
        companyName3: '',
        companyName4: '',
        addressLine1: 'No 45, Jalan Merdeka',
        addressLine2: '',
        addressLine3: '',
        addressLine4: '',
        city: 'Kuala Lumpur',
        state: 'Wilayah Persekutuan',
        postcode: '50450',
        country: 'Malaysia',
        phoneNumber: '03-98765432',
        mobileNumber: '019-8765432',
        emailAddress: 'contact@shiroauto.com'
    }
]);
</script>
