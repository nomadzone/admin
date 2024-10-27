import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const DASHBOARD: AppRouteRecordRaw = {
  path: '/order',
  name: 'order',
  component: DEFAULT_LAYOUT,
  redirect: '/order/orderActive',
  meta: {
    locale: '订单管理',
    requiresAuth: true,
    icon: 'icon-bookmark',
    order: 6,
  },
  children: [
    {
      path: 'orderActive',
      name: 'orderActive',
      component: () => import('@/views/order/active.vue'),
      meta: {
        locale: '活动订单',
        requiresAuth: true,
        roles: ['*']
      },
    },
    {
      path: 'orderMeal',
      name: 'orderMeal',
      component: () => import('@/views/order/meal.vue'),
      meta: {
        locale: '套餐订单',
        requiresAuth: true,
        roles: ['*']
      },
    },
  ],
};

export default DASHBOARD;
