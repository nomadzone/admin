<template>
  <a-modal v-model:visible="visible" @cancel="handleCancel" :footer="false">
    <a-form ref="formRef" :rules="rules" :model="form" >
      <a-form-item field="name" label="Username" validate-trigger="blur">
        <a-input v-model="form.name" placeholder="请输入" />
      </a-form-item>
      <a-form-item field="password" label="密码" validate-trigger="blur">
        <a-input-password v-model="form.password" placeholder="please enter your password..." />
      </a-form-item>
      <a-form-item field="password2" label="确认密码" validate-trigger="blur">
        <a-input-password v-model="form.password2" placeholder="please confirm your password..." />
      </a-form-item>
      <a-form-item field="email" label="email">
        <a-input v-model="form.email" placeholder="please enter your email..." />
      </a-form-item>
      <a-form-item field="ip" label="IP">
        <a-input v-model="form.ip" placeholder="please enter your ip..." />
      </a-form-item>
      <a-form-item field="url" label="URL">
        <a-input v-model="form.url" placeholder="please enter your url..." />
      </a-form-item>
      <a-form-item field="match" label="match">
        <a-input v-model="form.match" placeholder="please enter your match..." />
      </a-form-item>
    </a-form>
    <div slot="footer">
      <div class="footer_content">
        <a-button style="margin-right: 20px" @click="handleCancel">取消</a-button>
        <a-button type="primary" @click="handleBeforeOk" :loading="loading">确定</a-button>
      </div>
    </div>
  </a-modal>
</template>
<script setup lang="ts">
import { ref } from 'vue';
const visible = ref(false)
const formRef = ref()
const loading = ref(false)
const form = ref({
  name: '',
  password: '',
  password2: '',
  email: '',
  ip: '192.168.2.1',
  url: '',
  match: ''
});

const rules = {
  name: [
    {
      required: true,
      message:'name is required',
    },
  ],
  password: [
    {
      required: true,
      message:'password is required',
    },
  ],
  password2: [
    {
      required: true,
      message:'password is required',
    },
    {
      validator: (value, cb) => {
        if (value !== form.value.password) {
          cb('two passwords do not match')
        } else {
          cb()
        }
      }
    }
  ],
  email: [
    {
      type: 'email',
      required: true,
    }
  ],
  ip: [
    {
      type: 'ip',
      required: true,
    }
  ],
  url: [
    {
      type: 'url',
      required: true,
    }
  ],
  match: [
    {
      required: true,
      validator: (value, cb) => {
        return new Promise((resolve) => {
          if (!value) {
            cb('Please enter match')
          }
          if (value !== 'match') {
            cb('match must be match!')
          }
          resolve()
        })
      }
    }
  ],
}
const openDialog = (row) => {
  visible.value = true;
}
function handleBeforeOk() {
  formRef.value.validate().then(res => {
    if (!res) {
      return false
    } else {
      loading.value = false
    }
  })
}
function handleCancel() {
  formRef.value.resetFields()
}
defineExpose({
  openDialog,
});
</script>
<style lang="less" scoped>
.footer_content{
  box-sizing: border-box;
  width: 100%;
  padding: 16px 20px 0;
  text-align: right;
  border-top: 1px solid var(--color-neutral-3);
}
</style>
