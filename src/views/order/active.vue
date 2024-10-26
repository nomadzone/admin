<template>
  <PageCard>
    <a-card class="general-card width-full">
      <a-row>
        <a-col :flex="1">
          <a-form :model="formModel" :label-col-props="{ span: 6 }" :wrapper-col-props="{ span: 18 }"
            label-align="right">
            <a-row :gutter="16">
              <a-col :span="12"> 
                <a-form-item field="number" label="用户昵称 ">
                  <a-input v-model="formModel.nickname" placeholder="请输入用户昵称 " allow-clear/>
                </a-form-item>
                <a-form-item field="number" label="手机号码">
                  <a-input v-model="formModel.phone" placeholder="请输入手机号码" allow-clear/>
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item field="name" label="状态">
                  <a-select :style="{width:'340px'}" v-model="formModel.status" placeholder="全部" allow-clear>
                    <a-option value="">全部</a-option>
                    <a-option value="0">已上线</a-option>
                    <a-option value="1">已下线</a-option>
                    <a-option value="2">待审批</a-option>
                    <a-option value="3">不通过</a-option>
                  </a-select>
                </a-form-item>
                <a-form-item field="name" label="报名时间">
                  <a-range-picker style="width: 360px; margin: 0 24px 24px 0;" show-time
                    :time-picker-props="{ defaultValue: ['00:00:00', '09:09:06'] }" format="YYYY-MM-DD HH:mm"
                     @select="onSelectTime" @ok="onOkTime" @clear="onClear" allow-clear/>
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </a-col>
        <a-divider style="height: 32px" direction="vertical" />
        <a-col :flex="'86px'" style="text-align: right">
          <a-space direction="vertical" :size="18">
            <a-button type="primary" @click="search">
              <template #icon>
                <icon-search />
              </template>
              查询
            </a-button>
          </a-space>
        </a-col>
      </a-row>
    </a-card>
    <a-table :columns="columns" :data="formModel.list" style="width: 100%" @row-click="handleRowClick" :loading="loading" :pagination='pagination'>
      <template #status="{ record }">
        <a-tag :color="record.status === '1' ? 'green' : record.status === '2' ? 'red' : 'blue'">
          {{ record.status === '1' ? '报名成功' : record.status === '2' ? '取消报名' : '正在报名' }}
        </a-tag>
      </template>
      <template #price="{ record }">
        {{ record.price || '--' }}
      </template>
      <template #optional="{ record }">
        <a-space>
          <a-link @click="doLook(record)">查看详情</a-link>
        </a-space>
      </template>
    </a-table>
    <a-modal v-model:visible="visible">
      <template #title>
        票夹详情
      </template>
      <div>
        <div class="line" v-for="field in fields" :key="field.key">
          <span>{{ field.label }}</span>
            <a-image
                v-if="field.key === 'images'"
                width="32"
                :src="info[field.key]"
            />
          <span v-else-if="field.key === 'gender'">{{ info[field.key] == '0' ? '男' : (info[field.key] == '1' ? '女': '未知')  }}</span>
          <a-tag v-else-if="field.key === 'status'" :color="info[field.key] === '1' ? 'green' : info[field.key] === '2' ? 'red' : 'blue'">
          {{ info[field.key] === '1' ? '报名成功' : info[field.key] === '2' ? '取消报名' : '正在报名' }}
          </a-tag>
          <span v-else>{{ info[field.key] || '--' }}</span>
        </div>
      </div>
    </a-modal>

  </PageCard>
</template>

<script setup>
import PageCard from '@/components/page-card/index.vue';
import { ref, reactive, watch, onMounted } from 'vue';
import { Modal } from '@arco-design/web-vue';
import { useModalStore } from '../../store';
import { userActivityList } from '@/api/order'
import { Message } from '@arco-design/web-vue'
const columns = [
  { title: '手机号码', dataIndex: 'phone' },
  { title: '用户昵称', dataIndex: 'nickname'},
  { title: '订单金额', slotName: 'price', width: 90 },
  { title: '状态', slotName: 'status' },
  { title: '报名时间', dataIndex: 'createTime', width: 130 },
  { title: '操作', slotName: 'optional', width: 100 },
];

