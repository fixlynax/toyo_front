<template>
    <div class="flex flex-col md:flex-row gap-8">
        <!-- LEFT SIDE -->
        <div class="md:w-2/3 flex flex-col">
            <div class="card flex flex-col w-full">
                <div class="flex items-center justify-between border-b pb-2">
                    <div class="text-2xl font-bold text-gray-800">Warranty Detail</div>
                    <div class="inline-flex items-center gap-2">
                        <Button icon="pi pi-file-export" label="Export" class="p-button-success" :loading="exportLoading" @click="handleExport" />
                    </div>
                </div>
                <div class="mt-6 mb-2">
                    <div>
                        <span class="block text-sm font-bold text-black-800">Ref No</span>
                        <span class="text-lg font-medium">{{ warantyDetail.claimRefNo }}</span>
                    </div>
                </div>
            </div>

            <!-- Tire  -->
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
                        <p class="text-lg font-medium">{{ warantyDetail.tire_details?.pattern || 'N/A' }}</p>
                    </div>
                    <div>
                        <span class="block text-sm font-bold text-black-800">Size</span>
                        <p class="text-lg font-medium">{{ warantyDetail.tire_details?.size || warantyDetail.tire_details?.tyresize || 'N/A' }}</p>
                    </div>
                    <div>
                        <span class="block text-sm font-bold text-black-800">Tire Spec</span>
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
                            <p class="text-lg font-medium">{{ warantyDetail.dealer_details?.custAccountNo || 'N/A' }}</p>
                        </div>
                        <div>
                            <span class="block text-sm font-bold text-black-800">Dealer Name</span>
                            <p class="text-lg font-medium">{{ warantyDetail.dealer_details?.companyName1 || 'N/A' }}</p>
                        </div>
                        <div>
                            <span class="block text-sm font-bold text-black-800">Contact Number</span>
                            <p class="text-lg font-medium">{{ warantyDetail.dealer_details?.phoneNumber || 'N/A' }}</p>
                        </div>
                        <div>
                            <span class="block text-sm font-bold text-black-800">Email</span>
                            <p class="text-lg font-medium">{{ warantyDetail.dealer_details?.emailAddress || 'N/A' }}</p>
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
                    <!-- FIXED: Show Request button only if CTC data doesn't exist in DB -->
                    <Button 
                        v-if=" !hasCTCData" 
                        label="Request" 
                        class="p-button-info" 
                        size="small" 
                        @click="requestCTC" 
                        :loading="loadingCTC"
                    />
                </div>
                
                <!-- FIXED: Show CTC data if exists in database -->
                <div v-if="hasCTCData" class="grid grid-cols-2 md:grid-cols-2 gap-4 text-sm text-gray-800">
                    <div>
                        <span class="font-bold">CTC Details</span>
                        <p>{{ warantyDetail.ctc_details || 'N/A' }}</p>
                    </div>
                </div>
                
                <!-- Show empty state if no CTC data -->
                <div v-else class="text-center py-4 text-gray-500">
                    No CTC data available
                </div>
            </div>

            <!-- 2. Claim Detail -->
            <div class="card w-full mb-4">
                <div class="flex items-center justify-between border-b pb-2 mb-2">
                    <div class="text-2xl font-bold text-gray-800">Claim Detail</div>
                    <!-- FIXED: Show Create button only if no claim data exists AND CTC is available -->
                    <Button 
                        v-if="!hasClaimDetail && !hasCTCData" 
                        label="Create" 
                        class="p-button-info" 
                        size="small" 
                        @click="showClaimDialog = true" 
                    />
                </div>

                <!-- Claim Detail Content - Show if data exists -->
                <div v-if="hasClaimDetail" class="grid grid-cols-1 gap-2 text-sm text-gray-800">
                    <div>
                        <span class="font-bold">Damage Code</span>
                        <p>{{ warantyDetail.damageCode || 'N/A' }}</p>
                    </div>
                    <div>
                        <span class="font-bold">Problem</span>
                        <p>{{ warantyDetail.problem || 'N/A' }}</p>
                    </div>
                    <div class="flex justify-between">
                        <div>
                            <span class="font-bold">Claim %</span>
                            <p>{{ warantyDetail.claimPercent || 'N/A' }}</p>
                        </div>
                        <div>
                            <span class="font-bold">Usable %</span>
                            <p>{{ warantyDetail.usablePercent || 'N/A' }}</p>
                        </div>
                        <div>
                            <span class="font-bold">Worn %</span>
                            <p>{{ warantyDetail.wornPercent || 'N/A' }}</p>
                        </div>
                    </div>
                    
                    <!-- FIXED: Approve/Reject Buttons - Show only if claim data exists and not yet approved/rejected -->
                    <div v-if="!claimFinalStatus" class="flex justify-end gap-2 mt-4">
                        <Button label="Approve" class="p-button-success" size="small" @click="showApproveOptions = true" />
                        <Button label="Reject" class="p-button-danger" size="small" @click="showRejectDialog = true" />
                    </div>
                </div>

                <!-- Show empty state if no claim data -->
                <div v-else class="text-center py-4 text-gray-500">
                    No claim data available
                </div>



                <!-- Status Display -->
                <div v-if="claimFinalStatus" class="text-right mt-3 text-sm font-bold" :class="claimFinalStatus === 'approved' ? 'text-green-600' : 'text-red-600'">
                    Claim {{ claimFinalStatus }}
                </div>
            </div>

            <!-- 3. Scrap Detail -->
            <div class="card w-full mb-4" v-if="claimFinalStatus === 'approved'" >
                <div class="flex items-center justify-between border-b pb-2 mb-2">
                    <div class="text-2xl font-bold text-gray-800">Scrap Detail</div>
                    <!-- FIXED: Show Request button only if no scrap data exists AND claim is approved -->
                    <Button 
                        v-if="!hasScrapData && claimFinalStatus === 'approved'" 
                        label="Request" 
                        class="p-button-info" 
                        size="small" 
                        @click="requestScrap" 
                        :loading="loadingScrap"
                    />
                </div>

                <!-- FIXED: Show scrap data if exists in database -->
                <div v-if="hasScrapData" class="mb-4">
                    <div class="font-bold mb-2">Scrap Details:</div>
                    <div class="grid grid-cols-2 gap-2 text-sm text-gray-800">
                        <div>
                            <span class="font-bold">Scrap Reference</span>
                            <p>{{ warantyDetail.scrapReferenceNo || 'N/A' }}</p>
                        </div>
                        <div>
                            <span class="font-bold">Scrap Date</span>
                            <p>{{ formatDate(warantyDetail.scrapDate) || 'N/A' }}</p>
                        </div>
                        <div>
                            <span class="font-bold">Scrap Status</span>
                            <p>{{ warantyDetail.scrapStatus || 'N/A' }}</p>
                        </div>
                    </div>
                    
                    <!-- Show scrap images if they exist -->
                    <div v-if="hasScrapImages" class="mt-3">
                        <div class="font-bold mb-2">Scrap Images:</div>
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
                    </div>
                </div>
                
                <!-- Show empty state if no scrap data -->
                <div v-else class="text-center py-4 text-gray-500">
                    No scrap data available
                </div>
            </div>
            <div class="card w-full mb-4" v-if="claimFinalStatus === 'rejected'" >
                <div class="flex items-center justify-between border-b pb-2 mb-2">
                    <div class="text-2xl font-bold text-gray-800">Reject Details</div>
                </div>

                <!-- FIXED: Show scrap data if exists in database -->
                <div class="mb-4">
                    <div class="grid grid-cols-2 gap-2 text-sm text-gray-800">
                        <div>
                            <span class="font-bold">Part</span>
                            <p>{{ rejectReasonDesc.part }}</p>
                        </div>
                        <div>
                            <span class="font-bold">Code</span>
                            <p>{{ rejectReasonDesc.code }}</p>
                        </div>
                        <div>
                            <span class="font-bold">Description</span>
                            <p>{{ rejectReasonDesc.damageMode }}</p>
                        </div>
                    </div>
                    
                </div>
                

            </div>
        </div>
    </div>
    <!-- FIXED: Approve Options Dialog -->
    <Dialog v-model:visible="showApproveOptions" header="Approve Claim" :modal="true" class="p-fluid" style="width: 500px">
        <div class="field">
            <label class="font-bold mb-3 block">Select Approval Type:</label>
            <div class="flex flex-col gap-3">
                <div v-if="warantyDetail.claimPercent >= 90" class="flex items-center">
                    <RadioButton 
                        v-model="selectedApprovalType" 
                        inputId="replacement" 
                        name="approvalType" 
                        value="replacement" 
                    />
                    <label for="replacement" class="ml-2 font-medium">Replacement</label>
                </div>
                <div class="flex items-center">
                    <RadioButton 
                        v-model="selectedApprovalType" 
                        inputId="reimbursement" 
                        name="approvalType" 
                        value="reimbursement" 
                    />
                    <label for="reimbursement" class="ml-2 font-medium">Reimbursement</label>
                </div>
            </div>
            <small v-if="warantyDetail.claimPercent < 90" class="text-blue-600 block mt-2">
                Note: Only reimbursement is available for claims below 90%
            </small>
        </div>
        <template #footer>
            <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="cancelApprove" />
            <Button label="Confirm Approval" icon="pi pi-check" class="p-button-success" @click="confirmApproveClaim" />
        </template>
    </Dialog>
    <!-- FIXED: Create Claim Dialog -->
    <Dialog v-model:visible="showClaimDialog" header="Create Claim Detail" :modal="true" class="p-fluid" style="width: 500px">
        <div class="field">
            <label for="damageCode">Damage Code</label>
            <InputText id="damageCode" v-model="newClaim.damageCode" class="w-full" />
        </div>
        <div class="field">
            <label for="problem">Problem</label>
            <Textarea id="problem" v-model="newClaim.problem" rows="3" class="w-full" />
        </div>
        <div class="grid grid-cols-3 gap-3">
            <div class="field">
                <label for="claimPercent">Claim %</label>
                <InputNumber id="claimPercent" v-model="newClaim.claimPercent" mode="decimal" :min="0" :max="100" class="w-full" />
            </div>
            <div class="field">
                <label for="usablePercent">Usable %</label>
                <InputNumber id="usablePercent" v-model="newClaim.usablePercent" mode="decimal" :min="0" :max="100" class="w-full" />
            </div>
            <div class="field">
                <label for="wornPercent">Worn %</label>
                <InputNumber id="wornPercent" v-model="newClaim.wornPercent" mode="decimal" :min="0" :max="100" class="w-full" />
            </div>
        </div>
        <template #footer>
            <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="cancelCreateClaim" />
            <Button label="Create" icon="pi pi-check" class="p-button-success" @click="createClaim" />
        </template>
    </Dialog>

    <!-- Reject Reason Dialog -->
    <Dialog v-model:visible="showRejectDialog" header="Reject Claim" :modal="true" class="p-fluid" style="width: 400px">
        <div class="field">
            <label for="rejectReason">Select Reject Reason</label>
            <Dropdown 
                id="rejectReason"
                v-model="selectedRejectReason" 
                :options="rejectReasons" 
                optionLabel="grouping"
                optionValue="id"
                placeholder="Select a reason"
                class="w-full"
            />
        </div>
        <template #footer>
            <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="showRejectDialog = false" />
            <Button label="Reject" icon="pi pi-check" class="p-button-danger" @click="rejectClaim" />
        </template>
    </Dialog>
