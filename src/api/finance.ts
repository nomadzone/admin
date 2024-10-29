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
    return axios.post<SettlementRecord>('/admin/user/userActivity/orderList', params);
}

//查询活动订单收支汇总
export const shopSettlementActiveTotal = (params: any) => {
    return axios.post<SettlementRecord>('/admin/user/userActivity/statistics', params);
}

//活动订单结算
export const shopActivitySettlementDeal = (params: any) => {
    return axios.post<SettlementRecord>('/admin//user/userActivity/settlement', params);
}
