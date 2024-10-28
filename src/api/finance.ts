import axios from 'axios';

export interface SettlementRecord {}
// 财务管理相关接口


// 查询结算列表
export const getSettleList = (params: any) => {
    return axios.get<SettlementRecord>('/shop/system/record/list', params);
}

// 查询提现列表

export const getWithdrawList = (params: any) => {
    return axios.get<SettlementRecord>('/shop/system/record/withdrawList', params);
}

//查询活动订单收支明细
export const getActivityOrderList = (params: any) => {
    return axios.get<SettlementRecord>('/admin/user/userActivity/list', {params});
}