<template>
    <Fluid>
        <div class="flex flex-col md:flex-row gap-8">
            <!-- Left Content -->
            <div class="md:w-2/3">
                <div class="card flex flex-col gap-6 w-full">
                    <!-- Header -->
                    <div class="flex items-center justify-between border-b pb-2">
                        <div class="text-2xl font-bold text-gray-800">Details Catalogue</div>

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
                            <span class="block text-xm font-bold text-black-700">Expiry Date</span>
                            <p class="text-lg font-medium">{{ catalogue.expiry }}</p>
                        </div>
                        <div class="w-full">
                            <span class="block text-xm font-bold text-black-700">Quantity</span>
                            <p class="text-lg font-medium">{{ catalogue.availableqty }} of {{ catalogue.totalqty }}</p>
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
            <div class="md:w-1/3 flex flex-col">
                <!-- Quick Info -->
                <div class="card flex flex-col w-full">
                    <div class="flex items-center justify-between border-b pb-2 mb-2">
                        <div class="text-2xl font-bold text-gray-800">ℹ️ Advance Info</div>
                        <Tag :value="statusLabel(catalogue.status)" :severity="statusSeverity(catalogue.status)" />
                    </div>

                    <div class="overflow-x-auto">
                        <table class="w-full text-sm text-left text-gray-700">
                            <tbody>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">SKU</td>
                                    <td class="px-4 py-2 text-right">{{ catalogue.sku }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Type</td>
                                    <td class="px-4 py-2 text-right">{{ catalogue.type }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Purpose ID</td>
                                    <td class="px-4 py-2 text-right">{{ catalogue.purposelD }}</td>
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
                                    <td class="px-4 py-2 font-medium">Created</td>
                                    <td class="px-4 py-2 text-right">{{ catalogue.created }}</td>
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
        <!-- ======================== -->
        <!-- E-Voucher Section        -->
        <!-- ======================== -->
        <div v-if="catalogue.type === 'E-Voucher'" class="mt-8">
            <div class="card flex flex-col w-full">
                <div class="flex items-center justify-between border-b pb-2 mb-2">
                    <div class="text-2xl font-bold text-gray-800">🎟️ E-Voucher Management</div>
                </div>

                <DataTable :value="catalogue.vouchers" :paginator="true" :rows="10" dataKey="id" :rowHover="true" :loading="loading.value">
                    <template #header>
                        <div class="flex flex-col md:flex-row items-center justify-between gap-4 w-full">
                            <div class="flex gap-4 w-full md:w-auto">
                                <div class="w-32">
                                    <label class="block font-medium text-gray-700 mb-1">Used</label>
                                    <span class="text-gray-800 font-semibold">{{ catalogue.usedVouchers }}</span>
                                </div>
                                <div class="w-32">
                                    <label class="block font-medium text-gray-700 mb-1">Total</label>
                                    <span class="text-gray-800 font-semibold">{{ catalogue.totalVouchers }}</span>
                                </div>
                            </div>

                            <div class="flex gap-2">
                                <Button icon="pi pi-download" class="w-10 h-10" severity="primary" @click="downloadVouchers" />
                                <Button icon="pi pi-upload" class="w-10 h-10" severity="success" @click="importVouchers" />
                            </div>
                        </div>
                    </template>

                    <template #empty> No vouchers found. </template>
                    <template #loading> Loading vouchers data. Please wait. </template>

                    <Column header="Voucher Code" style="min-width: 10rem">
                        <template #body="{ data }"> {{ data.code }} </template>
                    </Column>
                    <Column header="Expiry" style="min-width: 8rem">
                        <template #body="{ data }"> {{ data.expiry }}</template>
                    </Column>
                    <Column header="Date Used" style="min-width: 8rem">
                        <template #body="{ data }"> {{ data.used || '-' }}</template>
                    </Column>
                    <Column header="Status" style="min-width: 8rem">
                        <template #body="{ data }">
                            <span :class="data.status === 'Used' ? 'text-red-500 font-semibold' : 'text-green-500 font-semibold'">
                                {{ data.status }}
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
    vouchers: [
        { id: 1, code: 'SBX-2025-0001', expiry: '2025-12-31', used: '2025-09-10', status: 'Used' },
        { id: 2, code: 'SBX-2025-0002', expiry: '2025-12-31', used: null, status: 'Available' },
        { id: 3, code: 'SBX-2025-0003', expiry: '2025-11-30', used: null, status: 'Available' },
        { id: 4, code: 'SBX-2025-0004', expiry: '2025-10-31', used: '2025-09-20', status: 'Used' },
        { id: 5, code: 'SBX-2025-0005', expiry: '2025-12-31', used: null, status: 'Available' }
    ],
    usedVouchers: 2, // Total vouchers marked as 'Used'
    totalVouchers: 5 // Total vouchers in the list
});

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

const importPins = () => {
    alert('Import PIN logic goes here.');
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
