<template>
    <Fluid>
        <div class="card">
            <!-- Page Title -->
            <div class="text-2xl font-bold text-gray-800 border-b pb-2 mb-4">List Catalogue</div>

            <!-- Header: Search and Actions -->
            <div class="flex items-center justify-between gap-4 w-full flex-wrap mb-6">
                <!-- Left: Search Field + Cog Button -->
                <div class="flex items-center gap-2 w-full max-w-md">
                    <IconField class="flex-1">
                        <InputIcon>
                            <i class="pi pi-search" />
                        </InputIcon>
                        <InputText placeholder="Quick Search" class="w-full" />
                    </IconField>
                    <Button type="button" icon="pi pi-cog" class="p-button" />
                </div>

                <!-- Right: Create Button -->
                <RouterLink to="/marketing/createCatalogue">
                    <Button type="button" label="Create" />
                </RouterLink>
            </div>

            <!-- Catalogue Grid -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                <!-- Catalogue Card -->
                <div
                    v-for="(item, index) in catalogueItems"
                    :key="index"
                    class="flex flex-col rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 bg-white cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-105 "
                >
                    <!-- Top: Image Section -->
                    <div class="w-full h-48 bg-gray-100 relative overflow-hidden rounded-t-2xl">
                        <!-- Status Badge -->
                        <div :class="['absolute top-2 right-2 whitespace-nowrap text-xs font-bold px-2 py-1 rounded-full shadow-md', item.status === 1 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700']">
                            {{ item.status === 1 ? 'In Stock' : 'Out of Stock' }}
                        </div>

                        <!-- Image -->
                        <img :src="item.imageURL" :alt="item.title" class="w-full h-full object-cover" />
                    </div>

                    <!-- Bottom: Info Section -->
                    <div class="p-4 bg-white flex flex-col gap-3">
                        <!-- Title -->
                        <div class="text-lg font-semibold text-gray-800 truncate">
                            {{ item.title }}
                        </div>

                        <!-- Row 1: SKU + Type -->
                        <div class="flex items-center justify-between text-sm text-gray-600">
                            <span class="truncate">{{ item.sku }}</span>
                            <span class="truncate">{{ item.type }}</span>
                        </div>

                        <!-- Row 2: Expiry + Balance -->
                        <div class="flex items-center justify-between text-sm font-medium">
                            <!-- Balance -->
                            <span class="text-gray-600">{{ item.availableqty }} / {{ item.totalqty }}</span>

                            <!-- Expiry with dynamic color -->
                            <span class="font-bold italic" :class="getExpiryClass(item.expiry)">
                                {{ item.expiry }}
                            </span>
                        </div>
                    </div>

                    <!-- Action Button -->
                    <button class="mt-2 mx-4 mb-4 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors">Edit</button>
                </div>
            </div>
        </div>
    </Fluid>
</template>

<script setup>
import { ref } from 'vue';

// --- Helper to determine expiry color ---
const getExpiryClass = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);

    // Calculate difference in days
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
        // Expired
        return 'text-red-500';
    } else if (diffDays <= 3) {
        // Expiring within 3 days
        return 'text-yellow-500';
    } else {
        // Safe
        return 'text-black';
    }
};

