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
                        <a-popconfirm :content="$t('systemSetting.systemCode.deleteTips')">
                            <a-button type="text" @click="handleDelete(record)">{{ $t("button.delete") }}</a-button>
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
                    <a-form-item field="systemCodeName" :label="$t('systemSetting.systemCode.name')">
                        <a-input v-model="formInfo.dictName" />
                    </a-form-item>
                    <a-form-item field="systemCodeValue" :label="$t('systemSetting.systemCode.value')">
                        <a-input v-model="formInfo.dictValue" />
                    </a-form-item>
                </a-form>
            </div>
        </a-modal>
    </div>

</template>
<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

const { t } = useI18n();
const router = useRouter();

const columns = [

    {
        title: t('systemSetting.systemCode.name'),
        dataIndex: 'systemCodeName',
        key: 'systemCodetName',
        ellipsis: true,
    },
    {
        title: t('systemSetting.systemCode.value'),
        dataIndex: 'systemCodeValue',
        key: 'systemCodeValue',
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
    visible.value = true
    title.value = t('systemSetting.systemCode.add')
}



const chooenRecord = ref({})

const formInfo = ref({
    dictName: '',
    dictValue: '',
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
}


// 点击确定
const handleOk = () => {
    console.log('handleOk')
    visible.value = false
}

// 点击取消 
const handleCancel = () => {
    console.log('handleCancel')
    visible.value = false
}
</script>

<style lang="scss" scoped></style>