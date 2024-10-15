<template>
    <div class="verifie-company-license">
        <a-form ref="licenseFormRef" :model="form" :rules="rules" :label-col-props="{ span: 8 }" :wrapper-col-props="{ span: 14 }">
            <a-form-item :label="t('store.verifie.frontId')" field="papersTopUrl">
                <PicUpload :limit="1" @updateFileList="handleSetFrontIdCard" :fileList="form.papersTopUrl"/>

            </a-form-item>
            <a-form-item :label="t('store.verifie.BackId')" field="papersBottomUrl">
                <PicUpload :limit="1" @updateFileList="handleSetBackIdCard" :fileList="form.papersBottomUrl"/>

            </a-form-item>
        </a-form>
    </div>
</template>
<script lang="ts" setup>
import { ref ,defineExpose} from 'vue'
import { useI18n } from 'vue-i18n'
import PicUpload from '@/components/picUpload/index.vue'

const { t } = useI18n()
const form = ref<any>({
    papersTopUrl: [],
    papersBottomUrl: [],
})

const rules = {
    papersTopUrl: [
        { required: true, message: t('store.verifie.frontIdPlaceholder'), trigger: 'blur' }
    ],
    papersBottomUrl: [
        { required: true, message: t('store.verifie.BackIdPlaceholder'), trigger: 'blur' }
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


const handleSetFrontIdCard = (data: any) => {
    form.value.papersTopUrl.push(data)

}

const handleSetBackIdCard = (data: any) => {
    form.value.papersBottomUrl.push(data)

}

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

defineExpose({
    getFormData
})

</script>
<style lang="scss" scoped></style>