<template>
    <Fluid>
        <div class="flex flex-col md:flex-row gap-8">
            <!-- LEFT: Product Information -->
            <div class="md:w-2/3 flex flex-col gap-6">
                <!-- Tyre Specifications -->
                <div class="card flex flex-col gap-6 w-full">
                    <div class="flex items-center justify-between border-b pb-2">
                        <h2 class="text-2xl font-bold text-gray-800">🔘 Tyre Specifications</h2>
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <span class="text-sm font-bold text-gray-700">Tyre Size Type</span>
                            <p class="text-lg font-medium">{{ product.tyresize }}</p>
                        </div>
                        <div>
                            <span class="text-sm font-bold text-gray-700">Tyre Spec</span>
                            <p class="text-lg font-medium">{{ product.tyrespec }}</p>
                        </div>
                        <div>
                            <span class="text-sm font-bold text-gray-700">Rim Diameter</span>
                            <p class="text-lg font-medium">{{ product.rimDiameter }}"</p>
                        </div>
                        <div>
                            <span class="text-sm font-bold text-gray-700">Aspect Ratio</span>
                            <p class="text-lg font-medium">{{ product.aspectRatio }}</p>
                        </div>
                        <div>
                            <span class="text-sm font-bold text-gray-700">Section Width</span>
                            <p class="text-lg font-medium">{{ product.sectionWidth }}</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- RIGHT: Additional Info -->
            <div class="md:w-1/3 flex flex-col">
                <div class="card flex flex-col w-full">
                    <div class="flex items-center justify-between border-b pb-2 mb-2">
                        <h2 class="text-2xl font-bold text-gray-800">📊 Performance Info</h2>
                      
                    </div>
                    <div class="overflow-x-auto">
                        <table class="w-full text-sm text-left text-gray-700">
                            <tbody>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Load Index</td>
                                    <td class="px-4 py-2 text-right">{{ product.loadIndex }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Ply Rating</td>
                                    <td class="px-4 py-2 text-right">{{ product.plyRating }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Week Code</td>
                                    <td class="px-4 py-2 text-right font-semibold">{{ product.weekcode }}</td>
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
</script>
