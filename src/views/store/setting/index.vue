<template>
    <div class="common-page-container store-verifie-page">
        <div class="common-panel">
            <div class="common-panel-header">
                <div class="header-title">{{ t('store.setting.title') }}</div>
                <div class="header-actions">
                    <a-button>{{ t('button.reset') }}</a-button>
                    <a-button type="primary" @click="handleConfirmSave">{{ t('button.confirm') }}</a-button>
                </div>
            </div>
            <div class="store-setting-form-box">
                <a-row>
                    <a-col :xs="{ span: 24 }" :sm="{ span: 24 }" :md="{ span: 24 }" :lg="{ span: 16, offset: 4 }"
                        :xl="{ span: 16, offset: 4 }" :xxl="{ span: 16, offset: 4 }">
                        <a-form ref="shopSaveFormRef" :model="form" :label-col-props="{ span: 5 }"
                            :wrapper-col-props="{ span: 16 }" :rules="rules">
                            <a-form-item :label="t('store.setting.name')" field="name">
                                <a-input v-model="form.name" :placeholder="t('store.setting.namePlaceholder')" />
                            </a-form-item>
                            <a-form-item :label="t('store.setting.category')" field="categoryName">
                                <a-select v-model="form.categoryName"
                                    :placeholder="t('store.setting.categoryPlaceholder')">
                                    <a-option v-for="item in categoryOptions" :key="item" :value="item">
                                        {{ item }}
                                    </a-option>
                                </a-select>
                            </a-form-item>
                            <a-form-item :label="t('store.setting.contactInformation')" field="phone">
                                <!-- <PicUpload :limit="1" @updateFileList="handleSetContactInformation"
                                    :fileList="[form.qrCode]" /> -->

                                <a-input v-model="form.phone" :placeholder="t('store.setting.contactInformation')" />
                            </a-form-item>
                            <a-form-item :label="t('store.setting.status')" field="shopStatus">
                                <a-switch v-model="form.shopStatus" :checked-value="'0'" :unchecked-value="'1'"
                                    size="small" />
                            </a-form-item>
                            <a-form-item :label="t('store.setting.businessDay')" field="businessDay">
                                <a-checkbox-group v-model="form.businessDay">
                                    <a-checkbox v-for="item in businessDayOptions" :key="item.value"
                                        :value="item.value">{{
                                            item.label }}</a-checkbox>
                                </a-checkbox-group>
                            </a-form-item>
                            <a-form-item :label="t('store.setting.businessHours')" field="businessHoursStatus">
                                <a-radio-group v-model="form.businessHoursStatus">
                                    <a-radio v-for="item in businessHourOptions" :key="item.value"
                                        :value="item.value">{{
                                            item.label }}</a-radio>
                                </a-radio-group>
                            </a-form-item>
                            <div v-if="form.businessHoursStatus === 1">
                                <a-form-item field="businessHoursStart"
                                    v-for="(timeRangeItem, index) of form.businessHoursStart"
                                    :field="`businessHoursStart[${index}].value`" :key="index">
                                    <a-space direction="vertical">
                                        <a-time-picker format="HH:mm" v-model="timeRangeItem.start" class="start-time"
                                            @change="validateTimeRange(index)" />
                                        <a-time-picker format="HH:mm" v-model="timeRangeItem.end"
                                            @change="validateTimeRange(index)" />
                                    </a-space>

                                </a-form-item>
                                <a-form-item>
                                    <a-button type="text" class="add-time-range-btn" @click="handleAddTimeRange">{{
                                        t('store.setting.addTimeRange') }}</a-button>
                                </a-form-item>
                            </div>
                            <a-form-item :label="t('store.setting.address')" :merge-props="false">
                                <a-space direction="vertical" fill style="width: 100%">
                                    <a-form-item :label-col-props="{ span: 0 }" :wrapper-col-props="{ span: 24 }"
                                        label=" " field="place">
                                        <a-cascader :path-mode="true" :field-names="fieldNames" :options="areaCode"
                                            v-model="form.place" allow-clear />
                                    </a-form-item>
                                    <a-form-item :label-col-props="{ span: 0 }" :wrapper-col-props="{ span: 24 }"
                                        label=" " field="addressString">
                                        <a-input v-model="addressInfo.addressString"
                                            :placeholder="t('store.setting.addressPlaceholder')"
                                            @blur="searchShopLocation" />
                                    </a-form-item>
                                </a-space>
                            </a-form-item>
                            <a-form-item :label="t('store.setting.perCapitaPonsumption')" field="perCapita">
                                <a-input-number v-model="form.perCapita" />
                            </a-form-item>
                            <a-form-item :label="t('store.setting.imgs')">
                                <PicUpload :limit="9" @updateFileList="handleSetShowImages"
                                    :fileList="form.profilePhotoUrl" />
                            </a-form-item>
                            <a-form-item :label="t('store.setting.desc')" field="category">
                                <a-input :placeholder="t('store.setting.descPlaceholder')" :max-length="20" allow-clear
                                    show-word-limit v-model="form.category" />

                            </a-form-item>
                            <a-form-item :label="t('store.setting.groupBuyingGraphicAndTextDetails')">
                                <div style="height:500px">
                                    <quill-editor v-model="content" :options="editorOptions" />
                                </div>
                            </a-form-item>

                        </a-form>
                    </a-col>
                </a-row>


            </div>

        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { getLoginAccountShop } from '@/api/shop'
