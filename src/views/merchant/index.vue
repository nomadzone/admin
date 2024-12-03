<!-- 商家列表 -->
<template>
    <div class="common-page-container">
        <div class="common-panel">
            <div class="common-query-form-container">
                <div class="form-item-group">
                    <a-form :model="form" layout="inline">
                        <a-grid :cols="queryFormItemLayout" style="width: 100%;">
                            <a-grid-item class="demo-item">
                                <a-form-item label-col-flex="80px" field="name" :label="$t('merchant.index.name')">
                                    <a-input v-model="form.name" />
                                </a-form-item>
                            </a-grid-item>
                            <a-grid-item class="demo-item">
                                <a-form-item label-col-flex="80px" field="shopStatus"
                                    :label="$t('merchant.index.status')">
                                    <a-select v-model="form.shopStatus">
                                        <a-option v-for="item in statusOptions" :key="item.value" :value="item.value">
                                            {{ item.label }}
                                        </a-option>
                                    </a-select>
                                </a-form-item>

                            </a-grid-item>
                            <a-grid-item class="demo-item">
                                <a-form-item label-col-flex="80px" field="categoryName"
                                    :label="$t('merchant.index.category')">
                                    <a-select v-model="form.categoryName">
                                        <a-option v-for="item in categoryNameOptions" :key="item.id"
                                            :value="item.categoryName">
                                            {{ item.categoryName }}
                                        </a-option>
                                    </a-select>
                                </a-form-item>
                            </a-grid-item>
                            <a-grid-item class="demo-item">
                                <a-form-item label-col-flex="80px" field="createTime"
                                    :label="$t('merchant.index.createTime')">
                                    <a-range-picker format="YYYY-MM-DD " v-model="form.timeQuery" allow-clear />

                                </a-form-item>
                            </a-grid-item>
                        </a-grid>
                    </a-form>
                </div>
                <a-divider class="query-form-divider" direction="vertical" />
                <div class="query-actions">
                    <a-button type="primary" @click="fetchData(1)">
                        <template #icon>
                            <icon-search />
                        </template>
                        {{ $t("button.search") }}
                    </a-button>
                    <a-button type="outline" @click="handleReset()">
                        <template #icon>
                            <icon-refresh />

                        </template>
                        {{ $t("button.reset") }}

                    </a-button>
                </div>
            </div>
            <a-divider />



            <div class="data-box">
                <div class="table-header-row">
                    <div class="left">
                        <a-button class="left-btn" :disabled="!selectedKeys.length" @click="passByGroup()">{{
                            $t('merchant.index.batchApproval')
                            }}</a-button>
                        <a-button :disabled="!selectedKeys.length" @click="RejectByGroup()">{{
                            $t('merchant.index.batchNotPassed')
                            }}</a-button>
                    </div>
                    <a-button> <template #icon>
                            <icon-download />
                        </template>{{ $t('merchant.index.download') }}</a-button>
                </div>

                <div class="common-table-container">

                    <a-table size="small" :columns="columns" :data="data" :row-selection="rowSelection" row-key="id"
                        v-model:selectedKeys="selectedKeys" @selection-change="handleSelectRow" :loading="tableLoading">
                        <template #paymentMethod="{ record }">
                            <div>
                                <span>{{ record?.paymentMethod }}</span>/
                                <span>{{ record?.paymentNumber }}</span>

                            </div>
                        </template>
                        <template #isAuth="{ record }">
                            <span>{{ approveStatusMap[record.isAuth] }}</span>
                        </template>
                        <template #shopStatus="{ record }">
                            <span>{{ statusMap[record.shopStatus] }}</span>
                        </template>
                        <template #action="{ record }">
                            <a-button type="text" @click="handleShowDetail(record)">{{ $t("button.detail") }}</a-button>
                            <a-popconfirm v-if="record.isAuth == 2" :content="$t('merchant.index.passConfirm')"
                                @ok="handlePass(record)">
                                <a-button type="text" v-if="record.isAuth == 2">{{ $t("merchant.index.pass")
                                    }}</a-button>

                            </a-popconfirm>
                            <a-button type="text" v-if="record.isAuth == 2" @click="handleReject(record)">{{
                                $t("merchant.index.reject") }}</a-button>
                            <a-button type="text"
                                v-if="record.isAuth == 0 && (record.shopStatus == 2 || record.shopStatus == 1)"
                                @click="handleChangeStatus(record, 0)">{{
                                    $t("merchant.setMenu.goOnline")
                                }}</a-button>
                            <a-button type="text" v-if="record.isAuth == 0 && record.shopStatus == 0"
                                @click="handleChangeStatus(record, 2)">{{
                                    $t("merchant.setMenu.goOffline")
                                }}</a-button>

                        </template>
                    </a-table>
                </div>
            </div>
            <a-modal title-align="start" v-model:visible="visible" @ok="handleConfirmReject"
                @cancel="handleCancelReject" :title="t('merchant.index.rejectModalTitle')">
                <a-form>
                    <a-form-item :label-col-props="{ span: 8 }" :wrapper-col-props="{ span: 16 }"
                        :label="t('merchant.index.rejectLabel')" label-width="180px">
                        <a-input v-model="rejectReason" :placeholder="t('merchant.index.rejectLabel')" />
                    </a-form-item>
                </a-form>
            </a-modal>
        </div>

    </div>
