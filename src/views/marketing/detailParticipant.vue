<template>
    <Fluid>
        <div class="flex flex-col md:flex-row gap-8">
            <!-- LEFT CONTENT -->
            <div class="md:w-2/3">
                <div class="card flex flex-col gap-6 w-full">
                    <!-- HEADER -->
                    <div class="flex items-center justify-between border-b pb-2">
                        <div class="flex items-center gap-3">
                            <RouterLink to="/marketing/listRedemption">
                                <Button icon="pi pi-arrow-left font-bold" class="p-button-text p-button-secondary text-xl" size="big" v-tooltip="'Back'" />
                            </RouterLink>
                            <div class="text-2xl font-bold text-gray-800">Warranty</div>
                        </div>
                    </div>

                    <!-- RECIPIENT INFO -->
                    <div class="mt-2 grid grid-cols-2 gap-4">
                        <div>
                            <span class="block text-sm font-bold text-gray-700">Registration Number</span>
                            <p class="text-lg font-medium">{{ customerInfo.regNo }}</p>
                        </div>
                        <div>
                            <span class="block text-sm font-bold text-gray-700">Tire Pattern</span>
                            <p class="text-lg text-gray-500">{{ item.patternName }}</p>
                        </div>
                        <div>
                            <span class="block text-sm font-bold text-gray-700">Size</span>
                            <p class="text-lg text-gray-500">{{ item.size }}</p>
                        </div>
                        <div>
                            <span class="block text-sm font-bold text-gray-700">Serial No</span>
                            <p class="text-lg text-gray-500">{{ item.serialNo }}</p>
                        </div>
                    </div>

                    <!-- INVOICE FILE -->
                    <div class="mt-4 border-t pt-4">
                        <span class="block text-sm font-bold text-gray-700 mb-2">Invoice File</span>
                        <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border">
                            <i class="pi pi-file-pdf text-red-500 text-xl"></i>
                            <div class="flex-1">
                                <p class="font-medium text-gray-800">{{ invoiceFileName }}</p>
                                <p class="text-sm text-gray-500">{{ formatFileSize(invoiceFileSize) }}</p>
                            </div>
                            <div class="flex gap-2">
                                <Button icon="pi pi-eye" class="p-button-secondary p-button-sm" @click="viewInvoice" v-tooltip="'View Invoice'" />
                                <Button icon="pi pi-download" class="p-button-primary p-button-sm" @click="downloadInvoice" v-tooltip="'Download Invoice'" />
                            </div>
                        </div>
                    </div>

                    <!-- ACTION BUTTONS -->
                    <div v-if="redemption.status === 'Pending'" class="flex justify-end gap-3 mt-6">
                        <Button 
                            label="Reject" 
                            class="p-button-danger w-36" 
                            @click="showRejectDialog = true" 
                        />
                        <Button 
                            label="Approve" 
                            class="p-button-success w-36" 
                            @click="showApproveDialog = true" 
                        />
                    </div>

                    <!-- STATUS RESULT CARD -->
                    <div v-if="redemption.status === 'Approved'" class="mt-4">
                        <div class="card border border-green-200 bg-green-50">
                            <div class="flex items-center gap-2 mb-3">
                                <i class="pi pi-check-circle text-green-500 text-xl"></i>
                                <h3 class="font-bold text-green-700 text-lg">Approved</h3>
                            </div>
                            <div class="grid grid-cols-2 gap-3 text-sm">
                                <div>
                                    <span class="font-semibold text-gray-700">Approved By:</span>
                                    <p class="text-gray-600">{{ redemption.approvedBy }}</p>
                                </div>
                                <div>
                                    <span class="font-semibold text-gray-700">Approved Date:</span>
                                    <p class="text-gray-600">{{ formatDate(redemption.approvedDate) }}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div v-if="redemption.status === 'Rejected'" class="mt-4">
                        <div class="card border border-red-200 bg-red-50">
                            <div class="flex items-center gap-2 mb-3">
                                <i class="pi pi-times-circle text-red-500 text-xl"></i>
                                <h3 class="font-bold text-red-700 text-lg">Rejected</h3>
                            </div>
                            <div class="grid grid-cols-2 gap-3 text-sm">
                                <div>
                                    <span class="font-semibold text-gray-700">Rejected Date:</span>
                                    <p class="text-gray-600">{{ formatDate(redemption.rejectedDate) }}</p>
                                </div>
                                <div class="col-span-2">
                                    <span class="font-semibold text-gray-700">Reason:</span>
                                    <p class="text-gray-600">{{ redemption.rejectReason }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- RIGHT CONTENT (Customer + Dealer Info) -->
            <div class="md:w-1/3 flex flex-col gap-6">
                <!-- CUSTOMER INFO CARD -->
                <div class="card flex flex-col w-full">
                    <div class="flex items-center justify-between border-b pb-2 mb-2">
                        <h2 class="text-2xl font-bold text-gray-800">Customer Info</h2>
                    </div>
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
                        </tbody>
                    </table>
                </div>

                <!-- DEALER INFO CARD -->
                <div class="card flex flex-col w-full">
                    <div class="flex items-center justify-between border-b pb-2 mb-2">
                        <h2 class="text-2xl font-bold text-gray-800">Dealer Info</h2>
                    </div>
                    <table class="w-full text-sm text-left text-gray-700">
                        <tbody>
                            <tr class="border-b">
                                <td class="px-4 py-2 font-medium">Dealer Name</td>
                                <td class="px-4 py-2 text-right">{{ backOrder.customerName }}</td>
                            </tr>
                            <tr class="border-b">
                                <td class="px-4 py-2 font-medium">Location</td>
                                <td class="px-4 py-2 text-right">{{ backOrder.location }}</td>
                            </tr>
                            <tr class="border-b">
                                <td class="px-4 py-2 font-medium">Account No</td>
                                <td class="px-4 py-2 text-right">{{ backOrder.custAccountNo }}</td>
                            </tr>
                            <tr class="border-b">
                                <td class="px-4 py-2 font-medium">Contact Person</td>
                                <td class="px-4 py-2 text-right">{{ warantyDetail.contactPerson }}</td>
                            </tr>
                            <tr class="border-b">
                                <td class="px-4 py-2 font-medium">Contact Number</td>
                                <td class="px-4 py-2 text-right">{{ warantyDetail.contactNo }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- DIALOGS -->
        <Dialog v-model:visible="showRejectDialog" modal header="Reject Redemption" :style="{ width: '500px' }">
            <div>
                <label for="rejectReason" class="block text-sm font-medium text-gray-700 mb-2">
                    Reason for rejection <span class="text-red-500">*</span>
                </label>
                <textarea
                    id="rejectReason"
                    v-model="rejectReason"
                    class="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-red-400"
                    placeholder="Provide rejection reason..."
                    rows="4"
                ></textarea>
            </div>
            <template #footer>
                <div class="flex justify-end gap-3">
                    <Button label="Cancel" class="p-button-secondary p-button-sm p-button-outlined" @click="closeRejectDialog" />
                    <Button label="Submit Rejection" class="p-button-danger p-button-sm" @click="submitReject" :disabled="!rejectReason.trim()" />
                </div>
            </template>
        </Dialog>

        <Dialog v-model:visible="showApproveDialog" modal header="Approve Redemption" :style="{ width: '500px' }">
            <div>
                <label for="approvedBy" class="block text-sm font-medium text-gray-700 mb-2">
                    Approved By <span class="text-red-500">*</span>
                </label>
                <InputText id="approvedBy" v-model="approvedBy" class="w-full" placeholder="Enter your name" />
            </div>
            <template #footer>
                <div class="flex justify-end gap-3">
                    <Button label="Cancel" class="p-button-secondary p-button-sm p-button-outlined" @click="closeApproveDialog" />
                    <Button label="Submit Approval" class="p-button-success p-button-sm" @click="submitApprove" :disabled="!approvedBy.trim()" />
                </div>
            </template>
        </Dialog>
    </Fluid>
</template>


<script setup>
import { ref } from 'vue';


const showRejectDialog = ref(false);
const showApproveDialog = ref(false);
const rejectReason = ref('');
const approvedBy = ref('');
const showValidationError = ref(false);
const showApproveValidationError = ref(false);

// Invoice file data
const invoiceFileName = ref('warranty_invoice_2024_001.pdf');

const redemption = ref({
    id: 1,
    refno: 'TYO-MY-1001',
    tc_userID: 'U1001',
    memberLevel: 'Gold',
    recipientName: 'Ahmad Faizal',
    contactNumber: '012-3456789',
    addLine1: 'No. 12, Jalan Melur',
    addLine2: 'Taman Melawati',
    addCity: 'Kuala Lumpur',
    addState: 'Selangor',
    addPostcode: '53100',
    addCountry: 'Malaysia',
    totalPoint: 500,
    itemName: 'Bluetooth Headphones',
    quantity: 1,
    redemptionDate: '2024-03-15',
    courierName: 'DHL Express',
    trackingNumber: 'DHLMY10001',
    shippedDate: '2024-04-01',
    status: 'Pending', // Changed to Pending for demo
    adminID: 'admin01',
    approvedBy: '',
    approvedDate: '',
    rejectedDate: '',
    rejectReason: '',
    verifiedDate: '2024-04-02',
    created: '2024-03-25',
    deleted: false
});

const backOrder = ref({
    id: 1,
    etenUserListID: 'U12345',
    etenUserID: 'U67890',
    custAccountNo: '6080100900',
    customerName: 'PS Tyres & Battery Auto Services Sdn. Bhd',
    location: '123 Toyo Road, Toyo Industrial Park, 50000 Kuala Lumpur, Malaysia',
    signboard: 'T10',
    salesOrg: 'SO001',
    distributionChannel: 'ETEN',
    division: 'DIV01',
    priceGroup: 'PG01',
    sapOrderType: 'NORMAL',
    customerCondGrp: 'CCG1',
    shipTo: 'YESSIR TYRES SOLUTION SDN BHD',
    shippingCond: 'Standard',
    storageLocation: 'LOC01',
    orderDesc: 'Order for electronics',
    channel: 'ETEN',
    deliveryType: 'DELIVER',
    deliveryDate: '2023-10-15',
    boOrderNo: 'BO1001',
    backOrderArray: [],
    fulfillArray: [],
    orderStatus: 1,
    expiry: '2023-11-15',
    created: '2023-10-01',
    modified: '2023-10-05'
});

const warantyDetail = ref({
    contactPerson: 'Ahmad Zaki',
    contactNo: '+6012-3456789'
});

const item = ref({
    id: 1,
    warrantyRegisterID: 1001,
    materialid: '81114NE0304175H',
    itemdesc: '215/45R17 91W',
    pattern: 'T1R',
    patternName: 'Proxes T1R',
    isTWP: 1,
    sectionWidth: 215,
    tireseries: 45,
    rimDiameter: 17,
    speedplyrating: 'V',
    aspectRatio: '45',
    tyreSize: '215/45R17',
    loadIndex: '91',
    plyRating: 'XL',
    deleted: null,
    status: 'Non-Warranty',
    size: '215/45R17',
    origin: 'Japan',
    serialNo: 'TYR-99887766',
    desc: 'High-performance tire for sports cars and sedans',
    mfgcode: 'MFG-2025-001',
    tyrespec: '91W',
    weekcode: '3524',
    imageURL: '/demo/images/toyor_tayar1.png'
});

const customerInfo = ref({
    name: 'Lee Wei Ming',
    vehicle: 'Toyota Hilux 2.8G',
    regNo: 'WXY 4567'
});

// Invoice file functions
const viewInvoice = () => {
    console.log('Viewing invoice:', invoiceFileName.value);
};

const downloadInvoice = () => {
    console.log('Downloading invoice:', invoiceFileName.value);
};

// Format file size
const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Format date
const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-MY', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
};

// Close reject dialog and reset form
const closeRejectDialog = () => {
    showRejectDialog.value = false;
    rejectReason.value = '';
    showValidationError.value = false;
};

// Close approve dialog and reset form
const closeApproveDialog = () => {
    showApproveDialog.value = false;
    approvedBy.value = '';
    showApproveValidationError.value = false;
};

const statusLabel = (status) => {
    const statusMap = {
        Pending: 'Pending',
        Packing: 'Packing',
        Shipped: 'Shipped',
        Delivered: 'Delivered',
        Approved: 'Approved',
        Rejected: 'Rejected'
    };
    return statusMap[status] || 'Unknown';
};

const statusSeverity = (status) => {
    const severityMap = {
        Pending: 'warning',
        Packing: 'info',
        Shipped: 'warn',
        Delivered: 'success',
        Approved: 'success',
        Rejected: 'danger'
    };
    return severityMap[status] || 'secondary';
};

const submitReject = () => {
    if (!rejectReason.value.trim()) return;

    redemption.value.status = 'Rejected';
    redemption.value.rejectedDate = new Date().toISOString();
    redemption.value.rejectReason = rejectReason.value;
    closeRejectDialog();
};

const submitApprove = () => {
    if (!approvedBy.value.trim()) return;

    redemption.value.status = 'Approved';
    redemption.value.approvedBy = approvedBy.value;
    redemption.value.approvedDate = new Date().toISOString();
    closeApproveDialog();
};
</script>
