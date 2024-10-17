import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const DASHBOARD: AppRouteRecordRaw = {
  path: '/findPartner',
  name: 'findPartner',
  component: DEFAULT_LAYOUT,
 redirect: '/findPartner/index',
  meta: {
    locale: '找搭子',
    requiresAuth: true,
    icon: 'icon-message',
    order: 5,
    hideChildrenInMenu: true,
  },
  children: [
    {
      path: 'index',
      name: 'findPartnerIndex',
      component: () => import('@/views/findPartner/index.vue'),
      meta: {
        locale: '找搭子',
        requiresAuth: true,
        roles: ['*'],
      },
    },
  ],
};

export default DASHBOARD;
