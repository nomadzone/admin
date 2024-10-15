<!-- 结算明细 -->
<template>
    <div class="common-page-container ">
        <div class="common-panel">
            <div class="common-panel-header">
                <div class="header-title">{{ t('menu.finance.settlement') }}</div>
                <div class="header-actions">
                </div>
            </div>

            <Summary></Summary>
            <div class="common-query-form-container">

                <div class="form-item-group">
                    <a-form :model="form" layout="inline">
                        <a-grid :cols="queryFormItemLayout" style="width: 100%;">
                            <a-grid-item class="demo-item">
                                <a-form-item label-col-flex="80px" field="userName"
                                    :label="$t('finance.revenueExpenditure.orderNum')">
                                    <a-input v-model="form.orderNum" />
                                </a-form-item>
                            </a-grid-item>
                            <a-grid-item class="demo-item">
                                <a-form-item label-col-flex="80px" field="roles"
                                    :label="$t('finance.settlement.settlementType')">
                                    <a-select v-model="form.financeType" />
                                </a-form-item>

                            </a-grid-item>
                            <a-grid-item class="demo-item">
                                <a-form-item label-col-flex="80px" field="status"
                                    :label="$t('finance.revenueExpenditure.transactionType')">
                                    <a-select v-model="form.dealType" />
                                </a-form-item>
                            </a-grid-item>
                            <a-grid-item class="demo-item">
                                <a-form-item label-col-flex="80px" field="status"
                                    :label="$t('finance.settlement.settlementTime')">
                                    <a-select v-model="form.dealType" />
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

            <div class="data-box">
                <a-tabs type="rounded" size="medium">
                    <a-tab-pane key="1" :title="t('finance.revenueExpenditure.all')">
                    </a-tab-pane>
                    <a-tab-pane key="2" :title="t('finance.settlement.pendingSettlement')">
                    </a-tab-pane>
                    <a-tab-pane key="3" :title="t('finance.settlement.settlementInProgress')">
                    </a-tab-pane>
                    <a-tab-pane key="4" :title="t('finance.settlement.settlementSuccessful')">
                    </a-tab-pane>
                    <a-tab-pane key="5" :title="t('finance.settlement.settlementFailed')">
                    </a-tab-pane>
                </a-tabs>

                <div class="common-table-container">

                    <a-table size="small" :columns="columns" :data="data">
                        <template #paymentMethod="{ record }">
                            <div>
                                <span>{{ record?.paymentMethod }}</span>/
                                <span>{{ record?.paymentNumber }}</span>

                            </div>
                        </template>
                        <template #action="{ record }">
                            <a-button type="text" @click="handleShowDetail(record)">{{ $t("button.detail") }}</a-button>
                        </template>
                    </a-table>
                </div>
            </div>

        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import Summary from './components/summary.vue';
import { getSettleList } from '@/api/finance'
const { t } = useI18n()

const queryFormItemLayout = { xs: 1, sm: 2, md: 2, lg: 2, xl: 2, xxl: 2 }

const form = ref({
    orderNum: '',
    financeType: '',
    dealType: '',
    postingdate: null

})

const columns = ref([
    { title: t('finance.revenueExpenditure.transactionType'), dataIndex: 'extends1', key: 'extends1', width: 100, ellipsis: true },
    { title: t('finance.revenueExpenditure.orderNum'), dataIndex: 'orderNo', key: 'orderNo', width: 160, ellipsis: true },
    { title: t('finance.settlement.settlementType'), dataIndex: 'settlementType', key: 'settlementType', width: 100, ellipsis: true },
    { title: t('finance.settlement.settlementAmount'), dataIndex: 'settlementAmount', key: 'settlementAmount', width: 120, ellipsis: true },
    { title: t('finance.settlement.settlementStatus'), dataIndex: 'balance', key: 'balance', width: 120, ellipsis: true },
    { title: t('finance.settlement.settlementMethod') + '/' + t('finance.settlement.settlementNumber'), dataIndex: 'paymentMethod', key: 'paymentMethod', width: 200, ellipsis: true, slotName: 'paymentMethod' },
    { title: t('finance.settlement.settlementTime'), dataIndex: 'receiptTime', key: 'receiptTime', width: 180, ellipsis: true },
    // { title: t('table.operation'), dataIndex: 'operation', key: 'operation', width: 120, ellipsis: true, slotName: 'action', fixed: 'right' },

])
const data = ref([
])

const handleShowDetail = (row: any) => {
    console.log('show detail')

}

// 获取结算列表
const totalValue = ref(0)
const getSettleListData = async () => {
    const res = await getSettleList()
    if (res && res.code === 200) {
        data.value = res.rows
        totalValue.value = res.total

    }
    console.log(res)
}

onMounted(() => {
    getSettleListData()
})

</script>

<style lang="scss" scoped>
.common-query-form-container {
    margin-top: 34px;
}
</style>