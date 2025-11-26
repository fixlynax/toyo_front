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
                        <div class="text-2xl font-bold text-gray-800">Warranty Details</div>
                        <Button v-if="(warantyDetail.status ==6 || warantyDetail.status ==5)"
                        label="Download Report"
                        icon="pi pi-print" 
                        class="p-button-text p-button-sm" 
                        @click="fetchReport(warantyDetail.id)" 
                        tooltip="Print Report"
                        />
                    </div>
                   <div class="inline-flex items-center gap-2">
                       <Tag :value="getStatusText(warantyDetail.status)" :severity="getStatusSeverity(warantyDetail.status)" />
                    </div>
                </div>
                <div class="grid grid-cols-3 md:grid-cols-3 gap-4">
                    <div>
                        <span class="block text-sm font-bold text-black-800">Ref No</span>
                        <span class="text-lg font-medium">{{ warantyDetail.claimRefNo }}</span>
                    </div>
                    <div>
                        <span class="block text-sm font-bold text-black-800">Claim Date</span>
                        <span class="text-lg font-medium">{{ formatDate(warantyDetail.claimDate) || '-'  }}</span>
                    </div>
                    <div>
                        <span class="block text-sm font-bold text-black-800">Stage</span>
                        <span class="text-lg font-medium">{{ warantyDetail.status_string || '-'  }}</span>
                    </div>
                </div>
            </div>

            <!-- Customer and Dealer Information -->
                <!-- Customer -->
                <div class="card flex flex-col w-full">
                    <div class="border-b pb-2 mb-2 text-2xl font-bold text-gray-800">Vehicle Information</div>
                    <div class="grid grid-cols-2 md:grid-cols-2 gap-4">
                        <div>
                            <span class="block text-sm font-bold text-black-800">Brand</span>
                            <p class="text-lg font-medium">{{ warantyDetail.customer_info?.vehicleBrand || '-' }}</p>
                        </div>
                        <div>
                            <span class="block text-sm font-bold text-black-800">Registration No</span>
                            <p class="text-lg font-medium">{{ warantyDetail.customer_info?.regNo || '-' }}</p>
                        </div>
                        <div>
                            <span class="block text-sm font-bold text-black-800">Model</span>
                            <p class="text-lg font-medium">{{ warantyDetail.customer_info?.vehicleModel || '-' }}</p>
                        </div>
                        <div>
                            <span class="block text-sm font-bold text-black-800">Vehicle Type</span>
                            <p class="text-lg font-medium">{{ warantyDetail.customer_info?.vehicle || '-' }}</p>
                        </div>
                    </div>
                </div>

                <!-- Tire Detail -->
                <div class="card flex flex-col w-full">
                    <div class="flex items-center justify-between border-b pb-2 mb-4">
                        <div class="text-2xl font-bold text-gray-800">Tire Detail</div>
                        <Button label="Update Tire Details" class="p-button-info" size="small" @click="openEditTier" v-if="warantyDetail.status !== 6 && warantyDetail.status !== 5 && warantyDetail.status_string !== 'Pending Customer Invoice'"/>
                    </div>
                    <div :class="['grid',  'gap-4', 'mb-2', warantyDetail.tire_info?.plateSerialAdmin ? 'grid-cols-2 md:grid-cols-5' : 'grid-cols-2 md:grid-cols-4']">
                        <div>
                            <span class="block text-sm font-bold text-black-800">MFG Code</span>

                            <!-- OLD (User) -->
                            <p class="text-lg font-medium mb-2">{{ warantyDetail.tire_info.platePart1 || '-' }}</p>
                            <!-- NEW (Admin) -->
                            <p  v-if="warantyDetail.tire_info?.plateSerialAdmin"  class="text-lg font-medium"> {{ warantyDetail.tire_info.AdminplatePart1 }}</p>
                        </div>
                        <div>
                            <span class="block text-sm font-bold text-black-800">Size Code</span>
                            <p class="text-lg font-medium mb-2">{{ warantyDetail.tire_info.platePart2 || '-' }}</p>
                            <p  v-if="warantyDetail.tire_info?.plateSerialAdmin"  class="text-lg font-medium"> {{ warantyDetail.tire_info.AdminplatePart2 }}</p>

                        </div>
                        <div>
                            <span class="block text-sm font-bold text-black-800">Tyre Spec</span>
                            <p class="text-lg font-medium mb-2">{{ warantyDetail.tire_info.platePart3  || '-' }}</p>
                            <p  v-if="warantyDetail.tire_info?.plateSerialAdmin"  class="text-lg font-medium"> {{ warantyDetail.tire_info.AdminplatePart3 }}</p>

                        </div>
                        <div>
                            <span class="block text-sm font-bold text-black-800">Week Code</span>
                            <p class="text-lg font-medium mb-2">{{ warantyDetail.tire_info.platePart4  || '-' }}</p>
                            <p  v-if="warantyDetail.tire_info?.plateSerialAdmin"  class="text-lg font-medium"> {{ warantyDetail.tire_info.AdminplatePart4 }}</p>
                        </div>
                        <div  v-if="warantyDetail.tire_info?.plateSerialAdmin" >
                            <span class="block text-sm font-bold text-black-800">Submitted</span>
                            <p><span class="text-xs bg-red-500 text-white px-1 rounded ml-1"> Old </span></p>
                            <p> <span class="text-xs bg-green-600 text-white px-1 rounded ml-1">New</span></p>
                        </div>
                    </div>

                    <div class="grid grid-cols-2 md:grid-cols-2 gap-4">
                        <!-- <div>
                            <span class="block text-sm font-bold text-black-800">Serial Plate</span>
                            <p class="text-lg font-medium">{{ warantyDetail.tire_info.plateSerial || '-' }}</p>
                        </div> -->
                        <div>
                            <span class="block text-sm font-bold text-black-800">Pattern</span>
                            <p class="text-lg font-medium">{{ warantyDetail.tire_info.pattern || '-' }}</p>
                        </div>

                        <div>
                            <span class="block text-sm font-bold text-black-800">Description</span>
                            <p class="text-lg font-medium">{{ warantyDetail.tire_info.desc || '-' }}</p>
                        </div>

                        <div>
                            <span class="block text-sm font-bold text-black-800">Certificate Number</span>
                            <p class="text-lg font-medium">{{ warantyDetail.warrantyCertNo || '-' }}</p>
                        </div>
                        <div>
                            <span class="block text-sm font-bold text-black-800">Warranty Type</span>
                            <p class="text-lg font-medium">{{ warantyDetail.claimTypeDisplay || '-' }}</p>
                        </div>
                        <div>
                            <span class="block text-sm font-bold text-black-800">Purchase Date</span>
                            <p class="text-lg font-medium">{{ warantyDetail.warranty_info?.purchaseDate || '-' }}</p>
                        </div>
                        <div>
                            <span class="block text-sm font-bold text-black-800">Problem Description</span>
                            <p class="text-lg font-medium">{{ warantyDetail.customer_info?.problem || '-' }}</p>
                        </div>
                    </div>
                </div>

                <!-- Submitted Photos Section -->
            <div class="card flex flex-col w-full">
                <div class="flex items-center justify-between border-b pb-2 mb-4">
                    <div class="text-2xl font-bold text-gray-800">Submitted Images</div>
                </div>

                <!-- Photo Grid -->
                <div v-if="hasSubmittedPhotos"  class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div
                        v-for="photo in submittedPhotos"
                        :key="photo"
                        class="rounded-xl overflow-hidden shadow-sm bg-gray-100">
                        <span class="block text-lg font-bold text-black-800 mb-3 text-center">{{ photo.label }}</span>
                        <a :href="photo.imageSrc" target="_blank" rel="noopener noreferrer">
                            <img
                                :src="photo.imageSrc"
                                :alt="`Submitted Photo ${index + 1}`"
                                class="w-full h-64 object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
                            />
                        </a>
                    </div>

                </div>
                <div v-else class="text-center py-8 bg-gray-50 rounded-lg mb-6">
                    <i class="pi pi-image text-4xl text-gray-400 mb-3"></i>
                    <p class="text-gray-500 font-medium">No submitted images available</p>
                </div>
            </div>

                <!-- Tire Detail -->
                <div class="card flex flex-col w-full">
                    <div class="flex items-center justify-between border-b pb-2 mb-4">
                        <div class="text-2xl font-bold text-gray-800">Tire Depth Image</div>
                    </div>
                    <div v-if="TireDepthImages.length > 0" class="mb-6">
                        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            <div
                                v-for="(img, index) in TireDepthImages"
                                :key="index"
                                class="rounded-xl overflow-hidden shadow-sm bg-gray-100"
                            >
                                <a :href="img.itemImageSrc" target="_blank" rel="noopener noreferrer">
                                    <img
                                        :src="img.itemImageSrc"
                                        :alt="`Tire Depth ${index + 1}`"
                                        class="w-full h-64 object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
                                    />
                                </a>
                            </div>
                        </div>
                    </div>
                    <div v-else class="text-center py-8 bg-gray-50 rounded-lg mb-6">
                        <i class="pi pi-image text-4xl text-gray-400 mb-3"></i>
                        <p class="text-gray-500 font-medium">No tire depth images available</p>
                    </div>
                </div>

        </div>

        <!-- RIGHT SIDE -->
        <div class="md:w-1/3 flex flex-col">
            <div class="card w-full mb-4">
                <div class="flex items-center justify-between border-b pb-2 mb-2">
                    <div class="text-2xl font-bold text-gray-800">Customer Information</div>
                </div>

                <!-- Show CTC data if exists in database -->
                <div class="grid grid-cols-2 md:grid-cols-2 gap-4 text-sm text-gray-800">
                    <div>
                        <span class="font-bold">Dealer Acc No</span>
                        <p class="text-lg font-medium">{{ warantyDetail.dealer_details?.custAccountNo || '-' }}</p>
                    </div>
                    <div>
                        <span class="font-bold">Dealer Name</span>
                        <p class="text-lg font-medium">{{ warantyDetail.dealer_details?.companyName1 || '-'  }}</p>
                    </div>
                    <div>
                        <span class="font-bold">Contact Number</span>
                        <p class="text-lg font-medium">{{ warantyDetail.dealer_details?.phoneNumber || '-' }}</p>
                    </div>
                    <div>
                        <span class="font-bold">Email</span>
                        <p class="text-lg font-medium">{{ warantyDetail.dealer_details?.emailAddress || '-'  }}</p>
                    </div>
                </div>
            </div>

            <div class="card w-full mb-4">
                <div class="flex items-center justify-between border-b pb-2 mb-2">
                    <div class="text-2xl font-bold text-gray-800">Consumer Information</div>
                </div>

                <!-- Show CTC data if exists in database -->
                <div class="grid grid-cols-2 md:grid-cols-2 gap-4 text-sm text-gray-800">
                    <div>
                        <span class="font-bold">Name</span>
                        <p class="text-lg font-medium">{{ warantyDetail.customer_info?.name || '-' }}</p>
                    </div>
                    <div>
                        <span class="font-bold">Mobile Number</span>
                        <p class="text-lg font-medium">{{ warantyDetail.customer_info?.mobileNo || '-' }}</p>
                    </div>
                </div>
            </div>

            <!-- 1. CTC Detail -->
            <div class="card w-full mb-4">
                <div class="flex items-center justify-between border-b pb-2 mb-2">
                    <div class="text-2xl font-bold text-gray-800">CTC Detail</div>
                    <!-- Show Request button only if no CTC data exists -->
                    <!-- <Button v-if="!hasCTCData && !ctcSkipped" label="Request CTC" class="p-button-info" size="small" @click="showCTCConfirmationDialog = true" :loading="loadingCTC" /> -->
                    <Button v-if="warantyDetail.isCTC === 0 && !hasClaimDetails && canUpdate" label="Request CTC" class="p-button-info" size="small" @click="confirmCTCRequest" :loading="loadingCTC" />
                    <div v-else-if="warantyDetail.isReturn === 1 && warantyDetail.ctc_details.reachWH && canUpdate" class="text-right mt-3 text-sm font-bold text-green-600">
                        <i class="pi pi-check-circle mr-2"></i>
                        Return CTC Requested
                    </div>
                    <div v-else-if="warantyDetail.isCTC === 1" class="text-right mt-3 text-sm font-bold text-green-600">
                        <i class="pi pi-check-circle mr-2"></i>
                        CTC Requested
                    </div>
                </div>

                <!-- Show CTC data if exists in database -->
                <div v-if="hasCTCData" class="grid grid-cols-2 md:grid-cols-2 gap-4 text-sm text-gray-800">
                    <div>
                        <span class="font-bold">CTC Collection Date</span>
                        <p>{{ `${formatDate(warantyDetail.ctc_details.collectDate)} ${formatTime(warantyDetail.ctc_details.collectTime)}` }}</p>
                    </div>
                    <div>
                        <span class="font-bold">Received Date</span>
                        <p>{{ `${formatDate(warantyDetail.ctc_details.reachWH)} ${formatTime(warantyDetail.ctc_details.returnDateTime)}` }}</p>
                    </div>
                    
                    <div v-if="warantyDetail.return_info">
                        <span class="font-bold">ETA Date</span>
                        <p>{{ warantyDetail.return_info?.deliveryDate ? formatDate(warantyDetail.return_info.deliveryDate): 'Not Assigned'}}</p>
                    </div>
                    <div v-if="warantyDetail.return_info">
                        <span class="font-bold">Schedule Date</span>
                        <p>{{ warantyDetail.return_info?.scheduleDeliveryDate ? formatDate(warantyDetail.return_info.scheduleDeliveryDate): 'Not Assigned'}}</p>
                    </div>
                    <Button v-if="warantyDetail.isReturn === 0 && warantyDetail.ctc_details.reachWH && canUpdate" label="Request CTC Return" class="p-button-info" size="small" @click="confirmCTCRequestReturn" :loading="loadingCTC" />
                </div>

                <!-- Show empty state if no CTC data and not skipped -->
                <div v-else class="text-center py-4 text-gray-500">No CTC data available</div>
            </div>

            <!-- 2. Claim Detail -->
            <div class="card w-full mb-4">
                <div class="flex items-center justify-between border-b pb-2 mb-2">
                    <div class="text-2xl font-bold text-gray-800">Claim Detail</div>
                    <div class="text-right mt-3 text-sm font-bold text-green-600"  v-if="hasClaimDetails">
                        <i class="pi pi-check-circle mr-2"></i>
                        Claim Created
                    </div>
                </div>

                <!-- Claim Detail Content - Show if data exists -->
                <div v-if="hasClaimDetails" class="grid grid-cols-1 gap-4 text-sm text-gray-800">
                    <!-- Damage Code & Problem -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <span class="font-bold text-gray-700">Damage Code</span>
                            <p>{{ warantyDetail.problemCodeAdmin || '-' }}</p>
                        </div>
                        <div>
                            <span class="font-bold text-gray-700">Problem Description</span>
                            <p>{{ warantyDetail.problemAdmin || '-' }}</p>
                        </div>
                        <div>
                            <span class="font-bold text-gray-700">Approved By</span>
                            <p>{{ warantyDetail.approvedByClaim || '-' }}</p>
                        </div>
                        <div>
                             <span class="font-bold text-gray-700">Approved Date</span>
                            <p>{{ formatDate(warantyDetail.approvedOnClaim) || '-' }}</p>
                        </div>
                    </div>

                    <!-- Percentages -->
                    <div class="bg-gray-50 rounded-lg">
                        <span class="font-bold text-gray-700 block mb-3">Claim Percentages</span>
                        <div class="grid grid-cols-2 gap-4">
                            <div class="text-center">
                                <span class="block font-bold text--600">Claim %</span>
                                <p class="text-xl font-bold text-black">{{ warantyDetail.claimPercent || '0' }}%</p>
                            </div>
                            <div class="text-center">
                                <span class="block font-bold text--600">Tread Depth Dealer</span>
                                <p class="text-xl font-bold text-black"> {{ warantyDetail.threadDepthMeasurementEten? Number(warantyDetail.threadDepthMeasurementEten).toFixed(2): '0.00'}}</p>
                            </div>
                            <div class="text-center">
                                <span class="block font-bold text--600">Worn %</span>
                                <p class="text-xl font-bold text-black">{{ warantyDetail.wornPercent || '0' }}%</p>
                            </div>
                            <div class="text-center">
                                <span class="block font-bold text--600">Tread Depth Admin</span>
                                <p class="text-xl font-bold text-black">{{ warantyDetail.threadDepthMeasurementAdmin? Number(warantyDetail.threadDepthMeasurementAdmin).toFixed(2): '0.00'}}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Show empty state if no claim data -->
                <div v-else class="text-center py-8 bg-gray-50 rounded-lg">
                    <i class="pi pi-file-edit text-4xl text-gray-400 mb-3"></i>
                    <p class="text-gray-500 font-medium">No claim assessment created yet</p>
                    <p class="text-gray-400 text-sm mt-2">Click 'Create Claim' to assess this warranty claim</p>
                </div>
                    

                <!-- Status Display -->
                <div v-if="warantyDetail.status === 6" class="text-right mt-3 text-sm font-bold text-red-600">
                    <i class="mr-2 pi pi-times-circle"></i>
                    Claim Rejected
                </div>
                <div v-if="warantyDetail.status === 5" class="text-right mt-3 text-sm font-bold text-green-600">
                    <i class="pi pi-check-circle mr-2"></i>
                    Claim Approved
                </div>
                <div class="flex justify-end gap-2 mt-4 pt-4 border-t" v-if="!hasClaimDetails && canUpdate">
                    <Button label="Create Claim" class="p-button-success" size="small" @click="openCreateClaimDialog" icon="pi pi-check" />
                    <Button label="Reject Claim" class="p-button-danger" size="small" @click="showRejectDialog = true" icon="pi pi-times" />
                </div>
            </div>

            <div class="card w-full mb-4" v-if="warantyDetail.status === 6">
                <div class="flex items-center justify-between border-b pb-2 mb-2">
                    <div class="text-2xl font-bold text-gray-800">Reject Details</div>
                </div>

                <!-- FIXED: Show scrap data if exists in database -->
                <div class="mb-4">
                    <div class="grid grid-cols-2 gap-2 text-sm text-gray-800">
                        <div>
                            <span class="font-bold">Rejected By</span>
                            <p>{{ warantyDetail.rejectReason?.rejectedBy }}</p>
                        </div>
                        <div>
                            <span class="font-bold">Rejected Date</span>
                            <p>{{ warantyDetail.rejectReason?.rejectedOn }}</p>
                        </div>
                        <div>
                            <span class="font-bold">Type</span>
                            <p>{{ warantyDetail.rejectReason?.type }}</p>
                        </div>
                        <div>
                            <span class="font-bold">Code</span>
                            <p>{{ warantyDetail.rejectReason?.code }}</p>
                        </div>
                        <div>
                            <span class="font-bold">Part</span>
                            <p>{{ warantyDetail.rejectReason?.part }}</p>
                        </div>
                        <div>
                            <span class="font-bold">Description</span>
                            <p>{{ warantyDetail.rejectReason?.damageMode }}</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 3. Scrap Detail -->
            <div v-if="hasClaimDetails" class="card w-full mb-4">
                <div class="flex items-center justify-between border-b pb-2 mb-4">
                    <div class="text-2xl font-bold text-gray-800">Scrap Details</div>
                    <Button v-if="hasClaimDetails && warantyDetail.isScrap === 0 && (warantyDetail.status !=6 || warantyDetail.status ==5) && canUpdate" label="Request Scrap" class="p-button-info" size="small" @click="requestScrap" :loading="loadingScrap" />
                    <div v-if="warantyDetail.isScrap === 1" class="text-right mt-3 text-sm font-bold text-green-600">
                        <i class="pi pi-check-circle mr-2"></i>
                        Scrap Requested
                    </div>
                </div>

                <!-- Scrap Images Gallery -->
                <div v-if="(warantyDetail.status_string  !== 'Pending Scrap') &&(warantyDetail.status_string  !== 'Pending Scrap Photo') && scrapImages.length > 0" class="mb-6">
                        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            <div
                                v-for="(item, index) in scrapImages"
                                :key="index"
                                class="rounded-xl overflow-hidden shadow-sm bg-gray-100">
                                <a :href="item.itemImageSrc" target="_blank" rel="noopener noreferrer">
                                    <img
                                        :src="item.itemImageSrc"
                                        :alt="`Scrap image ${index + 1}`"
                                        class="w-full h-64 object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
                                    />
                                </a>
                            </div>
                        </div>

                    <div v-if="warantyDetail.status_string  =='Pending Manager Approval' && scrapImages && canUpdate" class="flex justify-end gap-2 mt-4 pt-4 border-t">
                        <Button label="Approve Scrap" class="p-button-success" size="small" @click="Approve" icon="pi pi-check" />
                        <Button label="Reject Scrap" class="p-button-warn" size="small" @click="rejectScrap" icon="pi pi-times" />
                        <Button label="Reject Claim" class="p-button-danger" size="small" @click="showRejectDialog = true" icon="pi pi-times" />
                    </div>
                </div>
                <!-- No Images Message -->
                <div v-else class="text-center py-8 bg-gray-50 rounded-lg mb-6">
                    <i class="pi pi-image text-4xl text-gray-400 mb-3"></i>
                    <p class="text-gray-500 font-medium">No scrap images available</p>
                    <p class="text-gray-400 text-sm mt-2">Click 'Request Scrap' to initiate the scrap process</p>
                </div>
            </div>

            <div v-if="warantyDetail.replacement_detail" class="card w-full mb-4">
                <div class="flex items-center justify-between border-b pb-2 mb-2">
                    <div class="text-2xl font-bold text-gray-800">Replacement Details</div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-800">
                    <div>
                        <span class="font-bold">Order No</span>
                        <p>{{ warantyDetail.replacement_detail?.order_no }}</p>
                    </div>
                    <div>
                        <span class="font-bold">Order Date</span>
                        <p>{{ formatDate(warantyDetail.replacement_detail?.order_date) }}</p>
                    </div>
                    <div>
                        <span class="font-bold">Do No</span>
                        <p>{{ warantyDetail.replacement_detail?.do_no }}</p>
                    </div>
                    <div>
                        <span class="font-bold">So No</span>
                        <p>{{ warantyDetail.replacement_detail?.so_no }}</p>
                    </div>
                </div>
            </div>

            <div v-if="warantyDetail.reimbursement || warantyDetail.status_string  =='Pending Customer Invoice'" class="card w-full mb-4">
                <div class="flex items-center justify-between border-b pb-2 mb-2">
                    <div class="text-2xl font-bold text-gray-800">Reimbursement Detail</div>
                </div>
                <div v-if="warantyDetail.status_string  == 'Pending Customer Invoice'" class="bg-yellow-50 border border-yellow-200 rounded-lg p-4" >
                    <div class="flex items-start gap-3">
                        <i class="pi pi-exclamation-circle text-yellow-600 mt-1"></i>
                        <div>
                            <p class="font-semibold text-yellow-800">Invoice Upload Required</p>
                            <p class="text-yellow-700 text-sm mt-1">Invoice will be uploaded by customer for reimbursement processing.</p>
                        </div>
                    </div>
                </div>
                <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-800">
                    <div>
                        <span class="font-bold">Invoice Request Date </span>
                        <p>{{ formatDateString(warantyDetail.reimbursement?.requestReimbursementDate) || '-' }}</p>
                    </div>
                    <div>
                        <span class="font-bold">Invoice Submitted Date </span>
                        <p>{{ formatDateString(warantyDetail.reimbursement?.invSubmitDate) || '-' }}</p>
                    </div>
                    <div>
                        <span class="font-bold">Invoice Amount </span>
                        <p>RM {{ warantyDetail.reimbursement?.invAmount }}</p>
                    </div>
                    <div>
                        <span class="font-bold">Inv No</span>
                        <!-- View Invoice function -->
                        <p>
                            <span 
                                v-if="warantyDetail.reimbursement?.invNo && warantyDetail.reimbursement.invAttachURL"
                                class="text-blue-600 cursor-pointer"
                                @click="viewInvoice(warantyDetail.reimbursement.invAttachURL)"
                            >
                                {{ warantyDetail.reimbursement.invNo }}
                            </span>
                            <span v-else-if="warantyDetail.reimbursement?.invNo">
                                {{ warantyDetail.reimbursement.invNo }}
                            </span>
                            <span v-else>
                                Pending Invoice
                            </span>
                        </p>
                    </div>
                    <div>
                        <span class="font-bold">SAP Claim No </span>
                        <p>{{ warantyDetail.reimbursement?.sapClaimNo ? warantyDetail.reimbursement.sapClaimNo : 'Pending Invoice Approval' }}</p>
                    </div>
                </div>
                <div v-if="(warantyDetail.status_string  !== 'Pending Customer Invoice') && warantyDetail.reimbursement && warantyDetail.status !=5 && canUpdate" class="flex justify-end gap-2 mt-4">
                    <Button label="Approve Invoice" class="p-button-success" size="small" @click="approveInvoice" :loading="approvingInvoice" icon="pi pi-check" />
                    <Button label="Reject Invoice" class="p-button-warn" size="small" @click="rejectInvoice" :loading="rejectingInvoice" icon="pi pi-times" />
                    <!-- <Button label="Reject Claim" class="p-button-danger" size="small" @click="showRejectDialog = true" icon="pi pi-times" /> -->
                </div>
            </div>
        </div>
    </div>
