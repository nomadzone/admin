<!-- 收支明细提现申请 -->
<template>
    <div class="common-page-container finance-withdrawal-apply-page">
        <div class="common-panel">
            <div class="common-panel-header">
                <div class="header-title">{{ t('finance.withdrawal.apply') }}</div>
                <div class="header-actions">
                </div>
            </div>
            <div class="withdrawal-tips">{{ t('finance.withdrawal.tips') }}</div>
            <a-row>
                <a-col :xs="{ span: 24 }" :sm="{ span: 24 }" :md="{ span: 18, offset: 3 }" :lg="{ span: 14, offset: 5 }"
                    :xl="{ span: 14, offset: 5 }" :xxl="{ span: 14, offset: 5 }">
                    <div class="withdrawal-form-box">
                        <a-form :model="form" :label-col-props="{ span: 6 }" :wrapper-col-props="{ span: 16 }">
                            <a-form-item :label="t('finance.withdrawal.withdrawableAmount')" >
                                <div class="withdrawable-amount">{{ form.withdrawableAmount }}</div>
                            </a-form-item>
                            <a-form-item :label="t('finance.withdrawal.withdrawalAmount')" required>
                                <a-input v-model:value="form.amount"></a-input>
                            </a-form-item>
                            <a-form-item :label="t('finance.withdrawal.withdrawBankCard')" required>

                                <div class="bank-card-options">
                                    <div :class="choosenBankCard === item.id ? 'bank-card-item active' : 'bank-card-item'"
                                        v-for="item in bankCardOptions" :key="item.id">
                                        <div class="bank-name">{{ item.name }}</div>
                                        <div class="card-number">{{ `${item.owner}(${item.cardNumber})` }}</div>
                                    </div>
                                    <a-button class="add-bank-card-btn" type="primary" @click="handleClickAddBankCard()">
                                        <template #icon>
                                            <icon-plus />
                                        </template>{{ t('finance.withdrawal.addBankCard') }}</a-button>
                                </div>
                            </a-form-item>
                            <a-form-item :label="t('finance.withdrawal.withdrawalHandlingFee')">
                                <span class="hight-light">{{ withdrawalConfig.commission }}</span>
                                <span>{{ t('finance.withdrawal.withdrawalHandlingFeeTips') }}</span>
                            </a-form-item>
                            <a-form-item :label="t('finance.withdrawal.actualOutGoingAmount')">
                                <span class="hight-light">{{ form.actualOutGoingAmount }}</span>
                                <span>{{ t('finance.withdrawal.actualOutGoingAmountTips') }}</span>
                            </a-form-item>
                            <a-form-item :label="t('finance.withdrawal.withdrawalReviewCycle')">
                                <span>{{ withdrawalConfig.auditCycle }}</span>
                                <span>{{ t('finance.withdrawal.withdrawalReviewCycleTips') }}</span>
                            </a-form-item>
                            <a-form-item>
                                <a-space>
                                    <a-button type="primary" html-type="submit">{{ t('button.submit') }}</a-button>
                                    <a-button>{{ t('button.cancel') }}</a-button>
                                </a-space>
                            </a-form-item>
                        </a-form>
                    </div>
                </a-col>
            </a-row>
            <add-bank-card ref="addBankCardRef"/>

        </div>
    </div>
</template>
<script lang="ts" setup>
import { ref,inject } from 'vue';
import { useI18n } from 'vue-i18n';
import addBankCard from './components/addBankCard.vue';
const { t } = useI18n();

const addBankCardRef = ref(null);
const withdrawalConfig = {
    commission: 2.00,
    auditCycle: 3

}

const choosenBankCard = ref(1);

const bankCardOptions = ref([
    { id: 1, name: '中国银行', cardNumber: '**** **** **** 1234', owner: '张三' },
    { id: 2, name: '中国农业银行', cardNumber: '**** **** **** 5678', owner: '李四' },
])
const form = ref({
    withdrawableAmount: 2000.89,
    amount: null,
    actualOutGoingAmount: 1889.6,

});


const handleClickAddBankCard = () => {
    if (addBankCardRef.value) {
        addBankCardRef.value.handleOpen();
    }
}


</script>
<style lang="scss" scoped>
.finance-withdrawal-apply-page {
    .withdrawal-tips {
        font-family: PingFang SC;
        font-size: 14px;
        font-weight: 400;
        line-height: 22px;
        text-align: left;

    }

    .withdrawal-form-box {
        margin-top: 50px;

        .withdrawable-amount{
            font-weight: 600;
            font-size: 20px;
            color: rgb(var(--danger-6));
        }

        .hight-light {
            color: #FF6A00;
        }
    }

    .bank-card-options {
        width: 100%;

        .bank-card-item {
            width: 100%;
            height: 40px;
            display: flex;
            flex-direction: row;
            justify-content: flex-start;
            align-items: center;
            padding: 0 16px;
            background-color: #F2F3F5;
            cursor: pointer;

            .bank-name {
                color: #1D2129;
                margin-right: 30px;
                font-weight: 600;

            }

            .card-number {
                color: #666666;
            }
        }

        .active {
            background-color: rgba(255, 102, 57, 0.36);
        }

        .add-bank-card-btn{
            margin-top: 10px;
        }
    }

}
</style>