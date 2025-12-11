import AppLayout from '@/layout/AppLayout.vue';
import { createRouter, createWebHistory } from 'vue-router';
import { tokenService } from '@/service/api';
import { sassTrue } from 'sass';
import { useMenuStore } from '@/store/menu';
// const BASE_PATH  = '/etenadmin/';
const BASE_PATH = '/';
const router = createRouter({
    history: createWebHistory(BASE_PATH),
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
            path: '/auth/forgot-password',
            name: 'forgotPassword',
            component: () => import('@/views/pages/auth/ForgotPassword.vue')
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
                // DASHBOARD
                // ===============================
                {
                    path: 'dashboard',
                    name: 'dashboard',
                    component: () => import('@/views/Dashboard.vue')
                },
                {
                    path: 'welcome',
                    name: 'welcome',
                    component: () => import('@/views/WelcomePage.vue')
                },
                // ===============================
                // OM (Order Management)
                // ===============================
                // Customer eTEN
                {
                    path: 'om/omDashboard',
                    name: 'OM-Dashboard',
                    component: () => import('@/views/om/omDashboard.vue'),
                    meta: { permission: 'Order Dashboard', access: 'view' }
                },
                {
                    path: 'om/listEten',
                    name: 'List-Eten',
                    component: () => import('@/views/om/listEten.vue'),
                    meta: { permission: 'Customer', access: 'view' }
                },
                {
                    path: 'om/createEten',
                    name: 'Create-Eten',
                    component: () => import('@/views/om/createEten.vue'),
                    meta: { permission: 'Customer', access: 'write' }
                },
                {
                    path: 'om/detailEten/:custAccNo',
                    name: 'Detail-Eten',
                    component: () => import('@/views/om/detailEten.vue'),
                    meta: { permission: 'Customer', access: 'view' },
                    props: true
                },
                {
                    path: 'om/editEtenUser/:id',
                    name: 'Edit-Eten-User',
                    component: () => import('@/views/om/editEtenUser.vue'),
                    meta: { permission: 'Customer', access: 'write' },
                    props: true
                },
                {
                    path: 'om/confirmationEten',
                    name: 'Confirmation-Eten',
                    component: () => import('@/views/om/confirmationEten.vue'),
                    meta: { permission: 'Customer', access: 'view' }
                },
                {
                    path: 'om/editEten/:custAccNo',
                    name: 'Edit-Eten',
                    component: () => import('@/views/om/editEten.vue'),
                    meta: { permission: 'Customer', access: 'write' }
                },
                {
                    path: 'om/createUserEten/:custAccNo',
                    name: 'Create-User-Eten',
                    component: () => import('@/views/om/createUserEten.vue'),
                    meta: { permission: 'Customer', access: 'write' },
                    props: true
                },
                {
                    path: 'om/detailUser/:id',
                    name: 'Detail-User',
                    component: () => import('@/views/om/detailUser.vue'),
                    meta: { permission: 'Customer', access: 'view' }
                },
                {
                    path: 'om/manageDevices/:id',
                    name: 'Manage-Devices',
                    component: () => import('@/views/om/manageDevices.vue'),
                    meta: { permission: 'Customer', access: 'view' },
                    props: true
                },
                {
                    path: 'om/editUser',
                    name: 'Edit-User',
                    component: () => import('@/views/om/editUser.vue'),
                    meta: { permission: 'Customer', access: 'write' }
                },

                // Order Management
                {
                    path: 'om/listOrder',
                    name: 'List-Order',
                    component: () => import('@/views/om/listOrder.vue'),
                    meta: { permission: 'Order', access: 'view' }
                },
                {
                    path: 'om/createOrder',
                    name: 'create-Order',
                    component: () => import('@/views/om/createOrder.vue'),
                    meta: { permission: 'Order', access: 'write' }
                },
                {
                    path: 'om/confirmOrder',
                    name: 'confirm-Order',
                    component: () => import('@/views/om/confirmOrder.vue'),
                    meta: { permission: 'Order', access: 'write' }
                },
                {
                    path: 'om/detailOrder/:orderNo',
                    name: 'Detail-Order',
                    component: () => import('@/views/om/detailOrder.vue'),
                    meta: { permission: 'Order', access: 'view' },
                    props: true
                },

                // Back Order
                {
                    path: 'om/listBackOrder',
                    name: 'List-Back-Order',
                    component: () => import('@/views/om/listBackOrder.vue'),
                    meta: { permission: 'Back Order', access: 'view' }
                },
                {
                    path: 'om/detailBackOrder/:boNo',
                    name: 'Detail-Back-Order',
                    component: () => import('@/views/om/detailBackOrder.vue'),
                    meta: { permission: 'Back Order', access: 'view' },
                    props: true
                },

                // Return Order
                {
                    path: 'om/listReturnOrder',
                    name: 'List-Return-Order',
                    component: () => import('@/views/om/listReturnOrder.vue'),
                    meta: { permission: 'Return Order', access: 'view' }
                },
                {
                    path: 'om/detailReturnOrder/:retOrdNo',
                    name: 'Detail-Return-Order',
                    component: () => import('@/views/om/detailReturnOrder.vue'),
                    meta: { permission: 'Return Order', access: 'view' },
                    props: true
                },
                {
                    path: 'om/createReturnOrder',
                    name: 'Create-Return-Order',
                    component: () => import('@/views/om/createReturnOrder.vue'),
                    meta: { permission: 'Return Order', access: 'create' }
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
                    component: () => import('@/views/om/listSalesProgram.vue'),
                    meta: { permission: 'Sales Program', access: 'view' }
                },
                {
                    path: 'om/detailSalesProgram/:id',
                    name: 'Detail-Sales-Program',
                    component: () => import('@/views/om/detailSalesProgram.vue'),
                    meta: { permission: 'Sales Program', access: 'view' },
                    props: true
                },
                {
                    path: 'om/createSalesProgram',
                    name: 'Create-Sales-Program',
                    component: () => import('@/views/om/createSalesProgram.vue'),
                    meta: { permission: 'Sales Program', access: 'create' }
                },
                {
                    path: 'om/editSalesProgram/:id',
                    name: 'Edit-Sales-Program',
                    component: () => import('@/views/om/editSalesProgram.vue'),
                    meta: { permission: 'Sales Program', access: 'view' },
                    props: true
                },

                // Maintenance
                {
                    path: 'om/listDisableOrderNS',
                    name: 'Disable-Order-NS',
                    component: () => import('@/views/om/ListDisableOrderNS.vue'),
                    meta: { permission: 'Maintenance Mode', access: 'view' }
                },
                {
                    path: 'om/listDisableOrderDS',
                    name: 'Disable-Order-DS',
                    component: () => import('@/views/om/ListDisableOrderDS.vue'),
                    meta: { permission: 'Maintenance Mode', access: 'view' }
                },
                {
                    path: 'om/listMonthEndClosing',
                    name: 'Month-End-Closing',
                    component: () => import('@/views/om/listMonthEndClosing.vue'),
                    meta: { permission: 'Maintenance Mode', access: 'view' }
                },
                {
                    path: 'om/ListMaterialException',
                    name: 'Material-Exception',
                    component: () => import('@/views/om/listMaterialException.vue'),
                    meta: { permission: 'Maintenance Mode', access: 'view' }
                },
                {
                    path: 'om/listContainer',
                    name: 'Container-List',
                    component: () => import('@/views/om/listContainer.vue'),
                    meta: { permission: 'Maintenance Mode', access: 'view' }
                },

                // ===============================
                // MARKETING
                // ===============================
                // News
                {
                    path: 'marketing/marketingDashboard',
                    name: 'Marketing-Dashboard',
                    component: () => import('@/views/marketing/marketingDashboard.vue'),
                    meta: { permission: 'Marketing Dashboard', access: 'view' }
                },
                {
                    path: 'marketing/listNews',
                    name: 'List-News',
                    component: () => import('@/views/marketing/listNews.vue'),
                    meta: { permission: 'News Management', access: 'view' }
                },
                {
                    path: 'marketing/createNews',
                    name: 'Create-News',
                    component: () => import('@/views/marketing/createNews.vue'),
                    meta: { permission: 'News Management', access: 'create' }
                },
                {
                    path: 'marketing/detailNews/:id',
                    name: 'Detail-News',
                    component: () => import('@/views/marketing/detailNews.vue'),
                    meta: { permission: 'News Management', access: 'view' },
                    props: true
                },
                {
                    path: 'marketing/editNews/:id',
                    name: 'Edit-News',
                    component: () => import('@/views/marketing/editNews.vue'),
                    meta: { permission: 'News Management', access: 'create' },
                    props: true
                },

                // Events
                {
                    path: 'marketing/listEvent',
                    name: 'List-Event',
                    component: () => import('@/views/marketing/listEvent.vue')
                    // meta: { permission: 'Events Management', access: 'view' },
                },
                {
                    path: 'marketing/createEvent',
                    name: 'Create-Event',
                    component: () => import('@/views/marketing/createEvent.vue')
                    // meta: { permission: 'Events Management', access: 'create' },
                },
                {
                    path: 'marketing/detailEvent/:id',
                    name: 'Detail-Event',
                    component: () => import('@/views/marketing/detailEvent.vue'),
                    // meta: { permission: 'Events Management', access: 'view' },
                    props: true
                },
                {
                    path: 'marketing/editEvent/:id',
                    name: 'Edit-Event',
                    component: () => import('@/views/marketing/editEvent.vue'),
                    // meta: { permission: 'Events Management', access: 'create' },
                    props: true
                },

                // Campaigns
                {
                    path: 'marketing/listCampaign',
                    name: 'List-Campaign',
                    component: () => import('@/views/marketing/listCampaign.vue')
                    // meta: { permission: 'Campaign Management', access: 'view' },
                },
                {
                    path: 'marketing/detailCampaign/:id',
                    name: 'Detail-Campaign',
                    component: () => import('@/views/marketing/detailCampaign.vue'),
                    // meta: { permission: 'Campaign Management', access: 'create' },
                    props: true
                },
                {
                    path: 'marketing/createCampaign',
                    name: 'Create-Campaign',
                    component: () => import('@/views/marketing/createCampaign.vue')
                    // meta: { permission: 'Campaign Management', access: 'create' },
                },
                {
                    path: 'marketing/editCampaign/:id',
                    name: 'Edit-Campaign',
                    component: () => import('@/views/marketing/editCampaign.vue'),
                    // meta: { permission: 'Campaign Management', access: 'create' },
                    props: true
                },
                {
                    path: 'marketing/inviteDealer',
                    name: 'Invite-Dealer',
                    component: () => import('@/views/marketing/inviteDealer.vue')
                    // meta: { permission: 'Campaign Management', access: 'create' },
                },
                {
                    path: 'marketing/detailParticipant',
                    name: 'Detail-Participant',
                    component: () => import('@/views/marketing/detailParticipant.vue')
                    // meta: { permission: 'Campaign Management', access: 'create' },
                },

                // Games
                {
                    path: 'marketing/listGame',
                    name: 'List-Game',
                    component: () => import('@/views/marketing/listGame.vue'),
                    meta: { permission: 'Game Management', access: 'view' }
                },
                {
                    path: 'marketing/detailGame/:id',
                    name: 'Detail-Game',
                    component: () => import('@/views/marketing/detailGame.vue'),
                    meta: { permission: 'Game Management', access: 'view' },
                    props: true
                },
                {
                    path: 'marketing/createGame',
                    name: 'Create-Game',
                    component: () => import('@/views/marketing/createGame.vue'),
                    meta: { permission: 'Game Management', access: 'create' }
                },
                {
                    path: 'marketing/editGame/:id',
                    name: 'Edit-Game',
                    component: () => import('@/views/marketing/editGame.vue'),
                    meta: { permission: 'Game Management', access: 'create' },
                    props: true
                },

                // Redemptions
                {
                    path: 'marketing/listRedemption',
                    name: 'List-Redemption',
                    component: () => import('@/views/marketing/listRedemption.vue'),
                    meta: { permission: 'Redemption Management', access: 'view' }
                },
                {
                    path: 'marketing/detailRedemption/:id',
                    name: 'Detail-Redemption',
                    component: () => import('@/views/marketing/detailRedemption.vue'),
                    meta: { permission: 'Redemption Management', access: 'view' },
                    props: true
                },
                {
                    path: 'marketing/editRedemption/:id',
                    name: 'Edit-Redemption',
                    component: () => import('@/views/marketing/editRedemption.vue'),
                    meta: { permission: 'Redemption Management', access: 'create' },
                    props: true
                },

                // Members
                {
                    path: 'marketing/memberDashboard',
                    name: 'member-Dashboard',
                    component: () => import('@/views/marketing/memberDashboard.vue'),
                    meta: { permission: 'Members Dashboard', access: 'view' }
                },
                {
                    path: 'marketing/listEtenUser',
                    name: 'List-Member',
                    component: () => import('@/views/marketing/listEtenUser.vue'),
                    meta: { permission: 'Member List', access: 'view' }
                },
                {
                    path: 'marketing/detailEtenUser/:id',
                    name: 'Detail-Member',
                    component: () => import('@/views/marketing/detailEtenUser.vue'),
                    meta: { permission: 'Member List', access: 'create' },
                    props: true
                },
                {
                    path: 'marketing/editEtenUser/:id',
                    name: 'Edit-Member',
                    component: () => import('@/views/marketing/editEtenUser.vue'),
                    meta: { permission: 'Member List', access: 'create' },
                    props: true
                },
                {
                    path: 'marketing/referralRewardPoint',
                    name: 'Referral-Reward-Point',
                    component: () => import('@/views/marketing/referralRewardPoint.vue'),
                    meta: { permission: 'Referral Reward Point', access: 'view' }
                },

                // Catalogue
                {
                    path: 'marketing/listCatalogue',
                    name: 'List-Catalogue',
                    component: () => import('@/views/marketing/listCatalogue.vue'),
                    meta: { permission: 'Reward Catalogue', access: 'view' }
                },
                {
                    path: 'marketing/detailCatalogue/:id',
                    name: 'Detail-Catalogue',
                    component: () => import('@/views/marketing/detailCatalogue.vue'),
                    meta: { permission: 'Reward Catalogue', access: 'view' },
                    props: true
                },
                {
                    path: 'marketing/editCatalogue/:id',
                    name: 'Edit-Catalogue',
                    component: () => import('@/views/marketing/editCatalogue.vue'),
                    meta: { permission: 'Reward Catalogue', access: 'create' },
                    props: true
                },
                {
                    path: 'marketing/createCatalogue',
                    name: 'Create-Catalogue',
                    component: () => import('@/views/marketing/createCatalogue.vue'),
                    meta: { permission: 'Reward Catalogue', access: 'create' }
                },

                // Warranty Registration
                {
                    path: 'marketing/listWarrantyRegistration',
                    name: 'List-Warranty-Registration',
                    component: () => import('@/views/marketing/listWarrantyRegistration.vue')
                    // meta: { permission: 'Events Management', access: 'view' },
                },
                {
                    path: 'marketing/detailWarrantyRegistration/:id',
                    name: 'Detail-Warranty-Registration',
                    component: () => import('@/views/marketing/detailWarrantyRegistration.vue'),
                    // meta: { permission: 'Events Management', access: 'view' },
                    props: true
                },

                // OE Registration
                {
                    path: 'marketing/listOERegistration',
                    name: 'List-OE-Registration',
                    component: () => import('@/views/marketing/listOERegistration.vue')
                    // meta: { permission: 'Events Management', access: 'view' },
                },
                {
                    path: 'marketing/detailOERegistration/:id',
                    name: 'Detail-OE-Registration',
                    component: () => import('@/views/marketing/detailOERegistration.vue'),
                    // meta: { permission: 'Events Management', access: 'view' },
                    props: true
                },

                // Report
                {
                    path: 'marketing/reportMember',
                    name: 'Report-Member',
                    component: () => import('@/views/marketing/reportMember.vue'),
                    meta: { permission: 'Member Report', access: 'view' }
                },
                {
                    path: 'marketing/reportReferral',
                    name: 'Report-Referral',
                    component: () => import('@/views/marketing/reportReferral.vue'),
                    meta: { permission: 'Referral', access: 'view' }
                },

                // ===============================
                // TECHNICAL
                // ===============================
                // Dashboard
                {
                    path: 'technical/dashboardTechnical',
                    name: 'Dashboard-Technical',
                    component: () => import('@/views/technical/dashboardTechnical.vue'),
                    meta: { permission: 'Technical Dashboard', access: 'view' }
                },
                {
                    path: 'technical/listAppoitment',
                    name: 'List-Appointment',
                    component: () => import('@/views/technical/listAppoitment.vue'),
                    meta: { permission: 'Appointment', access: 'view' }
                },
                {
                    path: 'technical/detailAppointment/:id',
                    name: 'Detail-Appointment',
                    component: () => import('@/views/technical/detailAppointment.vue'),
                    meta: { permission: 'Appointment', access: 'view' }
                },

                // Warranty Claims
                {
                    path: 'technical/listClaim',
                    name: 'List-Claim',
                    component: () => import('@/views/technical/listClaim.vue'),
                    meta: { permission: 'Warranty Claim', access: 'view' }
                },
                {
                    path: 'technical/detailWarantyClaim/:id',
                    name: 'Detail-Waranty-Claim',
                    component: () => import('@/views/technical/detailWarantyClaim.vue'),
                    meta: { permission: 'Warranty Claim', access: 'view' },
                    props: true
                },

                // Products
                {
                    path: 'technical/listProduct',
                    name: 'List-Product',
                    component: () => import('@/views/technical/listProduct.vue'),
                    meta: { permission: 'Product List', access: 'view' }
                },
                {
                    path: 'om/listProduct',
                    name: 'List-Product OM',
                    component: () => import('@/views/technical/listProduct.vue'),
                    meta: { permission: 'Product List', access: 'view' }
                },
                {
                    path: 'technical/listOETire',
                    name: 'List-OE-Tire',
                    component: () => import('@/views/technical/listOETire.vue'),
                    meta: { permission: 'OE Tire LIst', access: 'view' }
                },
                {
                    path: 'technical/listPattern',
                    name: 'List-Pattern',
                    component: () => import('@/views/technical/listPattern.vue'),
                    meta: { permission: 'Pattern List', access: 'view' }
                },
                {
                    path: 'technical/detailPattern/:id',
                    name: 'Detail-Pattern',
                    component: () => import('@/views/technical/detailPattern.vue'),
                    meta: { permission: 'Pattern List', access: 'view' },
                    props: true
                },
                {
                    path: 'technical/createPattern',
                    name: 'Create-Pattern',
                    component: () => import('@/views/technical/createPattern.vue'),
                    meta: { permission: 'Pattern List', access: 'create' }
                },
                                {
                    path: 'technical/listVehicleModel',
                    name: 'List-Vehicle-Model',
                    component: () => import('@/views/technical/listVehicleModel.vue'),
                },
                                {
                    path: 'technical/listTreadDepth',
                    name: 'List-Tread-Depth',
                    component: () => import('@/views/technical/listTreadDepth.vue'),
                },
                                {
                    path: 'technical/listSizeCode',
                    name: 'List-Size-Code',
                    component: () => import('@/views/technical/listSizeCode.vue'),
                },
                    //                 {
                    //     label: 'Vechicle Model List',
                    //     icon: 'pi pi-fw pi-slack',
                    //     to: '/technical/listVechicleModel'
                    // },
                    // {
                    //     label: 'Tread Depth List',
                    //     icon: 'pi pi-fw pi-slack',
                    //     to: '/technical/listTreadDepth'
                    // },
                    // {
                    //     label: 'Size Code List',
                    //     icon: 'pi pi-fw pi-slack',
                    //     to: '/technical/listSizeCode'
                    // }
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
                    path: 'it/editUserAccount/:id',
                    name: 'Edit-User-Account',
                    component: () => import('@/views/it/editUserAccount.vue'),
                    props: true
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
                // SALES
                // ===============================
                // Customer List
                {
                    path: 'sales/customerList',
                    name: 'Customer-List',
                    component: () => import('@/views/sales/customerList.vue')
                },
                {
                    path: 'sales/detailCustomer/:custAccNo',
                    name: 'detail-Customer',
                    component: () => import('@/views/sales/detailCustomer.vue')
                },
                {
                    path: 'sales/detailCustomerUser/:id',
                    name: 'detail-customer-user',
                    component: () => import('@/views/sales/detailCustomerUser.vue')
                },

                // Customer Appointment
                {
                    path: 'sales/customerAppointment/',
                    name: 'Appointment-List',
                    component: () => import('@/views/sales/customerAppointment.vue')
                },
                {
                    path: 'sales/detailCustomerAppointment/:id',
                    name: 'detail-Appointment',
                    component: () => import('@/views/sales/detailCustomerAppointment.vue')
                },

                // Customer Warranty Claim
                {
                    path: 'sales/customerWarrantyClaim',
                    name: 'Customer-Warranty-Claim',
                    component: () => import('@/views/sales/customerWarrantyClaim.vue')
                },
                {
                    path: 'sales/detailCustomerWarrantyClaim/:id',
                    name: 'Detail-Customer-Warranty-Claim',
                    component: () => import('@/views/sales/detailCustomerWarrantyClaim.vue')
                },

                // Customer Order
                {
                    path: 'sales/detailCustomerOrder/:orderNo',
                    name: 'Customer-Order',
                    component: () => import('@/views/sales/detailCustomerOrder.vue')
                },
                {
                    path: 'sales/customerOrder',
                    name: 'Detail-Customer-Order',
                    component: () => import('@/views/sales/customerOrder.vue')
                },

                // Customer Return Order
                {
                    path: 'sales/customerReturnOrder',
                    name: 'Customer-Return-Order',
                    component: () => import('@/views/sales/customerReturnOrder.vue')
                },
                {
                    path: 'sales/detailCustomerReturnOrder/:retOrdNo',
                    name: 'Detail-Customer-Return-Order',
                    component: () => import('@/views/sales/detailCustomerReturnOrder.vue')
                },

                // Customer Back Order
                {
                    path: 'sales/customerBackOrder',
                    name: 'Customer-Back-Order',
                    component: () => import('@/views/sales/customerBackOrder.vue')
                },
                {
                    path: 'sales/detailCustomerBackOrder/:boNo',
                    name: 'Detail-Customer-Back-Order',
                    component: () => import('@/views/sales/detailCustomerBackOrder.vue')
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
                {
                    path: 'billing/listAccountDetailPersonal/:custAccNo',
                    name: 'Billing-Account-Personal',
                    component: () => import('@/views/billing/listAccountDetailPersonal.vue'),
                    props: true
                },

                // Billing History
                {
                    path: 'billing/listBilling',
                    name: 'Billing',
                    component: () => import('@/views/billing/listBilling.vue')
                },
                {
                    path: 'billing/listBillingPersonal/:custAccNo',
                    name: 'Billing-Personal',
                    component: () => import('@/views/billing/listBillingPersonal.vue'),
                    props: true
                },
                {
                    path: 'billing/listEbilling',
                    name: 'E-Billing',
                    component: () => import('@/views/billing/listEbilling.vue')
                },
                {
                    path: 'billing/listEbillingPersonal/:custAccNo',
                    name: 'E-Billing-Personal',
                    component: () => import('@/views/billing/listEbillingPersonal.vue'),
                    props: true
                },
                {
                    path: 'billing/listOther',
                    name: 'List-Other',
                    component: () => import('@/views/billing/listOther.vue')
                },
                {
                    path: 'billing/listOtherPersonal/:custAccNo',
                    name: 'List-Other-Personal',
                    component: () => import('@/views/billing/listOtherPersonal.vue'),
                    props: true
                },
                {
                    path: 'billing/listStatement',
                    name: 'List-Statement',
                    component: () => import('@/views/billing/listStatement.vue')
                },
                {
                    path: 'billing/listStatementPersonal/:custAccNo',
                    name: 'List-Statement-Personal',
                    component: () => import('@/views/billing/listStatementPersonal.vue')
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
                {
                    path: 'billing/BCP',
                    name: 'Create-Messaging',
                    component: () => import('@/views/billing/BCP.vue')
                },

                // ===============================
                // SCM (Supply Chain Management)
                // ===============================
                // Warranty CTC
                {
                    path: 'scm/listCollection',
                    name: 'Collection-List',
                    component: () => import('@/views/scm/listCollection.vue'),
                    meta: { permission: 'CTC Collection', access: 'view' }
                },
                {
                    path: 'scm/detailCollection/:id',
                    name: 'Collection-Detail',
                    component: () => import('@/views/scm/detailCollection.vue'),
                    meta: { permission: 'CTC Collection', access: 'view' },
                    props: true
                },
                {
                    path: 'scm/returnCollection',
                    name: 'Return-Collection',
                    component: () => import('@/views/scm/returnCollection.vue'),
                    meta: { permission: 'CTC Return', access: 'view' }
                },
                {
                    path: 'scm/detailReturnList/:id',
                    name: 'Return-List',
                    component: () => import('@/views/scm/detailReturnList.vue'),
                    meta: { permission: 'CTC Return', access: 'view' },
                    props: true
                },

                // Order
                {
                    path: 'scm/listOrderDelivery',
                    name: 'List-Order-Delivery',
                    component: () => import('@/views/scm/listOrderDelivery.vue'),
                    meta: { permission: 'Order Delivery', access: 'view' }
                },
                {
                    path: 'scm/detailOrderDelivery/:id',
                    name: 'Detail-Order-Delivery',
                    component: () => import('@/views/scm/detailOrderDelivery.vue'),
                    meta: { permission: 'Order Delivery', access: 'view' },
                    props: true
                },
                {
                    path: 'scm/listOrderPickup',
                    name: 'List-Order-Pickup',
                    component: () => import('@/views/scm/listOrderPickup.vue'),
                    meta: { permission: 'Order Pickup', access: 'view' }
                },
                {
                    path: 'scm/detailOrderPickup/:id',
                    name: 'Detail-Order-Pickup',
                    component: () => import('@/views/scm/detailOrderPickup.vue'),
                    meta: { permission: 'Order Pickup', access: 'view' },
                    props: true
                },

                // Return
                {
                    path: 'scm/listReturnOrder',
                    name: 'List-Return-Order-SCM',
                    component: () => import('@/views/scm/listReturnOrder.vue'),
                    meta: { permission: 'Return Order Collection', access: 'view' }
                },
                {
                    path: 'scm/detailReturnOrder/:id',
                    name: 'Detail-Return-Order-SCM',
                    component: () => import('@/views/scm/detailReturnOrder.vue'),
                    meta: { permission: 'Return Order Collection', access: 'view' },
                    props: true
                },

                // Area ETA
                {
                    path: 'scm/listAreaETA',
                    name: 'List-Area-ETA',
                    component: () => import('@/views/scm/listAreaETA.vue'),
                    meta: { permission: 'Area ETA', access: 'view' }
                },

                // Logistic Account
                {
                    path: 'scm/listLogistic',
                    name: 'List-Logistic',
                    component: () => import('@/views/scm/listLogistic.vue'),
                    meta: { permission: '3PL Account', access: 'view' }
                },
                {
                    path: 'scm/detailLogistic/:id',
                    name: 'Detail-Logistic',
                    component: () => import('@/views/scm/detailLogistic.vue'),
                    meta: { permission: '3PL Account', access: 'view' },
                    props: true
                },
                {
                    path: 'scm/createlogistic',
                    name: 'Create-Logistic',
                    component: () => import('@/views/scm/createlogistic.vue'),
                    meta: { permission: '3PL Account', access: 'create' }
                },
                {
                    path: 'scm/editLogistic/:id',
                    name: 'Edit-Logistic',
                    component: () => import('@/views/scm/editLogistic.vue'),
                    meta: { permission: '3PL Account', access: 'create' },
                    props: true
                },

                // // Back Order
                // {
                //     path: 'scm/listSCMBackOrder',
                //     name: 'List-SCM-BackOrder',
                //     component: () => import('@/views/scm/listSCMBackOrder.vue'),
                //     meta: { permission: 'Back Order', access: 'view' },
                // },
                // {
                //     path: 'scm/detailSCMBackOrder/:boNo',
                //     name: 'Detail-SCM-BackOrder',
                //     component: () => import('@/views/scm/detailSCMBackOrder.vue'),
                //     meta: { permission: 'Back Order', access: 'view' },
                //     props: true
                // },

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
router.beforeEach(async (to, from, next) => {
    const publicPages = ['/auth/login', '/auth/forgot-password', '/auth/access', '/auth/error', '/landing', '/pages/notfound'];

    const relativePath = to.path.replace(BASE_PATH, '/');
    const authRequired = !publicPages.includes(relativePath);
    const loggedIn = tokenService.getToken() && !tokenService.isTokenExpired();

    // Redirect if not logged in
    if (authRequired && !loggedIn) return next('/auth/login');
    // Redirect logged-in user away from login page
    if (relativePath === '/auth/login' && loggedIn) return next('/welcome');

    // Load menu & permissions if logged in
    if (loggedIn) {
        const menuStore = useMenuStore();

        if (!menuStore.permissions.length) {
            try {
                await menuStore.loadMenuAndPermissions();
            } catch (err) {
                console.error('Failed to load menu:', err);
                tokenService.clearToken();
                return next('/auth/login');
            }
        }

        // Check route permissions
        const { permission, access, role } = to.meta;
        if (permission) {
            if (!menuStore.canView(permission)) return next('/unauthorized_test');
            if (access === 'write' && !menuStore.canWrite(permission)) return next('/unauthorized_test');
        }
        // Redirect if login based on role
        if (relativePath === '/auth/login' || to.path === '/') {
            // const userRole = menuStore.role;
            // if (userRole === 'TECHNICAL') {
            //     return next(`/technical/dashboardTechnical`);
            // }
            // if (userRole === 'MARKETING') {
            //     return next(`/marketing/memberDashboard`);
            // }
            // if (userRole === 'OM') {
            //     return next(`/om/omDashboard`);
            // }
            // if (userRole === 'Superadmin') {
            //     return next(`/welcome`);
            // }
            return next('/welcome');
        }
    }

    next();
});

export default router;
