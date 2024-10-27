import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const DASHBOARD: AppRouteRecordRaw = {
    path: '/activity',
    name: 'activity',
    component: DEFAULT_LAYOUT,
    redirect: '/activity/wildTogether',
    meta: {
        locale: '一起野管理',
        requiresAuth: true,
        icon: 'icon-bookmark',
        order: 3,
        hideChildrenInMenu: true,
    },
    children: [
        {
            path: 'wildTogether',
            name: 'activityIndex',
            component: () => import('@/views/activity/index.vue'),
            meta: {
                locale: '一起野管理',
                requiresAuth: true,
                roles: ['*']
            },
        },
    ],
};

export default DASHBOARD;
