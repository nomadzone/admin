<template>
    <PageCard>
      <a-card class="general-card width-full">
        <a-row>
          <a-col :flex="1">
            <a-form :model="formModel" :label-col-props="{ span: 6 }" :wrapper-col-props="{ span: 18 }"
              label-align="right">
              <a-row :gutter="16">
                <a-col :span="12"> 
                  <a-form-item field="number" label="套餐名称 ">
                    <a-input v-model="formModel.shopComboName" placeholder="请输入套餐名称 "  allow-clear/>
                  </a-form-item>
                  <a-form-item field="number" label="商家昵称">
                    <a-input v-model="formModel.shopName" placeholder="请输入商家昵称"  allow-clear/>
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item field="name" label="状态">
                    <a-select :style="{width:'340px'}" v-model="formModel.orderStatus" placeholder="全部"  allow-clear>
                      <a-option value="">全部</a-option>
                      <a-option value="0">已完成</a-option>
                      <a-option value="1">已取消</a-option>
                      <a-option value="2">待使用</a-option>
                      <a-option value="3">待付款</a-option>
                      <a-option value="4">退款中</a-option>
                      <a-option value="5">退款完成</a-option>
                      <a-option value="6">微信支付回调失败</a-option>
                      <a-option value="7">微信退款回调失败</a-option>
                    </a-select>
                  </a-form-item>
                  <a-form-item field="name" label="下单时间">
                    <a-range-picker style="width: 360px; margin: 0 24px 24px 0;" show-time
                      :time-picker-props="{ defaultValue: ['00:00:00', '09:09:06'] }" format="YYYY-MM-DD HH:mm"
                       @select="onSelectTime" @ok="onOkTime" @clear="onClear" allow-clear/>
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
      <a-table  :columns="columns" :data="formModel.list" style="width: 100%" :loading="loading" :pagination='pagination'>
      <template #optional="{ record, rowIndex }">
        <a-space>
          <a-link @click="doLook(record, rowIndex)" size="mini">查看详情</a-link>
        </a-space>
      </template>
      <template #orderStatusName="{ record }">
        <a-tag v-if="record.orderStatus == '0'" color="green">{{ record.orderStatusName }}</a-tag>
        <a-tag v-if="record.orderStatus == '1'" color="gray">{{ record.orderStatusName }}</a-tag>
        <a-tag v-if="record.orderStatus == '2'" color="blue">{{ record.orderStatusName }}</a-tag>
        <a-tag v-if="record.orderStatus == '3'" color="arcoblue">{{ record.orderStatusName }}</a-tag>
        <a-tag v-if="record.orderStatus == '4'" color="gold">{{ record.orderStatusName }}</a-tag>
        <a-tag v-if="record.orderStatus == '5'" color="orange">{{ record.orderStatusName }}</a-tag>
        <a-tag v-if="record.orderStatus == '6'" color="orangered">{{ record.orderStatusName }}</a-tag>
        <a-tag v-if="record.orderStatus == '7'" color="red">{{ record.orderStatusName }}</a-tag>
      </template>
    </a-table>
    <a-modal v-model:visible="visible" width="840px">
      <template #title>
        套餐详情
      </template>
      <div class="meal-row">
        <div class="line" v-for="field in fields" :key="field.key">
          <span>{{ field.label }}</span>
            <a-image
                v-if="field.key === 'comboPhotoUrl'"
                width="48"
                :src="info[field.key]"
            />
          <span v-else>{{ info[field.key] || '--' }}</span>
        </div>
      </div>
    </a-modal>
  
    </PageCard>
  </template>
  
  <script setup>
  import PageCard from '@/components/page-card/index.vue';
  import { ref, reactive, watch, onMounted } from 'vue';
  import { Modal } from '@arco-design/web-vue';
  import { useModalStore } from '../../store';
import { userActivityList, userMealList } from '@/api/order'
  import { Message } from '@arco-design/web-vue'
  const columns = [
    { title: '套餐ID', dataIndex: 'orderNo' },
    { title: '套餐名称', dataIndex: 'shopComboName', ellipsis: true },
    { title: '销量', dataIndex: 'number' },
    { title: '商家昵称', dataIndex: 'shopName' },
    { title: '订单金额', dataIndex: 'orderAmount' },
    { title: '服务费', dataIndex: 'serviceCost' },
    { title: '状态', dataIndex: 'orderStatusName', slotName: 'orderStatusName'},
    { title: '下单时间', dataIndex: 'createTime' },
    { title: '操作', slotName: 'optional', width: 100 },
  ];

