
// 系统设置router
import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';


const STORE: AppRouteRecordRaw = {
    path: '/store',
    name: 'store',
    component: DEFAULT_LAYOUT,
    meta: {
        locale: 'menu.store',
        requiresAuth: true,
        icon: 'icon-exclamation-circle',
        order: 9,
    },
    children: [
        {
            path: 'setting',
            name: 'setting',
            component: () => import('@/views/store/setting/index.vue'),
            meta: {
                locale: 'menu.store.setting',
                requiresAuth: true,
                roles: ['*'],
            },
        },
        {
            path: 'verifie',
            name: 'verifie',
            component: () => import('@/views/store/verifie/index.vue'),
            meta: {
                locale: 'menu.store.verifie',
                requiresAuth: true,
                roles: ['*'],
            },
        },
        {
            path: 'settlement',
            name: 'settlement',
            component: () => import('@/views/store/settlement/index.vue'),
            meta: {
                locale: 'menu.store.settlement',
                requiresAuth: true,
                roles: ['*'],
            },
        }
       
       
    ]
    
}

export default STORE;