</template>

<script setup>
import api from '@/service/api';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import Dropdown from 'primevue/dropdown';
import Galleria from 'primevue/galleria';
import InputNumber from 'primevue/inputnumber';
import InputText from 'primevue/inputtext';
import RadioButton from 'primevue/radiobutton';
import Textarea from 'primevue/textarea';
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const warantyDetail = ref({});
const loading = ref(false);

// States
const claimFinalStatus = ref('');
const scrapStatus = ref('');
const selectedAction = ref('');
const tempAction = ref('');
const invoiceStatus = ref('');
const invoiceUploaded = ref(false);

// UI States
const showClaimDialog = ref(false);
const showRejectDialog = ref(false);
const showApproveOptions = ref(false);
const selectedRejectReason = ref(null);
const selectedApprovalType = ref('');
const rejectReasons = ref([]);

// New claim data
const newClaim = ref({
    damageCode: '',
    problem: '',
    claimPercent: 0,
    usablePercent: 0,
    wornPercent: 0
});

// Loading states
const loadingCTC = ref(false);
const loadingScrap = ref(false);

const rejectReasonDesc = computed(() => {
    if (!rejectReasons.value?.length || !warantyDetail.value?.rejectReasonID) {
        return 'N/A';
    }
    return rejectReasons.value.find(
        r => r.id == warantyDetail.value.rejectReasonID
    ) || null;
});

