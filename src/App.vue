<template>
  <a-config-provider :locale="locale">
    <router-view />
    <global-setting />
  </a-config-provider>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
import enUS from '@arco-design/web-vue/es/locale/lang/en-us';
import zhCN from '@arco-design/web-vue/es/locale/lang/zh-cn';
import GlobalSetting from '@/components/global-setting/index.vue';
import useLocale from '@/hooks/locale';
import './global.scss';

const { currentLocale } = useLocale();


const locale = computed(() => {
  switch (currentLocale.value) {
    case 'zh-CN':
      return zhCN;
    case 'en-US':
      return enUS;
    default:
      return enUS;
  }
});


const confirmModal = ref();


</script>
<style lang="less">
.layout-padding-auto {
  position: relative;
  padding-bottom: 80px;
  width: 100%;
}
.search-from{
  display: flex;
  flex-wrap: wrap;
  .search-from-left{
    flex: 1;
    min-width: 300px;
    .el-input{
      width: 100%;
    }
    .el-form-item:last-of-type {
      margin-bottom: 20px !important;
    }
    .el-col{
    }
  }
  .search-from-right{
    margin: 0 0 20px 20px;
  }
}
</style>
