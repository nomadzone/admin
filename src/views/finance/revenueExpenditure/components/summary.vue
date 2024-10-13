<template>
    <div class="revenue-exoebditure-summary-comp">
        <a-row :gutter="23">
            <a-col :span="4">
                <div class="summary-item">
                    <div class="item-icon">
                        <img src="../../../../assets/icons/finance/accumulated-income.svg" alt="">
                    </div>
                    <div class="item-info">
                        <div class="title-text">{{ t("finance.revenueExpenditure.accumulatedIncome") }}</div>
                        <div class="data-value"></div>
                    </div>
                </div>
            </a-col>
            <a-col :span="4">
                <div class="summary-item">
                    <div class="item-icon">
                        <img src="../../../../assets/icons/finance/accumulated-expenses.svg" alt="">
                        
                    </div>
                    <div class="item-info">
                        <div class="title-text">{{ t("finance.revenueExpenditure.accumulatedExpenses") }}</div>
                        <div class="data-value"></div>
                    </div>
                </div>
            </a-col>
            <a-col :span="4">
                <div class="summary-item">
                    <div class="item-icon">
                        <img src="../../../../assets/icons/finance/account-balance.svg" alt="">

                    </div>
                    <div class="item-info">
                        <div class="title-text">{{ t("finance.revenueExpenditure.accountBalance") }}</div>
                        <div class="data-value"></div>
                    </div>
                </div>
            </a-col>

            <a-col :span="2">
                <a-button type="primary" @click="handleWithdrawalApply()">{{ t("finance.revenueExpenditure.withdrawal") }}</a-button>
            </a-col>
        </a-row>
    </div>

</template>
<script lang="ts" setup>
import {useI18n} from 'vue-i18n';
import { useRouter } from 'vue-router';

const {t} = useI18n();
const router = useRouter();

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
            }
        }
    }

}
</style>