<template>
    <!-- Loading State -->
    <!-- <div v-if="loading" class="text-center py-20 text-gray-500 text-lg w-full">Loading warranty details...</div> -->
    <LoadingPage v-if="loading" :message="'Loading Details Warranty Claim...'" />

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-20 text-red-500 text-lg w-full">
        {{ error }}
    </div>

    <!-- Main Content -->
    <div v-else class="flex flex-col md:flex-row gap-8">
        <!-- LEFT SIDE -->
        <div class="md:w-2/3 flex flex-col">
            <!-- Claim Detail -->
            <div class="card flex flex-col w-full">
                <div class="flex items-center justify-between border-b pb-2">
                    <div class="flex items-center gap-3">
                        <Button icon="pi pi-arrow-left" class="p-button-text p-button-secondary" @click="$router.back()" />
                        <div class="text-2xl font-bold text-gray-800">Warranty Detail</div>
                    </div>
                    <!-- <div class="inline-flex items-center gap-2">
                             <Button  label="Approve" class="p-button-success" size="small" @click="Approve" />
                        </div> -->
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
                    <!-- Show Request button only if no CTC data exists -->
                    <Button v-if="!hasCTCData && !ctcSkipped" label="Request CTC" class="p-button-info" size="small" @click="showCTCConfirmationDialog = true" :loading="loadingCTC" />
                </div>

                <!-- Show CTC data if exists in database -->
                <div v-if="hasCTCData" class="grid grid-cols-2 md:grid-cols-2 gap-4 text-sm text-gray-800">
                    <div>
                        <span class="font-bold">CTC Collection Date</span>
                        <p>{{ `${formatDate(warantyDetail.ctc_details.collectDate)} ${formatTime(warantyDetail.ctc_details.collectTime)}` }}</p>
                    </div>
                    <div>
                        <span class="font-bold">Return Date</span>
                        <p>{{ `${formatDate(warantyDetail.ctc_details.reachWH)} ${formatTime(warantyDetail.ctc_details.returnDateTime)}` }}</p>
                    </div>
                </div>

                <!-- Show skipped CTC information -->
                <div v-else-if="ctcSkipped" class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div class="flex items-start gap-3">
                        <i class="pi pi-info-circle text-blue-600 mt-1"></i>
                        <div>
                            <p class="font-semibold text-blue-800">CTC Process Skipped</p>
                            <p class="text-blue-700 text-sm mt-1">No CTC needed for this claim</p>
                            <p class="text-blue-600 text-xs mt-1">Skipped on: {{ formatDateTime(ctcSkippedDate) }}</p>
                        </div>
                    </div>
                </div>

                <!-- Show empty state if no CTC data and not skipped -->
                <div v-else class="text-center py-4 text-gray-500">No CTC data available</div>
            </div>

            <!-- 2. Claim Detail -->
            <div class="card w-full mb-4">
                <div class="flex items-center justify-between border-b pb-2 mb-2">
                    <div class="text-2xl font-bold text-gray-800">Claim Detail</div>
                    <!-- Show Create button only if no claim data exists AND CTC is available -->
                    <Button v-if="!warantyDetailChecking.claim_detail && (hasCTCData || ctcSkipped)" label="Create Claim" class="p-button-info" size="small" @click="openCreateClaimDialog" />
                </div>

                <!-- Claim Detail Content - Show if data exists -->
                <div v-if="warantyDetailChecking.claim_detail" class="grid grid-cols-1 gap-4 text-sm text-gray-800">
                    <!-- Damage Code & Problem -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <span class="font-bold text-gray-700">Damage Code</span>
                            <p class="text-lg font-semibold text-black mt-1">{{ warantyDetail.damageCode || 'N/A' }}</p>
                        </div>
                        <div>
                            <span class="font-bold text-gray-700">Problem Description</span>
                            <p class="text-lg font-semibold text-black mt-1">{{ warantyDetail.problem || 'N/A' }}</p>
                        </div>
                    </div>

                    <!-- Percentages -->
                    <div class="bg-gray-50 rounded-lg p-4">
                        <span class="font-bold text-gray-700 block mb-3">Claim Percentages</span>
                        <div class="flex justify-between items-center">
                            <div class="text-center">
                                <span class="block font-bold text--600">Claim %</span>
                                <p class="text-xl font-bold text-black">{{ warantyDetail.claimPercent || '0' }}%</p>
                            </div>
                            <div class="text-center">
                                <span class="block font-bold text--600">Usable %</span>
                                <p class="text-xl font-bold text-black">{{ warantyDetail.usablePercent || '0' }}%</p>
                            </div>
                            <div class="text-center">
                                <span class="block font-bold text--600">Worn %</span>
                                <p class="text-xl font-bold text-black">{{ warantyDetail.wornPercent || '0' }}%</p>
                            </div>
                        </div>
                    </div>

                    <!-- FIXED: Approve/Reject Buttons - Show only if claim data exists and not yet approved/rejected -->
                    <div v-if="!claimFinalStatus" class="flex justify-end gap-2 mt-4 pt-4 border-t">
                        <Button label="Approve Claim" class="p-button-success" size="small" @click="Approve" icon="pi pi-check" />
                        <Button label="Reject Claim" class="p-button-danger" size="small" @click="showRejectDialog = true" icon="pi pi-times" />
                    </div>
                </div>

                <!-- Show empty state if no claim data -->
                <div v-else class="text-center py-8 bg-gray-50 rounded-lg">
                    <i class="pi pi-file-edit text-4xl text-gray-400 mb-3"></i>
                    <p class="text-gray-500 font-medium">No claim assessment created yet</p>
                    <p class="text-gray-400 text-sm mt-2">Click 'Create Claim' to assess this warranty claim</p>
                </div>

                <!-- Status Display -->
                <div v-if="claimFinalStatus" class="text-right mt-3 text-sm font-bold" :class="claimFinalStatus === 'approved' ? 'text-green-600' : 'text-red-600'">
                    <i :class="claimFinalStatus === 'approved' ? 'pi pi-check-circle' : 'pi pi-times-circle'" class="mr-2"></i>
                    Claim {{ claimFinalStatus }}
                </div>
            </div>

            <!-- 3. Scrap Detail -->
            <div v-if="claimFinalStatus === 'approved'" class="card w-full mb-4">
                <div class="flex items-center justify-between border-b pb-2 mb-4">
                    <div class="text-2xl font-bold text-gray-800">Scrap Detail</div>
                    <!-- Show Request button only if no scrap data exists -->
                </div>

                <!-- Scrap Images Gallery -->
                <div v-if="scrapImages.length > 0" class="mb-6">
                    <Galleria
                        :value="scrapImages"
                        :responsiveOptions="galleriaResponsiveOptions"
                        :numVisible="5"
                        containerStyle="max-width: 100%; margin: 0 auto"
                        :circular="true"
                        :showItemNavigators="true"
                        :showThumbnails="true"
                        :showIndicators="true"
                        :showThumbnailNavigators="true"
                        thumbnailsPosition="bottom"
                    >
                        <template #item="slotProps">
                            <img :src="slotProps.item.itemImageSrc" :alt="`Scrap image ${slotProps.index + 1}`" class="rounded-xl object-contain w-full h-80 shadow-sm bg-gray-100" />
                        </template>
                        <template #thumbnail="slotProps">
                            <img
                                :src="slotProps.item.thumbnailImageSrc"
                                :alt="`Scrap thumbnail ${slotProps.index + 1}`"
                                class="rounded-md h-16 w-16 object-cover border-2 border-transparent hover:border-primary transition-all"
                                :class="{ 'border-primary': slotProps.index === slotProps.activeIndex }"
                            />
                        </template>
                    </Galleria>

                    <!-- Approve/Reject Scrap Buttons - Show only when images exist and not yet approved/rejected -->
                    <div v-if="scrapImages.length > 0 && !scrapApprovalStatus" class="flex justify-end gap-2 mt-4">
                        <Button label="Approve Scrap" class="p-button-success" size="small" @click="approveScrap" :loading="loadingScrapAction" />
                        <Button label="Reject Scrap" class="p-button-danger" size="small" @click="rejectScrap" :loading="loadingScrapAction" />
                    </div>
                </div>

                <!-- No Images Message -->
                <div v-else class="text-center py-8 bg-gray-50 rounded-lg mb-6">
                    <i class="pi pi-image text-4xl text-gray-400 mb-3"></i>
                    <p class="text-gray-500 font-medium">No scrap images available</p>
                    <p class="text-gray-400 text-sm mt-2">Click 'Request Scrap' to initiate the scrap process</p>
                </div>

                <!-- Scrap Approval Status Display -->
                <div v-if="scrapApprovalStatus" class="text-right mt-3 text-sm font-bold" :class="scrapApprovalStatus === 'approved' ? 'text-green-600' : 'text-red-600'">Scrap {{ scrapApprovalStatus }}</div>

                <!-- Stock Check Result Display -->
                <div v-if="scrapApprovalStatus === 'approved' && stockCheckResult" class="mt-4 p-3 rounded-lg" :class="stockCheckResult.hasStock ? 'bg-green-50 border border-green-200' : 'bg-blue-50 border border-blue-200'">
                    <div class="flex items-start gap-3">
                        <i class="pi" :class="stockCheckResult.hasStock ? 'pi-check-circle text-green-600' : 'pi-info-circle text-blue-600'"></i>
                        <div>
                            <p class="font-semibold" :class="stockCheckResult.hasStock ? 'text-green-800' : 'text-blue-800'">
                                {{ stockCheckResult.message }}
                            </p>
                            <p class="text-sm mt-1" :class="stockCheckResult.hasStock ? 'text-green-700' : 'text-blue-700'">
                                {{ stockCheckResult.hasStock ? 'Proceeding with replacement...' : 'Switching to reimbursement process...' }}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 4. Invoice Detail - Only show when status >= 4, reimbursement approved, and invoice exists -->
            <!-- <div v-if="warantyDetail.status >= 4  " class="card w-full mb-4">
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
                            <p>RM {{ warantyDetail.invAmount || '0.00' }}</p>
                        </div>
                    </div>
                    

                    <div class="flex justify-end p-1 gap-2 mt-2">
                        <Button v-if="warantyDetail.invAttachURL" icon="pi pi-eye" class="p-button-info" size="small" @click="viewInvoice(warantyDetail.invAttachURL)" />
                        <Button v-if="warantyDetail.invAttachURL" icon="pi pi-download" class="p-button-danger" size="small" @click="downloadInvoice(warantyDetail.invAttachURL)" />
                    </div>
                    

                    <div v-if="warantyDetail.invNo && !invoiceStatus && warantyDetail.invStatus !== 1" class="flex justify-end gap-2 mt-4">
                        <Button label="Approve Invoice" class="p-button-success" size="small" @click="approveInvoice" :loading="approvingInvoice" />
                        <Button label="Reject Invoice" class="p-button-danger" size="small" @click="rejectInvoice" :loading="rejectingInvoice" />
                    </div>
                    <div v-else-if="invoiceStatus || warantyDetail.invStatus === 1" class="text-right mt-3 text-sm font-bold" :class="(invoiceStatus === 'approved' || warantyDetail.invStatus === 1) ? 'text-green-600' : 'text-red-600'">
                        Invoice {{ invoiceStatus === 'approved' || warantyDetail.invStatus === 1 ? 'approved' : 'rejected' }}
                    </div>
                </div> -->

            <div v-else-if="warantyDetail.status >= 4 && warantyDetail.isReimbursement === 1" class="card w-full mb-4">
                <div class="flex items-center justify-between border-b pb-2 mb-2">
                    <div class="text-2xl font-bold text-gray-800">Invoice Detail</div>
                </div>

                <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div class="flex items-start gap-3">
                        <i class="pi pi-exclamation-circle text-yellow-600 mt-1"></i>
                        <div>
                            <p class="font-semibold text-yellow-800">Invoice Upload Required</p>
                            <p class="text-yellow-700 text-sm mt-1">Invoice will be uploaded by dealer for reimbursement processing.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Create Claim Dialog -->
    <Dialog v-model:visible="showCreateClaimDialog" header="Create Claim Details" :modal="true" class="p-fluid" :style="{ width: '40rem' }">
        <div class="grid grid-cols-1 gap-4">
            <!-- Damage Code -->
            <div class="field">
                <label class="block font-bold text-gray-700 mb-2">Damage Code *</label>
                <InputText v-model="newClaimData.damageCode" placeholder="Enter damage code" class="w-full" :class="{ 'p-invalid': !newClaimData.damageCode && creatingClaim }" />
                <small v-if="!newClaimData.damageCode && creatingClaim" class="p-error">Damage code is required.</small>
            </div>

            <!-- Problem Description -->
            <div class="field">
                <label class="block font-bold text-gray-700 mb-2">Problem *</label>
                <Textarea v-model="newClaimData.problem" placeholder="Describe the problem" rows="3" class="w-full" :class="{ 'p-invalid': !newClaimData.problem && creatingClaim }" />
                <small v-if="!newClaimData.problem && creatingClaim" class="p-error">Problem description is required.</small>
            </div>

            <!-- Percentages -->
            <div class="grid grid-cols-3 gap-4">
                <!-- Claim Percentage -->
                <div class="field">
                    <label class="block font-bold text-gray-700 mb-2">Claim % *</label>
                    <InputNumber
                        v-model="newClaimData.claimPercent"
                        mode="decimal"
                        :min="0"
                        :max="100"
                        :minFractionDigits="0"
                        :maxFractionDigits="2"
                        placeholder="0-100"
                        class="w-full"
                        :class="{ 'p-invalid': (newClaimData.claimPercent === null || newClaimData.claimPercent === undefined) && creatingClaim }"
                    />
                    <small v-if="(newClaimData.claimPercent === null || newClaimData.claimPercent === undefined) && creatingClaim" class="p-error">Claim percentage is required.</small>
                </div>

                <!-- Usable Percentage -->
                <div class="field">
                    <label class="block font-bold text-gray-700 mb-2">Usable % *</label>
                    <InputNumber
                        v-model="newClaimData.usablePercent"
                        mode="decimal"
                        :min="0"
                        :max="100"
                        :minFractionDigits="0"
                        :maxFractionDigits="2"
                        placeholder="0-100"
                        class="w-full"
                        :class="{ 'p-invalid': (newClaimData.usablePercent === null || newClaimData.usablePercent === undefined) && creatingClaim }"
                    />
                    <small v-if="(newClaimData.usablePercent === null || newClaimData.usablePercent === undefined) && creatingClaim" class="p-error">Usable percentage is required.</small>
                </div>

                <!-- Worn Percentage -->
                <div class="field">
                    <label class="block font-bold text-gray-700 mb-2">Worn % *</label>
                    <InputNumber
                        v-model="newClaimData.wornPercent"
                        mode="decimal"
                        :min="0"
                        :max="100"
                        :minFractionDigits="0"
                        :maxFractionDigits="2"
                        placeholder="0-100"
                        class="w-full"
                        :class="{ 'p-invalid': (newClaimData.wornPercent === null || newClaimData.wornPercent === undefined) && creatingClaim }"
                    />
                    <small v-if="(newClaimData.wornPercent === null || newClaimData.wornPercent === undefined) && creatingClaim" class="p-error">Worn percentage is required.</small>
                </div>
            </div>
        </div>

        <template #footer>
            <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="closeCreateClaimDialog" :disabled="creatingClaim" />
            <Button label="Create Claim" icon="pi pi-check" class="p-button-primary" @click="submitClaimDetails" :loading="creatingClaim" />
        </template>
    </Dialog>

    <!-- CTC Confirmation Dialog -->
    <Dialog v-model:visible="showCTCConfirmationDialog" header="CTC Process" :modal="true" class="p-fluid" :style="{ width: '30rem' }">
        <div class="text-center py-4">
            <i class="pi pi-question-circle text-4xl text-blue-500 mb-4"></i>
            <h3 class="text-xl font-bold text-gray-800 mb-2">Request CTC Process?</h3>
            <p class="text-gray-600 mb-6">CTC (Customer to Company) process involves physical tire collection for inspection. You can skip this if not required.</p>

            <div class="flex justify-center gap-3">
                <Button label="Yes, Request CTC" class="p-button-primary" @click="confirmCTCRequest" :loading="loadingCTC" />
                <Button label="No, Skip CTC" class="p-button-secondary" @click="skipCTCProcess" :disabled="loadingCTC" />
            </div>
        </div>
    </Dialog>

    <!-- Existing Dialogs (CTC, Replacement, Reimbursement, Reject) -->
    <Dialog v-model:visible="showCreateCTCDialog" header="Create CTC" :modal="true" class="p-fluid" :style="{ width: '40rem' }">
        <div class="grid grid-cols-1 gap-4">
            <div>
                <label class="block font-bold text-gray-700 mb-2">Schedule *</label>
                <Calendar v-model="ctcdate" dateFormat="dd/mm/yy" placeholder="Select Date & Time" class="w-full" :showIcon="true" :showTime="true" hourFormat="24" />
            </div>
        </div>

        <template #footer>
            <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="closeCTCDialog" />
            <Button label="Create" icon="pi pi-check" class="p-button-primary" @click="saveCTC" />
        </template>
    </Dialog>

    <Dialog v-model:visible="showApproveDialog" header="Select Approval Type:" :modal="true" class="p-fluid" :style="{ width: '40rem' }">
        <div class="grid grid-cols-1 gap-4">
            <!-- Show Replacement option only if claimPercent >= 90 -->
            <div v-if="warantyDetail.claimPercent >= 90" class="flex items-center">
                <Button label="Replacement" class="p-button-primary w-full" @click="createReplacement" />
            </div>
            <!-- Always show Reimbursement option -->
            <Button label="Reimbursement" class="p-button-primary" @click="createReimbursement" />
        </div>

        <template #footer>
            <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="closeApproveDialog" />
        </template>
    </Dialog>

    <Dialog v-model:visible="showCreateReplacementDialog" header="Submit Replacement" :modal="true" :closable="!loadingAction" class="p-fluid" :style="{ width: '40rem' }">
        <!-- Show success results if replacement was submitted -->
        <div v-if="replacementSubmitted && replacementResult" class="mb-4 p-3 bg-green-50 border border-green-200 rounded">
            <h4 class="font-bold text-green-800">Replacement Approved Successfully!</h4>
            <p class="text-sm text-green-700">SAP SO: {{ replacementResult.sap_sono }}</p>
            <p class="text-sm text-green-700">SAP DO: {{ replacementResult.sap_dono }}</p>
        </div>

        <label class="block font-bold text-gray-700 mb-1">Select Material ID</label>
        <Dropdown v-model="selectedMaterial" :options="listMaterial" optionLabel="material" placeholder="Select material" class="w-full mb-4">
            <template #option="slotProps">
                <div class="flex items-center gap-3">
                    <div>
                        <div class="font-semibold">{{ slotProps.option.material }}</div>
                    </div>
                </div>
            </template>
        </Dropdown>

        <template #footer>
            <Button label="Cancel" icon="pi pi-times" class="p-button-text" :disabled="loadingAction" @click="closeReplacementDialog" />
            <Button label="Create" icon="pi pi-check" class="p-button-primary" :loading="loadingAction" @click="submitReplacement" />
        </template>
    </Dialog>

    <!-- <Dialog v-model:visible="showCreateReimbursementDialog" header="Submit Reimbursement" :modal="true" :closable="!loadingAction" class="p-fluid" :style="{ width: '40rem' }">
        Show success results if reimbursement was submitted
        <div v-if="reimbursementSubmitted && reimbursementResult" class="mb-4 p-3 bg-green-50 border border-green-200 rounded">
            <h4 class="font-bold text-green-800">Reimbursement Approved Successfully!</h4>
            <p class="text-sm text-green-700">Invoice Amount: RM {{ reimbursementResult.invoice_amount }}</p>
            <p class="text-sm text-green-700">Current Price: RM {{ reimbursementResult.curr_price }}</p>
        </div>

        <div class="field">
            <label class="block font-bold text-gray-700 mb-1">Select Material ID</label>
            <Dropdown v-model="selectedMaterial" :options="listMaterial" optionLabel="material" placeholder="Select material" class="w-full mb-4">
                <template #option="slotProps">
                    <div class="flex items-center gap-3">
                        <div>
                            <div class="font-semibold">{{ slotProps.option.material }}</div>
                        </div>
                    </div>
                </template>
            </Dropdown>
        </div>

        <template #footer>
            <Button label="Cancel" icon="pi pi-times" class="p-button-text" :disabled="loadingAction" @click="closeReimbursementDialog" />
            <Button label="Create" icon="pi pi-check" class="p-button-primary" :loading="loadingAction" @click="submitReimbursement" />
        </template>
    </Dialog> -->

    <Dialog v-model:visible="showRejectDialog" header="Reject Warranty Claim" :modal="true" class="p-fluid" :style="{ width: '40rem' }">
        <div class="field">
            <label class="block font-bold text-gray-700 mb-1">Select Rejection Reason *</label>
            <Dropdown v-model="selectedRejectReason" :options="rejectReasons" optionLabel="damageMode" optionValue="id" placeholder="Select rejection reason" class="w-full mb-4" :class="{ 'p-invalid': !selectedRejectReason && rejecting }">
                <template #option="slotProps">
                    <div class="flex flex-col gap-1 py-2">
                        <div class="font-semibold text-gray-800">{{ slotProps.option.damageMode }}</div>
                        <div class="text-sm text-gray-600"><span class="font-medium">Code:</span> {{ slotProps.option.code }} | <span class="font-medium">Part:</span> {{ slotProps.option.part }}</div>
                        <div class="text-xs text-gray-500">{{ slotProps.option.grouping }}</div>
                    </div>
                </template>
            </Dropdown>
            <small v-if="!selectedRejectReason && rejecting" class="p-error">Please select a rejection reason.</small>
        </div>

        <template #footer>
            <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="closeRejectDialog" :disabled="rejecting" />
            <Button label="Reject Claim" icon="pi pi-times-circle" class="p-button-danger" @click="confirmRejectWarranty" :loading="rejecting" :disabled="!selectedRejectReason || rejecting" />
        </template>
    </Dialog>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import Galleria from 'primevue/galleria';
