import { createPinia } from 'pinia';
import useAppStore from './modules/app';
import useUserStore from './modules/user';
import useTabBarStore from './modules/tab-bar';
import useModalStore from './modules/modal';

const pinia = createPinia();

export { useAppStore, useUserStore, useTabBarStore, useModalStore };
export default pinia;
