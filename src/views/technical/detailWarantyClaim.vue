<template>
    <div class="flex flex-col md:flex-row gap-8">
        <!-- Loading State -->
        <div v-if="loading" class="text-center py-20 text-gray-500 text-lg w-full">Loading warranty details...</div>
        
        <!-- Error State -->
        <div v-else-if="error" class="text-center py-20 text-red-500 text-lg w-full">
            {{ error }}
        </div>

        <!-- Main Content -->
        <div v-else class="flex flex-col md:flex-row gap-8 w-full">
            <!-- LEFT SIDE -->
            <div class="md:w-2/3 flex flex-col">
                <!-- Claim Detail -->
                <div class="card flex flex-col w-full">
                    <div class="flex items-center justify-between border-b pb-2">
                        <div class="text-2xl font-bold text-gray-800">Warranty Detail</div>
                        <div class="inline-flex items-center gap-2">
                            <Button label="Report Download" class="p-button-danger" size="small" @click="downloadReport" />
                        </div>
                    </div>
                    <div class="mt-6">
                        <div>
                            <span class="block text-sm font-bold text-black-800">Ref No</span>
                            <span class="text-lg font-medium">{{ warantyDetail.claimRefNo }}</span>
                        </div>
                    </div>
                </div>

                <!-- Tire Detail -->
                <div class="card flex flex-col w-full">
                    <div class="flex items-center justify-between border-b pb-2 mb-4">
                        <div class="text-2xl font-bold text-gray-800">Tire Detail</div>
                    </div>

                    <div class="grid grid-cols-2 md:grid-cols-2 gap-4">
                        <div>
                            <span class="block text-sm font-bold text-black-800">Serial Number</span>
                            <p class="text-lg font-medium">{{ warantyDetail.plateSerial || 'N/A' }}</p>
                        </div>
                        <div>
                            <span class="block text-sm font-bold text-black-800">Pattern</span>
                            <p class="text-lg font-medium">{{ warantyDetail.pattern }}</p>
                        </div>
                        <div>
                            <span class="block text-sm font-bold text-black-800">Size</span>
                            <p class="text-lg font-medium">{{ warantyDetail.size }}</p>
                        </div>
                        <div>
                            <span class="block text-sm font-bold text-black-800">Tire Specification</span>
                            <p class="text-lg font-medium">{{ warantyDetail.tire_details?.tyrespec || 'N/A' }}</p>
                        </div>
                        <div>
                            <span class="block text-sm font-bold text-black-800">Manufacturing Code</span>
                            <p class="text-lg font-medium">{{ warantyDetail.tire_details?.mfgcode || 'N/A' }}</p>
                        </div>
                        <div>
                            <span class="block text-sm font-bold text-black-800">Week Code</span>
                            <p class="text-lg font-medium">{{ warantyDetail.tire_details?.weekcode || 'N/A' }}</p>
                        </div>
                    </div>
                </div>

                <!-- Customer and Dealer Information -->
                <div class="flex flex-col md:flex-row gap-8">
                    <!-- Customer -->
                    <div class="md:w-1/2 card">
                        <div class="border-b pb-2 mb-2 text-2xl font-bold text-gray-800">👤 Customer Information</div>
                        <div class="grid grid-cols-2 md:grid-cols-2 gap-4">
                            <div>
                                <span class="block text-sm font-bold text-black-800">Name</span>
                                <p class="text-lg font-medium">{{ warantyDetail.firstName }} {{ warantyDetail.lastName }}</p>
                            </div>
                            <div>
                                <span class="block text-sm font-bold text-black-800">Vehicle</span>
                                <p class="text-lg font-medium">{{ warantyDetail.vehicleBrand }} {{ warantyDetail.vehicleModel }}</p>
                            </div>
                            <div>
                                <span class="block text-sm font-bold text-black-800">Registration No.</span>
                                <p class="text-lg font-medium">{{ warantyDetail.vehicleRegNo }}</p>
                            </div>
                            <div>
                                <span class="block text-sm font-bold text-black-800">Mobile Number</span>
                                <p class="text-lg font-medium">{{ warantyDetail.mobileNumber }}</p>
                            </div>
                        </div>
                    </div>

                    <!-- Dealer -->
                    <div class="md:w-1/2 card">
                        <div class="border-b pb-2 mb-2 text-2xl font-bold text-gray-800">🏬 Dealer Information</div>
                        <div class="grid grid-cols-2 md:grid-cols-2 gap-4">
                            <div>
                                <span class="block text-sm font-bold text-black-800">Dealer Acc No</span>
                                <p class="text-lg font-medium">{{ warantyDetail.dealer_details?.custAccountNo }}</p>
                            </div>
                            <div>
                                <span class="block text-sm font-bold text-black-800">Dealer Name</span>
                                <p class="text-lg font-medium">{{ warantyDetail.dealer_details?.companyName1 }}</p>
                            </div>
                            <div>
                                <span class="block text-sm font-bold text-black-800">Contact Number</span>
                                <p class="text-lg font-medium">{{ warantyDetail.dealer_details?.phoneNumber }}</p>
                            </div>
                            <div>
                                <span class="block text-sm font-bold text-black-800">Email</span>
                                <p class="text-lg font-medium">{{ warantyDetail.dealer_details?.emailAddress }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- RIGHT SIDE -->
            <div class="md:w-1/3 flex flex-col">
                <!-- 1. CTC Detail -->
                <div class="card w-full mb-4">
                    <div class="flex items-center justify-between border-b pb-2 mb-2">
                        <div class="text-2xl font-bold text-gray-800">CTC Detail</div>
                        <Button v-if="warantyDetail.isCTC === 0" label="Create" class="p-button-info" size="small" @click="createCTC" />
                    </div>
                    <div class="grid grid-cols-2 md:grid-cols-2 gap-4 text-sm text-gray-800">
                        <div>
                            <span class="font-bold">Warranty Entry ID</span>
                            <p>{{ warantyDetail.id }}</p>
                        </div>
                        <div>
                            <span class="font-bold">Submitted Date</span>
                            <p>{{ formatDate(warantyDetail.submitDate) }}</p>
                        </div>
                        <div>
                            <span class="font-bold">Verified Date</span>
                            <p>{{ formatDate(warantyDetail.verifiedDate) }}</p>
                        </div>
                        <div>
                            <span class="font-bold">Created Date</span>
                            <p>{{ formatDate(warantyDetail.created) }}</p>
                        </div>
                        <div>
                            <span class="font-bold">CTC Status</span>
                            <p>{{ getCTCStatus(warantyDetail.isCTC) }}</p>
                        </div>
                        <div>
                            <span class="font-bold">Overall Status</span>
                            <p>{{ getStatusText(warantyDetail.status) }}</p>
                        </div>
                    </div>
                </div>

                <!-- 2. Claim Detail -->
                <div class="card w-full mb-4">
                    <div class="flex items-center justify-between border-b pb-2 mb-2">
                        <div class="text-2xl font-bold text-gray-800">Claim Detail</div>
                        <Button v-if="!warantyDetail.damageCode" label="Create" class="p-button-info" size="small" @click="createClaim" />
                    </div>
                    <div class="grid grid-cols-1 gap-2 text-sm text-gray-800">
                        <div>
                            <span class="font-bold">Damage Code</span>
                            <p>{{ warantyDetail.damageCode || 'Not set' }}</p>
                        </div>
                        <div>
                            <span class="font-bold">Problem Description</span>
                            <p>{{ warantyDetail.problem || 'No description' }}</p>
                        </div>
                        <div class="flex justify-between">
                            <div>
                                <span class="font-bold">Claim %</span>
                                <p>{{ warantyDetail.claimPercent || '0' }}%</p>
                            </div>
                            <div>
                                <span class="font-bold">Usable %</span>
                                <p>{{ warantyDetail.usablePercent || '0' }}%</p>
                            </div>
                            <div>
                                <span class="font-bold">Worn %</span>
                                <p>{{ warantyDetail.wornPercent || '0' }}%</p>
                            </div>
                        </div>
                    </div>

                    <div v-if="warantyDetail.damageCode && !claimFinalStatus" class="flex justify-end gap-2 mt-4">
                        <Button label="Approve" class="p-button-success" size="small" @click="onApproveClaim" />
                        <Button label="Reject" class="p-button-danger" size="small" @click="onRejectClaim" />
                    </div>
                    <div v-else-if="claimFinalStatus" class="text-right mt-3 text-sm font-bold" :class="claimFinalStatus === 'approved' ? 'text-green-600' : 'text-red-600'">
                        Claim {{ claimFinalStatus }}
                    </div>
                </div>

                <!-- 3. Scrap Detail -->
                <div v-if="claimFinalStatus === 'approved' || warantyDetail.isScrap === 1" class="card w-full mb-4">
                    <div class="flex items-center justify-between border-b pb-2 mb-2">
                        <div class="text-2xl font-bold text-gray-800">Scrap Detail</div>
                    </div>

                    <Galleria 
                        :value="scrapImages" 
                        :responsiveOptions="galleriaResponsiveOptions" 
                        :numVisible="3" 
                        containerStyle="max-width: 640px; margin: 0 auto" 
                        :circular="true" 
                        :showItemNavigators="true" 
                        :showThumbnails="false"
                    >
                        <template #item="slotProps">
                            <img :src="slotProps.item.itemImageSrc" class="rounded-xl object-cover w-full h-60 shadow-sm" />
                        </template>
                        <template #thumbnail="slotProps">
                            <img :src="slotProps.item.thumbnailImageSrc" class="rounded-md h-16 w-16 object-cover" />
                        </template>
                    </Galleria>

                    <!-- Approve / Reject -->
                    <div v-if="warantyDetail.isScrap === 0 && scrapStatus === ''" class="flex justify-end gap-2 mt-4">
                        <Button label="Approve" class="p-button-success" size="small" @click="approveScrap" />
                        <Button label="Reject" class="p-button-danger" size="small" @click="rejectScrap" />
                    </div>
                    <div v-else-if="scrapStatus || warantyDetail.isScrap === 1" class="text-right mt-3 text-sm font-bold" :class="(scrapStatus === 'approved' || warantyDetail.isScrap === 1) ? 'text-green-600' : 'text-red-600'">
                        Scrap {{ scrapStatus || 'approved' }}
                    </div>

                    <!-- Select Action -->
                    <div v-if="(scrapStatus === 'approved' || warantyDetail.isScrap === 1) && !replacementSubmitted && !reimbursementSubmitted" class="mt-4">
                        <label class="block text-sm font-bold mb-1">Select Action</label>
                        <select v-model="scrapAction" class="w-full border p-2 rounded">
                            <option value="">-- Select --</option>
                            <option v-if="warantyDetail.claimPercent >= 90" value="replacement">Replacement</option>
                            <option value="reimbursement">Reimbursement</option>
                        </select>
                    </div>

                    <!-- Replacement Form -->
                    <div v-if="scrapAction === 'replacement' && !replacementSubmitted" class="mt-4">
                        <label class="block text-sm font-bold mb-1">Material ID</label>
                        <input v-model="replacementForm.materialId" type="text" class="w-full border p-2 rounded mb-2" placeholder="Enter material ID" />

                        <div class="flex justify-end mt-4">
                            <Button label="Submit Replacement" class="p-button-success" size="small" @click="submitReplacement" :loading="saving" />
                        </div>
                    </div>

                    <!-- Replacement Output -->
                    <div v-if="replacementSubmitted" class="mt-6 p-5 rounded-xl shadow-sm border border-green-200 bg-green-50">
                        <div class="flex items-center justify-between mb-3">
                            <h3 class="text-xl font-bold text-green-800 flex items-center gap-2">
                                <i class="pi pi-sync text-green-600"></i>
                                Replacement Detail
                            </h3>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-800">
                            <div>
                                <span class="block text-gray-600 font-semibold">Sales Order No</span>
                                <p class="text-lg font-bold text-gray-900 mt-1">{{ replacementResult.sap_sono }}</p>
                            </div>
                            <div>
                                <span class="block text-gray-600 font-semibold">Delivery Order No</span>
                                <p class="text-lg font-bold text-gray-900 mt-1">{{ replacementResult.sap_dono }}</p>
                            </div>
                        </div>
                    </div>

                    <!-- Reimbursement Form -->
                    <div v-if="scrapAction === 'reimbursement' && !reimbursementSubmitted" class="mt-4">
                        <label class="block text-sm font-bold mb-1">Material ID</label>
                        <input v-model="reimbursementForm.materialId" type="text" class="w-full border p-2 rounded mb-2" placeholder="Enter material ID" />

                        <label class="block text-sm font-bold mb-1">Claimable Percentage</label>
                        <input v-model.number="reimbursementForm.claimablePercent" type="number" class="w-full border p-2 rounded mb-2" placeholder="Enter claimable percentage" />

                        <div class="flex justify-end mt-4">
                            <Button label="Submit Reimbursement" class="p-button-success" size="small" @click="submitReimbursement" :loading="saving" />
                        </div>
                    </div>

                    <!-- Reimbursement Output -->
                    <div v-if="reimbursementSubmitted" class="mt-6 p-5 rounded-xl shadow-sm border border-blue-200 bg-blue-50">
                        <div class="flex items-center justify-between mb-3">
                            <h3 class="text-xl font-bold text-blue-800 flex items-center gap-2">
                                <i class="pi pi-wallet text-blue-600"></i>
                                Reimbursement Detail
                            </h3>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-800">
                            <div>
                                <span class="block text-gray-600 font-semibold">Invoice Amount</span>
                                <p class="text-lg font-bold text-blue-700 mt-1">RM {{ reimbursementResult.invoice_amount?.toFixed(2) }}</p>
                            </div>
                            <div>
                                <span class="block text-gray-600 font-semibold">Current Price</span>
                                <p class="text-lg font-bold text-gray-900 mt-1">RM {{ reimbursementResult.curr_price }}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 4. Invoice Detail -->
                <div v-if="(scrapAction === 'reimbursement' && reimbursementSubmitted) || warantyDetail.isReimbursement === 1" class="card w-full mb-4">
                    <div class="flex items-center justify-between border-b pb-2 mb-2">
                        <div class="text-2xl font-bold text-gray-800">Invoice Detail</div>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-800">
                        <div>
                            <span class="font-bold">Invoice Number</span>
                            <p>{{ warantyDetail.invNo || 'N/A' }}</p>
                        </div>
                        <div>
                            <span class="font-bold">Submitted Date</span>
                            <p>{{ formatDate(warantyDetail.invSubmitDate) }}</p>
                        </div>
                        <div>
                            <span class="font-bold">Amount</span>
                            <p>RM {{ warantyDetail.invAmount?.toFixed(2) || '0.00' }}</p>
                        </div>
                    </div>
                    <div class="flex justify-end p-1 gap-2 mt-2">
                        <Button v-if="warantyDetail.invAttachURL" icon="pi pi-eye" class="p-button-info" size="small" @click="viewInvoice(warantyDetail.invAttachURL)" />
                        <Button v-if="warantyDetail.invAttachURL" icon="pi pi-download" class="p-button-danger" size="small" @click="downloadInvoice(warantyDetail.invAttachURL)" />
                    </div>
                    <div v-if="warantyDetail.invNo && !invoiceStatus" class="flex justify-end gap-2 mt-4">
                        <Button label="Approve" class="p-button-success" size="small" @click="approveInvoice" />
                        <Button label="Reject" class="p-button-danger" size="small" @click="rejectInvoice" />
                    </div>
                    <div v-else-if="invoiceStatus" class="text-right mt-3 text-sm font-bold" :class="invoiceStatus === 'approved' ? 'text-green-600' : 'text-red-600'">
                        Invoice {{ invoiceStatus }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import Galleria from 'primevue/galleria';
import Button from 'primevue/button';
import api from '@/service/api';

const route = useRoute();
const toast = useToast();

// Reactive data
const warantyDetail = ref({});
const loading = ref(true);
const error = ref(null);
const saving = ref(false);

// States
const claimFinalStatus = ref('');
const scrapStatus = ref('');
const scrapAction = ref('');
const invoiceStatus = ref('');

// Forms
const replacementForm = ref({ materialId: '' });
const reimbursementForm = ref({ materialId: '', claimablePercent: 0 });

// Results
const replacementResult = ref({});
const reimbursementResult = ref({});
const replacementSubmitted = ref(false);
const reimbursementSubmitted = ref(false);

// Images
const scrapImages = ref([]);

const galleriaResponsiveOptions = ref([
    { breakpoint: '1024px', numVisible: 3 },
    { breakpoint: '768px', numVisible: 2 },
    { breakpoint: '560px', numVisible: 1 }
]);

// Computed properties
const hasScrapImages = computed(() => {
    return warantyDetail.value.scrapImage1URL || 
           warantyDetail.value.scrapImage2URL || 
           warantyDetail.value.scrapImage3URL;
});

// Methods
const fetchWarrantyDetail = async () => {
    try {
        loading.value = true;
        const id = route.params.id;
        const response = await api.get(`warranty_claim/${id}`);
        console.log(response.data);
        if (response.data.status === 1) {
            warantyDetail.value = response.data.admin_data;
            await loadScrapImages();
        } else {
            error.value = 'Warranty claim not found.';
        }
    } catch (err) {
        error.value = 'Failed to load warranty details.';
        console.error('Error fetching warranty details:', err);
    } finally {
        loading.value = false;
    }
};

const loadScrapImages = async () => {
    const images = [];
    
    // Load scrap images if they exist
    const imageUrls = [
        warantyDetail.value.scrapImage1URL,
        warantyDetail.value.scrapImage2URL, 
        warantyDetail.value.scrapImage3URL
    ].filter(url => url);

    for (const url of imageUrls) {
        try {
            const imageSrc = await api.getPrivateFile(url);
            images.push({
                itemImageSrc: imageSrc,
                thumbnailImageSrc: imageSrc
            });
        } catch (err) {
            console.error('Error loading scrap image:', err);
        }
    }

    scrapImages.value = images;
};

const createCTC = () => {
    toast.add({
        severity: 'info',
        summary: 'Info',
        detail: 'CTC creation functionality to be implemented',
        life: 3000
    });
};

const createClaim = () => {
    toast.add({
        severity: 'info',
        summary: 'Info',
        detail: 'Claim creation functionality to be implemented',
        life: 3000
    });
};

const onApproveClaim = async () => {
    try {
        saving.value = true;
        // API call for claim approval would go here
        claimFinalStatus.value = 'approved';
        toast.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Claim approved successfully',
            life: 3000
        });
    } catch (err) {
        console.error('Error approving claim:', err);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to approve claim',
            life: 3000
        });
    } finally {
        saving.value = false;
    }
};

