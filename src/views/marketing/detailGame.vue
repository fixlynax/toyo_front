<template>
    <Fluid>
        <div class="flex flex-col md:flex-row gap-8">
            <!-- LEFT SIDE (2/3) -->
            <div class="md:w-2/3 flex flex-col">
                <!-- Detail Event -->
                <div class="card flex flex-col w-full">
                    <div class="flex items-center justify-between border-b pb-2">
                        <div class="text-2xl font-bold text-gray-800">Game Details</div>
                        <div class="inline-flex items-center gap-2">
                            <!-- Edit Event -->
                            <RouterLink to="/marketing/editGame">
                                <Button label="Edit" class="p-button-info" size="small" />
                            </RouterLink>

                            <!-- Delete Event -->
                            <!-- const response = await api.put(`game/delete/${gameId}`); -->
                            <Button label="Delete" class="p-button-danger" size="small" />
                        </div>
                    </div>

                    <!-- Event Images -->
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                        <img :src="game.image1URL" alt="Game Image 1" class="rounded-xl shadow-sm object-cover w-full h-80" />
                        <img :src="game.image2URL" alt="Game Image 2" class="rounded-xl shadow-sm object-cover w-full h-80" />
                        <img :src="game.image3URL" alt="Game Image 3" class="rounded-xl shadow-sm object-cover w-full h-80" />
                    </div>

                    <!-- Event Info -->
                    <div class="mt-6">
                        <h1 class="text-2xl font-bold text-gray-800">{{ game.title }}</h1>
                        <p class="text-lg font-medium">{{ game.desc }}</p>

                        <div class="flex flex-col md:flex-row gap-4 mt-3">
                            <div class="w-full">
                                <span class="block text-xm font-bold text-black-700">Location</span>
                                <p class="text-lg font-medium">{{ game.location }}</p>
                            </div>
                        </div>

                        <div class="flex flex-col md:flex-row gap-4 mt-3">
                            <div class="w-full">
                                <span class="block text-xm font-bold text-black-700">Start Date</span>
                                <p class="text-lg font-medium">{{ game.startDate }}</p>
                            </div>
                            <div class="w-full">
                                <span class="block text-xm font-bold text-black-700">End Date</span>
                                <p class="text-lg font-medium">{{ game.endDate }}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Prize Info -->
                <div class="card flex flex-col w-full relative">
                    <div class="flex items-center justify-between border-b pb-2 mb-2">
                        <div class="text-2xl font-bold text-gray-800">🎁 Prize Info</div>
                    </div>

                    <DataTable :value="listPrize" :paginator="true" :rows="7" dataKey="id" :rowHover="true" responsiveLayout="scroll" class="text-sm">
                        <!-- Prize Column -->
                        <Column header="Prize" style="min-width: 10rem">
                            <template #body="{ data }">
                                <div class="flex items-center gap-3 relative group" @mouseenter="hoverPrize = data.id" @mouseleave="hoverPrize = null">
                                    <img :src="data.imageURL" alt="Prize" class="w-36 h-24 rounded-lg object-cover border" />
                                    <div class="flex flex-col">
                                        <span class="font-bold text-gray-800">{{ data.prizeName }}</span>
                                        <span class="text-gray-600 text-xs">{{ data.prizeType }}</span>
                                    </div>

                                    <!-- Tooltip for Point Type -->
                                    <div v-if="data.prizeType === 'Point' && hoverPrize === data.id" class="absolute top-0 left-20 bg-white border rounded-lg shadow-lg p-3 text-xm w-60 z-10">
                                        <div class="font-semibold text-xl text-gray-700 mb-2">🏅 Point Reward</div>
                                        <ul class="list-disc list-inside text-gray-700 space-y-1 ml-5">
                                            <li><b>Silver :</b> 80 pts</li>
                                            <li><b>Gold :</b> 90 pts</li>
                                            <li><b>Platinum :</b> 100 pts</li>
                                        </ul>
                                    </div>
                                </div>
                            </template>
                        </Column>

                        <!-- Win / Qty Column -->
                        <Column header="Win / Qty" style="min-width: 8rem">
                            <template #body="{ data }">
                                <div>{{ data.prizeRemain }} / {{ data.prizeQuota }}</div>
                            </template>
                        </Column>

                        <!-- Action Column -->
                        <Column header="Action" style="min-width: 6rem">
                            <template #body="{ data }">
                                <Button icon="pi pi-pencil" class="p-button-text p-button-info" @click="openEditDialog(data)" />
                            </template>
                        </Column>
                    </DataTable>
                </div>
            </div>

            <!-- RIGHT SIDE (1/3) -->
            <div class="md:w-1/3 flex flex-col">
                <!-- Advance Info -->
                <div class="card flex flex-col w-full">
                    <div class="flex items-center justify-between border-b pb-2 mb-2">
                        <div class="text-2xl font-bold text-gray-800">ℹ️ Advance Info</div>
                        <Tag :value="game.status === 1 ? 'Active' : 'Inactive'" :severity="game.status === 1 ? 'success' : 'danger'" />
                    </div>

                    <div class="overflow-x-auto">
                        <table class="w-full text-sm text-left text-gray-700">
                            <tbody>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Game No</td>
                                    <td class="px-4 py-2 text-right">{{ game.gameNo }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Published</td>
                                    <td class="px-4 py-2 text-right">{{ game.publishDate }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Type</td>
                                    <td class="px-4 py-2 text-right">{{ game.type }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Quota Player</td>
                                    <td class="px-4 py-2 text-right">{{ game.quota }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">Played</td>
                                    <td class="px-4 py-2 text-right">{{ game.played }}</td>
                                </tr>
                                <tr class="border-b">
                                    <td class="px-4 py-2 font-medium">QR Game</td>
                                    <td class="px-4 py-2 text-right">
                                        <div class="flex justify-end">
                                            <div class="flex flex-col items-center">
                                                <img :src="`/demo/images/qr-toyo.png`" alt="QR Game Image" class="rounded-xl shadow-sm object-cover w-30 h-20 mb-2" />
                                                <button class="bg-red-600 text-white px-3 py-1 rounded" @click="downloadQRCode">Download</button>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td class="px-4 py-2 font-medium"></td>
                                    <td class="px-4 py-2 text-right">
                                        <div class="flex justify-end">
                                            <!--  const response = await api.put(`game/toggleInactive/${gameId}`); -->
                                            <ToggleButton v-model="checked" onLabel="Inactive" offLabel="Active" onIcon="pi pi-lock" offIcon="pi pi-lock-open" class="w-36" aria-label="Do you confirm ?" />
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div class="card flex flex-col w-full">
                    <div class="flex items-center justify-between border-b pb-3 mb-4">
                        <div class="text-2xl font-bold text-gray-800">👨🏻‍💻 Participant List</div>
                        <Button icon="pi pi-file-export" label="Export" style="width: fit-content" class="p-button-danger p-button-sm" />
                    </div>
                    <DataTable :value="participants" :paginator="true" :rows="7" dataKey="id" :rowHover="true" responsiveLayout="scroll" class="text-sm">
                        <!-- User Column -->
                        <Column header="User" style="min-width: 6rem">
                            <template #body="{ data }">
                                <div class="flex flex-col">
                                    <span class="font-bold text-gray-800">{{ data.fullName }}</span>
                                    <span class="text-gray-600 text-xs mt-2">🎖️ {{ data.memberLevel }}</span>
                                    <span class="text-gray-600 text-xs mt-2">📅 {{ data.date }}</span>
                                </div>
                            </template>
                        </Column>

                        <!-- Prize Type -->
                        <Column field="prizeType" header="Type" style="min-width: 8rem"></Column>

                        <!-- Prize -->
                        <Column field="prize" header="Prize" style="min-width: 8rem"></Column>
                    </DataTable>
                </div>
            </div>
        </div>

        <!-- Edit Prize Dialog -->
        <Dialog v-model:visible="editDialogVisible" modal header="Edit Prize Quantity" :style="{ width: '400px' }">
            <div class="flex flex-col gap-3">
                <div class="font-semibold text-gray-800">{{ selectedPrize?.prizeName }}</div>
                <div class="flex items-center gap-3">
                    <label class="text-gray-700 font-medium w-20">Quota:</label>
                    <InputNumber v-model="selectedPrize.prizeQuota" :min="1" class="w-full" />
                </div>
                <div class="flex justify-end mt-4">
                    <Button label="Save" icon="pi pi-check" class="p-button-success p-button-sm" @click="savePrizeEdit" />
                </div>
            </div>
        </Dialog>
    </Fluid>
</template>

<script setup>
import { ref } from 'vue';

const hoverPrize = ref(null);
const editDialogVisible = ref(false);
const selectedPrize = ref(null);

const game = ref({
    id: 1,
    gameNo: 'GTY2025001',
    type: 'SPIN',
    title: 'Toyo Tires Knowledge Challenge',
    desc: 'Test your knowledge about Toyo Tires’ history, technology, and innovations. Win exclusive merchandise!',
    image1URL: '/demo/images/event-toyo-1.jpg',
    image2URL: '/demo/images/event-toyo-2.jpg',
    image3URL: '/demo/images/event-toyo-3.jpg',
    termCondition: 'Open to all participants in Malaysia. Each user can only attempt once.',
    location: 'Online',
    publishDate: '2025-01-10',
    startDate: '2025-01-15',
    endDate: '2025-02-15',
    quota: 1000,
    played: 32,
    point1: 80,
    point2: 85,
    point3: 90,
    point4: 95,
    status: 1,
    created: '2025-01-05',
    deleted: null
});

const listPrize = ref([
    { id: 1, prizeType: 'Point', imageURL: '/demo/images/bonus-point.png', prizeName: 'Bonus Point Toyo', prizeQuota: 50, prizeRemain: 20 },
    { id: 2, prizeType: 'E-Wallet', imageURL: 'https://assets.bharian.com.my/images/articles/tng13jan_BHfield_image_socialmedia.var_1610544082.jpg', prizeName: 'MYR 50 E-Wallet', prizeQuota: 100, prizeRemain: 40 },
    { id: 3, prizeType: 'E-Voucher', imageURL: 'https://assets.offgamers.com/img/offer/kr_fdf75033-56ee-4ce6-929c-1f9c93a4c642_1b1c60fc-e950-4c62-8ee7-471d42484619.webp', prizeName: 'Shopee E-Voucher', prizeQuota: 30, prizeRemain: 10 },
    { id: 4, prizeType: 'Item', imageURL: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdSHDEYMxmOB1Z63V0UB1ohMHGZ5cs5DG4zg&s', prizeName: 'Toyo Tumbler', prizeQuota: 15, prizeRemain: 5 }
]);

const participants = ref([
    {
        id: 1,
        fullName: 'Ahmad Faiz',
        memberLevel: 'Gold',
        date: '2025-09-01',
        point: 90,
        prizeType: 'Point',
        prize: 100 // Example prize for 'Point'
    },
    {
        id: 2,
        fullName: 'Nur Aisyah',
        memberLevel: 'Silver',
        date: '2025-09-02',
        point: 85,
        prizeType: 'E-Wallet',
        prize: 'MYR 50' // Example prize for 'E-Wallet'
    },
    {
        id: 3,
        fullName: 'Hafiz Din',
        memberLevel: 'Platinum',
        date: '2025-09-02',
        point: 95,
        prizeType: 'E-Voucher',
        prize: 'Amazon $20' // Example prize for 'E-Voucher'
    },
    {
        id: 4,
        fullName: 'Lim Wei Jian',
        memberLevel: 'Gold',
        date: '2025-09-03',
        point: 90,
        prizeType: 'Item',
        prize: 'Smartwatch' // Example prize for 'Item'
    },
    {
        id: 5,
        fullName: 'Siti Mariam',
        memberLevel: 'Silver',
        date: '2025-09-03',
        point: 85,
        prizeType: 'Point',
        prize: 50
    },
    {
        id: 6,
        fullName: 'Arjun Kumar',
        memberLevel: 'Gold',
        date: '2025-09-04',
        point: 90,
        prizeType: 'E-Wallet',
        prize: 'MYR 100'
    },
    {
        id: 7,
        fullName: 'Tan Li Ying',
        memberLevel: 'Platinum',
        date: '2025-09-04',
        point: 95,
        prizeType: 'E-Voucher',
        prize: 'Amazon $50'
    },
    {
        id: 8,
        fullName: 'Mohd Amir',
        memberLevel: 'Silver',
        date: '2025-09-05',
        point: 85,
        prizeType: 'Item',
        prize: 'Bluetooth Headphones'
    },
    {
        id: 9,
        fullName: 'Farah Nadiah',
        memberLevel: 'Gold',
        date: '2025-09-05',
        point: 90,
        prizeType: 'Point',
        prize: 75
    },
    {
        id: 10,
        fullName: 'Jason Lee',
        memberLevel: 'Platinum',
        date: '2025-09-06',
        point: 95,
        prizeType: 'E-Wallet',
        prize: 'MYR 200'
    },
    {
        id: 11,
        fullName: 'Hazrul Izhar',
        memberLevel: 'Classic',
        date: '2025-09-06',
        point: 95,
        prizeType: 'Item',
        prize: 'Smartphone'
    }
]);

function openEditDialog(prize) {
    selectedPrize.value = { ...prize };
    editDialogVisible.value = true;
}

function savePrizeEdit() {
    const index = listPrize.value.findIndex((p) => p.id === selectedPrize.value.id);
    if (index !== -1) {
        listPrize.value[index].prizeQuota = selectedPrize.value.prizeQuota;
    }
    editDialogVisible.value = false;
}
</script>
