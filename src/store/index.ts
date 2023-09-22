import { createPinia } from 'pinia';
import useAppStore from './modules/app';
import useUserStore from './modules/user';
import useTabBarStore from './modules/tab-bar';
import useTemplateStore from './modules/scan-template'
import useConfigParamsStore from './modules/scan-config'

const pinia = createPinia();

export { useAppStore, useUserStore, useTabBarStore ,useTemplateStore,useConfigParamsStore};
export default pinia;
