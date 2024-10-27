<template>
    <a-modal v-model:visible="visible" title="审核"  :footer="false">
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
      </a-form>
      <div slot="footer">
        <div class="footer_content">
          <a-button style="margin-right: 20px" type="dashed" @click="handleCancel">未通过</a-button>
          <a-button type="primary" @click="handleBeforeOk" :loading="loading">通过</a-button>
        </div>
      </div>
    <a-modal v-model:visible="visibleCancel" title="未通过理由"  :footer="false">
      <a-form ref="formRefTwo" :model="form" >
        <a-form-item field="remark" label="理由:">
          <a-input v-model="form.remark" placeholder="请输入理由" />
        </a-form-item>
        </a-form>
        <div slot="footer">
        <div class="footer_content">
          <a-button style="margin-right: 20px" type="dashed" @click="handleCancelTwo">取消</a-button>
          <a-button type="primary" @click="handleCancelT" :loading="loading">确定</a-button>
        </div>
      </div>
    </a-modal>

    </a-modal>
  </template>
  <script setup lang="ts">
  import { ref } from 'vue';
  import { audit } from '@/api/activity';
  import { Message } from '@arco-design/web-vue';
  const emit = defineEmits(['revesh'])
  const visible = ref(false)
  const formRef = ref()
  const loading = ref(false)
  const iamges = ref([])
  const visibleCancel = ref(false)
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
  function handleCancelTwo() {
    visibleCancel.value = false;
  }
  function handleCancelT() {
    if (form.value.remark === '') {
        formRef.value.validateField('remark')
        return
    }
    let data = {
        ids: [detail.value.id],
        status: 2,
        remark: form.value.remark
    }
    audit(data).then(() => {
        loading.value = false;
        visible.value = false;
        visibleCancel.value = false;
        Message.success('拒绝成功')
        emit('revesh')
    }).catch(() => {
        loading.value = false;
    })
    loading.value = true;
  }
  const handleCancel = () => {
    form.value.remark = ''
    visibleCancel.value = true;
  }
  const handleBeforeOk = () => {
    let data = {
        ids: [detail.value.id],
        status: 1,
        remark: form.value.remark
    }
    audit(data).then(() => {
        loading.value = false;
        visible.value = false;
        Message.success('通过成功')
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
  