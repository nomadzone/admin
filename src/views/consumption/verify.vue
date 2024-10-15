<template>
  <PageCard>
    <div class="width-full xxl-btn">
      <a-input-search v-model="formModel.inputTicketCode" :loading="verifyLoading" @search="verifySearch" style="height: 60px" class="width-full" placeholder="请先验证券码，再接待" button-text="验证" search-button>
      </a-input-search>
    </div>
    <a-divider />
    <a-card class="general-card width-full">
      <a-row>
        <a-col :flex="1">
          <a-form :model="formModel" :label-col-props="{ span: 6 }" :wrapper-col-props="{ span: 18 }" label-align="center">
            <a-row :gutter="16">
              <a-col :span="12">
                <a-form-item field="number" label="劵码">
                  <a-input v-model="formModel.ticketCode" placeholder="请输入劵码" />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                  <a-form-item field="name" label="验证时间">
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
    <a-table :columns="columns" :data="formModel.list" style="width: 100%"  :loading="loading" :pagination='pagination'>
      <template #vifyType="{ record }">
        <span>商家后台</span>
      </template>
    </a-table>
    <DetailModal :visible="isModalVisible" :detail="selectedDetail" @update:visible="isModalVisible = $event" @confirm="handleConfirm" />
  </PageCard>
  
</template>

<script setup>
import PageCard from '@/components/page-card/index.vue';
import { ref, reactive, onMounted } from 'vue';
import DetailModal from './DetailModal.vue';
import { orderList, orderTicketCode, orderFindByTicketCode } from '@/api/order'
import { Message } from '@arco-design/web-vue';

const formModel = reactive({
  inputTicketCode: '',
  ticketCode: '',
  verifyTime: '',
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
const columns = [
  { title: '验证码', dataIndex: 'ticketCode' },
  { title: '验证方式', slotName: 'vifyType'},
  { title: '操作员', dataIndex: 'buyerName' },
  { title: '套装名称', dataIndex: 'shopComboName', ellipsis: true },
  { title: '下单手机号', dataIndex: 'phone', width: 140 },
  { title: '状态', width: 170, dataIndex: 'verifyStatusName', width: 100 },
  { title: '验证时间', width: 170, dataIndex: 'verifyTime', width: 180 },
  { title: '购买价', dataIndex: 'orderAmount', width: 100 },
];
const isModalVisible = ref(false);
const loading = ref(false)
onMounted(()=> { search() })
const onOkTime = (value) => { formModel.verifyTime = value }
const onClear = ()=> { formModel.verifyTime = []; search() }
const search = async() => {
  loading.value = true
  const params = {
    pageNum: formModel.pageNum,
    pageSize: formModel.pageSize,
    verifyStatus: '0'
  }
  if (formModel.ticketCode){
    params.ticketCode = formModel.ticketCode
  }
  if (formModel.verifyTime?.length === 2 && formModel.verifyTime[0] && formModel.verifyTime[1]) {
    params.beginVerifyTime = formModel.verifyTime[0]
    params.endVerifyTime = formModel.verifyTime[1]
  }
  try {
    let res = await orderList(params)
    loading.value = false
    if (res?.code == 200) {
      pagination.value.total = res.total;
      formModel.list = res.rows
    } else {
      Message.error(res?.msg)
    }
  } catch(error) {
      loading.value = false
      Message.error(JSON.stringify(error) || '接口异常')
  }
}





const verifyLoading = ref(false)
const selectedDetail = reactive({
  id: '',
  image: '',
  title: '',
  price: '',
  orderNumber: '',
  phoneNumber: '',
});
const verifySearch = async()=> {
  if (!formModel.inputTicketCode) {
    Message.error('请输入劵码')
    return;
  }
  verifyLoading.value = true;
  let res = await orderFindByTicketCode({
      ticketCode: formModel.inputTicketCode,
      id: selectedDetail.id,
  })
  verifyLoading.value = false;
  if (res?.code != 200) {
    Message.error(res?.msg)
    return;
  }
  if (!res?.data) {
    Message.error('暂无数据')
    return;
  }
  selectedDetail.image = res?.data?.comboPhotoUrl
  selectedDetail.title = res?.data?.shopComboName
  selectedDetail.price = res?.data?.orderAmount
  selectedDetail.orderNumber = res?.data?.orderNo
  selectedDetail.phoneNumber = res?.data?.phone
  selectedDetail.id = res?.data?.id
  isModalVisible.value = true;
}



const handleConfirm = async() => {
  let res = await orderTicketCode({
    ticketCode: formModel.inputTicketCode
  })
  if (res?.code != 200) {
    Message.error(res?.msg)
    return;
  }
  Message.success('验证成功')
  isModalVisible.value = false;
};


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
