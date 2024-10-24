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
            <span>{{ info.value.id }}</span>
          </div>
          <div class="line">
            <span>套餐名称</span>
            <span>{{ info.value.comboName }}</span>
          </div>
        </a-col>
        <a-col :span="8">
          <div class="line">
            <span>创建时间</span>
            <span>{{ info.value.createTime }}</span>
          </div>
          <div class="line">
            <span>状态</span>
            <span>
              <a-tag v-if="info.value.comboStatus == '0'" color="blue">已上架</a-tag>
              <a-tag v-if="info.value.comboStatus == '1'" color="red">已下架</a-tag>
              <a-tag v-if="info.value.comboStatus == '2'" color="green">待审批</a-tag>
              <a-tag v-if="info.value.comboStatus == '3'" color="red">不通过</a-tag>
              <span style="padding-left: 10px;">{{ info.value.remark }}</span>
            </span>
          </div>
        </a-col>
        <a-col :span="7" style="display: flex;flex-direction: row-reverse;padding-right: 50px;">
          <div style="display: flex; gap: 10px">
            <a-popconfirm content="是否下架?" v-if="info.value.comboStatus == '0'" @ok="doDown">
              <a-button type="primary" status="warning"  >下架</a-button>
            </a-popconfirm>
            <a-popconfirm content="是否上架?" v-if="info.value.comboStatus == '1'" @ok="doUp">
              <a-button type="primary">上架</a-button>
            </a-popconfirm>
            <a-button type="primary" status="success" @click="doVerity" v-if="info.value.comboStatus == '2'">审核</a-button>
            <a-popconfirm content="是否删除?" @ok="doDelete">
              <a-button type="primary" status="danger">删除</a-button>
            </a-popconfirm>
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
            <span>{{ info.value.personNumber }}</span>
          </div>
          <div class="line">
            <span>套餐内容</span>
            <div>
              <div class="table" v-for="(items, index) in info.value.comboClassifyList" :key="index" v-if="info.value.comboClassifyList.length > 0">
                <div class="name">
                  <h4>{{ items.name }}</h4>
                </div>
                <a-table :pagination="false" :columns="columns" :data="items.shopComboClassifyList" style="width: 500px" >
                </a-table>
              </div>
            </div>
          </div>
          <div class="line">
            <span>门店价</span>
            <span>{{ info.value.shopPrice }}</span>
          </div>
          <div class="line">
            <span>团购价</span>
            <span>{{ info.value.comboPrice }}</span>
          </div>
          <div class="line">
            <span>有效期</span>
            <span>{{ info.value.validTimeStart }} - {{ info.value.validTimeEnd }}</span>
          </div>
          <div class="line" v-if="info.value.allDayStatus === 'true'">
            <span>不可用日期</span>
            <span>所有日期都可使用</span>
          </div>
          <div class="line" v-if="info.value.allDayStatus === 'false'">
            <span>不可用日期</span>
            <div>
              <span>部分日期不可使用</span>
              <div style="display: flex;gap: 8px; padding-top: 10px;">
                <span v-if="info.value.monday === 'true'">周一</span>
                <span v-if="info.value.tuesday === 'true'">周二</span>
                <span v-if="info.value.wednesday === 'true'">周三</span>
                <span v-if="info.value.thursday === 'true'">周四</span>
                <span v-if="info.value.friday === 'true'">周五</span>
                <span v-if="info.value.saturday === 'true'">周六</span>
                <span v-if="info.value.sunday === 'true'">周日</span>
              </div>
              <div  style="padding-top: 10px;" v-if="info.value.legalHolidayStatus === 'true'">
                法定节假日不可使用
              </div>
            </div>
          </div>
          <div class="line" v-if="info.value.allTimeStatus === 'true'">
            <span>使用时间</span>
            <span>24小时可使用</span>
          </div>
          <div class="line" v-if="info.value.allTimeStatus === 'false'">
            <span>使用时间</span>
            <span>{{ info.value.usedTimeStart }} - {{ info.value.usedTimeEnd }}</span>
          </div>
          <div class="line">
            <span>宣传图</span>
            <span>
              <a-image
                width="120"
                :src="info.value.comboPhotoUrl"
              />
            </span>
          </div>
          <div class="line">
            <span>套餐详情</span>
            <div v-html="info.value.comboRemark">
            </div>
          </div>
        </a-col>
      </a-row>
    </div>

    <!-- 不通过 -->
    <a-modal v-model:visible="isInject" :on-before-ok="doInject" @cancel="isInject = false" unmountOnClose>
      <template #title>审核</template>
      <div>
        <a-radio-group v-model="verifyStatus">
          <a-radio value="1">通过</a-radio>
          <a-radio value="3">不通过</a-radio>
        </a-radio-group>
      </div>
      <div class="ineject" v-if="verifyStatus == '3'">
        <div :class="[!injectText && isInjectError?'error':'']"><span class="required">*</span>请输入不通过原因</div>
        <a-input :style="{width:'320px'}" placeholder="请输入不通过原因" type="text" v-model="injectText" required allow-clear />
      </div>
    </a-modal>
  </PageCard>
