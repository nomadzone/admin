<template>
  <PageCard :pageTitle="false">
    <div style="width: 600px;margin: 0 auto">
      <a-steps :current="currentStep" style="margin-bottom: 24px;">
        <a-step title="套餐信息"></a-step>
        <a-step title="购买须知"></a-step>
        <a-step title="图文详情"></a-step>
      </a-steps>
    </div>
    <div style="width: 600px;margin: 0 auto;padding-top: 40px;">

      <a-form :model="formModel" ref="formRef">

        <template v-if="currentStep === 1">
          <a-form-item label="套餐名称" required>
            <a-input v-model="formModel.comboName" placeholder="请输入"></a-input>
          </a-form-item>

          <a-form-item label="适用人数" required>
            <a-input v-model="formModel.personNumber" placeholder="请输入"></a-input>
          </a-form-item>

          <a-form-item label="套餐内容" required>
            <div>
              <a-button type="primary" @click="openEditModalCate(null, null)">新建</a-button>
              <div style="height: 20px"></div>
              <div class="table" v-for="(items, index) in groupedPackageContent" :key="index" v-if="groupedPackageContent.length > 0">
                <div class="name">
                  <h4>{{ items.name }}</h4>
                  <div>
                    <a-space>
                      <a-link @click="openEditModalCate(items, index)">编辑</a-link>
                      <a-link @click="openEditModal(null, index)">添加</a-link>
                      <a-link @click="openDeleteModalCate(index)" status="danger">删除</a-link>
                    </a-space>
                  </div>
                </div>
                <a-table :pagination="false" :columns="columns" :data="items.shopComboClassifyList" style="width: 500px">
                  <template #optional="row">
                    <a-space>
                      <a-link @click="openEditModal(row, index)">编辑</a-link>
                      <a-link @click="openDeleteModal(row, index)" status="danger">删除</a-link>
                    </a-space>
                  </template>
                </a-table>
              </div>
            </div>
          </a-form-item>

          <a-form-item label="门店价" required>
            <a-input v-model="formModel.shopPrice" placeholder="请输入"></a-input>
          </a-form-item>

          <a-form-item label="团购价" required>
            <a-input v-model="formModel.comboPrice" placeholder="请输入"></a-input>
          </a-form-item>
        </template>

        <!-- 购买须知表单 -->
        <template v-if="currentStep === 2">
          <a-form-item label="有效期" required >
            <div style="width: 300px;">
              <a-range-picker @select="rangePicker"  v-model="formModel.rangeTime"  style="width: 100%"></a-range-picker>
            </div>
          </a-form-item>

          <a-form-item label="不可用日期" required style="padding-top: 20px;">
              <a-radio-group v-model="formModel.allDayStatus">
                  <a-radio :value="true">所有日期都可使用</a-radio>
                  <a-radio :value="false">部分日期不可使用</a-radio>
              </a-radio-group>
          </a-form-item>
          <a-form-item label="" v-if="!formModel.allDayStatus">
            <a-space direction="vertical">
                <div class="time-line" style="padding-bottom: 10px;width: 600px;">
                  <span>每周某些天不可使用</span>
                  <a-checkbox v-model="formModel.monday">周一</a-checkbox>
                  <a-checkbox v-model="formModel.tuesday">周二</a-checkbox>
                  <a-checkbox v-model="formModel.wednesday">周三</a-checkbox>
                  <a-checkbox v-model="formModel.thursday">周四</a-checkbox>
                  <a-checkbox v-model="formModel.friday">周五</a-checkbox>
                  <a-checkbox v-model="formModel.saturday">周六</a-checkbox>
                  <a-checkbox v-model="formModel.sunday">周日</a-checkbox>
                </div>
                <div class="time-line">
                  <span>节假日不可使用</span>
                  <a-checkbox v-model="formModel.legalHolidayStatus">法定节假日不可使用</a-checkbox>
                </div>
            </a-space>
          </a-form-item>

          <a-form-item label="使用时间" required style="padding-top: 20px;">
            <div style="display: flex; flex-direction: column;">
              <a-radio-group v-model="formModel.allTimeStatus">
                <a-radio :value="true">24小时可使用</a-radio>
                <a-radio :value="false">部分时间可使用</a-radio>
              </a-radio-group>
              <div style="padding-top: 10px;" v-if="!formModel.allTimeStatus">
                <a-time-picker v-model="formModel.usedTimeStart" placeholder="开始时间"></a-time-picker>
                至
                <a-time-picker v-model="formModel.usedTimeEnd" placeholder="结束时间"></a-time-picker>
              </div>
            </div>
          </a-form-item>

          <a-form-item label="套餐总数" required style="padding-top: 20px;">
            <div style="display: flex; flex-direction: column;">
              <a-radio-group v-model="formModel.isRemainingNumber">
                <a-radio :value="true">不限量</a-radio>
                <a-radio :value="false">最多
                </a-radio>
              </a-radio-group>
              <div style="padding-top: 10px;" v-if="!formModel.isRemainingNumber">
                <a-input-number v-model="formModel.remainingNumber" placeholder="请输入" />
              </div>
            </div>
          </a-form-item>
        </template>

        <!-- 图文详情表单 -->
        <template v-if="currentStep === 3">
          <a-form-item label="封面图片" required :rules="[{required:true}]">
            <!-- <a-upload :file-list="fileList" list-type="picture-card"
              action="https://jsonplaceholder.typicode.com/posts/" @preview="handlePreview" @change="handleChange">
              <div>
                <a-icon type="plus" />
                <div style="margin-top: 8px;">Upload</div>
              </div>
            </a-upload> -->
              <PicUpload :limit="1" :fileList='[formModel.comboPhotoUrl]' @updateFileList="handleSetContactInformation"/>
          </a-form-item>

          <!-- <a-form-item label="图文详情" required>
            <textarea v-model="formModel.comboRemark" style="width: 100%; height: 200px;" placeholder="请输入图文详情"></textarea>
          </a-form-item> -->
          <a-form-item label="图文详情" required>
            <div style="height: 600px;" class="rich">
              <tiny-rich-text-editor style="height: calc(100% - 50px); width: 600px;" v-model="formModel.comboRemark"></tiny-rich-text-editor>
            </div>
          </a-form-item>
        </template>


        <a-space style="padding-left: 124px;padding-top: 20px;">
          <a-button @click="preStep" v-if="currentStep !== 1">上一步</a-button>
          <a-button type="primary"  v-if="currentStep !== 3" @click="nextStep">下一步</a-button>
          <a-button type="primary"  v-if="currentStep === 3" @click="doSubmit">确认</a-button>
          <a-button @click="resetForm">重置</a-button>
        </a-space>

      </a-form>

      <!-- 新建/编辑内容弹框 -->
      <a-modal v-model:visible="isShopComboClassify" :title="comboClassify.index == -1 ? '新建套餐' : '编辑套餐'" @cancel="closeAddEditModal"
        @before-ok="handleAddEditOk">
        <a-form :model="shopComboClassify">
          <a-form-item label="分类" required>
            <a-input v-model="shopComboClassify.name" placeholder="请输入名称"></a-input>
          </a-form-item>
          <a-form-item label="单价" required>
            <a-input v-model="shopComboClassify.price" placeholder="请输入单价"></a-input>
          </a-form-item>
          <a-form-item label="数量" required>
            <a-input v-model="shopComboClassify.number" placeholder="请输入数量"></a-input>
          </a-form-item>
        </a-form>
      </a-modal>
      

      <!-- 新建/编辑内容弹框 -->
      <a-modal v-model:visible="isComboClassify" :title="comboClassify.name ? '编辑套餐' : '添加分类'" @cancel="closeAddEditModalCate"
        @before-ok="handleAddEditOkCate">
        <a-form :model="comboClassify">
          <a-form-item label="分类" required>
            <a-input v-model="comboClassify.name" placeholder="请输入分类名称"></a-input>
          </a-form-item>
        </a-form>
      </a-modal>


    </div>
  </PageCard>