</template>
<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter, RouteRecordRaw } from 'vue-router';
import { shopList, shopStatusChange, merchantCategoryList, shopApprove } from '@/api/merchant';

import { Modal, Message } from '@arco-design/web-vue';
const router = useRouter();

const { t } = useI18n()
const queryFormItemLayout = { xs: 1, sm: 2, md: 2, lg: 2, xl: 2, xxl: 2 }

const form = ref({
    name: '',
    shopStatus: '',
    categoryName: '',
    timeQuery: null

})

const selectedKeys = ref([]);
const rowSelection = reactive({
    type: 'checkbox',
    showCheckedAll: true,
    onlyCurrent: false,
});
const approveStatusMap = {
    '0': t('merchant.index.identifyed'),
    '1': t('merchant.index.authenticationFailed'),
    '2': t('merchant.index.pendingApproval'),
    '4': t('merchant.index.toBeCertified')
}

const statusMap = {
    '0': t('merchant.index.inBusiness'),
    '1': t('merchant.index.restedAlready'),
    '2': t('merchant.index.offlineAlready')
}

const statusOptions = [
    { label: t('merchant.index.inBusiness'), value: '0' },
    { label: t('merchant.index.restedAlready'), value: '1' },
    { label: t('merchant.index.offlineAlready'), value: '2' }
]


const columns = ref([
    { title: t('merchant.index.id'), dataIndex: 'id', key: 'id', width: 100, ellipsis: true },
    { title: t('merchant.index.name'), dataIndex: 'name', key: 'name', width: 160, ellipsis: true },
    { title: t('merchant.index.category'), dataIndex: 'categoryName', key: 'categoryName', width: 100, ellipsis: true },
    { title: t('merchant.index.identifyStatus'), dataIndex: 'isAuth', key: 'isAuth', slotName: 'isAuth', width: 120, ellipsis: true },
    { title: t('merchant.index.status'), dataIndex: 'shopStatus', key: 'shopStatus', slotName: 'shopStatus', width: 120, ellipsis: true },
    { title: t('merchant.index.packageNum'), dataIndex: 'packageNum', key: 'packageNum', width: 120, ellipsis: true },
    { title: t('merchant.index.accumulatedRevenue'), dataIndex: 'accumulatedRevenue', key: 'accumulatedRevenue', width: 200, ellipsis: true, slotName: 'paymentMethod' },
    { title: t('merchant.index.accumulatedExpenses'), dataIndex: 'accumulatedExpenses', key: 'accumulatedExpenses', width: 180, ellipsis: true },
    { title: t('merchant.index.createTime'), dataIndex: 'createTime', key: 'createTime', width: 180, ellipsis: true },
    { title: t('table.operation'), dataIndex: 'operation', key: 'operation', width: 160, slotName: 'action', fixed: 'right' },

])

