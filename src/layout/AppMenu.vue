<script setup>
import { ref } from 'vue';

import AppMenuItem from './AppMenuItem.vue';

const model = ref([
    {
        label: 'Marketing',
        icon: 'pi pi-fw pi-megaphone',
        items: [
            { 
                label: 'Dashboard', 
                icon: 'pi pi-fw pi-home', 
                to: '/' 
            },
            {
                label: 'News Management',
                icon: 'pi pi-fw pi-flag',
                to: '/marketing/ListNews'
            },
            {
                label: 'Events Management',
                icon: 'pi pi-fw pi-calendar',
                to: '/marketing/ListEvent'
            },
            {
                label: 'Campaign Management',
                icon: 'pi pi-fw pi-megaphone',
                to: '/marketing/listCampaign'
            },
            {
                label: 'Game Management',
                icon: 'pi pi-fw pi-star',
                to: '/marketing/listGame'
            },
            {
                label: 'Reward Catalogue',
                icon: 'pi pi-fw pi-gift',
                to: '/marketing/listCatalogue'
            },
            {
                label: 'Redemption Management',
                icon: 'pi pi-fw pi-wallet',
                to: '/marketing/listRedemption'
            },
            {
                label: 'TC Members',
                icon: 'pi pi-fw pi-users',
                items: [
                    { 
                        label: 'Member List', 
                        icon: 'pi pi-fw pi-id-card', 
                        to: '/marketing/listEtenUser'  
                    },
                    { 
                        label: 'Referral Reward Point', 
                        icon: 'pi pi-fw pi-share-alt', 
                        to: '#' 
                    }
                ]
            },
            {
                label: 'Report',
                icon: 'pi pi-fw pi-chart-bar',
                items: [
                    { 
                        label: 'Member', 
                        icon: 'pi pi-fw pi-user', 
                        to: '#' 
                    },
                    { 
                        label: 'Referral', 
                        icon: 'pi pi-fw pi-users', 
                        to: '#' 
                    }
                ]
            }
        ]
    },
    {
        label: 'Technical',
        icon: 'pi pi-fw pi-cog',
        items: [
            { 
                label: 'Dashboard', 
                icon: 'pi pi-fw pi-home', 
                to: '/' 
            },
            {
                label: 'Warranty Claim',
                icon: 'pi pi-fw pi-file',
                items: [
                    { 
                        label: 'Claim List', 
                        icon: 'pi pi-fw pi-list', 
                        to: '/technical/listClaim' 
                    },
                    { 
                        label: 'CTC List', 
                        icon: 'pi pi-fw pi-book', 
                        to: '/technical/listCTC' 
                    },
                    { 
                        label: 'Scrap List', 
                        icon: 'pi pi-fw pi-trash', 
                        to: '/technical/listScrap' 
                    },
                    { 
                        label: 'Invoice List', 
                        icon: 'pi pi-fw pi-file-pdf', 
                        to: '/technical/listInvoice' 
                    }
                ]
            },
            {
                label: 'Products',
                icon: 'pi pi-fw pi-box',
                items: [
                    { 
                        label: 'Product List', 
                        icon: 'pi pi-fw pi-list', 
                        to: '/technical/listProduct' 
                    },
                    { 
                        label: 'Bulk Update', 
                        icon: 'pi pi-fw pi-refresh',
                        to: '/technical/bulkUpdate' 
                    },
                    { 
                        label: 'TWP Tire List', 
                        icon: 'pi pi-fw pi-circle', 
                        to: '/technical/twpTireList' 
                    }
                ]
            }
        ]
    },
    {
        label: 'OM',
        icon: 'pi pi-fw pi-briefcase',
        items: [
            { 
                label: 'Dashboard',
                icon: 'pi pi-fw pi-home',
                to: '/' 
            },
            { 
                label: 'Customer', 
                icon: 'pi pi-fw pi-user', 
                to: '/om/listEten' 
            },
            { 
                label: 'Order', 
                icon: 'pi pi-fw pi-shopping-cart', 
                to: '#' 
            },
            { 
                label: 'Back Order', 
                icon: 'pi pi-fw pi-history', 
                to: '#' 
            },
            { 
                label: 'Return Order', 
                icon: 'pi pi-fw pi-reply', 
                to: '#' 
            },
            {
                label: 'Report',
                icon: 'pi pi-fw pi-chart-line',
                items: [
                    { 
                        label: 'Sales Forecast', 
                        icon: 'pi pi-fw pi-chart-line', 
                        to: '#' 
                    },
                    { 
                        label: 'Direct Shipment', 
                        icon: 'pi pi-fw pi-truck', 
                        to: '#' 
                    },
                    { 
                        label: 'Back Order', 
                        icon: 'pi pi-fw pi-history', 
                        to: '#' 
                    },
                    { 
                        label: 'Own Collection', 
                        icon: 'pi pi-fw pi-box', 
                        to: '#' 
                    }
                ]
            },
            { 
                label: 'Sales Program',
                icon: 'pi pi-fw pi-tags',
                to: '#' },
            {
                label: 'Maintenance',
                icon: 'pi pi-fw pi-cog',
                items: [
                    { 
                        label: 'Disable Order', 
                        icon: 'pi pi-fw pi-ban', 
                        to: '#' 
                    },
                    { 
                        label: 'Month End Closing', 
                        icon: 'pi pi-fw pi-calendar-times', 
                        to: '#' 
                    },
                    { 
                        label: 'Material Exception', 
                        icon: 'pi pi-fw pi-exclamation-triangle', 
                        to: '#' 
                    }
                ]
            },
            { 
                label: 'Messaging',
                icon: 'pi pi-fw pi-envelope', 
                to: '#' 
            }
        ]
    },
    {
        label: 'SCM',
        icon: 'pi pi-fw pi-sitemap',
        items: [
            {
                label: 'Warranty CTC',
                icon: 'pi pi-fw pi-file',
                items: [
                    { 
                        label: 'Collection List', 
                        icon: 'pi pi-fw pi-archive', 
                        to: '#' 
                    },
                    { 
                        label: 'Return List', 
                        icon: 'pi pi-fw pi-reply', 
                        to: '#' 
                    }
                ]
            },
            {
                label: 'Order',
                icon: 'pi pi-fw pi-truck',
                items: [
                    { 
                        label: 'Order Delivery', 
                        icon: 'pi pi-fw pi-send', 
                        to: '#' 
                    },
                    { 
                        label: 'Order Pickup', 
                        icon: 'pi pi-fw pi-download', 
                        to: '#' 
                    }
                ]
            },
            {
                label: 'Return',
                icon: 'pi pi-fw pi-refresh',
                items: [
                    { 
                        label: 'Return Order List', 
                        icon: 'pi pi-fw pi-list', 
                        to: '#' 
                    },
                    { 
                        label: 'Bulk Update', 
                        icon: 'pi pi-fw pi-refresh', 
                        to: '#' 
                    }
                ]
            },
            { 
                label: 'Logistic Account', 
                icon: 'pi pi-fw pi-briefcase', 
                to: '#' 
            },
            { 
                label: 'Back Order', 
                icon: 'pi pi-fw pi-history',
                to: '#' 
            }
        ]
    },
    {
        label: 'IT',
        icon: 'pi pi-fw pi-desktop',
        items: [
            {
                label: 'Admin',
                icon: 'pi pi-fw pi-lock',
                items: [
                    { 
                        label: 'User Group', 
                        icon: 'pi pi-fw pi-users', 
                        to: '/it/ListGroup' 
                    },
                    { 
                        label: 'User Account', 
                        icon: 'pi pi-fw pi-user', 
                        to: '/it/ListUser' 
                    }
                ]
            },
            { 
                label: 'Salesman', 
                icon: 'pi pi-fw pi-id-card', 
                to: '#' 
            },
            {
                label: 'Setting',
                icon: 'pi pi-fw pi-cog',
                items: [
                    { 
                        label: 'Maintenance Mode', 
                        icon: 'pi pi-fw pi-power-off', 
                        to: '#' 
                    },
                    { 
                        label: 'Email Setting', 
                        icon: 'pi pi-fw pi-envelope', 
                        to: '#' 
                    },
                    { 
                        label: 'Terms & Conditions', 
                        icon: 'pi pi-fw pi-file', 
                        to: '#' 
                    }
                ]
            }
        ]
    }
]);
</script>

<template>
    <ul class="layout-menu">
        <template v-for="(item, i) in model" :key="item">
            <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
            <li v-if="item.separator" class="menu-separator"></li>
        </template>
    </ul>
</template>

<style lang="scss" scoped></style>
