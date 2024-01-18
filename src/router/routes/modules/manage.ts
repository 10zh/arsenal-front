import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const MANAGE: AppRouteRecordRaw = {
  path: '/manage',
  name: '/manage',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.manage',
    requiresAuth: true,
    icon: 'icon-settings',
    order: 6,
  },
  children: [
    {
      path: 'user-list', // The midline path complies with SEO specifications
      name: 'user-list',
      component: () => import('@/views/manage/user-list/index.vue'),
      meta: {
        locale: 'menu.manage.userList',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'roleManage', // The midline path complies with SEO specifications
      name: 'roleManage',
      component: () => import('@/views/manage/role-manage/index.vue'),
      meta: {
        locale: 'menu.manage.roleManage',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'organizationChart', // The midline path complies with SEO specifications
      name: 'organizationChart',
      component: () => import('@/views/manage/organization-chart/index.vue'),
      meta: {
        locale: 'menu.manage.organization',
        requiresAuth: true,
        roles: ['*'],
      },
    },
  
  ]
}
export default MANAGE;