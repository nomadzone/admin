import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const DASHBOARD: AppRouteRecordRaw = {
  path: '/consumption',
  name: 'consumption',
  component: DEFAULT_LAYOUT,
 redirect: '/consumption/verify',
  meta: {
    locale: 'menu.consumption',
    requiresAuth: true,
    icon: 'icon-apps',
    order: 1,
    hideChildrenInMenu: true,
  },
  children: [
    {
      path: 'verify',
      name: 'verify',
      component: () => import('@/views/consumption/verify.vue'),
      meta: {
        locale: 'menu.consumption',
        requiresAuth: true,
        roles: ['*'],
      },
    },
  ],
};

export default DASHBOARD;
