<template>
  <div class="login-form-wrapper">
    <div class="login-form-title">账号登录</div>
    <div class="login-form-sub-title">请输入您的账号和密码</div>
    <div class="login-form-error-msg">{{ errorMessage }}</div>
    <a-form ref="loginForm" :model="userInfo" class="login-form" layout="vertical" @submit="handleSubmit">
      <a-form-item field="loginName" :label="t('login.form.account')"
        :rules="[{ required: true, message: $t('login.form.userName.errMsg') }]" :validate-trigger="['change', 'blur']"
        hide-asterisk>
        <a-input v-model="userInfo.loginName" :placeholder="$t('login.form.userName.placeholder')" size="large">

        </a-input>
      </a-form-item>
      <a-form-item field="password" :label="t('login.form.password')"
        :rules="[{ required: true, message: $t('login.form.password.errMsg') }]" :validate-trigger="['change', 'blur']"
        hide-asterisk>
        <a-input-password v-model="userInfo.password" :placeholder="$t('login.form.password.placeholder')" allow-clear
          size="large">

        </a-input-password>
      </a-form-item>
      <a-space :size="16" direction="vertical">

        <a-button class="login-btn" type="primary" html-type="submit" long :loading="loading" size="large">
          {{ $t('login.form.login') }}
        </a-button>
        <!-- <a-button type="text" long class="login-form-register-btn">
          {{ $t('login.form.register') }}
        </a-button> -->
      </a-space>
    </a-form>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { Message } from '@arco-design/web-vue';
import { ValidatedError } from '@arco-design/web-vue/es/form/interface';
import { useI18n } from 'vue-i18n';
import { useStorage } from '@vueuse/core';
import { useUserStore } from '@/store';
import useLoading from '@/hooks/loading';
import type { LoginData } from '@/api/user';

import { appRoutes } from '@/router/routes/index';

const router = useRouter();
const { t } = useI18n();
const errorMessage = ref('');
const { loading, setLoading } = useLoading();
const userStore = useUserStore();

const loginConfig = useStorage('login-config', {
  rememberPassword: false,
  loginName: process.env.NODE_ENV === 'production' ? '' : 'admin', // 根据环境判断默认值
  password: process.env.NODE_ENV === 'production' ? '' : 'admin123', // demo default value
  captchaId: '1',
  verifyCode: '1',
});
const userInfo = reactive({
  loginName: loginConfig.value.loginName,
  password: loginConfig.value.password,
});

const handleSubmit = async ({
  errors,
  values,
}: {
  errors: Record<string, ValidatedError> | undefined;
  values: Record<string, any>;
}) => {

  console.log('appRoutes', appRoutes);

  let defaultRouteName = appRoutes[0].name;

  console.log('defaultRouteName', defaultRouteName);

  if (loading.value) return;
  if (!errors) {
    setLoading(true);
    try {
      await userStore.login(values as LoginData);
      setLoading(false);
      const { redirect, ...othersQuery } = router.currentRoute.value.query;
      let token = localStorage.getItem('token')
      console.log('token', token)
      if (token) {

        router.push({
          name: (redirect as string) || defaultRouteName,
          query: {
            ...othersQuery,
          },
        });

      }
      Message.success(t('login.form.login.success'));
      const { rememberPassword } = loginConfig.value;
      const { loginName, password } = values;
      // 实际生产环境需要进行加密存储。
      // The actual production environment requires encrypted storage.
      loginConfig.value.loginName = rememberPassword ? loginName : '';
      loginConfig.value.password = rememberPassword ? password : '';
    } catch (error) {
      setLoading(false);
    }
  }
};
  const setRememberPassword = (value: boolean) => {
    loginConfig.value.rememberPassword = value;
  };
</script>

<style lang="less" scoped>
.login-form-title {
  text-align: center;

}

.login-form-sub-title {
  text-align: center;
  font-size: 14px !important;
}

.login-form {
  &-wrapper {
    width: 320px;
  }

  &-title {
    color: var(--color-text-1);
    font-weight: 600;
    font-size: 24px;
    line-height: 32px;
    margin-bottom: 12px;
  }

  &-sub-title {
    color: var(--color-text-3);
    font-size: 16px;
    line-height: 24px;
  }

  &-error-msg {
    height: 32px;
    color: rgb(var(--red-6));
    line-height: 32px;
  }

  &-password-actions {
    display: flex;
    justify-content: space-between;
  }

  &-register-btn {
    color: var(--color-text-3) !important;
    border-radius: 8px;
  }
}



.login-form-wrapper {
  max-width: 396px;
  display: block;

  .login-btn {
    border-radius: 8px;
  }


  .arco-input-wrapper {
    background-color: #FCFDFE;
    border: 1px solid #F0F1F7;
    border-radius: 8px;


  }
}
</style>
