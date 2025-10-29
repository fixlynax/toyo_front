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
                            <RouterLink :to="`/marketing/editGame/${gameId}`">
                                <Button label="Edit" class="p-button-info" size="small" />
                            </RouterLink>

                            <!-- Delete Event -->
                            <Button label="Delete" class="p-button-danger" size="small" @click="deleteGame" />
                        </div>
                    </div>

                    <!-- Event Images -->
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                        <img v-if="game.image1URL" :src="game.image1URL" alt="Event Image 1" class="rounded-xl shadow-sm object-cover w-full h-80" />
                        <img v-if="game.image2URL" :src="game.image2URL" alt="Event Image 2" class="rounded-xl shadow-sm object-cover w-full h-80" />
                        <img v-if="game.image3URL" :src="game.image3URL" alt="Event Image 3" class="rounded-xl shadow-sm object-cover w-full h-80" />
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
                                <p class="text-lg font-medium">{{ formatDisplayDate(game.startDate) }}</p>
                            </div>
                            <div class="w-full">
                                <span class="block text-xm font-bold text-black-700">End Date</span>
                                <p class="text-lg font-medium">{{ formatDisplayDate(game.endDate) }}</p>
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
                                        <span class="text-gray-600 text-xs">{{ formatPrizeType(data.prizeType) }}</span>
                                    </div>

                                    <!-- Tooltip for Point Type -->
                                    <div v-if="data.prizeType === 'POINT' && hoverPrize === data.id" class="absolute top-0 left-20 bg-white border rounded-lg shadow-lg p-3 text-xm w-60 z-10">
                                        <div class="font-semibold text-xl text-gray-700 mb-2">🏅 Point Reward</div>
                                        <ul class="list-disc list-inside text-gray-700 space-y-1 ml-5">
                                            <li><b>Silver :</b> {{ game.point1 }} pts</li>
                                            <li><b>Gold :</b> {{ game.point2 }} pts</li>
                                            <li><b>Platinum :</b> {{ game.point3 }} pts</li>
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
                                    <td class="px-4 py-2 text-right">{{ formatDisplayDate(game.publishDate) }}</td>
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
                                    <td class="px-4 py-2 text-right">{{ participants.length }}</td>
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
                                    <td class="py-4 text-right">
                                        <div class="flex justify-end">
                                            <ToggleButton
                                                v-model="gameStatus"
                                                :modelValue="game.status === 1"
                                                @change="toggleGameStatus"
                                                onLabel="Inactive"
                                                offLabel="Active"
                                                onIcon="pi pi-times"
                                                offIcon="pi pi-check"
                                                class="w-30"
                                                aria-label="Do you confirm ?"
                                            />
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
                        <Button icon="pi pi-file-export" label="Export" style="width: fit-content" class="p-button-danger p-button-sm" @click="exportParticipants" />
                    </div>
                    <DataTable :value="participants" :paginator="true" :rows="7" dataKey="memberCode" :rowHover="true" responsiveLayout="scroll" class="text-sm">
                        <!-- User Column -->
                        <Column header="User" style="min-width: 6rem">
                            <template #body="{ data }">
                                <div class="flex flex-col">
                                    <span class="font-bold text-gray-800">{{ data.name }}</span>
                                    <span class="text-gray-600 text-xs mt-2">🎖️ {{ data.membership }}</span>
                                    <span class="text-gray-600 text-xs mt-2">📅 {{ data.dateTaken }}</span>
                                </div>
                            </template>
                        </Column>

                        <!-- Prize Type -->
                        <Column header="Type" style="min-width: 8rem">
                            <template #body="{ data }">
                                {{ formatPrizeType(data.type[0]) }}
                            </template>
                        </Column>

                        <!-- Prize -->
                        <Column field="prize" header="Prize" style="min-width: 8rem"></Column>
                    </DataTable>
                </div>
            </div>
        </div>

        <!-- Edit Prize Dialog -->
        <Dialog v-model:visible="editDialogVisible" modal header="Edit Prize Quantity" :style="{ width: '400px' }">
            <div class="flex flex-col gap-3">
                <div class="font-semibold text-gray-800">{{ selectedPrize?.catalog?.title }}</div>
                <div class="flex items-center gap-3">
                    <label class="text-gray-700 font-medium w-20">Quota:</label>
                    <InputNumber v-model="selectedPrize.quantity" :min="1" class="w-full" />
                </div>
                <div class="flex justify-end mt-4">
                    <Button label="Save" icon="pi pi-check" class="p-button-success p-button-sm" @click="savePrizeEdit" />
                </div>
            </div>
        </Dialog>
    </Fluid>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import api from '@/service/api';

const route = useRoute();
const toast = useToast();
const gameId = route.params.id;

const hoverPrize = ref(null);
const editDialogVisible = ref(false);
const selectedPrize = ref({ quantity: 0 });
const loading = ref(false);

const game = ref({
    id: 0,
    gameNo: '',
    type: '',
    title: '',
    desc: '',
    image1URL: null,
    image2URL: null,
    image3URL: null,
    location: '',
    publishDate: '',
    startDate: '',
    endDate: '',
    quota: 0,
    point1: 0,
    point2: 0,
    point3: 0,
    status: 0
});

const listPrize = ref([]);
const participants = ref([]);

const gameStatus = computed({
    get: () => game.value.status === 1,
    set: (value) => {
        game.value.status = value ? 1 : 0;
    }
});

