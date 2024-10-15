<template>
    <a-modal :visible="visible" title="券码信息" @update:visible="updateVisible" 
        @ok="handleConfirm" @cancel="handleCancel"
    >
        <a-row :gutter="16">
          <a-col :span="6" style="width: 120px;">
            <img v-if='detail.image' :src="detail.image" alt="商品图片" style="width: 100px; height: 100px;border-radius: 8px;" />
            <svg v-else t="1728049355643" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4408" width="100" height="100"><path d="M0 0v1024h1024V0z m305.664 202.752a94.72 94.72 0 1 1-93.525333 94.549333 94.037333 94.037333 0 0 1 93.525333-94.549333zM140.8 837.802667s25.088-230.4 153.6-229.205334a170.666667 170.666667 0 0 1 161.792 116.053334s60.416-349.525333 221.866667-349.525334 228.693333 462.677333 228.693333 462.677334z" fill="#D9D9D9" p-id="4409"></path></svg>
          </a-col>
          <a-col :span="16">
            <h3>{{ detail.title }}</h3>
            <p style="font-size: 18px; color: red;margin-top: 0;">¥{{ detail.price }}</p>
          </a-col>
        </a-row>
        <a-divider />
        <a-row :gutter="16">
          <a-col :span="24">
            <p style="margin-top: 0;">订单号: {{ detail.orderNumber }}</p>
          </a-col>
          <a-col :span="24">
            <p style="margin-top: 0;">下单手机号: {{ detail.phoneNumber }}</p>
          </a-col>
        </a-row>
    </a-modal>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  
  interface Detail {
    image: string;
    title: string;
    price: number;
    orderNumber: string;
    phoneNumber: string;
  }
  
  const props = defineProps<{
    visible: boolean;
    detail: Detail;
  }>();
  
  const emit = defineEmits(['update:visible', 'confirm']);
  
  const updateVisible = (value: boolean) => {
    emit('update:visible', value);
  };
  
  const handleCancel = () => {
    emit('update:visible', false);
  };
  
  const handleConfirm = () => {
    emit('confirm');
    emit('update:visible', false);
  };
  </script>
  