import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const ASSET: AppRouteRecordRaw = {
  path: '/asset',
  name: '/asset',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.asset',
    requiresAuth: true,
    icon: 'icon-find-replace',
    order: 2,
  },
  children: [
    {
      path: 'assetSearch', // The midline path complies with SEO specifications
      name: 'assetSearch',
      component: () => import('@/views/asset/index.vue'),
      meta: {
        locale: 'menu.asset.search',
        requiresAuth: true,
        roles: ['*'],
      },
    },{
      path: 'searchList', // The midline path complies with SEO specifications
      name: 'searchList',
      component: () => import('@/views/asset/search-list.vue'),
      meta: {
        locale: 'menu.asset.search',
        requiresAuth: true,
        roles: ['*'],
        hideInMenu:true,
      },
    },{
    path: 'clusterAnalysisChart', // The midline path complies with SEO specifications
    name: 'clusterAnalysisChart',
    component: () => import('@/views/asset/cluster-analysis-chart.vue'),
    meta: {
      locale: 'menu.asset.clusterAnalysis',
      requiresAuth: true,
      roles: ['*'],
      hideInMenu:true,
    },
  },{
    path: 'assetDetail', // The midline path complies with SEO specifications
    name: 'assetDetail',
    component: () => import('@/views/asset/search-list-detail.vue'),
    meta: {
      locale: 'menu.asset.detail',
      requiresAuth: true,
      roles: ['*'],
      hideInMenu:true,
    },
  },{
    path: 'leakDetail', // The midline path complies with SEO specifications
    name: 'leakDetail',
    component: () => import('@/views/asset/list-leak-detail.vue'),
    meta: {
      locale: 'menu.asset.leak.detail',
      requiresAuth: true,
      roles: ['*'],
      hideInMenu:true,
    },
  }]
}
export default ASSET;