<Dialog v-model:visible="showEditTireDialog" header="Update Tire Details" :modal="true" class="p-fluid" :style="{ width: '40rem' }">
        <div class="grid grid-cols-1 gap-4">
            <!-- Percentages -->
            <div class="grid grid-cols-2 gap-4">
                <!-- Claim Percentage -->
                <div class="field">
                    <label class="block font-bold text-gray-700 mb-2">MFG Code *</label>
                     <InputText v-model="editTireData.mfgcode" class="w-full" />
                    <small v-if="(!editTireData.mfgcode) && editValidationTire" class="text-red-600">MFG Code is required.</small>
                </div>
                <div class="field">
                    <label class="block font-bold text-gray-700 mb-2">Size Code *</label>
                     <InputText v-model="editTireData.sizecode" class="w-full" />
                    <small v-if="(!editTireData.sizecode) && editValidationTire" class="text-red-600">Size Code is required.</small>
                </div>
                <div class="field">
                    <label class="block font-bold text-gray-700 mb-2">Tyre Spec *</label>
                     <InputText v-model="editTireData.tyrespec" class="w-full" />
                    <small v-if="(!editTireData.tyrespec) && editValidationTire" class="text-red-600">Tyre Spec is required.</small>
                </div>
                <div class="field">
                    <label class="block font-bold text-gray-700 mb-2">Week Code *</label>
                     <InputText v-model="editTireData.weekcode" class="w-full" />
                    <small v-if="(!editTireData.weekcode) && editValidationTire" class="text-red-600">Week Code is required.</small>
                </div>
            </div>
        </div>

        <template #footer>
            <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="closeEditTire" :disabled="editTire" />
            <Button label="Update Tire" icon="pi pi-check" class="p-button-primary" @click="submitEditTire" :loading="editTire" />
        </template>
    </Dialog>
    <!-- Create Claim Dialog -->
    <Dialog v-model:visible="showCreateClaimDialog" header="Create Claim Details" :modal="true" class="p-fluid" :style="{ width: '40rem' }">
        <div class="grid grid-cols-1 gap-4">
            <div class="field">
                <label class="block font-bold text-gray-700 mb-2">Damage Type *</label>

                <Dropdown 
                    v-model="selectedDamageType" 
                    :options="rejectReasons" 
                    optionLabel="damageMode" 
                    placeholder="Select Damage Type" 
                    class="w-full" 
                    :class="{ 'p-invalid': !selectedDamageType && creatingClaim }"
                    @change="handleDamageSelect"
                    filter
                    filterBy="damageMode,code,grouping"
                >
                    <template #option="slotProps">
                        <div class="flex flex-col gap-1 py-2">
                            <div class="font-semibold text-gray-800">{{ slotProps.option.damageMode }}</div>
                            <div class="text-sm text-gray-600"><span class="font-medium">Code:</span> {{ slotProps.option.code }} | <span class="font-medium">Part:</span> {{ slotProps.option.part }}</div>
                            <div class="text-xs text-gray-500">{{ slotProps.option.grouping }}</div>
                        </div>
                    </template>
                </Dropdown>

                <small v-if="!selectedDamageType && creatingClaim" class="text-red-600">
                    Damage type is required.
                </small>
            </div>
            <!-- Percentages -->
            <div class="grid grid-cols-2 gap-4">
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
                    <small v-if="(newClaimData.claimPercent === null || newClaimData.claimPercent === undefined) && creatingClaim" class="text-red-600">Claim percentage is required.</small>
                </div>
                <div class="field">
                    <label class="block font-bold text-gray-700 mb-2">Tread Depth Dealer</label>
                    <InputNumber
                        v-model="warantyDetail.threadDepthMeasurementEten"
                        mode="decimal"
                        :min="0"
                        :max="100"
                        :minFractionDigits="0"
                        :maxFractionDigits="2"
                        placeholder="0-100"
                        disabled=""
                        class="w-full"
                      
                    />
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
                    <small v-if="(newClaimData.wornPercent === null || newClaimData.wornPercent === undefined) && creatingClaim" class="text-red-600">Worn percentage is required.</small>
                </div>
                <!-- Thread Depth -->
                <div class="field">
                    <label class="block font-bold text-gray-700 mb-2">Tread Depth Admin *</label>
                    <InputNumber
                        v-model="newClaimData.threadDepth"
                        mode="decimal"
                        :min="0"
                        :minFractionDigits="2"
                        :maxFractionDigits="2"
                        placeholder="0.00"
                        class="w-full"
                        :class="{ 'p-invalid': (newClaimData.threadDepth === null || newClaimData.threadDepth === undefined) && creatingClaim }"
                    />
                    <small v-if="(newClaimData.threadDepth === null || newClaimData.threadDepth === undefined) && creatingClaim" class="text-red-600">Tread Depth is required.</small>
                </div>
            </div>
        </div>

        <template #footer>
            <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="closeCreateClaimDialog" :disabled="creatingClaim" />
            <Button label="Create Claim" icon="pi pi-check" class="p-button-primary" @click="submitClaimDetails" :loading="creatingClaim" />
        </template>
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
            <!-- Show Replacement option only if claimPercent >= 80 -->
            <div v-if="warantyDetail.claimPercent >= 80" class="flex items-center">
                <Button label="Replacement" class="p-button-primary w-full" @click="createReplacement" />
            </div>
            <!-- Always show Reimbursement option -->
            <Button label="Reimbursement" class="p-button-primary" @click="createReimbursement" />
        </div>

        <template #footer>
            <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="closeApproveDialog" />
        </template>
    </Dialog>

    <Dialog v-model:visible="showCreateReplacementDialog" header="Submit Tyre For Replacement" :modal="true" :closable="!loadingAction" class="p-fluid" :style="{ width: '40rem' }">
        <!-- Show success results if replacement was submitted -->
        <!-- <div v-if="replacementSubmitted && replacementResult" class="mb-4 p-3 bg-green-50 border border-green-200 rounded">
            <h4 class="font-bold text-green-800">Replacement Approved Successfully!</h4>
            <p class="text-sm text-green-700">SAP SO: {{ replacementResult.sap_sono }}</p>
            <p class="text-sm text-green-700">SAP DO: {{ replacementResult.sap_dono }}</p>
        </div> -->

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

    <Dialog v-model:visible="showCreateReimbursementDialog" header="Select Tyre For Reimbursement" :modal="true" :closable="!loadingAction" class="p-fluid" :style="{ width: '40rem' }">
        <!-- Show success results if replacement was submitted -->

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
            <Button label="Cancel" icon="pi pi-times" class="p-button-text" :disabled="loadingAction" @click="closeReimbursementDialog" />
            <Button label="Create" icon="pi pi-check" class="p-button-primary" :loading="loadingAction" @click="submitReimbursement" />
        </template>
    </Dialog>

    <Dialog v-model:visible="showRejectDialog" header="Reject Warranty Claim" :modal="true" class="p-fluid" :style="{ width: '40rem' }">
        <div class="field">
            <label class="block font-bold text-gray-700 mb-1">Select Rejection Reason *</label>
            <Dropdown v-model="selectedRejectReason" :options="rejectReasonsTypeB"filter filterBy="damageMode,code,grouping" optionLabel="damageMode" optionValue="id" placeholder="Select rejection reason" class="w-full mb-4" :class="{ 'p-invalid': !selectedRejectReason && rejecting }">
                <template #option="slotProps">
                    <div class="flex flex-col gap-1 py-2">
                        <div class="font-semibold text-gray-800">{{ slotProps.option.damageMode }}</div>
                        <div class="text-sm text-gray-600"><span class="font-medium">Code:</span> {{ slotProps.option.code }} | <span class="font-medium">Part:</span> {{ slotProps.option.part }}</div>
                        <div class="text-xs text-gray-500">{{ slotProps.option.grouping }}</div>
                    </div>
                </template>
            </Dropdown>
            <small v-if="!selectedRejectReason && rejecting" class="text-red-600">Please select a rejection reason.</small>
        </div>

        <template #footer>
            <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="closeRejectDialog" :disabled="rejecting" />
            <Button label="Reject Claim" icon="pi pi-times-circle" class="p-button-danger" @click="confirmRejectWarranty" :loading="rejecting" :disabled="!selectedRejectReason || rejecting" />
        </template>
    </Dialog>

      <!-- Image Modal -->
    <Dialog v-model:visible="imageDialogVisible" :modal="true" :style="{ width: '90vw', maxWidth: '1200px' }" @hide="closeImageModal">
        <template #header>
            <div class="font-semibold text-lg">{{ activeImageType }} - Image Preview</div>
        </template>
        <div class="flex justify-center">
            <img :src="activeImage" alt="Preview" class="max-w-full max-h-96 object-contain" />
        </div>
        <template #footer>
            <div class="flex justify-between items-center w-full">
                <Button label="Close" icon="pi pi-times" @click="closeImageModal" class="p-button-text" />
            </div>
        </template>
    </Dialog>
