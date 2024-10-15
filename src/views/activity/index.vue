<template>
  <PageCard>
    <div class="layout-padding-auto">
      <div class="search-from">
        <a-form class="search-from-left" ref="queryRef" :model="form"  auto-label-width>
          <a-row :gutter="20">
            <a-col :xl="6" :lg="8" :md="12" :xs="24">
              <a-form-item label="活动时间:" field="time">
                <a-range-picker
                    v-model="form.time"
                    show-time
                    :timePickerProps="{hideDisabledOptions: true}"
                />
              </a-form-item>
            </a-col>
            <a-col :xl="6" :lg="8" :md="12" :xs="24">
              <a-form-item label="活动类型:" field="type">
                <a-select v-model="form.type" placeholder="请选择" :options="options" :field-names="fieldNames" >

                </a-select>
              </a-form-item>
            </a-col>
            <a-col :xl="6" :lg="8" :md="12" :xs="24">
              <a-form-item label="状态:" field="status">
                <a-select v-model="form.type" placeholder="请选择" :options="options" :field-names="fieldNames" >

                </a-select>
              </a-form-item>
            </a-col>
            <a-col :xl="6" :lg="8" :md="12" :xs="24">
              <a-form-item label="所在城市:" field="city">
                <a-input v-model="form.city" placeholder="请输入"></a-input>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
        <div class="search-from-right">
          <a-button icon="search" type="primary" @click="getDataList"> 搜索 </a-button>
          <a-button icon="Refresh" @click="resetQuery">重置</a-button>
        </div>
      </div>
      <a-row class="add_row">
        <a-button type="primary" @click="add">添加</a-button>
      </a-row>
      <a-table :columns="columns" :data="data" @page-change="changePage">
        <template #actions="{record, rowIndex}">
          <a-button text type="primary">修改</a-button>
        </template>
      </a-table>
    </div>
    <ActionForm ref="actionformRef"></ActionForm>
  </PageCard>
</template>

<script lang="ts" setup>
import PageCard from '@/components/page-card/index.vue';
import ActionForm from './form.vue'
import { ref } from 'vue';

const form = ref({})
const actionformRef = ref()
const queryRef = ref()
const fieldNames = {value: 'value', label: 'label'}
const options = ref([
  {
    value: 'bj',
    label: 'Beijing'
  },
  {
    value: 'sh',
    label: 'Shanghai'
  },
  {
    value: 'gz',
    label: 'Guangzhou'
  },
  {
    value: 'cd',
    label: 'Chengdu'
  },
]);
const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
  },
  {
    title: 'Salary',
    dataIndex: 'salary',
  },
  {
    title: 'Address',
    dataIndex: 'address',
  },
  {
    title: 'Email',
    dataIndex: 'email',
  },
  {
    title: '操作',
    dataIndex: 'actions',
    slotName:'actions'
  }
];
const data = [{
  name: '是的',
  salary: '222',
  address: '地址',
  email: '22'
}]
function getDataList() {

}
// 分页
function changePage() {

}

function add() {
  actionformRef.value.openDialog()
}

function resetQuery() {
  queryRef.value.resetFields()
}
</script>

<style lang="less" scoped>
</style>
