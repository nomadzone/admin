import http from './axios'

// add
export function userActivityList(data: any) {
  return http({
    method: 'POST',
    url: '/admin/user/userActivity/list',
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

export function userMealList(data: any) {
  return http({
    method: 'get',
    url: '/admin/system/order/list',
    data
  })
}