<template>
    <Fluid>
        <div class="flex flex-col md:flex-row gap-8">
            <!-- LEFT SIDE (2/3) -->
            <div class="md:w-2/3 flex flex-col">
                <!-- Detail Event -->
                <div class="card flex flex-col w-full">
                    <div class="flex items-center justify-between border-b pb-2">
                        <div class="text-2xl font-bold text-gray-800">Sales Program Detail</div>
                        <div class="inline-flex items-center gap-2">
                            <!-- Edit Event -->
                            <RouterLink to="/om/editSalesProgram">
                                <Button label="Edit" class="p-button-info" size="small" />
                            </RouterLink>

                            <!-- Delete Event -->
                            <Button label="Delete" class="p-button-danger" size="small" />
                        </div>
                    </div>

                    <!-- Event Images -->
                    <div class="grid grid-cols-1 gap-4 mt-4">
                        <img :src="salesProgram.image" alt="Sales Program Image 1" class="rounded-xl shadow-sm object-cover w-full h-80" />
                    </div>

                    <!-- Event Info -->
                    <div class="mt-6">
                        <h1 class="text-2xl font-bold text-gray-800">{{ salesProgram.title }}</h1>
                        <p class="text-lg font-medium">{{ salesProgram.desc }}</p>

                        <div class="flex flex-col md:flex-row gap-4 mt-3">
                            <div class="w-full">
                                <span class="block text-xm font-bold text-black-700">Start Date</span>
                                <p class="text-lg font-medium">{{ salesProgram.startDate }}</p>
                            </div>
                            <div class="w-full">
                                <span class="block text-xm font-bold text-black-700">End Date</span>
                                <p class="text-lg font-medium">{{ salesProgram.endDate }}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- FOC Info (only if enabled) -->
                <div v-if="salesProgram.type=='FOC'" class="card flex flex-col w-full">
                    <div class="flex items-center justify-between border-b pb-2 mb-4">
                        <div class="text-2xl font-bold text-gray-800">📋 FOC Criteria</div>
                        <div class="text-sm text-gray-600">
                            Total {{ criteriaList.length }} criteria
                        </div>
                    </div>

                    <!-- Criteria Cards -->
                    <div class="space-y-6">
                        <div v-for="(criteria, criteriaIndex) in criteriaList" :key="criteria.material" 
                             class="border border-gray-200 rounded-xl p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
                            <!-- Criteria Header -->
                            <div class="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
                                <div class="flex items-center gap-3">
                                    <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shadow-sm">
                                        <span class="text-white font-bold text-sm">{{ criteriaIndex + 1 }}</span>
                                    </div>
                                    <h3 class="font-semibold text-lg text-gray-800">Criteria {{ criteriaIndex + 1 }}</h3>
                                </div>
                                <div class="flex items-center gap-2">
                                    <span class="text-sm font-medium text-gray-600">Buy {{ criteria.buyQty }}, Get {{ criteria.freeQty }} Free</span>
                                    <Tag :value="criteria.status === 1 ? 'Active' : 'Inactive'" 
                                         :severity="criteria.status === 1 ? 'success' : 'danger'" />
                                </div>
                            </div>

                            <!-- Criteria Content -->
                            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <!-- Buy Materials Section -->
                                <div>
                                    <h4 class="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                        <i class="pi pi-shopping-cart text-blue-600"></i>
                                        Buy Materials ({{ criteria.buyMaterials.length }})
                                    </h4>
                                    <div class="space-y-3">
                                        <div v-for="material in criteria.buyMaterials" :key="material.material" 
                                             class="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                            <img :src="material.image || '/demo/images/event-toyo-1.jpg'" 
                                                 :alt="material.material" class="w-12 h-12 object-cover rounded-md shadow-sm" />
                                            <div class="flex-1 min-w-0">
                                                <div class="font-medium text-sm text-blue-800">{{ material.material }}</div>
                                                <div class="text-xs text-blue-600 truncate">{{ material.material }}</div>
                                                <div class="flex flex-wrap items-center gap-2 mt-1">
                                                    <span class="text-xs bg-white px-2 py-0.5 rounded text-blue-700 border border-blue-200">
                                                        Pattern: {{ material.pattern }}
                                                    </span>
                                                    <span class="text-xs bg-white px-2 py-0.5 rounded text-blue-700 border border-blue-200">
                                                        Rim: {{ material.rimDiameter }}"
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Free Material Section -->
                                <div>
                                    <h4 class="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                        <i class="pi pi-gift text-green-600"></i>
                                        Free Material
                                    </h4>
                                    <div v-if="criteria.freeMaterial" class="flex items-center gap-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                                        <img :src="criteria.freeMaterial.image || '/demo/images/event-toyo-1.jpg'" 
                                             :alt="criteria.freeMaterial.material" class="w-16 h-16 object-cover rounded-lg shadow-sm" />
                                        <div class="flex-1">
                                            <div class="font-semibold text-green-800 text-sm mb-1">{{ criteria.freeMaterial.material }}</div>
                                            <div class="text-xs text-green-600 mb-2">{{ criteria.freeMaterial.material }}</div>
                                            <div class="flex flex-wrap items-center gap-2">
                                                <span class="text-xs bg-white px-2 py-0.5 rounded text-green-700 border border-green-200">
                                                    Pattern: {{ criteria.freeMaterial.pattern }}
                                                </span>
                                                <span class="text-xs bg-white px-2 py-0.5 rounded text-green-700 border border-green-200">
                                                    Rim: {{ criteria.freeMaterial.rimDiameter }}"
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div v-else class="text-center py-6 border-2 border-dashed border-gray-300 rounded-lg">
                                        <i class="pi pi-gift text-3xl text-gray-300 mb-2"></i>
                                        <p class="text-gray-500 text-sm">No free material selected</p>
                                    </div>
                                </div>
                            </div>

                            <!-- Quantities Summary -->
                            <div class="mt-4 pt-4 border-t border-gray-100">
                                <div class="grid grid-cols-2 gap-4 text-center">
                                    <div class="bg-blue-50 rounded-lg p-3">
                                        <div class="text-2xl font-bold text-blue-600">{{ criteria.buyQty }}</div>
                                        <div class="text-sm text-blue-700 font-medium">Buy Quantity</div>
                                    </div>
                                    <div class="bg-green-50 rounded-lg p-3">
                                        <div class="text-2xl font-bold text-green-600">{{ criteria.freeQty }}</div>
                                        <div class="text-sm text-green-700 font-medium">Free Quantity</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Empty State -->
                    <div v-if="criteriaList.length === 0" class="text-center py-8 text-gray-500">
                        <i class="pi pi-inbox text-4xl text-gray-300 mb-3"></i>
                        <p class="text-lg">No criteria defined</p>
                        <p class="text-sm">Add criteria to define promotion rules</p>
                    </div>
                </div>
            </div>

            <!-- RIGHT SIDE (1/3) -->
            <div class="md:w-1/3 flex flex-col">
                <!-- Advance Info -->
                <div class="card flex flex-col w-full">
                    <div class="flex items-center justify-between border-b pb-2 mb-2">
                        <div class="text-2xl font-bold text-gray-800">ℹ️ Advance Info</div>
                        <Tag :value="salesProgram.status === 1 ? 'Active' : 'Inactive'" :severity="salesProgram.status === 1 ? 'success' : 'danger'" />
                    </div>

                    <div class="overflow-x-auto">
                        <table class="w-full text-sm text-left text-gray-700">
                            <tbody>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Program No</td>
                                    <td class="px-4 py-2 text-right">{{ salesProgram.programId }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Created</td>
                                    <td class="px-4 py-2 text-right">{{ salesProgram.created }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Type</td>
                                    <td class="px-4 py-2 text-right">{{ salesProgram.type }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Price Group</td>
                                    <td class="px-4 py-2 text-right">{{ salesProgram.priceGroup }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Total Criteria</td>
                                    <td class="px-4 py-2 text-right">{{ criteriaList.length }}</td>
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
import { ref, computed } from 'vue';

const salesProgram = ref({
    programId: 'ABC4321',
    etenUserID: '1,5,10,12,13,11,7',
    priceGroup: '06',
    type: 'FOC',
    title: 'Year End Discount',
    desc: 'Exclusive year-end discounts on selected Toyo Tires models. Limited time offer!',
    image: '/demo/images/event-toyo-2.jpg',
    startDate: '2025-09-01',
    endDate: '2025-10-30',
    status: 1,
    created: '2025-09-08'
});

// Sample materials data
const materialsData = ref([
    {
        id: 39,
        materialID: '51113735003175T',
        material: '175/70R13 8ZT TOYO 350',
        materialType: 'ZTRD',
        pattern: '735',
        patternName: 'Toyo 350',
        rimDiameter: 13,
        image: '/demo/images/event-toyo-1.jpg'
    },
    {
        id: 363,
        materialID: '51114510003115T',
        material: '1115/70D14 TEMPORARY SPARE SS...',
        materialType: 'ZTRD',
        pattern: '510',
        patternName: '(NULL)',
        rimDiameter: 14,
        image: '/demo/images/event-toyo-1.jpg'
    },
    {
        id: 364,
        materialID: '51114735003185T',
        material: '185/70R14 8ST TOYO 350',
        materialType: 'ZTRD',
        pattern: '735',
        patternName: '(NULL)',
        rimDiameter: 14,
        image: '/demo/images/event-toyo-1.jpg'
    },
    {
        id: 365,
        materialID: '51114735004175T',
        material: '175/65R14 8ZT TOYO 350',
        materialType: 'ZTRD',
        pattern: '735',
        patternName: '(NULL)',
        rimDiameter: 14,
        image: '/demo/images/event-toyo-1.jpg'
    },
    {
        id: 366,
        materialID: '51114735004185T',
        material: '185/65R14 8GT TOYO 350',
        materialType: 'ZTRD',
        pattern: '735',
        patternName: '(NULL)',
        rimDiameter: 14,
        image: '/demo/images/event-toyo-1.jpg'
    },
    {
        id: 367,
        materialID: '51114735005185T',
        material: '185/60R14 8ZT TOYO 350',
        materialType: 'ZTRD',
        pattern: '735',
        patternName: '(NULL)',
        rimDiameter: 14,
        image: '/demo/images/event-toyo-1.jpg'
    },
    {
        id: 40,
        materialID: '51115735004175T',
        material: '175/65R15 8HT TOYO 350',
        materialType: 'ZTRD',
        pattern: '735',
        patternName: 'Toyo 350',
        rimDiameter: 15,
        image: '/demo/images/event-toyo-1.jpg'
    },
    {
        id: 368,
        materialID: '51115735004185T',
        material: '185/65R15 8BT TOYO 350',
        materialType: 'ZTRD',
        pattern: '735',
        patternName: '(NULL)',
        rimDiameter: 15,
        image: '/demo/images/event-toyo-1.jpg'
    },
    {
        id: 369,
        materialID: '51115735004195T',
        material: '195/65R15 9TT TOYO 350',
        materialType: 'ZTRD',
        pattern: '735',
        patternName: '(NULL)',
        rimDiameter: 15,
        image: '/demo/images/event-toyo-1.jpg'
    },
    {
        id: 41,
        materialID: '51115735004205T',
        material: '205/65R15 9HT TOYO 350',
        materialType: 'ZTRD',
        pattern: '735',
        patternName: 'Toyo 350',
        rimDiameter: 15,
        image: '/demo/images/event-toyo-1.jpg'
    },
    {
        id: 370,
        materialID: '51115735005185T',
        material: '185/60R15 8HT TOYO 350',
        materialType: 'ZTRD',
        pattern: '735',
        patternName: '(NULL)',
        rimDiameter: 15,
        image: '/demo/images/event-toyo-1.jpg'
    },
    {
        id: 371,
        materialID: '51115735005195T',
        material: '195/60R15 8BT TOYO 350',
        materialType: 'ZTRD',
        pattern: '735',
        patternName: '(NULL)',
        rimDiameter: 15,
        image: '/demo/images/event-toyo-1.jpg'
    }
    // ... (rest of the materials array remains the same)
]);

// Criteria list with grouped materials
const criteriaList = ref([
    {
        material: 1,
        buyQty: 4,
        freeQty: 1,
        buyMaterials: [
            materialsData[1], // Toyo Proxes Sport 225/45R17
            materialsData[3], // Toyo Open Country A/T III 265/70R17
            materialsData[5]  // Toyo NanoEnergy 3 195/65R15
        ],
        freeMaterial: materialsData[2], // Toyo Proxes Sport 225/45R17
        status: 1,
        created: '2025-10-01'
    },
    {
        material: 2,
        buyQty: 4,
        freeQty: 1,
        buyMaterials: [
            materialsData[7], // Toyo Proxes R888R 255/40R18
            materialsData[4], // Toyo Open Country A/T III 265/70R17
            materialsData[6]  // Toyo NanoEnergy 3 195/65R15
        ],
        freeMaterial: materialsData[8], // Toyo Proxes R888R 255/40R18
        status: 1,
        created: '2025-10-05'
    },
    {
        material: 3,
        buyQty: 2,
        freeQty: 1,
        buyMaterials: [
            materialsData[1], // Toyo Proxes Sport 225/45R17
            materialsData[5]  // Toyo NanoEnergy 3 195/65R15
        ],
        freeMaterial: materialsData[3], // Toyo Open Country A/T III 265/70R17
        status: 1,
        created: '2025-10-10'
    }
]);

// Computed property to match the structure you might need for other components
const FOClistPrize = computed(() => {
    return criteriaList.value.flatMap(criteria => 
        criteria.buyMaterials.map(buyMaterial => ({
            material: `${criteria.material}-${buyMaterial.material}`,
            salesPragramlD: salesProgram.value.programId,
            buy_material: buyMaterial.material,
            buy_materialmaterial: buyMaterial.material,
            buyQty: criteria.buyQty,
            free_material: criteria.freeMaterial.material,
            free_materialmaterial: criteria.freeMaterial.material,
            freeQty: criteria.freeQty,
            status: criteria.status,
            created: criteria.created,
            criteriaId: criteria.material
        }))
    );
});
</script>