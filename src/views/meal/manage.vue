<template>
  <PageCard>
    <a-card class="general-card width-full" style="padding-bottom: 0;">
      <a-row>
        <a-col :flex="1">
          <a-form :model="formModel" :label-col-props="{ span: 6 }" :wrapper-col-props="{ span: 18 }"
            label-align="center">
            <a-row :gutter="16">
              <a-col :span="12">
                <a-form-item field="number" label="商家名称">
                  <a-input v-model="formModel.storeName" placeholder="请输商家名称" />
                </a-form-item>
                <a-form-item field="number" label="套餐名称">
                  <a-input v-model="formModel.mealName" placeholder="请输套餐名称" />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item field="name" label="最近消费时间">
                  <a-select :style="{width:'340px'}" v-model="formModel.status" placeholder="全部">
                    <a-option value="">全部</a-option>
                    <a-option value="0">已上线</a-option>
                    <a-option value="1">已下线</a-option>
                    <a-option value="2">待审批</a-option>
                    <a-option value="3">不通过</a-option>
                  </a-select>
                </a-form-item>
                <a-form-item field="name" label="最近消费时间">
                  <a-range-picker style="width: 360px; margin: 0 24px 0 0;" show-time
                    :time-picker-props="{ defaultValue: ['00:00:00', '09:09:06'] }" format="YYYY-MM-DD HH:mm"
                    @clear="onClear" @ok="onOkTime" />
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </a-col>
        <a-divider style="height: 32px" direction="vertical" />
        <a-col :flex="'86px'" style="text-align: right">
          <a-space direction="vertical" :size="18">
            <a-button type="primary" @click="search">
              <template #icon>
                <icon-search />
              </template>
              查询
            </a-button>
          </a-space>
        </a-col>
      </a-row>
    </a-card>
    <a-radio-group type="button" v-model="buttonType" style="margin: 16px 0 16px 0;">
      <a-radio value="0">审批通过</a-radio>
      <a-radio value="1">审批不通过</a-radio>
    </a-radio-group>
    <a-table :columns="columns" :data="data.list" style="width: 100%" :loading="loading" :pagination='pagination'>
      <template #optional="{ record, rowIndex }">
        <a-space>
          <a-link type="primary" @click="doLook(record, rowIndex)" size="mini">查看</a-link>
          <a-link status="danger" size="mini">不通过</a-link>
          <a-link status="success" size="mini">通过</a-link>
          <a-link type="primary" @click="doUp(record, rowIndex)" size="mini">上线</a-link>
          <a-link type="primary" @click="doDown(record, rowIndex)" size="mini">下线</a-link>
        </a-space>
      </template>
      <template #comboStatus="{ record }">
        <a-tag v-if="record.comboStatus == '0'" color="orange">已上线</a-tag>
        <a-tag v-if="record.comboStatus == '1'" color="blue">已下线</a-tag>
        <a-tag v-if="record.comboStatus == '2'" color="green">待审批</a-tag>
        <a-tag v-if="record.comboStatus == '3'" color="red">不通过</a-tag>
      </template>
    </a-table>
  </PageCard>
</template>

<script setup>
import PageCard from '@/components/page-card/index.vue';
import { ref, reactive, watch, onMounted } from 'vue';
import { Message, Modal } from '@arco-design/web-vue';
import { useRouter } from 'vue-router';
import { comboList, comboChangeStatus, comboDelete } from '@/api/combo';
import { useMeal } from '@/store';

const router = useRouter()
const buttonType = ref('0')

onMounted(() => {
  search()
})
const formModel = reactive({
  pageNum: 1,
  pageSize: 10,
  storeName: '',
  mealName: '',
  status: '',
  payDate: '',
});
const loading = ref(false)
const pagination = ref({
  total: 0, // 数据总条数
  current: 1, // 当前页
  pageSize: 10, // 每页显示的条数
  showTotal: true, // 是否显示总条数
  onChange: (page) => {
    pagination.value.current = page; // 更新当前页
    formModel.pageNum = page; // 更新当前页
    search()
  }, // 页码改变时的回调函数
})
const columns = [
  { title: '套餐ID', dataIndex: 'id' },
  { title: '套餐名称', dataIndex: 'comboName', width: 240, ellipsis: true },
  { title: '销量', dataIndex: 'number' },
  { title: '套餐价', dataIndex: 'shopPrice' },
  {
    title: '状态',
    dataIndex: 'comboStatus',
    slotName: 'comboStatus' // 使用 slot 来渲染状态列
  },
  { title: '结束时间', dataIndex: 'validTimeEnd' },
  { title: '最近变更时间', dataIndex: 'updateTime' },
  { title: '操作', slotName: 'optional', width: 260 },
];
const data = reactive({
  list: [1]
});

const search = async () => {
  loading.value = true
  try {
    let res = await comboList({
      pageNum: formModel.pageNum,
      pageSize: formModel.pageSize,
      storeName: formModel.storeName,
      mealName: formModel.mealName,
      status: formModel.status
    })
    loading.value = false
    if (res?.code !== 200) {
      Message.error(res?.msg)
    } else {
      pagination.value.total = res.total;
      data.list = res.rows;
    }
  } catch (error) {
    loading.value = false
    Message.error(JSON.stringify(error) || '接口异常')
  }
}

const doLook = (item) => {
  router.push('/meal/create?id=' + item.id)
}
const doDown = async (item, index) => {
  loading.value = true
  const res = await comboChangeStatus({
    id: item.id,
    comboStatus: '1'
  })
  loading.value = false
  if (res?.code != 200) {
    Message.error(res?.msg);
    return;
  }
  data.list[index].comboStatus = '1'
  Message.success('下架成功');
}

const doUp = async (item, index) => {
  loading.value = true
  const res = await comboChangeStatus({
    id: item.id,
    comboStatus: '0'
  })
  loading.value = false
  if (res?.code != 200) {
    Message.error(res?.msg);
    return;
  }
  data.list[index].comboStatus = '0'
  Message.success('上架成功');
}

const doDelete = async (item, index) => {
  loading.value = true
  const res = await comboDelete(item.id)
  if (res?.code != 200) {
    Message.error(res?.msg);
    return;
  }
  loading.value = false
  search()
  Message.success('删除成功');
}

</script>

<style scoped lang="scss">
.arco-radio-button.arco-radio-checked {
  color: #fff;
  background-color: rgb(var(--primary-6));
}

.width-full {
  width: 100%;
}


.general-card {
  ::v-deep .arco-card-body {
    padding-bottom: 0;
  }
}
</style>