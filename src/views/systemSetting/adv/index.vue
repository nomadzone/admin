<template>
    <PageCard>
      <a-card class="general-card width-full" style="padding-bottom: 0;">
        <a-row>
          <a-col :flex="1">
            <a-form :model="formModel" :label-col-props="{ span: 6 }" :wrapper-col-props="{ span: 18 }"
              label-align="center">
              <a-row :gutter="16">
                <a-col :span="12">
                  <a-form-item field="number" label="广告名称">
                    <a-input v-model="formModel.advName" placeholder="请输广告名称" allow-clear/>
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item field="status" label="位置">
                    <a-select :style="{width:'340px'}" v-model="formModel.type" placeholder="全部" allow-clear>
                      <a-option value="">全部</a-option>
                      <a-option value="1">首页</a-option>
                      <a-option value="2">用户默认头像</a-option>
                      <a-option value="3">商家探索轮播图</a-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item field="status" label="广告类型">
                    <a-select :style="{width:'340px'}" v-model="formModel.status" placeholder="全部" allow-clear>
                      <a-option value="">全部</a-option>
                      <a-option value="1">套餐</a-option>
                      <a-option value="2">商家</a-option>
                      <a-option value="3">一起野</a-option>
                      <a-option value="4">新鲜事</a-option>
                      <a-option value="5">找搭子</a-option>
                      <a-option value="6">小程序</a-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item field="status" label="状态">
                    <a-select :style="{width:'340px'}" v-model="formModel.status" placeholder="全部" allow-clear>
                      <a-option value="">全部</a-option>
                      <a-option value="0">已下架</a-option>
                      <a-option value="1">已上架</a-option>
                    </a-select>
                  </a-form-item>
                </a-col>
              </a-row>
            </a-form>
          </a-col>
          <a-divider style="height: 32px" direction="vertical" />
          <a-col :flex="'180px'" style="text-align: right">
            <a-space direction="" :size="18">
              <a-button type="primary" @click="search" style="margin-right: 10px;">
                <template #icon>
                  <icon-search />
                </template>
                查询
              </a-button>
              <a-button  @click="reset">
                <template #icon>
                  <icon-eraser />
                </template>
                重置
              </a-button>
            </a-space>
          </a-col>
        </a-row>
      </a-card>
      <a-divider />
      <div style="padding-bottom: 16px;">
        <a-button type="primary" @click="doCreate">
            <template #icon>
                <icon-plus />
            </template>
            <template #default>新建</template>
        </a-button>
      </div>
      <a-table :columns="columns" :data="data.list" style="width: 100%" :loading="loading" :pagination='pagination'>
        <template #optional="{ record, rowIndex }">
          <a-space>
            <a-button  @click="doLook(record, rowIndex)" size="mini">查看</a-button>
            <a-button type="primary" @click="doEdit(record, rowIndex)" v-if="record.status == 0" size="mini">编辑</a-button>
            <a-button type="primary" status="success" @click="doUp(record, rowIndex)" v-if="record.status == 0" size="mini">上架</a-button>
            <a-button type="primary" status="warning" @click="doDown(record, rowIndex)" v-if="record.status == 1" size="mini">下架</a-button>
            <a-button type="primary" status="danger" @click="doDelete(record, rowIndex)" v-if="record.status == 0" size="mini">删除</a-button>
          </a-space>
        </template>
        <template #images="{ record }">
            <a-image
                v-if="record.images"
                width="32"
                :src="record.images"
            />
        </template>
        <template #type="{ record }">
          <span>{{ record.type === '1' ? '首页': (record.type === '2' ? '用户默认头像' : '商家探索轮播图') }}</span>
        </template>
        <template #orderNumber="{ record }">
          <span>{{ record.orderNumber }}</span>
        </template>
        <template #status="{ record }">
          <a-tag v-if="record.status == 1" color="blue">已上架</a-tag>
          <a-tag v-if="record.status == 0" color="red">已下架</a-tag>
        </template>
      </a-table>
      
    </PageCard>
  </template>
  
  <script setup>
  import PageCard from '@/components/page-card/index.vue';
  import { ref, reactive, onMounted } from 'vue';
  import { Message, Modal } from '@arco-design/web-vue';
  import { useRouter } from 'vue-router';
  import { noticeList, noticeRemove, noticeAdd, noticeEdit, noticeUp, noticeDown } from '@/api/adv';
  import store2 from 'store2'
  
  const router = useRouter()
  const buttonType = ref('0')
  const optionIndex = ref(-1)
  
  onMounted(() => {
    search()
  })
  const formModel = reactive({
    pageNum: 1,
    pageSize: 10,
    advName: '',
    status: '',
    type: '',
  });
  const loading = ref(false)
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
  const columns = [
    { title: '广告标题', dataIndex: 'title', ellipsis: true },
    {
      title: '广告封面',
      dataIndex: 'images',
      slotName: 'images'
    },
    {
      title: '位置',
      dataIndex: 'type',
      slotName: 'type'
    },
    {
      title: '展示顺序',
      dataIndex: 'orderNumber'
    },
    {
      title: '广告类型',
      dataIndex: 'urlType'
    },
    {
      title: '广告id',
      dataIndex: 'url'
    },
    {
      title: '状态',
      dataIndex: 'status',
      slotName: 'status' // 0下架 1上架
    },
    { title: '操作', slotName: 'optional', width: 250 },
  ];
  const data = reactive({
    list: []
  });
  const reset = ()=> {
    formModel.pageNum = 1;
    formModel.pageSize = 0;
    formModel.advName = '';
    search()
  }
  const search = async () => {
    loading.value = true
    try {
      const params = {
        pageNum: formModel.pageNum,
        pageSize: formModel.pageSize,
      }
      if (formModel.advName) {
        params.title = formModel.advName
      }
      if (formModel.status) {
        params.status = formModel.status
      }
      if (formModel.type) {
        params.type = formModel.type.toString()
      }
      let res = await noticeList(params)
      loading.value = false
      if (res?.code !== 0) {
        Message.error(res?.msg)
      } else {
        pagination.value.total = res.total;
        data.list = res.rows;
      }
    } catch (error) {
      loading.value = false
      Message.error(JSON.stringify(error) || '接口异常')
    }
  }
  
  const doLook = (record) => {
    store2.set('advInfo', record)
    router.push({
      name: 'advCreate',
      query: { id: record.id, type: 'look' }
    })
  }

  const doCreate = () => {
    store2.remove('advInfo')
    router.push({
      name: 'advCreate',
      query: { type: 'add' }
    })
  }

  const doEdit = (record) => {
  let _record = {...record}
  for (let key in _record) {
    if (_record[key]=== null || _record[key]===undefined) {
      _record[key] = ''
    }
  }
  localStorage.setItem('advInfo', JSON.stringify(_record))
    router.push({
      name: 'advCreate',
      query: { id: record.id, type: 'edit' }
    })
  }
  
  // 删除
  const doDelete = async (item, index) => {
    Modal.confirm({
      titleAlign: 'start',
      title: '删除广告',
      content: '是否确认删除, 删除后将不可恢复',
      okText: '确定',
      cancelText: '取消',
      async onOk() {
        try {
          let res = await noticeRemove({id: item.id})
          loading.value = false
          if (res?.code == 0) {
            Message.success('删除成功')
            search()
          } else {
            Message.error(res?.msg)
          }
        } catch(error) {
          Message.error(JSON.stringify(error) || '接口异常')
        }
      },
      async onCancel() {
  
      }
    });
  }
  
  // 上线
  const doUp = async (item, index) => {
    loading.value = true
    Modal.confirm({
      titleAlign: 'start',
      title: '上架广告',
      content: '是否确认上线，上线前先确认当前位置暂无已上线广告',
      okText: '确定',
      cancelText: '取消',
      async onOk() {
        try {
          let res = await noticeUp({id: item.id})
          loading.value = false
          if (res?.code == 0) {
            Message.success('上架成功')
            data.list[index].status = 1
          } else {
            Message.error(res?.msg)
          }
        } catch(error) {
          loading.value = false
          Message.error(JSON.stringify(error) || '接口异常')
        }
      },
    });
  }
  
  // 下线
  const doDown = async (item, index) => {
    loading.value = true
    Modal.confirm({
      titleAlign: 'start',
      title: '下架广告',
      content: '是否确认下架',
      okText: '确定',
      cancelText: '取消',
      async onOk() {
        try {
          let res = await noticeDown({id: item.id})
          loading.value = false
          if (res?.code == 0) {
            Message.success('下架成功')
            data.list[index].status = 0
          } else {
            Message.error(res?.msg)
          }
        } catch(error) {
          loading.value = false
          Message.error(JSON.stringify(error) || '接口异常')
        }
      },
      async onCancel() {
  
      }
    });
  }
  
  </script>
  
  <style scoped lang="scss">
  .arco-radio-button.arco-radio-checked {
    color: #fff;
    background-color: rgb(var(--primary-6));
  }
  
  .width-full {
    width: 100%;
  }
  
  
  .general-card {
    ::v-deep .arco-card-body {
      padding-bottom: 0;
    }
  }
  .ineject {
    display: flex;
    align-items: center;
    gap: 10px;
    .required {
      color: red;
    }
    .error {
      color: red;
    }
  }
  </style>