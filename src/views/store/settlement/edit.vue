<template>
    <div class="common-page-container store-verifie-page">
        <div class="common-panel">
            <div class="common-panel-header">
                <div class="header-title">{{ t('menu.store.settlement') }}</div>
                <div class="header-actions">
                    <a-button>{{ t('button.reset') }}</a-button>
                    <a-button type="primary">{{ t('button.edit') }}</a-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { ref } from 'vue';
const { t } = useI18n();
</script>

<style lang="scss" scoped></style>