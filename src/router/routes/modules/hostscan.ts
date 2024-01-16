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
    keepAlive:true,
  },
  children: [
    // -------------------------------------系统扫描配置------------------------------------
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
     // 查看漏洞详情
     {
      path: 'leakDetail',
      name: 'leakDetail',
      component: () =>
      import('@/views/hostscan/scan-config/system-scan/leak-detail.vue'),
      meta: {
        requiresAuth: true,
        roles: ['*'],
        hideInMenu: true,
      },
    },
    {
      path: 'addHostScanConfig',
      name: 'addHostScanConfig',
      component: () => import('@/views/hostscan/scan-config/system-scan/add-config.vue'),
      meta: {
        locale: 'menu.list.scan.config.add',
        requiresAuth: true,
        roles: ['*'],
        hideInMenu: true,
      },
    },
    // 扫描详情
    {
      path: 'hostScanConfigDetail',
      name: 'hostScanConfigDetail',
      component: () => import('@/views/hostscan/scan-config/system-scan/config-detail.vue'),
      meta: {
        locale: 'menu.hostscan.config.detail',
        requiresAuth: true,
        roles: ['*'],
        hideInMenu: true,
      },
    },
    {
      path: 'hostScanRecordDetail',
      name: 'hostScanRecordDetail',
      component: () =>
      import('@/views/hostscan/scan-config/system-scan/host-record-detail.vue'),
      meta: {
        locale: 'menu.hostscan.config.record.host.detail',
        requiresAuth: true,
        roles: ['*'],
        hideInMenu: true,
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
        keepAlive: true,
        // 标识是否是从详情页进入
        isBack:false,
        roles: ['*'],
      },
    },
    // 新增系统模板
    {
      path: 'addTemplate',
      name: 'addTemplate',
      component: () =>
        import('@/views/hostscan/scan-template/components/add-template.vue'),
      meta: {
        locale: 'menu.list.addtemplate',
        requiresAuth: true,
        roles: ['*'],
        hideInMenu: true,
      },
    },
    // 编辑系统模板
    {
      path: 'editTemplate',
      name: 'editTemplate',
      component: () =>
        import('@/views/hostscan/scan-template/components/edit-template.vue'),
      meta: {
        locale: 'menu.list.addtemplate',
        requiresAuth: true,
        roles: ['*'],
        hideInMenu: true,
      },
    },
    // 查看系统模板
    {
      path: 'showTemplate',
      name: 'showTemplate',
      component: () =>
        import('@/views/hostscan/scan-template/components/show-template.vue'),
      meta: {
        locale: 'menu.list.addtemplate',
        requiresAuth: true,
        roles: ['*'],
        hideInMenu: true,
      },
    },
 // -------------------------------------弱口令扫描配置------------------------------------
  //  创建扫描配置
      {
        path: 'addWeakHostScanConfig',
        name: 'addWeakHostScanConfig',
        component: () => import('@/views/hostscan/scan-config/weak-scan/add-weak-config.vue'),
        meta: {
            locale: 'menu.list.scan.config.add',
            requiresAuth: true,
            roles: ['*'],
            hideInMenu: true,
          },
        },
    // 扫描详情
    {
      path: 'hostWeakScanConfigDetail',
      name: 'hostWeakScanConfigDetail',
      component: () => import('@/views/hostscan/scan-config/weak-scan/weak-config-detail.vue'),
      meta: {
          locale: 'menu.hostscan.config.detail',
          requiresAuth: true,
          roles: ['*'],
          hideInMenu: true,
        },
      },
      {
        path: 'hostWeakScanRecordDetail',
        name: 'hostWeakScanRecordDetail',
        component: () =>
        import('@/views/hostscan/scan-config/weak-scan/host-weak-record-detail.vue'),
        meta: {
          locale: 'menu.hostscan.config.record.host.detail',
          requiresAuth: true,
          roles: ['*'],
          hideInMenu: true,
        },
      },
  ],
};

export default HOSTSCAN;
