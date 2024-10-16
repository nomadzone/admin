<template>
    <div class="common-page-container store-verifie-page">
        <div class="common-panel">
            <div class="page-title">{{ t('menu.store.verifie') }}</div>
            <div class="page-body">
                <div class="verifie-index" v-if="verifieType === null && authStaus === 4">
                    <div class="verifie-item-box">
                        <div class="item-icon">
                            <img src="../../../assets/icons/verifie-company.svg" />
                        </div>
                        <div class="item-name">{{ t('store.verifie.company') }}</div>
                        <a-button type="primary" @click="handleChangeType(1)">{{ t('menu.store.verifie')
                            }}</a-button>
                    </div>
                    <div class="verifie-item-box">
                        <div class="item-icon">
                            <img src="../../../assets/icons/verifie-person.svg" />
                        </div>
                        <div class="item-name">{{ t('store.verifie.person') }}</div>
                        <a-button type="primary" @click="handleChangeType(0)">{{ t('menu.store.verifie')
                            }}</a-button>
                    </div>
                </div>

                <div v-if="authStaus == 4">
                    <Company v-if="verifieType === 1" @submit-success="handleSubmitSuccess" />
                    <Person v-else-if="verifieType === 0" />
                </div>
                <VerifieStatus v-else :approveInfo="approveInfo" />

            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import Company from './company.vue'
import Person from './person.vue'
import VerifieStatus from './verifieStatus.vue'
import { getShopAuthStatus } from '@/api/shop'
const { t } = useI18n()

const verifieType = ref(null) //1 公司 2 个人

const handleChangeType = (type: string) => {
    verifieType.value = type
}

const authStaus = ref(null)
const examineStatus = ref(3) // 0: 未提交审核 1: 审核通过 2: 审核失败 3: 审核中
const approveInfo = ref({})   // 认证信息
// 获取店铺认证状态
const getShopAuthStatusFn = async () => {
    let params = {
        id: JSON.parse(localStorage.getItem('user') as string).userId
    }
    const res = await getShopAuthStatus(params)
    console.log('----------', res)
    if (res?.code === 200) {
        approveInfo.value = res.data
        examineStatus.value = 0

        console.log('res.data', res.data)
    }
}

// 提交成功
const handleSubmitSuccess = () => {
    getShopAuthStatusFn()
}

onMounted(() => {
    authStaus.value = localStorage.getItem('isAuth')
    console.log('authStaus', authStaus.value)
    getShopAuthStatusFn()
})
</script>


<style lang="scss" scoped>
.store-verifie-page {
    flex-direction: column;
    justify-content: flex-start;

    .page-body {
        height: calc(100% - 50px);

        .verifie-index {
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            height: 100%;

            .verifie-item-box {
                width: 314px;
                height: 346px;
                border-radius: 11px;
                background-color: #EBEBEB;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                box-sizing: border-box;

                margin-right: 80px;



                &:last-child {
                    margin-left: 80px;
                }

                .item-icon {

                    width: 200px;
                    height: 200px;
                    margin: 0px;
                }

                .item-name {
                    font-size: 24px;
                    color: #1d2129;
                    margin: 0px;
                    margin-bottom: 30px;

                }
            }


        }


    }
}

.page-title {
    font-size: 20px;
    font-weight: 500;
    line-height: 28px;
}
</style>