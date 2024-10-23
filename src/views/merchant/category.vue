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
                <a-table :columns="columns" :bordered="{ cell: true }" :data="data" :pagination="false">
                    <template #img="{ record }">
                        <img :src="record.url" alt="" style="width: 50px; height: 50px;" />
                    </template>
                    <template #action="{ record }">
                        <div style="display: flex;">
                            <a-button type="text" @click="handleEdit(record)">{{ $t("button.edit") }}</a-button>
                            <a-popconfirm :content="$t('merchant.category.deleteTips')" @ok="handleDelete(record)">
                                <a-button type="text">{{ $t("button.delete") }}</a-button>
                            </a-popconfirm>
                        </div>

                    </template>
                </a-table>

                <div class="pagination-box">
                    <a-pagination :total="total" :current="pageNum" :pageSize="pageSize" @change="handleChangePage"
                        @change-page-size="handleChangePageSize" />
                </div>
            </div>
        </div>

        <a-modal v-model:visible="visible" @ok="handleOk" @cancel="handleCancel" unmountOnClose>
            <template #title>
                {{ title }}
            </template>
            <div>
                <a-form :model="formInfo" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
                    <a-form-item field="categoryName" :label="$t('merchant.category.name')">
                        <a-input v-model="formInfo.categoryName" />
                    </a-form-item>
                    <a-form-item field="url" :label="$t('merchant.category.img')">
                        <PicUpload :limit="1" @updateFileList="handleSetShowImages" :fileList="formInfo.url" />
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
import { merchantCategoryList, merchantCategoryEdit, merchantCategoryAdd, merchantCategoryDelete } from '@/api/merchant'
import PicUpload from '@/components/picUpload/index.vue'


const { t } = useI18n();
const router = useRouter();

const columns = [
    {
        title: t('merchant.category.id'),
        dataIndex: 'id',
        key: 'id',
        width: 360
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
        align: 'center',
        ellipsis: true,
    },
    {
        title: t('merchant.category.shopNum'),
        dataIndex: 'shopNumber',
        key: 'shopNumber',
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
        width: 140,
        align: 'center',
    },
]

const data = ref([])
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

// 分页
const handleChangePage = (page) => {
    currentPage.value = page
    fetchData(page)
}

// 分页大小
const handleChangePageSize = (size) => {
    pageSize.value = size
    fetchData(1, size)
}

const visible = ref(false)
const title = ref('')

// 点击添加
const handleAddDict = () => {
    formInfo.value = { categoryName: '', url: [] }

    title.value = t('merchant.category.add')
    visible.value = true

}



const chooenRecord = ref({})

const formInfo = ref({
    categoryName: '',
    url: '',
})

// 点击编辑
const handleEdit = (record) => {
    chooenRecord.value = record
    formInfo.value = { ...record, url: record.url && record.url != '' ? [record.url] : [] }
    console.log('formInfo', formInfo.value)
    title.value = t('merchant.category.edit')

    setTimeout(() => {
        visible.value = true
    }, 100)



}

// 点击删除

const handleDelete = (record) => {
    merchantCategoryDelete({ id: record.id }).then(res => {
        fetchData(1, pageSize.value)
    })
}


// 点击确定
const handleOk = () => {

    if (formInfo.value.id) {
        // 编辑
        let params = {
            ...formInfo.value,
            categoryName: formInfo.value.categoryName,
            url: formInfo.value.url[0]
        }

        merchantCategoryEdit(params).then(res => {
            fetchData(1, pageSize.value)
            visible.value = false

        })
    } else {
        // 新增

        let params = {
            categoryName: formInfo.value.categoryName,
            url: formInfo.value.url[0]
        }
        merchantCategoryAdd(params).then(res => {
            fetchData(1, pageSize.value)
            visible.value = false

        })
    }
}

// 点击取消 
const handleCancel = () => {
    console.log('handleCancel')
    visible.value = false
}

const handleSetShowImages = (data) => {
    formInfo.value.url = [data]
}
onMounted(() => {
    fetchData(1, pageSize.value)
})
</script>

<style lang="scss" scoped>
.pagination-box {
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
}
</style>