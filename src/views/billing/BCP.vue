<template>
    <ConfirmDialog v-if="!confirmDialogMounted" />

    <div class="card p-6 space-y-6">
        <div class="text-2xl font-bold text-gray-800 border-b pb-2">
            Business Contingency Plan (FLOW NOT CONFIRMED, NEED RECHECK)
        </div>

        <!-- Step Indicators -->
        <div class="flex items-center space-x-4">
            <div class="flex items-center space-x-2">
                <div class="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center">1</div>
                <div class="font-semibold">Customer & Order Info</div>
            </div>
            <div class="flex-1 border-t"></div>
            <div class="flex items-center space-x-2" :class="sapDetails ? 'opacity-100' : 'opacity-40'">
                <div class="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center">2</div>
                <div class="font-semibold">SAP Details</div>
            </div>
            <div class="flex-1 border-t"></div>
            <div class="flex items-center space-x-2" :class="etenResult ? 'opacity-100' : 'opacity-40'">
                <div class="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center">3</div>
                <div class="font-semibold">ETEN Order Created</div>
            </div>
        </div>

        <!-- Step 1: Dealer & SAP Numbers -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
                <label class="block font-bold text-gray-700">Customer Account *</label>
                <Dropdown v-model="form.dealerAcc" :options="dealerList" optionLabel="name" optionValue="id" filter class="w-full" />
            </div>

            <div>
                <label class="block font-bold text-gray-700">SAP SO No *</label>
                <InputText v-model="form.sapSoNo" class="w-full" />
            </div>

            <div>
                <label class="block font-bold text-gray-700">SAP NO Number *</label>
                <InputText v-model="form.sapNoNumber" class="w-full" />
            </div>
        </div>

        <!-- Step 1: Check duplication -->
        <Button
            label="Check Duplication"
            class="w-full md:w-auto"
            @click="checkSAPSO"
            :loading="loading"
            :disabled="!form.sapSoNo || !form.sapNoNumber || !form.dealerAcc"
        />

        <!-- Step 2: Enter ETEN Order No only after duplication check passed -->
        <div v-if="allowETENInput" class="mt-4">
            <label class="block font-bold text-gray-700">ETEN Order No *</label>
            <InputText v-model="form.etenOrderNo" class="w-full" />
            <Button
                label="Show SAP Details"
                class="mt-2"
                @click="showSAPDetails"
                :disabled="!form.etenOrderNo"
            />
        </div>

        <!-- Step 3: SAP Details and create ETEN Order -->
        <div v-if="sapDetails" class="mt-6 border rounded p-4 bg-gray-50 space-y-4">
            <div class="font-bold text-lg text-blue-700">SAP Sales Order Details</div>
            <div><strong>Customer:</strong> {{ sapDetails.customer }}</div>
            <div><strong>Total:</strong> RM {{ sapDetails.total }}</div>

            <div class="font-semibold mt-2 mb-2">Items</div>
            <DataTable :value="sapDetails.items" class="p-datatable-sm">
                <Column field="sku" header="SKU"></Column>
                <Column field="qty" header="Quantity"></Column>
            </DataTable>

            <Button
                label="Create ETEN Order"
                class="mt-4"
                @click="createETENOrder"
                :disabled="!form.etenOrderNo"
            />
        </div>

        <!-- ETEN Result -->
        <div v-if="etenResult" class="mt-6 border rounded p-4 bg-green-50 space-y-3">
            <div class="font-bold text-lg text-green-700">ETEN Order Created</div>
            <div><strong>ETEN Order No:</strong> {{ etenResult.etenOrderNo }}</div>
            <div><strong>Dealer Acc:</strong> {{ etenResult.dealerAccount }}</div>
            <div><strong>SAP SO No:</strong> {{ etenResult.sapSoNo }}</div>
            <div><strong>SAP NO Number:</strong> {{ etenResult.sapNoNumber }}</div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';

const toast = useToast();
const confirm = useConfirm();

