<template>
    <div class="shop-basic-info-comp">
        <div class="info-item-row">
            <div class="item-label">{{ t('merchant.index.contactInformation') }}</div>
            <div class="item-value">{{ info.phone || '-' }}</div>
        </div>
        <div class="info-item-row">
            <div class="item-label">{{ t('merchant.index.businessDay') }}</div>
            <div class="item-value">{{ businessDayStr || '-' }}</div>
        </div>
        <div class="info-item-row">
            <div class="item-label">{{ t('merchant.index.businessHours') }}</div>
            <div class="item-value">{{ businessHoursStr || '-' }}</div>
        </div>
        <div class="info-item-row">
            <div class="item-label">{{ t('merchant.index.storeLocation') }}</div>
            <div class="item-value">{{ info.address || '-' }}</div>
        </div>
        <div class="info-item-row">
            <div class="item-label">{{ t('merchant.index.perCapitaStore') }}</div>
            <div class="item-value">{{ info.perCapita || '-' }}</div>
        </div>
        <div class="info-item-row">
            <div class="item-label">{{ t('merchant.index.storeImages') }}</div>
            <div class="item-value">
                <div style="display: flex; flex-wrap: wrap;">
                    <a-image v-for="(item, index) in imageList" :key="index" width="80" :src="item"
                        style="margin: 8;" />
                </div>
            </div>
        </div>
        <div class="info-item-row" style="align-items: flex-start;">
            <div class="item-label">{{ t('merchant.index.storeInformation') }}</div>
            <div class="item-value">
                <div v-html="info.shopRemark"></div>
            </div>
        </div>

    </div>

</template>

<script setup>
import { ref, defineProps, watch } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n()

const props = defineProps({
    info: Object
})

const businessDayStr = ref('')
const businessHoursStr = ref('')
const imageList = ref([])
watch(() => props.info, (newVal) => {
    let dayArray = []
    if (newVal.monday) {
        dayArray.push(t('merchant.index.monday'))
    }
    if (newVal.tuesday) {
        dayArray.push(t('merchant.index.tuesday'))
    }
    if (newVal.wednesday) {
        dayArray.push(t('merchant.index.wednesday'))
    }
    if (newVal.thursday) {
        dayArray.push(t('merchant.index.thursday'))
    }
    if (newVal.friday) {
        dayArray.push(t('merchant.index.friday'))
    }
    if (newVal.saturday) {
        dayArray.push(t('merchant.index.saturday'))
    }
    if (newVal.sunday) {
        dayArray.push(t('merchant.index.sunday'))
    }

    if (dayArray.length === 7) {
        businessDayStr.value = t('merchant.index.monday') + '-' + t('merchant.index.sunday')
    } else {
        businessDayStr.value = dayArray.join('、')
    }


    let businessHours = []

    if (newVal.businessHoursStatus == 1 && newVal.businessHoursStart) {
        let hoursArray = JSON.parse(newVal.businessHoursStart)
        for (var i = 0; i < hoursArray.length; i++) {
            businessHours.push(hoursArray[i].start + '-' + hoursArray[i].end)
        }
        businessHoursStr.value = businessHours.join('、')
    } else {
        if (newVal.businessHoursStatus == 0) {
            businessHoursStr.value = t('merchant.index.fullDay')
        }
    }

    if (newVal.profilePhotoUrl && newVal.profilePhotoUrl.length > 0) {
        imageList.value = newVal.profilePhotoUrl.split(',')
    }

}, { immediate: true })
</script>

<style lang="scss" scoped>
.shop-basic-info-comp {
    box-sizing: border-box;
    overflow: auto;

    .info-item-row {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        margin-bottom: 20px;
        margin-left: 32px;
        margin-right: 32px;

        &:first-child {
            margin-top: 20px;
        }

        .item-label {
            width: 120px;
            font-size: 14px;
            text-align: right;
            color: #86909C;
        }

        .item-value {
            flex: 1;
            font-size: 14px;
            color: #1D2129;
            margin-left: 16px;
        }
    }
}
</style>