import Button from 'primevue/button';
import api from '@/service/api';
import LoadingPage from '@/components/LoadingPage.vue';

const route = useRoute();
const toast = useToast();

// Reactive data
const ctcdate = ref(new Date());
const showCreateCTCDialog = ref(false);
// const showCreateReimbursementDialog = ref(false);
const showCreateReplacementDialog = ref(false);
const showApproveDialog = ref(false);
const loadingAction = ref(false);
const warantyDetail = ref({});
const warantyDetailChecking = ref({});
const loading = ref(true);
const error = ref(null);
const saving = ref(false);
const showCTCConfirmationDialog = ref(false);
const scrapApprovalStatus = ref(''); // 'approved' | 'rejected' | ''
const loadingScrapAction = ref(false);
const stockCheckResult = ref(null);
const ctcSkipped = ref(false);
const ctcSkippedDate = ref(null);
const showCreateClaimDialog = ref(false);
const creatingClaim = ref(false);
const newClaimData = ref({
    damageCode: '',
    problem: '',
    claimPercent: null,
    usablePercent: null,
    wornPercent: null
});

// States
const claimFinalStatus = ref('');
const scrapStatus = ref('');
const invoiceStatus = ref('');
const approvingInvoice = ref(false);
const rejectingInvoice = ref(false);

