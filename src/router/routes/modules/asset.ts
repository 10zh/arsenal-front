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
      component: () => import('@/views/asset/searchList.vue'),
      meta: {
        locale: 'menu.asset.search',
        requiresAuth: true,
        roles: ['*'],
        hideInMenu:true,
      },
    }]
}
export default ASSET;