import PicUpload from '@/components/picUpload/index.vue'
import { getDictByCode } from '@/api/common'
import { areaCode } from '@/utils/cityCode';
import { QuillEditor } from '@vueup/vue-quill';
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import { addShop, getShopAddressPoint, updateShop } from '@/api/shop'
import { Message } from '@arco-design/web-vue';

const { t } = useI18n()
const fieldNames = { value: 'label', label: 'label', children: 'children' }
const businessDayOptions = ref([
    { label: t('days.monday'), value: '1' },
    { label: t('days.tuesday'), value: '2' },
    { label: t('days.wednesday'), value: '3' },
    { label: t('days.thursday'), value: '4' },
    { label: t('days.friday'), value: '5' },
    { label: t('days.saturday'), value: '6' },
    { label: t('days.sunday'), value: '7' }
])

const businessHourOptions = ref([
    { label: t("store.setting.timeRange"), value: 1 },
    { label: t("store.setting.allDay"), value: 2 },

])
const form = ref({
    id: null,
    name: '',
    categoryName: '',
    category: '',
    phone: '',
    shopStatus: 0,
    businessDay: [],
    businessHoursStatus: 1,
    businessHoursStart: [{ start: '', end: '' }],
    province: '',
    perCapita: 0,
    profilePhotoUrl: [],
    place: [],
    shop_remark: ''
})

const content = ref('')

const rules = {
    name: [
        { required: true, message: t('store.setting.namePlaceholder'), trigger: 'blur' }
    ],
    categoryName: [
        { required: true, message: t('store.setting.categoryPlaceholder'), trigger: 'change' }
    ],
    category: [
        { required: true, message: t('store.setting.descPlaceholder'), trigger: 'change' }
    ],
    phone: [
        { required: true, message: t('store.setting.contactInformationPlaceholder'), trigger: 'blur' }
    ],

    shopStatus: [
        { required: true, message: t('store.setting.statusPlaceholder'), trigger: 'change' }
    ],
    businessDay: [
        { required: true, message: t('store.setting.businessDayPlaceholder'), trigger: 'change' }
    ],
    businessHoursStatus: [
        { required: true, message: t('store.setting.businessHoursPlaceholder'), trigger: 'change' }
    ],
    place: [
        { required: true, message: t('store.setting.addressPlaceholder'), trigger: 'change' }
    ],
    perCapita: [
        { required: true, message: t('store.setting.perCapitaPlaceholder'), trigger: 'change' }
    ],
    profilePhotoUrl: [
        { required: true, message: t('store.setting.imgsPlaceholder'), trigger: 'change' }
    ],
    shop_remark: [
        { required: true, message: t('store.setting.groupBuyingGraphicAndTextDetailsPlaceholder'), trigger: 'change' }
    ],
    businessHoursStart: [
        { required: true, message: t('store.setting.timeRangePlaceholder'), trigger: 'change' }
    ]
}


