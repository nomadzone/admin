<template>
    <div class="common-page-container store-verifie-page">
        <div class="common-panel">
            <div class="common-panel-header">
                <div class="header-title">{{ t('menu.store.settlement') }}</div>
                <div class="header-actions">
                    <a-button type="primary">{{ t('button.edit') }}</a-button>
                </div>
            </div>

            <div class="store-settlement-form-box">
                <a-row>
                    <a-col :xs="{ span: 24 }" :sm="{ span: 24 }" :md="{ span: 18, offset: 3 }" :lg="{ span: 16, offset: 4 }"
                        :xl="{ span: 12, offset: 6 }" :xxl="{ span: 8, offset: 8 }">

                        <a-form :model="form" :label-col-props="{ span: 6 }" :wrapper-col-props="{ span: 18 }">
                            <a-form-item :label="t('store.settlement.cardholderName')" required>
                                <a-input v-model:model="form.cardholderName" />
                            </a-form-item>

                            <a-form-item :label="t('store.settlement.openingBank')" required>
                                <a-select v-model:model="form.bankName"></a-select>
                            </a-form-item>

                            <a-form-item :label="t('store.settlement.cardNumber')" required>
                                <a-input v-model:model="form.cardNumber" />
                            </a-form-item>
                        </a-form>
                    </a-col>

                </a-row>

            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { ref } from 'vue';
const { t } = useI18n();

const form = ref({
    cardholderName: '',
    bankName: '',
    cardNumber: '',

})
</script>

<style lang="scss" scoped>
.store-settlement-form-box {
    margin-top: 35px;
}
</style>