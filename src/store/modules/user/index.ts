import { defineStore } from 'pinia';
import {
  login as userLogin,
  logout as userLogout,
  getUserInfo,
  getRouters,
  LoginData,
  sendSms,
  register,
} from '@/api/user';
import { setToken, clearToken } from '@/utils/auth';
import { removeRouteListener } from '@/utils/route-listener';
import { UserState } from './types';
import useAppStore from '../app';
import { Message } from '@arco-design/web-vue';

const useUserStore = defineStore('user', {
  state: (): UserState => ({
    headImg: undefined,
    name: undefined,
    avatar: undefined,
    job: undefined,
    organization: undefined,
    location: undefined,
    email: undefined,
    introduction: undefined,
    personalWebsite: undefined,
    jobName: undefined,
    organizationName: undefined,
    locationName: undefined,
    phone: undefined,
    registrationDate: undefined,
    accountId: undefined,
    certification: undefined,
    role: '',
    routers: [],
    permissions: [],
    roles: [],
    user: {}
  }),

  getters: {
    userInfo(state: UserState): UserState {
      return { ...state };
    },
  },

  actions: {
    switchRoles() {
      return new Promise((resolve) => {
        this.role = this.role === 'user' ? 'admin' : 'user';
        resolve(this.role);
      });
    },
    // Set user's information
    setInfo(partial: Partial<UserState>) {
      this.$patch(partial);
    },

    // Reset user's information
    resetInfo() {
      this.$reset();
    },

    // Get user's information
    async info() {
      const res: any = await getUserInfo();
      if (res?.code === 200) {
        this.$patch({
          permissions: res.permissions,
          roles: res.roles,
          user: res.user,
        });
        localStorage.setItem('permissions', JSON.stringify(res?.permissions));
        localStorage.setItem('roles', JSON.stringify(res?.roles));
        localStorage.setItem('user', JSON.stringify(res?.user));
      } else {
        return Promise.reject()
      }
    },

    async routers() {
      const res:any = await getRouters();

      if (res?.code === 200) {
        this.$patch({
          routers: res?.data || []
        });
        localStorage.setItem('routers', JSON.stringify(res?.data));
      } else {
        return Promise.reject()
      }
    },


    async getSmsCode (data: any) {
      try {
        const res: any = await sendSms(data);
        if (res.code === 200) {
        } else {
          Message.error(res?.msg);
          throw res?.msg;
        }
      } catch(error) {
        throw error;
      }
    },

    async register (data: any) {
      try {
        const res: any = await register(data);
        if (res.code === 200) {
        } else {
          Message.error(res?.msg);
          throw res?.msg;
        }
      } catch(error) {
        throw error;
      }
    },

    // Login
    async login(loginForm: LoginData) {
      try {
        const res: any = await userLogin({...loginForm });
        if (res.code === 200 || res.code === 0) {
          setToken(res.data.token);
          // localStorage.setItem('isAuth', '0'); // 0已认证 1未认证
          localStorage.setItem('login', res?.data?.token?.toString());
          localStorage.setItem('shopId', res?.data?.shopId?.toString() || null);
          // localStorage.setItem('dimensionId', res?.dimensionId.toString() || null);
          // await this.routers();
          // await this.info();
        } else {
          throw res?.msg;
        }
      } catch (err) {
        clearToken();
        throw err;
      }
    },
    logoutCallBack() {
      const appStore = useAppStore();
      this.resetInfo();
      clearToken();
      removeRouteListener();
      appStore.clearServerMenu();
    },
    // Logout
    async logout() {
      try {
        // await userLogout();
        localStorage.removeItem('login');
        localStorage.removeItem('shopId');
        localStorage.removeItem('dimensionId');
        localStorage.removeItem('permissions');
        localStorage.removeItem('roles');
        localStorage.removeItem('user');
        localStorage.removeItem('routers');
        clearToken();
      } finally {
        this.logoutCallBack();
      }
    },
  },
});

export default useUserStore;
