<template>
    <Fluid>
        <div class="flex flex-col gap-8">
            <!-- TOP SECTION: Detail Event + Advance Info -->
            <div class="flex flex-col md:flex-row gap-8">
                <!-- LEFT SIDE (2/3) -->
                <div class="md:w-2/3 flex flex-col">
                    <!-- Detail Event -->
                    <div class="card flex flex-col w-full">
                        <div class="flex items-center justify-between border-b pb-2">
                            <div class="text-2xl font-bold text-gray-800">Sales Program Detail</div>
                            <div class="inline-flex items-center gap-2">
                                <RouterLink to="/om/editSalesProgram">
                                    <Button label="Edit" class="p-button-info" size="small" />
                                </RouterLink>
                                <Button label="Delete" class="p-button-danger" size="small" />
                            </div>
                        </div>

                        <!-- Event Images -->
                        <div class="grid grid-cols-1 gap-4 mt-4">
                            <img :src="salesProgram.image" alt="Sales Program Image" class="rounded-xl shadow-sm object-cover w-full h-80" />
                        </div>

                        <!-- Event Info -->
                        <div class="mt-6">
                            <h1 class="text-2xl font-bold text-gray-800">{{ salesProgram.title }}</h1>
                            <p class="text-lg font-medium">{{ salesProgram.desc }}</p>

                            <div class="flex flex-col md:flex-row gap-4 mt-3">
                                <div class="w-full">
                                    <span class="block text-sm font-bold text-gray-700">Start Date</span>
                                    <p class="text-lg font-medium">{{ salesProgram.startDate }}</p>
                                </div>
                                <div class="w-full">
                                    <span class="block text-sm font-bold text-gray-700">End Date</span>
                                    <p class="text-lg font-medium">{{ salesProgram.endDate }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- RIGHT SIDE -->
                <div class="md:w-1/3 flex flex-col">
                    <div class="card flex flex-col w-full">
                        <div class="flex items-center justify-between border-b pb-2 mb-2">
                            <div class="text-2xl font-bold text-gray-800">ℹ️ Advance Info</div>
                            <Tag :value="salesProgram.status === 1 ? 'Active' : 'Inactive'"
                                 :severity="salesProgram.status === 1 ? 'success' : 'danger'" />
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

            <!-- ✅ FOC INFO FULL SCREEN SECTION -->
            <div v-if="salesProgram.type === 'FOC'" class="card flex flex-col w-full">
                <div class="flex items-center justify-between border-b pb-2 mb-2">
                    <div class="text-2xl font-bold text-gray-800">📋 FOC Criteria</div>
                    <div class="text-sm text-gray-600">
                        Total {{ criteriaList.length }} criteria
                    </div>
                </div>

                <!-- Criteria Cards -->
                <div v-if="criteriaList.length" class="space-y-6">
                    <div
                        v-for="(criteria, criteriaIndex) in criteriaList"
                        :key="criteria.material"
                        class="border border-gray-200 rounded-xl p-6 bg-white shadow-sm hover:shadow-md transition-shadow"
                    >
                        <!-- Header -->
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

                        <!-- Content -->
                        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <!-- Buy Materials -->
                            <div>
                                <h4 class="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                    <i class="pi pi-shopping-cart text-blue-600"></i>
                                    Buy Materials ({{ criteria.buyMaterials.length }})
                                </h4>
                                <div class="space-y-3">
                                    <div
                                        v-for="material in criteria.buyMaterials"
                                        :key="material.id"
                                        class="p-3 bg-blue-50 border border-blue-200 rounded-lg"
                                    >
                                        <div class="flex flex-wrap items-center gap-2">
                                            <span class="text-xs bg-white px-2 py-1 rounded text-blue-700 border border-blue-200 font-medium">
                                                Pattern: {{ material.pattern }}
                                            </span>
                                            <span class="text-xs bg-white px-2 py-1 rounded text-blue-700 border border-blue-200 font-medium">
                                                Rim: {{ material.rimDiameter }}"
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Free Material -->
                            <div>
                                <h4 class="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                    <i class="pi pi-gift text-green-600"></i>
                                    Free Material
                                </h4>
                                <div
                                    v-if="criteria.freeMaterial"
                                    class="p-4 bg-green-50 border border-green-200 rounded-lg"
                                >
                                    <div class="flex flex-wrap items-center gap-2">
                                        <span class="text-xs bg-white px-2 py-1 rounded text-green-700 border border-green-200 font-medium">
                                            Pattern: {{ criteria.freeMaterial.pattern }}
                                        </span>
                                        <span class="text-xs bg-white px-2 py-1 rounded text-green-700 border border-green-200 font-medium">
                                            Rim: {{ criteria.freeMaterial.rimDiameter }}"
                                        </span>
                                    </div>
                                </div>
                                <div
                                    v-else
                                    class="text-center py-6 border-2 border-dashed border-gray-300 rounded-lg"
                                >
                                    <i class="pi pi-gift text-3xl text-gray-300 mb-2"></i>
                                    <p class="text-gray-500 text-sm">No free material selected</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Empty State -->
                <div v-else class="text-center py-8 text-gray-500">
                    <i class="pi pi-inbox text-4xl text-gray-300 mb-3"></i>
                    <p class="text-lg">No criteria defined</p>
                    <p class="text-sm">Add criteria to define promotion rules</p>
                </div>
            </div>
        </div>
    </Fluid>
</template>

<script setup>
import { ref, computed } from 'vue'

const salesProgram = ref({
  programId: 'ABC4321',
  priceGroup: '06',
  type: 'FOC',
  title: 'Year End Discount',
  desc: 'Exclusive year-end discounts on selected Toyo Tires models. Limited time offer!',
  image: '/demo/images/event-toyo-2.jpg',
  startDate: '2025-09-01',
  endDate: '2025-10-30',
  status: 1,
  created: '2025-09-08'
})

const materialsData = [
  {
    id: 39,
    materialID: '51113735003175T',
    material: '175/70R13 8ZT TOYO 350',
    pattern: '735',
    rimDiameter: 13,
    image: '/demo/images/event-toyo-1.jpg'
  },
  {
    id: 40,
    materialID: '51115735004175T',
    material: '175/65R15 8HT TOYO 350',
    pattern: '735',
    rimDiameter: 15,
    image: '/demo/images/event-toyo-1.jpg'
  },
  {
    id: 41,
    materialID: '51115735004205T',
    material: '205/65R15 9HT TOYO 350',
    pattern: '735',
    rimDiameter: 15,
    image: '/demo/images/event-toyo-1.jpg'
  },
  {
    id: 42,
    materialID: '51116735005225T',
    material: '225/60R16 9HT TOYO 350',
    pattern: '735',
    rimDiameter: 16,
    image: '/demo/images/event-toyo-1.jpg'
  },
  {
    id: 43,
    materialID: '51117735006245T',
    material: '245/50R17 10HT TOYO 350',
    pattern: '735',
    rimDiameter: 17,
    image: '/demo/images/event-toyo-1.jpg'
  }
]

// ✅ Added multiple criteria similar to your existing one
const criteriaList = ref([
  {
    material: 1,
    buyQty: 4,
    freeQty: 1,
    buyMaterials: [materialsData[0], materialsData[1]],
    freeMaterial: materialsData[2],
    status: 1,
    created: '2025-10-01'
  },
  {
    material: 2,
    buyQty: 6,
    freeQty: 2,
    buyMaterials: [materialsData[1], materialsData[2]],
    freeMaterial: materialsData[3],
    status: 1,
    created: '2025-10-05'
  },
  {
    material: 3,
    buyQty: 8,
    freeQty: 3,
    buyMaterials: [materialsData[2], materialsData[3]],
    freeMaterial: materialsData[4],
    status: 0,
    created: '2025-10-10'
  }
])

const FOClistPrize = computed(() =>
  criteriaList.value.flatMap(criteria =>
    criteria.buyMaterials.map(buyMaterial => ({
      material: `${criteria.material}-${buyMaterial.material}`,
      salesProgramID: salesProgram.value.programId,
      buy_material: buyMaterial.material,
      buyQty: criteria.buyQty,
      free_material: criteria.freeMaterial.material,
      freeQty: criteria.freeQty,
      status: criteria.status,
      created: criteria.created,
      criteriaId: criteria.material
    }))
  )
)
</script>