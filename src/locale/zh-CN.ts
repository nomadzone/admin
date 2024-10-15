import localeMessageBox from '@/components/message-box/locale/zh-CN';
import localeLogin from '@/views/login/locale/zh-CN';

import localeWorkplace from '@/views/dashboard/workplace/locale/zh-CN';
import localAccount from '@/views/systemSetting/locale/zh-CN';

import localCommon from './zh-CN/common';
import localeSettings from './zh-CN/settings';
import localStore from '@/views/store/locale/zh-CN';
import localFinance from '@/views/finance/locale/zh-CN';


export default {
  'menu.dashboard': '仪表盘',
  'menu.server.dashboard': '仪表盘-服务端',
  'menu.server.workplace': '工作台-服务端',
  'menu.server.monitor': '实时监控-服务端',
  'menu.list': '列表页',
  'menu.result': '结果页',
  'menu.exception': '异常页',
  'menu.consumption': '消费验证',
  'menu.form': '表单页',
  'menu.profile': '详情页',
  'menu.visualization': '数据可视化',
  'menu.user': '个人中心',
  'menu.arcoWebsite': 'Arco Design',
  'menu.faq': '常见问题',
  'menu.systemSetting': '系统设置',
  'menu.systemSetting.account': '账号管理',
  'menu.systemSetting.accountDetail': '账号详情',
  'menu.systemSetting.accountCreate': '新增账号',
  'menu.systemSetting.roles': '角色管理',
  'menu.store': '店铺管理',
  'menu.store.verifie': '实名认证',
  'menu.store.setting': '店铺设置',
  'menu.store.settlement': '结算设置',
  'navbar.docs': '文档中心',
  'navbar.action.locale': '切换为中文',
  "menu.meal":"套餐管理",
  "menu.create": "新建套餐",
  "menu.users":"用户管理",
  "order.manage":"订单管理",
  "order.meal":"套餐订单",
  "order.refund":"退款维权",
  'menu.finance': '财务管理',
  'menu.finance.revenueExpenditure': '收支明细',
  'order.refund.details': '退款维权',
  'menu.finance.withdrawalApply': '申请提现',
  'menu.finance.settlement': '结算明细',
  'menu.finance.withdrawal': '提现明细',
  'activity.meal': '一起野',
  'activity.manage': '活动管理',
  ...localCommon,
  ...localeSettings,
  ...localeMessageBox,
  ...localeLogin,
  ...localeWorkplace,
  ...localAccount,
  ...localStore,
  ...localFinance
};
