<!-- 收支明细 -->
<template>
    <div class="common-page-container ">
        <div class="common-panel">
            <div class="common-panel-header">
                <div class="header-title">{{ t('menu.finance.revenueExpenditure') }}</div>
                <div class="header-actions">
                </div>
            </div>
            <Summary :activeTab="activeTab" :queryInfo="form" ref="summaryRef"></Summary>
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
                                    <a-input v-model="form.name" />
                                </a-form-item>

                            </a-grid-item>
                            <!-- <a-grid-item class="demo-item">
                                <a-form-item field="status" :label="$t('finance.revenueExpenditure.transactionType')"
                                    label-col-flex="80px">
                                    <a-select v-model="form.dealType" />
                                </a-form-item>
                            </a-grid-item> -->
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
                    <a-button type="primary" @click="handleClickSearch()">
                        <template #icon>
                            <icon-search />
                        </template>
                        {{ $t("button.search") }}
                    </a-button>
                    <a-button type="outline" @click="handleClickReset()">
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
                    <template #extra>
                        <a-button :disabled="selectedKeys.length == 0"
                            @click="handleSettlementByGroup()">批量结算</a-button>
                    </template>
                    <a-tab-pane key="1" :title="t('finance.revenueExpenditure.activityOrder')">
                    </a-tab-pane>
                    <a-tab-pane key="2" :title="t('finance.revenueExpenditure.packageOrder')">
                    </a-tab-pane>
                </a-tabs>

                <div class="common-table-container">
                    <a-table size="small" :columns="columns" :data="data" :loading="tableLoad" :pagination="false"
                        v-if="activeTab == 1" row-key="id" :row-selection="rowSelection"
                        v-model:selectedKeys="selectedKeys">
                        <template #settlementType="{ record }">
                            <div>
                                线下
                            </div>
                        </template>
                        <template #financeType="{ record }">
                            <div>
                                线下
                            </div>
                        </template>
                        <template #paymentMethod="{ record }">
                            <div>
                                微信支付

                            </div>
                        </template>
                        <template #settlement="{ record }">
                            <div>
                                <span v-if="record.settlement == 1"> 已结算</span>
                                <span v-else-if="record.settlement == 0"> 待结算</span>

                            </div>
                        </template>
                        <template #action="{ record }">
                            <a-button type="text" v-if="record.settlement == 0" @click="handleActivitySet(record)">{{
                                $t("finance.revenueExpenditure.settlement") }}</a-button>
                        </template>
                    </a-table>

                    <a-table size="small" :columns="orderColumns" :data="orderData" :loading="tableLoad"
                        :pagination="false" v-else-if="activeTab == 2" :row-selection="rowSelection"
                        v-model:selectedKeys="selectedKeys" row-key="id">
                        <template #paymentMethod="{ record }">
                            <div>
                                <span>{{ record?.settlementWay }}</span>/
                                <span>{{ record?.settlementNo }}</span>
                            </div>
                        </template>

                        <template #action="{ record }">
                            <a-button type="text" v-if="record.settlementStatus == 0"
                                @click="handlePackageOrderSet(record)">{{
                                    $t("finance.revenueExpenditure.settlement") }}</a-button>
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
import { shopSettlementList, shopSettlementDeal } from '@/api/merchant';
import { shopActivitySettlementDeal } from '@/api/finance';
import { Message, Modal } from '@arco-design/web-vue'

const { t } = useI18n()

const queryFormItemLayout = { xs: 1, sm: 2, md: 2, lg: 2, xl: 2, xxl: 2 }

const form = ref({
    orderNum: '',
    name: '',
    dealType: '',
    timeQuery: null

})

