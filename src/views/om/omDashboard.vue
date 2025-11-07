<template>
    <div class="flex justify-center px-4 py-8">
        <div class="grid grid-cols-12 gap-8 w-full">
            <!-- ===== Summary Cards (unchanged) ===== -->
            <div v-for="(card, i) in summaryCards" :key="i" class="col-span-12 sm:col-span-6 xl:col-span-3">
                <div class="card mb-0 shadow-sm hover:shadow-md transition-shadow duration-300 border border-surface-100 dark:border-surface-700">
                    <div class="flex justify-between mb-4">
                        <div>
                            <span class="block text-muted-color font-medium mb-2">{{ card.title }}</span>
                            <div class="text-surface-900 dark:text-surface-0 font-semibold text-2xl tracking-tight">
                                {{ card.value }}
                            </div>
                        </div>
                        <div class="flex items-center justify-center rounded-xl" :class="card.bg" style="width: 2.8rem; height: 2.8rem">
                            <i :class="card.icon"></i>
                        </div>
                    </div>
                    <div class="flex items-center gap-1 text-sm">
                        <span class="text-primary font-semibold">{{ card.change }}</span>
                        <span class="text-muted-color">{{ card.description }}</span>
                    </div>
                </div>
            </div>

            <!-- ===== Best Selling Products (unchanged) ===== -->
            <div class="col-span-12 xl:col-span-8">
                <div class="card">
                    <div class="flex justify-between items-center mb-6">
                        <div class="font-semibold text-xl">Best Selling Products</div>
                    </div>

                    <ul class="list-none p-0 m-0">
                        <li v-for="(product, index) in products" :key="index" class="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                            <div>
                                <span class="text-surface-900 dark:text-surface-0 font-medium mr-2 mb-1 md:mb-0">
                                    {{ product.name }}
                                </span>
                                <div class="mt-1 text-muted-color">{{ product.category }}</div>
                            </div>

                            <div class="mt-2 md:mt-0 flex items-center">
                                <div class="bg-surface-300 dark:bg-surface-500 rounded-border overflow-hidden w-40 lg:w-24" style="height: 8px">
                                    <div :class="product.colorClass" class="h-full" :style="{ width: product.salesPercent + '%' }"></div>
                                </div>

                                <div class="ml-4 flex flex-col text-right">
                                    <span :class="product.percentTextClass" class="font-medium"> {{ product.salesPercent }}% </span>
                                    <span :class="product.change >= 0 ? 'text-green-500' : 'text-red-500'" class="text-sm font-medium"> {{ product.change >= 0 ? '+' + product.change : product.change }}% from last month </span>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>

            <!-- ===== Notifications (converted to OM) ===== -->
            <div class="col-span-12 xl:col-span-4">
                <div class="card">
                    <div class="flex items-center justify-between mb-6">
                        <div class="font-semibold text-xl">Order Notifications</div>
                        <div>
                            <Button icon="pi pi-ellipsis-v" class="p-button-text p-button-plain p-button-rounded" @click="$refs.menu.toggle($event)" />
                            <Menu ref="menu" popup :model="menuItems" class="!min-w-40" />
                        </div>
                    </div>

                    <span class="block text-muted-color font-medium mb-4">TODAY</span>
                    <ul class="p-0 mx-0 mt-0 mb-6 list-none">
                        <li class="flex items-center py-2 border-b border-surface">
                            <div class="w-12 h-12 flex items-center justify-center bg-green-100 dark:bg-green-400/10 rounded-full mr-4 shrink-0">
                                <i class="pi pi-check-circle !text-xl text-green-500"></i>
                            </div>
                            <span class="text-surface-900 dark:text-surface-0 leading-normal"> Order <span class="text-primary font-bold">#1256</span> has been approved. </span>
                        </li>
                        <li class="flex items-center py-2">
                            <div class="w-12 h-12 flex items-center justify-center bg-orange-100 dark:bg-orange-400/10 rounded-full mr-4 shrink-0">
                                <i class="pi pi-truck !text-xl text-orange-500"></i>
                            </div>
                            <span class="text-surface-700 dark:text-surface-100 leading-normal"> Shipment for <span class="text-primary font-bold">#1248</span> is out for delivery. </span>
                        </li>
                    </ul>

                    <span class="block text-muted-color font-medium mb-4">YESTERDAY</span>
                    <ul class="p-0 m-0 list-none mb-6">
                        <li class="flex items-center py-2 border-b border-surface">
                            <div class="w-12 h-12 flex items-center justify-center bg-blue-100 dark:bg-blue-400/10 rounded-full mr-4 shrink-0">
                                <i class="pi pi-box !text-xl text-blue-500"></i>
                            </div>
                            <span class="text-surface-900 dark:text-surface-0 leading-normal"> Order <span class="text-primary font-bold">#1239</span> has been packed and ready for shipment. </span>
                        </li>
                        <li class="flex items-center py-2 border-b border-surface">
                            <div class="w-12 h-12 flex items-center justify-center bg-pink-100 dark:bg-pink-400/10 rounded-full mr-4 shrink-0">
                                <i class="pi pi-exclamation-triangle !text-xl text-pink-500"></i>
                            </div>
                            <span class="text-surface-900 dark:text-surface-0 leading-normal"> Order <span class="text-primary font-bold">#1234</span> delayed due to supplier issue. </span>
                        </li>
                    </ul>

                    <span class="block text-muted-color font-medium mb-4">LAST WEEK</span>
                    <ul class="p-0 m-0 list-none">
                        <li class="flex items-center py-2 border-b border-surface">
                            <div class="w-12 h-12 flex items-center justify-center bg-yellow-100 dark:bg-yellow-400/10 rounded-full mr-4 shrink-0">
                                <i class="pi pi-refresh !text-xl text-yellow-500"></i>
                            </div>
                            <span class="text-surface-900 dark:text-surface-0 leading-normal"> 28 new orders placed last week. </span>
                        </li>
                        <li class="flex items-center py-2 border-b border-surface">
                            <div class="w-12 h-12 flex items-center justify-center bg-purple-100 dark:bg-purple-400/10 rounded-full mr-4 shrink-0">
                                <i class="pi pi-chart-line !text-xl text-purple-500"></i>
                            </div>
                            <span class="text-surface-900 dark:text-surface-0 leading-normal"> <span class="text-primary font-bold">+18%</span> growth in total orders. </span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
