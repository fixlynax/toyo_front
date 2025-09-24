import AppLayout from '@/layout/AppLayout.vue';
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: AppLayout,
            children: [
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
                // Reward Catalogue 
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
                // Game Management
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
                // Eten Management
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
                // News Managemnt
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
                //Event Management
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
                // Campaign Management
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

                // Member List
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

                // Redemption Management
                {
                    path: '/marketing/listRedemption',
                    name: 'List-Redemption',
                    component: () => import('@/views/marketing/listRedemption.vue')
                },
                // {
                //     path: '/marketing/detailRedemption',
                //     name: 'Detail-Redemption',
                //     component: () => import('@/views/marketing/detailRedemption.vue')
                // },
            ]
        },
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
