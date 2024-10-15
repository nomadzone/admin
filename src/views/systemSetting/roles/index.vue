<template>

<div class="common-page-container">
        <div class="common-panel">
            <div class="common-query-form-container">
                <div class="form-item-group">
                    <a-form :model="form" layout="inline" :label-col-props="{ span: 6, offset: 0 }"
                        :wrapper-col-props="{ span: 18, offset: 0 }">
                        <a-grid :cols="1">
                            <a-grid-item class="demo-item">
                                <a-form-item field="userName" :label="$t('systemSetting.roles.roleName')">
                                    <a-input v-model="form.userName" />
                                </a-form-item>
                            </a-grid-item>
                        </a-grid>
                    </a-form>
                </div>

                <a-divider class="query-form-divider" direction="vertical" />
                <div class="query-actions">
                    <a-button type="primary">
                        <template #icon>
                            <icon-search />
                        </template>
                        {{ $t("button.search") }}
                    </a-button>
                    <a-button type="outline">
                        <template #icon>
                            <icon-refresh />

                        </template>
                        {{ $t("button.reset") }}

                    </a-button>
                </div>


            </div>
            <a-divider />

            <div class="common-table-container">
                <div class="table-header">
                    <a-button type="primary" @click="handleAddRole()"> <template #icon>
                            <icon-plus />
                        </template>{{ $t("button.add") }}</a-button>
                </div>
                <a-table :columns="columns" :bordered="{ cell: true }" :data="data">
                    <template #action="{ record }">
                        <a-button type="text" @click="handleChangeStatus(record)">{{ $t("account.enable") }}</a-button>
                        <a-button type="text" @click="handleEdit(record)">{{ $t("button.edit") }}</a-button>
                        <a-button type="text" @click="handleDelete(record)">{{ $t("button.delete") }}</a-button>
                    </template>
                </a-table>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
import { useRouter } from 'vue-router'

const router = useRouter()
const form = ref({
    userName: '',
    roles: '',
    status: ''
})

const queryFormItemLayout = {
    xs: 24,
    sm: 12,
    md: 8,
    lg: 6
}

const columns = [
    {
        title: t('account.id'),
        dataIndex: 'id',
        key: 'id'
    },
    {
        title: t('systemSetting.roles.roleName'),
        dataIndex: 'roleName',
        key: 'roleName'
    },
    {
        title: t('systemSetting.roles.desc'),
        dataIndex: 'status',
        key: 'status'
    },
    {
        title: t('table.createTime'),
        dataIndex: 'createTime',
        key: 'createTime'
    },
    {
        title: t('account.status'),
        dataIndex: 'status',
        key: 'status'
    },
    {
        title: t('table.operation'),
        key: 'action',
        slots: { customRender: 'action' }
    }
]

const data = ref([])

/**
 * 修改状态
 */
const handleChangeStatus = (record: any) => {
    console.log('handleChangeStatus', record)
}

/**
 * 编辑
 */

const handleEdit = (record: any) => {
    console.log('handleEdit', record)
}

/**
 * 删除
 */

const handleDelete = (record: any) => {
    console.log('handleDelete', record)
}

/**
 * 添加角色
 */
const handleAddRole = () => {
    router.push('rolesSave');

}
</script>

<style lang="scss" scoped></style>