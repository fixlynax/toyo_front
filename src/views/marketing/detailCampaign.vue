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
                                <Button icon="pi pi-arrow-left" class="p-button-text p-button-secondary text-xl" v-tooltip="'Back'" />
                            </RouterLink>
                            <div class="text-2xl font-bold text-gray-800">Campaign Management Details</div>
                        </div>
                        <div class="inline-flex items-center gap-2">
                            <!-- Edit Event -->
                            <RouterLink v-if="canUpdate" :to="`/marketing/editCampaign/${campaignId}`">
                                <Button label="Edit" class="p-button-info" size="small" />
                            </RouterLink>

                            <!-- Delete Event -->
                            <Button v-if="canUpdate" label="Delete" class="p-button-danger" size="small" @click="confirmDelete" />
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
                                    <p class="text-lg font-medium">{{ formatDate(campaign.startDate) }}</p>
                                </div>
                                <div class="w-full">
                                    <span class="block text-xm font-bold text-black-700">End Date</span>
                                    <p class="text-lg font-medium">{{ formatDate(campaign.endDate) }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="card flex flex-col w-full relative">
                    <div class="flex items-center justify-between border-b pb-2 mb-2">
                        <div class="text-2xl font-bold text-gray-800">Prize Info</div>
                    </div>

                    <DataTable :value="listPrize" :paginator="true" :rows="7" dataKey="id" :rowHover="true" responsiveLayout="scroll" class="text-sm" :loading="tableLoading">
                        <template #empty>
                            <div class="text-center py-8 text-gray-500">No prizes found for this campaign.</div>
                        </template>

                        <!-- Prize Column -->
                        <Column header="Prize" style="min-width: 10rem">
                            <template #body="{ data }">
                                <div class="flex items-center gap-3 relative group" @mouseenter="hoverPrize = data.id" @mouseleave="hoverPrize = null">
                                    <img :src="data.imageURL" alt="Prize" class="w-36 h-24 rounded-lg object-cover border" />
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
                                <div>{{ data.prizeWon }} / {{ data.prizeQuota }}</div>
                            </template>
                        </Column>
                    </DataTable>
                </div>

                 <div class="card flex flex-col w-full">
                    <!-- Header with Invite Button -->
                    <div class="flex items-center justify-between border-b pb-2 mb-2">
                        <div class="text-2xl font-bold text-gray-800">Participating Dealer</div>
                        <div class="inline-flex items-center gap-2">
                        <Button v-if="canUpdate" label="Report" style="width: fit-content" class="p-button-sm p-button-danger" :loading="exportLoading" @click="fetchExport" :disabled="exportLoading" />
                        <Button v-if="canUpdate" label="Assign Dealer" icon="pi pi-user-plus" style="width: fit-content" class="p-button-sm p-button-success" @click="openInviteDealerDialog" />
                        </div>
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
                        <Column v-if="canUpdate" header="Actions" style="min-width: 4rem; text-align: center">
                            <template #body="{ data }">
                                <Button icon="pi pi-trash" class="p-button-text p-button-danger" @click="removeDealer(data)" :loading="deletingDealerId === data.id" :disabled="deletingDealerId === data.id" />
                            </template>
                        </Column>
                    </DataTable>
                </div>

                <div class="flex flex-col gap-8">
                    <!-- Header -->
                    <div class="card flex flex-col gap-6 w-full">
                        <!-- Title -->
                        <div class="text-2xl font-bold text-gray-800 border-b pb-2 mb-4">Campaign Report ({{ selectedReport.label }})</div>

                        <!-- Filters Section -->
                        <div>
                            <!-- Main Filters Row -->
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <!-- Report Type -->
                                <div>
                                    <label class="block font-bold text-gray-700 mb-2">Report Type</label>
                                    <Dropdown v-model="selectedReport" :options="reportTypes" optionLabel="label" placeholder="Select Report Type" class="w-full" />
                                </div>
                            </div>

                            <!-- ✅ Include Deleted Users Checkbox -->
                            <!-- <div class="flex items-center gap-2 mt-6">
                                <Checkbox v-model="filters.includeDeleted" inputId="includeDeleted" :binary="true" />
                                <label for="includeDeleted" class="text-gray-700 cursor-pointer">Include Deleted Users</label>
                            </div> -->
                        </div>

                        <!-- Action Buttons -->
                        <div class="flex justify-end gap-4 mt-6">
                            <Button label="Clear Filters" class="p-button-primary" @click="clearFilters" />
                            <Button label="Export" icon="pi pi-file-excel" class="p-button-success" @click="exportExcel" :loading="exportLoading" :disabled="!filters.years || filters.years.length === 0" />
                        </div>
                    </div>
                </div>
            </div>

            <!-- RIGHT SIDE (1/3) -->
            <div class="md:w-1/3 flex flex-col">
                <!-- Advance Info -->
                <div class="card flex flex-col w-full">
                    <div class="flex items-center justify-between border-b pb-2 mb-2">
                        <div class="text-2xl font-bold text-gray-800">Advance Info</div>
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
                                    <td class="px-4 py-2 text-right">{{ formatDate(campaign.publishDate) }}</td>
                                </tr>
                                <tr>
                                    <td class="px-4 py-2 font-medium"></td>
                                    <td class="py-4 text-right">
                                        <div class="flex justify-end">
                                            <ToggleButton v-if="canUpdate" v-model="campaignStatus" @change="toggleCampaignStatus" onLabel="Active" offLabel="Inactive" onIcon="pi pi-times" offIcon="pi pi-check" class="w-30" />
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div class="card flex flex-col w-full">
                    <div class="flex items-center justify-between border-b pb-2 mb-2">
                        <div class="text-2xl font-bold text-gray-800">Criteria</div>
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
                <div class="text-gray-700">Select dealers to invite to this campaign. Note: Previously invited dealers will also need to be included.</div>

                <!-- Dealer Selection -->
                <div class="flex flex-col gap-2">
                    <label class="font-medium text-gray-700">Available Dealers:</label>
                    <div class="max-h-60 overflow-y-auto border rounded p-2">
                        <div v-for="dealer in availableDealers" :key="dealer.id" class="flex items-center gap-3 p-2 hover:bg-gray-50 rounded">
                            <Checkbox v-model="selectedDealers" :value="dealer.id" :inputId="`dealer-${dealer.id}`" />
                            <label :for="`dealer-${dealer.id}`" class="cursor-pointer flex-1">
                                <div class="font-medium">{{ dealer.companyName }}</div>
                                <div class="text-sm text-gray-500">{{ dealer.memberCode || dealer.custAccountNo }}</div>
                            </label>
                        </div>
                    </div>
                </div>

                <div class="flex justify-between items-center mt-4">
                    <div class="text-sm text-gray-600">Selected: {{ selectedDealers.length }} dealers</div>
                    <div class="flex gap-2">
                        <Button label="Cancel" class="p-button-text" @click="closeInviteDealerDialog" />
                        <Button label="Invite" icon="pi pi-user-plus" class="p-button-success" @click="inviteDealers" :loading="inviteLoading" :disabled="selectedDealers.length === 0" />
                    </div>
                </div>
            </div>
        </Dialog>
    </Fluid>
</template>

<script setup>
import { ref, onMounted, computed, reactive, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';
import api from '@/service/api';
import { useMenuStore } from '@/store/menu';

const menuStore = useMenuStore();
const canUpdate = computed(() => menuStore.canWrite('Campaign Management'));
const denyAccess = computed(() => menuStore.canTest('Campaign Management'));

const route = useRoute();
const router = useRouter();
const toast = useToast();
const confirm = useConfirm();

const campaignId = route.params.id;
const loading = ref(true);
const tableLoading = ref(false);
const inviteLoading = ref(false);
const deletingDealerId = ref(null); // Add this at the top with other refs

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

function formatDate(dateString) {
    if (!dateString) return '';

    // DD-MM-YYYY
    const [day, month, year] = dateString.split('-');
    const date = new Date(`${year}-${month}-${day}`);

    if (isNaN(date.getTime())) return '';

    return date.toLocaleDateString('en-MY', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
}

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
        selectedDealers.value = dealerList.value.map((dealer) => dealer.id);

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
        { id: 4, companyName: 'Dealer Four', memberCode: 'DLR004', custAccountNo: 'ACC004' }
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

// Remove Dealer Function - FIXED VERSION
const removeDealer = async (dealer) => {
    // Confirm deletion
    confirm.require({
        message: `Are you sure you want to remove ${dealer.companyName} from this campaign?`,
        header: 'Confirm Removal',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Yes, Remove',
        rejectLabel: 'Cancel',
        acceptClass: 'p-button-danger',
        accept: async () => {
            try {
                // Set loading state for this specific dealer
                deletingDealerId.value = dealer.id;

                // OPTION 1: If your API service has a removeDealerFromCampaign method
                // const result = await api.removeDealerFromCampaign(campaignId, dealer.id);

                // OPTION 2: Direct API call (use this if Option 1 doesn't work)
                const formData = new FormData();
                formData.append('dealerID', dealer.id);
                formData.append('campaignID', campaignId);

                const response = await api.post('campaign/removeDealer', formData, {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                });

                const result = response.data;

                // Check if API call was successful
                if (result.status === 1) {
                    // Remove from local list only if API succeeds
                    dealerList.value = dealerList.value.filter((d) => d.id !== dealer.id);

                    // Show success message
                    toast.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Dealer removed successfully',
                        life: 3000
                    });
                } else {
                    throw new Error('API returned unsuccessful status');
                }
            } catch (error) {
                console.error('Error removing dealer:', error);

                // Show error message
                toast.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to remove dealer. Please try again.',
                    life: 5000
                });
            } finally {
                // Reset loading state
                deletingDealerId.value = null;
            }
        },
        reject: () => {
            toast.add({
                severity: 'info',
                summary: 'Cancelled',
                detail: 'Dealer removal cancelled',
                life: 2000
            });
        }
    });
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
                criteria.value = data.criteria.map((item) => ({
                    ...item,
                    type: 'Tire' // Default type as per your structure
                }));
            }

            // Set dealer list
            if (Array.isArray(data.participate_dealer)) {
                dealerList.value = data.participate_dealer.map((dealer) => ({
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
                listPrize.value = data.reward_option.map((reward) => {
                    const catalog = reward.catalog;
                    return {
                        id: reward.id,
                        prizeType: mapPrizeType(catalog.type),
                        imageURL: catalog.imageURL,
                        prizeName: catalog.title,
                        prizeQuota: reward.total_qty,
                        prizeWon: reward.won_qty,
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
                const blobUrl = campaign.value[field];
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
                const blobUrl = prize.imageURL;
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
        EWALLET: 'E-Wallet',
        EVOUCHER: 'E-Voucher',
        ITEM: 'Item',
        POINT: 'Point'
    };
    return typeMap[apiType] || apiType;
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
    const target = participants.value.find((p) => p.id === participant.id);
    if (target) {
        target.status = 'Approved';
    }
}

function rejectParticipant(participant) {
    const target = participants.value.find((p) => p.id === participant.id);
    if (target) {
        target.status = 'Rejected';
    }
}

// Lifecycle
onMounted(() => {
    fetchCampaignDetails();
    generateYearOptions(5);
    const currentYear = new Date().getFullYear().toString();
    filters.years = [currentYear];
    filters.includeDeleted = false; // ✅ Default to false
});

// ✅ Report Types with API endpoint mapping
const reportTypes = ref([
    { label: 'Tire Pattern', value: 'by-pattern', apiEndpoint: 'report/tirepattern-report-campaign', columnHeader: 'Pattern' },
    { label: 'Tire Size', value: 'by-size', apiEndpoint: 'report/tiresize-report-campaign', columnHeader: 'Size' },
    { label: 'Vehicle Brand', value: 'by-brand', apiEndpoint: 'report/vehiclebrand-report-campaign', columnHeader: 'Brand' },
    { label: 'Vehicle Type', value: 'by-type', apiEndpoint: 'report/vehicletype-report-campaign', columnHeader: 'Type' }
]);

// ✅ Selected Report
const selectedReport = ref(reportTypes.value[0]);

// ✅ Filters - Add includeDeleted with default value
const filters = reactive({
    years: [],
    month: null,
    expiryFrom: null,
    expiryTo: null,
    includeDeleted: false // ✅ Default to false (0)
});

// ✅ Report Data
const reportData = ref([]);

// ✅ Loading states
const exportLoading = ref(false);
const loadingData = ref(false);

// ✅ Year Options
const yearOptions = ref([]);

const generateYearOptions = (yearsBack = 10) => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = 0; i < yearsBack; i++) {
        const year = currentYear - i;
        years.push({ label: year.toString(), value: year.toString() });
    }
    yearOptions.value = years;
};

// ✅ Month Options (for birthday report)
const monthOptions = ref([
    { label: 'All Months', value: null },
    { label: 'January', value: '1' },
    { label: 'February', value: '2' },
    { label: 'March', value: '3' },
    { label: 'April', value: '4' },
    { label: 'May', value: '5' },
    { label: 'June', value: '6' },
    { label: 'July', value: '7' },
    { label: 'August', value: '8' },
    { label: 'September', value: '9' },
    { label: 'October', value: '10' },
    { label: 'November', value: '11' },
    { label: 'December', value: '12' }
]);

// ✅ Show Toast Notification
const showToast = (severity, summary, detail, life = 3000) => {
    toast.add({
        severity,
        summary,
        detail,
        life
    });
};

// ✅ Clear Filters - Reset includeDeleted to false
const clearFilters = () => {
    filters.years = [];
    filters.month = null;
    filters.expiryFrom = null;
    filters.expiryTo = null;
    filters.includeDeleted = false; // ✅ Reset to false
    reportData.value = [];

    showToast('info', 'Filters Cleared', 'All filters have been reset to default values.');
};

// ✅ Prepare JSON Body for API - Add include_deleted parameter
const prepareRequestBody = () => {
    if (!filters.years || filters.years.length === 0) {
        showToast('warn', 'Years Required', 'Please select at least one year.');
        return null;
    }

    const requestBody = {
        years: filters.years,
        include_deleted: filters.includeDeleted ? 1 : 0 // ✅ Add include_deleted parameter
    };

    // Add additional filters
    if (selectedReport.value.value === 'by-birthday' && filters.month) {
        requestBody.month = filters.month;
    }

    if (selectedReport.value.value === 'point-expiry') {
        if (filters.expiryFrom !== null && filters.expiryFrom !== undefined) {
            requestBody.expiryFrom = filters.expiryFrom;
        }
        if (filters.expiryTo !== null && filters.expiryTo !== undefined) {
            requestBody.expiryTo = filters.expiryTo;
        }
    }

    return requestBody;
};

// ✅ EXPORT TO EXCEL - Updated to include include_deleted parameter
const exportExcel = async () => {
    exportLoading.value = true;

    try {
        const endpoint = `${selectedReport.value.apiEndpoint}/${campaignId}`;

        // Try different approaches sequentially
        let response;

        response = await api.postExtra(endpoint,{}, {
            responseType: 'blob',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        // Check content type
        const contentType = response.headers['content-type'] || response.data.type || 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

        // Create blob
        const blob = new Blob([response.data], { type: contentType });

        // Generate download URL
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');

        // Generate filename with include_deleted indicator
        const timestamp = new Date().toISOString().split('T')[0];
        const reportName = selectedReport.value.label.replace(/\s+/g, '_');
        const yearsStr = filters.years.join('_');
        const deletedIndicator = filters.includeDeleted ? '_with_deleted' : '_active_only';

        // Try to get filename from Content-Disposition header
        let filename = `${reportName}_${yearsStr}${deletedIndicator}_${timestamp}.xlsx`;
        const contentDisposition = response.headers['content-disposition'];
        if (contentDisposition) {
            const filenameMatch = contentDisposition.match(/filename\*?=["']?([^"']+)["']?/i);
            if (filenameMatch && filenameMatch[1]) {
                filename = decodeURIComponent(filenameMatch[1]);
            }
        }

        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        // Cleanup
        setTimeout(() => {
            window.URL.revokeObjectURL(url);
        }, 100);

        showToast('success', 'Export Successful', `${filename} downloaded successfully!`);
    } catch (error) {
        console.error('❌ Export Error Details:', error);
        showToast('error', 'Export Error', error.message || 'Failed to export');
    } finally {
        exportLoading.value = false;
    }
};



// Watch for filter changes
let debounceTimer = null;
watch(
    () => [selectedReport.value, filters.years, filters.month, filters.expiryFrom, filters.expiryTo, filters.includeDeleted], // ✅ Add includeDeleted to watch
    () => {
        if (debounceTimer) {
            clearTimeout(debounceTimer);
        }
    },
    { deep: true }
);

const fetchExport = async () => {
    try {
        loading.value = true;

        const response = await api.postExtra(
            `report/dealer-report-campaign/${campaignId}`,{},
            { responseType: 'arraybuffer' }
        );

        const blob = new Blob([response.data], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'ParticipantDealer_Report';
        a.click();
        URL.revokeObjectURL(url);

        toast.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Export completed',
            life: 3000
        });

    } catch (error) {
        console.error('Export error:', error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Export failed',
            life: 3000
        });
    } finally {
        loading.value = false;
    }
};
</script>

<style scoped>
:deep(.p-multiselect),
:deep(.p-dropdown),
:deep(.p-inputnumber) {
    width: 100%;
}

:deep(.p-button:disabled) {
    opacity: 0.6;
    cursor: not-allowed;
}

/* Custom styling for the multi-select chips */
:deep(.p-multiselect-chip .p-multiselect-token) {
    background-color: #e2e8f0;
    color: #1e293b;
    font-weight: 500;
}

/* Toast positioning */
:deep(.p-toast) {
    z-index: 1000;
}

/* Table styling */
table {
    border-collapse: collapse;
    width: 100%;
}

th,
td {
    padding: 8px 12px;
    border: 1px solid #e5e7eb;
}

thead {
    background-color: #f9fafb;
}

tbody tr:hover {
    background-color: #f3f4f6;
}

/* Responsive adjustments */
@media (max-width: 768px) {
    .grid-cols-1.md\:grid-cols-2 {
        grid-template-columns: 1fr;
    }

    .flex.gap-2 {
        flex-direction: column;
        gap: 0.5rem;
    }

    table {
        font-size: 14px;
    }

    th,
    td {
        padding: 6px 8px;
    }
}
</style>
