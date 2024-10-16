<template>
    <a-modal v-model:visible="visible" @ok="handleOk" @cancel="handleCancel" width="455px"
        :ok-text="t('button.confirm')" :cancel-text="t('button.cancel')" :body-style="{padding: 0}" title-align="start">
        <template #title>
            {{ t('finance.withdrawal.withdrawBankCard') }}
        </template>
        <div class="add-bank-card-body">
            <div class="tips-box">
                <div class="tips-item">1.{{ t('finance.withdrawal.addBankCardTips1') }}</div>
                <div class="tips-item">2.{{ t('finance.withdrawal.addBankCardTips2') }}</div>
            </div>
            <div class="form-box">
                <a-form :model="form" :label-col-props="{ span: 6 }" :wrapper-col-props="{ span: 18 }">
                    <a-form-item :label="t('finance.withdrawal.withdrawalMethod')" required>
                        <a-radio-group v-model="form.withdrawalMethod">
                            <a-radio value="1">{{ t('finance.withdrawal.forPrivateBankAccounts') }}</a-radio>
                            <a-radio value="2">{{ t('finance.withdrawal.corporateBankAccount') }}</a-radio>
                        </a-radio-group></a-form-item>
                    <a-form-item :label="t('finance.withdrawal.bankOfDeposit')" required>
                        <a-select v-model="form.bankOfDeposit"></a-select>
                    </a-form-item>
                    <a-form-item :label="t('finance.withdrawal.bankCardNumber')" required>
                        <a-input v-model="form.bankCardNumber"></a-input>
                    </a-form-item>
                    <a-form-item :label="t('finance.withdrawal.accountName')" required>
                        <a-input v-model="form.accountName"></a-input>
                    </a-form-item>
                    <a-form-item :label="t('finance.withdrawal.accountOpeningRegion')" required>
                        <a-input v-model="form.accountOpeningRegion"></a-input>
                    </a-form-item>
                    <a-form-item :label="t('finance.withdrawal.nameOfBank')" required>
                        <a-input v-model="form.nameOfBank"></a-input>
                        <template #extra>
                            <div>{{ t('finance.withdrawal.addBankCardTips3') }}</div>
                        </template>
                    </a-form-item>
                </a-form>
            </div>
        </div>
    </a-modal>

</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const visible = ref(false)

const form = ref({
    withdrawalMethod: '',
    bankOfDeposit: '',
    bankCardNumber: '',
    accountName: '',
    accountOpeningRegion: '',
    nameOfBank: ''
})
const handleOpen = () => {
    visible.value = true

}
const handleOk = () => {
    visible.value = false
}

const handleCancel = () => {
    visible.value = false
}

defineExpose({
    handleOpen
})

</script>

<style lang="scss" scoped>
.add-bank-card-body {
    margin-top: 7px;
    padding: 0px 15px;
    .tips-box {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
        margin-bottom: 20px;

        .tips-item {
            //styleName: 12/CN-Regular;
            font-family: PingFang SC;
            font-size: 12px;
            font-weight: 400;
            line-height: 20px;
            text-align: left;
            color: rgba(134, 144, 156, 1);

        }
    }

    .form-box {
        padding: 0px 25px;
    }
}
</style>