</template>

<script setup lang="ts">
import { Message, Modal, RangePicker } from '@arco-design/web-vue';
import PageCard from '@/components/page-card/index.vue';
import { computed, onMounted, reactive, ref } from 'vue';
import { useMeal } from '@/store';
import { comboAdd, comboEdit } from '@/api/combo';
import { useRouter } from 'vue-router';
import PicUpload from '@/components/picUpload/index.vue'
import { RichTextEditor as TinyRichTextEditor } from '@opentiny/vue'

const meal = useMeal()
const router = useRouter()
const currentStep = computed(() => meal.step);
const formModel = computed(() => meal.formModel);
const id = ref('')

onMounted(()=> {
  meal.step = 1
  const urlId = router.currentRoute.value.query.id as string;
  if (urlId) {
    id.value = urlId;
    let mealEdit:any = JSON.parse(localStorage.getItem('mealEdit') || '{}')
    if (mealEdit?.id == urlId) {
      for (let key in mealEdit) {
          let value = mealEdit[key] || ''
          if (value === 'false') { value = false }
          if (value === 'true') { value = true }
          (meal.formModel as any)[key] = value
      }
      (meal.formModel.rangeTime as any) = [mealEdit.validTimeStart, mealEdit.validTimeEnd]
    }
  }
})