// Computed properties
const hasCTCData = computed(() => {
    return warantyDetail.value.ctc_details ;
});

const hasClaimDetail = computed(() => {
    return warantyDetail.value.damageCode || warantyDetail.value.problem || warantyDetail.value.claimPercent;
});

const hasScrapData = computed(() => {
    return warantyDetail.value.scrapReferenceNo || warantyDetail.value.scrapDate || warantyDetail.value.scrapStatus;
});

const hasScrapImages = computed(() => {
    return warantyDetail.value.scrapImage1URL || 
           warantyDetail.value.scrapImage2URL || 
           warantyDetail.value.scrapImage3URL;
});

// Fetch warranty claim details
const fetchWarrantyClaim = async () => {
    loading.value = true;
    try {
        const claimId = route.params.id;
        const response = await api.get(`warranty_claim/${claimId}`);
        
        if (response.data.status === 1) {
            warantyDetail.value = response.data.admin_data;
            buildScrapImages();
            initializeWorkflowStates();
        } else {
            console.error('Failed to fetch warranty claim details');
        }
    } catch (error) {
        console.error('Error fetching warranty claim:', error);
    } finally {
        loading.value = false;
    }
};

// Fetch reject reasons
const fetchRejectReasons = async () => {
    try {
        const response = await api.get('rejectReasonList');
        if (response.data.status === 1) {
            rejectReasons.value = response.data.admin_data;
        }
    } catch (error) {
        console.error('Error fetching reject reasons:', error);
    }
};