</template>

<script setup>
import LoadingPage from '@/components/LoadingPage.vue';
import api from '@/service/api';
import { useToast } from 'primevue/usetoast';
import { computed, onMounted, ref, watch, reactive } from 'vue';
import { useRoute } from 'vue-router';
import { useConfirm } from 'primevue';
import { useMenuStore } from '@/store/menu';

const menuStore = useMenuStore();
const canUpdate = computed(() => menuStore.canWrite('Warranty Claim'));
const denyAccess = computed(() => menuStore.canTest('Warranty Claim'));

const route = useRoute();
const toast = useToast();

// Reactive data
const ctcdate = ref(new Date());
const showCreateCTCDialog = ref(false);
const showCreateReimbursementDialog = ref(false);
const showCreateReplacementDialog = ref(false);
const showApproveDialog = ref(false);
const loadingAction = ref(false);
const warantyDetail = ref({});
// const warantyDetailChecking = ref({});
const loading = ref(true);
const error = ref(null);
const saving = ref(false);
const showCTCConfirmationDialog = ref(false);
const loadingScrapAction = ref(false);
const stockCheckResult = ref(null);
const showCreateClaimDialog = ref(false);
const creatingClaim = ref(false);

const showEditTireDialog = ref(false);
const editTire = ref(false);
const editValidationTire = ref(false);

