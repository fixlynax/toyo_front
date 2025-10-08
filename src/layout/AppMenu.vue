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
                to: '/technical/dashboardTechnical'
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
                        label: 'Pattern List',
                        icon: 'pi pi-fw pi-slack',
                        to: '/technical/listPattern'
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
                to: '/om/listOrder'
            },
            {
                label: 'Back Order',
                icon: 'pi pi-fw pi-history',
                to: '/om/listBackOrder'
            },
            {
                label: 'Return Order',
                icon: 'pi pi-fw pi-reply',
                to: '/om/listReturnOrder'
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
                to: '/om/listSalesProgram'
            },
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
                to: '/om/listMessaging'
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
                        icon: 'pi pi-fw pi-book',
                        to: '/scm/listCollection'
                    },
                    {
                        label: 'Return List',
                        icon: 'pi pi-fw pi-reply',
                        to: '/scm/returnCollection'
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
                        to: '/scm/listOrderDelivery'
                    },
                    {
                        label: 'Order Pickup',
                        icon: 'pi pi-fw pi-download',
                        to: '/scm/listOrderPickup'
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
                        to: '/scm/listReturnOrder'
                    },
                    {
                        label: 'Bulk Update',
                        icon: 'pi pi-fw pi-refresh',
                        to: '#'
                    }
                ]
            },
            {
                label: 'Area ETA',
                icon: 'pi pi-fw pi-map',
                to: '/scm/listAreaETA'
            },
            {
                label: 'Logistic Account',
                icon: 'pi pi-fw pi-briefcase',
                to: '/scm/listLogistic'
            },
            {
                label: 'Back Order',
                icon: 'pi pi-fw pi-history',
                to: '/scm/listSCMBackOrder'
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
                        to: '/it/listUserAccount'
                    }
                ]
            },
            {
                label: 'Salesman',
                icon: 'pi pi-fw pi-id-card',
                to: '/it/listSalesAccount'
            },
            {
                label: 'Setting',
                icon: 'pi pi-fw pi-cog',
                items: [
                    {
                        label: 'Maintenance Mode',
                        icon: 'pi pi-fw pi-power-off',
                        to: '/it/maintenanceMode'
                    },
                    {
                        label: 'Email Setting',
                        icon: 'pi pi-fw pi-envelope',
                        to: '/it/listMailSetting'
                    },
                    {
                        label: 'Terms & Conditions',
                        icon: 'pi pi-fw pi-file',
                        to: '/it/termsCondition'
                    }
                ]
            }
        ]
    },
    {
        label: 'Billing',
        icon: 'pi pi-fw pi-credit-card',
        items: [
            {
                label: 'Account Detail',
                icon: 'pi pi-fw pi-id-card',
                to: '/billing/listBillingAccount'
            },
            {
                label: 'Billing History',
                icon: 'pi pi-fw pi-history',
                to: '/billing/listBilling'
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
