<template>
    <a-upload multiple list-type="picture-card" :action="action" :default-file-list="defaultFileList.files" image-preview :headers="headerConfg" :limit="limit" @success="uploadSuccess" @change="uploadChange" @error="uploadError"/>
</template>
  

<script lang="ts" setup>
import { getToken } from '@/utils/auth';
import { ref,defineProps,defineEmits, watch, reactive, computed } from 'vue'
import uuid from 'uuid'

const emit = defineEmits(['updateFileList']);

const action = ref(import.meta.env.VITE_API_BASE_URL + '/admin/oss/upload')

const props = defineProps({
   limit: {
       type: Number,
       default: 1
   },
   fileList: {
       type: Array,
       default: ()=> {
        return []
       }
   }
})

const defaultFileList = reactive({ files: [] })
watch(() => props.fileList, (newValue, oldValue) => {
    let files = []
    newValue.map((item, index)=> {
        if (item) {
            files.push({ url: item, id: uuid.v4(), name: uuid.v4() })
        }
    })
    defaultFileList.files = files
    // defaultFileList.files = [
    //   {
    //     uid: '-2',
    //     name: '20200717-103937.png',
    //     url: '//p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/a8c8cdb109cb051163646151a4a5083b.png~tplv-uwbnlip3yd-webp.webp',
    //   },
    //   {
    //     uid: '-1',
    //     name: 'hahhahahahaha.png',
    //     url: '//p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/e278888093bef8910e829486fb45dd69.png~tplv-uwbnlip3yd-webp.webp',
    //   },
    // ]
    console.log('defaultFileList-----',defaultFileList)

}, { immediate: true })
const headerConfg = ref({
    authorization:getToken()
})
const uploadSuccess = (res: any) => {
     // 更新至父组件
     if (res.status === 'done') {
        emit('updateFileList', res.response.data);
    }
}

const uploadChange = (info: any) => {

}


const uploadError = (err: any) => {
    console.log(err)
}
</script>