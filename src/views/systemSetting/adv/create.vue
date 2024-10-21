<template>
  <PageCard :pageTitle="false">
    <div style="width: 600px;margin: 0 auto;padding-top: 40px;">

      <a-form :model="formModel" ref="formRef">

          <a-form-item field="title" label="广告名称" required>
            <a-input v-model="formModel.title" placeholder="请输入" v-if="type !== 'look'"></a-input>
            <div class="text" v-if="type === 'look'">{{formModel.title}}</div>
          </a-form-item>

          <a-form-item field="switch" label="展示状态">
            <a-switch :disabled="type === 'look'" v-model="formModel.status" />
          </a-form-item>

          <a-form-item :label="'展示位置'" required style="padding-top: 20px;">
              <a-radio-group v-model="formModel.type" v-if="type !== 'look'">
                  <a-radio :value="'1'">首页</a-radio>
                  <a-radio :value="'2'">用户默认头像</a-radio>
                  <a-radio :value="'3'">商家</a-radio>
              </a-radio-group>
              <div class="text" v-if="type === 'look'">{{formModel.type === '1' ? '首页': (formModel.type === '2' ? '用户默认头像' : '商家') }}</div>
          </a-form-item>

        <a-form-item :label="'展示顺序'" required style="padding-top: 20px;">
          <a-input v-model="formModel.orderNumber" placeholder="请输入" v-if="type !== 'look'"></a-input>
          <div class="text" v-if="type === 'look'">{{formModel.orderNumber}}</div>
        </a-form-item>

          <div v-for="(item, index) in formModel.list" :key="index" class="list">
            <div class="title">广告{{index + 1}}</div>
            <icon-delete  class="delete" @click="doDelete(index)" v-if="formModel.list.length > 1 && type !== 'look'"/>
            <a-form-item :label="'广告图片'" required :rules="[{required:true}]">
                <PicUpload 
                  v-if="type !== 'look'"
                  :limit="1" 
                  :fileList="[item.image]" 
                  :key="index" 
                  @updateFileList="(file) => { handleSetContactInformation(file, index) }"
                />
                <a-image
                   v-if="type === 'look'"
                  width="80"
                  src="https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/a8c8cdb109cb051163646151a4a5083b.png~tplv-uwbnlip3yd-webp.webp"
                />
            </a-form-item>

            <a-form-item :label="'广告链接'" required>
              <a-input v-model="item.url" placeholder="请输入" v-if="type !== 'look'"></a-input>
              <div class="text" v-if="type === 'look'">{{item.url}}</div>
            </a-form-item>
          </div>
          <div style="padding: 10px 0;" v-if="type !== 'look'">
            <a-button @click="doCreate">
                <template #icon>
                    <icon-plus />
                </template>
                <!-- Use the default slot to avoid extra spaces -->
                <template #default>新增</template>
            </a-button>
          </div>

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
import { computed, onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import PicUpload from '@/components/picUpload/index.vue'
import { comboAdd, comboEdit } from '@/api/combo';
import { noticeAdd, noticeEdit } from '@/api/adv';
const router = useRouter()
const formModel = reactive({
  title: '',
  status: true,
  type: '1',  // 类型 1-首页轮播图 2-用户默认头像 3-商家轮播图
  orderNumber: '',
  list: [
    {
      image: '',
      url: '',
    }
  ],
})
const id = ref('')
const type = ref('create')
onMounted(()=> {
  const paramsType = router.currentRoute.value.query.type as string;
  const info = JSON.parse(localStorage.getItem('advInfo'))
  type.value = paramsType
  if (paramsType !== 'add') {
    const paramsId = router.currentRoute.value.query.id as string;
    id.value = paramsId
  }
  if (info) {
    formModel.title = info.title
    formModel.status = !!(info.status == 1)
    formModel.type = info.type
    formModel.orderNumber = info.orderNumber
    let list = []
    let images = info.images.split(',')
    let urls = info.url.split(',')
    images.map((item, index)=> {
      list.push({
        image: item,
        url: urls[index],
      })
    })
    formModel.list = list
  }
})

const doCreate = ()=> {
  formModel.list = [...formModel.list, {
      image: '',
      url: '',
  }]
}

const doDelete = (index) => {
  formModel.list[index].image = ''; // Clear the image before deletion
  const _list = formModel.list.filter((_, i) => i !== index);
  formModel.list = []
  setTimeout(() => {
    formModel.list = _list
  });
}

const handleSetContactInformation = (data: any, index) => {
    formModel.list[index].image = data
}

const resetForm = ()=> {
    formModel.title = '';
    formModel.status = true;
    formModel.type = '1'
    formModel.orderNumber = '1'
    formModel.list = [
    {
      image: '',
      url: '',
    }
  ]
}

const doSubmit = async()=> {
  let tip = '';
  console.log(formModel, 'formModel')
  if (!formModel.title) {
    tip = '广告名称必填'
  } else if (!formModel.orderNumber) {
    tip = '展示顺序必填'
  } else {
    for (let i=0;i<formModel.list.length; i++) {
      let item = formModel.list[i]
      if (!item.image) {
        tip = `广告${i + 1}请上传照片`
        break
      } else if (!item.url) {
        tip = `广告${i + 1}链接必填`
        break
      }
    }
  }
  if (tip) {
    Message.error(tip)
    return;
  }
  try {
    Message.loading('提交中...')
    let images = [];
    let urls = [];
    const params:any = {...formModel}
    params.list.map(item=> {
      images.push(item.image)
      urls.push(item.url)
    })
    params.images = images.join(',')
    params.url = urls.join(',')
    delete params.list
    let res:any
    if (!id.value) {
      res = await noticeAdd({
        ...params,
        status: params.status ? 1 : 0
      })
    } else {
      res = await noticeEdit({
        ...params,
        status: params.status ? 1 : 0,
        id: Number(id?.value)
      })
    }
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
.list {
  border: 1px solid #ccc;
  padding: 16px;
  border-radius: 6px;
  margin-bottom: 10px;
  type: relative;
  .delete {
    type: absolute;
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