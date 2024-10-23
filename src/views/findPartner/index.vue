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
                    <a-option value="300">审核中</a-option>
                    <a-option value="301">已上架</a-option>
                    <!-- <a-option value="302">已删除</a-option> -->
                    <a-option value="303">已下架</a-option>
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
      <a-button type="primary" @click="buttonType = ''"  v-if="buttonType === 301">审批通过</a-button>
      <a-button  v-if="buttonType !== 301" @click="buttonType = 301">审批通过</a-button>
      <a-button type="primary" @click="buttonType = ''" v-if="buttonType === 303">审批不通过</a-button>
      <a-button @click="buttonType = 303"  v-if="buttonType !== 303">审批不通过</a-button>
    </div>
    <a-table :columns="columns" :data="data.list" style="width: 100%" :loading="loading" :pagination='pagination'>
      <template #optional="{ record, rowIndex }">
        <a-space>
          <a-button @click="optionIndex = rowIndex; isLook = true" size="mini">
            <template #icon>
              <icon-find-replace />
            </template>
            查看</a-button>
          <a-button type="primary" size="mini" @click="optionIndex = rowIndex; isExamine = true"
            v-if="record.status == 300">
            <template #icon>
              <icon-check-square />
            </template>
            审核
          </a-button>
          <a-button type="outline" size="mini" @click="optionIndex = rowIndex; isExamine = true"
            v-if="record.status == 303">
            <template #icon>
              <icon-check-square />
            </template>
            再次审核
          </a-button>
          <a-button type="primary" status="danger" size="mini" v-if="record.status == 301"
            @click="doDown(record, rowIndex)">
            <template #icon>
              <icon-eye-invisible />
            </template>
            下架</a-button>
          <!-- <a-link status="danger" @click="optionIndex = rowIndex; isExamine = true" size="mini" v-if="record.status == 300">不通过</a-link>
            <a-link status="success" @click="doAgree(record, rowIndex)" size="mini" v-if="record.status == 300 || record.status == 303">通过</a-link>
            <a-link type="primary" @click="doUp(record, rowIndex)" size="mini" v-if="record.status == 300 || record.status == 303">上架</a-link> -->

        </a-space>
      </template>
      <template #status="{ record }">
        <a-tag v-if="record.status == 300" color="orange">审核中</a-tag>
        <a-tag v-if="record.status == 301" color="green">已上架</a-tag>
        <a-tag v-if="record.status == 302" color="green">已删除</a-tag>
        <!-- <a-tag v-if="record.status == 303" color="red">未通过</a-tag> -->
        <a-tag v-if="record.status == 303" color="red">已下架</a-tag>
      </template>
    </a-table>
    <!-- 查看详情 -->
    <a-modal v-model:visible="isLook" width="600px">
      <template #title>找搭子详情</template>
      <div>
        <div class="line">
          <span>需求描述</span>
          <span>{{ info.describe }}</span>
        </div>
        <div class="line">
          <span>面基地点</span>
          <span>{{ info.address }}</span>
        </div>
        <div class="line">
          <span>期望时间</span>
          <span>{{ info.expectdate }}</span>
        </div>
        <div class="line">
          <span>状态</span>
          <div>
            <a-tag color="orangered" v-if="info.status === 300">审核中</a-tag>
            <a-tag color="green" v-if="info.status === 301">已上架</a-tag>
            <a-tag color="red" v-if="info.status === 302">已删除</a-tag>
            <a-tag color="red" v-if="info.status === 303">已下架</a-tag>
          </div>
        </div>
        <div class="line" v-if="info.status === 303 || info.status === 302">
          <span>不通过原因</span>
          <span>{{ info.remark }}</span>
        </div>
        <div class="line">
          <span>联系方式</span>
          <div class="columns">
            <div style="padding-bottom: 8px;">{{ info.phone }}</div>
            <a-image width="120" :src="info.images" />
          </div>
        </div>
      </div>
    </a-modal>

    <!-- 不通过 -->
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

//   发布中(审核中) 300 
// 301 已发布
// 302 己删除
// 303 未通过

const buttonType = ref('')
const optionIndex = ref(-1)
const info = computed(() => data.list[optionIndex.value] || {
  describe: '',
  address: '',
  expectdate: '',
  status: 300,
  remark: '',
  phone: '',
  images: '',
})

const isLook = ref(false)
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
  { title: '需求描述', dataIndex: 'describe' },
  { title: '期望时间', dataIndex: 'expectdate' },
  {
    title: '状态',
    dataIndex: 'status',
    slotName: 'status' // 使用 slot 来渲染状态列
  },
  { title: '面基地点', dataIndex: 'address' },
  { title: '用户昵称', dataIndex: 'nickname' },
  { title: '创建时间', dataIndex: 'createTime' },
  { title: '操作', slotName: 'optional', width: 200 },
];
const data = reactive({
  list: []
});

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
    "type": 3
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
      data.list = res.rows;
    }
  } catch (error) {
    loading.value = false
    Message.error(JSON.stringify(error) || '接口异常')
  }
}
// 审核
const isExamine = ref(false)
const examineText = ref('')
const isExamineError = ref(false)
const examineStatus = ref('1')
const doExamine = async () => {
  if (examineStatus.value === '2' && !examineText.value) {
    isExamineError.value = true;
    return false
  }
  const index = optionIndex.value
  const record = data.list[optionIndex.value]
  loading.value = true
  const res = await audit({
    id: record.id,
    status: examineStatus.value,
    remark: examineStatus.value === '1' ? "" : examineText.value
  })
  loading.value = false
  if (res?.code != 0) {
    Message.error(res?.msg);
    return;
  }
  data.list[index].status = examineStatus.value === '1' ? 301 : 303
  Message.success(examineStatus.value === '1' ? '审核通过' : '拒绝通过');
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
            data.list[index].status = 303
            Message.success('下架成功')
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