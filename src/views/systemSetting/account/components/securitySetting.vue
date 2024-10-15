<template>
    <div class="account-securty-setting-comp">
        <div class="setting-item">
            <div class="item-label">{{ t('account.securitySetting.password') }}</div>
            <div class="item-info">
                <div class="desc">{{ t('account.securitySetting.passwordTips') }}</div>
                <div class="actions"><a-button type="text" @click="handleEditPws()">{{ t('button.edit') }}</a-button></div>
            </div>
        </div>
        <div class="setting-item">
            <div class="item-label">{{ t('account.securitySetting.secureEmail') }}</div>
            <div class="item-info">
                <div class="desc">{{ t('account.securitySetting.secureEmailTips') }}</div>
                <div class="actions"><a-button type="text" @click="handleSetEmial()">{{ t('button.setting') }}</a-button></div>
            </div>
        </div>

        <reset-email ref="resetEmailRef" />
        <reset-password ref="resetPasswordRef" />
    </div>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { ref } from 'vue';
import resetEmail from './resetEmail.vue';
import resetPassword from './resetPws.vue';
const { t } = useI18n();

const resetEmailRef = ref(null);
const resetPasswordRef = ref(null);

const handleSetEmial = () => {
    resetEmailRef.value.handleOpen();
}

const handleEditPws = () => {
    resetPasswordRef.value.handleOpen();
}

</script>
<style lang="scss" scoped>
.account-securty-setting-comp {
    display: flex;
    flex-direction: column;

    .setting-item {
        display: flex;
        justify-content: flex-start;
        align-items: flex-start;
        padding-top: 30px;
        box-sizing: border-box;


        .item-label {
            width: 72px;
            font-size: 14px;
            font-weight: 500;
            color: #4E5969;
        }

        .item-info {
            height: 76px;
            width: calc(100% - 72px);
            border-bottom: 1px solid #E5E6EB;
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 13px;
            height: 46px;

            .desc {
                color: #4E5969;
                font-size: 14px;
            }

            .actions {
                margin-left: 16px;
            }
        }
    }


}
</style>