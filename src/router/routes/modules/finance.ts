// 财务管理router
import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const FINANCE: AppRouteRecordRaw = {
    path: '/finance',
    name: 'finance',
    component: DEFAULT_LAYOUT,
    meta: {
        locale: 'menu.finance',
        requiresAuth: true,
        icon: 'icon-check-circle',
        order: 9,
    },
    children: [
        {
            path: 'revenueExpenditure',
            name: 'revenueExpenditure',
            component: () => import('@/views/finance/revenueExpenditure/index.vue'),
            meta: {
                locale: 'menu.finance.revenueExpenditure',
                requiresAuth: true,
                roles: ['*'],
            },
        },
        {
            path: 'withdrawalApply',
            name: 'withdrawalApply',
            component: () => import('@/views/finance/revenueExpenditure/withdrawalApply.vue'),
            meta: {
                locale: 'menu.finance.withdrawalApply',
                requiresAuth: true,
                roles: ['*'],
                hideInMenu: true,
            },
        },

        {
            path: 'settlementMange',
            name: 'settlementMange',
            component: () => import('@/views/finance/settlement/index.vue'),
            meta: {
                locale: 'menu.finance.settlement',
                requiresAuth: true,
                roles: ['*'],
            },
        },
        {
            path: 'withdrawal',
            name: 'withdrawal',
            component: () => import('@/views/finance/withdrawal/index.vue'),
            meta: {
                locale: 'menu.finance.withdrawal',
                requiresAuth: true,
                roles: ['*'],
            },
        },
        
       
       
    ]
    
}

export default FINANCE;