<template>
    <div class="login-form-wrapper">
      <div class="login-form-title">注册账号</div>
      <div class="login-form-sub-title">请输入您的账号和密码</div>
      <div class="login-form-error-msg">{{ errorMessage }}</div>
      <a-form ref="loginForm" :model="userInfo" class="login-form" layout="vertical" @submit="handleSubmit">
        <a-form-item field="username" :label="t('login.form.account.mobile')"
          :rules="[{ required: true, message: $t('login.form.mobile.errMsg') }]" :validate-trigger="['change', 'blur']"
          hide-asterisk>
          <a-input v-model="userInfo.username" :placeholder="$t('login.form.mobile.placeholder')" size="large">
          </a-input>
        </a-form-item>
        <a-form-item field="password" :label="t('login.form.password')"
          :rules="[{ required: true, message: $t('login.form.password.errMsg') }]" :validate-trigger="['change', 'blur']"
          hide-asterisk>
          <a-input-password v-model="userInfo.password" :placeholder="$t('login.form.password.placeholder')" allow-clear
            size="large">
  
          </a-input-password>
        </a-form-item>
        <a-form-item class="form-item" field="username" :label="t('login.form.invitecode')"
          :rules="[{ required: true, message: $t('login.form.code.errMsg') }]" :validate-trigger="['change', 'blur']"
          hide-asterisk>
          <a-input v-model="userInfo.smsCode" :placeholder="$t('login.form.code.placeholder')" size="large">
          </a-input>
          <div @click="doCode" class="code">{{ !hasCode ? '获取验证码' : `${timer}(s)` }} </div>
        </a-form-item>
        <div style="height: 20px"></div>
        <a-space :size="16" direction="vertical">
  
          <a-button class="login-btn" type="primary" html-type="submit" long :loading="loading" size="large">
            {{ $t('login.form.login') }}
          </a-button>
        </a-space>
      </a-form>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { ref, reactive, defineEmits } from 'vue';
  import { Message } from '@arco-design/web-vue';
  import { ValidatedError } from '@arco-design/web-vue/es/form/interface';
  import { useI18n } from 'vue-i18n';
  import { useUserStore } from '@/store';
  import useLoading from '@/hooks/loading';
  const { t } = useI18n();
  const errorMessage = ref('');
  const { loading, setLoading } = useLoading();
  const userStore = useUserStore();

  const userInfo = reactive({
    username: '',
    password: '',
    smsCode: '',
  });

  const timer = ref(60)
  let  timerRef = ref<null | NodeJS.Timeout>(null)
  const hasCode = ref(false)
  const doCode = async()=> {
    if (hasCode.value) {
      return;
    }
    const phoneReg = /^[1][3,4,5,7,8][0-9]{9}$/;
    if (!phoneReg.test(userInfo.username)) {
      Message.error('请填写有效手机号码');
      return;
    }
    await userStore.getSmsCode({
      username: userInfo.username,
      password: userInfo.password
    });
    Message.success('验证码已发送');
    hasCode.value = true;
    timerRef.value = setInterval(() => {
      timer.value -= 1;
      if (timer.value === 0) {
        if (timerRef.value) clearInterval(timerRef.value);
        timer.value = 60;
        hasCode.value = false;
      }
    }, 1000);
  }

  const emit = defineEmits(['success'])
  
  const handleSubmit = async ({
    errors,
    values,
  }: {
    errors: Record<string, ValidatedError> | undefined;
    values: Record<string, any>;
  }) => {
    if (loading.value) return;
    if (!errors) {
      setLoading(true);
      try {
        let tip = ''
        if (!hasCode.value){
          tip = '请点击验证码'
        }
        if (tip) {
          Message.error(tip);
          return;
        }
        await userStore.register({
          username: userInfo.username,
          password: userInfo.password,
          smsCode: userInfo.smsCode
        });
        const message = Message.success('注册成功');
        setTimeout(()=> { message.close() }, 1500)
        emit('success')
      } catch (err) {
        errorMessage.value = (err as Error).message;
      } finally {
        setLoading(false);
      }
    }
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
  .form-item {
    position: relative;
  }
  .code {
    position: absolute;
    top: 40px;
    right: 10px;
    color: rgb(var(--primary-5));
    z-index: 999;
    cursor: pointer;
    &:hover {
      opacity: 0.8;
    }
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
  