const products = [
    { name: 'Toyo Proxes Sport', category: 'Performance Tire', salesPercent: 80, change: 5, colorClass: 'bg-blue-500', percentTextClass: 'text-blue-500' },
    { name: 'Toyo Open Country A/T III', category: 'All-Terrain Tire', salesPercent: 65, change: 3, colorClass: 'bg-green-500', percentTextClass: 'text-green-500' },
    { name: 'Toyo NanoEnergy R38', category: 'Eco Tire', salesPercent: 55, change: -2, colorClass: 'bg-yellow-500', percentTextClass: 'text-yellow-500' },
    { name: 'Toyo Observe GSi-6', category: 'Winter Tire', salesPercent: 40, change: 1, colorClass: 'bg-cyan-500', percentTextClass: 'text-cyan-500' },
    { name: 'Toyo Proxes R888R', category: 'Racing Tire (Best Seller)', salesPercent: 90, change: 8, colorClass: 'bg-purple-500', percentTextClass: 'text-purple-500' }
];


const summaryCards = [
    {
        title: 'Total Order',
        value: '3,560',
        change: '+320',
        description: 'compared to last month',
        icon: 'pi pi-shopping-cart text-blue-500 !text-xl',
        bg: 'bg-blue-100 dark:bg-blue-400/10'
    },
    {
        title: 'Total Back Order',
        value: '2,230',
        change: '+130',
        description: 'from last month',
        icon: 'pi pi-dollar text-orange-500 !text-xl',
        bg: 'bg-orange-100 dark:bg-orange-400/10'
    },
    {
        title: 'Total Return Order',
        value: '65',
        change: '+12',
        description: 'this month',
        icon: 'pi pi-users text-cyan-500 !text-xl',
        bg: 'bg-cyan-100 dark:bg-cyan-400/10'
    },
    {
        title: 'Claim Made',
        value: '30',
        change: '+7',
        description: 'this month',
        icon: 'pi pi-comment text-purple-500 !text-xl',
        bg: 'bg-purple-100 dark:bg-purple-400/10'
    }
];

const menuItems = [
    { label: 'Mark all as read', icon: 'pi pi-check' },
    { label: 'Clear notifications', icon: 'pi pi-trash' }
];
</script>
