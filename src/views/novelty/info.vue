<template>
  <PageCard :pageTitle="false" isTransparent>
    <div class="card">
      <div class="option">

        <a-button type="primary" size="mini" @click="optionIndex = rowIndex; isExamine = true"
          v-if="info.status == 200">
          <template #icon>
            <icon-check-square />
          </template>
          审核
        </a-button>
        <a-button type="outline" size="mini" @click="optionIndex = rowIndex; isExamine = true"
          v-if="info.status == 203">
          <template #icon>
            <icon-check-square />
          </template>
          再次审核
        </a-button>
        <a-button type="primary" status="danger" size="mini" v-if="info.status == 201" @click="doDown">
          <template #icon>
            <icon-eye-invisible />
          </template>
          下架</a-button>
      </div>
      <div>
        <div class="title">基本信息</div>
        <div class="line">
          <span>标题</span>
          <span>{{ info.title }}</span>
        </div>
        <div class="line">
          <span>定位</span>
          <span>{{ info.address }}</span>
        </div>
        <div class="line">
          <span>创建时间</span>
          <span>{{ info.createTime }}</span>
        </div>
        <div class="line">
          <span>状态</span>
          <div>
            <a-tag color="orangered" v-if="info.status === 200">审核中</a-tag>
            <a-tag color="green" v-if="info.status === 201">已上架</a-tag>
            <a-tag color="red" v-if="info.status === 202">已删除</a-tag>
            <a-tag color="red" v-if="info.status === 203">已下架</a-tag>
          </div>
        </div>
        <div class="line" v-if="info.status === 203 || info.status === 202">
          <span>不通过原因</span>
          <span>{{ info.remark }}</span>
        </div>
        <div class="line">
          <span>描述</span>
          <div class="columns">
            <div style="padding-bottom: 8px;">{{ info.describe }}</div>
            <a-image width="120" :src="info.images" />
          </div>
        </div>
      </div>
      <!-- <div class="title" style="padding-top: 20px;">基础信息</div>
      <div>
        <a-row class="grid-demo" :gutter="24">
          <a-col :span="8">
            <div class="basic">
              <span>浏览量：</span>
              <span>33</span>
            </div>
          </a-col>
          <a-col :span="8">
            <div class="basic">
              <span>点赞量：</span>
              <span>33</span>
            </div>
          </a-col>
          <a-col :span="8">
            <div class="basic">
              <span>分享量：</span>
              <span>33</span>
            </div>
          </a-col>
        </a-row>
      </div> -->
    </div>
    <div class="card">
      <div class="title">
        <span>评论列表</span>
        <icon-refresh class='refresh' @click="search()"/>
      </div>
      <a-table :columns="columns" :data="data.list" style="width: 100%" :loading="loading" :pagination='pagination'>
      <template #status="{ record }">
        <a-tag v-if="record.status == 1" color="red">已下架</a-tag>
        <a-tag v-if="record.status == 0" color="blue">已上架</a-tag>
      </template>
      <template #optional="{ record, rowIndex }">
        <a-space>
          <!-- <a-popconfirm content="是否删除?" @ok="doDelete(record, rowIndex)">
            <a-button type="primary" status="danger" size="mini">删除</a-button>
          </a-popconfirm> -->
          <a-popconfirm content="是否删除?" v-if="record.status == 1" @ok="doPinUp(record, rowIndex)">
            <a-button type="primary" status="normal" size="mini">上架</a-button>
          </a-popconfirm>
          <a-popconfirm content="是否删除?" v-if="record.status == 0" @ok="doPinDown(record, rowIndex)">
            <a-button type="primary" status="danger" size="mini">下架</a-button>
          </a-popconfirm>
        </a-space>
      </template>
    </a-table>

    </div> 
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

<script setup lang="ts">
import PageCard from '@/components/page-card/index.vue';
import { onMounted, reactive, ref } from 'vue';
import { Message, Modal } from '@arco-design/web-vue';
import store2 from 'store2'
import { getList,commentList, onlineUp, onlineDown, audit, commentRemove, commentDown, commentUp } from '@/api/activity';
import { status } from 'nprogress';