const loading = ref(false);
const sapDetails = ref(null);
const etenResult = ref(null);
const allowETENInput = ref(false);

// ConfirmDialog mount
const confirmDialogMounted = ref(false);
onMounted(() => confirmDialogMounted.value = true);

// Dealer list
const dealerList = ref([
    { id: 1, name: 'DA001 - ABM Dealer' },
    { id: 2, name: 'DA002 - XOX Dealer' },
    { id: 3, name: 'DA003 - Alpha Dealer' }
]);

// ETEN DB simulation
const hardcodedEtenDB = [
    { sapSoNo: 'SO1001', etenOrderNo: 'ET001' },
    { sapSoNo: 'SO1002', etenOrderNo: 'ET002' }
];

// SAP data simulation
const hardcodedSAP = {
    SO1234: { customer: 'ABM Dealer', total: 1200, items: [ { sku: 'MAT01', qty: 3 }, { sku: 'MAT02', qty: 2 } ] },
    SO5678: { customer: 'XOX Dealer', total: 800, items: [ { sku: 'MAT03', qty: 5 }, { sku: 'MAT04', qty: 1 } ] }
};

// Form state
const form = ref({ dealerAcc: null, sapSoNo: '', sapNoNumber: '', etenOrderNo: '' });

// Step 1: Check duplication
const checkSAPSO = () => {
    loading.value = true;
    sapDetails.value = null;
    etenResult.value = null;
    allowETENInput.value = false;

    // Check SAP SO duplication
    const duplicateSAP = hardcodedEtenDB.find(x => x.sapSoNo === form.value.sapSoNo);
    if (duplicateSAP) {
        toast.add({ severity: 'error', summary: 'Duplicate SAP SO', detail: 'SAP SO No already exists in ETEN', life: 3000 });
        loading.value = false;
        return;
    }

    loading.value = false;
    allowETENInput.value = true; // allow admin to enter ETEN Order No
};

// Step 2: Show SAP details after ETEN Order No is entered
const showSAPDetails = () => {
    const sapData = hardcodedSAP[form.value.sapSoNo];
    if (!sapData) {
        toast.add({ severity: 'error', summary: 'SAP Error', detail: 'No SAP details found for this SO No', life: 3000 });
        return;
    }
    sapDetails.value = sapData;
};

// Step 3: Create ETEN Order
const createETENOrder = () => {
    const duplicateETEN = hardcodedEtenDB.find(x => x.etenOrderNo === form.value.etenOrderNo);
    if (duplicateETEN) {
        toast.add({ severity: 'error', summary: 'Duplicate ETEN Order', detail: 'ETEN Order No already exists', life: 3000 });
        return;
    }

    confirm.require({
        message: 'Are you sure you want to create this ETEN order?',
        header: 'Confirm ETEN Order',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Yes, Create',
        rejectLabel: 'Cancel',
        accept: () => {
            loading.value = true;
            setTimeout(() => {
                etenResult.value = {
                    etenOrderNo: form.value.etenOrderNo,
                    dealerAccount: form.value.dealerAcc,
                    sapSoNo: form.value.sapSoNo,
                    sapNoNumber: form.value.sapNoNumber,
                    sapDetails: sapDetails.value,
                    createdAt: new Date().toISOString()
                };

                hardcodedEtenDB.push({
                    sapSoNo: form.value.sapSoNo,
                    etenOrderNo: form.value.etenOrderNo
                });

                toast.add({ severity: 'success', summary: 'Success', detail: 'ETEN ORDER CREATED', life: 3000 });

                // Reset form
                form.value.sapSoNo = '';
                form.value.sapNoNumber = '';
                form.value.etenOrderNo = '';
                sapDetails.value = null;
                allowETENInput.value = false;
                loading.value = false;
            }, 800);
        },
        reject: () => {
            toast.add({ severity: 'info', summary: 'Cancelled', detail: 'ETEN Order creation cancelled', life: 2000 });
        }
    });
};
</script>
