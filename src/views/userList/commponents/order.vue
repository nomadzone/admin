<template>
    <div style="padding-top: 32px;">
    <div class="type">
        <a-button shape="round" v-if="type != '0'" @click="type = '0'; search()">活动订单</a-button>
        <a-button shape="round" type="primary" v-if="type == '0'">活动订单</a-button>
        <a-button shape="round" v-if="type != '1'" @click="type = '1'; searchMeal()">套餐订单</a-button>
        <a-button shape="round" type="primary"  v-if="type == '1'">套餐订单</a-button>
    </div>
    <a-table v-if="type == '0'" :columns="columns" :data="formModel.list" style="width: 100%" :loading="loading" :pagination='pagination'>
      <template #status="{ record }">
        <a-tag :color="record.status === '1' ? 'green' : record.status === '2' ? 'red' : 'blue'">
          {{ record.status === '1' ? '报名成功' : record.status === '2' ? '取消报名' : '正在报名' }}
        </a-tag>
      </template>
      <template #price="{ record }">
        {{ record.price || '--' }}
      </template>
      <template #optional="{ record }">
        <a-space>
            <a-link @click="doLook(record)">查看详情</a-link>
        </a-space>
      </template>
    </a-table>
    <a-modal v-model:visible="visible">
      <template #title>
        活动详情
      </template>
      <div>
        <div class="line" v-for="field in fields" :key="field.key">
          <span>{{ field.label }}</span>
            <a-image
                v-if="field.key === 'images'"
                width="32"
                :src="info[field.key]"
            />
          <span v-else-if="field.key === 'gender'">{{ info[field.key] == '0' ? '男' : (info[field.key] == '1' ? '女': '未知')  }}</span>
          <a-tag v-else-if="field.key === 'status'" :color="info[field.key] === '1' ? 'green' : info[field.key] === '2' ? 'red' : 'blue'">
          {{ info[field.key] === '1' ? '报名成功' : info[field.key] === '2' ? '取消报名' : '正在报名' }}
          </a-tag>
          <span v-else>{{ info[field.key] || '--' }}</span>
        </div>
      </div>
    </a-modal>

    <a-table v-if="type == '1'" :columns="columnsMeal" :data="formModelMeal.list" style="width: 100%" :loading="loadingMeal" :pagination='paginationMeal'>
      <template #optional="{ record, rowIndex }">
        <a-space>
          <a-link @click="doLookMeal(record, rowIndex)" size="mini">查看详情</a-link>
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
    <a-modal v-model:visible="visibleMeal" width="840px">
      <template #title>
        套餐详情
      </template>
      <div class="meal-row">
        <div class="line" v-for="field in fieldsMeal" :key="field.key">
          <span>{{ field.label }}</span>
            <a-image
                v-if="field.key === 'comboPhotoUrl'"
                width="48"
                :src="infoMeal[field.key]"
            />
          <span v-else>{{ infoMeal[field.key] || '--' }}</span>
        </div>
      </div>
    </a-modal>
    </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { userActivityList, userMealList } from '@/api/order'
import { Message } from '@arco-design/web-vue'
import { comboList, comboChangeStatus, comboDelete } from '@/api/combo';
import { useRouter } from 'vue-router';
import { find } from 'lodash';
const router = useRouter()

// 活动订单
const columns = [
  { title: '手机号码', dataIndex: 'phone' },
  { title: '用户昵称', dataIndex: 'nickname'},
  { title: '订单金额', slotName: 'price', width: 90 },
  { title: '状态', slotName: 'status' },
  { title: '报名时间', dataIndex: 'createTime', width: 130 },
  { title: '操作', slotName: 'optional', width: 100 },
];
const formModel = reactive({
    pageNum: 1,
    pageSize: 10,
    list: []
});
const type = ref('0')
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
const loading = ref(false)
let userId = ref('')
onMounted(() => {
    const userListInfo = JSON.parse(localStorage.getItem('userListInfo'))
    userId.value = userListInfo ? userListInfo?.id : ''
    search()
})
const search = async () => {
    loading.value = true
    const params = {
        pageNum: formModel.pageNum,
        pageSize: formModel.pageSize,
        userId: userId.value
    }
    try {
        let res: any = await userActivityList(params)
        loading.value = false
        if (res?.code == 0) {
            pagination.value.total = res.total;
            formModel.list = res.rows
        } else {
            Message.error(res?.msg || res?.code?.toString() || '接口异常')
        }
    } catch (error) {
        Message.error('接口异常')
    }
}
const visible = ref(false);
const fields = [
  { label: '报名时间', key: 'createTime' },
  { label: '备注', key: 'remark' },
  { label: '票夹ID', key: 'id' },
  { label: '用户ID', key: 'userId' },
  { label: '图片', key: 'images' },
  { label: '用户昵称', key: 'nickname' },
  { label: '价格', key: 'price' },
  { label: '电话号码', key: 'phone' },
  { label: '状态', key: 'status' },
  { label: '性别', key: 'gender' },
  { label: '活动ID', key: 'activityid' },
];

