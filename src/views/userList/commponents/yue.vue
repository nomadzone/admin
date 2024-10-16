<template>
    <div style="padding-top: 48px;">
        <div class="tag">
            <div v-for="(item, index) in tags.list" :key="index">
                <span @click="doTag(index)" :class="[index === tagIndex ? 'active' : '']">{{ item.name }}</span>
            </div>
        </div>
        <a-table v-if="tagIndex === 0" size="small" :columns="columns" :data="formModel.list" style="width: 100%"
            :loading="loading" :pagination='pagination' />

        <a-table v-if="tagIndex === 1" size="small" :columns="columnsActive" :data="formModelActive.list" style="width: 100%"
            :loading="loadingActive" :pagination='paginationActive' />
    </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { orderUsedList } from '@/api/user'
import { Message } from '@arco-design/web-vue'
const tags = reactive({
    list: [
        { id: 0, name: '已参与' },
        { id: 1, name: '已发起' },
    ]
})
const tagIndex = ref(0)
const doTag = (index) => {
    tagIndex.value = index
}

// 套餐订单
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


// 活动订单
const columnsActive = [
    { title: '用户ID', dataIndex: 'appUserId' },
    { title: '用户昵称', dataIndex: 'appNikeName' },
    { title: '手机号码', dataIndex: 'phone' },
    { title: '消费次数', dataIndex: 'number' },
    { title: '消费金额', dataIndex: 'orderAmount' },
    { title: '最近消费时间', width: 170, dataIndex: 'payDate' },
];


const formModelActive = reactive({
    pageNum: 1,
    pageSize: 10,
    list: []
});
const paginationActive = ref({
    total: 0, // 数据总条数
    current: 1, // 当前页
    pageSize: 10, // 每页显示的条数
    showTotal: true, // 是否显示总条数
    onChange: (page) => {
        pagination.value.current = page; // 更新当前页
        formModelActive.pageNum = page; // 更新当前页
        search()
    }, // 页码改变时的回调函数
})
const loadingActive = ref(false)
onMounted(() => { searchActive() })
const searchActive = async () => {
    loading.value = true
    const params = {
        pageNum: formModelActive.pageNum,
        pageSize: formModelActive.pageSize,
        shopId: localStorage.getItem('shopId') || '',
        isUsed: '0'
    }
    try {
        let res: any = await orderUsedList(params)
        loadingActive.value = false
        if (res?.code == 200) {
            paginationActive.value.total = res.total;
            formModelActive.list = res.rows
        } else {
            Message.error(res?.msg || res?.code?.toString() || '接口异常')
        }
    } catch (error) {
        Message.error('接口异常')
    }
}
</script>

<style lang="scss" scoped>
.tag {
    display: flex;
    gap: 8px;
    color: #444;
    padding-bottom: 32px;

    span {
        padding: 6px 16px;
        border-radius: 20px;
        cursor: pointer;

        &:hover {
            background-color: #F2F3F5;
        }
    }

    .active {
        background-color: #F2F3F5;
        color: #165DFF;
    }

    box-sizing: border-box;
}
</style>