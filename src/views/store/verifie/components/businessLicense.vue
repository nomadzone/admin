<template>
    <div class="verifie-company-license">
        <a-form ref="licenseFormRef" :model="form" :label-col-props="{ span: 8 }" :wrapper-col-props="{ span: 14 }"  :rules="rules">
            <a-form-item :label="t('store.verifie.businessLicenseRegistrationNumber')"
                field="businessLicenseCode">
                <a-input v-model="form.businessLicenseCode" :placeholder="$t('store.verifie.businessLicenseRegistrationNumberPlaceholder')"/>
            </a-form-item>
            <a-form-item :label="t('store.verifie.license')" field="businessLicenseUrl">

                <PicUpload :limit="1" @updateFileList="handleSetShowImages" :fileList="form.businessLicenseUrl"/>

            </a-form-item>
        </a-form>
    </div>
</template>
<script lang="ts" setup>
import { ref, defineExpose } from 'vue'
import { useI18n } from 'vue-i18n'
import PicUpload from '@/components/picUpload/index.vue'

const { t } = useI18n()
const form = ref<any>({
    businessLicenseCode: '',
    businessLicenseUrl: [],
})

const rules = {
    businessLicenseCode: [
        { required: true, message: t('store.verifie.businessLicenseRegistrationNumberPlaceholder'), trigger: 'blur' }
    ],
    businessLicenseUrl: [
        { required: true, message: t('store.verifie.licensePlaceholder'), trigger: 'blur' }
    ]
}

const file = ref();

const onChange = (_, currentFile) => {
    file.value = {
        ...currentFile,
        // url: URL.createObjectURL(currentFile.file),
    };
};
const onProgress = (currentFile) => {
    file.value = currentFile;
};


const licenseFormRef = ref()

const getFormData = () => {

    return new Promise((resolve, reject) => {
        licenseFormRef.value.validate(async (errors: any) => {
            if (errors) {
                reject(new Error('表单验证失败'))
            } else {
                console.log('表单验证通过', form.value)
                resolve(form.value)
            }
        })
    })
   
}


const handleSetShowImages = (data: any) => {
    form.value.businessLicenseUrl.push(data)
}
defineExpose({
    getFormData
})
</script>
<style lang="scss" scoped></style>