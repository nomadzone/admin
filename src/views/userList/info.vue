<template>
    <PageCard :pageTitle="false" isTransparent>
        <div class="card avatar">
            <a-row  :gutter="24" style="align-items: center;">
                <a-col :span="6">
                    <div style="text-align: center;">
                        <a-avatar :size="98" v-if="info.avatarUrl">
                            <img
                                alt="avatar"
                                :src="info.avatarUrl"
                            />
                        </a-avatar>
                    </div>
                </a-col>
                <a-col :span="8">
                    <div class="line">
                        <div>
                            <span>用户昵称:</span>
                            <span>{{info.nickname}}</span>
                        </div>
                        <div>
                            <span>用户ID:</span>
                            <span>{{info.id}}</span>
                        </div>
                    </div>
                </a-col>
                <a-col :span="8">
                    <div class="line">
                        <div>
                            <span>认证状态:</span>
                            <a-tag  color="red" v-if="info.status === '0'" :default-checked="true">未认证</a-tag>
                            <a-tag  color="green" v-if="info.status === '1'" :default-checked="true">已认证</a-tag>
                        </div>
                        <div>
                            <span>用户类型:</span>
                            <span v-if="info.userType === '1'">发起人</span>
                            <span v-else>普通用户</span>
                        </div>
                    </div>
                </a-col>
            </a-row>
        </div>
        <div class="card show">
            <div class="tag">
                <div v-for="(item, index) in tags.list" :key="index">
                    <span @click="doTag(index)" :class="[index === tagIndex ? 'active' : '']">{{ item.name }}</span>
                </div>
            </div>
            <a-descriptions v-if="tagIndex == 0" style="margin-top: 40px; margin-left: 20px" :data="data.value" :size="'large'" title="" :column="1"/>
            <fen v-if="tagIndex === 1"></fen>
            <yue v-if="tagIndex === 2"></yue>
            <xian v-if="tagIndex === 3"></xian>
            <dazi v-if="tagIndex === 4"></dazi>
            <order v-if="tagIndex === 5"></order>
            <revenue v-if="tagIndex === 6"></revenue>
        </div>
    </PageCard>
  </template>
  
  <script setup lang="ts">
  import PageCard from '@/components/page-card/index.vue';
  import fen from './commponents/fen.vue'
  import order from './commponents/order.vue'
  import yue from './commponents/yue.vue'
  import xian from './commponents/xian.vue'
  import dazi from './commponents/dazi.vue'
  import revenue  from './commponents/revenue.vue'
    import { onMounted, reactive, ref } from 'vue';

    let info = ref({
      id: '',
      avatarUrl: '',
      phoneNumber: '',
      gender: '',
      birthdayTime: '',
      nickname: '',
      introduce: '', // 简介
      status: '0', // 认证状态 0未认领  1已认证
      userType: '0', // userType是否发起过活动 1 发起过 其他没有
    })

  const data = reactive({
    value: [{
      label: '联系方式',
      key: 'phoneNumber',
      value: '',
    }, {
      label: '二维码',
      key: 'contactphoto',
      value: '',
    }, {
      label: '简介',
      key: 'introduce',
      value: ''
    }, {
      label: '性别',
      key: 'gender',
      value: '',
    },  {
      label: '生日',
      key: 'birthdayTime',
      value: '',
    }, {
      label: '推荐偏好',
      key: 'userPreference',
      value: ''
    }]
  });
    onMounted(()=> {
      const userListInfo = JSON.parse(localStorage.getItem('userListInfo'))
      data.value.map(item=> {
        const id = item.key
        if (id === 'gender') {
          // 0男 1女 2未知
          if (userListInfo[id] == '0') {
            userListInfo[id] = '男'
          } else if (userListInfo[id] == '1') {
            userListInfo[id] = '女'
          } else {
            userListInfo[id] = '未知'
          }
        }
        if(id === 'userPreference') {
          let name = []
          userListInfo.userPreferenceList.map(item=> {
            name.push(item.name)
          })
          userListInfo[id] = name.join(', ')
        }
        item.value = userListInfo[id] ? userListInfo[id] : '--'
      })
      info.value = userListInfo
    })


  const tags = reactive({
    list: [
        { id: 0, name: '基础信息' },
        { id: 1, name: '关注/粉丝列表' },
        { id: 2, name: '一起野列表' },
        { id: 3, name: '新鲜事列表' },
        { id: 4, name: '找搭子列表' },
        { id: 5, name: '订单记录' },
        { id: 6, name: '收支明细' },
    ]
  })
  const tagIndex = ref(0)
  const doTag = (index)=> {
    tagIndex.value = index
  }
  </script>
  
  <style lang="scss" scoped>
  .card {
    background-color: var(--color-bg-2);
    border-radius: .25rem;
    padding: 1.5rem;
    width: 100%;
    box-sizing: border-box;
    margin-bottom: 1rem;
  }
  .avatar {
    padding: 48px 0;
    .line {
        > div {
            padding: 8px 0;
            > span:first-child {
                color: #777;
                padding-right: 8px
            }
        }
    }
  }
  .show {
    padding: 16px;
    box-sizing: border-box;
    padding-bottom: 60px;
    min-height: 300px;
  }
  .tag {
    display: flex;
    gap: 8px;
    color: #444;
    span {
        padding: 6px 16px;
        border-radius: 20px;
        cursor: pointer;
        &:hover {
            background-color: #F2F3F5;
        }
    }
    .active {
        background-color: #F2F3F5;
        color: #165DFF;
    }
    box-sizing: border-box;
  }
  </style>