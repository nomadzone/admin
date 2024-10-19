import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const DASHBOARD: AppRouteRecordRaw = {
  path: '/userList',
  name: 'userList',
  component: DEFAULT_LAYOUT,
 redirect: '/userList/manage',
  meta: {
    locale: '用户中心',
    requiresAuth: true,
    icon: 'icon-menu',
    order: 0,
    hideChildrenInMenu: true,
  },
  children: [
    {
      path: 'index',
      name: 'userList',
      component: () => import('@/views/userList/manage.vue'),
      meta: {
        locale: '用户中心',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'info',
      name: 'userInfo',
      component: () => import('@/views/userList/info.vue'),
      meta: {
        locale: '用户详情',
        requiresAuth: true,
        roles: ['*'],
      },
    },
  ],
};

export default DASHBOARD;
