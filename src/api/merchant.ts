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
        url: `/admin/system/header/list`,
        data
      })
}

// 查询商家认证列表
export function merchantIdentifyList(data: any) {
    return http({
        method: 'get',
        url: `/admin/system/auth/list`,
        data
      })
}

// 店铺审批
export function shopApprove(data: any) {
    return http({
        method: 'post',
        url: `/admin/system/auth/auth`,
        data
      })
}

// 店铺套餐列表查询

export function shopPackageList(data: any) {
    return http({
        method: 'get',
        url: `/admin/system/combo/list`,
        data
      })
}

// 店铺套餐审批
export function shopPackageApprove(data: any) {
    return http({
        method: 'post',
        url: `/admin/system/combo/edit`,
        data
      })
}

// 店铺套餐上线下线

export function shopPackageOnlineStatusChange(data: any) {
    return http({
        method: 'post',
        url: `/admin/system/combo/changeStatus`,
        data
      })
}


// 店铺订单列表查询
export function shopOrderList(data: any) {
    return http({
        method: 'get',
        url: `/admin/system/order/list`,
        data
      })
}