// Initialize workflow states
const initializeWorkflowStates = () => {
    // Set claim status
    if (warantyDetail.value.status === 4) {
        claimFinalStatus.value = 'approved';
    } else if (warantyDetail.value.status === 6) {
        claimFinalStatus.value = 'rejected';
    }
    
    // Set scrap status
    if (warantyDetail.value.isScrap === 1) {
        scrapStatus.value = 'approved';
    } else if (warantyDetail.value.isScrap === 2) {
        scrapStatus.value = 'rejected';
    }
};

// Build scrap images
const buildScrapImages = () => {
    const images = [];
    
    if (warantyDetail.value.scrapImage1URL) {
        images.push({
            itemImageSrc: warantyDetail.value.scrapImage1URL,
            thumbnailImageSrc: warantyDetail.value.scrapImage1URL
        });
    }
    if (warantyDetail.value.scrapImage2URL) {
        images.push({
            itemImageSrc: warantyDetail.value.scrapImage2URL,
            thumbnailImageSrc: warantyDetail.value.scrapImage2URL
        });
    }
    if (warantyDetail.value.scrapImage3URL) {
        images.push({
            itemImageSrc: warantyDetail.value.scrapImage3URL,
            thumbnailImageSrc: warantyDetail.value.scrapImage3URL
        });
    }
    
    scrapImages.value = images;
};

// API Methods
const requestCTC = async () => {
    loadingCTC.value = true;
    try {
        const response = await api.put(`warranty_claim/requestCTC/${route.params.id}`, {
            status: 1
        });
        
        if (response.data.status === 1) {
            warantyDetail.value.isCTC = true;
            fetchWarrantyClaim();
        }
    } catch (error) {
        console.error('Error requesting CTC:', error);
    } finally {
        loadingCTC.value = false;
    }
};

const requestScrap = async () => {
    loadingScrap.value = true;
    try {
        const response = await api.put(`warranty_claim/requestScrap/${route.params.id}`, {
            status: 1
        });
        
        if (response.data.status === 1) {
            warantyDetail.value.isScrap = true;
            fetchWarrantyClaim();
        }
    } catch (error) {
        console.error('Error requesting scrap:', error);
    } finally {
        loadingScrap.value = false;
    }
};

