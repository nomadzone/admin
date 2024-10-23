<!-- 商家套餐 -->

<template>
    <div class="shop-set-menu-comp">

        <a-table size="small" :columns="columns" :data="data" :pagination="false">

            <template #action="{ record }">
                <a-button type="text" @click="handleShowDetail(record)">{{ $t("button.submit") }}</a-button>
                <a-button type="text" @click="handleShowDetail(record)">{{ $t("merchant.index.pass") }}</a-button>
                <a-button type="text" @click="handleShowDetail(record)">{{ $t("merchant.index.reject") }}</a-button>
                <a-button type="text" @click="handleShowDetail(record)">{{ $t("merchant.index.goOnline") }}</a-button>
                <a-button type="text" @click="handleShowDetail(record)">{{ $t("merchant.index.goOffline") }}</a-button>

            </template>
        </a-table>
        <div class="pagination-box">
            <a-pagination :total="total" :current="pageNum" :pageSize="pageSize" @change="handleChangePage"
                @change-page-size="handleChangePageSize" />
        </div>
    </div>
</template>

<script setup>

import { ref, defineProps, watch } from 'vue';
import { shopPackageList, shopPackageApprove, shopPackageOnlineStatusChange } from '@/api/merchant';
import { useI18n } from 'vue-i18n';
const { t } = useI18n()

const props = defineProps({
    shopId: String
})

const data = ref([])
const columns = ref([

    { title: t('merchant.setMenu.id'), dataIndex: 'id', key: 'id', width: 100, ellipsis: true },
    { title: t('merchant.setMenu.name'), dataIndex: 'comboName', key: 'comboName', width: 100, ellipsis: true },
    { title: t('merchant.setMenu.salesVolume'), dataIndex: 'number', key: 'number', width: 100, ellipsis: true },
    { title: t('merchant.setMenu.packagePrice'), dataIndex: 'comboPrice', key: 'comboPrice', width: 100, ellipsis: true },
    { title: t('merchant.setMenu.status'), dataIndex: 'comboStatus', key: 'comboStatus', width: 100, ellipsis: true },
    { title: t('merchant.setMenu.endTime'), dataIndex: 'usedTimeEnd', key: 'usedTimeEnd', width: 100, ellipsis: true },
    { title: t('merchant.setMenu.latestChangeTime'), dataIndex: 'updateTime', key: 'updateTime', width: 160, ellipsis: true },

    { title: t('table.operation'), dataIndex: 'operation', key: 'operation', width: 180, ellipsis: true, slotName: 'action', fixed: 'right' },
])

const pageSize = ref(10)
const pageNum = ref(1)
const total = ref(0)

const fetchData = (page, size) => {
    let params = {
        shopId: props.shopId,
        pageNum: page || pageNum.value,
        pageSize: size || pageSize.value
    }/*  */
    shopPackageList(params).then(res => {
        if (res.code == 0) {
            data.value = res.rows;
            total.value = res.total;
        }
    }).catch(err => {
        console.log('shopPackageList error:', err);
    });
}

const handleChangePage = (page) => {
    pageNum.value = page
    fetchData(page)
}

const handleChangePageSize = (size) => {
    pageSize.value = size
    fetchData(1, size)
}

watch(() => props.shopId, (newVal) => {
    if (newVal) {
        fetchData(1)
    }
}, { immediate: true });
</script>

<style lang="scss" scoped>
.shop-set-menu-comp {
    .pagination-box {
        display: flex;
        justify-content: flex-end;
        margin-top: 20px;
    }
}
</style>