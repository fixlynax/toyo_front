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
                            <span class="block text-sm text-gray-500">Value Type</span>
                            <p class="text-lg font-medium">{{ catalogue.valueType }}</p>
                        </div>
                        <div class="w-full">
                            <span class="block text-sm text-gray-500">Value Amount</span>
                            <p class="text-lg font-medium">{{ catalogue.valueAmount }}</p>
                        </div>
                    </div>
                    <div class="flex flex-col md:flex-row gap-4 mt-2">
                        <div class="w-full">
                            <span class="block text-sm text-gray-500">Expiry Date</span>
                            <p class="text-lg font-medium">{{ catalogue.expiry }}</p>
                        </div>
                        <div class="w-full">
                            <span class="block text-sm text-gray-500">Quantity</span>
                            <p class="text-lg font-medium">{{ catalogue.availableqty }} of {{ catalogue.totalqty }}</p>
                        </div>
                    </div>
                    <div class="flex flex-col md:flex-row gap-4 mt-2">
                        <div class="w-full">
                            <span class="block text-sm text-gray-500">Terms</span>
                            <p class="text-lg font-medium">{{ catalogue.terms }}</p>
                        </div>
                        <div class="w-full">
                            <span class="block text-sm text-gray-500">Instruction</span>
                            <p class="text-lg font-medium">{{ catalogue.instruction }}</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Right Sidebar -->
            <div class="md:w-1/3 flex flex-col">
                <!-- Quick Info -->
                <div class="card flex flex-col w-full">
                    <!-- Header with Status on Right -->
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
    </Fluid>
</template>

<script setup>
import { ref } from 'vue';

const catalogue = ref({
    id: 1,
    type: 'E-Wallet',
    image1URL: 'https://assets.bharian.com.my/images/articles/tng13jan_BHfield_image_socialmedia.var_1610544082.jpg',
    image2URL: '/demo/images/event-toyo-1.jpg',
    image3URL: '/demo/images/event-toyo-1.jpg',
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
    totalqty: 500,
    availableqty: 420,
    expiry: '2025-12-31',
    isBirthday: 0,
    status: 1,
    created: '2025-01-01',
    deleted: 0
});

// helper functions for tag
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
