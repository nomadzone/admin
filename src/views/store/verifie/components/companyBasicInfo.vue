<template>
    <div class="company-verifie-basic-info">
        <a-form :rules="rules"  ref="formRef" :model="form" :label-col-props="{ span: 6 }" :wrapper-col-props="{ span: 14 }">
            <a-form-item :label="t('store.verifie.companyName')" field="companyName">
                <a-input v-model="form.companyName" :placeholder="$t('store.verifie.companyNamePlaceholder')"/>
            </a-form-item>
            <a-form-item :label="t('store.verifie.companyContacts')" field="name">
                <a-input v-model="form.name" :placeholder="$t('store.verifie.companyContactsPlaceholder')"/>
            </a-form-item>
            <a-form-item :label="t('store.verifie.companyPhone')" field="phone">
                <a-input v-model="form.phone" :placeholder="$t('store.verifie.companyPhonePlaceholder')"/>
            </a-form-item>
        </a-form>
    </div>
</template>

<script lang="ts" setup>
import { ref, defineExpose } from 'vue'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const form = ref<any>({
    companyName: '',
    name: '',
    phone: ''
})

const rules = {
    companyName: [
        { required: true, message: t('store.verifie.companyNamePlaceholder'), trigger: 'blur' }
    ],
    name: [
        { required: true, message: t('store.verifie.companyContactsPlaceholder'), trigger: 'blur' }
    ],
    phone: [
        { required: true, message: t('store.verifie.companyPhonePlaceholder'), trigger: 'blur' }
    ]
}
const formRef = ref()

const getFormData = () => {
    console.log('formRef', formRef)

    return new Promise((resolve, reject) => {
        formRef.value.validate(async (errors: any) => {
            if (errors) {
                reject(new Error('表单验证失败'))
            } else {
                console.log('表单验证通过', form.value)
                resolve(form.value)
            }
        })
    })
   
}


defineExpose({
    getFormData
})
</script>

<style lang="scss" scoped></style>