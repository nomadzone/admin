<!-- ConfirmModal.vue -->
<template>
    <a-modal width="363px" v-model:visible="visible" :title="title" @ok="handleOk" @cancel="handleCancel"
        modal-class="custom-confirm-modal" title-align="start">
        <template #title>
            <div class="custom-title">
                <img src="../../assets/icons/confirm-icon.svg" />
                {{ title }}
            </div>
        </template>
        <div class="message-body">
            <p class="message-text">{{ message }}</p>
            <p class="message-desc">{{ desc }}</p>
        </div>
    </a-modal>
</template>
  
<script setup>
import { ref, defineEmits } from 'vue';
import confirmIcon from '@/assets/icons/confirm-icon.svg';
const emit = defineEmits(['confirm']);
const visible = ref(false);
const title = ref('');
const message = ref('');
const desc = ref('');
let resolve;

const open = (newTitle, newMessage, newDesc) => {
    title.value = newTitle;
    message.value = newMessage;
    desc.value = newDesc;
    visible.value = true;
    return new Promise(res => {
        resolve = res;
    });
};

const handleOk = () => {
    resolve(true);
    visible.value = false;
    emit('confirm');
};

const handleCancel = () => {
    resolve(false);
    visible.value = false;
};

defineExpose({
    open
})

</script>

<style lang="scss" >
.custom-confirm-modal {

    .arco-modal-header {
        padding: 0px 30px !important;
        border-bottom: 0px !important;
    }

    .arco-modal-body {
        padding: 0px !important;
    }

    .arco-modal-footer {
        border-top: 0px !important;
    }

    .message-body {
        padding-left: 78px;
        padding-right: 28px;
        font-size: 14px;

        p {
            margin: 0px;
        }

        .message-text {
            color: #666666;
            margin-bottom: 10px;
        }

        .message-desc {
            color: #ccc;
        }

    }
}

.custom-title {
    display: flex;
    align-items: center;
    flex-direction: row;
    font-size: 16px;
    font-weight: 400;

    img {
        margin-right: 20px;
    }
}
</style>