const groupedPackageContent = computed(() => {
  return formModel.value.comboClassifyList || []
});

const columns = [
  { title: '套餐名称', dataIndex: 'name', key: 'name' },
  { title: '价格', dataIndex: 'price', key: 'price' },
  { title: '数量', dataIndex: 'number', key: 'number' },
  { title: '操作', slotName: 'optional', width: 120 },
];


const formRef = ref(null);

// 一级
const isComboClassify = ref(false)
const comboClassify = reactive({ name: '', shopComboClassifyList: [], index: -1 });
const comboClassifyType = ref(0); // 0一级新增 1一级修改
const openEditModalCate = (value: any, index: null | number) => {
  isComboClassify.value = true
  comboClassifyType.value = value === null ? 0 : 1
  comboClassify.index = index === null ? -1 : index
  comboClassify.name = value === null ? '' : value.name
  comboClassify.shopComboClassifyList = value === null ? [] : value.shopComboClassifyList
}
const closeAddEditModalCate = () => {
  isComboClassify.value = false;
}
const handleAddEditOkCate = async() => {
  if (!comboClassify.name) { return false; }
  try {
    if (comboClassifyType.value === 0 && comboClassify.index === -1) {
      (formModel.value.comboClassifyList as any[]).push({ name: comboClassify.name, shopComboClassifyList: [] });
    } else if (comboClassifyType.value === 1 && formModel.value.comboClassifyList[comboClassify.index]) {
      (formModel.value.comboClassifyList[comboClassify.index] as any).name = comboClassify.name
    }
    isComboClassify.value = false;
    return true;
  } catch(error) {
    return false;
  }
}
const openDeleteModalCate = (index: number) => {
  Modal.confirm({
    titleAlign: 'start',
    title: '删除',
    content: '是否确认删除内容？删除后不可恢复。',
    okText: '确定',
    cancelText: '取消',
    async onOk() {
      formModel.value.comboClassifyList.splice(index, 1)
    }
  });
}

const handleSetContactInformation = (data: any) => {
    formModel.value.comboPhotoUrl = data
}

// 二级
const isShopComboClassify = ref(false);
const shopComboClassify = reactive({ name: '', price: '', number: '', index: -1 });
const shopComboClassifyType = ref(0); // 0新增 1编辑
const comboClassifyIndex = ref(-1)