// Create Claim
const createClaim = async () => {
    try {
        const response = await api.post(`warranty_claim/createClaim/${route.params.id}`, {
            damageCode: newClaim.value.damageCode,
            problem: newClaim.value.problem,
            claimPercent: newClaim.value.claimPercent,
            usablePercent: newClaim.value.usablePercent,
            wornPercent: newClaim.value.wornPercent
        });
        
        if (response.data.status === 1) {
            showClaimDialog.value = false;
            resetNewClaim();
            fetchWarrantyClaim();
        }
    } catch (error) {
        console.error('Error creating claim:', error);
    }
};

const cancelCreateClaim = () => {
    showClaimDialog.value = false;
    resetNewClaim();
};

const resetNewClaim = () => {
    newClaim.value = {
        damageCode: '',
        problem: '',
        claimPercent: 0,
        usablePercent: 0,
        wornPercent: 0
    };
};
const handleExport = async () => {
 const idexport = Number(route.params.id);
    // try {
    //     exportLoading.value = true;
    //         const response = await api.postExtra(
    //         'excel/warrantywarranty',
    //     { id: idexport  },
    //     {
    //         responseType: 'blob',
    //         headers: {
    //         'Content-Type': 'application/json',
    //         }
    //     }
    //     );
    //     const blob = new Blob([response.data], { 
    //     type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    //     });

    //     const url = window.URL.createObjectURL(blob);
    //     const a = document.createElement('a');
    //     a.href = url;
    //     a.download = `${warantyDetail.value.claimRefNo}_Warranty_Download.xlsx`;
    //     document.body.appendChild(a);
    //     a.click();
    //     document.body.removeChild(a);
    //     window.URL.revokeObjectURL(url);

    //     toast.add({ severity: 'success', summary: 'Success', detail: 'Export completed', life: 3000 });
    // } catch (error) {
    //     console.error('Error exporting data:', error);
    //     toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to export data', life: 3000 });
    // } finally {
    //     exportLoading.value = false;
    // }
};
// Approve Claim with options
const confirmApproveClaim = async () => {
    if (!selectedApprovalType.value) {
        alert('Please select an approval type');
        return;
    }

    // Auto-select reimbursement if claim% < 90 and replacement was somehow selected
    if (warantyDetail.value.claimPercent < 90 && selectedApprovalType.value === 'replacement') {
        selectedApprovalType.value = 'reimbursement';
    }

    try {
        const response = await api.put(`warranty_claim/approveClaim/${route.params.id}`, {
            status: 1,
            claimType: selectedApprovalType.value
        });
        
        if (response.data.status === 1) {
            claimFinalStatus.value = 'approved';
            showApproveOptions.value = false;
            selectedApprovalType.value = '';
            fetchWarrantyClaim();
        }
    } catch (error) {
        console.error('Error approving claim:', error);
    }
};

const cancelApprove = () => {
    showApproveOptions.value = false;
    selectedApprovalType.value = '';
};

const rejectClaim = async () => {
    if (!selectedRejectReason.value) {
        alert('Please select a reject reason');
        return;
    }

    try {
        const formData = new FormData();
        formData.append('claim_id', route.params.id);
        formData.append('reject_reason_id', selectedRejectReason.value);

        const response = await api.post('warranty_claim/reject', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });

        if (response.data.status === 1) {
            claimFinalStatus.value = 'rejected';
            showRejectDialog.value = false;
            selectedRejectReason.value = null;
            fetchWarrantyClaim();
        }
    } catch (error) {
        console.error('Error rejecting claim:', error);
    }
};

// Utility Methods
const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
};

const getStatusText = (statusCode) => {
    const statusMap = {
        1: 'Pending',
        2: 'Verified',
        3: 'Submitted',
        4: 'Approved',
        5: 'Rejected'
    };
    return statusMap[statusCode] || 'Unknown';
};

const scrapImages = ref([]);
const galleriaResponsiveOptions = ref([
    { breakpoint: '1024px', numVisible: 3 },
    { breakpoint: '768px', numVisible: 2 },
    { breakpoint: '560px', numVisible: 1 }
]);

// Fetch data when component mounts
onMounted(() => {
    fetchWarrantyClaim();
    fetchRejectReasons();
});
</script>