<template>
 <div class="common-page-container finance-withdrawal-apply-page">
        <div class="common-panel">
            <div class="common-panel-header">
                <div class="header-title">{{ t('finance.withdrawal.apply') }}</div>
                <div class="header-actions">
                </div>
            </div>
            <a-row>
            <a-col :xs="{span: 24}" :sm="{span: 18,offset:3}" :md="{span: 16, offset:4}" :lg="{span: 14, offset: 5 }" :xl="{span: 12, offset: 6}" :xxl="{span: 12, offset: 6}">
                <div class="roles-save-form-box">

                    <a-form :model="form">
                        <a-form-item :label="t('systemSetting.roles.roleName')" required>
                            <a-input></a-input>
                        </a-form-item>
                        <a-form-item :label="t('systemSetting.roles.desc')">
                            <a-textarea  allow-clear/>
                        </a-form-item>
                        <a-form-item :label="t('systemSetting.roles.access')"></a-form-item>
                    </a-form>

                </div>
            
            </a-col>
        </a-row>
        </div>  
       
       
    </div>  

</template>
<script lang="ts" setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()


const form = ref({
    id: null
});

</script>
 <style lang="scss" scoped>
.roles-save-form-box {
    margin-top: 48px;
}
</style>