<template>
    <a-modal v-model:visible="visible" title="活动详情" @cancel="handleCancel" width="900px" :footer="false">
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
        <a-form-item field="remark" label="理由:" v-if="detail?.remark">
          {{detail?.remark}}
        </a-form-item>
      </a-form>
      <a-table :columns="columns" :loading="loading" :data="tableData" :pagination="false">
        <template #status="{record}">
          {{ statusList.find(item => item.value == record.status)?.label }}
        </template>
      </a-table>
      <div class="pagination_end">
        <a-pagination :total="total" show-page-size @change="changePage" :page-size="formPage.pageSize" :current-page="formPage.pageNum" @page-size-change="changePageSize" />
      </div>

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
  import {userActivityList} from '@/api/activity'

  const emit = defineEmits(['revesh'])
  const visible = ref(false)
  const formRef = ref()
  const loading = ref(false)
  const iamges = ref([])
  const total = ref(0)
  const tableData = ref([])
  const activityId = ref('')
  const formPage = ref({
  pageNum: 1,
  pageSize: 10
})
// / 1 报名成功  2 取消报名 3-正在报名
const statusList = [{
    label: '报名成功',
    value: 1
  },
  {
    label: '取消报名',
    value: 2
  },
  {
    label: '正在报名',
    value: 3
  }
]
const columns = ref([
  {
    title: '用户id',
    dataIndex: 'id',
    width: 100
  },
  {
    title: '用户昵称',
    dataIndex: 'nickname',
    width: 100
  },
  {
    title: '手机号',
    dataIndex: 'phone',
    width: 100
  },
  {
    title: '报名状态',
    dataIndex: 'status',
    slotName:'status',
    width: 100
  },
  {
    title: '消费金额',
    dataIndex: 'price',
    width: 100
  },
  {
    title: '服务费',
    dataIndex: '',
    width: 100
  },
  {
    title: '报名时间',
    dataIndex: 'createTime',
    width: 100
  }
])
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
    activityId.value = row.id
    formPage.value.pageNum = 1
    togetList()
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
  // 获取列表数据
function togetList() {
  loading.value = true
  userActivityList({
    ...formPage.value,
     activityId: activityId.value
  }).then(res => {
    tableData.value = res.rows
    total.value = res.total
  })
  .finally(() => {
    loading.value = false
  })
}
  function changePage(page) {
    formPage.value.pageNum = page
  togetList()
}
function changePageSize(size) {
  formPage.value.pageSize = size
  togetList()
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
  .pagination_end{
      width: 100%;
      display: flex;
      justify-content: flex-end;
      margin-top: 20px;
    }
  </style>