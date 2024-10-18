<template>
  <PageCard :pageTitle="false" isTransparent>
    <div class="card">
      <div class="title">基本嘻嘻</div>
      <a-row class="grid-demo" :gutter="24">
        <a-col :span="1">
        </a-col>
        <a-col :span="8">
          <div class="line">
            <span>套餐id</span>
            <span>344543 </span>
          </div>
          <div class="line">
            <span>套餐名称</span>
            <span>套餐名套餐名套餐名套餐名套餐名</span>
          </div>
        </a-col>
        <a-col :span="8">
          <div class="line">
            <span>创建时间</span>
            <span>2020-11-11 16:22:22</span>
          </div>
          <div class="line">
            <span>状态</span>
            <span>
              <a-tag color="green">已上线</a-tag>
              <a-tag color="orangered">待审核</a-tag>
              <a-tag color="gold">已下线</a-tag>
              <a-tag color="red">不通过</a-tag>
              <span>不通过原因</span>
            </span>
          </div>
        </a-col>
        <a-col :span="7" style="display: flex;flex-direction: row-reverse;padding-right: 50px;">
          <div>
            <a-button type="primary" @click="isInject = true">不通过商家</a-button>
            <a-button type="primary" @click="doAgree" >通过商家</a-button>
              <a-button type="primary" @click="doUp" >上线商家</a-button> 
              <a-button type="primary" @click="doDown">下线商家</a-button>
          </div>
        </a-col>
      </a-row>
    </div>
    <div class="card">
      <div class="title">套餐信息</div>
      <a-row class="grid-demo" :gutter="24">
        <a-col :span="1">
        </a-col>
        <a-col :span="22">
          <div class="line">
            <span>适用人数</span>
            <span>-</span>
          </div>
          <div class="line">
            <span>套餐内容</span>
            <div>
              <div class="table" v-for="(items, index) in groupedPackageContent" :key="index" v-if="groupedPackageContent.length > 0">
                <div class="name">
                  <h4>{{ items.name }}</h4>
                </div>
                <a-table :pagination="false" :columns="columns" :data="items.shopComboClassifyList" style="width: 500px" :show-header="false">
                </a-table>
              </div>
            </div>
          </div>
          <div class="line">
            <span>门店价</span>
            <span>22</span>
          </div>
          <div class="line">
            <span>团购价</span>
            <span>22</span>
          </div>
          <div class="line">
            <span>有效期</span>
            <span>2020.11.11 - 2024.01.01</span>
          </div>
          <div class="line">
            <span>不可用日期</span>
            <span>周日；法定节假日不可用</span>
          </div>
          <div class="line">
            <span>使用时间</span>
            <span>10:00:00-22:00:00</span>
          </div>
          <div class="line">
            <span>宣传图</span>
            <span>
              <a-image
                width="120"
                src="https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/a8c8cdb109cb051163646151a4a5083b.png~tplv-uwbnlip3yd-webp.webp"
              />
            </span>
          </div>
          <div class="line">
            <span>套餐详情</span>
            <div>
            </div>
          </div>
        </a-col>
      </a-row>
    </div>

    <!-- 不通过 -->
    <a-modal v-model:visible="isInject" :on-before-ok="doInject" @cancel="isInject = false" unmountOnClose>
      <template #title>审核不通过</template>
      <div class="ineject">
        <div :class="[!injectText && isInjectError ? 'error' : '']"><span class="required">*</span>请输入不通过原因</div>
        <a-input :style="{ width: '320px' }" placeholder="请输入不通过原因" type="text" v-model="injectText" required
          allow-clear />
      </div>
    </a-modal>
  </PageCard>
</template>

<script setup lang="ts">
import { comboChangeStatus } from '@/api/combo';
import { orderCancel } from '@/api/order';
import PageCard from '@/components/page-card/index.vue';
import { Message, Modal } from '@arco-design/web-vue';
import { computed, reactive, ref } from 'vue';
const loading = ref(false)
const item = reactive({})

const columns = [
  { title: '套餐名称', dataIndex: 'name', key: 'name' },
  { title: '价格', dataIndex: 'price', key: 'price' },
  { title: '数量', dataIndex: 'number', key: 'number' },
];
const groupedPackageContent = computed(() => {
  return [
    { name: 'dd', shopComboClassifyList: [{ name: '11', price: '11', number: '11' }] }
  ]
});

// 不通过
const isInject = ref(false)
const injectText = ref('')
const isInjectError = ref(false)
const doInject = async () => {
  if (!injectText.value) {
    isInjectError.value = true;
    return false
  }
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
  Message.success('不通过成功');
  return true;
}

// 通过
const doAgree = async () => {
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
const doUp = async () => {
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
const doDown = async () => {
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

<style lang="scss" scoped>
.card {
  background-color: var(--color-bg-2);
  border-radius: .25rem;
  padding: 1.5rem;
  width: 100%;
  box-sizing: border-box;
  margin-bottom: 1rem;

  >.title {
    font-size: 18px;
    font-weight: 500;
    padding-bottom: 24px;
  }
}

.line {
  padding: 8px 0;
  display: flex;
  gap: 10px;

  >span:first-child {
    color: #777;
    width: 80px;
    text-align: right;
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
.table {
  h4 {
    padding: 10px 16px;
    margin: 0;
  }

  .name {
    cursor: pointer;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #dcdee3;
    padding-right: 26px;

    &:hover {
      background-color: #d8d8d8;
    }
  }
}
</style>