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
                <a-form-item field="name" label="状态">
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
    <a-radio-group type="button" v-model="buttonType" style="margin: 16px 0 16px 0;">
      <a-radio value="0">审批通过</a-radio>
      <a-radio value="1">审批不通过</a-radio>
    </a-radio-group>
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
          <a-button v-if="record.comboStatus == '1'" @click="doEdit(record, rowIndex)" size="mini">编辑</a-button>
          <a-popconfirm content="是否删除?" v-if="record.comboStatus == '1'" @ok="doDelete(record, rowIndex)">
            <a-button status="danger"   size="mini">删除</a-button>
          </a-popconfirm>
        </a-space>
      </template>
      <template #comboStatus="{ record }">
        <a-tag v-if="record.comboStatus == '0'" color="orange">已上线</a-tag>
        <a-tag v-if="record.comboStatus == '1'" color="blue">已下线</a-tag>
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
const buttonType = ref('0')
const optionIndex = ref(-1)

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
    { title: '操作', slotName: 'optional', width: 240 },
  ];
const data = reactive({
  list: []
});
const reset = ()=> {
  formModel.pageNum = 1;
  formModel.pageSize = 0;
  formModel.storeName = '';
  formModel.mealName = '';
  formModel.status = '';
  formModel.payDate = '';
  search()
}
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
  }
    localStorage.setItem('mealEdit', JSON.stringify(_record))
  router.push('/meal/create?id=' + record.id)
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


// 通过
const doAgree = async (item, index) => {
  Modal.confirm({
    titleAlign: 'start',
    title: '通过商家',
    content: '是否确认通过，通过后商家可进行店铺管理',
    okText: '确定',
    cancelText: '取消',
    async onOk() {
      try {
        let res = await orderCancel(item.id)
        loading.value = false
        if (res?.code == 200) {
          Message.success('通过成功')
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

// 上线
const doUp = async (item, index) => {
  Modal.confirm({
    titleAlign: 'start',
    title: '上线商家',
    content: '是否确认上线，上线后小程序即可查看',
    okText: '确定',
    cancelText: '取消',
    async onOk() {
      try {
        let res = await orderCancel(item.id)
        loading.value = false
        if (res?.code == 200) {
          Message.success('上线成功')
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

// 下线
const doDown = async (item, index) => {
  Modal.confirm({
    titleAlign: 'start',
    title: '下线商家',
    content: '是否确认下线，上线后小程序将无法查看',
    okText: '确定',
    cancelText: '取消',
    async onOk() {
      try {
        let res = await orderCancel(item.id)
        loading.value = false
        if (res?.code == 200) {
          Message.success('下线成功')
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