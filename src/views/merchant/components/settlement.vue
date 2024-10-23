<template>
    <div class="shop-settlement-comp">

        <Summary :shopId="props.shopId"></Summary>
        <div class="common-query-form-container">
            <div class="form-item-group">
                <a-form :model="form" layout="inline">
                    <a-grid :cols="queryFormItemLayout" style="width: 100%;">
                        <a-grid-item class="demo-item">
                            <a-form-item label-col-flex="80px" field="orderNo"
                                :label="$t('finance.revenueExpenditure.orderNum')">
                                <a-input v-model="form.orderNo" allow-clear />
                            </a-form-item>
                        </a-grid-item>
                        <a-grid-item class="demo-item">
                            <a-form-item label-col-flex="80px" field="settlementType"
                                :label="$t('finance.settlement.settlementType')">
                                <a-select v-model="form.settlementType" allow-clear>
                                    <a-option v-for="(item, index) in settlementTypeOptions" :key="index" :value="item">
                                        {{ item }}
                                    </a-option>
                                </a-select>
                            </a-form-item>

                        </a-grid-item>
                        <a-grid-item class="demo-item">
                            <a-form-item label-col-flex="80px" field="timeQuery"
                                :label="$t('finance.settlement.settlementTime')">
                                <a-range-picker format="YYYY-MM-DD " v-model="form.timeQuery" allow-clear />
                            </a-form-item>
                        </a-grid-item>
                    </a-grid>
                </a-form>
            </div>
            <a-divider class="query-form-divider" direction="vertical" />
            <div class="query-actions">
                <a-button type="primary" @click="getSettleListData(1)">
                    <template #icon>
                        <icon-search />
                    </template>
                    {{ $t("button.search") }}
                </a-button>
                <a-button type="outline" @click="handleSearchResult()">
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

                <a-table size="small" :columns="columns" :data="data" :pagination="false">
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
                    <a-pagination :total="totalValue" :current="currentPage" :pageSize="pageSize"
                        @change="handleChangePage" @page-size-change="handleChangeSize" />

                </div>

            </div>
        </div>

    </div>
</template>
<script lang="ts" setup>
import { ref, watch, defineProps } from 'vue';
import { useI18n } from 'vue-i18n';
import { shopSettlementList } from '@/api/merchant';
import Summary from './summary.vue';
const { t } = useI18n()
const queryFormItemLayout = { xs: 1, sm: 2, md: 2, lg: 2, xl: 2, xxl: 2 }

const props = defineProps({
    shopId: String
})
const form = ref({
    orderNo: '',
    timeQuery: '',
    settlementType: '',
})
const settlementTypeOptions = ref(['交易结算', '服务费结算', '提现结算'])

const columns = ref([
    { title: t('finance.revenueExpenditure.transactionType'), dataIndex: 'extends1', key: 'extends1', width: 100, ellipsis: true },
    { title: t('finance.revenueExpenditure.orderNum'), dataIndex: 'orderNo', key: 'orderNo', width: 160, ellipsis: true },
    { title: t('finance.settlement.settlementType'), dataIndex: 'settlementType', key: 'settlementType', width: 100, ellipsis: true },
    { title: t('finance.settlement.settlementAmount'), dataIndex: 'settlementAmount', key: 'settlementAmount', width: 120, ellipsis: true },
    { title: t('finance.settlement.settlementStatus'), dataIndex: 'settlementStatusName', key: 'settlementStatusName', width: 120, ellipsis: true },
    { title: t('finance.settlement.settlementMethod') + '/' + t('finance.settlement.settlementNumber'), dataIndex: 'paymentMethod', key: 'paymentMethod', width: 200, ellipsis: true, slotName: 'paymentMethod' },
    { title: t('finance.settlement.settlementTime'), dataIndex: 'settlementDate', key: 'settlementDate', width: 180, ellipsis: true },
    // { title: t('table.operation'), dataIndex: 'operation', key: 'operation', width: 120, ellipsis: true, slotName: 'action', fixed: 'right' },

])

const handleShowDetail = (row: any) => {
    console.log('show detail')

}

// 获取结算列表
const totalValue = ref(0)
const currentPage = ref(1)
const currentSize = ref(20)
const getSettleListData = async (page, size) => {
    let params = {
        shopId: props.shopId,
        page: page || currentPage.value,
        size: size || currentSize.value,
        orderNo: form.value.orderNo,
        settlementType: form.value.settlementType,
        timeQuery: form.value.timeQuery,
        beginSettlementDate: form.value.timeQuery ? form.value.timeQuery[0] : '',
        endSettlementDate: form.value.timeQuery ? form.value.timeQuery[1] : '',
    }


    delete params.timeQuery
    const res = await shopSettlementList(params)
    if (res && res.code === 200) {
        data.value = res.rows
        totalValue.value = res.total

    }

}

const handleChangePage = (page) => {
    currentPage.value = page
    getSettleListData(page)
}

const handleChangeSize = (size) => {
    currentSize.value = size
    getSettleListData(1, size)
}

watch(() => props.shopId, (newVal) => {
    if (newVal) {
        getSettleListData(1)
    }
}, { immediate: true });

</script>

<style lang="scss" scoped>
.common-query-form-container {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
    color: rgb(var(--gray-10));
    padding: 0px 12px;

    .query-actions {
        width: 80px;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;

        .arco-btn {
            &:not(:last-child) {
                margin-bottom: .5rem;
            }
        }

    }

    .query-form-divider {
        height: 3.75rem;
        background-color: #ccc;
        margin: 0px 1.25rem;
    }

    .form-item-group {
        width: calc(100% - 100px);
        margin-top: 20px;
    }
}

.common-table-container {
    .table-header {
        margin-bottom: 10px;
    }
}
</style>