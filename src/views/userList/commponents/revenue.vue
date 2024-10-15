<template>
    <div style="padding-top: 48px;">
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
            :pagination='pagination' />
    </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { orderUsedList } from '@/api/user'
import { Message } from '@arco-design/web-vue'

const columns = [
    { title: '用户ID', dataIndex: 'appUserId' },
    { title: '用户昵称', dataIndex: 'appNikeName' },
    { title: '手机号码', dataIndex: 'phone' },
    { title: '消费次数', dataIndex: 'number' },
    { title: '消费金额', dataIndex: 'orderAmount' },
    { title: '最近消费时间', width: 170, dataIndex: 'payDate' },
];

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
onMounted(() => { search() })
const search = async () => {
    loading.value = true
    const params = {
        pageNum: formModel.pageNum,
        pageSize: formModel.pageSize,
        shopId: localStorage.getItem('shopId') || '',
        isUsed: '0'
    }
    try {
        let res: any = await orderUsedList(params)
        loading.value = false
        if (res?.code == 200) {
            pagination.value.total = res.total;
            formModel.list = res.rows
        } else {
            Message.error(res?.msg || res?.code?.toString() || '接口异常')
        }
    } catch (error) {
        Message.error('接口异常')
    }
}
</script>

<style lang="scss" scoped>
.row {
    display: flex;
    align-items: center;
    color: #333;
    gap: 12px;
    .big {
        font-size: 22px;
        color: #1b1b1b;
        font-weight: 600;
    }
    img {
        position: relative;
        top: 8px;
    }
}
</style>