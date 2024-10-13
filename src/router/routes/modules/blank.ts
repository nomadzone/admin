import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const DASHBOARD: AppRouteRecordRaw = {
  path: '/blank',
  name: 'blank',
  component: DEFAULT_LAYOUT,
 redirect: '/blank/manage',
  meta: {
    locale: '空白页',
    requiresAuth: true,
    icon: 'icon-user-group',
    order: 2,
    hideChildrenInMenu: true,
  },
  children: [
    {
      path: 'manage',
      name: 'blankManage',
      component: () => import('@/views/blank/manage.vue'),
      meta: {
        locale: '空白页',
        requiresAuth: true,
        roles: ['*'],
      },
    },
  ],
};

export default DASHBOARD;
