<template>
    <Fluid>
        <div class="flex flex-col md:flex-row gap-8">
            <!-- Left Content -->
            <div class="md:w-2/3">
                <div class="card flex flex-col gap-3 w-full">
                    <!-- Header -->
                    <div class="flex items-center justify-between border-b pb-2">
                        <div class="flex items-center gap-3">
                            <RouterLink to="/marketing/listCatalogue">
                                <Button icon="pi pi-arrow-left font-bold" class="p-button-text p-button-secondary text-xl" size="big" v-tooltip="'Back'" />
                            </RouterLink>
                            <div class="text-2xl font-bold text-gray-800">Details Catalogue</div>
                        </div>

                        <!-- Buttons -->
                        <div class="inline-flex items-center gap-2">
                            <RouterLink to="/marketing/editCatalogue">
                                <Button label="Edit" class="p-button-info" size="small" />
                            </RouterLink>
                            <Button label="Delete" class="p-button-danger" size="small" />
                        </div>
                    </div>

                    <!-- catalogue Images -->
                    <div class="grid grid-cols-1 md:grid-cols-1 gap-4 mt-4">
                        <img :src="catalogue.image1URL" alt="catalogue Image 1" class="rounded-xl shadow-sm object-cover w-full h-80" />
                    </div>

                    <!-- catalogue Info -->
                    <div class="mt-6">
                        <h1 class="text-2xl font-bold text-gray-800">{{ catalogue.title }}</h1>
                        <p class="text-lg font-medium">{{ catalogue.description }}</p>
                    </div>
                    <div class="flex flex-col md:flex-row gap-4 mt-2" v-if="catalogue.type === 'E-Voucher'">
                        <div class="w-full">
                            <span class="block text-xm font-bold text-black-700">Value Type</span>
                            <p class="text-lg font-medium">{{ catalogue.valueType }}</p>
                        </div>
                        <div class="w-full">
                            <span class="block text-xm font-bold text-black-700">Value Amount</span>
                            <p class="text-lg font-medium">{{ catalogue.valueAmount }}</p>
                        </div>
                    </div>
                    <div class="flex flex-col md:flex-row gap-4 mt-2">
                        <div class="w-full">
                            <span class="block text-xm font-bold text-black-700">Terms</span>
                            <p class="text-lg font-medium">{{ catalogue.terms }}</p>
                        </div>
                        <div class="w-full">
                            <span class="block text-xm font-bold text-black-700">Instruction</span>
                            <p class="text-lg font-medium">{{ catalogue.instruction }}</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Right Sidebar -->
            <div class="md:w-1/3 flex flex-col gap-6">
                <!-- Advance Info -->
                <div class="card flex flex-col w-full">
                    <div class="flex items-center justify-between border-b pb-2 mb-2">
                        <div class="text-2xl font-bold text-gray-800">ℹ️ Advance Info</div>
                        <Tag :value="statusLabel(catalogue.status)" :severity="statusSeverity(catalogue.status)" />
                    </div>

                    <div class="overflow-x-auto">
                        <table class="w-full text-sm text-left text-gray-700">
                            <tbody>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Created</td>
                                    <td class="px-4 py-2 text-right">{{ catalogue.created }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">SKU</td>
                                    <td class="px-4 py-2 text-right">{{ catalogue.sku }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Type</td>
                                    <td class="px-4 py-2 text-right">{{ catalogue.type }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Purpose</td>
                                    <td class="px-4 py-2 text-right">{{ catalogue.purpose }}</td>
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
                                <tr class="border-b text-red-600">
                                    <td class="px-4 py-2 font-medium">Expiry</td>
                                    <td class="px-4 py-2 text-right">{{ catalogue.expiry }}</td>
                                </tr>
                            </tbody>
                        </table>

                        <div class="flex justify-end mt-4">
                            <div class="w-auto" v-if="catalogue.status === 1">
                                <RouterLink to="/marketing/detailEvent">
                                    <Button label="Inactivate" class="p-button-danger" size="small" />
                                </RouterLink>
                            </div>
                            <div class="w-auto" v-if="catalogue.status === 2">
                                <RouterLink to="/marketing/detailEvent">
                                    <Button label="Activate" class="p-button-success" size="small" />
                                </RouterLink>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Participant List (moved here) -->
        <div class="card flex flex-col w-full mt-8">
            <div class="text-2xl font-bold text-gray-800 border-b pb-3 mb-4">👨🏻‍💻 Redemption List</div>
            <DataTable :value="participants" :paginator="true" :rows="10" dataKey="id" :rowHover="true" responsiveLayout="scroll" class="text-sm">
                <Column header="Date Redeemed" style="min-width: 6rem">
                    <template #body="{ data }">
                        <span class="font-bold text-gray-800 hover:underline">{{ data.memberCode }}</span>
                    </template>
                </Column>

                <Column field="fullName" header="Member Name" style="min-width: 6rem"></Column>
                <Column field="date" header="Date Redeemed" style="min-width: 6rem"></Column>
                <Column field="point" header="Item  " style="min-width: 6rem; text-align: start"></Column>
            </DataTable>
        </div>
        <!-- ======================== -->
        <!-- E-Wallet Section (PIN)   -->
        <!-- ======================== -->
        <div v-if="catalogue.type === 'E-Wallet'" class="mt-8">
            <div class="card flex flex-col w-full">
                <div class="flex items-center justify-between border-b pb-2 mb-2">
                    <div class="text-2xl font-bold text-gray-800">🔑 List PIN</div>
                </div>

                <DataTable :value="encodedPins" :paginator="true" :rows="10" dataKey="id" :rowHover="true" :loading="loading">
                    <template #header>
                        <div class="flex flex-col md:flex-row items-center justify-between gap-4 w-full">
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
                            <div class="flex gap-2">
                                <Button icon="pi pi-download" class="w-10 h-10" severity="primary" @click="downloadPins" />
                            </div>
                        </div>
                    </template>

                    <template #empty> No PINs found. </template>
                    <template #loading> Loading PIN data. Please wait. </template>

                    <Column header="Pin" style="min-width: 8rem">
                        <template #body="{ data }">{{ data.pin }}</template>
                    </Column>
                    <Column header="Expiry" style="min-width: 8rem">
                        <template #body="{ data }">{{ data.expiryDate }}</template>
                    </Column>
                    <Column header="Date Used" style="min-width: 8rem">
                        <template #body="{ data }">{{ data.usedDate || '-' }}</template>
                    </Column>
                    <Column header="Status" style="min-width: 8rem">
                        <template #body="{ data }">
                            <span :class="data.pinUsedStatus ? 'text-red-600 font-medium' : 'text-green-600 font-medium'">
                                {{ data.pinUsedStatus ? 'Used' : 'Available' }}
                            </span>
                        </template>
                    </Column>
                </DataTable>
            </div>
        </div>
    </Fluid>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

const catalogue = ref({
    id: 1,
    type: 'E-Wallet', // or 'E-Voucher'
    image1URL: 'https://assets.bharian.com.my/images/articles/tng13jan_BHfield_image_socialmedia.var_1610544082.jpg',
    title: 'Touch ’n Go Reload RM20',
    sku: 'TNG20',
    valueType: 'RM',
    valueAmount: 20,
    description: 'Reload your Touch ’n Go eWallet instantly with RM20 credit.',
    terms: 'Valid for registered TNG accounts only.',
    instruction: 'Provide TNG eWallet number during redemption.',
    point1: 200,
    point2: 180,
    point3: 150,
    purpose: 'Reward',
    purposelD: 'PR001',
    totalqty: 4,
    availableqty: 3,
    expiry: '2025-12-31',
    isBirthday: 1,
    status: 1,
    created: '2025-01-01',
    deleted: 0,
    pins: [],
    vouchers: [],
    usedVouchers: 0,
    totalVouchers: 0
});

const participants = ref([
    { id: 1, fullName: 'John Doe', memberCode: '66010345610299', date: '2025-10-05', point: 120 },
    { id: 2, fullName: 'Jane Smith', memberCode: '040521250941', date: '2025-09-25', point: 90 },
    { id: 3, fullName: 'Ali Ahmad', memberCode: '02010329454432', date: '2025-08-30', point: 150 }
]);

const loading = ref(false);

// Count used pins
const usedPins = computed(() => {
    return catalogue.value.pins.filter((pin) => pin.pinUsedStatus).length;
});

// Encode pins for display
const encodedPins = computed(() => {
    return catalogue.value.pins.map((pin) => ({
        ...pin,
        pin: btoa(pin.pin).replace(/=+$/, '') // Base64 encode without trailing '='
    }));
});

// Load sample pins
const loadPins = () => {
    loading.value = true;
    setTimeout(() => {
        catalogue.value.pins = [
            { id: 1, pin: '1234-5678-9011', expiryDate: '2025-12-31', usedDate: '2025-12-31', pinUsedStatus: true },
            { id: 2, pin: '9876-5432-1098', expiryDate: '2025-11-30', usedDate: null, pinUsedStatus: false },
            { id: 3, pin: '5555-2222-3333', expiryDate: '2025-10-31', usedDate: null, pinUsedStatus: false },
            { id: 4, pin: '3757-5432-5669', expiryDate: '2025-11-30', usedDate: null, pinUsedStatus: false }
        ];
        loading.value = false;
    }, 1000);
};

const downloadPins = () => {
    const dataStr = JSON.stringify(catalogue.value.pins, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'pins.json';
    a.click();
    URL.revokeObjectURL(url);
};

onMounted(() => {
    loadPins();
});

// Status helper
const statusLabel = (status) => {
    if (status === 0) return 'Draft';
    if (status === 1) return 'Active';
    if (status === 2) return 'Inactive';
    return 'Unknown';
};

const statusSeverity = (status) => {
    if (status === 0) return 'info';
    if (status === 1) return 'success';
    if (status === 2) return 'warn';
    return 'secondary';
};
</script>