const editTireData = reactive({
    mfgcode: '',
    sizecode: '',
    tyrespec: '',
    weekcode: ''
});
const newClaimData = reactive({
    damageCode: '',
    problem: '',
    claimPercent: null,
    threadDepth: null,
    wornPercent: null
});
const selectedDamageType = ref(null);
const activeImage = ref(null);
const activeImageType = ref('');
const imageDialogVisible = ref(false);

// States
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
const submittedPhotos = ref([]);
const TireDepthImages = ref([]);
const listMaterial = ref([]);
const selectedMaterial = ref(null);

const listDamageType = [
  { id: "D1", name: "TREAD DAMAGE" },
  { id: "D2", name: "SIDEWALL DAMAGE" },
  { id: "D3", name: "INNER DAMAGE" },
  { id: "D4", name: "TYRE BURST / RUNFLAT" },
  { id: "D5", name: "SIDEWALL / TREAD LEAKING OR PUNCTURE" },
  { id: "D6", name: "VIBRATION / UNBALANCE" },
  { id: "D7", name: "UNEVEN WEAR (TYRE NOISE)" },
  { id: "D8", name: "BEAD DAMAGE" },
  { id: "D9", name: "DAMAGE DURING SHIPMENT (LOCAL)" },
];

const handleDamageSelect = () => {
    if (selectedDamageType.value) {
        newClaimData.damageCode = selectedDamageType.value.code;
        newClaimData.problem = selectedDamageType.value.damageMode;
    }
};

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
const rejectReasonsTypeB = ref([]);
const selectedRejectReason = ref(null);
const rejecting = ref(false);

