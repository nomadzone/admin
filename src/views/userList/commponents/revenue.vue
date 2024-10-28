<template>
    <div style="padding-top: 32px;">
        <div class="type">
            <!-- <a-button shape="round" v-if="type != '0'" @click="type = '0'; search()">活动套餐明细</a-button> -->
            <a-button shape="round" type="primary" v-if="type == '0'">活动套餐明细</a-button>
            <!-- <a-button shape="round" v-if="type != '1'" @click="type = '1'; searchMeal()">套餐收支明细</a-button>
            <a-button shape="round" type="primary"  v-if="type == '1'">套餐收支明细</a-button> -->
        </div>
        <a-row style="padding-left: 20px; padding-bottom:32px;">
            <a-col :span="6">
                <div class="row">
                    <div>
                        <img src="../../../assets/images/revenue-1.svg" alt="" srcset="">
                    </div>
                    <div>
                        <p>累计收入</p>
                        <div class="big">{{ activeBobdy.incomeAmount }}</div>
                    </div>
                </div>
            </a-col>
            <a-col :span="6">
                <div class="row">
                    <div>
                        <img src="../../../assets/images/revenue-2.svg" alt="" srcset="">
                    </div>
                    <div>
                        <p>待结算</p>
                        <div class="big">{{ activeBobdy.settlementEdAmount }}</div>
                    </div>
                </div>
            </a-col>
            <a-col :span="6">
                <div class="row">
                    <div>
                        <img src="../../../assets/images/revenue-3.svg" alt="" srcset="">
                    </div>
                    <div>
                        <p>已结算</p>
                        <div class="big">{{ activeBobdy.settlementAmount }}</div>
                    </div>
                </div>
            </a-col>
            <a-col :span="6">
                <div class="row">
                    <div>
                        <img src="../../../assets/images/revenue-3.svg" alt="" srcset="">
                    </div>
                    <div>
                        <p>退款</p>
                        <div class="big">{{ activeBobdy.settlementAmount }}</div>
                    </div>
                </div>
            </a-col>
        </a-row>
        <a-table size="small" :columns="columns" :data="formModel.list" style="width: 100%" :loading="loading"
            :pagination='pagination'>
            <template #settlement="{ record, rowIndex }">
                <a-tag color='blue' v-if="record.settlement == 1">已结算</a-tag>
                <a-tag v-else color='red'>未结算</a-tag>
            </template>
        </a-table>
    </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { consumptionList, getAmountByUserId, orderList } from '@/api/user'
import { Message } from '@arco-design/web-vue'
import { shopSettlementTotal, shopSettlementList } from '@/api/merchant'
// 状态 0 处理成功 1 处理中 2 关闭  3 微信支付回调失败，4 退款中， 5 退款成功 6微信退款回调失败
// payType 类型 1收入 2 支出
const columns = [
    { title: 'id', dataIndex: 'id' },
    { title: '订单号', dataIndex: 'orderNo' },
    { title: '总金额', dataIndex: 'total' },
    { title: '服务费', dataIndex: 'serviceAmount' },
    { title: '结算金额', dataIndex: 'settlementAmount' },
    { title: '姓名', dataIndex: 'name' },
    { title: '是否结算', dataIndex: 'settlement', slotName: 'settlement' },
];

const statusText = {
    0: '处理成功',
    1: '处理中',
    2: '关闭',
    3: '微信支付回调失败',
    4: '退款中',
    5: '退款成功',
    6: '微信退款回调失败',
}

const formModel = reactive({
    pageNum: 1,
    pageSize: 10,
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
const loading = ref(false)
let userId = ref('')
const activeBobdy = ref({
    incomeAmount: 0, // 累计收入
    refundAmount: 0, // 退款金额
    settlementEdAmount: 0, // 待结算
    settlementAmount: 0, // 已结算
})
onMounted(() => { 
    const userListInfo = JSON.parse(localStorage.getItem('userListInfo'))
    userId.value = userListInfo ? userListInfo?.id : ''
    search()
 })
const search = async () => {
    loading.value = true
    const params = {
        pageNum: formModel.pageNum,
        pageSize: formModel.pageSize,
        userId: userId.value,
    }
    try {
        getAmountByUserId({ userId: userId.value }).then((res:any)=> {
            if (res?.code == 0) {
                activeBobdy.value.incomeAmount = res?.data?.incomeAmount
                activeBobdy.value.refundAmount = res?.data?.refundAmount
                activeBobdy.value.settlementEdAmount = res?.data?.settlementEdAmount
                activeBobdy.value.settlementAmount = res?.data?.settlementAmount
            }
        })
        let res: any = await orderList(params)
        loading.value = false
        if (res?.code == 0) {
            pagination.value.total = res.total;
            formModel.list = res.rows
        } else {
            Message.error(res?.msg || res?.code?.toString() || '接口异常')
        }
    } catch (error) {
        Message.error('接口异常')
    }
}


const type = ref('0')

const searchMeal = ()=> {
    
}
</script>

<style lang="scss" scoped>
.row {
    display: flex;
    align-items: center;
    color: var(--color-text-2);
    gap: 12px;
    .big {
        font-size: 22px;
        color: var(--color-text-1);
        font-weight: 600;
    }
    img {
        position: relative;
        top: 8px;
    }
}

.type {
    display: flex;
    gap: 8px;
    padding-bottom: 16px;
}
</style>