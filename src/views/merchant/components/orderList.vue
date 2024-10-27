<!-- 商家订单 -->
<template>
    <div class="shop-order-list-comp">

        <a-table size="small" :columns="columns" :data="data" :pagination="false">

            <template #action="{ record }">
                <a-button type="text" v-if="record.orderStatus == 3">{{ $t("button.cancel") }}</a-button>
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
import { shopOrderList, shopPackageApprove, shopPackageOnlineStatusChange } from '@/api/merchant';
import { useI18n } from 'vue-i18n';
const { t } = useI18n()

const props = defineProps({
    shopId: String
})

const orderStatusMap = ref({
    '0': '已完成',
    '1': '已取消',
    '2': '待使用',
    '3': '待付款',
    '4': '退款中',
    '5': '退款完成',
    '6': '微信支付回调失败',
    '7': '微信退款回调失败',
})
const data = ref([])
const columns = ref([

    { title: t('merchant.order.orderNumber'), dataIndex: 'id', key: 'id', width: 100, ellipsis: true },
    { title: t('merchant.setMenu.name'), dataIndex: 'shopComboName', key: 'shopComboName', width: 100, ellipsis: true },
    { title: t('merchant.order.num'), dataIndex: 'number', key: 'number', width: 100, ellipsis: true },
    { title: t('merchant.order.merchantNickname'), dataIndex: 'shopName', key: 'shopName', width: 100, ellipsis: true },
    { title: t('merchant.order.orderAmount'), dataIndex: 'orderAmount', key: 'orderAmount', width: 100, ellipsis: true },
    { title: t('merchant.order.serviceCharge'), dataIndex: 'serviceCost', key: 'serviceCost', width: 100, ellipsis: true },
    { title: t('merchant.order.status'), dataIndex: 'orderStatusName', key: 'orderStatusName', width: 160, ellipsis: true },
    { title: t('merchant.order.customerNickname'), dataIndex: 'buyerName', key: 'buyerName', width: 160, ellipsis: true },
    { title: t('merchant.order.orderTime'), dataIndex: 'orderDate', key: 'orderDate', width: 160, ellipsis: true },
    { title: t('table.operation'), dataIndex: 'operation', key: 'operation', width: 80, ellipsis: true, slotName: 'action', fixed: 'right' },
])

const pageSize = ref(20)
const pageNum = ref(1)
const total = ref(0)

const fetchData = (page, size) => {
    let params = {
        shopId: props.shopId,
        pageNum: page || pageNum.value,
        pageSize: size || pageSize.value
    }/*  */
    shopOrderList(params).then(res => {
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
.shop-order-list-comp {
    .pagination-box {
        display: flex;
        justify-content: flex-end;
        margin-top: 20px;
    }
}
</style>