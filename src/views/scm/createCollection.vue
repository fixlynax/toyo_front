<template>
    <Fluid>
        <div class="flex flex-col md:flex-row gap-8">
            <div class="card flex flex-col gap-6 w-full">
                <!-- Header -->
                <div class="text-2xl font-bold text-gray-800 border-b pb-2">Create Collection</div>

                <!-- catalogue Form -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="block font-bold text-gray-700 mb-1">Dealer Name</label>
                        <InputText v-model="paramData.dealer" class="w-full" />
                    </div>
                    <div>
                        <label class="block font-bold text-gray-700 mb-1">Contact</label>
                        <InputText v-model="paramData.contact" class="w-full" />
                    </div>
                    <div>
                        <label class="block font-bold text-gray-700">Address</label>
                        <InputText v-model="paramData.address" class="w-full" />
                    </div>
                    <div>
                        <label class="block font-bold text-gray-700">REF NO</label>
                        <InputText v-model="paramData.redNo" class="w-full" />
                    </div>
                    <div>
                        <label class="block font-bold text-gray-700">Total Tire</label>
                        <InputText v-model="paramData.totalTire" class="w-full" />
                    </div>
                    <div>
                        <label class="block font-bold text-gray-700 mb-1">Schedule Date</label>
                        <Calendar v-model="paramData.scheduleDate" class="w-full" />
                    </div>
                    <div>
                        <label class="block font-bold text-gray-700 mb-1">Status</label>
                        <Dropdown v-model="paramData.status" :options="isStatusOption" optionLabel="label" optionValue="value" placeholder="Select an option" class="w-full" />
                    </div>
                </div>
                <div class="flex justify-end mt-2">
                    <div class="w-40">
                        <RouterLink to="/scm/detailCollection">
                            <Button label="Save" />
                        </RouterLink>
                    </div>
                </div>
            </div>
        </div>
    </Fluid>
</template>

<script setup>
import { ref } from 'vue';

const isStatusOption = [
    { label: 'Active', value: 1 },
    { label: 'Inactive', value: 0 }
];

const purposeOptions = [
    { label: 'Catalogue', value: 'Catalogue' },
    { label: 'Campaign', value: 'Campaign' },
    { label: 'Game', value: 'Game' }
];

/* Catalogue State */
const paramData = ref({
    dealer: '',
    contact: '',
    address: '',
    refNo: '',
    scheduleDate: '',
    collectDate: '',
    totalTire: '',
    status: '',
});

</script>
