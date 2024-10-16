<template>
    <PageCard>
        <div class="refund-page">
            <a-steps :current="currentStep" class="current-step">
                <a-step v-for="(step, index) in steps" :key="index" :title="step.title"
                    :description="step.description"></a-step>
            </a-steps>

            <div v-if="currentStep === 1">
                <!-- Merchant processing step -->
                <a-result status="warning" title="商家拒绝退款申请" description="拒绝原因：商品不符合退货要求">
                    <div>
                        <p>如已拒绝本次退款申请，买家的退款申请后，需要您重新处理。</p>
                        <a-button type="primary" @click="handleAgreeRefund">同意退款</a-button>
                    </div>
                </a-result>
            </div>

            <div v-if="currentStep === 2">
                <!-- Refund completed step -->
                <a-result status="success" title="退款成功" description="退款金额 12.90元">
                    <div>
                        <p>退款到账时间，以第三方支付方式的实际到账时间为准。</p>
                    </div>
                </a-result>
                <a-table :columns="refundColumns" :data="refundData" />
            </div>

            <div v-if="currentStep === 3">
                <!-- Buyer's refund request step -->
                <a-result status="success" title="退货成功" description="退款金额 12.90元">
                    <div>
                        <p>退款到账时间，以第三方支付方式的实际到账时间为准。</p>
                    </div>
                </a-result>
                <a-table :columns="refundColumns" :data="refundData" />
            </div>
            
            <h3>订单信息</h3>
            <a-descriptions :column="2">
                <a-descriptions-item label="订单编号">{{ orderInfo.orderNumber }}</a-descriptions-item>
                <a-descriptions-item label="合计优惠">{{ orderInfo.discount }}</a-descriptions-item>
                <a-descriptions-item label="支付时间">{{ orderInfo.paymentTime }}</a-descriptions-item>
                <a-descriptions-item label="实收款">{{ orderInfo.actualAmount }}</a-descriptions-item>
                <a-descriptions-item label="买家">{{ orderInfo.buyer }}</a-descriptions-item>
                <a-descriptions-item label="套餐名称">{{ orderInfo.comboName }}</a-descriptions-item>
            </a-descriptions>

            <h3>维权信息</h3>
            <a-descriptions :column="2">
                <a-descriptions-item label="退款金额">{{ refundInfo.refundAmount }}</a-descriptions-item>
                <a-descriptions-item label="维权原因">{{ refundInfo.reason }}</a-descriptions-item>
                <a-descriptions-item label="说明">{{ refundInfo.description }}</a-descriptions-item>
            </a-descriptions>

        </div>
    </PageCard>
</template>

<script setup lang="ts">
import PageCard from '@/components/page-card/index.vue';
import { ref } from 'vue';
import { Result, Steps, Descriptions, Table, Button } from '@arco-design/web-vue';

const currentStep = ref(2); //  1: 商家处理, 2: 退款完成  3: 买家申请退款,

const steps = [
    { title: '买家申请退款', description: '2017-11-12 15:12:04' },
    { title: '商家处理', description: '2017-11-12 15:12:04' },
    { title: '退款完成', description: '2017-11-12 15:12:04' }
];

const refundColumns = [
    { title: '退款流水号', dataIndex: 'id' },
    { title: '订单号', dataIndex: 'orderId' },
    { title: '当前状态', dataIndex: 'status' },
    { title: '修改时间', dataIndex: 'modifiedTime' },
    { title: '退款方式', dataIndex: 'refundMethod' }
];

const refundData = [
    { id: '344322', orderId: '334445566543', status: '退款中', modifiedTime: '2021-02-28 10:30:50', refundMethod: '退款至微信' }
];

const orderInfo = {
    orderNumber: '334445566543',
    paymentTime: '2017-11-12 11:48:30 (微信支付)',
    buyer: '嗨嗨嗨，13632658090',
    discount: '0.00 元',
    actualAmount: '12.99 元',
    comboName: '套餐名称套餐名称套餐名称套餐名称'
};

const refundInfo = {
    refundAmount: '12.99 元',
    reason: '买多了买错了',
    description: '买多了买错了'
};

const handleAgreeRefund = () => {
    // 同意退款逻辑
    console.log('同意退款');
    currentStep.value += 1;
};
</script>

<style lang="scss" scoped>
.refund-page {
    padding: 20px;
    margin: 0 auto;
    width: 900px;
}

.arco-result {
    text-align: center;
}

.current-step {
    margin-bottom: 24px;
    width: 600px;
    margin: 0 auto;
    text-align: center;
}
</style>