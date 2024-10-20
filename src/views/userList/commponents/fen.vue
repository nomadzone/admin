<template>
    <div style="padding-top: 48px;">
        <div class="type">
            <a-button shape="round" v-if="type != '0'" @click="type = '0'; search()">关注</a-button>
            <a-button shape="round" type="primary"  v-if="type == '0'">关注</a-button>
            <a-button shape="round" v-if="type != '1'" @click="type = '1'; search()">粉丝</a-button>
            <a-button shape="round" type="primary" v-if="type == '1'">粉丝</a-button>
        </div>
        <a-table size="small" :columns="columns" :data="formModel.list" style="width: 100%" :loading="loading"
            :pagination='pagination'>
        
            <template #userType="{ record, rowIndex }">
              <a-space> 
                <span>{{ record.userType == 1 ? '发起人' : '普通人' }}</span>
              </a-space>
            </template>
            <template #optional="{ record, rowIndex }">
              <a-space>
                <a-link @click="doLook(record, rowIndex)">查看详情</a-link>
              </a-space>
            </template>
        </a-table>

    </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { fansList } from '@/api/user'
import { Message } from '@arco-design/web-vue'


const columns = [
    { title: '用户昵称', dataIndex: 'nickname' },
    { title: '手机号码', dataIndex: 'phoneNumber' },
  {
    title: '用户类型',
    dataIndex: 'userType',
    slotName: 'userType' // userType是否发起过活动 1 发起过 其他没有
  },
    { title: '消费金额', dataIndex: 'consumption' },
    { title: '活动参与数', dataIndex: 'activityInNumber' },
    { title: '活动发起数', dataIndex: 'activityNumberEd' }, 
    { title: '注册时间', dataIndex: 'createTime' },
    { title: '操作', slotName: 'optional', width: 120 },
  ];

const type = ref('1')
const formModel = reactive({
    pageNum: 1,
    pageSize: 10,
    list: []
});
const pagination = ref({
    total: 0, // 数据总条数
    current: 1, // 当前页
    pageSize: 10, // 每页显示的条数
    showTotal: true, // 是否显示总条数
    onChange: (page) => {
        pagination.value.current = page; // 更新当前页
        formModel.pageNum = page; // 更新当前页
        search()
    }, // 页码改变时的回调函数
})
let userId = ref('')
const loading = ref(false)
onMounted(() => { 
    const userListInfo = JSON.parse(localStorage.getItem('userListInfo'))
    userId.value = userListInfo ? userListInfo?.id : ''
    search()
 })
const search = async () => {
    loading.value = true
    const _userFansId = type.value == '0' ? userId.value :  '';
    const _userId = type.value == '1' ? userId.value :  '';
    const params = {
        pageNum: formModel.pageNum,
        pageSize: formModel.pageSize,
    }
    // userFansId不为空   userId空    则是关注列表
    // userFansId空   userId不为空    则是粉丝列表
    try {
        let res: any = await fansList(params, `/user/fans/list?userFansId=${_userFansId}&userId=${_userId}`)
        loading.value = false
        if (res?.code == 0) {
            pagination.value.total = res.total;
            formModel.list = res.rows
        } else {
            Message.error(res?.msg || res?.code?.toString() || '接口异常')
        }
    } catch (error) {
        loading.value = false
        Message.error('接口异常')
    }
}
const doLook = (record, index)=> {

}
</script>

<style lang="scss" scoped>
.type {
    display: flex;
    gap: 8px;
    padding-bottom: 16px;
}
</style>