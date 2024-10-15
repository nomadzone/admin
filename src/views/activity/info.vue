<template>
    <a-modal v-model:visible="visible" title="活动详情" @cancel="handleCancel" :footer="false">
      <a-form ref="formRef" :rules="rules" :model="form" >
        <a-form-item label="活动名称:">
            {{ detail?.title }}
        </a-form-item>
        <a-form-item label="活动时间:">
            {{ detail?.startdate }} - {{ detail?.enddate }}
        </a-form-item>
        <a-form-item label="活动地点:">
            {{ detail?.address }}
        </a-form-item>
        <a-form-item  label="所在城市:">
            {{ detail?.city }}
        </a-form-item>
        <a-form-item  label="图片:">
            <a-image
                v-for="(item, index) in iamges"
                :key="index"
                width="100"
                :src="item"
            />
        </a-form-item>
        <a-form-item label="详情:">
            {{ detail?.describe }}
        </a-form-item>
        <a-form-item field="remark" label="理由:">
          {{detail?.remark}}
        </a-form-item>
      </a-form>
      <div slot="footer">
        <div class="footer_content">
          <a-button style="margin-right: 20px" @click="handleCancel">关闭</a-button>
        </div>
      </div>
    </a-modal>
  </template>
  <script setup lang="ts">
  import { ref } from 'vue';
  import { audit } from '@/api/activity';

  const emit = defineEmits(['revesh'])
  const visible = ref(false)
  const formRef = ref()
  const loading = ref(false)
  const iamges = ref([])
  const form = ref({
    name: '',
    password: '',
    password2: '',
    email: '',
    ip: '192.168.2.1',
    url: '',
    match: ''
  });
  const detail = ref({})
  const rules = {}
  
  const openDialog = (row) => {
    visible.value = true;
    detail.value = row;
    iamges.value = row.images.split(',')
  }
  const handleCancel = () => {
    visible.value = false;
  }
  const handleBeforeOk = () => {
    let data = {
        id: detail.value.id,
        status: 1,
        remark: form.value.remark
    }
    audit(data).then(() => {
        loading.value = false;
        visible.value = false;
        emit('revesh')
    }).catch(() => {
        loading.value = false;
    })
    loading.value = true;
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
  