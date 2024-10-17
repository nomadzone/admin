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
                    <a-input v-model="formModel.advName" placeholder="请输广告名称" />
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item field="status" label="状态">
                    <a-select :style="{width:'340px'}" v-model="formModel.status" placeholder="全部">
                      <a-option value="">全部</a-option>
                      <a-option value="0">已上线</a-option>
                      <a-option value="1">已下线</a-option>
                      <a-option value="2">待审批</a-option>
                      <a-option value="3">不通过</a-option>
                    </a-select>
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
            <!-- Use the default slot to avoid extra spaces -->
            <template #default>新建</template>
        </a-button>
      </div>
      <a-table :columns="columns" :data="data.list" style="width: 100%" :loading="loading" :pagination='pagination'>
        <template #optional="{ record, rowIndex }">
          <a-space>
            <a-link @click="doLook(record, rowIndex)" size="mini">查看</a-link>
            <a-link @click="doEdit(record, rowIndex)" size="mini">编辑</a-link>
            <a-link status="success" @click="doUp(record, rowIndex)" size="mini">上线</a-link>
            <a-link status="warning" @click="doDown(record, rowIndex)" size="mini">下线</a-link>
            <a-link status="danger" @click="doDelete(record, rowIndex)" size="mini">删除</a-link>
          </a-space>
        </template>
        <template #images="{ record }">
            <a-image
                width="32"
                src="https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/a8c8cdb109cb051163646151a4a5083b.png~tplv-uwbnlip3yd-webp.webp"
            />
        </template>
        <template #status="{ record }">
          <a-tag v-if="record.status == '0'" color="orange">已上线</a-tag>
          <a-tag v-if="record.status == '1'" color="blue">已下线</a-tag>
        </template>
      </a-table>
      
    </PageCard>
  </template>
  
  <script setup>
  import PageCard from '@/components/page-card/index.vue';
  import { ref, reactive, watch, onMounted, inject } from 'vue';
  import { Message, Modal } from '@arco-design/web-vue';
  import { useRouter } from 'vue-router';
  import { comboList, comboChangeStatus, comboDelete } from '@/api/combo';
  import { useMeal } from '@/store';
  
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
    { title: '广告ID', dataIndex: 'id' },
    { title: '广告标题', dataIndex: 'name', width: 240, ellipsis: true },
    {
      title: '广告封面',
      dataIndex: 'images',
      slotName: 'images' // 使用 slot 来渲染状态列
    },
    { title: '位置/排列', dataIndex: 'sort' },
    {
      title: '状态',
      dataIndex: 'status',
      slotName: 'status' // 使用 slot 来渲染状态列
    },
    { title: '发布时间', dataIndex: 'startTime' },
    { title: '操作', slotName: 'optional', width: 260 },
  ];
  const data = reactive({
    list: [1]
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
      let res = await comboList({
        pageNum: formModel.pageNum,
        pageSize: formModel.pageSize,
        advName: formModel.advName,
      })
      loading.value = false
      if (res?.code !== 200) {
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
  
  const doLook = (item) => {
    router.push({
      name: 'advCreate',
      query: { id: item.id || '111', type: 'look' }
    })
  }

  const doCreate = (item) => {
    router.push({
      name: 'advCreate',
      query: { type: 'add' }
    })
  }

  const doEdit = (item) => {
    router.push({
      name: 'advCreate',
      query: { id: item.id || '111', type: 'edit' }
    })
  }
  
  // 通过
  const doDelete = async (item, index) => {
    Modal.confirm({
      titleAlign: 'start',
      title: '删除广告',
      content: '是否确认删除, 删除后将不可恢复',
      okText: '确定',
      cancelText: '取消',
      async onOk() {
        try {
          let res = await orderCancel(item.id)
          loading.value = false
          if (res?.code == 200) {
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
    Modal.confirm({
      titleAlign: 'start',
      title: '上架广告',
      content: '是否确认上线，上线前先确认当前位置暂无已上线广告',
      okText: '确定',
      cancelText: '取消',
      async onOk() {
        try {
          let res = await orderCancel(item.id)
          loading.value = false
          if (res?.code == 200) {
            Message.success('上架成功')
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
  
  // 下线
  const doDown = async (item, index) => {
    Modal.confirm({
      titleAlign: 'start',
      title: '下架广告',
      content: '是否确认下架',
      okText: '确定',
      cancelText: '取消',
      async onOk() {
        try {
          let res = await orderCancel(item.id)
          loading.value = false
          if (res?.code == 200) {
            Message.success('下架成功')
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