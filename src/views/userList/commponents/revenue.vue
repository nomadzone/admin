<template>
    <div style="padding-top: 32px;">
        <div class="type">
            <a-button shape="round" v-if="type != '0'" @click="type = '0'; search()">活动套餐明细</a-button>
            <a-button shape="round" type="primary" v-if="type == '0'">活动套餐明细</a-button>
            <a-button shape="round" v-if="type != '1'" @click="type = '1'; searchMeal()">套餐收支明细</a-button>
            <a-button shape="round" type="primary"  v-if="type == '1'">套餐收支明细</a-button>
        </div>
        <a-row style="padding-left: 20px; padding-bottom:32px;">
            <a-col :span="10">
                <div class="row">
                    <div>
                        <img src="../../../assets/images/revenue-1.svg" alt="" srcset="">
                    </div>
                    <div>
                        <p>累计收入</p>
                        <div class="big">50000（其中服务费 300）</div>
                    </div>
                </div>
            </a-col>
            <a-col :span="7">
                <div class="row">
                    <div>
                        <img src="../../../assets/images/revenue-2.svg" alt="" srcset="">
                    </div>
                    <div>
                        <p>待结算</p>
                        <div class="big">20000</div>
                    </div>
                </div>
            </a-col>
            <a-col :span="7">
                <div class="row">
                    <div>
                        <img src="../../../assets/images/revenue-3.svg" alt="" srcset="">
                    </div>
                    <div>
                        <p>已结算</p>
                        <div class="big">29700</div>
                    </div>
                </div>
            </a-col>
        </a-row>
        <a-table size="small" :columns="columns" :data="formModel.list" style="width: 100%" :loading="loading"
            :pagination='pagination'>
            <template #payType="{ record, rowIndex }">
                <a-link v-if="record.payType == 1">收入</a-link>
                <a-link v-else status="danger">支出</a-link>
            </template>
            <template #status="{ record, rowIndex }">
                <a-tag color="blue">{{ statusText[record.status] }}</a-tag>
            </template>
        </a-table>
    </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { consumptionList } from '@/api/user'
import { Message } from '@arco-design/web-vue'
// 状态 0 处理成功 1 处理中 2 关闭  3 微信支付回调失败，4 退款中， 5 退款成功 6微信退款回调失败
// payType 类型 1收入 2 支出
const columns = [
    { title: '用户昵称', dataIndex: 'nickname' },
    { title: '手机号', dataIndex: 'phoneNumber' },
    { title: '支出/收入', dataIndex: 'payType', slotName: 'payType' },
    { title: '金额', dataIndex: 'amout' },
    { title: '状态', dataIndex: 'status', slotName: 'status' },
    { title: '描述', dataIndex: 'title' },
    { title: '结算时间',  dataIndex: 'payTime' },
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
        let res: any = await consumptionList(params)
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