const onRejectClaim = async () => {
    try {
        saving.value = true;
        const response = await api.post('warranty_claim/reject', {
            claim_id: warantyDetail.value.id,
            reject_reason_id: 1 // You might want to get this from user input
        });

        if (response.data.status === 1) {
            claimFinalStatus.value = 'rejected';
            toast.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Claim rejected successfully',
                life: 3000
            });
        }
    } catch (err) {
        console.error('Error rejecting claim:', err);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to reject claim',
            life: 3000
        });
    } finally {
        saving.value = false;
    }
};

const approveScrap = () => {
    scrapStatus.value = 'approved';
    toast.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Scrap approved successfully',
        life: 3000
    });
};

const rejectScrap = () => {
    scrapStatus.value = 'rejected';
    toast.add({
        severity: 'info',
        summary: 'Info',
        detail: 'Scrap rejected',
        life: 3000
    });
};

const submitReplacement = async () => {
    if (!replacementForm.value.materialId) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Please enter Material ID',
            life: 3000
        });
        return;
    }

    try {
        saving.value = true;
        const response = await api.post('warranty_claim/approveReplacement', {
            claim_id: warantyDetail.value.id,
            materialid: replacementForm.value.materialId
        });

        if (response.data.status === 1) {
            replacementResult.value = response.data.admin_data;
            replacementSubmitted.value = true;
            toast.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Replacement approved successfully',
                life: 3000
            });
        }
    } catch (err) {
        console.error('Error submitting replacement:', err);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to submit replacement',
            life: 3000
        });
    } finally {
        saving.value = false;
    }
};

