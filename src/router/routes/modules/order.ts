import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const DASHBOARD: AppRouteRecordRaw = {
  path: '/order',
  name: 'order',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'order.manage',
    requiresAuth: true,
    icon: 'icon-bookmark',
    order: 1,
  },
  children: [
    {
      path: 'meal',
      name: 'orderIndex',
      component: () => import('@/views/order/index.vue'),
      meta: {
        locale: 'order.meal',
        requiresAuth: true,
        roles: ['*']
      },
    },
  ],
};

export default DASHBOARD;