// Format date from YYYY-MM-DD to DD-MM-YYYY
function formatDisplayDate(dateString) {
    if (!dateString) return '';

    try {
        // If already in correct format, return as is
        if (dateString.includes('-') && dateString.split('-')[0].length === 2) {
            return dateString;
        }

        // Convert from YYYY-MM-DD to DD-MM-YYYY
        const [year, month, day] = dateString.split('-');
        return `${day}-${month}-${year}`;
    } catch (error) {
        console.error('Error formatting date:', error);
        return dateString;
    }
}

// Format prize type for display
function formatPrizeType(type) {
    const typeMap = {
        POINT: 'Point',
        EWALLET: 'E-Wallet',
        EVOUCHER: 'E-Voucher',
        ITEM: 'Item'
    };
    return typeMap[type] || type;
}

// Process private images using the API method
const processPrivateImages = async () => {
    const imageFields = ['image1URL', 'image2URL', 'image3URL'];

    for (const field of imageFields) {
        if (game.value[field] && typeof game.value[field] === 'string') {
            try {
                const blobUrl = await api.getPrivateFile(game.value[field]);
                if (blobUrl) {
                    game.value[field] = blobUrl;
                }
            } catch (error) {
                console.error(`Error loading image ${field}:`, error);
                // Keep the original URL if private file loading fails
            }
        }
    }
};

// Process prize catalog images
const processPrizeImages = async () => {
    for (const prize of listPrize.value) {
        if (prize.imageURL && typeof prize.imageURL === 'string') {
            try {
                const blobUrl = await api.getPrivateFile(prize.imageURL);
                if (blobUrl) {
                    prize.imageURL = blobUrl;
                }
            } catch (error) {
                console.error(`Error loading prize image for ${prize.prizeName}:`, error);
                // Keep the original URL if private file loading fails
            }
        }
    }
};

// Fetch game details from API
async function fetchGameDetails() {
    try {
        loading.value = true;
        const response = await api.get(`game/details/${gameId}`);

        if (response.data.status === 1) {
            const adminData = response.data.admin_data;

            // Set game details
            game.value = adminData.game_details;

            // Process game images
            await processPrivateImages();

            // Transform prizes data to match frontend structure
            listPrize.value = adminData.prizes.map((prize) => ({
                id: prize.id,
                prizeType: prize.catalog.type,
                imageURL: prize.catalog.imageURL,
                prizeName: prize.catalog.title,
                prizeQuota: prize.quantity,
                prizeRemain: prize.catalog.availableqty,
                catalog: prize.catalog,
                rawData: prize
            }));

            // Process prize images
            await processPrizeImages();

            // Set participants
            participants.value = adminData.participants;
        } else {
            console.error('Failed to fetch game details');
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to fetch game details',
                life: 3000
            });
        }
    } catch (error) {
        console.error('Error fetching game details:', error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error fetching game details',
            life: 3000
        });
    } finally {
        loading.value = false;
    }
}

// Toggle game status
const toggleGameStatus = async () => {
    try {
        const response = await api.put(`game/toggleInactive/${gameId}`);

        if (response.data.status === 1) {
            // Update local game status
            game.value.status = game.value.status === 1 ? 0 : 1;

            toast.add({
                severity: 'success',
                summary: 'Success',
                detail: `Game ${game.value.status === 1 ? 'activated' : 'deactivated'} successfully`,
                life: 3000
            });
        } else {
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to update game status',
                life: 3000
            });
        }
    } catch (error) {
        console.error('Error updating game status:', error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to update game status',
            life: 3000
        });
    }
};

// Delete game
async function deleteGame() {
    if (confirm('Are you sure you want to delete this game?')) {
        try {
            const response = await api.put(`game/delete/${gameId}`);
            if (response.data.status === 1) {
                toast.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Game deleted successfully',
                    life: 3000
                });
                // Redirect to games list after short delay
                setTimeout(() => {
                    window.location.href = '/marketing/games';
                }, 1000);
            } else {
                console.error('Failed to delete game');
                toast.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to delete game',
                    life: 3000
                });
            }
        } catch (error) {
            console.error('Error deleting game:', error);
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Error deleting game',
                life: 3000
            });
        }
    }
}

// Export participants
async function exportParticipants() {
    try {
        // Implement export functionality
        console.log('Exporting participants...');
        toast.add({
            severity: 'info',
            summary: 'Info',
            detail: 'Export functionality to be implemented',
            life: 3000
        });
    } catch (error) {
        console.error('Error exporting participants:', error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error exporting participants',
            life: 3000
        });
    }
}

// Download QR code
function downloadQRCode() {
    // Implement QR code download functionality
    console.log('Downloading QR code...');
    toast.add({
        severity: 'info',
        summary: 'Info',
        detail: 'QR download functionality to be implemented',
        life: 3000
    });
}

// Prize edit functions
function openEditDialog(prize) {
    selectedPrize.value = { ...prize.rawData };
    editDialogVisible.value = true;
}

async function savePrizeEdit() {
    try {
        const response = await api.put(`game/update-prize-quantity/${selectedPrize.value.id}`, {
            quantity: selectedPrize.value.quantity
        });

        if (response.data.status === 1) {
            // Update local data
            const index = listPrize.value.findIndex((p) => p.id === selectedPrize.value.id);
            if (index !== -1) {
                listPrize.value[index].prizeQuota = selectedPrize.value.quantity;
                listPrize.value[index].rawData.quantity = selectedPrize.value.quantity;
            }
            editDialogVisible.value = false;

            toast.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Prize quantity updated successfully',
                life: 3000
            });
        } else {
            console.error('Failed to update prize quantity');
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to update prize quantity',
                life: 3000
            });
        }
    } catch (error) {
        console.error('Error updating prize quantity:', error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error updating prize quantity',
            life: 3000
        });
    }
}

// Fetch data when component mounts
onMounted(() => {
    fetchGameDetails();
});
</script>