// 查询商户分类选项数据
const categoryNameOptions = ref([])

const fetchCategoryOptions = async () => {
    const res = await merchantCategoryList({ pageNum: 1, pageSize: 100000 })
    categoryNameOptions.value = res.rows
    console.log('categoryOptions:', categoryNameOptions)
}

const data = ref([])
// 查询列表
const pageSize = ref(10)
const pageNum = ref(1)
const total = ref(0)
const tableLoading = ref(false)

const fetchData = async (page, size) => {
    tableLoading.value = true
    let params = {
        ...form.value,
        beginCreateTime: form.value.timeQuery ? form.value.timeQuery[0] : '',
        endCreateTime: form.value.timeQuery ? form.value.timeQuery[1] : '',
        pageSize: size || pageSize.value,
        pageNum: page || pageNum.value,
    }

    delete params.timeQuery
    const res = await shopList(params)

    data.value = res.rows
    tableLoading.value = false

}

// 点击重置
const handleReset = () => {
    form.value = {
        name: '',
        shopStatus: '',
        categoryName: '',
        timeQuery: null
    }

    fetchData(1)
}



// 查看详情
const handleShowDetail = (row: any) => {
    router.push({
        name: 'merchantDetail',
        query: {
            id: row.id,
        }
    });
}

const handleSelectRow = (val) => {
    selectedKeys.value = val
}

// 修改状态
const handleChangeStatus = (row: any, status: number) => {
    let statusText = status === 0 ? t('merchant.index.onlineMerchants') : t('merchant.index.offlineMerchants')
    let tipText = status === 0 ? t('merchant.index.onlineMerchantsTip') : t('merchant.index.offlineMerchantsTip')
    Modal.confirm({
        alignCenter: false,
        title: statusText,
        content: tipText,
        onOk() {
            shopStatusChange({ id: row.id, shopStatus: status }).then(res => {
                if (res?.code === 0) {
                    fetchData(pageNum.value, pageSize.value)
                }
            })
        },
    });

}

const visible = ref(false);
// 点击不通过
const rejectReason = ref('');
const choosenRow = ref(null);
const handleReject = (row) => {
    choosenRow.value = row;
    visible.value = true;
};

// 点击确认不通过
const handleConfirmReject = () => {
    console.log('rejectReason:', rejectReason.value);
    let params = {
        shopIds: choosenRow.value ? [choosenRow.value.id] : selectedKeys.value,
        isAuth: 1,
        rejectReason: rejectReason.value
    }
    shopApprove(params).then(res => {
        if (res.code == 0) {
            Message.success('操作成功');
        }
    }).catch(err => {
    }).finally(() => {
        visible.value = false;
    });
};

// 点击取消
const handleCancelReject = () => {
    visible.value = false;


};
// 点击通过
const handlePass = (row) => {
    visible.value = true;
    let params = {
        shopIds: row ? [row.id] : selectedKeys.value,
        isAuth: 0,
        rejectReason: ''
    }
    shopApprove(params).then(res => {
        if (res.code == 0) {
            Message.success('操作成功');
        }
    }).catch(err => {
        console.log('reject error:', err);
    }).finally(() => {
        visible.value = false;
    });
};


const RejectByGroup = () => {
    choosenRow.value = null;
    let pendingApproval = selectedKeys.value.filter(item => item.isAuth == 2)

    if (pendingApproval.length === 0) {
        Message.error('请选择待审核的商家')
        return
    } else {
        handleReject()
    }

}

const passByGroup = () => {
    let pendingApproval = selectedKeys.value.filter(item => item.isAuth == 2)

    if (pendingApproval.length === 0) {
        Message.error('请选择待审核的商家')
        return
    } else {
        handlePass()
    }

}
onMounted(() => {
    fetchCategoryOptions()
    fetchData(1, pageSize.value)
})

</script>

<style lang="scss" scoped>
.table-header-row {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: 20px;
    align-items: center;

    .left {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;

        .left-btn {
            margin-right: 10px;
        }
    }
}
</style>