// Loading states
const loadingCTC = ref(false);
const loadingScrap = ref(false);

// Computed properties
const hasCTCData = computed(() => {
    return warantyDetail.value.ctc_details;
});

const hasClaimDetails = computed(() => {
  const claim = warantyDetail.value.claim_detail;
  if (!claim) return false;

  return Object.entries(claim)
    .filter(([key]) => key !== 'threadDepthMeasurementEten') // ignore this field
    .some(([, value]) => value !== null);
});


/// Watch Claim % to auto-update Worn %
let updating = false;

watch(
  () => newClaimData.claimPercent,
  (val) => {
    if (updating) return;
    updating = true;
    newClaimData.claimPercent = Math.min(Math.max(Number(val) || 0, 0), 100);
    newClaimData.wornPercent = 100 - newClaimData.claimPercent;
    updating = false;
  }
);

// Watch Worn % to auto-update Claim %
watch(
  () => newClaimData.wornPercent,
  (val) => {
    if (updating) return;
    updating = true;
    newClaimData.wornPercent = Math.min(Math.max(Number(val) || 0, 0), 100);
    newClaimData.claimPercent = 100 - newClaimData.wornPercent;
    updating = false;
  }
);

// Open Create Claim Dialog
const openCreateClaimDialog = () => {
    showCreateClaimDialog.value = true;
    // Reset form data
    newClaimData.damageCode = '';
    newClaimData.problem = '';
    newClaimData.claimPercent = null;
    newClaimData.threadDepth = null;
    newClaimData.wornPercent = null;
    creatingClaim.value = false;
};

// Close Create Claim Dialog
const closeCreateClaimDialog = () => {
    showCreateClaimDialog.value = false;
    creatingClaim.value = false;
};

const openEditTier = () => {
    showEditTireDialog.value = true;
    // Reset form data
    editTireData.mfgcode = '';
    editTireData.sizecode = '';
    editTireData.tyrespec = '';
    editTireData.weekcode = '';
    editTire.value = false;
    editValidationTire.value = false;
};

const closeEditTire = () => {
    showEditTireDialog.value = false;
    editTire.value = false;
    editValidationTire.value = false;
};

// Computed properties for conditional checks
const hasSubmittedPhotos = computed(() => {
    return submittedPhotos.value.length > 0;
})

