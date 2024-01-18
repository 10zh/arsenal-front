import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const CERTMAGE: AppRouteRecordRaw = {
  path: '/certificate',
  name: 'certificate',
  redirect:'/certificate/list',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.certManage',
    requiresAuth: true,
    icon: 'icon-idcard',
    order: 4,
    hideChildrenInMenu:true,
  },
  children: [
    {
      path: 'list', // The midline path complies with SEO specifications
      name: 'list',
      component: () => import('@/views/certmanage/index.vue'),
      meta: {
        requiresAuth: true,
        roles: ['*'],
      },
    },
    ]
  }
  export default CERTMAGE;