<template>
    <Fluid>
        <div class="flex flex-col md:flex-row gap-8">
            <!-- LEFT SECTION -->
            <div class="md:w-2/3">
                <div class="card flex flex-col border-b w-full">
                    <!-- Header -->
                    <div class="flex items-center justify-between border-b pb-3 mb-3">
                        <div class="flex items-center space-x-3">
                            <Button icon="pi pi-arrow-left font-bold" class="p-button-text p-button-secondary text-xl" size="big" v-tooltip="'Back'" @click="$router.back()" />
                            <div class="text-2xl font-bold text-gray-800">Devices</div>
                        </div>
                        <div class="flex items-center gap-2 w-full max-w-md">
                            <IconField class="flex-1">
                                <InputIcon>
                                    <i class="pi pi-search" />
                                </InputIcon>
                                <!-- ✅ Fixed: use searchQuery -->
                                <InputText v-model="searchQuery" placeholder="Quick Search..." class="w-full" />
                            </IconField>
                            <Button type="button" icon="pi pi-cog" class="p-button" />
                        </div>
                    </div>

                    <!-- Tabs -->
                    <TabView v-model:activeIndex="activeTabIndex">
                        <!-- 🧩 ALL DEVICES -->
                        <TabPanel :header="`All Devices (${filteredAllDevices.length})`">
                            <div class="overflow-x-auto">
                                <table class="w-full text-sm text-left">
                                    <tbody>
                                        <tr v-for="device in filteredAllDevices" :key="device.id" class="border-b hover:bg-gray-50">
                                            <td class="px-4 py-3">
                                                <div class="flex items-center gap-2 text-gray-800 font-bold">
                                                    <i :class="device.isBlocked ? 'pi pi-ban text-red-500' : 'pi pi-tablet text-black-500'"></i>
                                                    {{ device.name }}
                                                </div>
                                                <div class="ml-6 text-gray-500 text-xs mt-2">
                                                    <div>ID: {{ device.uniqueId }}</div>
                                                    <div>Last Active: {{ formatDate(device.lastActive) }}</div>
                                                </div>
                                            </td>
                                            <td class="px-4 py-3 text-right align-top">
                                                <Button :label="device.isBlocked ? 'Unblock' : 'Block'" :severity="device.isBlocked ? 'success' : 'danger'" size="small" class="!py-1 !px-2 text-xs w-fit" @click="toggleBlock(device)" />
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </TabPanel>

                        <!-- ✅ ACTIVE DEVICES -->
                        <TabPanel :header="`Active Devices (${filteredActiveDevices.length})`">
                            <div class="overflow-x-auto">
                                <table class="w-full text-sm text-left">
                                    <tbody>
                                        <tr v-for="device in filteredActiveDevices" :key="device.id" class="border-b hover:bg-gray-50">
                                            <td class="px-4 py-3">
                                                <div class="flex items-center gap-2 text-gray-800 font-bold">
                                                    <i class="pi pi-tablet text-black-500"></i>
                                                    {{ device.name }}
                                                </div>
                                                <div class="ml-6 text-gray-500 text-xs mt-2">
                                                    <div>ID: {{ device.uniqueId }}</div>
                                                    <div>Last Active: {{ formatDate(device.lastActive) }}</div>
                                                </div>
                                            </td>
                                            <td class="px-4 py-3 text-right align-top">
                                                <Button label="Block" severity="danger" size="small" class="!py-1 !px-2 text-xs w-fit" @click="toggleBlock(device)" />
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </TabPanel>

                        <!-- 🚫 BLOCKED DEVICES -->
                        <TabPanel :header="`Blocked Devices (${filteredBlockedDevices.length})`">
                            <div class="overflow-x-auto">
                                <table class="w-full text-sm text-left">
                                    <tbody>
                                        <tr v-for="device in filteredBlockedDevices" :key="device.id" class="border-b hover:bg-gray-50">
                                            <td class="px-4 py-3">
                                                <div class="flex items-center gap-2 text-gray-800 font-bold">
                                                    <i class="pi pi-ban text-red-500"></i>
                                                    {{ device.name }}
                                                </div>
                                                <div class="ml-6 text-gray-500 text-xs mt-2">
                                                    <div>ID: {{ device.uniqueId }}</div>
                                                    <div>Last Active: {{ formatDate(device.lastActive) }}</div>
                                                </div>
                                            </td>
                                            <td class="px-4 py-3 text-right align-top">
                                                <Button label="Unblock" severity="success" size="small" class="!py-1 !px-2 text-xs w-fit" @click="toggleBlock(device)" />
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </TabPanel>
                    </TabView>
                </div>
            </div>
        </div>
    </Fluid>
</template>

<script setup>
import { ref, computed } from 'vue';

// Active tab
const activeTabIndex = ref(0);

// ✅ Quick search text
const searchQuery = ref('');

// Dummy device data
const devices = ref([
    { id: 1, name: 'iPhone 14 Pro', uniqueId: 'A1B2C3', lastActive: '2025-10-22 09:45', isBlocked: false },
    { id: 2, name: 'Samsung S22', uniqueId: 'D4E5F6', lastActive: '2025-10-20 19:30', isBlocked: true },
    { id: 3, name: 'HP Laptop', uniqueId: 'G7H8I9', lastActive: '2025-10-21 22:00', isBlocked: false },
    { id: 4, name: 'iPad Air', uniqueId: 'J1K2L3', lastActive: '2025-10-17 08:45', isBlocked: true },
    { id: 5, name: 'MacBook Air', uniqueId: 'M4N5O6', lastActive: '2025-10-22 06:30', isBlocked: false },
    { id: 6, name: 'Lenovo ThinkPad', uniqueId: 'P7Q8R9', lastActive: '2025-10-19 11:20', isBlocked: false },
    { id: 7, name: 'Asus ROG', uniqueId: 'S1T2U3', lastActive: '2025-10-16 13:10', isBlocked: true }
]);

// ✅ Search filter logic
const filterDevices = (list) => {
    if (!searchQuery.value.trim()) return list;
    const q = searchQuery.value.toLowerCase();
    return list.filter((d) => d.name.toLowerCase().includes(q) || d.uniqueId.toLowerCase().includes(q));
};

// ✅ Computed filtered lists
const filteredAllDevices = computed(() => filterDevices([...devices.value].sort((a, b) => new Date(b.lastActive) - new Date(a.lastActive))));

const filteredActiveDevices = computed(() => filterDevices(devices.value.filter((d) => !d.isBlocked).sort((a, b) => new Date(b.lastActive) - new Date(a.lastActive))));

const filteredBlockedDevices = computed(() => filterDevices(devices.value.filter((d) => d.isBlocked).sort((a, b) => new Date(b.lastActive) - new Date(a.lastActive))));

// ✅ Toggle block/unblock
function toggleBlock(device) {
    device.isBlocked = !device.isBlocked;
}

// ✅ Format date helper
function formatDate(date) {
    return new Date(date).toLocaleString('en-MY', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}
</script>
