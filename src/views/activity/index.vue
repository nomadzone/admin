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
                    @change="getTimeList"
                />
              </a-form-item>
            </a-col>
            <a-col :xl="6" :lg="8" :md="12" :xs="24">
              <a-form-item label="状态:" field="status">
                <a-select v-model="form.status" placeholder="请选择" :options="options" :field-names="fieldNames" >
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :xl="6" :lg="8" :md="12" :xs="24">
              <a-form-item label="所在城市:" field="city">
                <a-cascader :options="optionsCity" v-model="form.city" :field-names="field" :style="{width:'320px'}"
                placeholder="请选择" allow-search />
              </a-form-item>
            </a-col>
            <a-col :xl="6" :lg="8" :md="12" :xs="24">
              <a-form-item label="所在城市:" field="address">
                <a-input placeholder="请输入" v-model="form.address"></a-input>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
        <div class="search-from-right">
          <a-button icon="search" type="primary" @click="getDataList"> 搜索 </a-button>
          <a-button icon="Refresh" @click="resetQuery">重置</a-button>
        </div>
      </div>
      <!-- <a-row class="add_row">
        <a-button type="primary" @click="add">添加</a-button>
      </a-row> -->
      <a-table :columns="columns" :loading="loading" :data="tableData" :pagination="false">
        <template #startdate="{record}">
          {{ record.startdate }}- {{ record.enddate }}
        </template>
        <template #status="{record}">
          {{ options.find(item => item.value === record.status).label }}
        </template>
        <template #actions="{record}">
          <a-button style="margin-left: 5px;" text type="primary" v-if="record.status === 100" @click="handleStatus(record)">审核</a-button>
          <a-popconfirm @ok="downOk(record)" v-if="record.status === 100|| record.status === 101 || record.status === 102 || record.status === 103 || record.status === 104 || record.status === 104" content="确认下架吗？">
            <a-button type="primary">下架</a-button>
          </a-popconfirm>
          <a-popconfirm @ok="onOk(record)" v-if="record.status === 105" content="确认上架吗？">
            <a-button type="primary" >上架</a-button>
          </a-popconfirm>
          <a-button style="margin-left: 5px;" text type="primary" @click="handleToInfo(record)">详情</a-button>
        </template>
      </a-table>
      <div class="pagination_end">
        <a-pagination :total="total" show-page-size @change="changePage" :page-size="form.pageSize" :current-page="form.pageNum" @page-size-change="changePageSize" />

      </div>
    </div>
    <ActionForm ref="actionformRef"></ActionForm>
    <Detail ref="detailRef" @revesh="togetList"></Detail>
    <Info ref="infoRef"></Info>
  </PageCard>
</template>

<script lang="ts" setup>
import PageCard from '@/components/page-card/index.vue';
import ActionForm from './form.vue'
import { ref } from 'vue';
import { getList, onlineUp, onlineDown } from '@/api/activity';
import optionsCity from './address.json'
import { Message } from '@arco-design/web-vue';
import Detail from './detail.vue'
import Info from './info.vue'

const loading = ref(false)
const infoRef = ref()

const form = ref({
  pageNum: 1,
  pageSize: 10,
})
const actionformRef = ref()
const detailRef = ref()
const queryRef = ref()
const fieldNames = {value: 'value', label: 'label'}
const field = {value: 'name', label: 'name'}
const total = ref(0)



const options = ref([
    {value: 100, label: '发布中(审核中)'},
    {value: 101, label: '已发布(报名中)'},
    {value: 102, label: '活动中'},
    {value: 103, label: '已满员'},
    {value: 104, label: '已结束'},
    {value: 105, label: '已下架'},
    {value: 106, label: '已删除'},
    {value: 107, label: '未通过'}
]);
const columns = [
  {
    title: '活动id',
    dataIndex: 'id',
    width: 100
  },
  {
    title: '活动名称',
    dataIndex: 'title',
  },
  {
    title: '活动时间',
    dataIndex: 'startdate',
    slotName:'startdate',
    width: 220
  },
  {
    title: '报名人数',
    dataIndex: 'signUpNumber',
    width: 100
  },
  {
    title: '退款人数',
    dataIndex: 'refundNumber',
    width: 100
  },
  {
    title: '人均收费',
    dataIndex: 'price',
    width: 100
  },
  {
    title: '发起人昵称',
    dataIndex: 'nickname',
    width: 140
  },
  {
    title: '发起人手机号',
    dataIndex: 'phone',
    width: 140
  },
  {
    title: '发起时间',
    dataIndex: 'createTime',
    width: 220
  },
  {
    title: '所在城市',
    dataIndex: 'city',
    width: 100
  },
  {
    title: '状态',
    dataIndex: 'status',
    slotName:'status',
    width: 100
  },
  {
    title: '操作',
    dataIndex: 'actions',
    slotName:'actions',
    fixed: 'right',
  }
];
const tableData = ref([])

function getTimeList(e) {
  form.value.startdate = e[0]
  form.value.enddate = e[1]
}
function handleStatus(record) {
  detailRef.value.openDialog(record)
}
function handleToInfo(record) {
  infoRef.value.openDialog(record)
}
function downOk(record) {
  onlineDown({id : record.id}).then(res => {
    if(res.code === 0) {
      Message.success('下架成功')
       togetList()
    } else {
      Message.error('下架失败')
    }
  })
}
function onOk(record) {
  onlineUp({id : record.id}).then(res => {
    if(res.code === 0) {
      Message.success('上架成功')
       togetList()
    } else {
      Message.error('上架失败')
    }
  })
}

// 获取列表数据
function togetList() {
  loading.value = true
  getList({
    ...form.value
  }).then(res => {
    tableData.value = res.rows
    total.value = res.total
  })
  .finally(() => {
    loading.value = false
  })
}
togetList()
function getDataList() {
 form.value.pageNum = 1
  togetList()
}


function add() {
  actionformRef.value.openDialog()
}

function resetQuery() {
  form.value = {
    pageNum: 1,
    pageSize: 10,
  }
  form.value.time = []
  togetList()
}
function changePage(page) {
  form.value.pageNum = page
  togetList()
}
function changePageSize(size) {
  form.value.pageSize = size
  togetList()
}
</script>

<style lang="less" scoped>
.pagination_end{
  width: 100%;
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}
</style>