const submitReimbursement = async () => {
    if (!reimbursementForm.value.materialId || !reimbursementForm.value.claimablePercent) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Please fill all required fields',
            life: 3000
        });
        return;
    }

    try {
        saving.value = true;
        const response = await api.post('warranty_claim/approveReimbursement', {
            claim_id: warantyDetail.value.id,
            materialid: reimbursementForm.value.materialId,
            claimable_percent: reimbursementForm.value.claimablePercent
        });

        if (response.data.status === 1) {
            reimbursementResult.value = response.data.admin_data;
            reimbursementSubmitted.value = true;
            toast.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Reimbursement approved successfully',
                life: 3000
            });
        }
    } catch (err) {
        console.error('Error submitting reimbursement:', err);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to submit reimbursement',
            life: 3000
        });
    } finally {
        saving.value = false;
    }
};

const approveInvoice = async () => {
    try {
        saving.value = true;
        const response = await api.put(`warranty_claim/approveInvoice/${warantyDetail.value.id}`);

        if (response.data.status === 1) {
            invoiceStatus.value = 'approved';
            toast.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Invoice approved successfully',
                life: 3000
            });
        }
    } catch (err) {
        console.error('Error approving invoice:', err);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to approve invoice',
            life: 3000
        });
    } finally {
        saving.value = false;
    }
};