const info = ref({
  "createBy": null,
  "createTime": "2024-10-21 02:43:34",
  "updateBy": null,
  "updateTime": null,
  "remark": "390c7f07-1baa-4958-92bd-e662b637abab",
  "dimensionId": null,
  "adminNew": null,
  "pageNum": null,
  "pageSize": null,
  "id": "1eb6c8c8-91c9-4118-9a96-a1c1ad933ec4",
  "userId": "a7aa4ec9-f8a9-44cb-80d4-00b23b4203da",
  "images": null,
  "nickname": "旷野RFQ1u4T3",
  "price": 0.10,
  "phone": "13484130157",
  "status": "1",
  "gender": null,
  "activityid": "0b81f01e-d6df-49c3-8101-c4d09f194c94",
  "endTime": null
})

const doLook = (item)=> {
  for (let key in item) {
    console.log(key, item[key])
    info.value[key] = item[key] || ''
  }
  visible.value = true
}

// 套餐订单
const columnsMeal = [
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
const formModelMeal = reactive({
    pageNum: 1,
    pageSize: 10,
    list: []
});
const paginationMeal = ref({
    total: 0, // 数据总条数
    current: 1, // 当前页
    pageSize: 10, // 每页显示的条数
    showTotal: true, // 是否显示总条数
    onChange: (page) => {
        pagination.value.current = page; // 更新当前页
        formModelMeal.pageNum = page; // 更新当前页
        searchMeal()
    }, // 页码改变时的回调函数
})
const loadingMeal = ref(false)
const searchMeal = async () => {
  loadingMeal.value = true
    const params = {
        pageNum: formModel.pageNum,
        pageSize: formModel.pageSize,
        appUserld: userId.value
    }
    try {
        let res: any = await userMealList(params)
        loadingMeal.value = false
        if (res?.code == 0) {
            pagination.value.total = res.total;
            formModelMeal.list = res.rows
        } else {
            Message.error(res?.msg || res?.code?.toString() || '接口异常')
        }
    } catch (error) {
        Message.error('接口异常')
    }
}

const visibleMeal = ref(false)
const fieldsMeal = [
  { label: 'ID', key: 'id' },
  { label: '订单编号', key: 'orderNo' },
  { label: '店铺套餐名称', key: 'shopComboName' },
  { label: '数量', key: 'number' },
  { label: '订单金额', key: 'orderAmount' },
  { label: '服务费', key: 'serviceCost' },
  { label: '订单状态', key: 'orderStatusName' },
  { label: '电话', key: 'phone' },
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
  { label: '用户昵称', key: 'userNikeName' },
  { label: '开始订单日期', key: 'beginOrderDate' },
  { label: '结束订单日期', key: 'endOrderDate' },
  { label: '开始验证时间', key: 'beginVerifyTime' },
  { label: '结束验证时间', key: 'endVerifyTime' },
  { label: '开始支付日期', key: 'beginPayDate' },
  { label: '结束支付日期', key: 'endPayDate' },
  { label: '店铺名称', key: 'shopName' },
  { label: '备注', key: 'remark' },
];

const infoMeal = ref({
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
  phone: '',
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

const doLookMeal = (item)=> {
  for (let key in item) {
    infoMeal.value[key] = item[key] || ''
  }
  visibleMeal.value = true
}

</script>

<style lang="scss" scoped>
.tag {
    display: flex;
    gap: 8px;
    color: var(--color-text-3);
    padding-bottom: 32px;

    span {
        padding: 6px 16px;
        border-radius: 20px;
        cursor: pointer;

        &:hover {
            background-color: #F2F3F5;
        }
    }

    .active {
        background-color: #F2F3F5;
        color: #165DFF;
    }

    box-sizing: border-box;
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