// Results
const replacementResult = ref({});
const reimbursementResult = ref({});
const replacementSubmitted = ref(false);
const reimbursementSubmitted = ref(false);

const props = defineProps(['id']);
// Images
const scrapImages = ref([]);
const listMaterial = ref([]);
const selectedMaterial = ref(null);

const galleriaResponsiveOptions = ref([
    {
        breakpoint: '1024px',
        numVisible: 5
    },
    {
        breakpoint: '768px',
        numVisible: 3
    },
    {
        breakpoint: '560px',
        numVisible: 1
    }
]);

// Reject
const showRejectDialog = ref(false);
const rejectReasons = ref([]);
const selectedRejectReason = ref(null);
const rejecting = ref(false);

// Loading states
const loadingCTC = ref(false);
const loadingScrap = ref(false);

const rejectReasonDesc = computed(() => {
    if (!rejectReasons.value?.length || !warantyDetail.value?.rejectReasonID) {
        return 'N/A';
    }
    return rejectReasons.value.find((r) => r.id == warantyDetail.value.rejectReasonID) || null;
});

// Computed properties
const hasCTCData = computed(() => {
    return warantyDetail.value.ctc_details && !ctcSkipped.value;
});

const hasScrapData = computed(() => {
    return warantyDetail.value.scrapImage1URL || warantyDetail.value.scrapImage2URL || warantyDetail.value.scrapImage3URL;
});