// Submit Claim Details
const submitEditTire = async () => {
    editValidationTire.value = true;
    // Validate required fields
    if (!editTireData.mfgcode || !editTireData.mfgcode || editTireData.tyrespec === null || editTireData.weekcode === null) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Validation Error.',
            life: 4000
        });
        return;
    }
    try {
        editTire.value = true;
        const plateSerialValue = `${editTireData.mfgcode}-${editTireData.sizecode}-${editTireData.tyrespec}-${editTireData.weekcode}`;
        const formData = new FormData();
        formData.append('plateSerial', plateSerialValue);
        
        const id = route.params.id;
        const response = await api.post(`warranty_claim/updatePlateSerial/${id}`,formData);

        if (response.data.status === 1) {
            toast.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Tire details updated successfully',
                life: 3000
            });
        } else {
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: response.data.message || 'Failed to Update Tire details',
                life: 3000
            });
        }
    } catch (error) {
        console.error('Error Update Tire details:', error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: error.response?.data?.message || 'Failed to Update Tire details',
            life: 3000
        });
    } finally {
        // Close dialog and refresh data
        closeEditTire();
        await fetchWarrantyClaim();
    }
};

// Submit Claim Details
const submitClaimDetails = async () => {
    // Validate required fields
    if (!newClaimData.damageCode || !newClaimData.problem || newClaimData.claimPercent === null || newClaimData.threadDepth === null || newClaimData.wornPercent === null) {
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
            problemCode: newClaimData.damageCode,
            problem: newClaimData.problem,
            claim_percent: newClaimData.claimPercent,
            threadDepth: newClaimData.threadDepth,
            worn_percent: newClaimData.wornPercent
        });

        if (response.data.status === 1) {
            toast.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Claim details created successfully',
                life: 3000
            });
        } else {
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: response.data.message || 'Failed to create claim details',
                life: 3000
            });
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
const requestScrap = async () => {
    loadingScrap.value = true;
    const id = route.params.id;
    try {
        const response = await api.put(`warranty_claim/requestScrap/${id}`);
        if (response.data.status === 1) {
            toast.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Scrapy request submitted successfully',
                life: 3000
            });
            fetchWarrantyClaim();
        } else {
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: response.data.message || 'Failed to create claim details',
                life: 3000
            });
        }
    } catch (error) {
        console.error('Error requesting scrap:', error);
    } finally {
        loadingScrap.value = false;
    }
};
// Fetch Material
const fetchMaterial = async () => {
    try {
        const id = route.params.id; // Use actual claim ID
        const response = await api.get(`warranty_claim/getClaimMaterial/${id}`);

        // console.log(response.data);
        if (response.data.status === 1) {
            listMaterial.value = response.data.admin_data;
        } else {
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: 'No Material Found',
                life: 3000
            });
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

const openImageModal = (imageSrc, imageType) => {
    activeImage.value = imageSrc;
    activeImageType.value = imageType;
    imageDialogVisible.value = true;
};

const closeImageModal = () => {
    activeImage.value = null;
    activeImageType.value = '';
    imageDialogVisible.value = false;
};
// CTC Methods
const confirmCTCRequest = async () => {
    loadingCTC.value = true;
    try {
        const id = route.params.id;
        const response = await api.put(`warranty_claim/requestCTC/${id}`);

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

const confirmCTCRequestReturn = async () => {
    loadingCTC.value = true;
    try {
        const id = route.params.id;
        const response = await api.put(`warranty_claim/requestReturn/${id}`);

        if (response.data.status === 1) {
            toast.add({
                severity: 'success',
                summary: 'Success',
                detail: 'CTC Return request submitted successfully',
                life: 3000
            });
            showCTCConfirmationDialog.value = false;
            await fetchWarrantyClaim(); // Refresh data to show CTC status
        } else {
            throw new Error('Return CTC request failed');
        }
    } catch (error) {
        console.error('Error requesting CTC:', error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to request Return CTC. Please try again.',
            life: 3000
        });
    } finally {
        loadingCTC.value = false;
    }
};

// Helper functions
const formatDateString = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-MY');
};
// Helper functions
const formatDateTime = (dateString) => {
    if (!dateString) return '-';
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

const confirmation = useConfirm();

const rejectScrap = () => {
  confirmation.require({
    message: 'Are you sure you want to reject this scrap request?',
    header: 'Reject Scrap',
    icon: 'pi pi-exclamation-triangle',
    acceptLabel: 'Yes',
    rejectLabel: 'No',
    accept: async () => {
      try {
        loadingScrapAction.value = true;

        const id = route.params.id;
        const response = await api.put(`warranty_claim/rejectScrap/${id}`);

        if (response.data.status === 1) {
          toast.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Scrap rejected successfully',
            life: 3000
          });

          await fetchWarrantyClaim();  
        } else {
          toast.add({
            severity: 'error',
            summary: 'Error',
            detail: response.data.error || 'Failed to reject scrap',
            life: 3000
          });
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
    }
  });
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
            // warantyDetailChecking.value = response.data.admin_data;
            // Prepare tire info parts
            const tireInfo = apiData.tire_info || null;
            let platePart1 = "-";
            let platePart2 = "-";
            let platePart3 = "-";
            let platePart4 = "-";
            let AdminplatePart1 = "-";
            let AdminplatePart2 = "-";
            let AdminplatePart3 = "-";
            let AdminplatePart4 = "-";

            if (tireInfo?.plateSerial) {
                if (tireInfo.plateSerial.includes('-')) {
                    const parts = tireInfo.plateSerial.split('-');
                    platePart1 = parts[0] || "-";
                    platePart2 = parts[1] || "-";
                    platePart3 = parts[2] || "-";
                    platePart4 = parts[3] || "-";
                }
            }
            if (tireInfo?.plateSerialAdmin) {
                if (tireInfo.plateSerialAdmin.includes('-')) {
                    const parts = tireInfo.plateSerialAdmin.split('-');
                    AdminplatePart1 = parts[0] || "-";
                    AdminplatePart2 = parts[1] || "-";
                    AdminplatePart3 = parts[2] || "-";
                    AdminplatePart4 = parts[3] || "-";
                }
            }
            warantyDetail.value = {
                // Claim Info
                id: apiData.claim_info?.id,
                claimRefNo: apiData.claim_info?.claimRefNo,
                status_string: apiData.claim_info?.status_string,
                isCTC: apiData.claim_info?.isCTC,
                isDeliveredReplacement: apiData.claim_info?.isDeliveredReplacement,
                isReimbursement: apiData.claim_info?.isReimbursement,
                isScrap: apiData.claim_info?.isScrap,
                rejectReason: apiData.claim_info?.rejectReason,
                isReturn: apiData.claim_info?.isReturn,
                status: apiData.claim_info?.status,
                claimDate: apiData.claim_info?.claimDate,
                warrantyCertNo: apiData.claim_info?.warrantyCertNo,
                isTWP : apiData.claim_info?.isTWP,
                claimTypeDisplay: apiData.claim_info?.isTWP == 1 ? 'TWP' : 'Technical Claim',

                // Customer Info
                customer_info: apiData.customer_info?.[0] || [],
                // Dealer Info
                dealer_details: apiData.dealer_info?.[0] || null,
                // Tire Info
                tire_info: {
                    ...tireInfo,
                    platePart1,
                    platePart2,
                    platePart3,
                    platePart4,
                    AdminplatePart1,
                    AdminplatePart2,
                    AdminplatePart3,
                    AdminplatePart4,
                },
                // Claim Detail
                // damageCode: apiData.claim_detail?.damageCode,
                // problem: apiData.claim_detail?.problem,
                claim_detail : apiData.claim_detail|| null,
                problemAdmin: apiData.claim_detail?.problemAdmin,
                approvedByClaim: apiData.claim_detail?.approvedBy,
                approvedOnClaim: apiData.claim_detail?.approvedOn,
                problemCodeAdmin: apiData.claim_detail?.problemCodeAdmin,
                claimPercent: apiData.claim_detail?.claimPercent,
                usablePercent: apiData.claim_detail?.usablePercent,
                threadDepthMeasurementAdmin: apiData.claim_detail?.threadDepthMeasurementAdmin,
                threadDepthMeasurementEten: apiData.claim_detail?.threadDepthMeasurementEten,
                wornPercent: apiData.claim_detail?.wornPercent,
                // CTC Info
                ctc_details: apiData.ctc_info?.[0] || [],
                return_info: apiData.return_info?.[0] || null,
                // reimbursement: Array.isArray(apiData.reimbursement) ? (apiData.reimbursement.length > 0 ? apiData.reimbursement : null): apiData.reimbursement || null,
                reimbursement: (() => {
                    const rm = apiData.reimbursement;

                    // Case 1: Array
                    if (Array.isArray(rm)) {
                        return rm.length > 0 ? rm : null;
                    }

                    // Case 2: Object
                    if (rm && typeof rm === 'object') {
                        // Check if object has any meaningful value
                        const meaningful = Object.values(rm).some(v => {
                            return v !== null && v !== '' && v !== '0.00' && v !== 0;
                        });

                        return meaningful ? rm : null;
                    }

                    // Case 3: Anything else
                    return null;
                })(),
                replacement_detail: apiData.replacement_detail ?? null,
                scrapPhotos: apiData.scrapPhotos || null,
                submittedphotos: apiData.submittedphotos || null,
                threadDepthPhotos: apiData.threadDepthPhotos || null,
                //waranty_info
                warranty_info: apiData.warranty_info || null,
            };
            // console.log(warantyDetail);
            await loadScrapImages();
            await loadTireDeptImages();
            await loadSubmittedPhotos();
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
            rejectReasonsTypeB.value = response.data.admin_data.filter(item => item.type === "B");
        }
    } catch (error) {
        console.error('Error fetching reject reasons:', error);
    }
};
// Load scrap images
const loadScrapImages = async () => {
    const images = [];
    const imageUrls = [warantyDetail.value.scrapPhotos.scrapImage1URL, warantyDetail.value.scrapPhotos.scrapImage2URL, warantyDetail.value.scrapPhotos.scrapImage3URL].filter((url) => url && url !== 'null' && url !== null);

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

const loadTireDeptImages = async () => {
    const photos = warantyDetail.value.threadDepthPhotos;
    const images = [];

    const imageUrls = [photos.threadDepthImage1URL, photos.threadDepthImage2URL, photos.threadDepthImage3URL, photos.threadDepthImage4URL, photos.threadDepthImage5URL, photos.threadDepthImage6URL].filter(
        (url) => url && url !== 'null' && url !== null
    );

    for (const [index, url] of imageUrls.entries()) {
        try {
            const imageSrc = await api.getPrivateFile(url);
            images.push({
                itemImageSrc: imageSrc,
                thumbnailImageSrc: imageSrc,
                alt: `Tire Depth ${index + 1}`
            });
        } catch (err) {
            console.error('Error loading tire depth image:', err);
            images.push({
                itemImageSrc: '/placeholder-image.jpg',
                thumbnailImageSrc: '/placeholder-image.jpg',
                alt: `Tire Depth ${index + 1} - Failed to load`
            });
        }
    }

    TireDepthImages.value = images;
};

const loadSubmittedPhotos = async () => {
    const photos = [];
    const photoTypes = [
        { key: 'mileageFileURL', label: 'Mileage' },
        { key: 'serialNoFileURL', label: 'Serial Number' },
        { key: 'tireSizeFileURL', label: 'Tire Size' },
        { key: 'defectAreaFileURL', label: 'Defect Area' }
    ];

    for (const photoType of photoTypes) {
        const url = warantyDetail.value.submittedphotos[photoType.key];
        if (url && url !== 'null' && url !== null) {
            try {
                const imageSrc = await api.getPrivateFile(url);

                photos.push({
                    type: photoType.key,
                    label: photoType.label,
                    url: url,
                    imageSrc: imageSrc,
                    alt: `${photoType.label} Photo`
                });

            } catch (error) {
                console.error(`❌ Error loading ${photoType.label} photo:`, error);
                // Create fallback image
                photos.push({
                    type: photoType.key,
                    label: photoType.label,
                    url: url,
                    imageSrc: createFallbackImage(photoType.label),
                    alt: `${photoType.label} Photo - Failed to load`
                });
            }
        }
    }

    submittedPhotos.value = photos;
};


// Approve Invoice
const approveInvoice = async () => {
    confirmation.require({
    message: 'Are you sure you want to approve this invoice request?',
    header: 'Approve Invoice',
    icon: 'pi pi-exclamation-triangle',
    acceptLabel: 'Yes',
    rejectLabel: 'No',
    accept: async () => {
    try {
        approvingInvoice.value = true;
        const id = route.params.id;
        const response = await api.put(`warranty_claim/approveInvoice/${id}`);

        if (response.data.status === 1) {
            toast.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Invoice approved successfully',
                life: 3000
            });
            await fetchWarrantyClaim(); // Refresh data
        } else {
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: response.data.error || 'Failed to approve invoice',
                life: 3000
            });
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
    }
  });

};

