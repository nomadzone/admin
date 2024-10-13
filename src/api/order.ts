import http from './axios'

interface Order {
    orderStatusName?: string;
    verifyStatusName?: string;
    appUserId?: string;
    appNikeName?: string;
    verifyUserId?: string;
    verifyNikeName?: string;
    verifyTime?: string;
    rejectReturnReason?: string;
    payDate?: string;
    returnNo?: string;
    userId?: number;
    updateTime?: string;
    orderStatus?: string;
    returnWay?: string;
    updateBy?: string;
    createTime?: string;
    shopComboId?: number;
    payType?: string;
    orderNo?: string;
    shopId?: number;
    buyerName?: string;
    createBy?: string;
    orderDate?: string;
    remark?: string;
    dimensionId?: number;
    number?: number;
    verifyStatus?: string;
    defendRightsReason?: string;
    serviceCost?: number;
    discount?: number;
    orderAmount?: number;
    returnDate?: string;
    shopComboName?: string;
    phone?: string;
    returnStatus?: string;
    delFlag?: string;
    id?: string | number;
  }

export interface orderList {
    pageNum: string;
    pageSize: string;
}

export function orderList(data: orderList & any) {
    return http({
      method: 'get',
      url: '/shop/system/order/list',
      data
    })
}

export function orderAdd(data: Order) {
    return http({
      method: 'POST',
      url: '/shop/system/order/Add',
      data
    })
}

export function orderTicketCode(data: any) {
    return http({
      method: 'POST',
      url: `/shop/system/order/verify`,
      data
    })
}

export function orderCancel(id: string | number) {
    return http({
      method: 'POST',
      url: '/shop/system/order/cancel',
      data: { id }
    })
}

export function orderFindByTicketCode(data: any) {
    return http({
      method: 'get',
      url: '/shop/system/order/findByTicketCode',
      data
    })
}

export interface RefundApproval {
    id: string;
    returnStatus: 0 | 1,
    rejectReturnReason: string
}

export function orderRefundApproval(data: RefundApproval) {
    return http({
      method: 'POST',
      url: '/shop/system/order/refundApproval',
      data
    })
}
