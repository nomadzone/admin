<template>
    <div style="padding-top: 48px;">
        <div class="tag">
            <div v-for="(item, index) in tags.list" :key="index">
                <span @click="doTag(index)" :class="[index === tagIndex ? 'active' : '']">{{ item.name }}</span>
            </div>
        </div>
        <a-table size="small" :columns="columns" :data="formModel.list" style="width: 100%" :loading="loading"
            :pagination='pagination'>

            <template #status="{ record }">
                {{ options.find(item => item.value === record.status)?.label }}
            </template>
            <template #optional="{ record, rowIndex }">
                <a-button style="margin-right: 5px;" @click="handleToInfo(record, rowIndex)" size="mini"><template
                        #icon>
                        <icon-find-replace />
                    </template>查看详情</a-button>
                <a-button style="margin-right: 5px;" type="primary" size="mini" v-if="record.status === 100"
                    @click="handleStatus(record, rowIndex)"><template #icon>
                        <icon-check-square />
                    </template>审核</a-button>
                <a-popconfirm @ok="downOk(record, rowIndex)"
                    v-if="record.status === 100 || record.status === 101 || record.status === 102 || record.status === 103 || record.status === 104 || record.status === 104"
                    content="确认下架吗？">
                    <a-button type="primary" status="danger" size="mini"><template #icon>
                            <icon-eye-invisible />
                        </template>下架</a-button>
                </a-popconfirm>
                <a-popconfirm @ok="onOk(record, rowIndex)" v-if="record.status === 105" content="确认上架吗？">
                    <a-button type="primary" size="mini">
                        <template #icon>
                            <icon-eye />
                        </template>
                        上架</a-button>
                </a-popconfirm>
            </template>
        </a-table>

        <ActionForm ref="actionformRef"></ActionForm>
        <Detail ref="detailRef" @revesh="togetList"></Detail>
        <Info ref="infoRef"></Info>

    </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { Message } from '@arco-design/web-vue'
import { getList, onlineUp, onlineDown } from '@/api/activity';
import Detail from '../../activity/detail.vue'
import Info from '../../activity/info.vue'
import ActionForm from '../../activity/form.vue'
const tags = reactive({
    list: [
        { id: 1, name: '已发起' },
        { id: 0, name: '已参与' },
    ]
})

const actionformRef = ref()
const detailRef = ref()
const infoRef = ref()
const tagIndex = ref(0)
const doTag = (index) => {
    tagIndex.value = index
    search()
}
let userId = ref('')

const columns = [
    { title: '活动名称', dataIndex: 'title' },
    { title: '类型', dataIndex: 'phone' },
    {
        title: '活动时间',
        dataIndex: 'startdate',
        slotName: 'startdate',
    },
    {
        title: '状态',
        dataIndex: 'status',
        slotName: 'status',
        width: 100
    },
    {
        title: '报名人数',
        dataIndex: 'signUpNumber',
    },
    {
        title: '人均收费',
        dataIndex: 'price',
    },
    {
        title: '发起人昵称',
        dataIndex: 'nickname',
    },
    { title: '创建时间', width: 170, dataIndex: 'createTime' },
    { title: '操作', slotName: 'optional', width: 200 },
];
const options = ref([
    { value: 100, label: '发布中(审核中)' },
    { value: 101, label: '已发布(报名中)' },
    { value: 102, label: '活动中' },
    { value: 103, label: '已满员' },
    { value: 104, label: '已结束' },
    { value: 105, label: '已下架' },
    { value: 106, label: '已删除' },
    { value: 107, label: '未通过' }
]);
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
onMounted(() => {
    const userListInfo = JSON.parse(localStorage.getItem('userListInfo'))
    userId.value = userListInfo ? userListInfo?.id : ''
    search()
})
const search = async () => {
    loading.value = true
    const params:any = {
        pageNum: formModel.pageNum,
        pageSize: formModel.pageSize,
        type: '1',
        userId: userId.value
    }
    if (tagIndex.value === 1) {
        params.typeUserEd = '1'
    }
    try {
        let res: any = await getList(params)
        loading.value = false
        if (res?.code == 0) {
            pagination.value.total = res.total;
            formModel.list = res.rows
        } else {
            Message.error(res?.msg || res?.code?.toString() || '接口异常')
        }
    } catch (error) {
        loading.value = false
        Message.error('接口异常')
    }
}


// 获取列表数据
function togetList() {
    search()
}
function downOk(record, index) {
    loading.value = true
    onlineDown({ id: record.id }).then(res => {
        loading.value = false
        if (res.code === 0) {
            Message.success('下架成功')
            formModel.list[index].status = 105
        } else {
            Message.error('下架失败')
        }
    }).catch(error => {
        loading.value = false
    })
}
function onOk(record, index) {
    loading.value = true
    onlineUp({ id: record.id }).then(res => {
        loading.value = false
        if (res.code === 0) {
            Message.success('上架成功')
            formModel.list[index].status = 101
        } else {
            Message.error('上架失败')
        }
    }).catch(error => {
        loading.value = false
    })
}
function handleStatus(record, index) {
    detailRef.value.openDialog(record)
}
function handleToInfo(record, index) {
    infoRef.value.openDialog(record)
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