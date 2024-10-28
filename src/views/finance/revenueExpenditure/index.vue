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
                    <a-form :model="form" layout="inline" :label-col-props="{ span: 6 }"
                        :wrapper-col-props="{ span: 18 }">
                        <a-grid :cols="queryFormItemLayout" style="width: 100%;">
                            <a-grid-item class="demo-item">
                                <a-form-item field="orderNum" :label="$t('finance.revenueExpenditure.orderNum')"
                                    label-col-flex="80px">
                                    <a-input v-model="form.orderNum" />
                                </a-form-item>
                            </a-grid-item>
                            <a-grid-item class="demo-item">
                                <a-form-item field="roles" :label="$t('finance.revenueExpenditure.settlementObject')"
                                    label-col-flex="80px">
                                    <a-input v-model="form.financeType" />
                                </a-form-item>

                            </a-grid-item>
                            <a-grid-item class="demo-item">
                                <a-form-item field="status" :label="$t('finance.revenueExpenditure.transactionType')"
                                    label-col-flex="80px">
                                    <a-select v-model="form.dealType" />
                                </a-form-item>
                            </a-grid-item>
                            <a-grid-item class="demo-item">
                                <a-form-item field="status" :label="$t('finance.revenueExpenditure.receiptTime')"
                                    label-col-flex="80px">
                                    <a-range-picker format="YYYY-MM-DD " v-model="form.timeQuery" allow-clear />
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
                <a-tabs type="rounded" size="medium" @change="handleChangeTab">
                    <a-tab-pane key="1" :title="t('finance.revenueExpenditure.activityOrder')">
                    </a-tab-pane>
                    <a-tab-pane key="2" :title="t('finance.revenueExpenditure.packageOrder')">
                    </a-tab-pane>
                </a-tabs>

                <div class="common-table-container">

                    <a-table size="small" :columns="columns" :data="data" :loading="tableLoad" :pagination="false">
                        <template #paymentMethod="{ record }">
                            <div>
                                <span>{{ record?.settlementWay }}</span>/
                                <span>{{ record?.settlementNo }}</span>

                            </div>
                        </template>

                        <template #action="{ record }">
                            <a-button type="text" @click="handleShowDetail(record)">{{ $t("button.detail") }}</a-button>
                        </template>
                    </a-table>

                    <div class="pagination-row">
                        <a-pagination :total="totalValue" :current="currentPage" :pageSize="currentSize"
                            @change="handleChangePage" @page-size-change="handleChangeSize" />
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import Summary from './components/summary.vue';
import { getActivityOrderList } from '@/api/finance'
import { shopSettlementList } from '@/api/merchant';
import { active } from 'sortablejs';

const { t } = useI18n()

const queryFormItemLayout = { xs: 1, sm: 2, md: 2, lg: 2, xl: 2, xxl: 2 }

const form = ref({
    orderNum: '',
    financeType: '',
    dealType: '',
    timeQuery: null

})

const columns = ref([
    { title: t('finance.revenueExpenditure.transactionType'), dataIndex: 'settlementType', key: 'settlementType', width: 100, ellipsis: true },
    { title: t('finance.revenueExpenditure.orderNum'), dataIndex: 'orderNo', key: 'orderNo', width: 160, ellipsis: true },
    { title: t('finance.revenueExpenditure.financeType'), dataIndex: 'settlementType', key: 'settlementType', width: 100, ellipsis: true },
    { title: t('finance.revenueExpenditure.amount'), dataIndex: 'settlementAmount', key: 'settlementAmount', width: 120, ellipsis: true },
    // { title: t('finance.revenueExpenditure.balance'), dataIndex: 'balance', key: 'balance', width: 120, ellipsis: true },
    { title: t('finance.settlement.settlementStatus'), dataIndex: 'settlementStatusName', key: 'settlementStatusName', width: 120, ellipsis: true },
    { title: t('finance.revenueExpenditure.paymentMethod'), dataIndex: 'paymentMethod', key: 'paymentMethod', width: 200, ellipsis: true, slotName: 'paymentMethod' },
    { title: t('finance.revenueExpenditure.receiptTime'), dataIndex: 'settlementDate', key: 'settlementDate', width: 180, ellipsis: true },
    { title: t('table.operation'), dataIndex: 'operation', key: 'operation', width: 120, ellipsis: true, slotName: 'action', fixed: 'right' },

])
const data = ref([
])

const handleShowDetail = (row: any) => {
    console.log('show detail')
}

// 查询活动该订单列表
const currentPage = ref(1)
const currentSize = ref(20)
const totalValue = ref(0)
const tableLoad = ref(false)
const searchActivityOrderListData = async (page, size) => {
    tableLoad.value = true
    let params = {
        pageNum: page || currentPage.value,
        pageSize: size || currentSize.value
    }
    const res = await getActivityOrderList(params)
    if (res.code === 200) {
        data.value = res.rows
        totalValue.value = res.total
        tableLoad.value = false
    } else {
        tableLoad.value = false
    }
}


// 查询套餐订单列表
const searchPackageOrderListData = async (page, size) => {
    let params = {
        pageNum: page || currentPage.value,
        pageSize: size || currentSize.value
    }
    const res = await shopSettlementList(params)
    if (res.code === 0) {
        data.value = res.rows
        totalValue.value = res.total
        tableLoad.value = false
    } else {
        tableLoad.value = false
    }
}
const activeTab = ref('1')

const handleChangeTab = (key) => {
    currentPage.value = 1
    activeTab.value = key
    if (key === '1') {
        searchActivityOrderListData(1)
    } else {
        searchPackageOrderListData(1)
    }
}

const handleChangePage = (page) => {
    currentPage.value = page
    if (activeTab.value == 1) {
        searchActivityOrderListData(page)
    } else {
        searchPackageOrderListData(page)
    }
}

const handleChangeSize = (size) => {
    currentSize.value = size
    if (activeTab.value == 1) {
        searchActivityOrderListData(1, size)
    } else {
        searchPackageOrderListData(1, size)
    }
}

onMounted(() => {
    searchActivityOrderListData(1)
})

</script>

<style lang="scss" scoped>
.common-query-form-container {
    margin-top: 34px;
}

.pagination-row {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    margin-top: 20px;
}
</style>