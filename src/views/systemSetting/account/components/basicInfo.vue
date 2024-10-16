<template>
    <div>
        <a-form :label-col-props="{ span: 2 }" :wrapper-col-props="{ span: 6 }" :form="form">
            <a-form-item required field="username" tooltip="Please enter username" :label="t('account.username')">
                <a-input required v-model="form.username" />
            </a-form-item>

            <a-form-item field="roles" :label="t('account.roles')">
                <a-select v-model="form.roles" :options="roles" />
            </a-form-item>

            <a-form-item field="status" :label="t('account.status')">
                <a-switch v-model="form.status" />
            </a-form-item>
            <a-form-item>
                <a-button style="margin-right:8px ;" html-type="submit" type="primary">{{ t('button.save') }}</a-button>
                <a-button>{{ t('button.reset') }}</a-button>
            </a-form-item>
        </a-form>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
const roles = ref(
    [
        { label: 'Admin', value: 'admin' },
        { label: 'User', value: 'user' }
    ]
)
const form = ref({
    username: '',
    roles: '',
    status: false
});

</script>
<style lang="scss" scoped></style>