<template>
  <PageCard>
    <a-card class="general-card width-full">
      <a-row>
        <a-col :flex="1">
          <a-form :model="formModel" :label-col-props="{ span: 6 }" :wrapper-col-props="{ span: 18 }"
            label-align="right">
            <a-row :gutter="16">
              <a-col :span="12">
                <a-form-item field="number" label="订单号">
                  <a-input v-model="formModel.orderNo" placeholder="请输入订单号" />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item field="name" label="验证时间">
                  <a-range-picker style="width: 360px; margin: 0 24px 24px 0;" show-time
                    :time-picker-props="{ defaultValue: ['00:00:00', '09:09:06'] }" format="YYYY-MM-DD HH:mm"
                     @select="onSelectTime" @ok="onOkTime" @clear="onClear" />
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
    <a-table :columns="columns" :data="formModel.list" style="width: 100%" @row-click="handleRowClick" :loading="loading" :pagination='pagination'>
      <template #optional="{ record }">
        <!-- 1-待使用：点击消费验证，跳转至消费验证页； 2
        2-待付款：点击取消直接订单取消 3
        3-已使用、已完成、退款中、已取消、退款完成、微信支付回调失败、微信退款回调失败：无操作
        4-已使用=已完成，可以合并成一个状态 -->
        <!-- FINISH("0", "已完成"),
        CANCEL("1", "已取消"),
        UN_USE("2", "待使用"),
        WAIT_PAYMENT("3", "待付款"),
        REFUND_IN_PROGRESS("4", "退款中"),
        REFUND_FINISH("5", "退款完成"),
        FAIL("6", "微信支付回调失败"),
        FAIL_RETURN("7", "微信退款回调失败"); -->
        <a-space>
          <a-link @click="doCancel(record)" v-if="record.orderStatus == 3" >取消</a-link>
          <a-link @click="doVerify(record)" v-if="record.orderStatus == 2" status="warning">消费验证</a-link>
          <!-- <a-link @click="doRefund(record)" status="danger">退款维权</a-link> -->
        </a-space>
      </template>
    </a-table>
    <consumptionVerify @submit="handleSubmit"></consumptionVerify>
  </PageCard>
</template>

<script setup>
import PageCard from '@/components/page-card/index.vue';
import consumptionVerify from '@/components/modal/consumption-verify.vue';
import { ref, reactive, watch, onMounted } from 'vue';
import { Modal } from '@arco-design/web-vue';
import { useModalStore } from '../../store';
import { orderList, orderCancel, orderTicketCode } from '@/api/order'
import { Message } from '@arco-design/web-vue'

const columns = [
  { title: '订单号', dataIndex: 'orderNo' },
  { title: '套餐名套餐名套餐名套餐名套餐名…', dataIndex: 'shopComboName', ellipsis: true },
  { title: '数量', dataIndex: 'number', width: 60 },
  { title: '订单金额', dataIndex: 'orderAmount', width: 90 },
  { title: '服务费', dataIndex: 'serviceCost', width: 80 },
  { title: '状态', dataIndex: 'orderStatusName', width: 80 },
  { title: '下单号码', dataIndex: 'phone', width: 130 },
  { title: '操作', slotName: 'optional', width: 160 },
];



const formModel = reactive({
  orderNo: '',
  verifyTime: [],
  pageNum: 1,
  pageSize: 10,
  list: []
});
const loading = ref(false)
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
onMounted(()=> { search() })
const onOkTime = (value) => { formModel.verifyTime = value }
const onClear = ()=> { formModel.verifyTime = []; search() }
const search = async() => {
  loading.value = true
  const params = {
    pageNum: formModel.pageNum,
    pageSize: formModel.pageSize,
    // verifyStatus: '1'
  }
  if (formModel.orderNo){
    params.orderNo = formModel.orderNo
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

const doCancel = (item) => {
  console.log(item)
  Modal.confirm({
    titleAlign: 'start',
    title: '取消',
    content: '是否确认取消',
    okText: '确定',
    cancelText: '取消',
    async onOk() {
      try {
        let res = await orderCancel(item.id)
        loading.value = false
        if (res?.code == 200) {
          Message.success('取消成功')
          search()
        } else {
          Message.error(res?.msg)
        }
      } catch(error) {
        Message.error(JSON.stringify(error) || '接口异常')
      }
    },
    async onCancel() {

    }
  });
}

// 消费验证
const modalStore = useModalStore()
const ticketId = ref('')
const doVerify = (item) => {
  modalStore.consumpitonVerifyForm.value = ''
  modalStore.consumpitonVerifyVisible = true
  ticketId.value = item.id
}

const handleSubmit = async(form)=> {
    try {
      Message.loading('加载中...')
      let res = await orderTicketCode({
        id: ticketId.value,
        ticketCode: form.value
      })
      Message.clear()
      if (res?.code != 200) {
        Message.error(res?.msg)
        return;
      }
      Message.success('验证成功')
      modalStore.consumpitonVerifyVisible = false
      modalStore.value = ''
      search()
    } catch(error) {
      Message.clear()
      Message.error(JSON.stringify(error) || '接口异常')
    }
}
// 退款维权
const doRefund = (item) => {
  console.log(item)
  Modal.confirm({
    titleAlign: 'start',
    title: '退费维权',
    content: '是否确认退费维权',
    okText: '确定',
    cancelText: '取消',
    async onOk() {
    },
    async onCancel() {

    }
  });
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