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
                    <a-input v-model="formModel.requirement" placeholder="请输需求描述" />
                  </a-form-item>
                  <a-form-item field="number" label="用户昵称">
                    <a-input v-model="formModel.nickName" placeholder="请输用户昵称" />
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
            <a-link type="primary" @click="optionIndex = rowIndex; isLook = true" size="mini">查看</a-link>
            <a-link status="danger" @click="optionIndex = rowIndex; isInject = true" size="mini">不通过</a-link>
            <a-link status="success" @click="doAgree(record, rowIndex)" size="mini">通过</a-link>
            <a-link type="primary" @click="doUp(record, rowIndex)" size="mini">上线</a-link>
            <a-link type="primary" @click="doDown(record, rowIndex)" size="mini">下线</a-link>
          </a-space>
        </template>
        <template #comboStatus="{ record }">
          <a-tag v-if="record.comboStatus == '0'" color="orange">已上线</a-tag>
          <a-tag v-if="record.comboStatus == '1'" color="blue">已下线</a-tag>
          <a-tag v-if="record.comboStatus == '2'" color="green">待审批</a-tag>
          <a-tag v-if="record.comboStatus == '3'" color="red">不通过</a-tag>
        </template>
      </a-table>
      <!-- 查看详情 -->
      <a-modal v-model:visible="isLook" width="600px">
        <template #title>找搭子详情</template>
        <div>
            <div class="line">
              <span>需求描述</span>
              <span>描述文本描述文本描述文本描述文本描述文本描述文本描述文本描述文本描述文本描述文本</span>
            </div>
            <div class="line">
              <span>面基地点</span>
              <span>描述文本描述文本描述文本描述文本描述文本描述文本描述文本描述文本描述文本描述文本</span>
            </div>
            <div class="line">
              <span>期望时间</span>
              <span>描述文本描述文本描述文本描述文本描述文本描述文本描述文本描述文本描述文本描述文本</span>
            </div>
            <div class="line">
              <span>状态</span>
              <div>
                <a-tag color="green">已上线</a-tag>
                <a-tag color="orangered">待审核</a-tag>
                <a-tag color="gold">已下线</a-tag>
                <a-tag color="red">不通过</a-tag>
              </div>
            </div>
            <div class="line">
              <span>不通过原因</span>
              <span>描述文本描述文本描述文本描述文本描述文本描述文本描述文本描述文本描述文本描述文本</span>
            </div>
            <div class="line">
              <span>联系方式</span>
              <div class="columns">
                <div>13423829881</div>
                <a-image
                  width="120"
                  src="https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/a8c8cdb109cb051163646151a4a5083b.png~tplv-uwbnlip3yd-webp.webp"
                />
              </div>
            </div>
        </div>
      </a-modal>
  
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
  import { ref, reactive, onMounted } from 'vue';
  import { Message, Modal } from '@arco-design/web-vue';
  import { findPartnerList } from '@/api/findPartner';
  
  const buttonType = ref('0')
  const optionIndex = ref(-1)
  
  onMounted(() => {
    search()
  })
  const formModel = reactive({
    pageNum: 1,
    pageSize: 10,
    requirement: '',
    nickName: '',
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
    { title: 'ID', dataIndex: 'id' },
    { title: '需求描述', dataIndex: 'requirement' },
    { title: '期望时间', dataIndex: 'startTime' },
    {
      title: '状态',
      dataIndex: 'comboStatus',
      slotName: 'comboStatus' // 使用 slot 来渲染状态列
    },
    { title: '面基地点', dataIndex: 'address' },
    { title: '用户昵称', dataIndex: 'nickName' },
    { title: '创建时间', dataIndex: 'startTime' },
    { title: '操作', slotName: 'optional', width: 260 },
  ];
  const data = reactive({
    list: [1]
  });
  const reset = ()=> {
    formModel.pageNum = 1;
    formModel.pageSize = 0;
    formModel.requirement = '';
    formModel.nickName = '';
    formModel.status = '';
    formModel.payDate = '';
    search()
  }
  const search = async () => {
    loading.value = true
    try {
      let res = await findPartnerList({
        pageNum: formModel.pageNum,
        pageSize: formModel.pageSize,
        requirement: formModel.requirement,
        nickName: formModel.nickName,
        status: formModel.status
      })
      loading.value = false
      if (res?.code !== 200) {
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
  
  const isLook = ref(false)
  const doLook = () => {
    isLook.value = true;
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
      title: '通过',
      content: '是否确认通过，通过后小程序即可查看',
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
      title: '上线',
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
      title: '下线',
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
.line {
  padding: 8px 0;
  display: flex;
  gap: 10px;
  > * {
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