// Add these methods to the methods section

// Open Create Claim Dialog
const openCreateClaimDialog = () => {
    showCreateClaimDialog.value = true;
    // Reset form data
    newClaimData.value = {
        damageCode: '',
        problem: '',
        claimPercent: null,
        usablePercent: null,
        wornPercent: null
    };
    creatingClaim.value = false;
};

// Close Create Claim Dialog
const closeCreateClaimDialog = () => {
    showCreateClaimDialog.value = false;
    creatingClaim.value = false;
};

// Submit Claim Details
const submitClaimDetails = async () => {
    // Validate required fields
    if (!newClaimData.value.damageCode || !newClaimData.value.problem || newClaimData.value.claimPercent === null || newClaimData.value.usablePercent === null || newClaimData.value.wornPercent === null) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Validation Error.',
            life: 4000
        });
        return;
    }

    try {
        creatingClaim.value = true;

        const id = route.params.id;
        const response = await api.post(`warranty_claim/adminApprove/${id}`, {
            damage_code: newClaimData.value.damageCode,
            problem: newClaimData.value.problem,
            claim_percent: newClaimData.value.claimPercent,
            usable_percent: newClaimData.value.usablePercent,
            worn_percent: newClaimData.value.wornPercent
        });

        if (response.data.status === 1) {
            toast.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Claim details created successfully',
                life: 3000
            });
        } else {
            throw new Error(response.data.message || 'Failed to create claim details');
        }
    } catch (error) {
        console.error('Error creating claim details:', error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: error.response?.data?.message || 'Failed to create claim details',
            life: 3000
        });
    } finally {
        // Close dialog and refresh data
        closeCreateClaimDialog();
        await fetchWarrantyClaim();
    }
};