const rejectInvoice = () => {
    invoiceStatus.value = 'rejected';
    toast.add({
        severity: 'info',
        summary: 'Info',
        detail: 'Invoice rejected',
        life: 3000
    });
};

const viewInvoice = (url) => {
    if (url) {
        window.open(url, '_blank');
    }
};

const downloadInvoice = async (url) => {
    if (url) {
        try {
            const fileBlob = await api.getPrivateFile(url, true);
            const downloadUrl = window.URL.createObjectURL(fileBlob);
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = 'invoice.pdf';
            link.click();
            window.URL.revokeObjectURL(downloadUrl);
        } catch (err) {
            console.error('Error downloading invoice:', err);
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to download invoice',
                life: 3000
            });
        }
    }
};

const downloadReport = () => {
    toast.add({
        severity: 'info',
        summary: 'Info',
        detail: 'Report download functionality to be implemented',
        life: 3000
    });
};

// Helper functions
const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-MY');
};

const getStatusText = (status) => {
    const statusMap = {
        0: 'Pending',
        1: 'Approved',
        2: 'Rejected',
        3: 'Under Review'
    };
    return statusMap[status] || 'Unknown';
};

const getCTCStatus = (isCTC) => {
    return isCTC === 1 ? 'Created' : 'Not Created';
};

// Lifecycle
onMounted(() => {
    fetchWarrantyDetail();
});
</script>