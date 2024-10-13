import axios from 'axios';

export interface SettlementRecord {}
// 财务管理相关接口


// 查询结算列表
export const getSettleList = (params: any) => {
    return axios.get<SettlementRecord>('/shop/system/record/list', params);
}