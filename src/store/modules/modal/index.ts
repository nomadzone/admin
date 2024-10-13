
import { defineStore } from 'pinia';
import { reactive, ref, watch } from 'vue';


const useModalSatte = defineStore('modal', ()=> {
    const consumpitonVerifyVisible = ref(false)
    const consumpitonVerifySubmit = ref(false)
    watch(consumpitonVerifyVisible, (newValue, oldValue)=> {
        if (newValue && newValue !== oldValue) {
            consumpitonVerifySubmit.value = false
        }
    })
    const consumpitonVerifyForm = reactive({
        value: ''
    })

    return {
        consumpitonVerifyVisible,
        consumpitonVerifyForm,
        consumpitonVerifySubmit,
    }
})

export default useModalSatte