const columns = ref([
    { title: t('finance.revenueExpenditure.transactionType'), dataIndex: 'settlementType', key: 'settlementType', width: 100, ellipsis: true, slotName: 'settlementType' },
    { title: t('finance.revenueExpenditure.orderNum'), dataIndex: 'orderNo', key: 'orderNo', width: 260, ellipsis: true },
    { title: t('finance.revenueExpenditure.financeType'), dataIndex: 'financeType', key: 'financeType', width: 100, ellipsis: true, slotName: 'financeType' },
    { title: t('finance.revenueExpenditure.amount'), dataIndex: 'total', key: 'total', width: 120, ellipsis: true },
    { title: t('finance.revenueExpenditure.serviceAmount'), dataIndex: 'serviceAmount', key: 'serviceAmount', width: 120, ellipsis: true },
    { title: t('finance.revenueExpenditure.settlementObject'), dataIndex: 'name', key: 'name', width: 120, ellipsis: true },
    { title: t('finance.revenueExpenditure.paymentMethod'), dataIndex: 'paymentMethod', key: 'paymentMethod', width: 120, ellipsis: true, slotName: 'paymentMethod' },

    { title: t('finance.settlement.settlementStatus'), dataIndex: 'settlement', key: 'settlement', width: 120, ellipsis: true, slotName: 'settlement' },
    { title: t('finance.revenueExpenditure.receiptTime'), dataIndex: 'createTime', key: 'createTime', width: 180, ellipsis: true },
    { title: t('table.operation'), dataIndex: 'operation', key: 'operation', width: 120, ellipsis: true, slotName: 'action', fixed: 'right' },

])


const orderColumns = ref([
    { title: t('finance.revenueExpenditure.transactionType'), dataIndex: 'settlementType', key: 'settlementType', width: 100, ellipsis: true },
    { title: t('finance.revenueExpenditure.orderNum'), dataIndex: 'orderNo', key: 'orderNo', width: 260, ellipsis: true },
    { title: t('finance.revenueExpenditure.financeType'), dataIndex: 'settlementType', key: 'settlementType', width: 100, ellipsis: true },
    { title: t('finance.revenueExpenditure.amount'), dataIndex: 'settlementAmount', key: 'settlementAmount', width: 120, ellipsis: true },
    { title: t('finance.revenueExpenditure.settlementObject'), dataIndex: 'userNikeName', key: 'userNikeName', width: 120, ellipsis: true },
    { title: t('finance.revenueExpenditure.serviceAmount'), dataIndex: 'extends2', key: 'extends2', width: 120, ellipsis: true },

    { title: t('finance.settlement.settlementStatus'), dataIndex: 'settlementStatusName', key: 'settlementStatusName', width: 120, ellipsis: true },
    { title: t('finance.revenueExpenditure.paymentMethod'), dataIndex: 'paymentMethod', key: 'paymentMethod', width: 200, ellipsis: true, slotName: 'paymentMethod' },
    { title: t('finance.revenueExpenditure.receiptTime'), dataIndex: 'extends3', key: 'extends3', width: 180, ellipsis: true },
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
        orderNum: form.value.orderNum,
        name: form.value.name,
        startcreateTime: form.value.timeQuery ? form.value.timeQuery[0] : '',
        endcreateTime: form.value.timeQuery ? form.value.timeQuery[1] : '',
        pageNum: page || currentPage.value,
        pageSize: size || currentSize.value
    }

    delete params.timeQuery
    const res = await getActivityOrderList(params)
    if (res.code === 0) {
        data.value = [...res.rows]
        totalValue.value = res.total
        tableLoad.value = false
    } else {
        tableLoad.value = false
    }
}


