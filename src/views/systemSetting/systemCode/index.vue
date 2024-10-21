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
                <a-table :loading="tableLoading" :columns="columns" :bordered="{ cell: true }" :data="data"
                    :scroll="{ y: '100%' }" :pagination="false">
                    <template #action="{ record }">
                        <a-button type="text" @click="handleEdit(record)">{{ $t("button.edit") }}</a-button>
                        <a-popconfirm :content="$t('systemSetting.systemCode.deleteTips')" @ok="handleDelete(record)">
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

        <a-modal v-model:visible="visible" @ok="handleOk" @cancel="handleCancel">
            <template #title>
                {{ title }}
            </template>
            <div>
                <a-form :model="formInfo" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
                    <a-form-item field="configName" :label="$t('systemSetting.systemCode.name')">
                        <a-input v-model="formInfo.configName" />
                    </a-form-item>
                    <a-form-item field="configKey" :label="$t('systemSetting.systemCode.key')">
                        <a-input v-model="formInfo.configKey" />
                    </a-form-item>
                    <a-form-item field="configValue" :label="$t('systemSetting.systemCode.value')">
                        <a-input v-model="formInfo.configValue" />
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
import { configList, configAdd, configUpdate, configDelete } from '@/api/system'
import { Message } from '@arco-design/web-vue';

const { t } = useI18n();
const router = useRouter();

const columns = [

    {
        title: t('systemSetting.systemCode.name'),
        dataIndex: 'configName',
        key: 'configName',
        ellipsis: true,
    },
    {
        title: t('systemSetting.systemCode.key'),
        dataIndex: 'configKey',
        key: 'configKey',
        ellipsis: true,
    },
    {
        title: t('systemSetting.systemCode.value'),
        dataIndex: 'configValue',
        key: 'configValue',
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

const data = ref([{}])

const visible = ref(false)
const title = ref('')

// 点击添加
const handleAddDict = () => {
    formInfo.value = {
        configName: '',
        configKey: '',
        configValue: '',
    }
    visible.value = true
    title.value = t('systemSetting.systemCode.add')
}



const chooenRecord = ref({})

const formInfo = ref({
    configName: '',
    configKey: '',
    configKey: '',
})

// 点击编辑
const handleEdit = (record) => {
    visible.value = true
    chooenRecord.value = record
    formInfo.value = { ...record }
    title.value = t('systemSetting.systemCode.edit')

}

// 点击删除

const handleDelete = (record) => {
    console.log('handleDelete', record)
    let params = {
        configId: record.configId
    }
    configDelete(params).then((res) => {
        if (res.code === 0) {
            Message.success(t('common.deleteSuccess'))
            fetchList()
        }
    })
}


// 点击确定
const handleOk = () => {

    if (formInfo.value.configId) {
        // 编辑
        configUpdate(formInfo.value).then((res) => {
            if (res.code === 0) {
                Message.success(t('common.editSuccess'))
                visible.value = false
                fetchList()
            }
        })
    } else {
        // 新增
        configAdd(formInfo.value).then((res) => {
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

// 获取列表
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
    const res = await configList(params)
    if (res && res.code === 0) {
        data.value = res.rows
        total.value = res.total
        tableLoading.value = false
    } else {
        Message.error(res.msg)
        tableLoading.value = false
    }
}


const handleChangePage = (page) => {
    pageNum.value = page
    fetchList(page)
}

const handleSizeChange = (size) => {
    pageSize.value = size
    fetchList(1, size)
}

onMounted(async () => {
    fetchList()
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