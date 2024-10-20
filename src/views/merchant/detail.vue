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
                                <!-- <a-tag></a-tag> -->
                            </a-descriptions-item>
                            <a-descriptions-item label="商家状态">
                                <!-- <a-tag></a-tag> -->
                            </a-descriptions-item>
                            <a-descriptions-item label="商家ID">
                                <!-- <a-tag></a-tag> -->
                            </a-descriptions-item>
                            <a-descriptions-item label="商家类型">
                                <!-- <a-tag></a-tag> -->
                            </a-descriptions-item>
                        </a-descriptions>

                    </div>


                    <a-button type="primary">下线商家</a-button>
                </div>

            </div>
            <div class="body-content">


                <a-tabs type="rounded">
                    <a-tab-pane key="1" title="基础信息">
                    </a-tab-pane>
                    <a-tab-pane key="2" title="认证信息">
                    </a-tab-pane>
                    <a-tab-pane key="3" title="套餐列表">
                    </a-tab-pane>
                    <a-tab-pane key="4" title="订单记录">
                    </a-tab-pane>
                    <a-tab-pane key="5" title="收支明细">
                    </a-tab-pane>
                </a-tabs>
            </div>

        </div>

    </div>
</template>
<script lang="ts" setup>
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
        height: calc(100% - 160px - 16px);
        background-color: #fff;
        width: 100%;
        padding: 20px 12px;

        .arco-tabs {
            height: 100%;

            ::v-deep .arco-tabs-content {
                height: calc(100% - 40px) !important;
            }
        }




    }
}
</style>