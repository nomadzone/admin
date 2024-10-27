<template>
  <PageCard>
    <a-card class="general-card width-full" style="padding-bottom: 0;">
      <a-row>
        <a-col :flex="1">
          <a-form :model="formModel" :label-col-props="{ span: 6 }" :wrapper-col-props="{ span: 18 }"
            label-align="center">
            <a-row :gutter="16">
              <a-col :span="12">
                <a-form-item field="number" label="需求描述">
                  <a-input v-model="formModel.describe" placeholder="请输需求描述" />
                </a-form-item>
                <a-form-item field="number" label="用户昵称">
                  <a-input v-model="formModel.nickname" placeholder="请输用户昵称" />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item field="name" label="状态">
                  <a-select :style="{ width: '340px' }" v-model="formModel.status" placeholder="全部">
                    <a-option value="">全部</a-option>
                    <a-option value="200">审核中</a-option>
                    <a-option value="201">已上架</a-option>
                    <a-option value="203">已下架</a-option>
                  </a-select>
                </a-form-item>
                <a-form-item field="name" label="创建时间">
                  <a-range-picker style="width: 360px; margin: 0 24px 0 0;" show-time allow-clear
                    :time-picker-props="{ defaultValue: ['00:00:00', '09:09:06'] }" format="YYYY-MM-DD HH:mm"
                    v-model="formModel.verifyTime" @clear="onClear" @ok="onOkTime" />
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
            <a-button @click="reset">
              <template #icon>
                <icon-refresh />
              </template>
              重置
            </a-button>
          </a-space>
        </a-col>
      </a-row>
    </a-card>
    <a-divider />
    <div style="margin-bottom: 16px;display: flex;gap: 8px;">
      <a-button @click="doVerify('1')" :disabled='selectedKeys.length == 0'>审批通过</a-button>
      <a-button @click="doVerify('2')" :disabled='selectedKeys.length == 0'>审批不通过</a-button>
    </div>
    <a-table :columns="columns" :data="data.list" style="width: 100%" :loading="loading" :pagination='pagination' 
    v-model:selectedKeys="selectedKeys"  row-key="id" :row-selection="rowSelection">
      <template #optional="{ record, rowIndex }">
        <a-space>
          <a-button @click="doLook(record)" size="mini">
            <template #icon>
              <icon-find-replace />
            </template>
            查看</a-button>
          <a-button type="primary" size="mini" @click="verifyType = 'single';optionIndex = rowIndex; isExamine = true"
            v-if="record.status == 200">
            <template #icon>
              <icon-check-square />
            </template>
            审核
          </a-button>
          <a-button type="outline" size="mini" @click="verifyType = 'single';optionIndex = rowIndex; isExamine = true"
            v-if="record.status == 203">
            <template #icon>
              <icon-check-square />
            </template>
            再次审核
          </a-button>
          <a-button type="primary" status="danger" size="mini" v-if="record.status == 201"
            @click="doDown(record, rowIndex)">
            <template #icon>
              <icon-eye-invisible />
            </template>
            下架</a-button>

        </a-space>
      </template>
      <template #status="{ record }">
        <a-tag v-if="record.status == 200" color="orange">审核中</a-tag>
        <a-tag v-if="record.status == 201" color="green">已上架</a-tag>
        <a-tag v-if="record.status == 202" color="green">已删除</a-tag>
        <a-tag v-if="record.status == 203" color="red">已下架</a-tag>
      </template>
    </a-table>

    <!-- 审批 -->
    <a-modal v-model:visible="isExamine" :on-before-ok="doExamine" @cancel="isExamine = false" unmountOnClose>
      <template #title>审核</template>
      <div class="ineject">
        <div style="font-size: 18px;color: #333;padding-bottom: 8px;">请选择是否审批通过?</div>
        <div>
          <a-radio-group type="button" v-model="examineStatus">
            <a-radio value="1">审批通过</a-radio>
            <a-radio value="2">审批不通过</a-radio>
          </a-radio-group>
        </div>
        <div v-if="examineStatus === '2'">
          <div style="padding-bottom: 8px;" :class="[!examineText && isExamineError ? 'error' : '']"><span
              class="required">*</span>请输入不通过原因</div>
          <a-input :style="{ width: '320px' }" placeholder="请输入不通过原因" type="text" v-model="examineText" required
            allow-clear />
        </div>
      </div>
    </a-modal>
  </PageCard>
</template>

<script setup>
import PageCard from '@/components/page-card/index.vue';
import { ref, reactive, onMounted, watch, computed } from 'vue';
import { Message, Modal } from '@arco-design/web-vue';
import { getList, onlineUp, onlineDown, audit } from '@/api/activity';
import router from '@/router';

//   发布中(审核中) 200 
// 201 已发布
// 202 己删除
// 203 未通过

const buttonType = ref('')
const optionIndex = ref(-1)