// Fetch Material
const fetchMaterial = async () => {
    try {
        const id = route.params.id; // Use actual claim ID
        const response = await api.get(`warranty_claim/getClaimMaterial/${id}`);

        // console.log(response.data);
        if (response.data.status === 1) {
            listMaterial.value = (response.data.admin_data || []).map((item) => ({
                material: item // convert string → object
            }));
        }
    } catch (error) {
        console.error('Error fetching material:', error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load materials',
            life: 3000
        });
    }
};

// CTC Methods
const confirmCTCRequest = async () => {
    loadingCTC.value = true;
    try {
        const id = route.params.id;
        const response = await api.put(`warranty_claim/requestCTC/${id}`, {
            status: 1
        });

        if (response.data.status === 1) {
            toast.add({
                severity: 'success',
                summary: 'Success',
                detail: 'CTC request submitted successfully',
                life: 3000
            });
            showCTCConfirmationDialog.value = false;
            await fetchWarrantyClaim(); // Refresh data to show CTC status
        } else {
            throw new Error('CTC request failed');
        }
    } catch (error) {
        console.error('Error requesting CTC:', error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to request CTC. Please try again.',
            life: 3000
        });
    } finally {
        loadingCTC.value = false;
    }
};

const skipCTCProcess = async () => {
    try {
        ctcSkipped.value = true;
        ctcSkippedDate.value = new Date();

        toast.add({
            severity: 'info',
            summary: 'Info',
            detail: 'CTC process skipped. Proceeding to claim assessment.',
            life: 3000
        });
        showCTCConfirmationDialog.value = false;

        // Refresh the claim data to update the UI
        await fetchWarrantyClaim();
    } catch (error) {
        console.error('Error skipping CTC:', error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to skip CTC process',
            life: 3000
        });
    }
};

