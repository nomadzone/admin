<!-- 收支明细 -->
<template>
    <div class="common-page-container ">
        <div class="common-panel">
            <div class="common-panel-header">
                <div class="header-title">{{ t('menu.finance.revenueExpenditure') }}</div>
                <div class="header-actions">
                </div>
            </div>

            <Summary></Summary>
            <div class="common-query-form-container">

                <div class="form-item-group">
                    <a-form :model="form" layout="inline" :label-col-props="{ span: 6 }" :wrapper-col-props="{ span: 18 }">
                        <a-grid :cols="queryFormItemLayout" style="width: 100%;">
                            <a-grid-item class="demo-item">
                                <a-form-item field="userName" :label="$t('account.username')" label-col-flex="80px">
                                    <a-input v-model="form.orderNum" />
                                </a-form-item>
                            </a-grid-item>
                            <a-grid-item class="demo-item">
                                <a-form-item field="roles" :label="$t('account.roles')" label-col-flex="80px">
                                    <a-select v-model="form.financeType" />
                                </a-form-item>

                            </a-grid-item>
                            <a-grid-item class="demo-item">
                                <a-form-item field="status" :label="$t('account.status')" label-col-flex="80px">
                                    <a-select v-model="form.dealType" />
                                </a-form-item>
                            </a-grid-item>
                            <a-grid-item class="demo-item">
                                <a-form-item field="status" :label="$t('account.status')" label-col-flex="80px">
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
                    <a-tab-pane key="2" :title="t('finance.revenueExpenditure.income')">
                    </a-tab-pane>
                    <a-tab-pane key="3" :title="t('finance.revenueExpenditure.expenses')">
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
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import Summary from './components/summary.vue';
const { t } = useI18n()

const queryFormItemLayout = { xs: 1, sm: 2, md: 2, lg: 2, xl: 2, xxl: 2 }

const form = ref({
    orderNum: '',
    financeType: '',
    dealType: '',
    postingdate: null

})

const columns = ref([
    { title: t('finance.revenueExpenditure.transactionType'), dataIndex: 'transactionType', key: 'transactionType', width: 100, ellipsis: true },
    { title: t('finance.revenueExpenditure.orderNum'), dataIndex: 'orderNum', key: 'orderNum', width: 160, ellipsis: true },
    { title: t('finance.revenueExpenditure.financeType'), dataIndex: 'financeType', key: 'financeType', width: 100, ellipsis: true },
    { title: t('finance.revenueExpenditure.amount'), dataIndex: 'amount', key: 'amount', width: 120, ellipsis: true },
    { title: t('finance.revenueExpenditure.balance'), dataIndex: 'balance', key: 'balance', width: 120, ellipsis: true },
    { title: t('finance.revenueExpenditure.paymentMethod'), dataIndex: 'paymentMethod', key: 'paymentMethod', width: 200, ellipsis: true, slotName: 'paymentMethod' },
    { title: t('finance.revenueExpenditure.receiptTime'), dataIndex: 'receiptTime', key: 'receiptTime', width: 180, ellipsis: true },
    { title: t('table.operation'), dataIndex: 'operation', key: 'operation', width: 120, ellipsis: true, slotName: 'action', fixed: 'right' },

])
const data = ref([
    { transactionType: '充值', orderNum: '202201010001', financeType: '收入', amount: '1000', balance: '1000', paymentMethod: '支付宝/123456789', receiptTime: '2022-01-01 12:00:00' },
])

const handleShowDetail = (row: any) => {
    console.log('show detail')

}

</script>

<style lang="scss" scoped>
.common-query-form-container {
    margin-top: 34px;
}
</style>