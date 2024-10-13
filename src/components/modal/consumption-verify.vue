<template>
    <a-modal 
      v-model:visible="modalSatte.consumpitonVerifyVisible" 
      title-align="left" 
      :title="title" 
      @cancel="handleCancel" 
      @before-ok="handleBeforeOk"
    >
      <a-form ref="formRef" :model="form"  v-if="type !== 'agree'">
        <a-form-item field="value" :label="label" validate-trigger="input" required>
          <a-input v-model="form.value" />
        </a-form-item>
      </a-form>
      <div v-if="type === 'agree'" style="padding: 10px 20px">
        是否确认同意，同意退款，金额将自动原路退还至买家账户
      </div>
    </a-modal>
  </template>
  
  <script setup lang="ts">
  import { useModalStore } from '../../store';
  import { ref, computed, watch, defineExpose } from 'vue';

  const props = defineProps({
    type: {
        type: String,
        default: 'verify'
    }
  })

  const title = computed(()=> {
    return {
        verify: '劵码',
        refund: '拒绝原因',
        agree: '同意原因'
    }[props.type]
  })

  const label = computed(()=> {
    return {
        verify: '消费验证',
        refund: '拒绝退款',
        agree: '同意退款'
    }[props.type]
  })
  
  const formRef = ref(null);
  const modalSatte = useModalStore();
  const form = modalSatte.consumpitonVerifyForm;
  
  const handleCancel = () => {
    modalSatte.consumpitonVerifyVisible = false;
  };

  watch(() => modalSatte.consumpitonVerifySubmit, (value) => {
    if (value && formRef.value) {
      formRef.value.resetFields();
    }
  });
  

  const emit = defineEmits(['submit']);
  const handleBeforeOk = async () => {
    if (props.type === 'agree') {
        modalSatte.consumpitonVerifySubmit = true
        return false
    }
    if (formRef.value) {
      try {
        let isRequiredError = await formRef.value.validate();
        if (isRequiredError) {
            return false;
        }
        modalSatte.consumpitonVerifySubmit = true
        emit('submit', form);
        // 表单验证成功后，可以继续后续操作
        return false;
      } catch (error) {
        // 表单验证失败，阻止对话框关闭
        return false;
      }
    }
  };
  </script>
  
  <style lang="scss" scoped>
  /* 添加你的样式 */
  </style>
  