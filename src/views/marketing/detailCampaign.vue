<template>
    <Fluid>
        <div class="flex flex-col md:flex-row gap-8">
            <!-- LEFT SIDE (2/3) -->
            <div class="md:w-2/3 flex flex-col">
                <!-- Detail Event -->
                <div class="card flex flex-col w-full">
                    <div class="flex items-center justify-between border-b pb-2">
                        <div class="flex items-center gap-3">
                            <RouterLink to="/marketing/listCampaign">
                                <Button icon="pi pi-arrow-left" class="p-button-text p-button-secondary text-xl" size="big" v-tooltip="'Back'" />
                            </RouterLink>
                            <div class="text-2xl font-bold text-gray-800">Campaign Details</div>
                        </div>
                        <div class="inline-flex items-center gap-2">
                            <!-- Edit Event -->
                            <RouterLink :to="`/marketing/editCampaign/${campaignId}`">
                                <Button label="Edit" class="p-button-info" size="small" />
                            </RouterLink>

                            <!-- Delete Event -->
                            <Button label="Delete" class="p-button-danger" size="small" @click="confirmDelete" />
                        </div>
                    </div>

                    <!-- Loading State -->
                    <div v-if="loading" class="flex justify-center items-center py-8">
                        <ProgressSpinner />
                    </div>

                    <!-- Campaign Content -->
                    <div v-else>
                        <!-- Event Images -->
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                            <img v-if="campaign.image1Path" :src="campaign.image1Path" alt="Event Image 1" class="rounded-xl shadow-sm object-cover w-full h-80" />
                            <img v-if="campaign.image2Path" :src="campaign.image2Path" alt="Event Image 2" class="rounded-xl shadow-sm object-cover w-full h-80" />
                            <img v-if="campaign.image3Path" :src="campaign.image3Path" alt="Event Image 3" class="rounded-xl shadow-sm object-cover w-full h-80" />
                        </div>

                        <!-- Event Info -->
                        <div class="mt-6">
                            <h1 class="text-2xl font-bold text-gray-800">{{ campaign.title }}</h1>
                            <p class="text-lg font-medium">{{ campaign.description }}</p>

                            <div class="flex flex-col md:flex-row gap-4 mt-3">
                                <div class="w-full">
                                    <span class="block text-xm font-bold text-black-700">Term Condition</span>
                                    <p class="text-lg font-medium whitespace-pre-line">{{ campaign.termCondition }}</p>
                                </div>
                            </div>

                            <div class="flex flex-col md:flex-row gap-4 mt-3">
                                <div class="w-full">
                                    <span class="block text-xm font-bold text-black-700">Start Date</span>
                                    <p class="text-lg font-medium">{{ campaign.startDate }}</p>
                                </div>
                                <div class="w-full">
                                    <span class="block text-xm font-bold text-black-700">End Date</span>
                                    <p class="text-lg font-medium">{{ campaign.endDate }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="card flex flex-col w-full relative">
                    <div class="flex items-center justify-between border-b pb-2 mb-2">
                        <div class="text-2xl font-bold text-gray-800">🎁 Prize Info</div>
                    </div>

                    <DataTable :value="listPrize" :paginator="true" :rows="7" dataKey="id" :rowHover="true" responsiveLayout="scroll" class="text-sm" :loading="tableLoading">
                        <template #empty>
                            <div class="text-center py-8 text-gray-500">No prizes found for this campaign.</div>
                        </template>
                        
                        <!-- Prize Column -->
                        <Column header="Prize" style="min-width: 10rem">
                            <template #body="{ data }">
                                <div class="flex items-center gap-3 relative group" @mouseenter="hoverPrize = data.id" @mouseleave="hoverPrize = null">
                                    <img 
                                        :src="data.imageURL" 
                                        alt="Prize" 
                                        class="w-36 h-24 rounded-lg object-cover border" 
                                    />
                                    <div class="flex flex-col">
                                        <span class="font-bold text-gray-800">{{ data.prizeName }}</span>
                                        <span class="text-gray-600 text-xs">{{ data.prizeType }}</span>
                                    </div>

                                    <!-- Tooltip for Point Type -->
                                    <div v-if="data.prizeType === 'Point' && hoverPrize === data.id" class="absolute top-0 left-20 bg-white border rounded-lg shadow-lg p-3 text-xm w-60 z-10">
                                        <div class="font-semibold text-xl text-gray-700 mb-2">🏅 Point Reward</div>
                                        <ul class="list-disc list-inside text-gray-700 space-y-1 ml-5">
                                            <li><b>Silver :</b> {{ campaign.point1 }} pts</li>
                                            <li><b>Gold :</b> {{ campaign.point2 }} pts</li>
                                            <li><b>Platinum :</b> {{ campaign.point3 }} pts</li>
                                        </ul>
                                    </div>
                                </div>
                            </template>
                        </Column>

                        <!-- Win / Qty Column -->
                        <Column header="Win / Qty" style="min-width: 8rem">
                            <template #body="{ data }">
                                <div>{{ data.prizeRemain }} / {{ data.prizeQuota }}</div>
                            </template>
                        </Column>

                        <!-- Action Column -->
                        <Column header="Action" style="min-width: 6rem">
                            <template #body="{ data }">
                                <Button icon="pi pi-pencil" class="p-button-text p-button-info" @click="openEditDialog(data)" />
                            </template>
                        </Column>
                    </DataTable>
                </div>
            </div>

            <!-- RIGHT SIDE (1/3) -->
            <div class="md:w-1/3 flex flex-col">
                <!-- Advance Info -->
                <div class="card flex flex-col w-full">
                    <div class="flex items-center justify-between border-b pb-2 mb-2">
                        <div class="text-2xl font-bold text-gray-800">ℹ️ Advance Info</div>
                        <Tag :value="campaign.status === 1 ? 'Active' : 'Inactive'" :severity="campaign.status === 1 ? 'success' : 'danger'" />
                    </div>

                    <div class="overflow-x-auto">
                        <table class="w-full text-sm text-left text-gray-700">
                            <tbody>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Campaign No</td>
                                    <td class="px-4 py-2 text-right font-bold">{{ campaign.campaignNo }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Gamification</td>
                                    <td class="px-4 py-2 text-right font-bold" :class="campaign.isGamification ? 'text-green-500' : 'text-red-500'">
                                        {{ campaign.isGamification ? 'ON' : 'OFF' }}
                                    </td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Max Per User</td>
                                    <td class="px-4 py-2 text-right">{{ campaign.maxPerUser }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Point Silver</td>
                                    <td class="px-4 py-2 text-right">{{ campaign.point1 }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Point Gold</td>
                                    <td class="px-4 py-2 text-right">{{ campaign.point2 }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Point Platinum</td>
                                    <td class="px-4 py-2 text-right">{{ campaign.point3 }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Quota</td>
                                    <td class="px-4 py-2 text-right">{{ campaign.quota }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Published</td>
                                    <td class="px-4 py-2 text-right">{{ campaign.publishDate }}</td>
                                </tr>
                                <tr>
                                    <td class="px-4 py-2 font-medium"></td>
                                    <td class="py-4 text-right">
                                        <div class="flex justify-end">
                                           <ToggleButton v-model="campaignStatus" @change="toggleCampaignStatus" onLabel="Inactive" offLabel="Active" onIcon="pi pi-times" offIcon="pi pi-check" class="w-30" />
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- <div class="card flex flex-col w-full">
                    <div class="flex items-center justify-between border-b pb-3 mb-4">
                        <div class="text-2xl font-bold text-gray-800">👨🏻‍💻 Participant List</div>
                        <Button icon="pi pi-file-export" label="Export" style="width: fit-content" class="p-button-danger p-button-sm" />
                    </div>
                    <DataTable :value="participants" :paginator="true" :rows="5" dataKey="id" :rowHover="true" responsiveLayout="scroll" class="text-sm">
                        <template #empty>
                            <div class="text-center py-8 text-gray-500">No participants found.</div>
                        </template> -->
                        
                        <!-- User Column -->
                        <!-- <Column header="User" style="min-width: 6rem">
                            <template #body="{ data }">
                                <div class="flex flex-col">
                                    <RouterLink to="/marketing/detailParticipant" class="hover:underline">
                                        <span class="font-bold text-gray-800">{{ data.fullName }}</span>
                                    </RouterLink>
                                    <span class="text-gray-600 text-xs mt-2">🎖️ {{ data.memberLevel }}</span>
                                    <span class="text-gray-600 text-xs mt-2">📅 {{ data.date }}</span>
                                </div>
                            </template>
                        </Column> -->

                        <!-- Prize Type -->
                        <!-- <Column field="prizeName" header="Prize" style="min-width: 8rem"></Column> -->

                        <!-- Action Approve & Reject -->
                        <!-- <Column header="Action" style="min-width: 8rem">
                            <template #body="{ data }">
                                <div class="flex gap-2 items-center"> -->
                                    <!-- Approve Button -->
                                    <!-- <Button v-if="!data.status" icon="pi pi-check" size="small" class="p-button-success p-button-sm" @click="approveParticipant(data)" /> -->

                                    <!-- Reject Button -->
                                    <!-- <Button v-if="!data.status" icon="pi pi-times" size="small" class="p-button-danger p-button-sm" @click="rejectParticipant(data)" /> -->

                                    <!-- Status Tag -->
                                    <!-- <Tag v-if="data.status" :value="data.status" :severity="data.status === 'Approved' ? 'success' : data.status === 'Rejected' ? 'danger' : 'info'" class="ml-2" />
                                </div>
                            </template>
                        </Column> -->
                    <!-- </DataTable>
                </div> -->

                <div class="card flex flex-col w-full">
                    <!-- Header with Invite Button -->
                    <div class="flex items-center justify-between border-b pb-2 mb-2">
                        <div class="text-2xl font-bold text-gray-800">🚩 Dealer list</div>
                        <Button 
                            label="Invite Dealer" 
                            icon="pi pi-user-plus" 
                            style="width: fit-content" 
                            class="p-button-sm p-button-success" 
                            @click="openInviteDealerDialog"
                        />
                    </div>

                    <DataTable :value="dealerList" :paginator="true" :rows="3" dataKey="id" :rowHover="true" responsiveLayout="scroll" class="text-sm">
                        <template #empty>
                            <div class="text-center py-8 text-gray-500">No dealers invited yet.</div>
                        </template>
                        
                        <!-- Title + ID -->
                        <Column header="Name" style="min-width: 8rem">
                            <template #body="{ data }">
                                <div class="flex flex-col">
                                    <span class="font-bold text-gray-800">{{ data.companyName }}</span>
                                    <span class="text-gray-600 text-xm mt-2">🔧 {{ data.memberCode || data.custAccountNo }}</span>
                                </div>
                            </template>
                        </Column>

                        <!-- State -->
                        <Column header="State" style="min-width: 6rem">
                            <template #body="{ data }">
                                <span class="text-gray-800">{{ data.state }}</span>
                            </template>
                        </Column>

                        <!-- Signboard Type -->
                        <Column field="signboardType" header="Signboard Type" style="min-width: 6rem"></Column>

                        <!-- Actions -->
                        <!-- <Column header="Actions" style="min-width: 4rem; text-align: center">
                            <template #body="{ data }">
                                <Button icon="pi pi-trash" class="p-button-text p-button-danger" @click="removeDealer(data)" />
                            </template>
                        </Column> -->
                    </DataTable>
                </div>

                <div class="card flex flex-col w-full">
                    <div class="flex items-center justify-between border-b pb-2 mb-2">
                        <div class="text-2xl font-bold text-gray-800">🚩 Criteria</div>
                    </div>

                    <DataTable :value="criteria" :paginator="true" :rows="3" dataKey="id" :rowHover="true" responsiveLayout="scroll" class="text-sm">
                        <template #empty>
                            <div class="text-center py-8 text-gray-500">No criteria set for this campaign.</div>
                        </template>
                        
                        <!-- Title + Type in one column -->
                        <Column header="Name" style="min-width: 8rem">
                            <template #body="{ data }">
                                <div class="flex flex-col">
                                    <span class="font-bold text-gray-800">{{ data.title }}</span>
                                    <span class="text-gray-600 text-xm mt-2">🔧 {{ data.type }}</span>
                                </div>
                            </template>
                        </Column>

                        <!-- Pattern -->
                        <Column field="pattern" header="Pattern" style="min-width: 6rem"></Column>

                        <Column field="size" header="Size" style="min-width: 6rem"></Column>
                    </DataTable>
                </div>
            </div>
        </div>

        <!-- Edit Prize Dialog -->
        <Dialog v-model:visible="editDialogVisible" modal header="Edit Prize Quantity" :style="{ width: '400px' }">
            <div class="flex flex-col gap-3">
                <div class="font-semibold text-gray-800">{{ selectedPrize?.prizeName }}</div>
                <div class="flex items-center gap-3">
                    <label class="text-gray-700 font-medium w-20">Quota:</label>
                    <InputNumber v-model="selectedPrize.prizeQuota" :min="1" class="w-full" />
                </div>
                <div class="flex justify-end mt-4">
                    <Button label="Save" icon="pi pi-check" class="p-button-success p-button-sm" @click="savePrizeEdit" />
                </div>
            </div>
        </Dialog>

        <!-- Invite Dealer Dialog -->
        <Dialog v-model:visible="inviteDealerDialogVisible" modal header="Invite Dealers" :style="{ width: '500px' }">
            <div class="flex flex-col gap-4">
                <div class="text-gray-700">
                    Select dealers to invite to this campaign. Note: Previously invited dealers will also need to be included.
                </div>
                
                <!-- Dealer Selection -->
                <div class="flex flex-col gap-2">
                    <label class="font-medium text-gray-700">Available Dealers:</label>
                    <div class="max-h-60 overflow-y-auto border rounded p-2">
                        <div v-for="dealer in availableDealers" :key="dealer.id" class="flex items-center gap-3 p-2 hover:bg-gray-50 rounded">
                            <Checkbox 
                                v-model="selectedDealers" 
                                :value="dealer.id" 
                                :inputId="`dealer-${dealer.id}`" 
                            />
                            <label :for="`dealer-${dealer.id}`" class="cursor-pointer flex-1">
                                <div class="font-medium">{{ dealer.companyName }}</div>
                                <div class="text-sm text-gray-500">{{ dealer.memberCode || dealer.custAccountNo }}</div>
                            </label>
                        </div>
                    </div>
                </div>

                <div class="flex justify-between items-center mt-4">
                    <div class="text-sm text-gray-600">
                        Selected: {{ selectedDealers.length }} dealers
                    </div>
                    <div class="flex gap-2">
                        <Button label="Cancel" class="p-button-text" @click="closeInviteDealerDialog" />
                        <Button 
                            label="Invite" 
                            icon="pi pi-user-plus" 
                            class="p-button-success" 
                            @click="inviteDealers" 
                            :loading="inviteLoading"
                            :disabled="selectedDealers.length === 0"
                        />
                    </div>
                </div>
            </div>
        </Dialog>
    </Fluid>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';
import api from '@/service/api';

const route = useRoute();
const router = useRouter();
const toast = useToast();
const confirm = useConfirm();

const campaignId = route.params.id;
const loading = ref(true);
const tableLoading = ref(false);
const inviteLoading = ref(false);

// Reactive data
const hoverPrize = ref(null);
const editDialogVisible = ref(false);
const selectedPrize = ref(null);
const inviteDealerDialogVisible = ref(false);
const selectedDealers = ref([]);
const availableDealers = ref([]);

// Main data structures
const campaign = ref({
    id: 0,
    campaignNo: '',
    isGamification: 0,
    title: '',
    description: '',
    image1Path: '',
    image2Path: null,
    image3Path: null,
    termCondition: '',
    publishDate: '',
    startDate: '',
    endDate: '',
    quota: 0,
    maxPerUser: 1,
    point1: 0,
    point2: 0,
    point3: 0,
    status: 0
});

const participants = ref([]);
const criteria = ref([]);
const dealerList = ref([]);
const listPrize = ref([]);

// Computed property for toggle button
const campaignStatus = computed({
    get: () => campaign.value.status === 1,
    set: (newValue) => {
        // This will be handled by the API call
    }
});

// Toggle campaign status
const toggleCampaignStatus = async () => {
    try {
        const response = await api.put(`campaign/toggleInactive/${campaignId}`);

        if (response.data.status === 1) {
            // Update local campaign status
            campaign.value.status = campaign.value.status === 1 ? 0 : 1;

            toast.add({
                severity: 'success',
                summary: 'Success',
                detail: `Campaign ${campaign.value.status === 1 ? 'activated' : 'deactivated'} successfully`,
                life: 3000
            });
        } else {
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to update campaign status',
                life: 3000
            });
        }
    } catch (error) {
        console.error('Error updating campaign status:', error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to update campaign status',
            life: 3000
        });
    }
};

// Invite Dealer Functions
const openInviteDealerDialog = async () => {
    try {
        // Load available dealers (you might need to fetch this from an API)
        await loadAvailableDealers();
        
        // Pre-select already invited dealers
        selectedDealers.value = dealerList.value.map(dealer => dealer.id);
        
        inviteDealerDialogVisible.value = true;
    } catch (error) {
        console.error('Error opening invite dealer dialog:', error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load dealer data',
            life: 3000
        });
    }
};

const closeInviteDealerDialog = () => {
    inviteDealerDialogVisible.value = false;
    selectedDealers.value = [];
};

const loadAvailableDealers = async () => {
    // This should be replaced with your actual API call to get available dealers
    // For now, using mock data
    availableDealers.value = [
        { id: 1, companyName: 'Dealer One', memberCode: 'DLR001', custAccountNo: 'ACC001' },
        { id: 2, companyName: 'Dealer Two', memberCode: 'DLR002', custAccountNo: 'ACC002' },
        { id: 7, companyName: 'SINWUFU ENTERPRISE SDN. BHD.', memberCode: null, custAccountNo: '6080100900' },
        { id: 11, companyName: 'MATANG SDN BHD', memberCode: null, custAccountNo: '6027002600' },
        { id: 3, companyName: 'Dealer Three', memberCode: 'DLR003', custAccountNo: 'ACC003' },
        { id: 4, companyName: 'Dealer Four', memberCode: 'DLR004', custAccountNo: 'ACC004' },
    ];
};

const inviteDealers = async () => {
    try {
        inviteLoading.value = true;

        const formData = new FormData();
        formData.append('dealer_list', JSON.stringify(selectedDealers.value));

        const response = await api.post(`campaign/inviteDealer/${campaignId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        if (response.data.status === 1) {
            toast.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Dealers invited successfully',
                life: 3000
            });
            
            // Refresh the dealer list
            await fetchCampaignDetails();
            closeInviteDealerDialog();
        } else {
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to invite dealers',
                life: 3000
            });
        }
    } catch (error) {
        console.error('Error inviting dealers:', error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to invite dealers',
            life: 3000
        });
    } finally {
        inviteLoading.value = false;
    }
};

// Confirm before delete
const confirmDelete = () => {
    confirm.require({
        message: 'Are you sure you want to delete this campaign?',
        header: 'Confirm Delete',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Yes, Delete',
        rejectLabel: 'Cancel',
        acceptClass: 'p-button-danger',
        accept: async () => {
            try {
                // Replace with your actual delete API endpoint
                const response = await api.put(`campaign/delete/${campaign.value.id}`);
                
                if (response.data.status === 1) {
                    toast.add({
                        severity: 'success',
                        summary: 'Deleted',
                        detail: 'Campaign deleted successfully.',
                        life: 3000
                    });
                    router.push('/marketing/listCampaign');
                } else {
                    toast.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Failed to delete campaign.',
                        life: 3000
                    });
                }
            } catch (error) {
                console.error('Delete failed:', error);
                toast.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to delete campaign.',
                    life: 3000
                });
            }
        },
        reject: () => {
            toast.add({
                severity: 'info',
                summary: 'Cancelled',
                detail: 'Deletion cancelled.',
                life: 2000
            });
        }
    });
};

// API Functions
const fetchCampaignDetails = async () => {
    try {
        loading.value = true;
        tableLoading.value = true;

        const response = await api.get(`campaign/details/${campaignId}`);

        if (response.data.status === 1 && response.data.admin_data) {
            const data = response.data.admin_data;
            
            // Set campaign details
            if (data.campaign_details) {
                campaign.value = {
                    ...campaign.value,
                    ...data.campaign_details
                };

                // Process private images for campaign photos
                await processCampaignImages();
            }

            // Set criteria
            if (Array.isArray(data.criteria)) {
                criteria.value = data.criteria.map(item => ({
                    ...item,
                    type: 'Tire' // Default type as per your structure
                }));
            }

            // Set dealer list
            if (Array.isArray(data.participate_dealer)) {
                dealerList.value = data.participate_dealer.map(dealer => ({
                    id: dealer.id,
                    companyName: dealer.companyName,
                    memberCode: dealer.memberCode,
                    custAccountNo: dealer.custAccountNo,
                    state: 'Unknown', // You might need to get this from another API
                    signboardType: 'N/A' // Default value
                }));
            }

            // Set prize list from reward_option
            if (Array.isArray(data.reward_option)) {
                listPrize.value = data.reward_option.map(reward => {
                    const catalog = reward.catalog;
                    return {
                        id: reward.id,
                        prizeType: mapPrizeType(catalog.type),
                        imageURL: catalog.imageURL,
                        prizeName: catalog.title,
                        prizeQuota: reward.total_qty,
                        prizeRemain: reward.total_qty - reward.won_qty,
                        catalogData: catalog
                    };
                });

                // Process private images for prize photos
                await processPrizeImages();
            }

        } else {
            console.error('API returned error or invalid data:', response.data);
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to load campaign details',
                life: 3000
            });
        }
    } catch (error) {
        console.error('Error fetching campaign details:', error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load campaign details',
            life: 3000
        });
    } finally {
        loading.value = false;
        tableLoading.value = false;
    }
};

// Process private images for campaign photos
const processCampaignImages = async () => {
    const imageFields = ['image1Path', 'image2Path', 'image3Path'];

    for (const field of imageFields) {
        if (campaign.value[field] && typeof campaign.value[field] === 'string') {
            try {
                const blobUrl = await api.getPrivateFile(campaign.value[field]);
                if (blobUrl) {
                    campaign.value[field] = blobUrl;
                }
            } catch (error) {
                console.error(`Error loading campaign image ${field}:`, error);
                // Keep the original URL if private file loading fails
            }
        }
    }
};

// Process private images for prize photos
const processPrizeImages = async () => {
    for (const prize of listPrize.value) {
        if (prize.imageURL && typeof prize.imageURL === 'string') {
            try {
                const blobUrl = await api.getPrivateFile(prize.imageURL);
                if (blobUrl) {
                    prize.imageURL = blobUrl;
                }
            } catch (error) {
                console.error(`Error loading prize image for ${prize.prizeName}:`, error);
                // Keep the original URL if private file loading fails
            }
        }
    }
};

// Helper functions
const mapPrizeType = (apiType) => {
    const typeMap = {
        'EWALLET': 'E-Wallet',
        'EVOUCHER': 'E-Voucher',
        'ITEM': 'Item',
        'POINT': 'Point'
    };
    return typeMap[apiType] || apiType;
};

// Existing functions (keep them as they are)
const removeDealer = (dealer) => {
    dealerList.value = dealerList.value.filter((d) => d.id !== dealer.id);
};

function openEditDialog(prize) {
    selectedPrize.value = { ...prize };
    editDialogVisible.value = true;
}

function savePrizeEdit() {
    const index = listPrize.value.findIndex((p) => p.id === selectedPrize.value.id);
    if (index !== -1) {
        listPrize.value[index].prizeQuota = selectedPrize.value.prizeQuota;
    }
    editDialogVisible.value = false;
}

function approveParticipant(participant) {
    const target = participants.value.find(p => p.id === participant.id);
    if (target) {
        target.status = 'Approved';
    }
}

function rejectParticipant(participant) {
    const target = participants.value.find(p => p.id === participant.id);
    if (target) {
        target.status = 'Rejected';
    }
}

// Lifecycle
onMounted(() => {
    fetchCampaignDetails();
});
</script>