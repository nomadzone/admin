<template>
    <div class="common-page-container account-detail-page">
        <div class="common-panel account-detail-top">
            <div class="avatar-box">
                <a-avatar :src="accountInfo.avatar" size="large" v-if="accountInfo.avatar" />
                <img v-else src="../../../assets/icons/account-default-avatar.svg" alt="avatar" />
            </div>
            <div class="info-box">
                <a-descriptions style="margin-top: 20px" :data="infoData" size="medium" :column="1" />
            </div>
        </div>
        <div class="common-panel account-detail-body">
            <a-tabs type="rounded" size="medium">
                <a-tab-pane key="1" :title="t('account.basicInfo')">
                    <basic-info-component />
                </a-tab-pane>
                <a-tab-pane key="2" :title="t('account.securitySetting')">
                    <security-setting-component />
                </a-tab-pane>

            </a-tabs>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

import BasicInfoComponent from './components/basicInfo.vue';
import SecuritySettingComponent from './components/securitySetting.vue';

const { t } = useI18n();

const accountInfo = {
    avatar: null,
    phone: '123456789',
    username: 'admin',
    roles: 'admin',
    status: true
}

const infoData = ref([
    {
        label: t('account.username'),
        value: accountInfo.username
    },
    {
        label: t('account.status'),
        value: accountInfo.status
    },
    {
        label: t('account.roles'),
        value: accountInfo.roles
    },
])
</script>

<style lang="scss" scoped>
.account-detail-page {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;

    .account-detail-top {
        height: 180px;
        padding: 0px 40px;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        margin-bottom: 10px;
        flex: none;

        .avatar-box {
            margin-right: 50px;
        }

    }

    .account-detail-body {
        flex: 1;
    }
}
</style>