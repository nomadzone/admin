import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const DASHBOARD: AppRouteRecordRaw = {
    path: '/activity',
    name: 'activity',
    component: DEFAULT_LAYOUT,
    meta: {
        locale: 'activity.manage',
        requiresAuth: true,
        icon: 'icon-bookmark',
        order: 3,
    },
    children: [
        {
            path: 'wildTogether',
            name: 'activityIndex',
            component: () => import('@/views/activity/index.vue'),
            meta: {
                locale: 'activity.meal',
                requiresAuth: true,
                roles: ['*']
            },
        },
    ],
};

export default DASHBOARD;
