<template>
    <Fluid>
        <div class="flex flex-col md:flex-row gap-8">
            <!-- ======================= -->
            <!-- LEFT SECTION: Product Details -->
            <!-- ======================= -->
            <div class="md:w-2/3 flex flex-col">
                <div class="card flex flex-col gap-6 w-full">
                    <!-- Header Section -->
                    <div class="flex items-center justify-between border-b pb-2">
                        <h2 class="text-2xl font-bold text-gray-800">🔘 Product Details   (BELOMMMMM SIAPPPP)</h2>
                    </div>

                    <!-- Product Info -->
                    <div class="mt-2 flex flex-col gap-6">
                        <!-- General Information -->
                        <div>
                            <h3 class="text-xl font-bold text-gray-700 mb-4 border-b">General Information</h3>
                            <div class="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p class="text-lg font-semibold text-gray-700">Pattern</p>
                                    <p class="text-gray-900">{{ product.pattern }}</p>
                                </div>
                                <div>
                                    <p class="text-lg font-semibold text-gray-700">Size</p>
                                    <p class="text-gray-900">{{ product.size }}</p>
                                </div>
                                <div class="col-span-1">
                                    <p class="text-lg font-semibold text-gray-700">Description</p>
                                    <p class="text-gray-700">{{ product.desc }}</p>
                                </div>
                                <div>
                                    <p class="text-lg font-semibold text-gray-700">MFG Code</p>
                                    <p class="text-gray-700">{{ product.mfgcode }}</p>
                                </div>
                            </div>
                        </div>

                        <!-- Tyre Specifications -->
                        <div class="mt-4">
                            <h3 class="text-xl font-bold text-gray-700 mb-4 border-b">Tyre Specifications</h3>
                            <div class="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p class="text-lg font-semibold text-gray-700">Tyre Size Type</p>
                                    <p class="text-gray-700">{{ product.tyresize }}</p>
                                </div>
                                <div>
                                    <p class="text-lg font-semibold text-gray-700">Tyre Spec</p>
                                    <p class="text-gray-700">{{ product.tyrespec }}</p>
                                </div>
                                <div>
                                    <p class="text-lg font-semibold text-gray-700">Rim Diameter</p>
                                    <p class="text-gray-700">{{ product.rimDiameter }}"</p>
                                </div>
                                <div>
                                    <p class="text-lg font-semibold text-gray-700">Aspect Ratio</p>
                                    <p class="text-gray-700">{{ product.aspectRatio }}</p>
                                </div>
                                <div>
                                    <p class="text-lg font-semibold text-gray-700">Section Width</p>
                                    <p class="text-gray-700">{{ product.sectionWidth }}</p>
                                </div>
                            </div>
                        </div>

                        <!-- Performance Info -->
                        <div class="mt-4">
                            <h3 class="text-xl font-bold text-gray-700 mb-4 border-b">Performance Info</h3>
                            <div class="grid grid-cols-3 gap-4 text-sm">
                                <div>
                                    <p class="text-lg font-semibold text-gray-700">Load Index</p>
                                    <p class="text-gray-700">{{ product.loadIndex }}</p>
                                </div>
                                <div>
                                    <p class="text-lg font-semibold text-gray-700">Ply Rating</p>
                                    <p class="text-gray-700">{{ product.plyRating }}</p>
                                </div>
                                <div>
                                    <p class="text-lg font-semibold text-gray-700">Week Code</p>
                                    <p class="text-gray-700">{{ product.weekcode }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- ======================= -->
            <!-- RIGHT SECTION: Additional Info -->
            <!-- ======================= -->
            <div class="md:w-1/3 flex flex-col">
                <div class="card flex flex-col w-full">
                    <!-- Header with Status -->
                    <div class="flex items-center justify-between border-b pb-2 mb-2">
                        <h2 class="text-2xl font-bold text-gray-800">ℹ️ Additional Info</h2>
                        
                    </div>

                    <!-- Info Table -->
                    <div class="overflow-x-auto">
                        <table class="w-full text-sm text-left text-gray-700">
                            <tbody>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Warranty Register ID</td>
                                    <td class="px-4 py-2 text-right">{{ product.warrantyRegisterID }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Origin</td>
                                    <td class="px-4 py-2 text-right">{{ product.origin }}</td>
                                </tr>

                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Status</td>
                                    <td class="px-4 py-2 text-right font-semibold">{{ product.status }}</td>
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

const showRejectReason = ref(false);
const rejectReason = ref('');

const product = ref({
    id: 1,
    warrantyRegisterID: 1001,
    pattern: 'Proxes T1R',
    rimDiameter: 17,
    aspectRatio: '45',
    sectionWidth: '215',
    tyreSize: '215/45R17',
    loadIndex: '91',
    plyRating: 'XL',
    deleted: null,
    status: 'Non-Waranty',
    size: '215/45R17',
    origin: 'Japan',
    desc: 'High-performance tire for sports cars',
    mfgcode: 'MFG-2025-001',
    tyresize: 'Passenger Car',
    tyrespec: '91W',
    weekcode: '3524'
});

// Reject submission handler
const submitReject = () => {
    console.log('Rejected with reason:', rejectReason.value);
    showRejectReason.value = false;
    rejectReason.value = '';
};

// Helper functions for status label
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