// Reject Invoice
const rejectInvoice = async () => {
    confirmation.require({
    message: 'Are you sure you want to reject this invoice request?',
    header: 'Reject Invoice',
    icon: 'pi pi-exclamation-triangle',
    acceptLabel: 'Yes',
    rejectLabel: 'No',
    accept: async () => {
    try {
        rejectingInvoice.value = true;
        const response = await api.put(`warranty_claim/rejectReimbursement/${warantyDetail.value.id}`);
        if (response.data.status === 1) {
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
    }
  });
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

const Approve = () => {
    showApproveDialog.value = true;
};

const createReplacement = () => {
    showApproveDialog.value = false;
    showCreateReplacementDialog.value = true;
};

const createReimbursement = async () => {
    showApproveDialog.value = false;
    showCreateReimbursementDialog.value = true;
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

const closeReimbursementDialog = () => {
    showCreateReimbursementDialog.value = false;
    showApproveDialog.value = true;
};

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
    showApproveDialog.value = false;
    try {
        loadingAction.value = true;

        // 1. Call Replacement API
        const replacementResponse = await api.post('warranty_claim/approveReplacement', {
            claim_id: warantyDetail.value.id,
            materialid: selectedMaterial.value.materialid
        });

        if (replacementResponse.data.status === 1) {
            // 2. Automatically Request Scrap
            replacementResult.value = replacementResponse.data.admin_data;
            replacementSubmitted.value = true;

            toast.add({
                severity: 'success',
                summary: 'Success',
                detail: replacementResponse.data.message || 'Replacement approved',
                life: 3000
            });

            // Refresh claim data
            await fetchWarrantyClaim();
        } else {
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: replacementResponse.data.error || 'Failed to submit replacement ',
                life: 3000
            });
        }
    } catch (err) {
        console.error('Error submitting replacement:', err);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: err.response?.data?.message || 'Failed to submit replacement',
            life: 7000
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
            materialid: selectedMaterial.value.materialid
        });

        if (reimbursementResponse.data.status === 1) {
            // 2. Automatically Request Scrap

            reimbursementResult.value = reimbursementResponse.data.admin_data;
            reimbursementSubmitted.value = true;

            toast.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Reimbursement approved',
                life: 3000
            });

            // Refresh claim data
            await fetchWarrantyClaim();
        } else {
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: reimbursementResponse.data.error || 'Failed to submit reimbursement',
                life: 7000
            });
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
        showCreateReimbursementDialog.value = false;
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
        if (!blobUrl) {
            console.warn("Invalid blobUrl");
            return;
        }
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = filename;
        a.target = "_blank";
        document.body.appendChild(a);
        a.click();
        a.remove();

        setTimeout(() => URL.revokeObjectURL(blobUrl), 3000);
    } catch (error) {
        console.error('Failed to download file:', error);
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
        // 0: 'Pending',
        // 1: 'Eten Approved',
        // 2: 'Eten Rejected',
        3: 'Processing',
        4:' In Progress',
        5: 'Completed',
        6: 'Rejected'  
    };
    return statusMap[status] || 'Unknown';
};
function getStatusSeverity(status) {
    const severityMap = {
        3: 'info',
        4: 'primary',
        5: 'success',
        6: 'danger'

    };
    return severityMap[status] || 'secondary';
}
const fetchReport = async (id) => {
    try {
        loading.value = true;
        const response = await api.get(`warrantyReport/claim/${id}`);
        if (response.data.status === 1) {
            generateReport(response.data.admin_data);
        }else{
            toast.add({
            severity: 'error',
            summary: 'Failed',
            detail: response.data.message || 'Failed to fetch report',
            life: 3000
        });
        }
    } catch (error) {
        console.error('Error fetching report:', error);
    } finally {
        loading.value = false;
    }
}

