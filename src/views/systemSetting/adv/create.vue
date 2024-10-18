<template>
  <PageCard :pageTitle="false">
    <div style="width: 600px;margin: 0 auto;padding-top: 40px;">

      <a-form :model="formModel" ref="formRef">

          <a-form-item field="advName" label="广告名称" required>
            <a-input v-model="formModel.advName" placeholder="请输入" v-if="type !== 'look'"></a-input>
            <div class="text" v-if="type === 'look'">{{formModel.advName}}</div>
          </a-form-item>

          <a-form-item field="switch" label="展示状态">
            <a-switch :disabled="type === 'look'" v-model="formModel.status" />
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
              <a-input v-model="item.link" placeholder="请输入" v-if="type !== 'look'"></a-input>
              <div class="text" v-if="type === 'look'">{{item.link}}</div>
            </a-form-item>

          <a-form-item :label="'展示顺序'" required style="padding-top: 20px;">
            <a-input v-model="item.sort" placeholder="请输入" v-if="type !== 'look'"></a-input>
            <div class="text" v-if="type === 'look'">{{item.sort}}</div>
          </a-form-item>

            <a-form-item :label="'展示位置'" required style="padding-top: 20px;">
                <a-radio-group v-model="item.position" v-if="type !== 'look'">
                    <a-radio :value="'home'">首页</a-radio>
                    <a-radio :value="'lasso'">探索</a-radio>
                </a-radio-group>
                <div class="text" v-if="type === 'look'">{{item.position === 'home' ? '首页': '探索' }}</div>
            </a-form-item>
          </div>
          <div style="padding: 10px 0;" v-if="type !== 'look'">
            <a-button @click="doCreate">
                <template #icon>
                    <icon-plus />
                </template>
                <!-- Use the default slot to avoid extra spaces -->
                <template #default>新建</template>
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
const router = useRouter()
const formModel = reactive({
  advName: '',
  status: true,
  list: [
    {
      image: '',
      position: 'home',
      sort: '',
      link: '',
    }
  ],
})
const id = ref('')
const type = ref('create')
onMounted(()=> {
  const paramsType = router.currentRoute.value.query.type as string;
  type.value = paramsType
  if (paramsType !== 'add') {
    const paramsId = router.currentRoute.value.query.id as string;
    id.value = paramsId
  }
})

const doCreate = ()=> {
  formModel.list = [...formModel.list, {
      image: '',
      position: 'home',
      sort: '',
      link: '',
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
    formModel.advName = '';
    formModel.status = true;
    formModel.list = [
    {
      image: '',
      position: 'home',
      sort: '',
      link: '',
    }
  ]
}

const doSubmit = async()=> {
  let tip = '';
  if (!formModel.advName) {
    tip = '广告名称必填'
  } else {
    for (let i=0;i<formModel.list.length; i++) {
      let item = formModel.list[i]
      if (!item.image) {
        tip = `广告${i + 1}请上传照片`
        break
      } else if (!item.link) {
        tip = `广告${i + 1}链接必填`
        break
      } else if (!item.sort) {
        tip = `广告${i + 1}展示顺序必填`
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
    let res:any
    if (!id.value) {
      res = await comboAdd({
        ...formModel,
      })
    } else {
      res = await comboEdit({
        ...formModel,
        id: Number(id?.value)
      })
    }
    Message.success(!id.value ? '发布成功' : '编辑成功');
    setTimeout(()=> {
      resetForm()
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