const editorOptions = ref(
    {
        modules: {
            toolbar: [
                // 加粗 斜体 下划线 删除线 -----['bold', 'italic', 'underline', 'strike']
                ['bold', 'italic', 'underline', 'strike'],
                // 引用  代码块-----['blockquote', 'code-block']
                ['blockquote', 'code-block'],
                // 1、2 级标题-----[{ header: 1 }, { header: 2 }]
                [{ header: 1 }, { header: 2 }],
                // 有序、无序列表-----[{ list: 'ordered' }, { list: 'bullet' }]
                [{ list: 'ordered' }, { list: 'bullet' }],
                // 上标/下标-----[{ script: 'sub' }, { script: 'super' }]
                [{ script: 'sub' }, { script: 'super' }],
                // 缩进-----[{ indent: '-1' }, { indent: '+1' }]
                [{ indent: '-1' }, { indent: '+1' }],
                // 文本方向-----[{'direction': 'rtl'}]
                [{ direction: 'rtl' }],
                // 字体大小-----[{ size: ['small', false, 'large', 'huge'] }]
                [{ size: ['small', false, 'large', 'huge'] }],
                // 标题-----[{ header: [1, 2, 3, 4, 5, 6, false] }]
                [{ header: [1, 2, 3, 4, 5, 6, false] }],
                // 字体颜色、字体背景颜色-----[{ color: [] }, { background: [] }]
                [{ color: [] }, { background: [] }],
                // 字体种类-----[{ font: [] }]
                [{ font: [] }],
                // 对齐方式-----[{ align: [] }]
                [{ align: [] }],
                // 清除文本格式-----['clean']
                ['clean'],
                // 链接、图片、视频-----['link', 'image', 'video']
                ['image']
            ]
        },
        theme: 'snow'
    }
)

const addressInfo = ref({
    location: '',
    addressString: ''
})

// 查询店铺分类字典
const categoryOptions = ref([])
const searchShopCategory = async () => {
    const res = await getDictByCode({ code: 'shop_prodect_type' })
    if (res.data) {
        console.log(res.data)
        categoryOptions.value = res.data
    }
}

// 获取店铺信息

const getShop = async () => {
    const res = await getLoginAccountShop()
    if (res.data) {

        let businessDay = []

        if (res.data.monday === '1') {
            businessDay.push('1')
        }
        if (res.data.tuesday === '1') {
            businessDay.push('2')
        }
        if (res.data.wednesday === '1') {
            businessDay.push('3')
        }
        if (res.data.thursday === '1') {
            businessDay.push('4')
        }
        if (res.data.friday === '1') {
            businessDay.push('5')
        }
        if (res.data.saturday === '1') {
            businessDay.push('6')
        }
        if (res.data.sunday === '1') {
            businessDay.push('7')
        }

        addressInfo.value = {
            addressString: res.data.address,
        }


        let shopImgs = res.data.profilePhotoUrl.split(',')

        console.log('shopImgs', shopImgs)

        form.value = {
            ...res.data,
            businessDay: businessDay,
            businessHoursStatus: parseInt(res.data.businessHoursStatus),
            businessHoursStart: JSON.parse(res.data.businessHoursStart),
            place: [res.data.province, res.data.city, res.data.county],
            profilePhotoUrl: shopImgs
        }

        console.log('form.value', form.value)
    }
}

// 设置店铺联系方式


// 点击新增时间段
const handleAddTimeRange = () => {
    form.value.businessHoursStart.push({ start: '', end: '' })
}


const shopImages = ref([])
const handleSetShowImages = (data: any) => {
    form.value.profilePhotoUrl.push(data)
}
const timeRangeError: any = ref([]);