const generateReport = (report) => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
        <head>
            <title>Warranty Claim Form</title>
            <style>
                body { 
                    font-family: Arial, 
                    sans-serif; font-size: 13px; 
                    padding: 20px; color: #000; 
                }

                .top-header {                     
                    font-size: 32px;
                    font-weight: 900;
                    color: #d69c00;
                    margin-bottom: 5px; 
                }
                .company-info { 
                    font-size: 14px;
                    margin-top: 5px;
                    margin-bottom: 5px;
                    font-weight:bold;
                }
                .sub-company-info { 
                    font-size: 10px;
                    margin-top: 5px;
                    margin-bottom: 5px;
                }

                table { 
                    width: 100%;
                    border-collapse: collapse; 
                    font-size: 12px; 
                }
                th, td { 
                    border: 1px solid #000; 
                    padding: 6px; 
                }
                .small-table td { 
                    padding: 4px;
                }
                .small-table td table td {
                    padding: 2px;
                }
                .item-table td { 
                 text-align: center;
                }
                .section-title { 
                    margin-top: 20px; 
                    font-weight: bold; 
                }
                .note-wrapper {
                    padding-top: 20px; 
                }
                .note-box {
                    page-break-inside: avoid;
                    break-inside: avoid;
                    border: 1px solid #000;
                    padding: 10px;
                    font-size: 12px;
                    text-align: justify;
                    line-height: 1.4;
                }
                .signature-section {
                    page-break-inside: avoid;
                    break-inside: avoid;
                    // margin-top: 20px;
                    display: flex;
                    padding-top: 20px;
                    justify-content: space-between;
                }
                .signature-box {
                    page-break-inside: avoid;
                    break-inside: avoid;
                    height: 180px;
                    width: 30%;
                    border: 1px solid #000;
                    padding: 10px;
                    font-size: 12px;
                    display: flex;
                    flex-direction: column;   /* stack items vertically */
                }
                .signature-line {
                    margin-top: auto;         /* pushes signature to bottom */
                    border-top: 1px solid #000;
                    width: 100%;
                    padding-top: 5px;
                    text-align: center;
                }
            </style>
        </head>
        <body>

            <div class="top-header">TOYO TIRES</div>
            <div class="company-info">
                Toyo Tyre Sales And Marketing Malaysia Sdn Bhd<br>
            </div>
            <hr style="border-width: 3px ;color: black;">
            <div class="sub-company-info">
                Level 2, Wisma Comcor, No.37, Jalan Pulas UH6, Section U1, Temasya Industrial Park, 40150 Shah Alam, Selangor Darul Ehsan, Malaysia
            </div>
            <div class="sub-company-info">
                Tel: +603-5569 3788 &nbsp; | &nbsp; Fax: +603-5569 3809
            </div>

            <table class="small-table">
                <tr>
                    <td><strong>CUSTOMER :</strong> ${report.customer.custAccountNo}</td>
                    <td><strong>BRANCH :</strong> ${report.branch.phoneNo}</td>
                    <td><strong>WARRANTY CLAIM FORM</strong></td>
                </tr>
                <tr>
                    <td>
                        <strong>PAY TO :</strong><br>
                        ${report.customer.companyName}<br>
                        ${[
                            report.customer.companyAddress1,
                            report.customer.companyAddress2,
                            report.customer.companyAddress3,
                            report.customer.companyAddress4
                        ].filter(x => x && x.trim() !== "").join("<br>")}<br>
                        ${report.customer.phoneNo}<br>

                    </td>

                    <td>
                        <strong>SHIP TO :</strong><br>
                        ${report.branch.companyName}<br>
                        ${[
                            report.branch.companyAddress1,
                            report.branch.companyAddress2,
                            report.branch.companyAddress3,
                            report.branch.companyAddress4
                        ].filter(x => x && x.trim() !== "").join("<br>")}<br>
                        ${report.branch.phoneNo}<br>
                    </td>

                    <td>
                        <table style="border:0;">
                            <tr>
                                <td style="border:0;width: 100px;">WCF NO</td>
                                <td style="border:0; width:10px;">:</td>
                                <td style="border:0;">${report.claim_ref_no}</td>
                            </tr>
                            <tr>
                                <td style="border:0;">CLAIM STATUS</td>
                                <td style="border:0;">:</td>
                                <td style="border:0;">COMPLETED</td>
                            </tr>
                            <tr>
                                <td style="border:0;">CLAIM DATE</td>
                                <td style="border:0;">:</td>
                                <td style="border:0;">${report.claim_date}</td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>

            <br>

            <table class="item-table">
                <tr>
                    <th>No</th>
                    <th>Material Code</th>
                    <th>Material Description</th>
                    <th>Warranty Code</th>
                    <th>Worn %</th>
                    <th>Claim %</th>
                    <th>Claim Qty</th>
                    <th>Serial No</th>
                    <th>Reject Reason</th>
                    <th>Remarks</th>
                </tr>

                <tr>
                    <td>1</td>
                    <td>${report.material?.materialid || '-'}</td>
                    <td>${report.material?.materialDesc || '-'}</td>
                    <td>${report.warranty_code || '-'}</td>
                    <td>${report.worn_percent || '-'}</td>
                    <td>${report.claim_percent || '-'}</td>
                    <td>${report.claim_qty || '-'}</td>
                    <td>${report.serial_no || '-'}</td>
                    <td>${report.reject_reason || '-'}</td>
                    <td>${report.remarks || ''}</td>
                </tr>
            </table>
            <div class="note-wrapper">
                <div class="note-box">
                    <strong>NOTE</strong><br>
                    WE HAVE EXAMINED THE ABOVE ITEMS AND THE ABOVE CONCESSIONS HAS/HAVE BEEN GRANTED.
                    CHEQUE WILL BE SENT TO YOU IN DUE COURSE. N.A. MEANS “NO ALLOWANCE”, BECAUSE TYRE/TUBE IS EITHER OVERAGE,
                    ACCIDENTALLY DAMAGED OR DEEMED NON-DEFECTIVE. IN SUCH INSTANCE, THESE TYRES/TUBES ARE RETURNED TO YOU.
                    WHEN AN ALLOWANCE IS GRANTED, THESE TYRES/TUBES BECOME THE PROPERTY OF TOYO TYRE.
                </div>
            </div>

            <div class="signature-section">

                <div class="signature-box">
                    <strong>ADJUSTED BY</strong><br>
                    ${report.adjustor.role}<br><br>
                    <div>NAME : ${report.adjustor.fullName}</div><br>
                    <div>DATE :${report.adjustor.approve_on}</div><br>
                    <div class="signature-line">Signature</div>
                </div>

                <div class="signature-box">
                    <strong>APPROVED BY</strong><br>
                    ${report.approver.role}<br><br>
                    <div>NAME :  ${report.approver.fullName}</div><br>
                    <div>DATE : ${report.approver.approve_on}</div><br>
                    <div class="signature-line">Signature</div>
                </div>
                            
                <div class="signature-box">
                    <strong>DEALER RECEIVED BY</strong><br>
                    NAME : <br>
                    <div class="signature-line">Signature</div>
                </div>

            </div>

        </body>
        </html>
    `);

    printWindow.document.close();

    printWindow.onload = () => {
        printWindow.print();
        printWindow.close();
    };
};
// Lifecycle
onMounted(() => {
    fetchWarrantyClaim();
    fetchMaterial();
    fetchRejectReasons();
});
</script>