// Helper functions
const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('en-MY', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
};

// Scrap Approval Methods
const approveScrap = async () => {
    try {
        loadingScrapAction.value = true;

        // First, approve the scrap process
        const response = await api.post('warranty_claim/approveScrap', {
            claim_id: warantyDetail.value.id
        });

        if (response.data.status === 1) {
            scrapApprovalStatus.value = 'approved';
            toast.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Scrap approved successfully',
                life: 3000
            });

            // After scrap approval, check stock and proceed
            await checkStockAndProceed();
        } else {
            throw new Error('Scrap approval failed');
        }
    } catch (error) {
        console.error('Error approving scrap:', error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to approve scrap',
            life: 3000
        });
    } finally {
        loadingScrapAction.value = false;
    }
};

const rejectScrap = async () => {
    try {
        loadingScrapAction.value = true;

        const response = await api.post('warranty_claim/rejectScrap', {
            claim_id: warantyDetail.value.id
        });

        if (response.data.status === 1) {
            scrapApprovalStatus.value = 'rejected';
            toast.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Scrap rejected successfully',
                life: 3000
            });
        } else {
            throw new Error('Scrap rejection failed');
        }
    } catch (error) {
        console.error('Error rejecting scrap:', error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to reject scrap',
            life: 3000
        });
    } finally {
        loadingScrapAction.value = false;
    }
};

// Check stock and proceed based on initial selection
const checkStockAndProceed = async () => {
    try {
        // Get the initial approval type from claim data
        const initialApprovalType = warantyDetail.value.approvalType; // This should come from your claim approval

        // Check stock availability
        const stockResponse = await api.get(`/stock/check/${warantyDetail.value.tirePattern}`);
        const hasStock = stockResponse.data.hasStock;

        // Determine final path
        if (initialApprovalType === 'replacement' && hasStock) {
            // Proceed with replacement
            stockCheckResult.value = {
                hasStock: true,
                message: 'Stock available - Replacement confirmed',
                finalType: 'replacement'
            };

            // Execute replacement
            await executeReplacement();
        } else if (initialApprovalType === 'replacement' && !hasStock) {
            // Auto-switch to reimbursement
            stockCheckResult.value = {
                hasStock: false,
                message: 'No stock available - Switching to reimbursement',
                finalType: 'reimbursement'
            };

            // Switch to reimbursement
            await executeReimbursement();
        } else if (initialApprovalType === 'reimbursement') {
            // Proceed with reimbursement as selected
            stockCheckResult.value = {
                hasStock: false,
                message: 'Reimbursement process initiated',
                finalType: 'reimbursement'
            };

            // Execute reimbursement
            await executeReimbursement();
        }
    } catch (error) {
        console.error('Error checking stock:', error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to check stock availability',
            life: 3000
        });
    }
};

// Execute final actions
const executeReplacement = async () => {
    try {
        const response = await api.post('warranty_claim/processReplacement', {
            claim_id: warantyDetail.value.id
        });

        if (response.data.status === 1) {
            toast.add({
                severity: 'success',
                summary: 'Replacement Processed',
                detail: 'Tire replacement has been processed successfully',
                life: 4000
            });
        }
    } catch (error) {
        console.error('Error processing replacement:', error);
    }
};

const executeReimbursement = async () => {
    try {
        const response = await api.post('warranty_claim/processReimbursement', {
            claim_id: warantyDetail.value.id
        });

        if (response.data.status === 1) {
            toast.add({
                severity: 'success',
                summary: 'Reimbursement Initiated',
                detail: 'Reimbursement process has been started. Waiting for invoice upload.',
                life: 4000
            });

            // Refresh to show invoice section
            await fetchWarrantyClaim();
        }
    } catch (error) {
        console.error('Error processing reimbursement:', error);
    }
};

