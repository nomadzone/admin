<template>
    <div class="common-page-container">
        <div class="common-panel">
            <div class="common-query-form-container">
            </div>

            <div class="common-table-container">
                <div class="table-header">
                    <a-button type="primary" @click="handleAddDict()"> <template #icon>
                            <icon-plus />
                        </template>{{ $t("button.add") }}</a-button>
                </div>
                <div class="table-box">
                    <a-table :loading="tableLoading" :columns="columns" :bordered="{ cell: true }" :data="data"
                        :pagination="false" :scroll="{ y: '100%' }">
                        <template #action="{ record }">
                            <a-button type="text" @click="handleDetail(record)">{{ $t("button.detail") }}</a-button>
                            <a-button type="text" @click="handleEdit(record)">{{ $t("button.edit") }}</a-button>
                            <a-popconfirm :content="$t('systemSetting.dict.deleteTips')" @ok="handleDelete(record)">
                                <a-button type="text">{{ $t("button.delete") }}</a-button>
                            </a-popconfirm>
                        </template>
                    </a-table>
                </div>
                <div class="pagination-box">

                    <a-pagination :total="total" :current="pageNum" :page-size="pageSize" @change="handleChangePage"
                        @page-size-change="handleSizeChange" />

                </div>
            </div>
        </div>

        <a-modal v-model:visible="visible" @ok="handleOk" @cancel="handleCancel">
            <template #title>
                {{ title }}
            </template>
            <div>
                <a-form :model="formInfo" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
                    <a-form-item field="dictName" :label="$t('systemSetting.dict.name')">
                        <a-input v-model="formInfo.dictName" />
                    </a-form-item>
                    <a-form-item field="dictType" :label="$t('systemSetting.dict.value')">
                        <a-input v-model="formInfo.dictType" />
                    </a-form-item>
                </a-form>
            </div>
        </a-modal>
    </div>

</template>
<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { dictList, dictAdd, dictUpdate, dictDelete } from '@/api/system'
import { Message } from '@arco-design/web-vue';

const { t } = useI18n();
const router = useRouter();

const columns = [
    {
        title: t('systemSetting.dict.name'),
        dataIndex: 'dictName',
        key: 'dictName',
        ellipsis: true,
    },
    {
        title: t('systemSetting.dict.value'),
        dataIndex: 'dictType',
        key: 'dictType',
        ellipsis: true,
    },
    {
        title: t('table.createTime'),
        dataIndex: 'createTime',
        key: 'createTime',
        ellipsis: true,
    },
    {
        title: t('table.operation'),
        key: 'action',
        slotName: 'action',
        width: 220,
    },
]

const data = ref([])

const visible = ref(false)
const title = ref('')
const pageSize = ref(20)
const pageNum = ref(1)
const total = ref(0)
const tableLoading = ref(false)

const fetchList = async (page, size) => {
    tableLoading.value = true
    let params = {
        pageSize: size || pageSize.value,
        pageNum: page || pageNum.value
    }
    const res = await dictList(params)

    if (res && res.code === 0) {
        data.value = res.rows
        total.value = res.total
        tableLoading.value = false

    } else {
        Message.error(res.msg)
        tableLoading.value = false
    }
}
// 点击添加
const handleAddDict = () => {
    visible.value = true
    title.value = t('systemSetting.dict.add')
}

// 点击查看
const handleDetail = (record) => {
    router.push({ name: 'dictItemList', query: { dictType: record.dictType } });

}

const chooenRecord = ref({})

const formInfo = ref({
    dictName: '',
    dictType: '',
})

// 点击编辑
const handleEdit = (record) => {
    visible.value = true
    chooenRecord.value = record
    formInfo.value = { ...record }
    title.value = t('systemSetting.dict.edit')

}

// 点击删除

const handleDelete = (record) => {
    let params = {
        id: record.dictId
    }
    dictDelete(params).then((res) => {
        if (res.code === 0) {
            Message.success(t('common.deleteSuccess'))
            fetchList()
        }
    })
}


// 点击确定
const handleOk = () => {
    console.log('handleOk')

    if (formInfo.value.dictId) {
        // 编辑
        dictUpdate(formInfo.value).then((res) => {

            if (res.code === 0) {
                Message.success(t('common.editSuccess'))
                visible.value = false
                fetchList()
            }
        })
    } else {
        // 新增
        dictAdd(formInfo.value).then((res) => {
            if (res.code === 0) {
                Message.success(t('common.addSuccess'))
                visible.value = false
                fetchList()
            }
        })
    }
    visible.value = false
}

// 点击取消 
const handleCancel = () => {
    console.log('handleCancel')
    visible.value = false
}


const handleChangePage = (page) => {
    pageNum.value = page
    fetchList(page)
}

const handleSizeChange = (current, size) => {
    pageSize.value = size
    fetchList(1, size)
}
onMounted(() => {
    fetchList(1, 20)
})
</script>

<style lang="scss" scoped>
.table-box {
    height: calc(100vh - 250px);

    .arco-table {
        max-height: 100%;
    }
}

.pagination-box {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    margin: 10px 0px;
}
</style>