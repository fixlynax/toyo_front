import AppLayout from '@/layout/AppLayout.vue';
import { createRouter, createWebHistory } from 'vue-router';
import { tokenService } from '@/service/api';
import { sassTrue } from 'sass';

const BASE_PATH  = '/etenadmin/';

const router = createRouter({
    history: createWebHistory(BASE_PATH ),
    routes: [
        // ===============================
        // PUBLIC PAGES (No Layout)
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
        },

        // ===============================
        // PROTECTED ROUTES (With Layout)
        // ===============================
        {
            path: '/',
            component: AppLayout,
            children: [
                // ===============================
                // TEST API CONNECTION
                // ===============================
                {
                    path: 'test-api',
                    name: 'Test-API',
                    component: () => import('@/views/TestAPI.vue')
                },

                // ===============================
                // DASHBOARD
                // ===============================
                {
                    path: '',
                    name: 'dashboard',
                    component: () => import('@/views/Dashboard.vue')
                },
                {
                    path: 'FUNC_TEST',
                    name: 'test',
                    component: () => import('@/views/Dashboard.vue'),
                    meta: { requiresAuth: true, requiredFunc: 'CAN_VIEW_DASHBOARD' }
                },
                // ===============================
                // OM (Order Management)
                // ===============================
                // Customer eTEN
                {
                    path: 'om/omDashboard',
                    name: 'OM-Dashboard',
                    component: () => import('@/views/om/omDashboard.vue')
                },
                {
                    path: 'om/listEten',
                    name: 'List-Eten',
                    component: () => import('@/views/om/listEten.vue')
                },
                {
                    path: 'om/createEten',
                    name: 'Create-Eten',
                    component: () => import('@/views/om/createEten.vue')
                },
                {
                    path: 'om/detailEten/:custAccNo',
                    name: 'Detail-Eten',
                    component: () => import('@/views/om/detailEten.vue'),
                    props: true
                },
                {
                    path: 'om/editEtenUser/:id',
                    name: 'Edit-Eten-User',
                    component: () => import('@/views/om/editEtenUser.vue'),
                    props: true
                },
                {
                    path: 'om/confirmationEten',
                    name: 'Confirmation-Eten',
                    component: () => import('@/views/om/confirmationEten.vue')
                },
                {
                    path: 'om/editEten',
                    name: 'Edit-Eten',
                    component: () => import('@/views/om/editEten.vue')
                },
                {
                    path: 'om/createUserEten/:custAccNo',
                    name: 'Create-User-Eten',
                    component: () => import('@/views/om/createUserEten.vue'),
                    props: true
                },
                {
                    path: 'om/detailUser/:id',
                    name: 'Detail-User',
                    component: () => import('@/views/om/detailUser.vue')
                },
                {
                    path: 'om/manageDevices/:id',
                    name: 'Manage-Devices',
                    component: () => import('@/views/om/manageDevices.vue'),
                    props: true
                },
                {
                    path: 'om/editUser',
                    name: 'Edit-User',
                    component: () => import('@/views/om/editUser.vue')
                },

                // Order Management
                {
                    path: 'om/listOrder',
                    name: 'List-Order',
                    component: () => import('@/views/om/listOrder.vue')
                },
                {
                    path: 'om/createOrder',
                    name: 'create-Order',
                    component: () => import('@/views/om/createOrder.vue')
                },
                {
                    path: 'om/confirmOrder',
                    name: 'confirm-Order',
                    component: () => import('@/views/om/confirmOrder.vue')
                },
                {
                    path: 'om/detailOrder/:orderNo',
                    name: 'Detail-Order',
                    component: () => import('@/views/om/detailOrder.vue'),
                    props: true
                },

                // Back Order
                {
                    path: 'om/listBackOrder',
                    name: 'List-Back-Order',
                    component: () => import('@/views/om/listBackOrder.vue')
                },
                {
                    path: 'om/detailBackOrder/:boNo',
                    name: 'Detail-Back-Order',
                    component: () => import('@/views/om/detailBackOrder.vue'),
                    props: true
                },

                // Return Order
                {
                    path: 'om/listReturnOrder',
                    name: 'List-Return-Order',
                    component: () => import('@/views/om/listReturnOrder.vue')
                },
                {
                    path: 'om/detailReturnOrder/:retOrdNo',
                    name: 'Detail-Return-Order',
                    component: () => import('@/views/om/detailReturnOrder.vue'),
                    props: true
                },
                {
                    path: 'om/createReturnOrder',
                    name: 'Create-Return-Order',
                    component: () => import('@/views/om/createReturnOrder.vue')
                },

                // Report
                {
                    path: 'om/reportSF',
                    name: 'Report-Sales-Forecast',
                    component: () => import('@/views/om/reportSF.vue')
                },
                {
                    path: 'om/reportBackOrder',
                    name: 'Report-Back-Order',
                    component: () => import('@/views/om/reportBackOrder.vue')
                },
                {
                    path: 'om/reportDirectShipment',
                    name: 'Report-Direct-Shipment',
                    component: () => import('@/views/om/reportDirectShipment.vue')
                },
                {
                    path: 'om/reportOwnCollection',
                    name: 'Report-Own-Collection',
                    component: () => import('@/views/om/reportOwnCollection.vue')
                },

                // Sales Program
                {
                    path: 'om/listSalesProgram',
                    name: 'List-SalesProgram',
                    component: () => import('@/views/om/listSalesProgram.vue')
                },
                {
                    path: 'om/detailSalesProgram/:id',
                    name: 'Detail-Sales-Program',
                    component: () => import('@/views/om/detailSalesProgram.vue'),
                    props: true
                },
                {
                    path: 'om/createSalesProgram',
                    name: 'Create-Sales-Program',
                    component: () => import('@/views/om/createSalesProgram.vue')
                },
                {
                    path: 'om/createSalesProgramVersion2',
                    name: 'Create-Sales-Program-version2',
                    component: () => import('@/views/om/createSalesProgramVersion2.vue')
                },
                {
                    path: 'om/editSalesProgram/:id',
                    name: 'Edit-Sales-Program',
                    component: () => import('@/views/om/editSalesProgram.vue'),
                    props: true
                },

                // Maintenance
                {
                    path: 'om/listDisableOrderNS',
                    name: 'Disable-Order-NS',
                    component: () => import('@/views/om/ListDisableOrderNS.vue')
                },
                {
                    path: 'om/listDisableOrderDS',
                    name: 'Disable-Order-DS',
                    component: () => import('@/views/om/ListDisableOrderDS.vue')
                },
                {
                    path: 'om/listMonthEndClosing',
                    name: 'Month-End-Closing',
                    component: () => import('@/views/om/listMonthEndClosing.vue')
                },
                {
                    path: 'om/ListMaterialException',
                    name: 'Material-Exception',
                    component: () => import('@/views/om/listMaterialException.vue')
                },

                // ===============================
                // MARKETING
                // ===============================
                // News
                {
                    path: 'marketing/listNews',
                    name: 'List-News',
                    component: () => import('@/views/marketing/listNews.vue')
                },
                {
                    path: 'marketing/createNews',
                    name: 'Create-News',
                    component: () => import('@/views/marketing/createNews.vue')
                },
                {
                    path: 'marketing/detailNews/:id',
                    name: 'Detail-News',
                    component: () => import('@/views/marketing/detailNews.vue'),
                    props: true
                },
                {
                    path: 'marketing/editNews/:id',
                    name: 'Edit-News',
                    component: () => import('@/views/marketing/editNews.vue'),
                    props: true
                },

                // Events
                {
                    path: 'marketing/listEvent',
                    name: 'List-Event',
                    component: () => import('@/views/marketing/listEvent.vue')
                },
                {
                    path: 'marketing/createEvent',
                    name: 'Create-Event',
                    component: () => import('@/views/marketing/createEvent.vue')
                },
                {
                    path: 'marketing/detailEvent/:id',
                    name: 'Detail-Event',
                    component: () => import('@/views/marketing/detailEvent.vue'),
                    props: true
                },
                {
                    path: 'marketing/editEvent/:id',
                    name: 'Edit-Event',
                    component: () => import('@/views/marketing/editEvent.vue'),
                     props: true
                },

                // Campaigns
                {
                    path: 'marketing/listCampaign',
                    name: 'List-Campaign',
                    component: () => import('@/views/marketing/listCampaign.vue')
                },
                {
                    path: 'marketing/detailCampaign/:id',
                    name: 'Detail-Campaign',
                    component: () => import('@/views/marketing/detailCampaign.vue'),
                    props: true
                },
                {
                    path: 'marketing/createCampaign',
                    name: 'Create-Campaign',
                    component: () => import('@/views/marketing/createCampaign.vue')
                },
                {
                    path: 'marketing/editCampaign',
                    name: 'Edit-Campaign',
                    component: () => import('@/views/marketing/editCampaign.vue')
                },
                {
                    path: 'marketing/inviteDealer',
                    name: 'Invite-Dealer',
                    component: () => import('@/views/marketing/inviteDealer.vue')
                },
                {
                    path: 'marketing/detailParticipant',
                    name: 'Detail-Participant',
                    component: () => import('@/views/marketing/detailParticipant.vue')
                },

                // Games
                {
                    path: 'marketing/listGame',
                    name: 'List-Game',
                    component: () => import('@/views/marketing/listGame.vue')
                },
                {
                    path: 'marketing/detailGame/:id',
                    name: 'Detail-Game',
                    component: () => import('@/views/marketing/detailGame.vue'),
                    props: true
                },
                {
                    path: 'marketing/createGame',
                    name: 'Create-Game',
                    component: () => import('@/views/marketing/createGame.vue')
                },
                {
                    path: 'marketing/editGame/:id',
                    name: 'Edit-Game',
                    component: () => import('@/views/marketing/editGame.vue'),
                    props: true
                },

                // Redemptions
                {
                    path: 'marketing/listRedemption',
                    name: 'List-Redemption',
                    component: () => import('@/views/marketing/listRedemption.vue')
                },
                {
                    path: 'marketing/detailRedemption/:id',
                    name: 'Detail-Redemption',
                    component: () => import('@/views/marketing/detailRedemption.vue'),
                    props: true
                },
                {
                    path: 'marketing/editRedemption/:id',
                    name: 'Edit-Redemption',
                    component: () => import('@/views/marketing/editRedemption.vue'),
                    props: true
                },

                // Members
                {
                    path: 'marketing/memberDashboard',
                    name: 'member-Dashboard',
                    component: () => import('@/views/marketing/memberDashboard.vue')
                },
                {
                    path: 'marketing/listEtenUser',
                    name: 'List-Member',
                    component: () => import('@/views/marketing/listEtenUser.vue')
                },
                {
                    path: 'marketing/detailEtenUser/:id',
                    name: 'Detail-Member',
                    component: () => import('@/views/marketing/detailEtenUser.vue'),
                    props: true
                },
                {
                    path: 'marketing/editEtenUser/:id',
                    name: 'Edit-Member',
                    component: () => import('@/views/marketing/editEtenUser.vue'),
                    props: true
                },
                {
                    path: 'marketing/referralRewardPoint',
                    name: 'Referral-Reward-Point',
                    component: () => import('@/views/marketing/referralRewardPoint.vue')
                },

                // Catalogue
                {
                    path: 'marketing/listCatalogue',
                    name: 'List-Catalogue',
                    component: () => import('@/views/marketing/listCatalogue.vue')
                },
                {
                    path: 'marketing/detailCatalogue/:id',
                    name: 'Detail-Catalogue',
                    component: () => import('@/views/marketing/detailCatalogue.vue'),
                    props: true
                },
                {
                    path: 'marketing/editCatalogue/:id',
                    name: 'Edit-Catalogue',
                    component: () => import('@/views/marketing/editCatalogue.vue'),
                    props: true
                },
                {
                    path: 'marketing/createCatalogue',
                    name: 'Create-Catalogue',
                    component: () => import('@/views/marketing/createCatalogue.vue')
                },

                // Report
                {
                    path: 'marketing/reportMember',
                    name: 'Report-Member',
                    component: () => import('@/views/marketing/reportMember.vue')
                },
                {
                    path: 'marketing/reportReferral',
                    name: 'Report-Referral',
                    component: () => import('@/views/marketing/reportReferral.vue')
                },

                // ===============================
                // TECHNICAL
                // ===============================
                // Dashboard
                {
                    path: 'technical/dashboardTechnical',
                    name: 'Dashboard-Technical',
                    component: () => import('@/views/technical/dashboardTechnical.vue')
                },
                {
                    path: 'technical/listAppoitment',
                    name: 'List-Appointment',
                    component: () => import('@/views/technical/listAppoitment.vue')
                },
                {
                    path: 'technical/detailAppointment',
                    name: 'Detail-Appointment',
                    component: () => import('@/views/technical/detailAppointment.vue')
                },

                // Warranty Claims
                {
                    path: 'technical/listClaim',
                    name: 'List-Claim',
                    component: () => import('@/views/technical/listClaim.vue')
                },
                {
                    path: 'technical/listClaim_copy',
                    name: 'Backup-List-Claim',
                    component: () => import('@/views/technical/listClaim_copy.vue')
                },
                {
                    path: 'technical/detailWarantyClaim/:id',
                    name: 'Detail-Waranty-Claim',
                    component: () => import('@/views/technical/detailWarantyClaim.vue'),
                    props: true
                },
                                {
                    path: 'technical/detailWarantyClaim_copy/:id',
                    name: 'Hardcode-Waranty-Claim',
                    component: () => import('@/views/technical/detailWarantyClaim_copy.vue'),
                    props: true
                },
                {
                    path: 'technical/createOrder',
                    name: 'Create-Order',
                    component: () => import('@/views/technical/createOrder.vue')
                },
                {
                    path: 'technical/confirmationOrder',
                    name: 'Confirmation-Order',
                    component: () => import('@/views/technical/confirmationOrder.vue')
                },

                // CTC (Customer Technical Complaint)
                {
                    path: 'technical/listCTC',
                    name: 'List-CTC',
                    component: () => import('@/views/technical/listCTC.vue')
                },
                {
                    path: 'technical/createCTC',
                    name: 'Create-CTC',
                    component: () => import('@/views/technical/createCTC.vue')
                },

                // Scrap Management
                {
                    path: 'technical/listScrap',
                    name: 'List-Scrap',
                    component: () => import('@/views/technical/listScrap.vue')
                },
                {
                    path: 'technical/createScrap',
                    name: 'Create-Scrap',
                    component: () => import('@/views/technical/createScrap.vue')
                },

                // Products
                {
                    path: 'technical/listProduct',
                    name: 'List-Product',
                    component: () => import('@/views/technical/listProduct.vue')
                },
                {
                    path: 'technical/listOETire',
                    name: 'List-OE-Tire',
                    component: () => import('@/views/technical/listOETire.vue')
                },
                {
                    path: 'technical/listPattern',
                    name: 'List-Pattern',
                    component: () => import('@/views/technical/listPattern.vue')
                },
                {
                    path: 'technical/detailPattern/:id',
                    name: 'Detail-Pattern',
                    component: () => import('@/views/technical/detailPattern.vue'),
                    props: true
                },
                {
                    path: 'technical/bulkUpdate',
                    name: 'Bulk-Update',
                    component: () => import('@/views/technical/bulkUpdate.vue')
                },
                {
                    path: 'technical/detailProduct',
                    name: 'Detail-Product',
                    component: () => import('@/views/technical/detailProduct.vue')
                },
                {
                    path: 'technical/createPattern',
                    name: 'Create-Pattern',
                    component: () => import('@/views/technical/createPattern.vue')
                },

                // ===============================
                // IT
                // ===============================
                // Admin - Groups
                {
                    path: 'it/listGroup',
                    name: 'List-Group',
                    component: () => import('@/views/it/listGroup.vue')
                },
                {
                    path: 'it/createGroup',
                    name: 'Create-Group',
                    component: () => import('@/views/it/createGroup.vue')
                },
                {
                    path: 'it/editGroup',
                    name: 'Edit-Group',
                    component: () => import('@/views/it/editGroup.vue')
                },

                // Admin - User Accounts
                {
                    path: 'it/listUserAccount',
                    name: 'List-User-Account',
                    component: () => import('@/views/it/listUserAccount.vue')
                },
                {
                    path: 'it/createUserAccount',
                    name: 'Create-User-Account',
                    component: () => import('@/views/it/createUserAccount.vue')
                },
                {
                    path: 'it/editUserAccount',
                    name: 'Edit-User-Account',
                    component: () => import('@/views/it/editUserAccount.vue')
                },

                // Salesman Accounts
                {
                    path: 'it/listSalesAccount',
                    name: 'List-Sales',
                    component: () => import('@/views/it/listSalesAccount.vue')
                },
                {
                    path: 'it/createSalesAccount',
                    name: 'Create-Sales',
                    component: () => import('@/views/it/createSalesAccount.vue')
                },
                {
                    path: 'it/editSalesAcc',
                    name: 'Edit-Sales',
                    component: () => import('@/views/it/editSalesAcc.vue')
                },

                // Settings
                {
                    path: 'it/maintenanceMode',
                    name: 'Maintenance-Mode',
                    component: () => import('@/views/it/maintenanceMode.vue')
                },
                {
                    path: 'it/listMailSetting',
                    name: 'Email-Setting',
                    component: () => import('@/views/it/listMailSetting.vue')
                },
                {
                    path: 'it/createMail',
                    name: 'Create-Mail',
                    component: () => import('@/views/it/createMail.vue')
                },
                {
                    path: 'it/editMailSetting',
                    name: 'Edit-Mail',
                    component: () => import('@/views/it/editMailSetting.vue')
                },
                {
                    path: 'it/termsCondition',
                    name: 'Terms-Condition',
                    component: () => import('@/views/it/termsCondition.vue')
                },

                // ===============================
                // BILLING
                // ===============================
                // Account Details
                {
                    path: 'billing/listAccountDetail',
                    name: 'Billing-Account',
                    component: () => import('@/views/billing/listAccountDetail.vue')
                },

                // Billing History
                {
                    path: 'billing/listBilling',
                    name: 'Billing',
                    component: () => import('@/views/billing/listBilling.vue')
                },
                {
                    path: 'billing/listEbilling',
                    name: 'E-Billing',
                    component: () => import('@/views/billing/listEbilling.vue')
                },
                {
                    path: 'billing/listOther',
                    name: 'List-Other',
                    component: () => import('@/views/billing/listOther.vue')
                },
                {
                    path: 'billing/listStatement',
                    name: 'List-Statement',
                    component: () => import('@/views/billing/listStatement.vue')
                },
                {
                    path: 'billing/listMessaging',
                    name: 'List-Messaging',
                    component: () => import('@/views/billing/listMessaging.vue')
                },
                // In your router/index.js file
                {
                    path: 'billing/detailMessaging',
                    name: 'Detail-Messaging',
                    component: () => import('@/views/billing/detailMessaging.vue')
                },
                {
                    path: 'billing/createMessaging',
                    name: 'Create-Messaging',
                    component: () => import('@/views/billing/createMessaging.vue')
                },

                // ===============================
                // SCM (Supply Chain Management)
                // ===============================
                // Warranty CTC
                {
                    path: 'scm/listCollection',
                    name: 'Collection-List',
                    component: () => import('@/views/scm/listCollection.vue')
                },
                {
                    path: 'scm/detailCollection',
                    name: 'Collection-Detail',
                    component: () => import('@/views/scm/detailCollection.vue'),
                    props: true
                },
                {
                    path: 'scm/returnCollection',
                    name: 'Return-Collection',
                    component: () => import('@/views/scm/returnCollection.vue')
                },
                {
                    path: 'scm/detailReturnList',
                    name: 'Return-List',
                    component: () => import('@/views/scm/detailReturnList.vue')
                },

                // Order
                {
                    path: 'scm/listOrderDelivery',
                    name: 'List-Order-Delivery',
                    component: () => import('@/views/scm/listOrderDelivery.vue')
                },
                {
                    path: 'scm/detailOrderDelivery/:id',
                    name: 'Detail-Order-Delivery',
                    component: () => import('@/views/scm/detailOrderDelivery.vue'),
                    props: true
                },
                {
                    path: 'scm/listOrderPickup',
                    name: 'List-Order-Pickup',
                    component: () => import('@/views/scm/listOrderPickup.vue')
                },
                {
                    path: 'scm/detailOrderPickup/:id',
                    name: 'Detail-Order-Pickup',
                    component: () => import('@/views/scm/detailOrderPickup.vue'),
                    props: true
                },

                // Return
                {
                    path: 'scm/listReturnOrder',
                    name: 'List-Return-Order-SCM',
                    component: () => import('@/views/scm/listReturnOrder.vue')
                },
                {
                    path: 'scm/detailReturnOrder/:id',
                    name: 'Detail-Return-Order-SCM',
                    component: () => import('@/views/scm/detailReturnOrder.vue'),
                    props: true
                },

                // Area ETA
                {
                    path: 'scm/listAreaETA',
                    name: 'List-Area-ETA',
                    component: () => import('@/views/scm/listAreaETA.vue')
                },

                // Logistic Account
                {
                    path: 'scm/listLogistic',
                    name: 'List-Logistic',
                    component: () => import('@/views/scm/listLogistic.vue')
                },
                {
                    path: 'scm/detailLogistic/:id',
                    name: 'Detail-Logistic',
                    component: () => import('@/views/scm/detailLogistic.vue'),
                    props: true
                },
                {
                    path: 'scm/createlogistic',
                    name: 'Create-Logistic',
                    component: () => import('@/views/scm/createlogistic.vue')
                },
                {
                    path: 'scm/editLogistic/:id',
                    name: 'Edit-Logistic',
                    component: () => import('@/views/scm/editLogistic.vue'),
                    props: true
                },

                // Back Order
                {
                    path: 'scm/listSCMBackOrder',
                    name: 'List-SCM-BackOrder',
                    component: () => import('@/views/scm/listSCMBackOrder.vue')
                },
                {
                    path: 'scm/detailSCMBackOrder/:boNo',
                    name: 'Detail-SCM-BackOrder',
                    component: () => import('@/views/scm/detailSCMBackOrder.vue'),
                    props: true
                },

                // ===============================
                // UI KIT (Documentation/Components)
                // ===============================
                {
                    path: 'uikit/formlayout',
                    name: 'formlayout',
                    component: () => import('@/views/uikit/FormLayout.vue')
                },
                {
                    path: 'uikit/input',
                    name: 'input',
                    component: () => import('@/views/uikit/InputDoc.vue')
                },
                {
                    path: 'uikit/button',
                    name: 'button',
                    component: () => import('@/views/uikit/ButtonDoc.vue')
                },
                {
                    path: 'uikit/table',
                    name: 'table',
                    component: () => import('@/views/uikit/TableDoc.vue')
                },
                {
                    path: 'uikit/list',
                    name: 'list',
                    component: () => import('@/views/uikit/ListDoc.vue')
                },
                {
                    path: 'uikit/tree',
                    name: 'tree',
                    component: () => import('@/views/uikit/TreeDoc.vue')
                },
                {
                    path: 'uikit/panel',
                    name: 'panel',
                    component: () => import('@/views/uikit/PanelsDoc.vue')
                },
                {
                    path: 'uikit/overlay',
                    name: 'overlay',
                    component: () => import('@/views/uikit/OverlayDoc.vue')
                },
                {
                    path: 'uikit/media',
                    name: 'media',
                    component: () => import('@/views/uikit/MediaDoc.vue')
                },
                {
                    path: 'uikit/message',
                    name: 'message',
                    component: () => import('@/views/uikit/MessagesDoc.vue')
                },
                {
                    path: 'uikit/file',
                    name: 'file',
                    component: () => import('@/views/uikit/FileDoc.vue')
                },
                {
                    path: 'uikit/menu',
                    name: 'menu',
                    component: () => import('@/views/uikit/MenuDoc.vue')
                },
                {
                    path: 'uikit/charts',
                    name: 'charts',
                    component: () => import('@/views/uikit/ChartDoc.vue')
                },
                {
                    path: 'uikit/misc',
                    name: 'misc',
                    component: () => import('@/views/uikit/MiscDoc.vue')
                },
                {
                    path: 'uikit/timeline',
                    name: 'timeline',
                    component: () => import('@/views/uikit/TimelineDoc.vue')
                },

                // ===============================
                // PAGES
                // ===============================
                {
                    path: 'pages/empty',
                    name: 'empty',
                    component: () => import('@/views/pages/Empty.vue')
                },
                {
                    path: 'unauthorized_test',
                    name: 'unauthorize',
                    component: () => import('@/views/pages/Empty.vue')
                },
                {
                    path: 'pages/crud',
                    name: 'crud',
                    component: () => import('@/views/pages/Crud.vue')
                },
                {
                    path: 'documentation',
                    name: 'documentation',
                    component: () => import('@/views/pages/Documentation.vue')
                }
            ]
        },

        // ===============================
        // CATCH ALL ROUTE - 404
        // ===============================
        {
            path: '/:pathMatch(.*)*',
            redirect: '/pages/notfound'
        }
    ]
});

// Route guard
router.beforeEach((to, from, next) => {
    const publicPages = ['/auth/login', '/auth/access', '/auth/error', '/landing', '/pages/notfound'];
    
    const relativePath = to.path.replace(BASE_PATH, '/');
    const authRequired = !publicPages.includes(relativePath);
    const loggedIn = tokenService.getToken() && !tokenService.isTokenExpired();
    const userFuncs = ['CANNOT_VIEW_DASHBOARD']
    // redirect respecting router base
    if (authRequired && !loggedIn) return next('/auth/login');
    if (relativePath === '/auth/login' && loggedIn) return next('/'); // default child
    
    if (to.meta.requiredFunc && !userFuncs.includes(to.meta.requiredFunc)) {
        return next('/unauthorized_test');
    }

    next();
});

export default router;
