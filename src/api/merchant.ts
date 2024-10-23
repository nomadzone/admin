import http from './axios'



export interface shopList {
    pageNum: string;
    pageSize: string;
}

export interface MerchantRecord {}

// 查询商户品类列表
export function merchantCategoryList(data: any) {
    return http({
        method: 'get',
        url: `/admin/system/categoryName/list`,
        data
      })
}

// 新建商户品类
export function merchantCategoryAdd(data: any) {
    return http({
        method: 'post',
        url: `/admin/system/categoryName/add`,
        data
      })
}

// 修改商户品类
export function merchantCategoryEdit(data: any) {
    return http({
        method: 'post',
        url: `/admin/system/categoryName/edit`,
        data
      })
}

// 删除商户品类

export function merchantCategoryDelete(data: any) {
    return http({
        method: 'DELETE',
        url: `/admin/system/categoryName/delete/${data.id}`,
      })
}

// 查询商户列表
export function shopList(data: shopList & any) {

    return http({
        method: 'get',
        url: `/admin/system/header/list`,
        data
      })
}

// 修改商户状态
export function shopStatusChange(data: any) {
    return http({
        method: 'post',
        url: `/admin/system/header/changeStatus`,
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


// 查询店铺结算列表
export function shopSettlementList(data: any) {
    return http({
        method: 'get',
        url: `/admin/system/record/list`,
        data
      })
}
// 查询店铺结算汇总
export function shopSettlementTotal(data: any) {
    return http({
        method: 'get',
        url: `/admin/system/record/findSettlementSum`,
        data
      })
}