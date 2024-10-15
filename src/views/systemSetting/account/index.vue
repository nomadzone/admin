<template>
    <div class="common-page-container">
        <div class="common-panel">
            <div class="common-query-form-container">
                <div class="form-item-group">
                    <a-form :model="form" layout="inline" :label-col-props="{ span: 6, offset: 0 }"
                        :wrapper-col-props="{ span: 18, offset: 0 }">
                        <a-grid :cols="queryFormItemLayout">
                            <a-grid-item class="demo-item">
                                <a-form-item field="userName" :label="$t('account.username')">
                                    <a-input v-model="form.userName" />
                                </a-form-item>
                            </a-grid-item>
                            <a-grid-item class="demo-item">
                                <a-form-item field="roles" :label="$t('account.roles')">
                                    <a-select v-model="form.userName" />
                                </a-form-item>

                            </a-grid-item>
                            <a-grid-item class="demo-item">
                                <a-form-item field="status" :label="$t('account.status')">
                                    <a-select v-model="form.userName" />
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
                    <a-button type="primary" @click="handleAddAccount()"> <template #icon>
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
        <confirm-modal ref="confirmModal" @confirm="handleConfirm" />
    </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue';
import ConfirmModal from '@/components/confirm-modal/index.vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
const queryFormItemLayout = { xs: 1, sm: 2, md: 2, lg: 2, xl: 3, xxl: 3 }
const confirmModal = ref();
const { t } = useI18n();
const router = useRouter();

const form = ref({
    userName: '',
    roles: [],
    status: '',
})

const actionType = ref('')
const columns = [
    {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        ellipsis: true,
    },
    {
        title: '昵称',
        dataIndex: 'userName',
        key: 'userName',
        ellipsis: true,

    },
    {
        title: '手机号码',
        dataIndex: 'phone',
        key: 'phone',
        ellipsis: true,

    },
    {
        title: '所属角色',
        dataIndex: 'phone',
        key: 'phone',
        ellipsis: true,

    },
    {
        title: '最后登录时间',
        dataIndex: 'phone',
        key: 'phone',
        ellipsis: true,

    },
    {
        title: '创建时间',
        dataIndex: 'phone',
        key: 'phone',
        ellipsis: true,

    },
    {
        title: '状态',
        dataIndex: 'phone',
        key: 'phone',
        ellipsis: true,

    },
    {
        title: '操作',
        key: 'action',
        slotName: 'action',
        width: 220,
    },
];


const data = reactive([
    {
        id: 1,
        userName: '张三',
        phone: '13888888888',
        roles: ['管理员'],
        lastLoginTime: '2021-09-01 12:00:00',
    }
])

/**
 * 修改状态
 */
const handleChangeStatus = (record: any) => {
    console.log(record);
    actionType.value = 'enable';
    confirmModal.value.open(t('account.enableConfirmTitle'), t('account.enableConfirmContent'),)
}

/**
 * 删除
 */
const handleDelete = (record: any) => {
    console.log(record);
    actionType.value = 'delete';
    confirmModal.value.open(t('account.deleteConfirmTitle'), t('account.deleteConfirmContent'), t('account.deleteConfirmDesc'))
}

const handleConfirm = () => {
    switch (actionType.value) {
        case 'enable':
            console.log('启用');
            break;
        case 'disable':
            console.log('禁用');
            break;
        case 'delete':
            console.log('删除');
            break;
        default:
            break;
    }

}

/**
 * 点击新增账号
 */
const handleAddAccount = () => {
    router.push('accountCreate');
}

/**
 * 点击编辑
 */
const handleEdit = (record: any) => {
    console.log(record);
    router.push('accountDetail');
}
</script>

<style lang="scss" scoped></style>