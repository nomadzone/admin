<template>
    <div class="common-page-containe company-verifie-comp">
        <div class="common-panel">
            <a-steps line-less :current="currentStep" status="process">
                <a-step>基本信息</a-step>
                <a-step>营业执照</a-step>
                <a-step>法人信息</a-step>
            </a-steps>

            <div class="step-content">
                <company-basic-info v-if="currentStep === 1" ref="companyBasicInfoRef"/>
                <company-business-license v-if="currentStep === 2" ref="companyLicenseRef" />
                <corporate-information v-if="currentStep === 3" ref="companyCorprateRef"/>
            </div>
            <div class="step-actions">
                <a-row class="grid-demo">

                    <a-col :span="6" style="height: 20px;"></a-col>
                    <a-col :span="14">
                        <a-space>

                            <a-button  type="primary" @click="handleNext()">下一步</a-button>
                            <a-button>重置</a-button>
                        </a-space>
                    </a-col>

                </a-row>


            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import CompanyBasicInfo from './components/companyBasicInfo.vue'
import CompanyBusinessLicense from './components/businessLicense.vue'
import CorporateInformation from './components/corporateInformation.vue'
import {addShopAuth} from '@/api/shop'  
import { Message} from '@arco-design/web-vue';

const currentStep = ref(1)

const companyBasicInfoRef = ref<InstanceType<typeof CompanyBasicInfo> | null>(null)
const companyLicenseRef = ref<InstanceType<typeof CompanyBusinessLicense> | null>(null)
const companyCorprateRef = ref<InstanceType<typeof CorporateInformation> | null>(null)
// 点击下一步
const basicInfoValue = ref<any>(null)
const licenseValue = ref<any>(null)
const corporateValue = ref<any>(null)

const handleNext = async () => {
    try {
        if (currentStep.value === 1) {
            basicInfoValue.value = await companyBasicInfoRef.value?.getFormData()
            currentStep.value = 2
        } else if (currentStep.value === 2) {
            licenseValue.value = await companyLicenseRef.value?.getFormData()
            currentStep.value = 3
        } else if (currentStep.value === 3) {
             corporateValue.value = await companyCorprateRef.value?.getFormData()
            const params = {
                ...basicInfoValue.value,
                ...licenseValue.value,
                ...corporateValue.value,
                userId: JSON.parse(localStorage.getItem('user') || '{}').userId,
                authType:1,
                businessLicenseUrl: licenseValue.value.businessLicenseUrl[0],
                papersTopUrl: corporateValue.value.papersTopUrl[0],
                papersBottomUrl: corporateValue.value.papersBottomUrl[0]
            }
          const res =  await addShopAuth(params)
          if(res?.code === 200) {
              Message.success('提交成功')
          }
        }
    } catch (error) {
        console.log('error', error)
    }
}

</script>

<style lang="scss" scoped>
.company-verifie-comp {
    width: 50%;
    margin: 0 auto;
    margin-top: 44px;

    .step-content {
        padding-top: 80px;
    }
}
</style>