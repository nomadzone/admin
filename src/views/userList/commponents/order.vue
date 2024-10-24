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
          <a-link @click="doLookMeal(record, rowIndex)" size="mini">查看</a-link>
          <a-popconfirm content="是否下架?" v-if="record.comboStatus != '1'" @ok="doDown(record, rowIndex)">
            <a-button status="warning"  size="mini">下架</a-button>
          </a-popconfirm>
          <a-popconfirm content="是否上架?" v-if="record.comboStatus == '1'" @ok="doUp(record, rowIndex)">
            <a-button type="primary" size="mini">上架</a-button>
          </a-popconfirm>
          <a-popconfirm content="是否删除?" v-if="record.comboStatus == '1'" @ok="doDelete(record, rowIndex)">
            <a-button status="danger" size="mini">删除</a-button>
          </a-popconfirm>
        </a-space>
      </template>
      <template #comboStatus="{ record }">
        <a-tag v-if="record.comboStatus == '0'" color="blue">已上线</a-tag>
        <a-tag v-if="record.comboStatus == '1'" color="red">已下线</a-tag>
        <a-tag v-if="record.comboStatus == '2'" color="green">待审批</a-tag>
        <a-tag v-if="record.comboStatus == '3'" color="red">不通过</a-tag>
      </template>
      <template #rejectReason="{ record }">
        <span> {{ record.comboStatus == 3 ? record.rejectReason : '--' }} </span>
      </template>
    </a-table>
    </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { userActivityList } from '@/api/order'
import { Message } from '@arco-design/web-vue'
import { comboList, comboChangeStatus, comboDelete } from '@/api/combo';
import { useRouter } from 'vue-router';
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
    { title: '套餐ID', dataIndex: 'id' },
    { title: '套餐名称', dataIndex: 'comboName', ellipsis: true },
    { title: '销量', dataIndex: 'number' },
    { title: '门店价', dataIndex: 'shopPrice' },
    { title: '团购价', dataIndex: 'comboPrice' },
    { 
      title: '状态', 
      dataIndex: 'comboStatus',
      slotName: 'comboStatus' // 使用 slot 来渲染状态列
    },
    { 
      title: '拒绝理由', 
      dataIndex: 'rejectReason',
      slotName: 'rejectReason' // 使用 slot 来渲染状态列
    },
    { title: '结束时间', dataIndex: 'validTimeEnd' },
    { title: '最近变更时间', dataIndex: 'updateTime' },
    { title: '操作', slotName: 'optional', width: 200 },
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
        let res: any = await comboList(params)
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

const doLookMeal = (record, index)=> {
  let _record = {...record}
  for (let key in _record) {
    if (_record[key]=== null || _record[key]===undefined) {
      _record[key] = ''
    }
    if (key === 'comboClassifyList' && Array.isArray(_record[key])) {
      _record[key].map(ele=> {
        for (let eleKey in ele) {
          if (ele[eleKey] === null || ele[eleKey] === undefined) {
            ele[eleKey] = ''
          }
          if (eleKey === 'shopComboClassifyList') {
            ele[eleKey].map(m=> {
              for (let k in m) {
                if (m[k] === null || m[k] === undefined) {
                  m[k] = ''
                }
              }
            })
          }
        }
      })
    }
  }
    localStorage.setItem('mealInfo', JSON.stringify(_record))
  router.push('/meal/create')
}

const doDown = async(item, index)=> {
    loading.value = true
    const res = await comboChangeStatus({
      id: item.id,
      comboStatus: '1'
    })
    loading.value = false
    if (res?.code != 0){
      Message.error(res?.msg);
      return;
    }
    formModel.list[index].comboStatus = '1'
    Message.success('下架成功');
  }

  const doUp = async(item, index)=> {
    loading.value = true
    const res = await comboChangeStatus({
      id: item.id,
      comboStatus: '0'
    })
    loading.value = false
    if (res?.code != 0){
      Message.error(res?.msg);
      return;
    }
    data.list[index].comboStatus = '0'
    Message.success('上架成功');
  }

const doDelete = async(item, index)=> {
    loading.value = true
    const res = await comboDelete(item.id)
    if (res?.code != 0){
      Message.error(res?.msg);
      return;
    }
    loading.value = false
    search()
    Message.success('删除成功');
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
  padding: 8px 0;
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
</style>