// Methods
const fetchWarrantyClaim = async () => {
    try {
        loading.value = true;
        const id = route.params.id;
        const response = await api.get(`warranty_claim/${id}`); // ✅ Correct endpoint with ID

        if (response.data.status === 1) {
            // Map the API response structure to your component data
            const apiData = response.data.admin_data;
            warantyDetailChecking.value = response.data.admin_data;
            warantyDetail.value = {
                // Claim Info
                id: apiData.claim_info?.id,
                claimRefNo: apiData.claim_info?.claimRefNo,

                // Customer Info
                firstName: apiData.customer_info?.[0]?.name?.split(' ')[0] || '',
                lastName: apiData.customer_info?.[0]?.name?.split(' ').slice(1).join(' ') || '',
                vehicleBrand: apiData.customer_info?.[0]?.vehicle?.split(' ')[0] || '',
                vehicleModel: apiData.customer_info?.[0]?.vehicle?.split(' ').slice(1).join(' ') || '',
                vehicleRegNo: apiData.customer_info?.[0]?.regNo,
                mobileNumber: apiData.warantyDetail?.[0]?.mobileNo,
                status: apiData.claim_info?.[0]?.mobileNo,
                // Dealer Info
                dealer_details: apiData.dealer_info?.[0] || {},

                // Tire Info
                pattern: apiData.tire_info?.[0]?.pattern,
                size: apiData.tire_info?.[0]?.tyresize,
                tire_details: apiData.tire_info?.[0] || {},

                // Claim Detail
                damageCode: apiData.claim_detail?.damageCode,
                problem: apiData.claim_detail?.problem,
                claimPercent: apiData.claim_detail?.claimPercent,
                usablePercent: apiData.claim_detail?.usablePercent,
                wornPercent: apiData.claim_detail?.wornPercent,
                status: apiData.claim_info?.status,
                // CTC Info
                ctc_details: apiData.ctc_info?.[0] || {},
                reimbursement: apiData.reimbursement?.[0] || {},
                replacement_detail: apiData.replacement_detail,
                scrapPhotos: apiData.scrapPhotos?.[0] || {},
                threadDepthPhotos: apiData.threadDepthPhotos?.[0] || {}

                // Add other necessary mappings...
            };
            // console.log(warantyDetail);
            await loadScrapImages();
            initializeWorkflowStates();
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
// Load scrap images
const loadScrapImages = async () => {
    const images = [];
    const imageUrls = [warantyDetail.value.scrapImage1URL, warantyDetail.value.scrapImage2URL, warantyDetail.value.scrapImage3URL].filter((url) => url && url !== 'null' && url !== null);

    // console.log('Found scrap images:', imageUrls);

    for (const [index, url] of imageUrls.entries()) {
        try {
            const imageSrc = await api.getPrivateFile(url);
            images.push({
                itemImageSrc: imageSrc,
                thumbnailImageSrc: imageSrc,
                alt: `Scrap Image ${index + 1}`
            });
        } catch (err) {
            console.error('Error loading scrap image:', err);
            images.push({
                itemImageSrc: '/placeholder-image.jpg',
                thumbnailImageSrc: '/placeholder-image.jpg',
                alt: `Scrap Image ${index + 1} - Failed to load`
            });
        }
    }

    scrapImages.value = images;
};

// Initialize workflow states
const initializeWorkflowStates = () => {
    // Set claim status
    if (warantyDetail.value.status === 5) {
        claimFinalStatus.value = 'approved';
    } else if (warantyDetail.value.status === 6) {
        claimFinalStatus.value = 'rejected';
    }

    // Set scrap status
    if (warantyDetail.value.isScrap === 1) {
        scrapApprovalStatus.value = 'approved';
    } else if (warantyDetail.value.isScrap === 2) {
        scrapApprovalStatus.value = 'rejected';
    }

    // Set scrap status (you can remove the old scrapStatus if not used elsewhere)
    if (warantyDetail.value.isScrap === 1) {
        scrapStatus.value = 'approved';
    } else if (warantyDetail.value.isScrap === 2) {
        scrapStatus.value = 'rejected';
    }
};

// Approve Invoice
const approveInvoice = async () => {
    try {
        approvingInvoice.value = true;
        const response = await api.put(`warranty_claim/approveInvoice/${warantyDetail.value.id}`, {
            status: 1
        });

        if (response.data.status === 1) {
            invoiceStatus.value = 'approved';
            toast.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Invoice approved successfully',
                life: 3000
            });
            await fetchWarrantyClaim(); // Refresh data
        } else {
            throw new Error(response.data.message || 'Invoice approval failed');
        }
    } catch (err) {
        console.error('Error approving invoice:', err);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: err.response?.data?.message || 'Failed to approve invoice',
            life: 3000
        });
    } finally {
        approvingInvoice.value = false;
    }
};

// Reject Invoice
const rejectInvoice = async () => {
    try {
        rejectingInvoice.value = true;
        const response = await api.put(`warranty_claim/approveInvoice/${warantyDetail.value.id}`, {
            status: 2 // Assuming 2 is for rejected status
        });

        if (response.data.status === 1) {
            invoiceStatus.value = 'rejected';
            toast.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Invoice rejected successfully',
                life: 3000
            });
            await fetchWarrantyClaim(); // Refresh data
        } else {
            throw new Error(response.data.message || 'Invoice rejection failed');
        }
    } catch (err) {
        console.error('Error rejecting invoice:', err);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: err.response?.data?.message || 'Failed to reject invoice',
            life: 3000
        });
    } finally {
        rejectingInvoice.value = false;
    }
};

const openRejectDialog = () => {
    showRejectDialog.value = true;
    selectedRejectReason.value = null;
};

const closeRejectDialog = () => {
    showRejectDialog.value = false;
    selectedRejectReason.value = null;
    rejecting.value = false;
};

const confirmRejectWarranty = async () => {
    if (!selectedRejectReason.value) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Please select a rejection reason',
            life: 3000
        });
        return;
    }

    try {
        rejecting.value = true;

        const response = await api.post('warranty_claim/reject', {
            claim_id: warantyDetail.value.id,
            reject_reason_id: selectedRejectReason.value
        });

        if (response.data.status === 1) {
            toast.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Warranty claim rejected successfully',
                life: 3000
            });

            await fetchWarrantyClaim();
            closeRejectDialog();
        } else {
            throw new Error(response.data.message || 'Rejection failed');
        }
    } catch (err) {
        console.error('Error rejecting warranty:', err);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: err.response?.data?.message || 'Failed to reject warranty claim',
            life: 3000
        });
    } finally {
        rejecting.value = false;
    }
};

