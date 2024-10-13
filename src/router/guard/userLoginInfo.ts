import type { Router, LocationQueryRaw } from 'vue-router';
import NProgress from 'nprogress'; // progress bar

import { useUserStore } from '@/store';
import { isLogin } from '@/utils/auth';
import { Message, Modal } from '@arco-design/web-vue';

export default function setupUserLoginInfoGuard(router: Router) {
  router.beforeEach(async (to, from, next) => {
    NProgress.start();
    const userStore = useUserStore();
    if (isLogin()) {
      if (userStore.role) {
        next();
      } else {
        try {
          // 不需要
          // await userStore.routers()
          // await userStore.info();
          let token = localStorage.getItem('token')
          let isAuth = localStorage.getItem('isAuth')
          if (token && isAuth !== '0' && from.name && from.name !== 'login' && to.name !== 'verifie') {
            Modal.warning({
              title: '提示',
              content: '您需要完成认证才能访问该页面。',
              onOk: ()=> {
                console.log('onOk')  
                NProgress.done();
                if (from.name === 'verifie' && to.name !== 'verifie') {
                  next({
                    name: 'verifie',
                  });
                }
              }
            });
            // return
          }
          next();
        } catch (error) {
          await userStore.logout();
          next({
            name: 'login',
            query: {
              redirect: to.name,
              ...to.query,
            } as LocationQueryRaw,
          });
        }
      }
    } else {
      if (to.name === 'login') {
        next();
        return;
      }
      next({
        name: 'login',
        query: {
          redirect: to.name,
          ...to.query,
        } as LocationQueryRaw,
      });
    }
  });
}
