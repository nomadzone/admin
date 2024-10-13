import { createPinia } from 'pinia';
import useAppStore from './modules/app';
import useUserStore from './modules/user';
import useTabBarStore from './modules/tab-bar';
import useModalStore from './modules/modal';
import useMeal from './modules/meal'

const pinia = createPinia();

export { useAppStore, useUserStore, useTabBarStore, useModalStore, useMeal };
export default pinia;
