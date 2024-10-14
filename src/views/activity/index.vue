<template>
  <PageCard>
    <div class="layout-padding-auto">
      <div class="search-from">
        <a-form class="search-from-left" ref="queryRef" :model="form"  auto-label-width>
          <a-row :gutter="20">
            <a-col :xl="6" :lg="8" :md="12" :xs="24">
              <a-form-item label="活动时间:" prop="componyId">
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
        <div class="search-from-right">
          <a-button icon="search" type="primary" @click="getDataList"> 搜索 </a-button>
          <a-button icon="Refresh" @click="resetQuery">重置</a-button>
        </div>
      </div>
    </div>
  </PageCard>
</template>

<script lang="ts" setup>
import PageCard from '@/components/page-card/index.vue';
import { ref } from 'vue';

const form = ref()
const queryRef = ref()

function getDataList() {

}
function resetQuery() {
  queryRef.value.resetFields()
}
</script>

<style lang="less" scoped>
</style>
