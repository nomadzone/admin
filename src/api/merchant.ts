import http from './axios'



export interface shopList {
    pageNum: string;
    pageSize: string;
}

export interface MerchantRecord {}

// 查询商户列表
export function shopList(data: shopList & any) {

    return http({
        method: 'get',
        url: `/system/header/list`,
      })
}