</template>

<script setup lang="ts">
import { comboList, comboChangeStatus, comboDelete } from '@/api/combo';
import PageCard from '@/components/page-card/index.vue';
import { Message, Modal } from '@arco-design/web-vue';
import { computed, onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
const loading = ref(false)
const router = useRouter()

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
const info = reactive({
  value: {
    id: '',
    comboStatus: '',
    comboName: '',
    createTime: '',
    remark: '',
    personNumber: '',
    shopPrice: '',
    comboPrice: '',
    validTimeEnd: '',
    validTimeStart: '',
    allDayStatus: '',
    comboClassifyList: [],
    comboRemark: '',
    allTimeStatus: '',
    usedTimeEnd: '',
    usedTimeStart: '',
    comboPhotoUrl: '',
    legalHolidayStatus: '',
    monday: '',
    tuesday: '',
    wednesday: '',
    thursday: '',
    friday: '',
    saturday: '',
    sunday: '',
  }
})
onMounted(()=> {
  info.value = JSON.parse(localStorage.getItem('mealInfo'))
})

const isInject = ref(false)
const injectText = ref('')
const isInjectError = ref(false)
const verifyStatus = ref('1')
const doVerity = ()=> {
  isInject.value = true;
}
const doInject = async () => {
  if (verifyStatus.value == '3' && !injectText.value) {
    isInjectError.value = true;
    return false
  }
  const item = info.value
  loading.value = true
  const params:any = {
    id: item.id,
    comboStatus: verifyStatus.value.toString()
  }
  if (verifyStatus.value == '3') {
    params.rejectReason = injectText.value
  }
  try {
    const res = await comboChangeStatus(params)
    loading.value = false
    if (res?.code != 0) {
      Message.error(res?.msg);
      return false;
    }
    info.value.comboStatus = verifyStatus.value
    Message.success(verifyStatus.value == '1' ? '审批通过' : '审批不通过');
  } catch(error){
    loading.value = false
    return false;
  }
  return true;
}
// 下架
const doDown = async()=> {
    loading.value = true
    const res = await comboChangeStatus({
      id: info.value.id,
      comboStatus: '1'
    })
    loading.value = false
    if (res?.code != 0){
      Message.error(res?.msg);
      return;
    }
    info.value.comboStatus = '1'
    Message.success('下架成功');
  }

const doUp = async()=> {
  loading.value = true
  const res = await comboChangeStatus({
    id: info.value.id,
    comboStatus: '0'
  })
  loading.value = false
  if (res?.code != 0){
    Message.error(res?.msg);
    return;
  }
  info.value.comboStatus = '0'
  Message.success('上架成功');
}

const doDelete = async()=> {
    loading.value = true
    const res = await comboDelete(info.value.id)
    if (res?.code != 0){
      Message.error(res?.msg);
      return;
    }
    loading.value = false
    router.back()
    Message.success('删除成功');
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
    color: var(--color-text-3);
    width: 80px;
    text-align: right;
  }
}

.ineject {
  display: flex;
  align-items: center;
  gap: 10px;
  padding-top: 16px;

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
    background-color: var(--color-text-8);
    padding-right: 26px;

    &:hover {
      background-color: var(--color-text-8);
    }
  }
}
</style>