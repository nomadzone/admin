import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const DASHBOARD: AppRouteRecordRaw = {
  path: '/meal',
  name: 'meal',
  component: DEFAULT_LAYOUT,
 redirect: '/meal/manage',
  meta: {
    locale: '套餐管理',
    requiresAuth: true,
    icon: 'icon-select-all', 
    order: 2,
    hideChildrenInMenu: true,
  },
  children: [
    {
      path: 'manage',
      name: 'mealManage',
      component: () => import('@/views/meal/manage.vue'),
      meta: {
        locale: '套餐管理',
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
