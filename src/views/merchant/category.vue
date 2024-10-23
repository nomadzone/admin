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
                    <template #img="{ record }">
                        <img :src="record.url" alt="" style="width: 50px; height: 50px;" />
                    </template>
                    <template #action="{ record }">
                        <a-button type="text" @click="handleEdit(record)">{{ $t("button.edit") }}</a-button>
                        <a-popconfirm :content="$t('merchant.category.deleteTips')">
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
                    <a-form-item field="name" :label="$t('merchant.category.name')">
                        <a-input v-model="formInfo.dictName" />
                    </a-form-item>
                    <a-form-item field="value" :label="$t('merchant.category.value')">
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
import { merchantCategoryList } from '@/api/merchant'

const { t } = useI18n();
const router = useRouter();

const columns = [
    {
        title: t('merchant.category.id'),
        dataIndex: 'id',
        key: 'id',
        ellipsis: true,
    },
    {
        title: t('merchant.category.name'),
        dataIndex: 'categoryName',
        key: 'categoryName',
        ellipsis: true,
    },
    {
        title: t('merchant.category.img'),
        dataIndex: 'img',
        key: 'img',
        slotName: 'img',
        ellipsis: true,
    },
    {
        title: t('merchant.category.shopNum'),
        dataIndex: 'value',
        key: 'value',
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
const pageSize = ref(20)
const currentPage = ref(1)
const total = ref(0)
// 查询品类列表
const fetchData = async (page, size) => {
    let params = {
        pageNum: page || currentPage.value,
        pageSize: size || pageSize.value
    }
    const res = await merchantCategoryList(params)
    data.value = res.rows
    total.value = res.total
}

const visible = ref(false)
const title = ref('')

// 点击添加
const handleAddDict = () => {
    visible.value = true
    title.value = t('merchant.category.add')
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
    title.value = t('merchant.category.edit')

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

onMounted(() => {
    fetchData(1, pageSize.value)
})
</script>

<style lang="scss" scoped></style>