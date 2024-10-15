<template>
    <PageCard>
          <div class="text">店铺认证通过后方可上线套餐哦</div>
          <div style="padding: 20px 0;">
            <a-space>
              <a-button type="primary" @click="doCreate">
                  <template #icon>
                    <icon-plus />
                  </template>
                  <!-- Use the default slot to avoid extra spaces -->
                  <template #default>新建</template>
              </a-button>
            </a-space> 
          </div>
          <div style="padding-bottom: 20px;">
            <a-space>
              <a-button :type="comboStatus === null ? 'dashed' : 'text'" shape="round" @click="doStatus(null)"><span class="text" :class="[comboStatus === null ? 'primary-text' : 'normal-text']">全部</span></a-button>
              <a-button :type="comboStatus === 0 ? 'dashed' : 'text'" shape="round" @click="doStatus(0)"><span class="text" :class="[comboStatus === 0 ? 'primary-text' : 'normal-text']">已上线</span></a-button>
              <a-button :type="comboStatus === 1 ? 'dashed' : 'text'" shape="round" @click="doStatus(1)"><span class="text" :class="[comboStatus === 1 ? 'primary-text' : 'normal-text']">已下线</span></a-button>
              <a-button :type="comboStatus === 2 ? 'dashed' : 'text'" shape="round" @click="doStatus(2)"><span class="text" :class="[comboStatus === 1 ? 'primary-text' : 'normal-text']">待审批</span></a-button>
              <a-button :type="comboStatus === 3 ? 'dashed' : 'text'" shape="round" @click="doStatus(3)"><span class="text" :class="[comboStatus === 1 ? 'primary-text' : 'normal-text']">不通过</span></a-button>
            </a-space>
            <!-- 0 上线  1 下线  2 待审批  3 不通过 @瓦是榴莲哥 
新增字段 reject_reason  拒绝原因（这个看是不是要在页面展示 -->
          </div>
          <a-table :columns="columns" :data="data.list" style="width: 100%" :loading="loading" :pagination='pagination'>
            <template #optional="{ record, rowIndex }">
              <a-space>
                <a-popconfirm content="是否下架?" v-if="record.comboStatus != '1'" @ok="doDown(record, rowIndex)">
                  <a-button status="warning"  size="mini">下架</a-button>
                </a-popconfirm>
                <a-popconfirm content="是否上架?" v-if="record.comboStatus == '1'" @ok="doUp(record, rowIndex)">
                  <a-button type="primary" size="mini">上架</a-button>
                </a-popconfirm>
                <a-button v-if="record.comboStatus == '1'" @click="doEdit(record, rowIndex)" size="mini">编辑</a-button>
                <a-popconfirm content="是否删除?" v-if="record.comboStatus == '1'" @ok="doDelete(record, rowIndex)">
                  <a-button status="danger"   size="mini">删除</a-button>
                </a-popconfirm>
              </a-space>
            </template>
            <template #comboStatus="{ record }">
              <a-tag v-if="record.comboStatus == '0'" color="orange">已上线</a-tag>
              <a-tag v-if="record.comboStatus == '1'" color="blue">已下线</a-tag>
              <a-tag v-if="record.comboStatus == '2'" color="green">待审批</a-tag>
              <a-tag v-if="record.comboStatus == '3'" color="red">不通过</a-tag>
            </template>
            <template #rejectReason="{ record }">
              <span> {{ record.comboStatus == 3 ? record.rejectReason : '--' }} </span>
            </template>
          </a-table>
        </PageCard>
  </template>
  
  <script setup>
import PageCard from '@/components/page-card/index.vue';
  import { ref, reactive, watch, onMounted } from 'vue';
  import { Message, Modal } from '@arco-design/web-vue';
  import { useRouter } from 'vue-router';
  import { comboList, comboChangeStatus, comboDelete } from '@/api/combo';
import { useMeal } from '@/store';
  
  const router = useRouter()
  const meal = useMeal()


  const comboStatus = ref(null)
  const doStatus = (type)=> {
    if (loading.value) return;
    comboStatus.value = type
    formModel.pageNum = 1
    formModel.pageSize = 10
    search()
  }
  onMounted(()=> {
    search()
  })
  const formModel = reactive({
    pageNum: 1,
    pageSize: 10,
    comboStatus: comboStatus.value
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
  const columns = [
    { title: '套餐ID', dataIndex: 'id' },
    { title: '套餐名称', dataIndex: 'comboName', width: 240, ellipsis: true },
    { title: '销量', dataIndex: 'number' },
    { title: '门店价', dataIndex: 'shopPrice' },
    { title: '团购价', dataIndex: 'comboPrice' },
    { 
      title: '状态', 
      dataIndex: 'comboStatus',
      slotName: 'comboStatus' // 使用 slot 来渲染状态列
    },
    { 
      title: '拒绝理由', 
      dataIndex: 'rejectReason',
      slotName: 'rejectReason' // 使用 slot 来渲染状态列
    },
    { title: '结束时间', dataIndex: 'validTimeEnd' },
    { title: '最近变更时间', dataIndex: 'updateTime' },
    { title: '操作', slotName: 'optional', width: 160 },
  ];
  const data = reactive({
    list: []
  });
  
  const search = async()=> {
    loading.value = true
    try {
      let res = await comboList({
        pageNum: formModel.pageNum,
        pageSize: formModel.pageSize,
        comboStatus: comboStatus.value
      })
      loading.value = false
      if (res?.code !== 200) {
        Message.error(res?.msg)
      } else {
        pagination.value.total = res.total;
        data.list = res.rows;
      }
    } catch(error) {
      loading.value = false
      Message.error(JSON.stringify(error) || '接口异常')
    }
  }

  const doCreate = ()=> {
    if (!localStorage.getItem('shopId')) {
      Message.warning('您还未绑定店铺')
      return;
    }
    meal.resetFormAll()
    router.push('/meal/create')
  }

  const doEdit = (item, index)=> {
    localStorage.setItem('mealEdit', JSON.stringify(item))
    router.push('/meal/create?id=' + item.id)
  }

  const doDown = async(item, index)=> {
    loading.value = true
    const res = await comboChangeStatus({
      id: item.id,
      comboStatus: '1'
    })
    loading.value = false
    if (res?.code != 200){
      Message.error(res?.msg);
      return;
    }
    data.list[index].comboStatus = '1'
    Message.success('下架成功');
  }

  const doUp = async(item, index)=> {
    loading.value = true
    const res = await comboChangeStatus({
      id: item.id,
      comboStatus: '0'
    })
    loading.value = false
    if (res?.code != 200){
      Message.error(res?.msg);
      return;
    }
    data.list[index].comboStatus = '0'
    Message.success('上架成功');
  }

  const doDelete = async(item, index)=> {
    loading.value = true
    const res = await comboDelete(item.id)
    if (res?.code != 200){
      Message.error(res?.msg);
      return;
    }
    loading.value = false
    search()
    Message.success('删除成功');
  }

  </script>
  
  <style scoped>
  .width-full {
    width: 100%;
  }
  

  .general-card {
    ::v-deep .arco-card-body {
      padding-bottom: 0;
    }
  }
  </style>
  