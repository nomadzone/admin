<!-- 商家列表 -->
<template>
    <div class="common-page-container">
        <div class="common-panel">
            <div class="common-query-form-container">
                <div class="form-item-group">
                    <a-form :model="form" layout="inline">
                        <a-grid :cols="queryFormItemLayout" style="width: 100%;">
                            <a-grid-item class="demo-item">
                                <a-form-item label-col-flex="80px" field="name" :label="$t('merchant.index.name')">
                                    <a-input v-model="form.name" />
                                </a-form-item>
                            </a-grid-item>
                            <a-grid-item class="demo-item">
                                <a-form-item label-col-flex="80px" field="status" :label="$t('merchant.index.status')">
                                    <a-select v-model="form.status" />
                                </a-form-item>

                            </a-grid-item>
                            <a-grid-item class="demo-item">
                                <a-form-item label-col-flex="80px" field="category"
                                    :label="$t('merchant.index.category')">
                                    <a-select v-model="form.category" />
                                </a-form-item>
                            </a-grid-item>
                            <a-grid-item class="demo-item">
                                <a-form-item label-col-flex="80px" field="createTime"
                                    :label="$t('merchant.index.createTime')">
                                    <a-select v-model="form.createTime" />
                                </a-form-item>
                            </a-grid-item>
                        </a-grid>
                    </a-form>
                </div>
                <a-divider class="query-form-divider" direction="vertical" />
                <div class="query-actions">
                    <a-button type="primary">
                        <template #icon>
                            <icon-search />
                        </template>
                        {{ $t("button.search") }}
                    </a-button>
                    <a-button type="outline">
                        <template #icon>
                            <icon-refresh />

                        </template>
                        {{ $t("button.reset") }}

                    </a-button>
                </div>
            </div>

            <a-divider />



            <div class="data-box">
                <div class="table-header-row">
                    <div class="left">
                        <a-button class="left-btn">{{ $t('merchant.index.batchApproval') }}</a-button>
                        <a-button>{{ $t('merchant.index.batchNotPassed') }}</a-button>
                    </div>
                    <a-button> <template #icon>
                            <icon-download />
                        </template>{{ $t('merchant.index.download') }}</a-button>
                </div>

                <div class="common-table-container">

                    <a-table size="small" :columns="columns" :data="data">
                        <template #paymentMethod="{ record }">
                            <div>
                                <span>{{ record?.paymentMethod }}</span>/
                                <span>{{ record?.paymentNumber }}</span>

                            </div>
                        </template>
                        <template #action="{ record }">
                            <a-button type="text" @click="handleShowDetail(record)">{{ $t("button.detail") }}</a-button>
                        </template>
                    </a-table>
                </div>
            </div>

        </div>

    </div>
</template>
<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter, RouteRecordRaw } from 'vue-router';
const router = useRouter();

const { t } = useI18n()
const queryFormItemLayout = { xs: 1, sm: 2, md: 2, lg: 2, xl: 2, xxl: 2 }

const form = ref({
    name: '',
    status: '',
    categroy: '',
    createTime: null

})


const columns = ref([
    { title: t('merchant.index.id'), dataIndex: 'id', key: 'id', width: 100, ellipsis: true },
    { title: t('merchant.index.name'), dataIndex: 'name', key: 'name', width: 160, ellipsis: true },
    { title: t('merchant.index.category'), dataIndex: 'category', key: 'category', width: 100, ellipsis: true },
    { title: t('merchant.index.status'), dataIndex: 'status', key: 'status', width: 120, ellipsis: true },
    { title: t('merchant.index.packageNum'), dataIndex: 'packageNum', key: 'packageNum', width: 120, ellipsis: true },
    { title: t('merchant.index.accumulatedRevenue'), dataIndex: 'accumulatedRevenue', key: 'accumulatedRevenue', width: 200, ellipsis: true, slotName: 'paymentMethod' },
    { title: t('merchant.index.accumulatedExpenses'), dataIndex: 'accumulatedExpenses', key: 'accumulatedExpenses', width: 180, ellipsis: true },
    { title: t('table.operation'), dataIndex: 'operation', key: 'operation', width: 120, ellipsis: true, slotName: 'action', fixed: 'right' },

])

const data = ref([{}
])

// 查看详情
const handleShowDetail = (row: any) => {
    router.push({
        name: 'merchantDetail',
    });
}

</script>

<style lang="scss" scoped>
.table-header-row {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: 20px;
    align-items: center;

    .left {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;

        .left-btn {
            margin-right: 10px;
        }
    }
}
</style>