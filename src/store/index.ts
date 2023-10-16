import { createPinia } from 'pinia';
import useAppStore from './modules/app';
import useUserStore from './modules/user';
import useTabBarStore from './modules/tab-bar';
import useScanIdStore from './modules/scan-record'


const pinia = createPinia();

export {
  useAppStore,
  useUserStore,
  useTabBarStore,
  useScanIdStore,
};
export default pinia;
