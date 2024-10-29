<template>
    <div class="revenue-exoebditure-summary-comp">
        <a-row :gutter="23">
            <a-col :span="10">
                <div class="summary-item">
                    <div class="item-icon">
                        <img src="../../../../assets/icons/finance/accumulated-income.svg" alt="">
                    </div>
                    <div class="item-info">
                        <div class="title-text">{{ t("finance.revenueExpenditure.accumulatedIncome") }}</div>
                        <div class="data-value">{{ activeTab == 1 ? summaryData && summaryData?.cumulativeAmount || 0 :
                            summaryData && summaryData?.sumAmount || 0 }}元<span class="server-money">(其中服务费{{
                                activeTab == 1 ? summaryData && summaryData?.serviceAmount || 0 : summaryData &&
                                    summaryData?.costAmount || 0 }}元)</span></div>
                    </div>
                </div>
            </a-col>
            <a-col :span="6">
                <div class="summary-item">
                    <div class="item-icon">
                        <img src="../../../../assets/icons/finance/accumulated-expenses.svg" alt="">

                    </div>
                    <div class="item-info">
                        <div class="title-text">{{ t("finance.settlement.pendingSettlement") }}</div>
                        <div class="data-value">{{ activeTab == 1 ? summaryData && summaryData?.settlementAmount || 0 :
                            summaryData && summaryData?.waitSettlementAmount || 0 }}元
                        </div>
                    </div>
                </div>
            </a-col>
            <a-col :span="6">
                <div class="summary-item">
                    <div class="item-icon">
                        <img src="../../../../assets/icons/finance/account-balance.svg" alt="">

                    </div>
                    <div class="item-info">
                        <div class="title-text">{{ t("finance.settlement.settlemented") }}</div>
                        <div class="data-value">{{ activeTab == 1 ? summaryData && summaryData?.balanceAmount || 0 :
                            summaryData && summaryData?.settlementAmount || 0 }}元</div>
                    </div>
                </div>
            </a-col>


        </a-row>
    </div>

</template>
<script setup>
import { ref, onMounted, defineProps, defineExpose } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { shopSettlementTotal } from '@/api/merchant';
import { shopSettlementActiveTotal } from '@/api/finance';
const { t } = useI18n();
const router = useRouter();
const props = defineProps({
    activeTab: {
        type: String,
        default: '1'
    }
})



// 查询结算汇总
const summaryData = ref({})
const fetchSettleSummary = async (params) => {
    const res = await shopSettlementActiveTotal(params)
    console.log(res)
    summaryData.value = res.data
}

const fetchOrderSummary = async (params) => {
    const res = await shopSettlementTotal(params)
    console.log(res)
    summaryData.value = res.data
}

onMounted(() => {
    fetchSettleSummary()
});

defineExpose({
    fetchSettleSummary,
    fetchOrderSummary
});
/**
 * 提现申请
 */
const handleWithdrawalApply = () => {
    console.log('提现申请');

    router.push({
        path: 'withdrawalApply'
    });
}
</script>

<style lang="scss" scoped>
.revenue-exoebditure-summary-comp {
    padding: 1.25rem 0px;
    border-top: 1px solid #F2F3F5;
    border-bottom: 1px solid #F2F3F5;
    margin: 0px 20px;

    .summary-item {
        display: flex;
        align-items: center;
        border-right: 1px solid #F2F3F5;

        .item-icon {
            width: 3.375rem;
            height: 3.375rem;
            background-color: #F6F7FB;
            border-radius: 100%;
            margin-right: .75rem;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .item-info {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: flex-start;

            .title-text {
                font-size: .75rem;
                font-weight: 500;
                margin-bottom: 8px;
                height: 1.25rem;
                line-height: 20px;
            }

            .data-value {
                height: 1.875rem;
                line-height: 1.875rem;
                font-size: 22px;
                font-weight: 600;
                color: #1D2129;

                .server-money {
                    font-size: 14px;
                }
            }
        }
    }

}
</style>