onMounted(() => {
  search()
})
const formModel = reactive({
  pageNum: 1,
  pageSize: 10,
  describe: '',
  nickname: '',
  status: '',
  verifyTime: [],
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
  { title: '标题', dataIndex: 'title' },
  { title: '定位', dataIndex: 'address' },
  { title: '用户昵称', dataIndex: 'nickname' },
  {
    title: '状态',
    dataIndex: 'status',
    slotName: 'status' // 使用 slot 来渲染状态列
  },
  { title: '创建时间', dataIndex: 'createTime' },
  { title: '操作', slotName: 'optional', width: 200 },
];
const data = reactive({
  list: []
});
const doLook = (record)=> {
  try {
  let _record = {...record}
  for (let key in _record) {
    if (_record[key]=== null || _record[key]===undefined) {
      _record[key] = ''
    }
  }
  localStorage.setItem('noveltyInfo', JSON.stringify(_record))
  router.push('/novelty/info?id=' + record.id)
  } catch(error) {
    Message.error(JSON.stringify(error))
  }
}

const onOkTime = (value) => { formModel.verifyTime = value }
const onClear = () => { formModel.verifyTime = []; search() }
const reset = () => {
  buttonType.value = ''
  formModel.pageNum = 1;
  formModel.pageSize = 10;
  formModel.describe = '';
  formModel.nickname = '';
  formModel.status = '';
  formModel.verifyTime = [];
  search()
}

watch(buttonType, (newVal, oldVal) => {
  if (newVal !== oldVal && newVal !== null) {
    formModel.pageNum = 1;
    formModel.pageSize = 10;
    formModel.describe = '';
    formModel.nickname = '';
    formModel.status = Number(newVal);
    formModel.verifyTime = [];
    search()
  }
})
const search = async () => {
  loading.value = true
  const params = {
    pageNum: formModel.pageNum,
    pageSize: formModel.pageSize,
    "type": 2
  }
  if (formModel.describe) {
    params.describe = formModel.describe
  }
  if (formModel.nickname) {
    params.nickname = formModel.nickname
  }
  if (formModel.status) {
    params.status = formModel.status
  }
  if (formModel.verifyTime?.length === 2 && formModel.verifyTime[0] && formModel.verifyTime[1]) {
    params.startcreateTime = formModel.verifyTime[0]
    params.endcreateTime = formModel.verifyTime[1]
  }
  try {
    let res = await getList(params)
    loading.value = false
    if (res?.code !== 0) {
      Message.error(res?.msg)
    } else {
      pagination.value.total = res.total;
      res.rows.map(item=> {
        if (item.status == 201 || item.status == 202) {
          item.disabled = true;
        }
      })
      data.list = res.rows;
    }
  } catch (error) {
    loading.value = false
    Message.error(JSON.stringify(error) || '接口异常')
  }
}
// 审批
const isExamine = ref(false)
const examineText = ref('')
const isExamineError = ref(false)
const examineStatus = ref('1')

const verifyType = ref('single')
const selectedKeys = ref([]);
const rowSelection = reactive({
    type: 'checkbox',
    showCheckedAll: true,
    onlyCurrent: false,
  });
const doVerify = (type) => {
  if (selectedKeys.value.length === 0) {
    Message.error('请勾选')
    return;
  }
  isExamine.value = true
  examineStatus.value = type
  verifyType.value = 'multi'
}

const doExamine = async () => {
  if (examineStatus.value === '2' && !examineText.value) {
    isExamineError.value = true;
    return false
  }
  let params = {}
  let index = -1
  if (verifyType.value === 'single') {
    const record = data.list[optionIndex.value]
    index = optionIndex.value
    params = {
      ids: [record.id],
      status: examineStatus.value,
      remark: examineStatus.value === '1' ? "" : examineText.value
    }
  } else {
    params = {
      ids: selectedKeys.value,
      status: examineStatus.value,
      remark: examineStatus.value === '1' ? "" : examineText.value
    }
  }
  loading.value = true
  Message.loading('加载中...')
  const res = await audit(params)
  Message.clear()
  loading.value = false
  if (res?.code != 0) {
    Message.error(res?.msg);
    return;
  }
  if (verifyType.value === 'single') {
    data.list[index].status = examineStatus.value === '1' ? 201 : 203
      data.list[index].disabled = examineStatus.value === '1'
  } else {
    data.list.map(item=> {
      if (selectedKeys.value.includes(item.id)) {
        item.status = examineStatus.value === '1' ? 201 : 203
        item.disabled = examineStatus.value === '1'
        selectedKeys.value = []
      }
    })
  }
  Message.success(examineStatus.value === '1' ? "审核通过" : '拒绝通过');
  search()
  return true;
}

// 下架
const doDown = async (record, index) => {
  Modal.confirm({
    titleAlign: 'start',
    title: '下架',
    content: '是否确认下架，上架后小程序将无法查看',
    okText: '确定',
    cancelText: '取消',
    async onOk() {
      try {
        onlineDown({ id: record.id }).then(res => {
          if (res.code === 0) {
            data.list[index].status = 203
            data.list[index].disabled = false
            Message.success('下架成功')
            search()
          } else {
            Message.error('下架失败')
          }
        })
      } catch (error) {
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
  flex-direction: column;
  gap: 10px;

  .required {
    color: red;
  }

  .error {
    color: red;
  }
}

.line {
  padding: 8px 0;
  display: flex;
  gap: 10px;

  >* {
    display: flex;
  }

  >span:first-child {
    color: #777;
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
</style>