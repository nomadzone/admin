<!-- 结算明细 -->
<template>
    <div class="common-page-container">
        <div class="merchant-detail-page">
            <div class="top-info">
                <div class="img-box"></div>
                <div class="info-box">
                    <div class="desc">
                        <a-descriptions :column="2">
                            <a-descriptions-item label="商家名称">
                                {{ basicInfo.name }}
                            </a-descriptions-item>
                            <a-descriptions-item label="商家状态">
                                <span>{{ approveStatusMap[basicInfo.isAuth] }}</span>
                            </a-descriptions-item>
                            <a-descriptions-item label="商家ID">
                                {{ basicInfo.id }}
                            </a-descriptions-item>
                            <a-descriptions-item label="商家类型">
                                <!-- <a-tag></a-tag> -->
                                {{ authTypeMap[identifyInfoData.authType] }}
                            </a-descriptions-item>
                        </a-descriptions>

                    </div>


                    <a-button type="primary">下线商家</a-button>
                </div>

            </div>
            <div class="body-content">


                <a-tabs type="rounded">
                    <a-tab-pane key="1" title="基础信息">
                        <BasicInfo :info="basicInfo" />
                    </a-tab-pane>
                    <a-tab-pane key="2" title="认证信息">
                        <IdentifyInfo :info="identifyInfoData" />
                    </a-tab-pane>
                    <a-tab-pane key="3" title="套餐列表">
                        <SetMenu :shopId="basicInfo.id" />
                    </a-tab-pane>
                    <a-tab-pane key="4" title="订单记录">
                        <OrderList :shopId="basicInfo.id" />
                    </a-tab-pane>
                    <a-tab-pane key="5" title="收支明细">
                        <Settlement :shopId="basicInfo.id" />
                    </a-tab-pane>
                </a-tabs>
            </div>

        </div>

    </div>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import IdentifyInfo from './components/identifyInfo.vue';
import { useI18n } from 'vue-i18n';
import BasicInfo from './components/basicInfo.vue';
import SetMenu from './components/setMenu.vue';
import OrderList from './components/orderList.vue';
import Settlement from './components/settlement.vue';
import { merchantIdentifyList, shopList } from '@/api/merchant';
const { t } = useI18n()

const router = useRouter();
const approveStatusMap = {
    '0': t('merchant.index.identifyed'),
    '1': t('merchant.index.authenticationFailed'),
    '2': t('merchant.index.pendingApproval'),
    '4': t('merchant.index.toBeCertified')
}

const authTypeMap = {
    '0': t('merchant.index.person'),
    '1': t('merchant.index.enterprise')
}

const info = ref({
    shopName: '商家名称',
    shopStatus: '商家状态',
    shopId: '商家ID',
    shopType: '商家类型',
    isAuth: router.currentRoute.value.query.isAuth
})

// 查询商家信息

let basicInfo = ref({})
const getMerchantInfo = async () => {
    let params = {
        id: router.currentRoute.value.query.id,
        pageSize: 1,
        pageNum: 1
    }
    let res = await shopList(params);
    basicInfo.value = res.rows[0];


}

// 获取商家认证信息
let identifyInfoData = ref({})
const getMerchantIdentifyInfo = async () => {
    let params = {
        shopId: router.currentRoute.value.query.id,
        pageSize: 1,
        pageNum: 1
    }

    let res = await merchantIdentifyList(params);
    identifyInfoData.value = res.rows[0];

}

onMounted(() => {
    getMerchantInfo();
    getMerchantIdentifyInfo();
})

</script>

<style lang="scss" scoped>
.merchant-detail-page {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;

    .top-info {
        height: 160px;
        width: 100%;
        background-color: #fff;
        margin-bottom: 16px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        padding: 0px 40px;

        .img-box {
            width: 120px;
            height: 120px;
            border-radius: 100%;
            background-color: #f0f0f0;
        }

        .info-box {
            width: calc(100% - 120px - 40px);
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;

            .desc {
                width: calc(100% - 100px);
            }
        }
    }

    .body-content {
        height: calc(100% - 180px);
        background-color: #fff;
        width: 100%;
        padding: 20px 12px;
        overflow: hidden;

        .arco-tabs {
            height: 100%;
            overflow: hidden;

            ::v-deep .arco-tabs-content {
                height: calc(100% - 80px) !important;

                .arco-tabs-content-list {
                    height: 100%;

                }

                .arco-tabs-content-item {
                    height: 100%;

                    .arco-tabs-pane {
                        height: 100%;

                    }
                }
            }
        }




    }
}
</style>