// 1-待使用：点击消费验证，跳转至消费验证页；
// 2-待付款：点击取消直接订单取消
// 3-已使用、已完成、退款中、已取消、退款完成、微信支付回调失败、微信退款回调失败：无操作
// 4-已使用=已完成，可以合并成一个状态
  
  const visible = ref(false);
  const fields = [
  { label: 'ID', key: 'id' },
  { label: '订单编号', key: 'orderNo' },
  { label: '店铺套餐名称', key: 'shopComboName' },
  { label: '数量', key: 'number' },
  { label: '订单金额', key: 'orderAmount' },
  { label: '服务费', key: 'serviceCost' },
  { label: '订单状态', key: 'orderStatusName' },
  { label: '电话', key: 'shopName' },
  { label: '订单日期', key: 'orderDate' },
  { label: '支付日期', key: 'payDate' },
  { label: '支付类型', key: 'payTypeName' },
  { label: '验证时间', key: 'verifyTime' },
  { label: '验证状态', key: 'verifyStatusName' },
  { label: '验证昵称', key: 'verifyNikeName' },
  { label: '退货标志', key: 'returnFlag' },
  { label: '退货原因', key: 'rejectReturnReason' },
  { label: '退货状态', key: 'returnStatusName' },
  { label: '退货编号', key: 'returnNo' },
  { label: '退货日期', key: 'returnDate' },
  { label: '退货方式', key: 'returnWay' },
  { label: '买家姓名', key: 'buyerName' },
  { label: '折扣', key: 'discount' },
  { label: '维权理由', key: 'defendRightsReason' },
  { label: '套餐照片URL', key: 'comboPhotoUrl' },
  { label: '订单备注', key: 'orderRemark' },
  { label: '支付编号', key: 'payNo' },
  { label: '店铺套餐', key: 'shopCombo' },
  { label: '套餐名称', key: 'userNikeName' },
  { label: '开始订单日期', key: 'beginOrderDate' },
  { label: '结束订单日期', key: 'endOrderDate' },
  { label: '开始验证时间', key: 'beginVerifyTime' },
  { label: '结束验证时间', key: 'endVerifyTime' },
  { label: '开始支付日期', key: 'beginPayDate' },
  { label: '结束支付日期', key: 'endPayDate' },
  { label: '店铺名称', key: 'shopName' },
  { label: '备注', key: 'remark' },
];

const info = ref({
  createTime: '',
  updateBy: '',
  updateTime: '',
  remark: '',
  dimensionId: '',
  adminNew: '',
  pageNum: '',
  pageSize: '',
  id: '',
  userId: '',
  shopId: '',
  orderId: '',
  orderNo: '',
  shopComboId: '',
  shopComboName: '',
  number: '',
  orderAmount: '',
  serviceCost: '',
  orderStatus: '',
  orderStatusName: '',
  appUserId: '',
  appNikeName: '',
  ticketCode: '',
  shopName: '',
  orderDate: '',
  payDate: '',
  payType: '',
  payTypeName: '',
  verifyTime: '',
  verifyStatus: '',
  verifyStatusName: '',
  verifyUserId: '',
  verifyNikeName: '',
  returnFlag: '',
  returnFlagName: '',
  rejectReturnReason: '',
  returnStatus: '',
  returnStatusName: '',
  returnNo: '',
  returnDate: '',
  returnWay: '',
  buyerName: '',
  discount: '',
  defendRightsReason: '',
  delFlag: '',
  comboPhotoUrl: '',
  orderRemark: '',
  payNo: '',
  shopCombo: '',
  userNikeName: '',
  beginOrderDate: '',
  endOrderDate: '',
  beginVerifyTime: '',
  endVerifyTime: '',
  beginPayDate: '',
  endPayDate: '',
  shopName: '',
})
  
  const doLook = (item)=> {
  for (let key in item) {
    info.value[key] = item[key] || ''
  }
  visible.value = true
  }
  
  const formModel = reactive({
    shopComboName: '',
    shopName: '',
    orderStatus: '',
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
    if (formModel.shopComboName){
      params.shopComboName = formModel.shopComboName
    }
    if (formModel.shopName){
      params.shopName = formModel.shopName
    }
    if (formModel.orderStatus){
      params.orderStatus = formModel.orderStatus
    }
    if (formModel.verifyTime?.length === 2 && formModel.verifyTime[0] && formModel.verifyTime[1]) {
      params.beginOrderDate = formModel.verifyTime[0]
      params.endOrderDate = formModel.verifyTime[1]
    }
    try {
      let res = await userMealList(params)
      loading.value = false
      if (res?.code == 0) {
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
  .line {
  padding: 4px 0;
  display: flex;
  gap: 10px;

  >* {
    display: flex;
  }

  >span:first-child {
    color: var(--color-text-3);
    width: 100px;
    text-align: right;
    flex: 0 0 100px;
    display: flex;
    flex-direction: row-reverse;
  }
}

.columns {
  display: flex;
  flex-direction: column;
}
.type {
    display: flex;
    gap: 8px;
    padding-bottom: 16px;
}
.meal-row {
  display: flex;
  flex-wrap: wrap;
  > div {
    width: 50%;
    box-sizing: border-box;
  }
}
  </style>