const catalogueItems = ref([
    {
        id: 1,
        type: 'E-Wallet',
        imageURL: 'https://assets.bharian.com.my/images/articles/tng13jan_BHfield_image_socialmedia.var_1610544082.jpg',
        title: 'Touch ’n Go Reload RM20',
        sku: 'TNG20',
        valueType: 'Amount/',
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
        status: 0,
        created: '2025-01-01',
        deleted: 0
    },
    {
        id: 2,
        type: 'Voucher',
        imageURL: 'https://assets.offgamers.com/img/offer/kr_fdf75033-56ee-4ce6-929c-1f9c93a4c642_1b1c60fc-e950-4c62-8ee7-471d42484619.webp',
        title: 'RM50 Toyo Service Voucher',
        sku: 'TSV50',
        valueType: 'RM',
        valueAmount: 50,
        description: 'Redeemable at participating Toyo Tyre service centres nationwide.',
        terms: 'Valid for tyre service only. Not exchangeable for cash.',
        instruction: 'Present voucher code at counter.',
        point1: 500,
        point2: 480,
        point3: 450,
        purpose: 'Reward',
        purposelD: 'PR002',
        totalqty: 200,
        availableqty: 160,
        expiry: '2025-09-30',
        isBirthday: 0,
        status: 1,
        created: '2025-02-10',
        deleted: 0
    },
    {
        id: 3,
        type: 'Item',
        imageURL: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdSHDEYMxmOB1Z63V0UB1ohMHGZ5cs5DG4zg&s',
        title: 'Toyo Tyres Cap',
        sku: 'TT-CAP01',
        valueType: 'Points',
        valueAmount: 300,
        description: 'Exclusive Toyo Tyres branded cap for loyal members.',
        terms: 'Limited to 1 per member.',
        instruction: 'Redeem online and collect at service centre.',
        point1: 300,
        point2: 280,
        point3: 250,
        purpose: 'Merchandise',
        purposelD: 'PR003',
        totalqty: 150,
        availableqty: 90,
        expiry: '2026-01-15',
        isBirthday: 0,
        status: 1,
        created: '2025-02-20',
        deleted: 0
    },
    {
        id: 4,
        type: 'E-Wallet',
        imageURL: 'https://assets.bharian.com.my/images/articles/tng13jan_BHfield_image_socialmedia.var_1610544082.jpg',
        title: 'Touch ’n Go Reload RM50',
        sku: 'TNG50',
        valueType: 'RM',
        valueAmount: 50,
        description: 'Get RM50 credit directly into your TNG eWallet.',
        terms: 'Limited to one redemption per week.',
        instruction: 'Provide TNG account number at redemption.',
        point1: 500,
        point2: 480,
        point3: 450,
        purpose: 'Reward',
        purposelD: 'PR004',
        totalqty: 300,
        availableqty: 250,
        expiry: '2025-11-30',
        isBirthday: 1,
        status: 1,
        created: '2025-03-01',
        deleted: 0
    },
    {
        id: 5,
        type: 'Voucher',
        imageURL: 'https://assets.offgamers.com/img/offer/kr_fdf75033-56ee-4ce6-929c-1f9c93a4c642_1b1c60fc-e950-4c62-8ee7-471d42484619.webp',
        title: 'RM100 Toyo Voucher',
        sku: 'TV100',
        valueType: 'RM',
        valueAmount: 100,
        description: 'Redeem for Toyo Tyres or merchandise at official outlets.',
        terms: 'Valid for one-time use.',
        instruction: 'Show e-voucher QR code at redemption.',
        point1: 1000,
        point2: 950,
        point3: 900,
        purpose: 'Reward',
        purposelD: 'PR005',
        totalqty: 100,
        availableqty: 85,
        expiry: '2025-08-15',
        isBirthday: 0,
        status: 1,
        created: '2025-03-15',
        deleted: 0
    },
    {
        id: 6,
        type: 'Item',
        imageURL: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdSHDEYMxmOB1Z63V0UB1ohMHGZ5cs5DG4zg&s',
        title: 'Toyo Sports Bottle',
        sku: 'TT-BOT01',
        valueType: 'Points',
        valueAmount: 200,
        description: 'Durable sports bottle with Toyo branding.',
        terms: 'Available while stocks last.',
        instruction: 'Collect at Toyo service centre after redemption.',
        point1: 200,
        point2: 180,
        point3: 150,
        purpose: 'Merchandise',
        purposelD: 'PR006',
        totalqty: 300,
        availableqty: 240,
        expiry: '2025-09-23',
        isBirthday: 0,
        status: 1,
        created: '2025-09-20',
        deleted: 0
    }
]);
</script>
