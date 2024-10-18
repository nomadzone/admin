import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const MERCHANT: AppRouteRecordRaw = {
  path: '/merchant',
  name: 'merchant',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.merchant',
    requiresAuth: true,
    icon: 'icon-user',
    order: 0,
  },
  children: [
    {
      path: 'index',
      name: 'merchantList',
      component: () => import('@/views/merchant/index.vue'),
      meta: {
        locale: 'menu.merchant.list',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'catagory',
      name: 'merchantCatagory',
      component: () => import('@/views/merchant/category.vue'),
      meta: {
        locale: 'menu.merchant.category',
        requiresAuth: true,
        roles: ['*'],
      },
    },
  ],
};

export default MERCHANT;
