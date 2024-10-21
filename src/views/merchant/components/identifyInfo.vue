<template>
    <div class="shop-identify-info">
        <div class="info-body"></div>
        <div class="bottom-action" v-if="props.info.isAuth == 2">
            <a-button class="reject-btn" @click="handleReject()">{{ t('merchant.index.reject') }}</a-button>

            <a-popconfirm :content="$t('merchant.index.passConfirm')" @ok="handlePass()">
                <a-button type="primary">{{ t('merchant.index.pass')
                    }}</a-button>
            </a-popconfirm>
        </div>

        <a-modal title-align="start" v-model:visible="visible" @ok="handleConfirmReject" @cancel="handleCancelReject"
            :title="t('merchant.index.rejectModalTitle')">
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
import { useI18n } from 'vue-i18n';
import { shopApprove } from '@/api/merchant';

const { t } = useI18n();

const props = defineProps({
    info: Object
})


// 监听 info 的变化
watch(() => props.info, (newInfo) => {
    // 在这里处理 info 变化后的逻辑
    console.log('info 发生变化:', newInfo);
    // 例如，更新 rejectReason
});
const visible = ref(false);


// 点击不通过
const rejectReason = ref('');
const handleReject = () => {
    visible.value = true;


};
// 点击确认不通过

const handleConfirmReject = () => {
    console.log('rejectReason:', rejectReason.value);
    let params = {
        shopIds: [props.info.shopId],
        isAuth: 1,
        rejectReason: rejectReason.value
    }
    shopApprove(params).then(res => {
        if (res.code == 0) {
            Message.success('操作成功');
        }
    }).catch(err => {
        console.log('reject error:', err);
    }).finally(() => {
        visible.value = false;
    });
};

// 点击取消
const handleCancelReject = () => {
    visible.value = false;


};
// 点击通过
const handlePass = () => {
    visible.value = true;
    let params = {
        shopIds: [props.info.shopId],
        isAuth: 0,
        rejectReason: ''
    }
    shopApprove(params).then(res => {
        if (res.code == 0) {
            Message.success('操作成功');
        }
    }).catch(err => {
        console.log('reject error:', err);
    }).finally(() => {
        visible.value = false;
    });
};
</script>

<style lang="scss" scoped>
.shop-identify-info {
    height: 100%;

    .info-body {
        height: calc(100% - 50px);
    }

    .bottom-action {
        padding: 0px 30px;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        height: 50px;
        box-shadow: 0px -3px 12px 0px #0000001A;

        .reject-btn {
            margin-right: 32px;
        }

    }
}
</style>