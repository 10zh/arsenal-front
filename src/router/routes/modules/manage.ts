import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const MANAGE: AppRouteRecordRaw = {
  path: '/manage',
  name: '/manage',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.manage',
    requiresAuth: true,
    icon: 'icon-find-replace',
    order: 2,
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
    // {
    //   path: 'permissionsManage', // The midline path complies with SEO specifications
    //   name: 'permissionsManage',
    //   component: () => import('@/views/manage/userList/index.vue'),
    //   meta: {
    //     locale: 'menu.manage.permissionsManage',
    //     requiresAuth: true,
    //     roles: ['*'],
    //   },
    // },
    // {
    //   path: 'roleManage', // The midline path complies with SEO specifications
    //   name: 'roleManage',
    //   component: () => import('@/views/manage/userList/index.vue'),
    //   meta: {
    //     locale: 'menu.manage.roleManage',
    //     requiresAuth: true,
    //     roles: ['*'],
    //   },
    // },
  
  ]
}
export default MANAGE;