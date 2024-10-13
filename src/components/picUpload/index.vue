<template>
    <a-upload multiple list-type="picture-card" :action="action" :default-file-list="defaultFileList.files" image-preview :headers="headerConfg" :limit="limit" @success="uploadSuccess" @change="uploadChange" @error="uploadError"/>
</template>
  

<script lang="ts" setup>
import { getToken } from '@/utils/auth';
import { ref,defineProps,defineEmits, watch, reactive } from 'vue'

const emit = defineEmits(['updateFileList']);

const action = ref(import.meta.env.VITE_API_BASE_URL + '/shop/oss/upload')

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
            files.push({ url: item, uid: index })
        }
    })
    defaultFileList.files = files
    console.log('defaultFileList-----',defaultFileList)

}, { immediate: true })
const headerConfg = ref({
    authorization:getToken()
})
const uploadSuccess = (res: any) => {
     // 更新至父组件
     if (res.status === 'done') {
        emit('updateFileList', res.response.msg);
    }
}

const uploadChange = (info: any) => {

}


const uploadError = (err: any) => {
    console.log(err)
}
</script>