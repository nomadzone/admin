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
                  <a-input v-model="formModel.comboName" placeholder="请输套餐名称" />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item field="name" label="状态">
                  <a-select :style="{width:'340px'}" v-model="formModel.status" placeholder="全部">
                    <a-option value="">全部</a-option>
                    <a-option value="0">已上线</a-option>
                    <a-option value="1">已下线</a-option>
                    <a-option value="2">待审批</a-option>
                    <a-option value="3">不通过</a-option>
                  </a-select>
                </a-form-item>
                <a-form-item field="name" label="最近变更时间">
                  <a-range-picker style="width: 360px; margin: 0 24px 0 0;" show-time
                    :time-picker-props="{ defaultValue: ['00:00:00', '09:09:06'] }" format="YYYY-MM-DD HH:mm"
                    @clear="onClear" @ok="onOkTime" v-model="formModel.payDate" allow-clear/>
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
            <a-button  @click="reset">
              <template #icon>
                <icon-eraser />
              </template>
              重置
            </a-button>
          </a-space>
        </a-col>
      </a-row>
    </a-card>

    <div style="margin-bottom: 16px;display: flex;gap: 8px;">
      <a-button type="primary" @click="buttonType = ''"  v-if="buttonType === 0">审批通过</a-button>
      <a-button  v-if="buttonType !== 0" @click="buttonType = 0">审批通过</a-button>
      <a-button type="primary" @click="buttonType = ''" v-if="buttonType === 1">审批不通过</a-button>
      <a-button @click="buttonType = 1"  v-if="buttonType !== 1">审批不通过</a-button>
    </div>

    <a-table :columns="columns" :data="data.list" style="width: 100%" :loading="loading" :pagination='pagination'>
      <template #optional="{ record, rowIndex }">
        <a-space>
          <a-link @click="doLook(record, rowIndex)" size="mini">查看</a-link>
          <a-popconfirm content="是否下架?" v-if="record.comboStatus != '1'" @ok="doDown(record, rowIndex)">
            <a-button status="warning"  size="mini">下架</a-button>
          </a-popconfirm>
          <a-popconfirm content="是否上架?" v-if="record.comboStatus == '1'" @ok="doUp(record, rowIndex)">
            <a-button type="primary" size="mini">上架</a-button>
          </a-popconfirm>
          <!-- <a-button v-if="record.comboStatus == '1'" @click="doEdit(record, rowIndex)" size="mini">编辑</a-button>   -->
          <a-popconfirm content="是否删除?" v-if="record.comboStatus == '1'" @ok="doDelete(record, rowIndex)">
            <a-button status="danger"   size="mini">删除</a-button>
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

    <!-- 不通过 -->
    <a-modal v-model:visible="isInject" :on-before-ok="doInject" @cancel="isInject = false" unmountOnClose>
      <template #title>审核不通过</template>
      <div class="ineject">
        <div :class="[!injectText && isInjectError?'error':'']"><span class="required">*</span>请输入不通过原因</div>
        <a-input :style="{width:'320px'}" placeholder="请输入不通过原因" type="text" v-model="injectText" required allow-clear />
      </div>
    </a-modal>
  </PageCard>
</template>

<script setup>
import PageCard from '@/components/page-card/index.vue';
import { ref, reactive, watch, onMounted, inject } from 'vue';
import { Message, Modal } from '@arco-design/web-vue';
import { useRouter } from 'vue-router';
import { comboList, comboChangeStatus, comboDelete } from '@/api/combo';

const router = useRouter()
const buttonType = ref('')
const optionIndex = ref(-1)

watch(buttonType, (newVal, oldVal) => {
  if (newVal !== oldVal && newVal !== null) {
  formModel.pageNum = 1;
  formModel.pageSize = 10;
  formModel.storeName = '';
  formModel.comboName = '';
  formModel.status = '';
  formModel.payDate = [];
  formModel.status = newVal;
    search()
  }
})

onMounted(() => {
  search()
})
const formModel = reactive({
  pageNum: 1,
  pageSize: 10,
  storeName: '',
  comboName: '',
  status: '',
  payDate: [],
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
const data = reactive({
  list: []
});
const reset = ()=> {
  formModel.pageNum = 1;
  formModel.pageSize = 10;
  formModel.storeName = '';
  formModel.comboName = '';
  formModel.status = '';
  formModel.payDate = [];
  search()
}
const search = async () => {
  loading.value = true
  try {
    const params = {
      pageNum: formModel.pageNum,
      pageSize: formModel.pageSize,
      storeName: formModel.storeName,
      comboName: formModel.comboName,
    }
    if (formModel.status || formModel.status === 0) {
      params.comboStatus = formModel.status
    }
    if (formModel.comboName) {
      params.comboName = formModel.comboName
    }
    if (formModel.storeName) {
      params.storeName = formModel.storeName
    }
    if (formModel.payDate?.length === 2 && formModel.payDate[0] && formModel.payDate[1]) {
      params.beginUpdateTime = formModel.payDate[0]
      params.endUpdateTime = formModel.payDate[1]
    }
    let res = await comboList(params)
    loading.value = false
    if (res?.code !== 0) {
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

const doLook = (record) => {
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

// 不通过
const isInject = ref(false)
const injectText = ref('')
const isInjectError = ref(false)
const doInject = async () => {
  if (!injectText.value) {
    isInjectError.value = true;
    return false
  }
  const index = optionIndex.value
  const item = data.list[optionIndex.value]
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
  Message.success('不通过成功');
  return true;
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
    data.list[index].comboStatus = '1'
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
.ineject {
  display: flex;
  align-items: center;
  gap: 10px;
  .required {
    color: red;
  }
  .error {
    color: red;
  }
}
</style>