// API Methods
const requestCTC = async () => {
    loadingCTC.value = true;
    try {
        const id = route.params.id;
        const response = await api.put(`warranty_claim/requestCTC/${id}`, {
            status: 1
        });

        if (response.data.status === 1) {
            toast.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Request CTC successfully',
                life: 3000
            });
            fetchWarrantyClaim();
        }
    } catch (error) {
        console.error('Error requesting CTC:', error);
    } finally {
        loadingCTC.value = false;
    }
};

const Approve = () => {
    showApproveDialog.value = true;
};

const createReplacement = () => {
    showApproveDialog.value = false;
    showCreateReplacementDialog.value = true;
};

const createReimbursement = async () => {
    showApproveDialog.value = false;
    // showCreateReimbursementDialog.value = true;
    console.log(warantyDetail);
    try {
        saving.value = true;

        const response = await api.put(`warranty_claim/approveInvoice/${warantyDetail.value.id}`, {});
        if (response.data.status === 1) {
            toast.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Reimbursement approved successfully',
                life: 3000
            });
        } else {
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: response.data.error,
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
        showApproveDialog.value = false;
    }
};

const closeCTCDialog = () => {
    showCreateCTCDialog.value = false;
    ctcdate.value = new Date();
};

const closeApproveDialog = () => {
    showApproveDialog.value = false;
};

const closeReplacementDialog = () => {
    showCreateReplacementDialog.value = false;
    showApproveDialog.value = true;
};

// const closeReimbursementDialog = () => {
//     showCreateReimbursementDialog.value = false;
//     showApproveDialog.value = true;
// };

const saveCTC = async () => {
    try {
        loading.value = true;
        const pad = (n) => n.toString().padStart(2, '0');
        const d = ctcdate.value;

        const createData = {
            claim_id: warantyDetail.value.id,
            collect_datetime: `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
        };

        const response = await api.post(`collection/createCTC`, createData);

        if (response.data.status === 1) {
            closeCTCDialog();
        } else {
            console.error('Failed to create date:', response.data);
            alert('Failed to create ctc. Please try again.');
        }
    } catch (error) {
        console.error('Error create ctc:', error);
    } finally {
        loading.value = false;
        closeCTCDialog();
    }
};

const submitReplacement = async () => {
    if (!selectedMaterial.value) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Please select Material ID',
            life: 3000
        });
        return;
    }

    try {
        loadingAction.value = true;

        // 1. Call Replacement API
        const replacementResponse = await api.post('warranty_claim/approveReplacement', {
            claim_id: warantyDetail.value.id,
            materialid: selectedMaterial.value.material
        });

        if (replacementResponse.data.status === 1) {
            // 2. Automatically Request Scrap
            const scrapResponse = await api.put(`warranty_claim/requestScrap/${warantyDetail.value.id}`, {
                status: 1
            });

            replacementResult.value = replacementResponse.data.admin_data;
            replacementSubmitted.value = true;

            toast.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Replacement approved and scrap requested successfully',
                life: 3000
            });

            // Refresh claim data
            await fetchWarrantyClaim();
        } else {
            throw new Error(replacementResponse.data.message || 'Replacement approval failed');
        }
    } catch (err) {
        console.error('Error submitting replacement:', err);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: err.response?.data?.message || 'Failed to submit replacement',
            life: 3000
        });
    } finally {
        loadingAction.value = false;
        showCreateReplacementDialog.value = false;
    }
};

const submitReimbursement = async () => {
    if (!selectedMaterial.value) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Please select Material ID',
            life: 3000
        });
        return;
    }

    try {
        loadingAction.value = true;

        // 1. Call Reimbursement API
        const reimbursementResponse = await api.post('warranty_claim/approveReimbursement', {
            claim_id: warantyDetail.value.id,
            materialid: selectedMaterial.value.material
        });

        if (reimbursementResponse.data.status === 1) {
            // 2. Automatically Request Scrap
            const scrapResponse = await api.put(`warranty_claim/requestScrap/${warantyDetail.value.id}`, {
                status: 1
            });

            reimbursementResult.value = reimbursementResponse.data.admin_data;
            reimbursementSubmitted.value = true;

            toast.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Reimbursement approved and scrap requested successfully',
                life: 3000
            });

            // Refresh claim data
            await fetchWarrantyClaim();
        } else {
            throw new Error(reimbursementResponse.data.message || 'Reimbursement approval failed');
        }
    } catch (err) {
        console.error('Error submitting reimbursement:', err);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: err.response?.data?.message || 'Failed to submit reimbursement',
            life: 3000
        });
    } finally {
        loadingAction.value = false;
        // showCreateReimbursementDialog.value = false;
    }
};

const viewInvoice = async (url) => {
    try {
        const blobUrl = await api.getPrivateFile(url);
        if (!blobUrl) return;
        window.open(blobUrl, '_blank'); // opens preview in new tab
    } catch (error) {
        console.error('Failed to preview file:', error);
    }
};

const downloadInvoice = async (url, filename = 'invoice.pdf') => {
    try {
        const blobUrl = await api.getPrivateFile(url);
        if (!blobUrl) return;

        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        setTimeout(() => URL.revokeObjectURL(blobUrl), 5000);
    } catch (error) {
        console.error('Failed to download file:', error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to download invoice',
            life: 3000
        });
    }
};

// Helper functions
const formatDate = (dateString) => {
    if (!dateString) return 'Not Assigned';
    return new Date(dateString).toLocaleDateString('en-MY');
};

const formatTime = (timeStr) => {
    if (!timeStr) return '';
    const date = new Date(`1970-01-01T${timeStr}`);
    return date.toLocaleTimeString('en-MY', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
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

// Lifecycle
onMounted(() => {
    fetchWarrantyClaim();
    fetchMaterial();
    fetchRejectReasons();
});
</script>
