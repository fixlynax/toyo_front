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
                    <div class="flex items-center justify-between border-b pb-2 mb-2">
                        <div class="text-2xl font-bold text-gray-800">📋 FOC Detail</div>
                    </div>

                    <DataTable :value="FOClistPrize" :paginator="true" :rows="7" dataKey="id" :rowHover="true" responsiveLayout="scroll" class="text-sm">
                        <Column header="Buy Material" style="min-width: 8rem">
                            <template #body="{ data }">
                                <div class="flex flex-col">
                                    <span class="font-bold text-gray-800">{{ data.buy_materialName }}</span>
                                    <span class="text-gray-600 text-xs mt-2">🔑 {{ data.buy_materialid }}</span>
                                </div>
                            </template>
                        </Column>

                        <!-- Prize Type -->
                        <Column field="buyQty" header="Buy Qty" style="min-width: 6rem; text-align: center"></Column>

                        
                        <Column field="freeQty" header="Free Qty" style="min-width: 6rem; text-align: center"></Column>
                        
                        <Column header="Free Material" style="min-width: 8rem">
                            <template #body="{ data }">
                                <div class="flex flex-col">
                                    <span class="font-bold text-gray-800">{{ data.free_materialName }}</span>
                                    <span class="text-gray-600 text-xs mt-2">🔑 {{ data.free_materialid }}</span>
                                </div>
                            </template>
                        </Column>
                        <column header="Status" style="min-width: 8rem">
                            <template #body="{ data }">
                                <Tag :value="data.status === 1 ? 'Active' : 'Inactive'" :severity="data.status === 1 ? 'success' : 'danger'" />
                            </template>
                        </column>
                    </DataTable>
                </div>

                 <!-- FOC Info (only if enabled) -->
                <div v-if="salesProgram.type=='MARKDOWN'" class="card flex flex-col w-full">
                    <div class="flex items-center justify-between border-b pb-2 mb-2">
                        <div class="text-2xl font-bold text-gray-800">📋 MARKDOWN Detail</div>
                    </div>

                    <DataTable :value="MARKDOWNlistPrize" :paginator="true" :rows="7" dataKey="id" :rowHover="true" responsiveLayout="scroll" class="text-sm">

                        <Column header="Material" style="min-width: 20rem">
                            <template #body="{ data }">
                                <div class="flex flex-col">
                                    <span class="font-bold text-gray-800">{{ data.materialName }}</span>
                                    <span class="text-gray-600 text-xs mt-2">🔑 {{ data.materialid }}</span>
                                </div>
                            </template>
                        </Column>

                        <!-- Prize Type -->
                        <column header="Status" style="min-width: 6rem">
                            <template #body="{ data }">
                                <Tag :value="data.status === 1 ? 'Active' : 'Inactive'" :severity="data.status === 1 ? 'success' : 'danger'" />
                            </template>
                        </column>
                    </DataTable>
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
                            </tbody>
                        </table>
                    </div>
                </div>

                <div class="card flex flex-col w-full">
                    <div class="text-2xl font-bold text-gray-800 border-b pb-3 mb-4">👨🏻‍💻 eTEN List</div>
                    <DataTable :value="etenList" :paginator="true" :rows="7" dataKey="id" :rowHover="true" responsiveLayout="scroll" class="text-sm">
                        <!-- User Column -->
                        <Column header="Dealer" style="min-width: 10rem">
                            <template #body="{ data }">
                                <div class="flex flex-col">
                                    <span class="font-bold text-gray-800">{{ data.companyName1 }}</span>
                                    <span class="text-gray-600 text-xs mt-2">🔑 {{ data.custAccountNo }}</span>
                                    <span class="text-gray-600 text-xs mt-2">📍 {{ data.state }}</span>
                                </div>
                            </template>
                        </Column>

                        <Column header="Contact" style="min-width: 8rem">
                            <template #body="{ data }">
                                <div class="flex flex-col">
                                    <span class=" text-gray-800">{{ data.emailAddress }}</span>
                                    <span class=" text-gray-800">{{ data.mobilreNumber }}</span>
                                </div>
                            </template>
                        </Column>
                    </DataTable>
                </div>
            </div>
        </div>
    </Fluid>
</template>

<script setup>
import { ref } from 'vue';

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

