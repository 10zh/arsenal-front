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
      path: 'userList', // The midline path complies with SEO specifications
      name: 'userList',
      component: () => import('@/views/manage/userList/index.vue'),
      meta: {
        locale: 'menu.manage.userList',
        requiresAuth: true,
        roles: ['*'],
      },
    },]
}
export default MANAGE;