// 查询套餐订单列表
const orderData = ref([])
const searchPackageOrderListData = async (page, size) => {
    let params = {
        orderNo: form.value.orderNum,
        shopName: form.value.name,
        beginSettlementDate: form.value.timeQuery ? form.value.timeQuery[0] : '',
        endSettlementDate: form.value.timeQuery ? form.value.timeQuery[1] : '',
        pageNum: page || currentPage.value,
        pageSize: size || currentSize.value
    }

    delete params.timeQuery
    const res = await shopSettlementList(params)
    if (res.code === 0) {
        orderData.value = [...res.rows]
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
    selectedKeys.value = []
    if (key === '1') {
        searchActivityOrderListData(1, currentSize.value)
        if (summaryRef.value) {
            let params = {
                orderNum: form.value.orderNum,
                name: form.value.name,
                startcreateTime: form.value.timeQuery ? form.value.timeQuery[0] : '',
                endcreateTime: form.value.timeQuery ? form.value.timeQuery[1] : '',
                pageNum: 1,
                pageSize: currentSize.value
            }
            summaryRef.value.fetchSettleSummary(params)
        }
    } else {
        searchPackageOrderListData(1, currentSize.value)
        if (summaryRef.value) {
            let params = {
                orderNo: form.value.orderNum,
                shopName: form.value.name,
                beginSettlementDate: form.value.timeQuery ? form.value.timeQuery[0] : '',
                endSettlementDate: form.value.timeQuery ? form.value.timeQuery[1] : '',
                pageNum: 1,
                pageSize: currentSize.value
            }
            summaryRef.value.fetchOrderSummary(params)
        }
    }
}

const handleChangePage = (page) => {
    currentPage.value = page
    if (activeTab.value == '1') {
        searchActivityOrderListData(page, currentSize.value)

    } else {
        searchPackageOrderListData(page, currentSize.value)
    }
}

const handleChangeSize = (size) => {
    currentSize.value = size
    if (activeTab.value == '1') {
        searchActivityOrderListData(1, size)
    } else {
        searchPackageOrderListData(1, size)
    }
}

const summaryRef = ref(null)
const handleClickSearch = () => {
    if (activeTab.value == '1') {
        searchActivityOrderListData(1, currentSize.value)
        if (summaryRef.value) {
            let params = {
                orderNum: form.value.orderNum,
                name: form.value.name,
                beginVerifyTime: form.value.timeQuery ? form.value.timeQuery[0] : '',
                endVerifyTime: form.value.timeQuery ? form.value.timeQuery[1] : '',
                pageNum: 1,
                pageSize: currentSize.value
            }
            summaryRef.value.fetchSettleSummary(params)
        }

    } else {

        if (summaryRef.value) {
            let params = {
                orderNo: form.value.orderNum,
                shopName: form.value.name,

                startcreateTime: form.value.timeQuery ? form.value.timeQuery[0] : '',
                endcreateTime: form.value.timeQuery ? form.value.timeQuery[1] : '',
                pageNum: 1,
                pageSize: currentSize.value
            }
            summaryRef.value.fetchOrderSummary(params)
        }
        searchPackageOrderListData(1, currentSize.value)
    }
}
const handleClickReset = () => {
    form.value.orderNum = ''
    form.value.name = ''
    form.value.dealType = ''
    form.value.timeQuery = null


    if (activeTab.value == '1') {
        searchActivityOrderListData(1, currentSize.value)
        if (summaryRef.value) {
            let params = {

                pageNum: 1,
                pageSize: currentSize.value
            }
            summaryRef.value.fetchSettleSummary(params)
        }

    } else {

        if (summaryRef.value) {
            let params = {

                pageNum: 1,
                pageSize: currentSize.value
            }
            summaryRef.value.fetchOrderSummary(params)
        }
        searchPackageOrderListData(1, currentSize.value)
    }
}

const selectedKeys = ref([])

const rowSelection = {
    selectedRowKeys: selectedKeys.value,
    onChange: (selectedRowKeys, selectedRows) => {
        selectedKeys.value = selectedRowKeys
    }
}

const handleSettlementByGroup = () => {
    if (selectedKeys.value.length == 0) {
        Message.warning('请选择要结算的订单')
        return
    }
    Modal.confirm({
        title: '批量结算',
        content: '确定批量结算吗？',
        onOk: () => {
            if (activeTab.value == '1') {
                shopActivitySettlementDeal(selectedKeys.value).then(res => {
                    if (res.code == 0) {
                        Message.success('操作成功');
                        searchActivityOrderListData(currentPage.value, currentSize.value)
                    }
                }).catch(err => {
                    console.log('shopSettlementDeal error:', err);
                })
            } else {
                shopSettlementDeal(selectedKeys.value).then(res => {
                    if (res.code == 0) {
                        Message.success('操作成功');
                        searchPackageOrderListData(currentPage.value, currentSize.value)
                    }
                }).catch(err => {
                    console.log('shopSettlementDeal error:', err);
                })
            }
        }
    })
}

// 点击结算
const handleActivitySet = (record) => {
    console.log('record:', record)
    Modal.confirm({
        title: '结算',
        content: '确定结算吗？',
        onOk: () => {
            shopActivitySettlementDeal([record.id]).then(res => {
                if (res.code == 0) {
                    Message.success('操作成功');
                    searchActivityOrderListData()
                }
            }).catch(err => {
                console.log('shopSettlementDeal error:', err);
            })
        }
    })
}

// 点击结算
const handlePackageOrderSet = (record) => {
    console.log('record:', record)
    Modal.confirm({
        title: '结算',
        content: '确定结算吗？',
        onOk: () => {
            shopSettlementDeal([record.id]).then(res => {
                if (res.code == 0) {
                    Message.success('操作成功');
                    searchPackageOrderListData()
                }
            }).catch(err => {
                console.log('shopSettlementDeal error:', err);
            })
        }
    })
}

onMounted(() => {
    searchActivityOrderListData(1, currentSize.value)
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