const etenList = [
  {
    memberCode: 'E346572',
    custAccountNo: '6080100900',
    companyName1: 'PS Tyres & Battery Auto Services Sdn. Bhd',
    phoneNumber: '+60 3-1234 5678',
    mobilreNumber: '+60 19-1234 567',
    state: 'Kuala Lumpur',
    emailAddress: 'sales@toyotires.com.my',
    status: 0
  },
  {
    memberCode: 'E234176',
    custAccountNo: '6080102300',
    companyName1: 'Toyo Auto Centre UHP Tyres Sdn Bhd',
    phoneNumber: '+60 7-2345 678',
    mobilreNumber: '+60 16-2345 678',
    state: 'Johor',
    emailAddress: 'johor@toyotires.com.my',
    status: 1
  },
  {
    memberCode: 'E127568',
    custAccountNo: '6080102301',
    companyName1: 'Tek Ming Auto Service Sdn. Bhd.',
    phoneNumber: '+60 4-3456 789',
    mobilreNumber: '+60 12-3456 789',
    state: 'Penang',
    emailAddress: 'penang@toyotires.com.my',
    status: 1
  },
  {
    memberCode: 'E127823',
    custAccountNo: '6080102302',
    companyName1: 'Apex Tyre & Car Care',
    phoneNumber: '+60 82-4567 890',
    mobilreNumber: '+60 18-4567 890',
    state: 'Selangor',
    emailAddress: 'selangor@toyotires.com.my',
    status: 1
  },
  {
    memberCode: 'E748235',
    custAccountNo: '6080114400',
    companyName1: 'JS Motorsports Sdn Bhd',
    phoneNumber: '+60 4-5678 901',
    mobilreNumber: '+60 17-5678 901',
    state: 'Selangor',
    emailAddress: 'petaling@toyotires.com.my',
    status: 1
  },
  {
    memberCode: 'E325632',
    custAccountNo: '6080125300',
    companyName1: 'Weng Tat Tyre Service',
    phoneNumber: '+60 8-7654 321',
    mobilreNumber: '+60 19-8765 432',
    state: 'Kedah',
    emailAddress: 'labuan@toyotires.com.my',
    status: 0
  }
];

const FOClistPrize = ref([
    {
        id: 1,
        salesPragramlD: 'PRG20251001',
        buy_materialid: '81114NE0304175H',
        buy_materialName: 'Toyo Proxes Sport 225/45R17',
        buyQty: 4,
        free_materialid: '81114NE0304176H',
        free_materialName: 'Toyo Proxes Sport 225/45R17',
        freeQty: 1,
        status: 1,
        created: '2025-10-01',
    },
    {
        id: 2,
        salesPragramlD: 'PRG20251002',
        buy_materialid: '81114NE0304180H',
        buy_materialName: 'Toyo Open Country A/T III 265/70R17',
        buyQty: 4,
        free_materialid: '81114NE0304181H',
        free_materialName: 'Toyo Open Country A/T III 265/70R17',
        freeQty: 1,
        status: 1,
        created: '2025-10-05',
    },
    {
        id: 3,
        salesPragramlD: 'PRG20251003',
        buy_materialid: '81114NE0304190H',
        buy_materialName: 'Toyo NanoEnergy 3 195/65R15',
        buyQty: 4,
        free_materialid: '81114NE0304191H',
        free_materialName: 'Toyo NanoEnergy 3 195/65R15',
        freeQty: 1,
        status: 1,
        created: '2025-10-10',
    },
    {
        id: 4,
        salesPragramlD: 'PRG20251004',
        buy_materialid: '81114NE0304200H',
        buy_materialName: 'Toyo Proxes R888R 255/40R18',
        buyQty: 2,
        free_materialid: '81114NE0304201H',
        free_materialName: 'Toyo Proxes R888R 255/40R18',
        freeQty: 1,
        status: 1,
        created: '2025-10-15',
    }
]);

const MARKDOWNlistPrize = ref([
    {
        id: 1,
        salesPragramlD: 'PRG20251001',
        materialid: '81114NE0304176H',
        materialName: 'Toyo Proxes Sport 225/45R17',
        status: 1,
        created: '2025-10-01',
    },
    {
        id: 2,
        salesPragramlD: 'PRG20251002',
        materialid: '81114NE0304250H',
        materialName: 'Toyo Extensa HP II 205/55R16',
        status: 1,
        created: '2025-10-08',
    },
    {
        id: 3,
        salesPragramlD: 'PRG20251003',
        materialid: '81114NE0304260H',
        materialName: 'Toyo Celsius 235/65R17',
        status: 1,
        created: '2025-10-12',
    },
    {
        id: 4,
        salesPragramlD: 'PRG20251004',
        materialid: '81114NE0304270H',
        materialName: 'Toyo Observe GSi-6 215/60R16',
        status: 1,
        created: '2025-10-18',
    }
]);
</script>
