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
    // {
    //   path: 'refund',
    //   name: 'orderRefund',
    //   component: () => import('@/views/order/refund.vue'),
    //   meta: {
    //     locale: 'order.refund',
    //     requiresAuth: true,
    //     roles: ['*'],
    //   },
    // },
    {
      path: 'refundDetails',
      name: 'orderRefundDetails',
      component: () => import('@/views/order/refund-details.vue'),
      meta: {
        locale: 'order.refund.details',
        requiresAuth: true,
        hideInMenu: true,
        roles: ['*'],
      },
    },
  ],
};

export default DASHBOARD;
