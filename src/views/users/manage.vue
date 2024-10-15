<template>
    <div class="common-page-container">
      <div class="common-panel">
        <div class="common-query-form-container" style="flex-direction: column;">
          <PageTitle></PageTitle>
          <a-card class="general-card width-full" style="padding-bottom: 0;">
            <a-row>
              <a-col :flex="1">
                <a-form :model="formModel"  :label-col-props="{ span: 6 }" :wrapper-col-props="{ span: 18 }" label-align="center">
                  <a-row :gutter="16">
                    <a-col :span="12">
                      <a-form-item field="number" label="手机号码">
                        <a-input v-model="formModel.phone" placeholder="请输手机号码" />
                      </a-form-item>
                    </a-col>
                    <a-col :span="12">
                      <a-form-item field="name" label="最近消费时间">
                        <a-range-picker
                            style="width: 360px; margin: 0 24px 24px 0;"
                            show-time
                            :time-picker-props="{ defaultValue: ['00:00:00', '09:09:06'] }"
                            format="YYYY-MM-DD HH:mm"
                            @clear="onClear"
                            @ok="onOkTime"
                        />
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
          <a-table :columns="columns" :data="formModel.list" style="width: 100%" :loading="loading" :pagination='pagination'/>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import PageTitle from '@/components/page-title/index.vue';
  import { ref, onMounted, reactive } from 'vue';
import { orderUsedList } from '@/api/user'
import { Message } from '@arco-design/web-vue'
  
  const columns = [
    { title: '用户ID', dataIndex: 'appUserId' },
    { title: '用户昵称', dataIndex: 'appNikeName' },
    { title: '手机号码', dataIndex: 'phone' },
    { title: '消费次数', dataIndex: 'number'},
    { title: '消费金额', dataIndex: 'orderAmount' },
    { title: '最近消费时间', width: 170, dataIndex: 'payDate' },
  ];
  
  const formModel = reactive({
    phone: '',
    payDate: '',
    pageNum: 1,
    pageSize: 10,
    list: []
  });
  const pagination = ref({
      total: 0, // 数据总条数
      current: 1, // 当前页
      pageSize: 10, // 每页显示的条数
      showTotal: true, // 是否显示总条数
      onChange: (page)=> {
        pagination.value.current = page; // 更新当前页
        formModel.pageNum = page; // 更新当前页
        search()
      }, // 页码改变时的回调函数
})
const loading = ref(false)
onMounted(()=> { search() })
const onOkTime = (value) => { formModel.payDate = value }
const onClear = ()=> { formModel.payDate = []; search() }
const search = async() => {
  loading.value = true
  const params = {
    pageNum: formModel.pageNum,
    pageSize: formModel.pageSize,
    shopId: localStorage.getItem('shopId') || '',
    isUsed: '0'
  }
  if (formModel.phone){
    params.phone = formModel.phone
  }
  if (formModel.payDate?.length === 2 && formModel.payDate[0] && formModel.payDate[1]) {
    params.beginPayDate = formModel.payDate[0]
    params.endPayDate = formModel.payDate[1]
  }
  try {
    let res = await orderUsedList(params)
    loading.value = false
    if (res?.code == 200) {
      pagination.value.total = res.total;
      formModel.list = res.rows
    } else {
      Message.error(res?.msg || res?.code?.toString() || '接口异常')
    }
  } catch(error) {
    Message.error( '接口异常')
  }
}
  
  </script>
  
  <style scoped>
  .width-full {
    width: 100%;
  }
  
  .xxl-btn {
    ::v-deep button {
      height: 60px !important;
      line-height: 60px !important;
      padding-left: 50px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding-right: 50px;
      font-size: 18px;
    }
  
    ::v-deep .arco-input-wrapper {
      padding-left: 20px;
  
      input {
        font-size: 18px;
      }
    }
  }
  .general-card {
    ::v-deep .arco-card-body {
      padding-bottom: 0;
    }
  }
  </style>
  