<template>
  <div class="container">
    <a-row class="login-row">
      <a-col :span="12" class="banner-col">
         <loginBk></loginBk>
        <!-- <LoginBanner /> -->
      </a-col>
      <a-col :span="12" class="content-col">
        <div class="content">
          <div class="content-inner">
            <LoginForm v-if="type === 'login'"/>
            <RegisterForm @success="doRegister" v-if="type === 'register'"></RegisterForm>
            <div @click="doType" class="tip">{{ type === 'login' ? '注册账号' : '登录账号' }}</div>
          </div>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts" setup>
import { Message } from '@arco-design/web-vue';
import LoginForm from './components/login-form.vue';
import RegisterForm from './components/register-form.vue';
import { ref } from 'vue';
import loginBk from '../../assets/images/login-bk.svg';

const type = ref('login')

const doType = ()=> {
  type.value = type.value === 'login' ? 'register' : 'login'
}

const doRegister = ()=> {
  setTimeout(()=> {
    type.value = 'login'
    Message.success('请登录');
  }, 1500)
}
</script>

<style lang="less" scoped>
.container {
  height: 100vh;
  background-color: #F2FFF7;
  .tip {
    text-align: center;
    color: rgb(var(--primary-5));
    padding-top: 20px;
    cursor: pointer;
    &:hover {
      opacity: 0.8;
    }
  }
  .login-row {
    height: 100%;

    .banner-col {
      height: 100%;
      background-color: #202126;
      display: flex;
      justify-content: center;
      align-items: center;

      .login-bk {
        width: 100%;
        display: block;
      }
    }

    .content-col {
      height: 100%;
      display: flex;

      .content {
        position: relative;
        display: flex;
        flex: 1;
        align-items: center;
        justify-content: center;
        padding-bottom: 40px;
      }
    }
  }

  .banner {
    width: 550px;
    background: linear-gradient(163.85deg, #1d2129 0%, #00308f 100%);
  }
}
</style>

<style lang="less" scoped>
// responsive
@media (max-width: @screen-lg) {
  .container {
    .banner {
      width: 25%;
    }
  }
}
</style>

<style  lang="scss" scoped>
.content-inner {
  padding: 58px 0px 136px;
  border-radius: 8px;
  border: 1px solid #DFE0EB;
  background-color: #fff;
  min-width: 460px;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}
</style>
