<template>
    <div class="common-page-containe company-verifie-comp">
        <div class="common-panel">
            <a-row>
                <a-col :xs="{ span: 24 }" :sm="{ span: 18, offset: 2 }" :md="{ span: 16, offset: 4 }"
                    :lg="{ span: 14, offset: 5 }" :xl="{ span: 12, offset: 6 }" :xxl="{ span: 8, offset: 8 }">
                    <div class="person-verifie-form-box">
                        <a-form :model="form" :rules="rules" ref="formRef" @submit="handleSubmit()">
                            <a-form-item :label="t('store.verifie.frontIdImg')" field="papersTopUrl">
                                <PicUpload :limit="1" @updateFileList="handleSetFrontIdCard" :fileList="form.papersTopUrl"/>


                            </a-form-item>
                            <a-form-item :label="t('store.verifie.backendIdImg')" field="papersBottomUrl">

                <PicUpload :limit="1" @updateFileList="handleSetBackIdCard" :fileList="form.papersBottomUrl"/>

                            </a-form-item>
                            <a-form-item :label="t('store.verifie.frontIdImg')" field="name" >


                                <a-input v-model="form.name"></a-input>
                            </a-form-item>
                            <a-form-item>
                                <a-space>


                                <a-button html-type="submit" type="primary">提交</a-button>
                                <a-button @click="$refs.formRef.resetFields()">重置</a-button>
                            </a-space>

                            </a-form-item>

                        </a-form>
                    </div>

                </a-col>

            </a-row>


        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import {addShopAuth} from '@/api/shop'  
import { Message} from '@arco-design/web-vue';

import PicUpload from '@/components/picUpload/index.vue'

const { t } = useI18n()

const form = ref({
    papersTopUrl: [],
    papersBottomUrl: [],
    name: '',
})

const rules = {
    papersTopUrl: [
        { required: true, message: t('store.verifie.frontIdPlaceholder'), trigger: 'blur' }
    ],
    papersBottomUrl: [
        { required: true, message: t('store.verifie.BackIdPlaceholder'), trigger: 'blur' }
    ],
    name: [
        { required: true, message: t('store.verifie.namePlaceholder'), trigger: 'blur' }
    ]
    
}

const handleSetFrontIdCard = (data: any) => {
    form.value.papersTopUrl.push(data)

}

const handleSetBackIdCard = (data: any) => {
    form.value.papersBottomUrl.push(data)

}

const formRef = ref()

const handleSubmit = async () => {
    formRef.value.validate(async (errors: any) => {
            if (errors) {
            } else {
                console.log('表单验证通过', form.value)

                addShopAuth({
                    ...form.value,
                    userId: JSON.parse(localStorage.getItem('user') || '{}').userId,
                    authType:0,
                    papersTopUrl: form.value.papersTopUrl[0],
                    papersBottomUrl: form.value.papersBottomUrl[0]
                }).then(res => {
                    if(res?.code === 200) {
                        Message.success('提交成功')
                    }
                })
            }
        })
}
</script>

<style lang="scss" scoped>
.person-verifie-form-box {
    margin-top: 150px;
}
</style>