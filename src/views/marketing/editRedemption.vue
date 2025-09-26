<template>
    <Fluid>
        <div class="flex flex-col md:flex-row gap-8">
            <!-- ======================= -->
            <!-- LEFT SECTION: Redemption & Shipping Edit -->
            <!-- ======================= -->
            <div class="md:w-2/3 flex flex-col gap-8">
                <!-- Redemption Details (Read-only) -->
                <div class="card flex flex-col gap-6 w-full">
                    <div class="flex items-center justify-between border-b pb-2">
                        <h2 class="text-2xl font-bold text-gray-800">🎁 Redemption Details</h2>
                    </div>

                    <div class="mt-2 grid grid-cols-2 gap-4">
                        <div>
                            <p class="text-xl font-bold text-black-700">Recipient</p>
                            <p class="text-lg text-black-900">{{ redemption.recipientName }}</p>
                        </div>
                        <div>
                            <p class="text-xl font-bold text-black-700">Contact</p>
                            <p class="text-lg text-black-500">{{ redemption.contactNumber }}</p>
                        </div>
                        <div>
                            <p class="mt-2 text-xl font-bold text-black-700">Redeemed Item</p>
                            <p class="text-lg text-black-500">{{ redemption.itemName }}</p>
                        </div>
                    </div>
                </div>

                <!-- Shipping Details (Editable) -->
                <div class="card flex flex-col gap-6 w-full">
                    <div class="flex items-center justify-between border-b pb-2">
                        <h2 class="text-2xl font-bold text-gray-800">🚚 Edit Shipping Details</h2>
                    </div>

                    <div class="grid grid-cols-4 gap-4">
                        <!-- Recipient Name -->
                        <div class="col-span-2">
                            <label class="block text-gray-700 font-semibold">Recipient</label>
                            <InputText 
                                v-model="form.recipientName" 
                                type="text" 
                                class="w-full border p-2 rounded"
                                placeholder="Recipient Name"
                            />
                        </div>

                        <!-- Contact Number -->
                        <div class="col-span-2">
                            <label class="block text-gray-700 font-semibold">Contact</label>
                            <InputText 
                                v-model="form.contactNumber" 
                                type="text" 
                                class="w-full border p-2 rounded"
                                placeholder="Contact Number"
                            />
                        </div>

                        <!-- Courier Name -->
                        <div class="col-span-2">
                            <label class="block text-gray-700 font-semibold">Courier</label>
                            <InputText 
                                v-model="form.courierName" 
                                type="text" 
                                class="w-full border p-2 rounded"
                                placeholder="Courier Name"
                            />
                        </div>

                        <!-- Tracking Number -->
                        <div class="col-span-2">
                            <label class="block text-gray-700 font-semibold">Tracking No</label>
                            <InputText 
                                v-model="form.trackingNumber" 
                                type="text" 
                                class="w-full border p-2 rounded"
                                placeholder="Tracking Number"
                            />
                        </div>

                        <!-- Address Lines -->
                        <div class="col-span-4">
                            <label class="block text-gray-700 font-semibold">Address Line 1</label>
                            <InputText 
                                v-model="form.addLine1" 
                                type="text" 
                                class="w-full border p-2 rounded"
                                placeholder="Street Address"
                            />
                        </div>
                        <div class="col-span-4">
                            <label class="block text-gray-700 font-semibold">Address Line 2</label>
                            <InputText 
                                v-model="form.addLine2" 
                                type="text" 
                                class="w-full border p-2 rounded"
                                placeholder="Apartment, Suite, etc. (optional)"
                            />
                        </div>

                        <!-- City & State -->
                        <div class="col-span-2">
                            <label class="block text-gray-700 font-semibold">City</label>
                            <InputText 
                                v-model="form.addCity" 
                                type="text" 
                                class="w-full border p-2 rounded"
                                placeholder="City"
                            />
                        </div>
                        <div class="col-span-2">
                            <label class="block text-gray-700 font-semibold">State</label>
                            <InputText 
                                v-model="form.addState" 
                                type="text" 
                                class="w-full border p-2 rounded"
                                placeholder="State"
                            />
                        </div>

                        <!-- Postcode & Country -->
                        <div class="col-span-2">
                            <label class="block text-gray-700 font-semibold">Postcode</label>
                            <InputText 
                                v-model="form.addPostcode" 
                                type="text" 
                                class="w-full border p-2 rounded"
                                placeholder="Postcode"
                            />
                        </div>
                        <div class="col-span-2">
                            <label class="block text-gray-700 font-semibold">Country</label>
                            <InputText 
                                v-model="form.addCountry" 
                                type="text" 
                                class="w-full border p-2 rounded"
                                placeholder="Country"
                            />
                        </div>
                    </div>

                    <!-- Action Buttons -->
                    <div class="flex justify-end mt-6 gap-2">
                        <RouterLink to="/marketing/detailRedemption">
                            <Button label="Cancel" class="p-button-secondary" size="small" />
                        </RouterLink>
                        <div>
                        <Button 
                            label="Update" 
                            class="p-button-success" 
                            size="small" 
                            @click="saveChanges"
                        />
                        </div>
                    </div>
                </div>
            </div>

            <!-- ======================= -->
            <!-- RIGHT SECTION: Advance Info -->
            <!-- ======================= -->
            <div class="md:w-1/3 flex flex-col">
                <div class="card flex flex-col w-full">
                    <div class="flex items-center justify-between border-b pb-2 mb-2">
                        <h2 class="text-2xl font-bold text-gray-800">ℹ️ Advance Info</h2>
                        <Tag 
                            :value="statusLabel(redemption.status)" 
                            :severity="statusSeverity(redemption.status)" 
                        />
                    </div>

                    <div class="overflow-x-auto">
                        <table class="w-full text-sm text-left text-gray-700">
                            <tbody>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">RefNo</td>
                                    <td class="px-4 py-2 text-right">{{ redemption.refno }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Member Level</td>
                                    <td class="px-4 py-2 text-right">{{ redemption.memberLevel }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Redeem Date</td>
                                    <td class="px-4 py-2 text-right">{{ redemption.redemptionDate }}</td>
                                </tr>
                                <tr class="border-b" v-if="redemption.shippedDate">
                                    <td class="px-4 py-2 font-medium">Shipped Date</td>
                                    <td class="px-4 py-2 text-right">{{ redemption.shippedDate }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Created</td>
                                    <td class="px-4 py-2 text-right">{{ redemption.created }}</td>
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
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// Dummy redemption data
const redemption = ref({
    id: 1,
    refno: 'TYO-MY-1001',
    memberLevel: 'Gold',
    recipientName: 'Ahmad Faizal',
    contactNumber: '012-3456789',
    addLine1: 'No. 12, Jalan Melur',
    addLine2: 'Taman Melawati',
    addCity: 'Kuala Lumpur',
    addState: 'Selangor',
    addPostcode: '53100',
    addCountry: 'Malaysia',
    itemName: 'Bluetooth Headphones',
    redemptionDate: '2024-03-15',
    courierName: 'DHL Express',
    trackingNumber: 'DHLMY10001',
    shippedDate: '2024-04-01',
    status: 'Packing',
    created: '2024-03-25'
});

// Form initialized with redemption data
const form = ref({ ...redemption.value });

// Save Changes
const saveChanges = () => {
    console.log('Updated Shipping Info:', form.value);

    // Here you can send `form.value` to the backend
    alert('Shipping details updated successfully!');
    router.push('/marketing/detailRedemption');
};

// Status Helpers
const statusLabel = (status) => {
    if (status === 'Packing') return 'Packing';
    if (status === 'Shipped') return 'Shipped';
    if (status === 'Delivered') return 'Delivered';
    return 'Unknown';
};

const statusSeverity = (status) => {
    if (status === 'Packing') return 'info';
    if (status === 'Shipped') return 'warn';
    if (status === 'Delivered') return 'success';
    return 'secondary';
};
</script>
