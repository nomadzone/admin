<template>
    <PageCard :pageTitle="false" isTransparent>
        <div class="card avatar">
            <a-row  :gutter="24" style="align-items: center;">
                <a-col :span="6">
                    <div style="text-align: center;">
                        <a-avatar :size="98">
                            <img
                                alt="avatar"
                                src="https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/3ee5f13fb09879ecb5185e440cef6eb9.png~tplv-uwbnlip3yd-webp.webp"
                            />
                        </a-avatar>
                    </div>
                </a-col>
                <a-col :span="8">
                    <div class="line">
                        <div>
                            <span>用户昵称:</span>
                            <span>王立群</span>
                        </div>
                        <div>
                            <span>用户ID:</span>
                            <span>awtk-55975980</span>
                        </div>
                    </div>
                </a-col>
                <a-col :span="8">
                    <div class="line">
                        <div>
                            <span>认证状态:</span>
                            <a-tag checkable color="red" :default-checked="true">未认证</a-tag>
                            <a-tag checkable color="green" :default-checked="true">已认证</a-tag>
                        </div>
                        <div>
                            <span>用户类型:</span>
                            <span>发起人</span>
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
            <a-descriptions v-if="tagIndex == 0" style="margin-top: 40px; margin-left: 20px" :data="data" :size="'large'" title="" :column="1"/>
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
    import { reactive, ref } from 'vue';
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

  const data = [{
      label: '联系方式',
      value: 'mobile',
    }, {
      label: '二维码',
      value: '123-1234-1234',
    }, {
      label: '简介',
      value: 'Beijing'
    }, {
      label: '性别',
      value: '男',
    },  {
      label: '生日',
      value: '2012-29-34',
    }, {
      label: '推荐偏好',
      value: 'Yingdu Building, Zhichun Road, Beijing'
    }];
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