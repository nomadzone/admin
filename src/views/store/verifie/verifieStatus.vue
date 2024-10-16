<template>
    <div class="common-page-containe company-verifie-comp">
        <div class="common-panel">
            <div class="verifie-status-box">
                <div class="top-box">
                    <div class="status-icon">
                        <img src="../../../assets/icons/store/passed.svg" v-if="approveInfo?.isAuth == 0" />
                        <img src="../../../assets/icons/store/failed.svg" v-if="approveInfo?.isAuth == 0" />
                        <img src="../../../assets/icons/store/review.svg" v-if="approveInfo?.isAuth == 2" />
                    </div>
                    <div v-if="approveInfo?.authType == 1">
                        <div class="status-text" v-if="approveInfo?.isAuth == 0">{{
                            t('store.verifie.companyVarifiePassed') }}</div>
                        <div class="status-text" v-if="approveInfo?.isAuth == 1">{{
                            t('store.verifie.companyVarifieFailed') }}</div>
                        <div class="status-text" v-if="approveInfo?.isAuth == 2">{{ t('store.verifie.companyReview') }}
                        </div>

                        <div class="status-desc" v-if="approveInfo?.isAuth == 0"></div>
                        <div class="status-desc" v-if="approveInfo?.isAuth == 1">{{
                            t('store.verifiec.companyVarifieFailedTips') }}
                        </div>
                        <div class="status-desc" v-if="approveInfo?.isAuth == 2">{{
                            t('store.verifie.companyReviewTips') }}</div>

                    </div>

                    <div v-else>
                        <div class="status-text" v-if="approveInfo?.isAuth == 0">{{
                            t('store.verifie.personVarifiePassed') }}</div>
                        <div class="status-text" v-if="approveInfo?.isAuth == 1">{{
                            t('store.verifie.personVarifieFailed') }}</div>
                        <div class="status-text" v-if="approveInfo?.isAuth == 2">{{ t('store.verifie.personReview') }}
                        </div>
                        <div class="status-desc" v-if="approveInfo?.isAuth == 0"></div>
                        <div class="status-desc" v-if="approveInfo?.isAuth == 1">{{
                            t('store.verifiec.personVarifieFailedTips') }}
                        </div>
                        <div class="status-desc" v-if="approveInfo?.isAuth == 2">{{ t('store.verifie.personReviewTips')
                            }}</div>
                    </div>

                </div>
                <div class="info-card">
                    <div class="title-text">
                        {{ t('store.verifie.authenticationInformation') }}
                    </div>

                    <div class="info-item">
                        <div class="item-label">{{ t("store.verifie.companyName") }}</div>
                        <div class="item-value">{{ approveInfo?.companyName }}</div>
                    </div>
                    <div class="info-item">
                        <div class="item-label">{{ t("store.verifie.companyContacts") }}</div>
                        <div class="item-value">{{ approveInfo?.name }}</div>
                    </div>

                    <div class="info-item">
                        <div class="item-label">{{ t("store.verifie.companyPhone") }}</div>
                        <div class="item-value">{{ approveInfo?.phone }}</div>
                    </div>
                    <div class="info-item">
                        <div class="item-label">{{ t("store.verifie.businessLicenseRegistrationNumber") }}</div>
                        <div class="item-value">{{ approveInfo?.businessLicenseCode }}</div>
                    </div>

                    <div class="info-item">
                        <div class="item-label">{{ t("store.verifie.license") }}</div>
                        <div class="item-value">
                            <a-image width="80" height="80" :src="approveInfo?.businessLicenseUrl" />
                        </div>
                    </div>
                    <div class="info-item">
                        <div class="item-label">{{ t("store.verifie.frontId") }}</div>
                        <div class="item-value">
                            <div style="display: flex;">
                                <a-image width="80" height="80" :src="approveInfo?.papersTopUrl"
                                    style="margin-right: 10px;" />
                                <a-image width="80" height="80" :src="approveInfo?.papersBottomUrl" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import { defineProps } from 'vue'
const { t } = useI18n()

// 定义接收的 props
const props = defineProps({
    status: Number,
    type: String,
    approveInfo: {
        type: Object,
        default: () => {
            return {}
        }
    }
})



</script>

<style lang="scss" scoped>
.verifie-status-box {
    width: 440px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;

    .top-box {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
    }

    .status-icon {
        width: 100px;
        height: 100px;
        margin-bottom: 4px;

    }

    .status-text {
        font-size: 22px;
        margin-bottom: 6px;
        text-align: center;

    }

    .status-text {
        min-height: 30px;
        white-space: pre-wrap;
        color: #666161;
        text-align: center;

    }

    .info-card {
        margin-top: 10px;
        background-color: #F2F4F5;
        padding: 12px 21px;
        border-radius: 10px;
        width: 100%;
        min-height: 200px;

        .title-text {
            font-size: 22px;
            color: #000;
            margin-bottom: 20px;
        }

        .info-item {
            display: flex;
            flex-direction: row;
            justify-content: flex-start;
            align-items: flex-start;
            margin-bottom: 26px;
            font-size: 14px;

            .item-label {
                width: 120px;
                font-size: 16px;
                color: #666161;
            }

        }


    }
}
</style>