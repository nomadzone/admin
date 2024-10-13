<!-- 收支明细 -->
<template>
    <div class="common-page-container ">
        <div class="common-panel">
            <div class="common-panel-header">
                <div class="header-title">{{ t('menu.finance.withdrawal') }}</div>
                <div class="header-actions">
                </div>
            </div>

            <Summary></Summary>
            <div class="common-query-form-container">

                <div class="form-item-group">
                    <a-form :model="form" layout="inline">
                        <a-grid :cols="1" style="width: 100%;">
                            <a-grid-item class="demo-item">
                                <a-form-item label-col-flex="80px" field="userName"
                                    :label="$t('finance.withdrawal.withdrawalStatus')">
                                    <a-select v-model="form.orderNum" />
                                </a-form-item>
                            </a-grid-item>
                            <a-grid-item class="demo-item">
                                <a-form-item label-col-flex="80px" field="roles"
                                    :label="$t('finance.withdrawal.withdrawalDate')">
                                    <a-range-picker v-model="form.financeType" style="width: 100%;" />
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


const form = ref({
    orderNum: '',
    financeType: '',
    dealType: '',
    postingdate: null

})

const columns = ref([
    { title: t('finance.revenueExpenditure.orderNum'), dataIndex: 'orderNum', key: 'orderNum', width: 160, ellipsis: true },
    { title: t('finance.withdrawal.bankName'), dataIndex: 'bankName', key: 'bankName', width: 100, ellipsis: true },
    { title: t('finance.withdrawal.withdrawalAmount'), dataIndex: 'withdrawalAmount', key: 'withdrawalAmount', width: 100, ellipsis: true },
    { title: t('finance.withdrawal.withdrawalHandlingFee'), dataIndex: 'withdrawalHandlingFee', key: 'withdrawalHandlingFee', width: 120, ellipsis: true },
    { title: t('finance.withdrawal.bankAccount'), dataIndex: 'bankAccount', key: 'bankAccount', width: 120, ellipsis: true },
    { title: t('finance.withdrawal.applyTime'), dataIndex: 'applyTime', key: 'applyTime', width: 200, ellipsis: true },

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