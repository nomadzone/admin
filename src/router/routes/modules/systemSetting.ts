
// 系统设置router
import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';


const SYSTEMSETTING: AppRouteRecordRaw = {
    path: '/systemSetting',
    name: 'systemSetting',
    component: DEFAULT_LAYOUT,
    redirect: '/systemSetting/dictInfo',
    meta: {
        locale: 'menu.systemSetting',
        requiresAuth: true,
        icon: 'icon-settings',
        order: 9,
    },
    children: [
        // {
        //     path: 'account',
        //     name: 'account',
        //     component: () => import('@/views/systemSetting/account/index.vue'),
        //     meta: {
        //         locale: 'menu.systemSetting.account',
        //         requiresAuth: true,
        //         roles: ['*'],
        //     },
        // },
        // // 账号详情
        // {
        //     path: 'accountDetail',
        //     name: 'accountDetail',
        //     component: () => import('@/views/systemSetting/account/detail.vue'),
        //     meta: {
        //         locale: 'menu.systemSetting.accountDetail',
        //         requiresAuth: true,
        //         roles: ['*'],
        //     hideInMenu: true,

        //     },
        // },
        // //账号新建
        // {
        //     path: 'accountCreate',
        //     name: 'accountCreate',
        //     component: () => import('@/views/systemSetting/account/add.vue'),
        //     meta: {
        //         locale: 'menu.systemSetting.accountCreate',
        //         requiresAuth: true,
        //         roles: ['*'],
        //     hideInMenu: true,

        //     },
        // },
        // {
        //     path: 'roles',
        //     name: 'roles',
        //     component: () => import('@/views/systemSetting/roles/index.vue'),
        //     meta: {
        //         locale: 'menu.systemSetting.roles',
        //         requiresAuth: true,
        //         roles: ['*'],
        //     },
            
        // },
        // {
        //     path: 'rolesSave',
        //     name: 'rolesSave',
        //     component: () => import('@/views/systemSetting/roles/save.vue'),
        //     meta: {
        //         locale: 'menu.systemSetting.roles',
        //         requiresAuth: true,
        //         roles: ['*'],
        //         hideInMenu: true,
                
        //         },

        // },
        {
            path: 'dictInfo',
            name: 'dictInfo',
            component: () => import('@/views/systemSetting/dictInfo/index.vue'),
            meta: {
                locale: 'menu.systemSetting.dictInfo',
                requiresAuth: true,
                roles: ['*'],
                
                },
        },
        {
            path: 'dictItemList',
            name: 'dictItemList',
            component: () => import('@/views/systemSetting/dictInfo/itemList.vue'),
            meta: {
                locale: 'menu.systemSetting.dictInfo',
                requiresAuth: true,
                roles: ['*'],
                hideInMenu: true,
                
                },
        },
        {
            path: 'systemCode',
            name: 'systemCode',
            component: () => import('@/views/systemSetting/systemCode/index.vue'),
            meta: {
                locale: 'menu.systemSetting.systemCode',
                requiresAuth: true,
                roles: ['*'],
                
                },
        },
        {
          path: 'basic',
          name: 'basic',
          component: () => import('@/views/systemSetting/basic/index.vue'),
          meta: {
            locale: '基础设置',
            requiresAuth: true,
            roles: ['*']
          },
        },
        {
          path: 'adv',
          name: 'adv',
          component: () => import('@/views/systemSetting/adv/index.vue'),
          meta: {
            locale: '广告管理',
            requiresAuth: true,
            roles: ['*']
          },
        },
        {
          path: 'advCreate',
          name: 'advCreate',
          component: () => import('@/views/systemSetting/adv/create.vue'),
          meta: {
            locale: '新建广告',
            requiresAuth: true,
            hideInMenu: true,
            roles: ['*'],
          },
        },
    ]
    
}

export default SYSTEMSETTING;