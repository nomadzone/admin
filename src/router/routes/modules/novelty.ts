import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const DASHBOARD: AppRouteRecordRaw = {
  path: '/novelty',
  name: 'novelty',
  component: DEFAULT_LAYOUT,
 redirect: '/novelty/index',
  meta: {
    locale: '新鲜事管理',
    requiresAuth: true,
    icon: 'icon-subscribed',
    order: 6,
    hideChildrenInMenu: true,
  },
  children: [
    {
      path: 'index',
      name: 'noveltyIndex',
      component: () => import('@/views/novelty/index.vue'),
      meta: {
        locale: '新鲜事管理',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'info',
      name: 'noveltyInfo',
      component: () => import('@/views/novelty/info.vue'),
      meta: {
        locale: '新鲜事详情',
        requiresAuth: true,
        roles: ['*'],
      },
    },
  ],
};

export default DASHBOARD;
