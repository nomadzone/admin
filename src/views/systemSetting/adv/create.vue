<template>
  <PageCard :pageTitle="false">
    <div style="width: 700px;margin: 0 auto;padding-top: 40px;">

      <a-form :model="formModel" ref="formRef">

          <a-form-item field="title" label="广告名称" required>
            <a-input v-model="formModel.title" placeholder="请输入" v-if="type !== 'look'"></a-input>
            <div class="text" v-if="type === 'look'">{{formModel.title}}</div>
          </a-form-item>
          <a-form-item :label="'广告图片'" required :rules="[{required:true}]">
              <PicUpload 
                v-if="type !== 'look'"
                :limit="1" 
                :fileList="[formModel.images]"
                @updateFileList="(file) => { handleSetContactInformation(file) }"
              />
              <a-image
                v-if="type === 'look'"
                width="80"
                :src="formModel.images"
              />
          </a-form-item>
          <a-form-item :label="'展示位置'" required>
              <a-radio-group v-model="formModel.type" v-if="type !== 'look'">
                  <a-radio :value="'1'">首页</a-radio>
                  <a-radio :value="'2'">用户默认头像</a-radio>
                  <a-radio :value="'3'">商家</a-radio>
              </a-radio-group>
              <div class="text" v-if="type === 'look'">{{formModel.type === '1' ? '首页': (formModel.type === '2' ? '用户默认头像' : '商家探索轮播图') }}</div>
          </a-form-item>

          <a-form-item :label="'展示顺序'" required style="padding-top: 20px;">
            <a-radio-group v-model="formModel.orderNumber" :disabled="type === 'look'">
                  <a-radio :value="1">1</a-radio>
                  <a-radio :value="2">2</a-radio>
                  <a-radio :value="3">3</a-radio>
              </a-radio-group>
          </a-form-item>

          <a-form-item field="switch" label="展示状态">
            <a-switch :disabled="type === 'look'" v-model="formModel.status" />
          </a-form-item>

            <a-form-item :label="'广告类型'" required style="padding-top: 20px;">
              <a-radio-group v-model="formModel.urlType" :disabled="type === 'look'">
                    <a-radio :value="'1'">套餐</a-radio>
                    <a-radio :value="'2'">商家</a-radio>
                    <a-radio :value="'3'">一起野</a-radio>
                    <a-radio :value="'4'">新鲜事</a-radio>
                    <a-radio :value="'5'">找搭子</a-radio>
                    <a-radio :value="'6'">小程序</a-radio>
                </a-radio-group>
            </a-form-item>

            <a-form-item :label="'广告id'" required>
              <a-input v-model="formModel.url" placeholder="请输入" v-if="type !== 'look'"></a-input>
              <div class="text" v-if="type === 'look'">{{formModel.url}}</div>
            </a-form-item>

          <a-space style="padding-left: 124px;padding-top: 20px;" v-if="type !== 'look'">
            <a-button type="primary" @click="doSubmit">确定</a-button>
          </a-space>

      </a-form>

    </div>
  </PageCard>
</template>

<script setup lang="ts">
import { Message, Modal } from '@arco-design/web-vue';
import PageCard from '@/components/page-card/index.vue';
import { onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import PicUpload from '@/components/picUpload/index.vue'
import { noticeAdd, noticeEdit } from '@/api/adv';
  import store2 from 'store2'
const router = useRouter()
const formModel = reactive({
  title: '',
  status: true,
  type: '1',  // 类型 1-首页轮播图 2-用户默认头像 3-商家轮播图
  orderNumber: 1,
  images: '',
  url: '',
  urlType: '1',
})
const id = ref('')
const type = ref('create')
onMounted(()=> {
  const paramsType = router.currentRoute.value.query.type as string;
  const info = store2.get('advInfo')
  type.value = paramsType
  if (paramsType === 'edit') {
    const paramsId = router.currentRoute.value.query.id as string;
    id.value = paramsId
  } 
  if (info) {
    formModel.title = info.title
    formModel.status = !!(info.status == 1)
    formModel.type = info.type
    formModel.orderNumber = info.orderNumber
    formModel.url = info.url
    formModel.urlType = info.urlType
    formModel.images = info.images
  }
})

const handleSetContactInformation = (data: any) => {
    formModel.images = data
}

const resetForm = ()=> {
    formModel.title = '';
    formModel.status = true;
    formModel.type = '1'
    formModel.orderNumber = 1
    formModel.images = ''
    formModel.url = ''
    formModel.urlType = ''
}

const doSubmit = async()=> {
  let tip = '';
  console.log(formModel, 'formModel')
  if (!formModel.title) {
    tip = '广告名称必填'
  } else if (!formModel.images) {
    tip = '图片必传'
  } else if (!formModel.url) {
    tip = '广告id'
  }
  if (tip) {
    Message.error(tip)
    return;
  }
  try {
    const params:any = {...formModel}
    let res:any
    Message.loading('提交中...')
    if (!id.value) {
      res = await noticeAdd({
        ...params,
        status: params.status ? 1 : 0
      })
    } else {
      res = await noticeEdit({
        ...params,
        status: params.status ? 1 : 0,
        id: id?.value
      })
    }
    Message.clear()
    if (res.code == 0) {
      Message.success(!id.value ? '发布成功' : '编辑成功');
      setTimeout(()=> {
        resetForm()
        router.back()
      }, 1000)
    } else {
      Message.error(res?.msg)
    }
  } catch(error) {
    // Message.error(JSON.stringify(error) || '接口异常')
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
.list {
  border: 1px solid #ccc;
  padding: 16px;
  border-radius: 6px;
  margin-bottom: 10px;
  position: relative;
  .delete {
    position: absolute;
    top: 16px;
    right: 16px;
    color: #777;
    cursor: pointer;
    &:hover {
      color: #165dff;
    }
  }
  .title {
    font-size: 18px;
    padding-bottom: 10px;
    font-weight: 500;
  }
}
</style>