import AppLayout from '@/layout/AppLayout.vue';
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: AppLayout,
            children: [
                // ===============================
                // OM (Order Management)
                // ===============================
                // Customer
                {
                    path: '/om/listEten',
                    name: 'List-Eten',
                    component: () => import('@/views/om/listEten.vue')
                },
                {
                    path: '/om/createEten',
                    name: 'Create-Eten',
                    component: () => import('@/views/om/createEten.vue')
                },
                {
                    path: '/om/detailEten',
                    name: 'Detail-Eten',
                    component: () => import('@/views/om/detailEten.vue')
                },
                {
                    path: '/om/confirmationEten',
                    name: 'Confirmation-Eten',
                    component: () => import('@/views/om/confirmationEten.vue')
                },
                {
                    path: '/om/editEten',
                    name: 'Edit-Eten',
                    component: () => import('@/views/om/editEten.vue')
                },
                {
                    path: '/om/createUserEten',
                    name: 'Create-User-Eten',
                    component: () => import('@/views/om/createUserEten.vue')
                },
                {
                    path: '/om/detailUser',
                    name: 'Detail-User',
                    component: () => import('@/views/om/detailUser.vue')
                },
                {
                    path: '/om/editUser',
                    name: 'Edit-User',
                    component: () => import('@/views/om/editUser.vue')
                },
                // Order
                {
                    path: '/om/listOrder',
                    name: 'List-Order',
                    component: () => import('@/views/om/listOrder.vue')
                },
                {
                    path: '/om/detailOrder',
                    name: 'Detail-Order',
                    component: () => import('@/views/om/detailOrder.vue')
                },
                // Back Order
                {
                    path: '/om/listBackOrder',
                    name: 'List-Back-Order',
                    component: () => import('@/views/om/listBackOrder.vue')
                },
                {
                    path: '/om/detailBackOrder',
                    name: 'Detail-Back-Order',
                    component: () => import('@/views/om/detailBackOrder.vue')
                },
                {
                    path: '/om/editBackOrder',
                    name: 'Edit-Back-Order',
                    component: () => import('@/views/om/editBackOrder.vue')
                },
                // Return Order
                {
                    path: '/om/listReturnOrder',
                    name: 'List-Return-Order',
                    component: () => import('@/views/om/listReturnOrder.vue')
                },
                {
                    path: '/om/detailReturnOrder',
                    name: 'Detail-Return-Order',
                    component: () => import('@/views/om/detailReturnOrder.vue')
                },

                // ===============================
                // MARKETING
                // ===============================
                // News
                {
                    path: '/marketing/listNews',
                    name: 'List-News',
                    component: () => import('@/views/marketing/listNews.vue')
                },
                {
                    path: '/marketing/createNews',
                    name: 'Create-News',
                    component: () => import('@/views/marketing/createNews.vue')
                },
                {
                    path: '/marketing/detailNews',
                    name: 'Detail-News',
                    component: () => import('@/views/marketing/detailNews.vue')
                },
                {
                    path: '/marketing/editNews',
                    name: 'Edit-News',
                    component: () => import('@/views/marketing/editNews.vue')
                },
                // Events
                {
                    path: '/marketing/listEvent',
                    name: 'List-Event',
                    component: () => import('@/views/marketing/listEvent.vue')
                },
                {
                    path: '/marketing/createEvent',
                    name: 'Create-Event',
                    component: () => import('@/views/marketing/createEvent.vue')
                },
                {
                    path: '/marketing/detailEvent',
                    name: 'Detail-Event',
                    component: () => import('@/views/marketing/detailEvent.vue')
                },
                {
                    path: '/marketing/editEvent',
                    name: 'Edit-Event',
                    component: () => import('@/views/marketing/editEvent.vue')
                },
                // Campaigns
                {
                    path: '/marketing/listCampaign',
                    name: 'List-Campaign',
                    component: () => import('@/views/marketing/listCampaign.vue')
                },
                {
                    path: '/marketing/detailCampaign',
                    name: 'Detail-Campaign',
                    component: () => import('@/views/marketing/detailCampaign.vue')
                },
                {
                    path: '/marketing/createCampaign',
                    name: 'Create-Campaign',
                    component: () => import('@/views/marketing/createCampaign.vue')
                },
                {
                    path: '/marketing/editCampaign',
                    name: 'Edit-Campaign',
                    component: () => import('@/views/marketing/editCampaign.vue')
                },
                {
                    path: '/marketing/inviteDealer',
                    name: 'Invite-Dealer',
                    component: () => import('@/views/marketing/inviteDealer.vue')
                },
                // Games
                {
                    path: '/marketing/listGame',
                    name: 'List-Game',
                    component: () => import('@/views/marketing/listGame.vue')
                },
                {
                    path: '/marketing/detailGame',
                    name: 'Detail-Game',
                    component: () => import('@/views/marketing/detailGame.vue')
                },
                {
                    path: '/marketing/createGame',
                    name: 'Create-Game',
                    component: () => import('@/views/marketing/createGame.vue')
                },
                {
                    path: '/marketing/editGame',
                    name: 'Edit-Game',
                    component: () => import('@/views/marketing/editGame.vue')
                },
                // Redemptions
                {
                    path: '/marketing/listRedemption',
                    name: 'List-Redemption',
                    component: () => import('@/views/marketing/listRedemption.vue')
                },
                {
                    path: '/marketing/detailRedemption',
                    name: 'Detail-Redemption',
                    component: () => import('@/views/marketing/detailRedemption.vue')
                },
                {
                    path: '/marketing/editRedemption',
                    name: 'Edit-Redemption',
                    component: () => import('@/views/marketing/editRedemption.vue')
                },
                // Members
                {
                    path: '/marketing/listEtenUser',
                    name: 'List-Member',
                    component: () => import('@/views/marketing/listEtenUser.vue')
                },
                {
                    path: '/marketing/detailEtenUser',
                    name: 'Detail-Member',
                    component: () => import('@/views/marketing/detailEtenUser.vue')
                },
                {
                    path: '/marketing/editEtenUser',
                    name: 'Edit-Member',
                    component: () => import('@/views/marketing/editEtenUser.vue')
                },
                // Catalogue
                {
                    path: '/marketing/listCatalogue',
                    name: 'List-Catalogue',
                    component: () => import('@/views/marketing/listCatalogue.vue')
                },
                {
                    path: '/marketing/detailCatalogue',
                    name: 'Detail-Catalogue',
                    component: () => import('@/views/marketing/detailCatalogue.vue')
                },
                {
                    path: '/marketing/editCatalogue',
                    name: 'Edit-Catalogue',
                    component: () => import('@/views/marketing/editCatalogue.vue')
                },
                {
                    path: '/marketing/createCatalogue',
                    name: 'Create-Catalogue',
                    component: () => import('@/views/marketing/createCatalogue.vue')
                },

                // ===============================
                // TECHNICAL
                // ===============================
                // Warranty Claims
                {
                    path: '/technical/listClaim',
                    name: 'List-Claim',
                    component: () => import('@/views/technical/listClaim.vue')
                },
                {
                    path: '/technical/detailWarantyClaim',
                    name: 'Detail-Waranty-Claim',
                    component: () => import('@/views/technical/detailWarantyClaim.vue')
                },
                {
                    path: '/technical/createOrder',
                    name: 'Create-Order',
                    component: () => import('@/views/technical/createOrder.vue')
                },
                {
                    path: '/technical/confirmationOrder',
                    name: 'Confirmation-Order',
                    component: () => import('@/views/technical/confirmationOrder.vue')
                },
                {
                    path: '/technical/listCTC',
                    name: 'List-CTC',
                    component: () => import('@/views/technical/listCTC.vue')
                },
                {
                    path: '/technical/createCTC',
                    name: 'Create-CTC',
                    component: () => import('@/views/technical/createCTC.vue')
                },
                {
                    path: '/technical/listScrap',
                    name: 'List-Scrap',
                    component: () => import('@/views/technical/listScrap.vue')
                },
                {
                    path: '/technical/listInvoice',
                    name: 'List-Invoice',
                    component: () => import('@/views/technical/listInvoice.vue')
                },
                // Products
                {
                    path: '/technical/listProduct',
                    name: 'List-Product',
                    component: () => import('@/views/technical/listProduct.vue')
                },
                {
                    path: '/technical/bulkUpdate',
                    name: 'Bulk-Update',
                    component: () => import('@/views/technical/bulkUpdate.vue')
                },
                {
                    path: '/technical/twpTireList',
                    name: 'TWP-List',
                    component: () => import('@/views/technical/twpTireList.vue')
                },
                {
                    path: '/technical/addTwpTire',
                    name: 'Add-TWP-Tire',
                    component: () => import('@/views/technical/addTwpTire.vue')
                },
                {
                    path: '/technical/detailProduct',
                    name: 'Detail-Twp-Tire',
                    component: () => import('@/views/technical/detailProduct.vue')
                },

                // ===============================
                // IT
                // ===============================

                //Admin
                {
                    path: '/it/listGroup',
                    name: 'List-Group',
                    component: () => import('@/views/it/listGroup.vue')
                },
                {
                    path: '/it/createGroup',
                    name: 'Create-Group',
                    component: () => import('@/views/it/createGroup.vue')
                },
                {
                    path: '/it/editGroup',
                    name: 'Edit-Group',
                    component: () => import('@/views/it/editGroup.vue')
                },
                {
                    path: '/it/listUserAccount',
                    name: 'List-User-Account',
                    component: () => import('@/views/it/listUserAccount.vue')
                },
                {
                    path: '/it/createUserAccount',
                    name: 'Create-User-Account',
                    component: () => import('@/views/it/createUserAccount.vue')
                },
                {
                    path: '/it/editUserAccount',
                    name: 'Edit-User-Account',
                    component: () => import('@/views/it/editUserAccount.vue')
                },
                //Salesman
                {
                    path: '/it/listSalesAccount',
                    name: 'List-Sales',
                    component: () => import('@/views/it/listSalesAccount.vue')
                },
                {
                    path: '/it/createSalesAccount',
                    name: 'Create-Sales',
                    component: () => import('@/views/it/createSalesAccount.vue')
                },
                {
                    path: '/it/editSalesAcc',
                    name: 'Edit-Sales',
                    component: () => import('@/views/it/editSalesAcc.vue')
                },

                //Setting
                {
                    path: '/it/maintenanceMode',
                    name: 'Maintenance-Mode',
                    component: () => import('@/views/it/maintenanceMode.vue')
                },
                {
                    path: '/it/listMailSetting',
                    name: 'Email-Setting',
                    component: () => import('@/views/it/listMailSetting.vue')
                },
                {
                    path: '/it/mailSetting',
                    name: 'list-Setting',
                    component: () => import('@/views/it/mailSetting.vue')
                },
                {
                    path: '/it/editMailSetting',
                    name: 'Edit-Mail',
                    component: () => import('@/views/it/mailSetting.vue')
                },
                {
                    path: '/it/terms&cond',
                    name: 'Terms-Condition',
                    component: () => import('@/views/it/terms&cond.vue')
                },

                // ===============================
                // SCM
                // ===============================
                {
                    path: '/scm/listCollection',
                    name: 'Collection-List',
                    component: () => import('@/views/scm/listCollection.vue')
                },
                {
                    path: '/scm/detailCollection',
                    name: 'Collection-Detail',
                    component: () => import('@/views/scm/detailCollection.vue')
                },
                {
                    path: '/scm/createCollection',
                    name: 'Create-Collection',
                    component: () => import('@/views/scm/createCollection.vue')
                },
                {
                    path: '/scm/returnCollection',
                    name: 'Return-Collection',
                    component: () => import('@/views/scm/returnCollection.vue')
                },

                // ===============================
                // COMMENTED (for future use)
                // ===============================
                // UI Kit
                {
                    path: '/',
                    name: 'dashboard',
                    component: () => import('@/views/Dashboard.vue')
                },
                {
                    path: '/uikit/formlayout',
                    name: 'formlayout',
                    component: () => import('@/views/uikit/FormLayout.vue')
                },
                {
                    path: '/uikit/input',
                    name: 'input',
                    component: () => import('@/views/uikit/InputDoc.vue')
                },
                {
                    path: '/uikit/button',
                    name: 'button',
                    component: () => import('@/views/uikit/ButtonDoc.vue')
                },
                {
                    path: '/uikit/table',
                    name: 'table',
                    component: () => import('@/views/uikit/TableDoc.vue')
                },
                {
                    path: '/uikit/list',
                    name: 'list',
                    component: () => import('@/views/uikit/ListDoc.vue')
                },
                {
                    path: '/uikit/tree',
                    name: 'tree',
                    component: () => import('@/views/uikit/TreeDoc.vue')
                },
                {
                    path: '/uikit/panel',
                    name: 'panel',
                    component: () => import('@/views/uikit/PanelsDoc.vue')
                },

                {
                    path: '/uikit/overlay',
                    name: 'overlay',
                    component: () => import('@/views/uikit/OverlayDoc.vue')
                },
                {
                    path: '/uikit/media',
                    name: 'media',
                    component: () => import('@/views/uikit/MediaDoc.vue')
                },
                {
                    path: '/uikit/message',
                    name: 'message',
                    component: () => import('@/views/uikit/MessagesDoc.vue')
                },
                {
                    path: '/uikit/file',
                    name: 'file',
                    component: () => import('@/views/uikit/FileDoc.vue')
                },
                {
                    path: '/uikit/menu',
                    name: 'menu',
                    component: () => import('@/views/uikit/MenuDoc.vue')
                },
                {
                    path: '/uikit/charts',
                    name: 'charts',
                    component: () => import('@/views/uikit/ChartDoc.vue')
                },
                {
                    path: '/uikit/misc',
                    name: 'misc',
                    component: () => import('@/views/uikit/MiscDoc.vue')
                },
                {
                    path: '/uikit/timeline',
                    name: 'timeline',
                    component: () => import('@/views/uikit/TimelineDoc.vue')
                },

                // UI Kit
                {
                    path: '/pages/empty',
                    name: 'empty',
                    component: () => import('@/views/pages/Empty.vue')
                },
                {
                    path: '/pages/crud',
                    name: 'crud',
                    component: () => import('@/views/pages/Crud.vue')
                },
                {
                    path: '/documentation',
                    name: 'documentation',
                    component: () => import('@/views/pages/Documentation.vue')
                },
            ]
        },

        // ===============================
        // Public Pages
        // ===============================
        {
            path: '/landing',
            name: 'landing',
            component: () => import('@/views/pages/Landing.vue')
        },
        {
            path: '/pages/notfound',
            name: 'notfound',
            component: () => import('@/views/pages/NotFound.vue')
        },
        {
            path: '/auth/login',
            name: 'login',
            component: () => import('@/views/pages/auth/Login.vue')
        },
        {
            path: '/auth/access',
            name: 'accessDenied',
            component: () => import('@/views/pages/auth/Access.vue')
        },
        {
            path: '/auth/error',
            name: 'error',
            component: () => import('@/views/pages/auth/Error.vue')
        }
    ]
});

export default router;
