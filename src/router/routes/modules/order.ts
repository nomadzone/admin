import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const DASHBOARD: AppRouteRecordRaw = {
  path: '/order',
  name: 'order',
  component: DEFAULT_LAYOUT,
  redirect: '/order/active',
  meta: {
    locale: '票夹管理',
    requiresAuth: true,
    icon: 'icon-bookmark',
    hideChildrenInMenu: true,
    order: 6,
  },
  children: [
    {
      path: 'active',
      name: 'orderActive',
      component: () => import('@/views/order/active.vue'),
      meta: {
        locale: '票夹管理',
        requiresAuth: true,
        roles: ['*']
      },
    },
  ],
};

export default DASHBOARD;
