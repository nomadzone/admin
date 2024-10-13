import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const DASHBOARD: AppRouteRecordRaw = {
  path: '/users',
  name: 'users',
  component: DEFAULT_LAYOUT,
 redirect: '/users/manage',
  meta: {
    locale: 'menu.users',
    requiresAuth: true,
    icon: 'icon-user-group',
    order: 2,
    hideChildrenInMenu: true,
  },
  children: [
    {
      path: 'manage',
      name: 'usersManage',
      component: () => import('@/views/users/manage.vue'),
      meta: {
        locale: 'menu.users',
        requiresAuth: true,
        roles: ['*'],
      },
    },
  ],
};

export default DASHBOARD;
