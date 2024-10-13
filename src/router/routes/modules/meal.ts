import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const DASHBOARD: AppRouteRecordRaw = {
  path: '/meal',
  name: 'meal',
  component: DEFAULT_LAYOUT,
 redirect: '/meal/manage',
  meta: {
    locale: 'menu.meal',
    requiresAuth: true,
    icon: 'icon-unordered-list',
    order: 1,
    hideChildrenInMenu: true,
  },
  children: [
    {
      path: 'manage',
      name: 'mealManage',
      component: () => import('@/views/meal/manage.vue'),
      meta: {
        locale: 'menu.meal',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'create',
      name: 'mealCreate',
      component: () => import('@/views/meal/create.vue'),
      meta: {
        locale: 'menu.create',
        requiresAuth: true,
        roles: ['*'],
      },
    },
  ],
};

export default DASHBOARD;