const info = ref({
  id: '',
  title: '',
  address: '',
  createTime: '',
  status: 200,
  remark: '',
  images: '',
  describe: ''
})
const optionIndex = ref(-1)
onMounted(() => {
  info.value = store2.get('noveltyInfo')
  console.log(info.value, 12)
})
// 审批
const isExamine = ref(false)
const examineText = ref('')
const isExamineError = ref(false)
const examineStatus = ref('1')
const doExamine = async () => {
  if (examineStatus.value === '2' && !examineText.value) {
    isExamineError.value = true;
    return false
  }
  Message.loading('加载中...')
  const res = await audit({
    id: info.value.id,
    status: examineStatus.value,
    remark: examineStatus.value === '1' ? "" : examineText.value
  })
  Message.clear()
  if (res?.code != 0) {
    Message.error(res?.msg);
    return;
  }
  info.value.status = examineStatus.value === '1' ? 201 : 203
  Message.success(examineStatus.value === '1' ? "审核通过" : '拒绝通过');
  return true;
}

// 下架
const doDown = async () => {
  Modal.confirm({
    titleAlign: 'start',
    title: '下架',
    content: '是否确认下架，上架后小程序将无法查看',
    okText: '确定',
    cancelText: '取消',
    async onOk() {
      try {
        Message.loading('加载中...')
        onlineDown({ id: info.value.id }).then(res => {
          Message.clear()
          if (res.code === 0) {
            info.value.status = 203
            Message.success('下架成功')
          } else {
            Message.error('下架失败')
          }
        })
      } catch (error) {
        Message.clear()
        Message.error(JSON.stringify(error) || '接口异常')
      }
    },
    async onCancel() {

    }
  });
}


const loading = ref(false)
const columns = [
  { title: 'ID', dataIndex: 'id' },
  { title: '评论内容', dataIndex: 'content' },
  { title: '点赞数', dataIndex: 'numberUp' },
  { title: '用户昵称', dataIndex: 'nickname' },
  { title: '创建时间', dataIndex: 'createTime' },
  { title: '状态', dataIndex: 'status', slotName: 'status' },
  { title: '操作', slotName: 'optional', width: 100 },
];
onMounted(() => {
  search()
})
const formModel = reactive({
  pageNum: 1,
  pageSize: 10,
});
const data = reactive({
  list: []
});
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
const search = async () => {
  loading.value = true
  const params = {
    pageNum: formModel.pageNum,
    pageSize: formModel.pageSize,
    activityId: info.value.id
  }
  try {
    let res:any = await commentList(params)
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
const doLookPin = (record, index) => {

}
const doDelete = (record, index)=> {
  commentRemove({ id: record.id }).then(res => {
      Message.clear()
      if (res.code === 0) {
        info.value.status = 203
        Message.success('删除成功')
        search()
      } else {
        Message.error('删除失败')
      }
    })
}
const doPinUp = (record, index)=> {
  commentUp({ 
    id: record.id,
    status: 0
  }).then((res:any)=> {
    if (res.code === 0) {
        data.list[index].status = 0
        Message.success('上架成功')
        search()
      } else {
        Message.error('上架失败')
      }
   })
}
const doPinDown = (record, index)=> {
  commentDown({ 
    id: record.id,
    status: 1
   }).then((res:any)=> {
    if (res.code === 0) {
        data.list[index].status = 1
        Message.success('下架成功')
        search()
      } else {
        Message.error('下架失败')
      }
   })
}
</script>

<style lang="scss" scoped>
.card {
  background-color: var(--color-bg-2);
  border-radius: .25rem;
  padding: 1.5rem;
  width: 100%;
  box-sizing: border-box;
  margin-bottom: 1rem;
  position: relative;
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

.title {
  font-size: 20px;
  font-weight: 500;
  padding-bottom: 10px;
  display: flex;
  gap: 8px;
  .refresh {
    position: relative;
    top: 2px;
    cursor: pointer;
    color: #999;
  }
}

.basic {
  text-align: center;
  padding: 10px 0 40px 0;

  >span:first-child {
    color: #777;
  }
}

.option {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
}
</style>