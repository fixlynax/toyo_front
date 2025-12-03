<template>
    <Fluid>
        <div class="flex flex-col md:flex-row gap-8">
            <!-- Left Content -->
            <div class="md:w-2/3">
                <div v-if="catalogue.type === 'EWALLET'" class="card flex flex-col w-full">
                    <!-- Header -->
                    <div class="flex items-center justify-between border-b pb-3 mb-6">
                        <div class="flex items-center gap-2">
                            <RouterLink to="/marketing/listCatalogue">
                                <Button icon="pi pi-arrow-left font-bold" class="p-button-text p-button-secondary text-xl" v-tooltip="'Back'" />
                            </RouterLink>
                            <div class="text-2xl font-bold text-gray-800">Details Catalogue</div>
                        </div>

                        <!-- Edit & Delete Buttons -->
                        <div class="flex items-center gap-2">
                            <RouterLink :to="`/marketing/editCatalogue/${catalogue.id}`">
                                <Button label="Edit" class="p-button-info" size="small" />
                            </RouterLink>
                            <Button label="Delete" class="p-button-danger" size="small" @click="confirmDelete" />
                        </div>
                    </div>

                    <!-- List PIN Section -->
                    <div class="flex items-center justify-between mb-4">
                        <div class="flex items-center gap-3">
                            <div class="text-2xl font-bold text-gray-800">🔑 List PIN</div>
                        </div>
                    </div>

                    <DataTable :value="processedPins" :paginator="true" :rows="10" dataKey="id" :rowHover="true" :loading="loading">
                        <template #header>
                            <div class="flex flex-col md:flex-row items-center justify-between gap-4 w-full">
                                <!-- Summary Info -->
                                <div class="flex gap-4 w-full md:w-auto">
                                    <div class="w-32">
                                        <label class="block font-medium text-gray-700 mb-1">Used</label>
                                        <span class="text-gray-800 font-semibold">{{ usedPins }}</span>
                                    </div>
                                    <div class="w-32">
                                        <label class="block font-medium text-gray-700 mb-1">Total</label>
                                        <span class="text-gray-800 font-semibold">{{ catalogue.totalqty }}</span>
                                    </div>
                                </div>

                                <!-- Action Buttons -->
                                <div class="flex gap-4 items-end w-full md:w-72">
                                    <!-- <Button icon="pi pi-plus" class="p-button-text text-green-600 w-10 h-10 flex items-center justify-center" v-tooltip="'Add PIN'" @click="addPin" />
                                    <Button icon="pi pi-minus" class="p-button-text text-yellow-600 w-10 h-10 flex items-center justify-center" v-tooltip="'Remove PIN'" @click="removePin" /> -->
                                    <Button icon="pi pi-file-export" label="Export" v-tooltip="'Export PIN List'" @click="exportPinList" />
                                    <Button icon="pi pi-file-import" label="Import" v-tooltip="'Import PIN List'" @click="importPinList" />
                                </div>
                            </div>
                        </template>

                        <template #empty> No PINs found. </template>
                        <template #loading> Loading PIN data. Please wait. </template>

                        <Column header="Pin" style="min-width: 8rem">
                            <template #body="{ data }">{{ data.pincode }}</template>
                        </Column>
                        <Column header="Value" style="min-width: 6rem">
                            <template #body="{ data }">RM {{ data.value }}</template>
                        </Column>
                        <Column header="Provider" style="min-width: 8rem">
                            <template #body="{ data }">{{ data.provider }}</template>
                        </Column>
                        <Column header="Expiry" style="min-width: 8rem">
                            <template #body="{ data }">{{ formatExpiryDate(data.expiry) }}</template>
                        </Column>
                        <Column header="Date Used" style="min-width: 8rem">
                            <template #body="{ data }">{{ data.redeemed ? formatDate(data.redeemed) : '-' }}</template>
                        </Column>
                        <Column header="Status" style="min-width: 8rem">
                            <template #body="{ data }">
                                <span :class="data.status === 'REDEEMED' ? 'text-red-600 font-medium' : 'text-green-600 font-medium'">
                                    {{ data.status === 'REDEEMED' ? 'Used' : 'Available' }}
                                </span>
                            </template>
                        </Column>
                        <!-- Actions -->
                        <Column header="Actions" style="min-width: 4rem; text-align: center">
                            <template #body="{ data }">
                                <Button 
                                    icon="pi pi-trash" 
                                    class="p-button-text p-button-danger" 
                                    @click="removeDealer(data)"
                                    :loading="deletingDealerId === data.id"
                                    :disabled="deletingDealerId === data.id"
                                />
                            </template>
                        </Column>
                    </DataTable>

                    <!-- Set Point Button -->
                    <div class="flex flex-row items-center gap-2 mt-4">
                        <Button label="Set Cost Redeem" class="p-button" size="small" style="width: auto" @click="showSetDialog = true" />
                    </div>

                    <!-- Set Point Dialog -->
                    <Dialog v-model:visible="showSetDialog" header="Set Cost Redeem" modal class="w-96">
                        <div class="flex flex-col gap-3">
                            <label for="silverpoint" class="font-medium">Silver Point</label>
                            <InputNumber v-model="silverPoint" id="silverpoint" showButtons />
                            <label for="goldpoint" class="font-medium">Gold Point</label>
                            <InputNumber v-model="goldPoint" id="goldpoint" showButtons />
                            <label for="plantinumpoint" class="font-medium">Platinum Point</label>
                            <InputNumber v-model="platinumPoint" id="plantinumpoint" showButtons />
                            <div class="flex justify-end gap-2 mt-3">
                                <Button label="Cancel" class="p-button-text" @click="showSetDialog = false" />
                                <Button label="Confirm" class="p-button-success" @click="confirmSetPoint" />
                            </div>
                        </div>
                    </Dialog>
                </div>

                <div v-else-if="catalogue.type === 'EVOUCHER'" class="card flex flex-col w-full">
                    <!-- Header -->
                    <div class="flex items-center justify-between border-b pb-3 mb-6">
                        <div class="flex items-center gap-2">
                            <RouterLink to="/marketing/listCatalogue">
                                <Button icon="pi pi-arrow-left font-bold" class="p-button-text p-button-secondary text-xl" v-tooltip="'Back'" />
                            </RouterLink>
                            <div class="text-2xl font-bold text-gray-800">Details Catalogue</div>
                        </div>

                        <!-- Edit & Delete Buttons -->
                        <div class="flex items-center gap-2">
                            <RouterLink :to="`/marketing/editCatalogue/${catalogue.id}`">
                                <Button label="Edit" class="p-button-info" size="small" />
                            </RouterLink>
                            <Button label="Delete" class="p-button-danger" size="small" @click="confirmDelete" />
                        </div>
                    </div>

                    <!-- E-Voucher Details -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-800 mb-8">
                        <div>
                            <span class="block text-sm font-semibold text-gray-500">Total Quantity</span>
                            <p class="text-lg font-medium">{{ catalogue.totalqty }}</p>
                        </div>
                        <div>
                            <span class="block text-sm font-semibold text-gray-500">Available Quantity</span>
                            <p class="text-lg font-medium">{{ catalogue.availableqty }}</p>
                        </div>
                        <div>
                            <span class="block text-sm font-semibold text-gray-500">Value Type</span>
                            <p class="text-lg font-medium">{{ formatValueType(catalogue.valueType) }}</p>
                        </div>
                        <div>
                            <span class="block text-sm font-semibold text-gray-500">Value Amount</span>
                            <p class="text-lg font-medium">
                                <template v-if="catalogue.valueType === 'PERCENTAGE'"> {{ catalogue.valueAmount }}% </template>
                                <template v-else> RM {{ parseFloat(catalogue.valueAmount || 0).toLocaleString('en-MY', { minimumFractionDigits: 2 }) }} </template>
                            </p>
                        </div>
                    </div>

                    <!-- Set Point Button -->
                    <div class="flex flex-row items-center gap-2 mt-4">
                        <Button label="Set Cost Redeem" class="p-button" size="small" style="width: auto" @click="showSetDialog = true" />
                    </div>

                    <!-- Set Point Dialog -->
                    <Dialog v-model:visible="showSetDialog" header="Set Cost Redeem" modal class="w-96">
                        <div class="flex flex-col gap-3">
                            <label for="silverpoint" class="font-medium">Silver Point</label>
                            <InputNumber v-model="silverPoint" id="silverpoint" showButtons :min="0" />
                            <label for="goldpoint" class="font-medium">Gold Point</label>
                            <InputNumber v-model="goldPoint" id="goldpoint" showButtons :min="0" />
                            <label for="plantinumpoint" class="font-medium">Platinum Point</label>
                            <InputNumber v-model="platinumPoint" id="plantinumpoint" showButtons :min="0" />
                            <div class="flex justify-end gap-2 mt-3">
                                <Button label="Cancel" class="p-button-text" @click="showSetDialog = false" />
                                <Button label="Confirm" class="p-button-success" @click="confirmSetPoint" />
                            </div>
                        </div>
                    </Dialog>
                </div>

                <div v-else-if="catalogue.type === 'ITEM'" class="card flex flex-col w-full">
                    <!-- Header -->
                    <div class="flex items-center justify-between border-b pb-3 mb-6">
                        <div class="flex items-center gap-2">
                            <RouterLink to="/marketing/listCatalogue">
                                <Button icon="pi pi-arrow-left font-bold" class="p-button-text p-button-secondary text-xl" v-tooltip="'Back'" />
                            </RouterLink>
                            <div class="text-2xl font-bold text-gray-800">Details Catalogue</div>
                        </div>

                        <!-- Edit & Delete Buttons -->
                        <div class="flex items-center gap-2">
                            <RouterLink :to="`/marketing/editCatalogue/${catalogue.id}`">
                                <Button label="Edit" class="p-button-info" size="small" />
                            </RouterLink>
                            <Button label="Delete" class="p-button-danger" size="small" @click="confirmDelete" />
                        </div>
                    </div>

                    <!-- Item Stock Section -->
                    <div class="flex items-center justify-between mb-4">
                        <div class="flex items-center gap-3">
                            <div class="text-2xl font-bold text-gray-800">📦 Item Stock</div>
                        </div>
                    </div>

                    <!-- Quantity Overview -->
                    <div class="flex flex-col md:flex-row justify-between items-center bg-gray-50 border rounded-lg p-4 mb-6">
                        <div class="flex flex-col gap-2">
                            <div>
                                <span class="font-medium text-gray-700">Total Quantity:</span>
                                <span class="font-bold text-gray-900 ml-2">{{ catalogue.totalqty }}</span>
                            </div>
                            <div>
                                <span class="font-medium text-gray-700">Available Quantity:</span>
                                <span class="font-bold text-green-700 ml-2">{{ catalogue.availableqty }}</span>
                            </div>
                        </div>

                        <!-- Action Buttons -->
                        <div class="flex gap-4 mt-4 md:mt-0">
                            <Button icon="pi pi-plus" label="Add" class="p-button-success" @click="showAddDialog = true" />
                            <Button icon="pi pi-minus" label="Remove" class="p-button-warning" @click="showRemoveDialog = true" />
                        </div>
                    </div>

                    <!-- Add Stock Dialog -->
                    <Dialog v-model:visible="showAddDialog" header="Add Quantity" modal class="w-96">
                        <div class="flex flex-col gap-3">
                            <label for="addQty" class="font-medium">Quantity to Add</label>
                            <InputNumber v-model="addQty" id="addQty" showButtons min="1" />
                            <div class="flex justify-end gap-2 mt-3">
                                <Button label="Cancel" class="p-button-text" @click="showAddDialog = false" />
                                <Button label="Confirm" class="p-button-success" @click="addStock" />
                            </div>
                        </div>
                    </Dialog>

                    <!-- Remove Stock Dialog -->
                    <Dialog v-model:visible="showRemoveDialog" header="Remove Quantity" modal class="w-96">
                        <div class="flex flex-col gap-3">
                            <label for="removeQty" class="font-medium">Quantity to Remove</label>
                            <InputNumber v-model="removeQty" id="removeQty" showButtons min="1" :max="catalogue.availableqty" />
                            <div class="flex justify-end gap-2 mt-3">
                                <Button label="Cancel" class="p-button-text" @click="showRemoveDialog = false" />
                                <Button label="Confirm" class="p-button-warning" @click="removeStock" />
                            </div>
                        </div>
                    </Dialog>

                    <!-- Set Point Button -->
                    <div class="flex flex-row items-center gap-2 mt-4">
                        <Button label="Set Cost Redeem" class="p-button" size="small" style="width: auto" @click="showSetDialog = true" />
                    </div>

                    <!-- Set Point Dialog -->
                    <Dialog v-model:visible="showSetDialog" header="Set Cost Redeem" modal class="w-96">
                        <div class="flex flex-col gap-3">
                            <label for="silverpoint" class="font-medium">Silver Point</label>
                            <InputNumber v-model="silverPoint" id="silverpoint" showButtons :min="0" />
                            <label for="goldpoint" class="font-medium">Gold Point</label>
                            <InputNumber v-model="goldPoint" id="goldpoint" showButtons :min="0" />
                            <label for="plantinumpoint" class="font-medium">Platinum Point</label>
                            <InputNumber v-model="platinumPoint" id="plantinumpoint" showButtons :min="0" />
                            <div class="flex justify-end gap-2 mt-3">
                                <Button label="Cancel" class="p-button-text" @click="showSetDialog = false" />
                                <Button label="Confirm" class="p-button-success" @click="confirmSetPoint" />
                            </div>
                        </div>
                    </Dialog>
                </div>

                <div class="card flex flex-col w-full mt-8">
                    <!-- Header -->
                    <div class="flex items-center justify-between border-b pb-3 mb-4">
                        <div class="flex items-center gap-3">
                            <div class="text-2xl font-bold text-gray-800">👨🏻‍💻 Redemption List</div>
                        </div>

                        <!-- Export Button -->
                        <div class="flex items-center gap-2">
                            <Button icon="pi pi-file-export" label="Export" class="p-button text-blue-600 p-2 flex items-center justify-center" v-tooltip="'Export Redemption List'" @click="exportToExcel" />
                        </div>
                    </div>

                    <!-- DataTable -->
                    <DataTable :value="redeemList" :paginator="true" :rows="10" dataKey="member_code" :rowHover="true" responsiveLayout="scroll" class="text-sm" :loading="loading">
                        <template #empty> No redemption records found. </template>
                        <template #loading> Loading redemption data. Please wait. </template>

                        <Column header="Member Code" style="min-width: 8rem">
                            <template #body="{ data }">
                                <span class="font-bold text-gray-800 hover:underline">
                                    {{ data.member_code }}
                                </span>
                            </template>
                        </Column>

                        <Column field="full_name" header="Member Name" style="min-width: 10rem" />
                        <Column header="Date Redeemed" style="min-width: 10rem">
                            <template #body="{ data }">
                                {{ formatDate(data.redeem_on) }}
                            </template>
                        </Column>
                    </DataTable>
                </div>
            </div>

            <!-- Right Sidebar -->
            <div class="md:w-1/3 flex flex-col">
                <div class="card flex flex-col w-full">
                    <!-- Header -->
                    <div class="flex items-center justify-between border-b pb-2 mb-2">
                        <div class="text-2xl font-bold text-gray-800">ℹ️ Details Info</div>
                        <Tag :value="statusLabel(catalogue.status)" :severity="statusSeverity(catalogue.status)" />
                    </div>

                    <!-- Catalogue Images -->
                    <div class="grid grid-cols-1 md:grid-cols-1 gap-4 mt-4">
                        <img :src="processedImageURL" :alt="catalogue.title" class="rounded-xl shadow-sm object-cover w-full h-48" @error="handleImageError" />
                    </div>

                    <!-- Catalogue Info -->
                    <div class="mt-4">
                        <h1 class="text-2xl font-bold text-gray-800">{{ catalogue.title }}</h1>
                        <p class="text-lg font-medium text-gray-600 mt-2">{{ catalogue.description }}</p>
                    </div>

                    <div class="flex flex-col gap-4 mt-4">
                        <div>
                            <span class="block text-sm font-bold text-black-700 mb-1">Terms & Conditions</span>
                            <p class="text-base text-gray-700">{{ catalogue.terms }}</p>
                        </div>
                        <div>
                            <span class="block text-sm font-bold text-black-700 mb-1">Instructions</span>
                            <p class="text-base text-gray-700">{{ catalogue.instruction }}</p>
                        </div>
                    </div>

                    <div class="flex justify-end mt-8">
                        <div class="flex justify-end">
                            <!-- In template, bind to a local ref instead -->
                            <ToggleButton v-model="localStatus" @change="toggleCatalogStatus" onLabel="Active" offLabel="Inactive" onIcon="pi pi-check" offIcon="pi pi-times" class="w-30" />
                        </div>
                    </div>
                </div>

                <!-- Advance Info -->
                <div class="card flex flex-col w-full mt-6">
                    <div class="flex items-center justify-between border-b pb-2 mb-2">
                        <div class="text-2xl font-bold text-gray-800">ℹ️ Advance Info</div>
                    </div>

                    <div class="overflow-x-auto">
                        <table class="w-full text-sm text-left text-gray-700">
                            <tbody>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Created</td>
                                    <td class="px-4 py-2 text-right">{{ formatDate(catalogue.created) }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">SKU</td>
                                    <td class="px-4 py-2 text-right">{{ catalogue.sku }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Type</td>
                                    <td class="px-4 py-2 text-right">{{ formatType(catalogue.type) }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Purpose</td>
                                    <td class="px-4 py-2 text-right">{{ formatPurpose(catalogue.purpose) }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Birthday Reward</td>
                                    <td class="px-4 py-2 text-right">
                                        {{ catalogue.isBirthday === 1 ? 'Yes' : 'No' }}
                                    </td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Silver Point</td>
                                    <td class="px-4 py-2 text-right">{{ catalogue.point1 }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Gold Point</td>
                                    <td class="px-4 py-2 text-right">{{ catalogue.point2 }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Platinum Point</td>
                                    <td class="px-4 py-2 text-right">{{ catalogue.point3 }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Quantity</td>
                                    <td class="px-4 py-2 text-right">{{ catalogue.availableqty }} of {{ catalogue.totalqty }}</td>
                                </tr>
                                <tr class="border-b" :class="getExpiryClass(catalogue.expiry)">
                                    <td class="px-4 py-2 font-medium">Expiry</td>
                                    <td class="px-4 py-2 text-right">{{ formatExpiryDate(catalogue.expiry) }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </Fluid>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';
import api from '@/service/api';

const route = useRoute();
const router = useRouter();
const toast = useToast();
const confirm = useConfirm(); // Initialize confirmation dialog

// Reactive data
const catalogue = ref({
    id: 0,
    type: '',
    imageURL: '',
    title: '',
    sku: '',
    valueType: '',
    valueAmount: 0,
    description: '',
    terms: '',
    instruction: '',
    point1: 0,
    point2: 0,
    point3: 0,
    purpose: '',
    purposeID: null,
    totalqty: 0,
    availableqty: 0,
    expiry: '',
    isBirthday: 0,
    status: 0,
    created: '',
    deleted: null,
    ewallet_pin: [],
    redeem_list: []
});

const loading = ref(false);
const processedImageURL = ref('');

// Dialog controls
const showSetDialog = ref(false);
const showAddDialog = ref(false);
const showRemoveDialog = ref(false);
const addQty = ref(0);
const removeQty = ref(0);
const silverPoint = ref(0);
const goldPoint = ref(0);
const platinumPoint = ref(0);
const exportLoading = ref(false);

onMounted(async () => {
    await fetchCatalogueDetails();
});

const fetchCatalogueDetails = async () => {
    loading.value = true;
    try {
        const catalogueId = route.params.id;
        const response = await api.get(`catalog/details/${catalogueId}`);

        if (response.data.status === 1 && response.data.admin_data) {
            catalogue.value = response.data.admin_data;

            // Process image URL
            if (catalogue.value.imageURL) {
                try {
                    const blobUrl = await api.getPrivateFile(catalogue.value.imageURL);
                    processedImageURL.value = blobUrl;
                } catch (error) {
                    console.error('Error loading catalogue image:', error);
                    processedImageURL.value = catalogue.value.imageURL;
                }
            } else {
                processedImageURL.value = 'https://via.placeholder.com/300x200?text=No+Image';
            }

            // Initialize point values for dialog
            silverPoint.value = catalogue.value.point1 || 0;
            goldPoint.value = catalogue.value.point2 || 0;
            platinumPoint.value = catalogue.value.point3 || 0;
        } else {
            throw new Error('Invalid response format');
        }
    } catch (error) {
        console.error('Error fetching catalogue details:', error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load catalogue details',
            life: 3000
        });
    } finally {
        loading.value = false;
    }
};

// Computed properties
const processedPins = computed(() => {
    if (!catalogue.value.ewallet_pin) return [];
    return catalogue.value.ewallet_pin.map((pin) => ({
        ...pin,
        pincode: maskPin(pin.pincode)
    }));
});

const usedPins = computed(() => {
    if (!catalogue.value.ewallet_pin) return 0;
    return catalogue.value.ewallet_pin.filter((pin) => pin.status === 'REDEEMED').length;
});

const redeemList = computed(() => {
    return catalogue.value.redeem_list || [];
});

// Helper functions
const maskPin = (pin) => {
    if (!pin) return '';
    const str = pin.toString().replace(/-/g, '');
    if (str.length <= 2) return str;
    return str[0] + '*'.repeat(str.length - 2) + str[str.length - 1];
};

const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
        // Handle different date formats from API
        if (dateString.includes('T')) {
            return new Date(dateString).toLocaleDateString('en-MY');
        } else {
            // Handle DD-MM-YYYY format
            const [day, month, year] = dateString.split('-');
            return new Date(`${year}-${month}-${day}`).toLocaleDateString('en-MY');
        }
    } catch (error) {
        return dateString;
    }
};

const formatExpiryDate = (expiryDate) => {
    if (!expiryDate) return 'No expiry';
    try {
        // Convert from DD-MM-YYYY to DD/MM/YYYY format
        const [day, month, year] = expiryDate.split('-');
        return `${day}/${month}/${year}`;
    } catch (error) {
        return expiryDate;
    }
};

const getExpiryClass = (expiryDate) => {
    if (!expiryDate) return 'text-gray-500';

    try {
        const today = new Date();
        const [day, month, year] = expiryDate.split('-');
        const expiry = new Date(`${year}-${month}-${day}`);

        if (isNaN(expiry.getTime())) {
            return 'text-gray-500';
        }

        const diffTime = expiry - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0) {
            return 'text-red-500';
        } else if (diffDays <= 3) {
            return 'text-yellow-500';
        } else {
            return 'text-green-600';
        }
    } catch (error) {
        return 'text-gray-500';
    }
};

const formatType = (type) => {
    const typeMap = {
        EWALLET: 'E-Wallet',
        EVOUCHER: 'E-Voucher',
        ITEM: 'Item'
    };
    return typeMap[type] || type;
};

const formatValueType = (valueType) => {
    const typeMap = {
        AMOUNT: 'Fixed Amount',
        PERCENTAGE: 'Percentage'
    };
    return typeMap[valueType] || valueType;
};

const formatPurpose = (purpose) => {
    const purposeMap = {
        CATALOG: 'Catalog',
        CAMPAIGN: 'Campaign',
        GAME: 'Game'
    };
    return purposeMap[purpose] || purpose;
};

const statusLabel = (status) => {
    if (status === 0) return 'Inactive';
    if (status === 1) return 'Active';
    return 'Unknown';
};

const statusSeverity = (status) => {
    if (status === 0) return 'danger';
    if (status === 1) return 'success';
    return 'secondary';
};

const handleImageError = (event) => {
    event.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
};

const toggleCatalogStatus = async () => {
    try {
        const catalogueId = catalogue.value.id; // Get the ID from catalogue ref

        // Determine the new status (toggle current status)
        const newStatus = catalogue.value.status === 1 ? 0 : 1;

        const response = await api.put(`catalog/toggleInactive/${catalogueId}`, {
            status: newStatus
        });

        if (response.data.status === 1) {
            // Update local catalogue status
            catalogue.value.status = newStatus;

            toast.add({
                severity: 'success',
                summary: 'Success',
                detail: `Catalogue ${newStatus === 1 ? 'activated' : 'deactivated'} successfully`,
                life: 3000
            });
        } else {
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to update catalogue status',
                life: 3000
            });
        }
    } catch (error) {
        console.error('Error updating catalogue status:', error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to update catalogue status',
            life: 3000
        });
    }
};

// DELETE FUNCTIONALITY - Integrated with API
const confirmDelete = () => {
    confirm.require({
        message: 'Are you sure you want to delete this Catalogue?',
        header: 'Confirm Delete',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Yes, Delete',
        rejectLabel: 'Cancel',
        acceptClass: 'p-button-danger',
        accept: async () => {
            try {
                // API call to delete catalogue - using PUT method as per API specification
                const response = await api.put(`catalog/delete/${catalogue.value.id}`);

                if (response.data.status === 1) {
                    toast.add({
                        severity: 'success',
                        summary: 'Deleted',
                        detail: 'Catalogue deleted successfully.',
                        life: 3000
                    });
                    // Redirect to catalogue list page after successful deletion
                    router.push('/marketing/listCatalogue');
                } else {
                    toast.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Failed to delete Catalogue.',
                        life: 3000
                    });
                }
            } catch (error) {
                console.error('Delete failed:', error);
                toast.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to delete Catalogue.',
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

// Action methods
const addPin = () => {
    toast.add({
        severity: 'info',
        summary: 'Info',
        detail: 'Add PIN functionality to be implemented',
        life: 3000
    });
};

const removePin = () => {
    toast.add({
        severity: 'info',
        summary: 'Info',
        detail: 'Remove PIN functionality to be implemented',
        life: 3000
    });
};

const exportPinList = () => {
    toast.add({
        severity: 'info',
        summary: 'Info',
        detail: 'Export PIN list functionality to be implemented',
        life: 3000
    });
};

const importPinList = () => {
    toast.add({
        severity: 'info',
        summary: 'Info',
        detail: 'Import PIN list functionality to be implemented',
        life: 3000
    });
};

const exportToExcel = () => {
    // Change from processedPins.value to redeemList.value
    if (redeemList.value.length === 0) {
        toast.add({ severity: 'warn', summary: 'Warning', detail: 'No data to export', life: 3000 });
        return;
    }

    try {
        // Create worksheet data
        const headers = ['Member Code', 'Member Name', 'Date Redeemed'];

        // Prepare data rows - use redeemList instead of processedPins
        const csvData = redeemList.value.map((redeem) => [`"${redeem.member_code || ''}"`, `"${redeem.full_name || ''}"`, `"${redeem.redeem_on || ''}"`]);

        // Combine headers and data
        const csvContent = [headers.join(','), ...csvData.map((row) => row.join(','))].join('\n');

        // Create and download the file
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);

        link.setAttribute('href', url);
        link.setAttribute('download', `Redemption_List_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Error exporting to Excel:', error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to export data',
            life: 3000
        });
    }
};

const addStock = async () => {
    if (addQty.value > 0) {
        try {
            // API call to add stock would go here
            catalogue.value.totalqty += addQty.value;
            catalogue.value.availableqty += addQty.value;
            showAddDialog.value = false;
            addQty.value = 0;

            toast.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Stock added successfully',
                life: 3000
            });
        } catch (error) {
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to add stock',
                life: 3000
            });
        }
    }
};

const removeStock = async () => {
    if (removeQty.value > 0 && catalogue.value.availableqty >= removeQty.value) {
        try {
            // API call to remove stock would go here
            catalogue.value.availableqty -= removeQty.value;
            showRemoveDialog.value = false;
            removeQty.value = 0;

            toast.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Stock removed successfully',
                life: 3000
            });
        } catch (error) {
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to remove stock',
                life: 3000
            });
        }
    }
};

const confirmSetPoint = async () => {
    try {
        // API call to update points would go here
        catalogue.value.point1 = silverPoint.value;
        catalogue.value.point2 = goldPoint.value;
        catalogue.value.point3 = platinumPoint.value;
        showSetDialog.value = false;

        toast.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Cost redeem points updated successfully',
            life: 3000
        });
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to update cost redeem points',
            life: 3000
        });
    }
};

const toggleStatus = async (newStatus) => {
    try {
        // API call to update status would go here
        catalogue.value.status = newStatus;

        toast.add({
            severity: 'success',
            summary: 'Success',
            detail: `Catalogue ${newStatus === 1 ? 'activated' : 'inactivated'} successfully`,
            life: 3000
        });
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to update catalogue status',
            life: 3000
        });
    }
};
</script>

<style scoped>
/* Custom styles if needed */
</style>
