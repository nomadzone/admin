<template>
  <PageCard>
    <a-card class="general-card width-full">
      <a-row>
        <a-col :flex="1">
          <a-form :model="formModel" :label-col-props="{ span: 6 }" :wrapper-col-props="{ span: 18 }"
            label-align="right">
            <a-row :gutter="16">
              <a-col :span="12">
                <a-form-item field="number" label="订单号">
                  <a-input v-model="formModel.number" placeholder="请输入订单号" />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item field="name" label="验证时间">
                  <a-range-picker style="width: 360px; margin: 0 24px 24px 0;" show-time
                    :time-picker-props="{ defaultValue: ['00:00:00', '09:09:06'] }" format="YYYY-MM-DD HH:mm"
                    @change="onChangeTime" @select="onSelectTime" @ok="onOkTime" />
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
          </a-space>
        </a-col>
      </a-row>
    </a-card>
    <a-table :columns="columns" :data="data" style="width: 100%" @row-click="handleRowClick">
      <template #optional="{ record, index }">
        <a-space>
          <a-link @click="doInfo(record)">查看详情</a-link>
          <a-link @click="doAgree(record)" status="warning">同意</a-link>
          <a-link @click="doRefund(record)" status="danger">拒绝</a-link>
        </a-space>
      </template>
    </a-table>
    <consumptionVerify :type="modalType"></consumptionVerify>
  </PageCard>
</template>

<script setup>
import PageCard from '@/components/page-card/index.vue';
import consumptionVerify from '@/components/modal/consumption-verify.vue';
import { ref, reactive, watch } from 'vue';
import { useModalStore } from '../../store';
import { useRouter } from 'vue-router';

const formModel = ref({
  number: '',
  name: '',
});

const modalType = ref('agree')

const columns = [
  { title: '订单号', dataIndex: 'name1' },
  { title: '套餐名套餐名套餐名套餐名套餐名…', dataIndex: 'name2', width: 240, ellipsis: true },
  { title: '数量', dataIndex: 'name3' },
  { title: '订单金额', dataIndex: 'name4' },
  { title: '服务费', dataIndex: 'name5' },
  { title: '状态', dataIndex: 'name6' },
  { title: '下单号码', dataIndex: 'name7' },
  { title: '操作', slotName: 'optional', width: 220 },
];

const data = reactive([
  { key: '1', name1: '13444383', name2: '商家后台', name3: '张嬷嬷', name4: '涛涛套餐', name5: '13538239443', name6: '2022-10-10 10:10:10', name7: '122.00' },
  // Add more data here
]);



const search = () => { }
const onChangeTime = (value) => { }
const onSelectTime = (value) => { }
const onOkTime = (value) => { }

const router = useRouter()
const doInfo = () => {
  router.push({ name: 'orderRefundDetails', query: { id: 'xxx' } })
}
const modalStore = useModalStore()
const doAgree = () => {
  modalType.value = 'agree'
  modalStore.consumpitonVerifyVisible = true
}
const doRefund = () => {
  modalType.value = 'refund'
  modalStore.consumpitonVerifyVisible = true
}
watch(() => modalStore.consumpitonVerifySubmit, (newValue, oldValue) => {
  if (oldValue !== newValue && newValue) {
    if (modalType.value === 'agree') {
      alert('提交成功')
      modalStore.consumpitonVerifyVisible = false
    } else {
      alert('提交成功' + modalStore.consumpitonVerifyForm.value)
      modalStore.consumpitonVerifyVisible = false
    }
  }
})
</script>

<style scoped>
.width-full {
  width: 100%;
}

.xxl-btn {
  ::v-deep button {
    height: 60px !important;
    line-height: 60px !important;
    padding-left: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding-right: 50px;
    font-size: 18px;
  }

  ::v-deep .arco-input-wrapper {
    padding-left: 20px;

    input {
      font-size: 18px;
    }
  }
}

.general-card {
  ::v-deep .arco-card-body {
    padding-bottom: 0;
  }
}
</style>