import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const SOURCEDATA: AppRouteRecordRaw = {
  path: '/sourceData',
  name: '/sourceData',
  redirect:'/sourceData/list',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.sourceData',
    requiresAuth: true,
    icon: 'icon-storage',
    order: 5,
  },
  children: [
    // 漏洞库
    {
      path: 'vulnsLibrary', // The midline path complies with SEO specifications
      name: 'vulnsLibrary',
      component: () => import('@/views/sourcedata/vulns-library/index.vue'),
      meta: {
        requiresAuth: true,
        roles: ['*'],
        locale: 'menu.list.sourceData.vulnerabilityLibrary',
      },
    },
    // 弱口令
    {
      path: 'weakPassword', // The midline path complies with SEO specifications
      name: 'weakPassword',
      component: () => import('@/views/sourcedata/weak-password/index.vue'),
      meta: {
        requiresAuth: true,
        roles: ['*'],
        locale: 'menu.list.sourceData.weakPasswords',
      },
    },
    ]
  }
  export default SOURCEDATA;