
// 系统设置router
import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';


const SYSTEMSETTING: AppRouteRecordRaw = {
    path: '/systemSetting',
    name: 'systemSetting',
    component: DEFAULT_LAYOUT,
    meta: {
        locale: 'menu.systemSetting',
        requiresAuth: true,
        icon: 'icon-settings',
        order: 9,
    },
    children: [
        {
            path: 'account',
            name: 'account',
            component: () => import('@/views/systemSetting/account/index.vue'),
            meta: {
                locale: 'menu.systemSetting.account',
                requiresAuth: true,
                roles: ['*'],
            },
        },
        // 账号详情
        {
            path: 'accountDetail',
            name: 'accountDetail',
            component: () => import('@/views/systemSetting/account/detail.vue'),
            meta: {
                locale: 'menu.systemSetting.accountDetail',
                requiresAuth: true,
                roles: ['*'],
            hideInMenu: true,

            },
        },
        //账号新建
        {
            path: 'accountCreate',
            name: 'accountCreate',
            component: () => import('@/views/systemSetting/account/add.vue'),
            meta: {
                locale: 'menu.systemSetting.accountCreate',
                requiresAuth: true,
                roles: ['*'],
            hideInMenu: true,

            },
        },
        {
            path: 'roles',
            name: 'roles',
            component: () => import('@/views/systemSetting/roles/index.vue'),
            meta: {
                locale: 'menu.systemSetting.roles',
                requiresAuth: true,
                roles: ['*'],
            },
            
        },
        {
            path: 'rolesSave',
            name: 'rolesSave',
            component: () => import('@/views/systemSetting/roles/save.vue'),
            meta: {
                locale: 'menu.systemSetting.roles',
                requiresAuth: true,
                roles: ['*'],
                hideInMenu: true,
                
                },

        }
    ]
    
}

export default [];