const visible = ref(false);
const fields = [
  // { label: '创建者', key: 'createBy' },
  { label: '报名时间', key: 'createTime' },
  // { label: '更新者', key: 'updateBy' },
  // { label: '更新时间', key: 'updateTime' },
  { label: '备注', key: 'remark' },
  // { label: '维度ID', key: 'dimensionId' },
  // { label: '管理员', key: 'adminNew' },
  // { label: '页码', key: 'pageNum' },
  // { label: '每页条数', key: 'pageSize' },
  { label: '票夹ID', key: 'id' },
  { label: '用户ID', key: 'userId' },
  { label: '图片', key: 'images' },
  { label: '用户昵称', key: 'nickname' },
  { label: '价格', key: 'price' },
  { label: '电话号码', key: 'phone' },
  { label: '状态', key: 'status' },
  { label: '性别', key: 'gender' },
  { label: '活动ID', key: 'activityid' },
  // { label: '结束时间', key: 'endTime' },
];

const info = ref({
  "createBy": null,
  "createTime": "2024-10-21 02:43:34",
  "updateBy": null,
  "updateTime": null,
  "remark": "390c7f07-1baa-4958-92bd-e662b637abab",
  "dimensionId": null,
  "adminNew": null,
  "pageNum": null,
  "pageSize": null,
  "id": "1eb6c8c8-91c9-4118-9a96-a1c1ad933ec4",
  "userId": "a7aa4ec9-f8a9-44cb-80d4-00b23b4203da",
  "images": null,
  "nickname": "旷野RFQ1u4T3",
  "price": 0.10,
  "phone": "13484130157",
  "status": "1",
  "gender": null,
  "activityid": "0b81f01e-d6df-49c3-8101-c4d09f194c94",
  "endTime": null
})

const doLook = (item)=> {
  for (let key in item) {
    console.log(key, item[key])
    info.value[key] = item[key] || ''
  }
  visible.value = true
}

const formModel = reactive({
  nickname: '',
  phone: '',
  status: '',
  verifyTime: [],
  pageNum: 1,
  pageSize: 10,
  list: []
});
const loading = ref(false)
const pagination = ref({
      total: 0, // 数据总条数
      current: 1, // 当前页
      pageSize: 10, // 每页显示的条数
      showTotal: true, // 是否显示总条数
      onChange: (page)=> {
        pagination.value.current = page; // 更新当前页
        formModel.pageNum = page; // 更新当前页
        search()
      }, // 页码改变时的回调函数
})
onMounted(()=> { search() })
const onOkTime = (value) => { formModel.verifyTime = value }
const onClear = ()=> { formModel.verifyTime = []; search() }
const search = async() => {
  loading.value = true
  const params = {
    pageNum: formModel.pageNum,
    pageSize: formModel.pageSize,
    // verifyStatus: '1'
  }
  if (formModel.nickname){
    params.nickname = formModel.nickname
  }
  if (formModel.phone){
    params.phone = formModel.phone
  }
  if (formModel.status){
    params.status = formModel.status
  }
  if (formModel.verifyTime?.length === 2 && formModel.verifyTime[0] && formModel.verifyTime[1]) {
    params.beginVerifyTime = formModel.verifyTime[0]
    params.endVerifyTime = formModel.verifyTime[1]
  }
  try {
    let res = await userActivityList(params)
    loading.value = false
    if (res?.code == 0) {
      pagination.value.total = res.total;
      formModel.list = res.rows
    } else {
    Message.error(res?.msg)
  }
  } catch(error) {
    loading.value = false
    Message.error(JSON.stringify(error) || '接口异常')
  }
 }
</script>

<style scoped>
.width-full {
  width: 100%;
}

.xxl-btn {
  ::v-deep button {
    height: 60px !important;
    line-height: 60px !important;
    padding-left: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding-right: 50px;
    font-size: 18px;
  }

  ::v-deep .arco-input-wrapper {
    padding-left: 20px;

    input {
      font-size: 18px;
    }
  }
}

.general-card {
  ::v-deep .arco-card-body {
    padding-bottom: 0;
  }
}
.line {
  padding: 8px 0;
  display: flex;
  gap: 10px;

  >* {
    display: flex;
  }

  >span:first-child {
    color: #777;
    width: 100px;
    text-align: right;
    flex: 0 0 100px;
    display: flex;
    flex-direction: row-reverse;
  }
}

.columns {
  display: flex;
  flex-direction: column;
}
</style>