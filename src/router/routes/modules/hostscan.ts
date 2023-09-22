import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const HOSTSCAN: AppRouteRecordRaw = {
  path: '/hostscan',
  name: '/hostscan',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.hostscan',
    requiresAuth: true,
    icon: 'icon-find-replace',
    order: 2,
  },
  children: [
    {
      path: 'scanConfig', // The midline path complies with SEO specifications
      name: 'scanConfig',
      component: () => import('@/views/hostscan/scan-config/index.vue'),
      meta: {
        locale: 'menu.list.scan.config',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'scanEngine', // The midline path complies with SEO specifications
      name: 'scanEngine',
      component: () => import('@/views/hostscan/scan-engine/index.vue'),
      meta: {
        locale: 'menu.list.scan.engine',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'scanTemplate',
      name: 'scanTemplate',
      component: () => import('@/views/hostscan/scan-template/index.vue'),
      meta: {
        locale: 'menu.list.scan.template',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'addTemplate',
      name: 'addTemplate',
      component: () =>
        import('@/views/hostscan/scan-template/add-template.vue'),
      meta: {
        locale: 'menu.list.addtemplate',
        requiresAuth: true,
        roles: ['*'],
        hideInMenu: true,
      },
    },
    {
      path: 'scanConfigDetail',
      name: 'scanConfigDetail',
      component: () =>
        import('@/views/hostscan/scan-config/scanConfigDetail.vue'),
      meta: {
        locale: 'menu.list.configDetail',
        requiresAuth: true,
        roles: ['*'],
        hideInMenu: true,
      },
    },
  ],
};

export default HOSTSCAN;
