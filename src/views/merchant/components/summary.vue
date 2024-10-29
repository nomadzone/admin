<template>
    <div class="revenue-exoebditure-summary-comp">
        <a-row :gutter="23">
            <a-col :span="8">
                <div class="summary-item">
                    <div class="item-icon">
                        <img src="../../../assets/icons/finance/accumulated-income.svg?url" alt="">

                    </div>
                    <div class="item-info">
                        <div class="title-text">{{ t("finance.settlement.totalIncome") }}</div>
                        <div class="data-value">{{ summaryData && summaryData?.waitSettlementAmount || 0 }}元<span
                                class="server-money">(其中服务费{{
                                    summaryData && summaryData?.costAmount || 0 }}元)</span></div>
                    </div>
                </div>
            </a-col>
            <a-col :span="4">
                <div class="summary-item">
                    <div class="item-icon">
                        <img src="../../../assets/icons/finance/accumulated-expenses.svg?url" alt="">

                    </div>
                    <div class="item-info">
                        <div class="title-text">{{ t("finance.settlement.pendingSettlement") }}</div>
                        <div class="data-value">{{ summaryData && summaryData?.waitSettlementAmount || 0 }}元
                        </div>
                    </div>
                </div>
            </a-col>
            <a-col :span="4">
                <div class="summary-item">
                    <div class="item-icon">
                        <img src="../../../assets/icons/finance/account-balance.svg?url" alt="">

                    </div>
                    <div class="item-info">
                        <div class="title-text">{{ t("finance.settlement.alreadySettled") }}</div>
                        <div class="data-value">{{ summaryData && summaryData?.settlementAmount || 0 }}元</div>
                    </div>
                </div>
            </a-col>


        </a-row>
    </div>

</template>
<script lang="ts" setup>
import { ref, onMounted, defineProps, watch, defineExpose } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { shopSettlementTotal } from '@/api/merchant';
const { t } = useI18n();
const router = useRouter();

const props = defineProps({
    shopId: String
})
watch(() => props.shopId, (newVal) => {
    if (newVal) {
        fetchSettleSummary()
    }
}, { immediate: true });
// 查询结算汇总
const summaryData = ref({})
const fetchSettleSummary = async (params) => {
    let queryInfo = Object.assign({}, params, { shopId: props.shopId })
    const res = await shopSettlementTotal(queryInfo)
    summaryData.value = res.data
}
/**
 * 提现申请
 */
const handleWithdrawalApply = () => {
    console.log('提现申请');

    router.push({
        path: 'withdrawalApply'
    });
}

defineExpose({
    fetchSettleSummary
})
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