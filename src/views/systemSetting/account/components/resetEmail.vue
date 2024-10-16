<template>
    <a-modal v-model:visible="visible" @ok="handleOk" @cancel="handleCancel" width="455px"
        :ok-text="t('button.confirm')" :cancel-text="t('button.cancel')" :body-style="{ padding: 0 }" title-align="start">
        <template #title>
            {{ t('account.securitySetting.editEmail') }}
        </template>
        <div class="reset-pws-body">

            <div class="form-box">
                <a-form :model="form" :label-col-props="{ span: 8 }" :wrapper-col-props="{ span: 16 }">
                    <a-form-item :label="t('account.securitySetting.originalEmailAddress')" required hide-asterisk>
                        <a-input></a-input>
                    </a-form-item>
                    <a-form-item :label="t('account.securitySetting.verificationCode')" required hide-asterisk>
                        <a-input v-model="form.bankOfDeposit">
                            <template #append>
                                <span class="get-verifical-code">{{ t('account.securitySetting.obtainVerificationCode') }}</span>
                            </template>
                        </a-input>
                    </a-form-item>
                    <a-form-item :label="t('account.securitySetting.newEmailAddress')" required hide-asterisk>
                        <a-input v-model="form.bankCardNumber">
                        </a-input>
                    </a-form-item>
                    <a-form-item :label="t('account.securitySetting.enterTheNewEmailAgain')" required hide-asterisk>
                        <a-input v-model="form.accountName"></a-input>
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
.reset-pws-body {
    margin-top: 7px;
    padding: 0px 15px;

    .form-box {
        padding: 0px 25px;
    }
}
</style>