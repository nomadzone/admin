<!-- 商家套餐 -->

<template>
    <div class="shop-set-menu-comp">

        <a-table size="small" :columns="columns" :data="data" :pagination="false">
            <template #comboStatus="{ record }">
                <span>{{ statusMap[record.comboStatus] }}</span>
            </template>
            <template #action="{ record }">
                <div style="display: flex">
                    <a-button type="text" @click="handleShowDetail(record)">{{ $t("button.view") }}</a-button>
                    <a-button type="text" @click="handleExamine(record, 1)" v-if="record.comboStatus == 2">{{
                        $t("merchant.index.pass") }}</a-button>
                    <a-button type="text" @click="handleExamine(record, 3)" v-if="record.comboStatus == 2">{{
                        $t("merchant.index.reject") }}</a-button>
                    <a-button type="text" @click="handleChangeStatus(record, 0)" v-if="record.comboStatus == 1">{{
                        $t("merchant.setMenu.goOnline") }}</a-button>
                    <a-button type="text" @click="handleChangeStatus(record, 1)" v-if="record.comboStatus == 0">{{
                        $t("merchant.setMenu.goOffline") }}</a-button>
                </div>
            </template>
        </a-table>
        <div class="pagination-box">
            <a-pagination :total="total" :current="pageNum" :pageSize="pageSize" @change="handleChangePage"
                @change-page-size="handleChangePageSize" />
        </div>
        <a-modal title-align="start" v-model:visible="rejectModalVisible" @ok="handleConfirmReject"
            @cancel="handleCancelReject" :title="t('merchant.index.rejectModalTitle')">
            <a-form>
                <a-form-item :label-col-props="{ span: 8 }" :wrapper-col-props="{ span: 16 }"
                    :label="t('merchant.index.rejectLabel')" label-width="180px">
                    <a-input v-model="rejectReason" :placeholder="t('merchant.index.rejectLabel')" />
                </a-form-item>
            </a-form>
        </a-modal>
    </div>
</template>

<script setup>

import { ref, defineProps, watch } from 'vue';
import { shopPackageList, shopPackageApprove, shopPackageOnlineStatusChange } from '@/api/merchant';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { Modal, Message } from '@arco-design/web-vue';

const { t } = useI18n()
const router = useRouter()

const props = defineProps({
    shopId: String
})

const statusMap = {
    '0': t('merchant.setMenu.goOnline'),
    '1': t('merchant.setMenu.goOffline'),
    '2': t('merchant.index.pendingApproval'),
    '3': t('merchant.index.authenticationFailed'),


}

const data = ref([])
const columns = ref([

    { title: t('merchant.setMenu.id'), dataIndex: 'id', key: 'id', width: 100, ellipsis: true },
    { title: t('merchant.setMenu.name'), dataIndex: 'comboName', key: 'comboName', width: 100, ellipsis: true },
    { title: t('merchant.setMenu.salesVolume'), dataIndex: 'number', key: 'number', width: 100, ellipsis: true },
    { title: t('merchant.setMenu.packagePrice'), dataIndex: 'comboPrice', key: 'comboPrice', width: 100, ellipsis: true },
    { title: t('merchant.setMenu.status'), dataIndex: 'comboStatus', key: 'comboStatus', slotName: 'comboStatus', width: 100, ellipsis: true },
    { title: t('merchant.setMenu.endTime'), dataIndex: 'usedTimeEnd', key: 'usedTimeEnd', width: 100, ellipsis: true },
    { title: t('merchant.setMenu.latestChangeTime'), dataIndex: 'updateTime', key: 'updateTime', width: 160, ellipsis: true },

    { title: t('table.operation'), dataIndex: 'operation', key: 'operation', width: 200, align: 'center', slotName: 'action', fixed: 'right' },
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

const handleShowDetail = (row) => {
    console.log(row)

    router.push({
        name: 'mealCreate',
        query: {
            id: row.id,

        }
    });
}

// 套餐审批
const rejectModalVisible = ref(false)
const choosenRow = ref({})
const handleExamine = (row, status) => {
    choosenRow.value = row
    if (status == 1) {
        Modal.confirm({
            title: '通过套餐',
            content: '是否通过该套餐',
            onOk: () => {
                shopPackageApprove({ id: row.id, comboStatus: status }).then(res => {
                    if (res.code == 0) {
                        fetchData()
                    }
                }).catch(err => {
                    console.log('shopPackageApprove error:', err);
                });
            }
        });
    } else {
        rejectModalVisible.value = true
    }

}

// 点击确认不通过
const rejectReason = ref('');
const handleConfirmReject = () => {
    console.log('rejectReason:', rejectReason.value);
    let params = {
        id: choosenRow.value.id,
        comboStatus: 3,
        rejectReason: rejectReason.value
    }
    shopPackageApprove(params).then(res => {
        if (res.code == 0) {
            Message.success('操作成功');
        }
    }).catch(err => {
        console.log('reject error:', err);
    }).finally(() => {
        rejectModalVisible.value = false;
    });
};

// 点击取消
const handleCancelReject = () => {
    rejectModalVisible.value = false;


};

// 修改上下架状态
const handleChangeStatus = (row, status) => {
    Modal.confirm({
        title: status == 0 ? '上架套餐' : '下架套餐',
        content: status == 0 ? '是否上架该套餐' : '是否下架该套餐',
        onOk: () => {
            shopPackageOnlineStatusChange({ id: row.id, comboStatus: status }).then(res => {
                if (res.code == 0) {
                    fetchData()
                }
            }).catch(err => {
                console.log('shopPackageOnlineStatusChange error:', err);
            });
        }
    });


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