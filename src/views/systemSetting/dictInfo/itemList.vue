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
                <a-table :columns="columns" :bordered="{ cell: true }" :data="data">
                    <template #action="{ record }">
                        <a-button type="text" @click="handleEdit(record)">{{ $t("button.edit") }}</a-button>
                        <a-popconfirm :content="$t('systemSetting.dict.deleteTips')" @ok="handleDelete(record)">
                            <a-button type="text">{{ $t("button.delete") }}</a-button>
                        </a-popconfirm>
                    </template>
                </a-table>
            </div>
        </div>

        <a-modal v-model:visible="visible" @ok="handleOk" @cancel="handleCancel">
            <template #title>
                {{ title }}
            </template>
            <div>
                <a-form :model="formInfo" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
                    <a-form-item field="dictLabel" :label="$t('systemSetting.dict.name')">
                        <a-input v-model="formInfo.dictLabel" />
                    </a-form-item>
                    <a-form-item field="dictValue" :label="$t('systemSetting.dict.value')">
                        <a-input v-model="formInfo.dictValue" />
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
import { dictItem, dictItemAdd, dictItemUpdate, dictItemDelete } from '@/api/system'
import { Message } from '@arco-design/web-vue';

const { t } = useI18n();



const router = useRouter();
const columns = [
    {
        title: t('systemSetting.dict.itemName'),
        dataIndex: 'dictLabel',
        key: 'dictLabel',
        ellipsis: true,
    },
    {
        title: t('systemSetting.dict.itemValue'),
        dataIndex: 'dictValue',
        key: 'dictValue',
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

// 点击添加
const handleAddDict = () => {
    formInfo.value = {
        dictLabel: '',
        dictValue: '',
        dictType: router.currentRoute.value.query.dictType,
    }
    visible.value = true
    title.value = t('systemSetting.dict.add')
}

// 点击查看
const handleDetail = (record) => {
    console.log('handleDetail', record)
}

const chooenRecord = ref({})

const formInfo = ref({
    dictLabel: '',
    dictValue: '',
    dictType: router.currentRoute.value.query.dictType,
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
        id: record.dictCode
    }
    dictItemDelete(params).then((res) => {
        if (res.code === 0) {
            Message.success(t('common.deleteSuccess'))
            fetchList()
        }
    })
}


// 点击确定
const handleOk = () => {
    if (formInfo.value.dictCode) {
        // 编辑
        dictItemUpdate(formInfo.value).then((res) => {
            if (res.code === 0) {
                Message.success(t('common.editSuccess'))
                visible.value = false
                fetchList()
            }
        })
    } else {
        // 新增
        dictItemAdd(formInfo.value).then((res) => {
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


const fetchList = async (page, size) => {
    let params = {
        dictType: router.currentRoute.value.query.dictType,
        pageSize: size || pageSize.value,
        pageNum: page || pageNum.value

    }
    let res = await dictItem(params)

    if (res.code == 0) {
        data.value = res.rows
        total.value = res.total
    }

}

onMounted(() => {
    fetchList()
})
</script>

<style lang="scss" scoped></style>