const openEditModal = (row: any, index: number) => {
  resetComboClassify()
  shopComboClassifyType.value = row ? 1 : 0
  isShopComboClassify.value = true;
  comboClassifyIndex.value = index
  shopComboClassify.index = row ? row.rowIndex : -1
  if (row) {
    shopComboClassify.name = row.record.name
    shopComboClassify.price = row.record.price
    shopComboClassify.number = row.record.number
  }
};
const closeAddEditModal = () => {
  isShopComboClassify.value = false;
};
const handleAddEditOk = async () => {
  try {
    if (!shopComboClassify.name || !shopComboClassify.price || !shopComboClassify.number) { return false; }
    let items = {
        name: shopComboClassify.name,
        number: shopComboClassify.number,
        price: shopComboClassify.price
    }
    if (shopComboClassify.index === -1) {
      // 新增
      ((formModel.value.comboClassifyList[comboClassifyIndex.value] as any).shopComboClassifyList as any[]).push(items)
    } else {
      (formModel.value.comboClassifyList[comboClassifyIndex.value] as any).shopComboClassifyList[shopComboClassify.index] = items
    }
    isShopComboClassify.value = false;
    resetComboClassify()
    return true;
  } catch (error) {
    return false;
  }
};
const openDeleteModal = (row: any, index: number) => {
  const rowIndex = row.rowIndex
  Modal.confirm({
    titleAlign: 'start',
    title: '删除',
    content: '是否确认删除内容？删除后不可恢复。',
    okText: '确定',
    cancelText: '取消',
    async onOk() {
      (formModel.value.comboClassifyList[index] as any).shopComboClassifyList.splice(rowIndex, 1)
    },
  });
};
const resetComboClassify = ()=> {
  // 正确的做法：更新属性，而不是重新赋值整个对象
  shopComboClassify.name = '';
  shopComboClassify.price = '';
  shopComboClassify.number = '';
  shopComboClassify.index = -1;
}

// 第二部
const rangePicker = (dateString: any, date: any)=> {
  console.log('onChange: ', dateString, date);
  if (dateString.length === 2) {
    formModel.value.validTimeStart = dateString[0]
    formModel.value.validTimeEnd = dateString[1]
  }
}

const fileList = ref([]);
const handlePreview = async (file: any) => {
  // 自定义预览逻辑
};
const handleChange = ({ fileList: newFileList }) => {
  fileList.value = newFileList;
};


const nextStep = () => {
  if (!meal.check()) {
    Message.error('请填写完成')
    return
  };
  meal.step += 1
};
const preStep = () => {
  meal.step -= 1
}

const resetForm = () => {
  meal.resetForm()
};

const doSubmit = async()=> {
  if (!meal.check()) {
    Message.error('请填写完成')
    return
  };
  try {
    let params:any = {...formModel.value}
    for (let key in params) {
      if (params[key] === 'false') {
        params[key] = false;
      }
      if (params[key] === 'true') {
        params[key] = true;
      }
    }
    Message.loading('提交中...')
    let res:any
    formModel.value.comboRemark = (formModel.value.comboRemark.replace(/"/g, "'"))
    formModel.value.comboRemark = formModel.value.comboRemark.replace(/\'/g, "'")
    // formModel.value.comboRemark = formModel.value.comboRemark.replace(/#image\/png;/g, 'data:image/png;')

    if (!id.value) {
      res = await comboAdd({
        createBy: JSON.parse(localStorage.getItem('shopId') || '{}').nickName,
        updateBy: '',
        shopId: localStorage.getItem('shopId'),
        dimensionId: localStorage.getItem('dimensionId'),
        ...formModel.value,
      })
    } else {
      res = await comboEdit({
        ...formModel.value,
        id: Number(id?.value)
      })
    }
    Message.clear()
    if (res?.code != 200){
      Message.error(res?.msg);
      return;
    }
    Message.success(!id.value ? '发布成功' : '编辑成功');
    setTimeout(()=> {
      meal.step = 1;
      meal.resetFormAll()
      router.back()
    }, 1500)
  } catch(error) {
    Message.error(JSON.stringify(error) || '接口异常')
  }
}

</script>

<style lang="scss" scoped>
.table {
  h4 {
    padding: 10px 16px;
    margin: 0;
  }

  .name {
    cursor: pointer;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #dcdee3;
    padding-right: 26px;

    &:hover {
      background-color: #d8d8d8;
    }
  }
}
.time-line {
  display: flex;
  align-items: center;
  span {
    padding-right: 10px;
    color: #777;
  }
}
</style>