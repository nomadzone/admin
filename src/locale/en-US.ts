import localeMessageBox from '@/components/message-box/locale/en-US';
import localeLogin from '@/views/login/locale/en-US';

import localeWorkplace from '@/views/dashboard/workplace/locale/en-US';
import localAccount from '@/views/systemSetting/locale/en-US';

import localCommon from './en-US/common';
import localeSettings from './en-US/settings';
import localStore from '@/views/store/locale/en-US';
import localFinance from '@/views/finance/locale/en-US';

export default {
  'menu.dashboard': 'Dashboard',
  'menu.server.dashboard': 'Dashboard-Server',
  'menu.server.workplace': 'Workplace-Server',
  'menu.server.monitor': 'Monitor-Server',
  'menu.list': 'List',
  'menu.result': 'Result',
  'menu.exception': 'Exception',
  'menu.form': 'Form',
  'menu.consumption': 'Consumption verification',
  'menu.profile': 'Profile',
  'menu.visualization': 'Data Visualization',
  'menu.user': 'User Center',
  'menu.arcoWebsite': 'Arco Design',
  'menu.faq': 'FAQ',
  'menu.systemSetting': 'System Setting',
  'menu.systemSetting.account': 'Account Management',
  'menu.systemSetting.accountDetail': 'Account Detail',
  'menu.systemSetting.accountCreate': 'Create Account',
  'menu.systemSetting.roles': 'Roles Management',
  'menu.store': 'Store Management',
  'menu.store.verifie': 'Verifie',
  'menu.store.setting': 'Store Setting',
  'navbar.docs': 'Docs',
  'navbar.action.locale': 'Switch to English',
  "menu.meal":"Meal Management",
  "menu.create":"Create Meal",
  "menu.users":"users manage",
  'order.refund.details': 'refund details',
  'menu.finance': 'Finance Management',
  'menu.finance.revenueExpenditure': 'Revenue and Expenditure',
  'menu.finance.withdrawalApply': 'Withdrawal Application',
  'menu.finance.settlement': 'Settlement',
  'menu.finance.withdrawal': 'Withdrawal',
  ...localCommon,
  ...localeSettings,
  ...localeMessageBox,
  ...localeLogin,
  ...localeWorkplace,
  ...localAccount,
  ...localStore,
  ...localFinance
};
