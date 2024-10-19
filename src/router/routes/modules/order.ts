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
    order: 6,
  },
  children: [
    {
      path: 'active',
      name: 'orderActive',
      component: () => import('@/views/order/active.vue'),
      meta: {
        locale: '活动订单',
        requiresAuth: true,
        roles: ['*']
      },
    },
    {
      path: 'meal',
      name: 'orderMeal',
      component: () => import('@/views/order/meal.vue'),
      meta: {
        locale: 'order.meal',
        requiresAuth: true,
        roles: ['*']
      },
    },
  ],
};

export default DASHBOARD;