const validateTimeRange = (index: number) => {

    const timeRangeItem = form.value.businessHoursStart[index];

    console.log(timeRangeItem)
    if (timeRangeItem.start && timeRangeItem.end && timeRangeItem.end <= timeRangeItem.start) {
        timeRangeError.value[index] = '结束时间必须大于开始时间';
    } else {
        timeRangeError.value[index] = '';
    }
}
// 查询店铺经纬度
const searchShopLocation = async (e) => {

    if (form.value.place.length < 3) {
        Message.warning('请先选择省市区')
        return
    }
    console.log('------', form.value.place)

    let params = {
        address: form.value.place.join('') + e.target.value,
        key: 'ZUTBZ-RRLWT-ZYTX5-LCRG7-7TLWH-Y4FG3',
    }

    console.log(params)
    const res = await getShopAddressPoint(params)

    console.log(res)

    if (res.status === 0) {
        form.value.longitude = res.result.location.lng
        form.value.dimension = res.result.location.lat
    }
}

const shopSaveFormRef = ref()
// 点击保存
const handleConfirmSave = () => {

    console.log('content------------------', content.value)

    if (!shopSaveFormRef.value) {
        return
    }
    shopSaveFormRef.value.validate(async (errors: any) => {
        if (!errors) {
            console.log(form.value)

            let params = {
                ...form.value,
                businessHoursStart: JSON.stringify(form.value.businessHoursStart),
                profilePhotoUrl: form.value.profilePhotoUrl.join(','),
                address: addressInfo.value.addressString,
                province: form.value.place[0],
                city: form.value.place[1],
                county: form.value.place[2],
                addressCode: form.value.place.join(','),
                userId: JSON.parse(localStorage.getItem('user') || '{}').userId,
                shopRemark: '测试数据'

            }
            if (form.value.businessDay.length) {
                if (form.value.businessDay.indexOf('1') > -1) {
                    params = {
                        ...params,
                        monday: '1'
                    }
                } else {
                    params = {
                        ...params,
                        monday: '0'
                    }
                }
                if (form.value.businessDay.indexOf('2') > -1) {
                    params = {
                        ...params,
                        tuesday: '1'
                    }
                } else {
                    params = {
                        ...params,
                        tuesday: '0'
                    }
                }

                if (form.value.businessDay.indexOf('3') > -1) {
                    params = {
                        ...params,
                        wednesday: '1'
                    }
                } else {
                    params = {
                        ...params,
                        wednesday: '0'
                    }
                }
                if (form.value.businessDay.indexOf('4') > -1) {
                    params = {
                        ...params,
                        thursday: '1'
                    }
                } else {
                    params = {
                        ...params,
                        thursday: '0'
                    }
                }
                if (form.value.businessDay.indexOf('5') > -1) {
                    params = {
                        ...params,
                        friday: '1'
                    }
                } else {
                    params = {
                        ...params,
                        friday: '0'
                    }
                }
                if (form.value.businessDay.indexOf('6') > -1) {
                    params = {
                        ...params,
                        saturday: '1'
                    }
                } else {
                    params = {
                        ...params,
                        saturday: '0'
                    }
                }
                if (form.value.businessDay.indexOf('7') > -1) {
                    params = {
                        ...params,
                        sunday: '1'
                    }
                } else {
                    params = {
                        ...params,
                        sunday: '0'
                    }
                }
            }
            delete params.businessDay
            delete params.place

            if (params.id) {
                updateShop(params).then(res => {
                    console.log(res)
                })
            } else {
                addShop(params).then(res => {
                    console.log(res)
                })
            }


        } else {

        }
    })

}

onMounted(() => {

    console.log(areaCode)
    searchShopCategory()
    getShop()
})
</script>
<style lang="scss" scoped>
.add-time-range-btn {
    color: #2AC984 !important;
}

.time-range-item {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;

    .start-time {
        margin-bottom: 10px;
    }
}
</style>