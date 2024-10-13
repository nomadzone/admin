
import { defineStore } from 'pinia';
import { reactive, ref, watch } from 'vue';


const useMeal = defineStore('meal', () => {
    const step = ref(1)

    const formModel = reactive({
        comboName: '',
        personNumber: '',
        comboClassifyList: [],
        shopPrice: '',
        comboPrice: '',
        
        rangeTime: [],
        validTimeStart: '',
        validTimeEnd: '',
        allDayStatus: true,
        monday: false,
        tuesday: false,
        wednesday: false,
        thursday: false,
        friday: false,
        saturday: false,
        sunday: false,
        legalHolidayStatus: false,
        allTimeStatus: true,
        usedTimeStart: '',
        usedTimeEnd: '',
        remainingNumber: 1,
        isRemainingNumber: true,

        comboPhotoUrl: '',
        comboRemark: ''
    })

    const resetFormAll = ()=> {
      resetForm(1)
      resetForm(2)
      resetForm(3)
    }

    const resetForm = (type = null) => {
        if (step.value === 1 || type === 1) {
          formModel.comboName = '';
          formModel.personNumber = '';
          formModel.comboClassifyList = [];
          formModel.shopPrice = '';
          formModel.comboPrice = '';
        } else if (step.value === 2 || type === 2) {
          formModel.rangeTime = [];
          formModel.validTimeStart = '';
          formModel.validTimeEnd = '';
          formModel.allDayStatus = true;
          formModel.monday = false;
          formModel.tuesday = false;
          formModel.wednesday = false;
          formModel.thursday = false;
          formModel.friday = false;
          formModel.saturday = false;
          formModel.sunday = false;
          formModel.legalHolidayStatus = false;
          formModel.allTimeStatus = true;
          formModel.usedTimeStart = '';
          formModel.usedTimeEnd = '';
          formModel.remainingNumber = 1;
          formModel.isRemainingNumber = true;
        } else if (step.value === 3 || type === 3) {
          formModel.comboPhotoUrl = '';
          formModel.comboRemark = '';
        }
      };

    const check =()=> {
      console.log(formModel, 'check')
      if (step.value === 1) {
        if (
          !formModel.comboName ||
          !formModel.personNumber ||
          formModel.comboClassifyList?.length === 0 ||
          !formModel.shopPrice ||
          !formModel.comboPrice
        ) {
          return false;
        } else {
          return true
        }
      }  else if (step.value === 2) {
          if (
            !formModel.validTimeStart ||
            !formModel.validTimeEnd
          ) {
            return false
          } else {
            return true
          }
      } else {
        return true
        if (
          !formModel.comboPhotoUrl ||
          !formModel.comboRemark) {
          return false
        } else {
          return true
        }
      }
    }
    


    return {
        resetForm,
        resetFormAll,
        step,
        check,
        formModel,
    }
})

export default useMeal