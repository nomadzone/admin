import http from './axios'

export function getList(data) {
  const queryParams = new URLSearchParams(data).toString();
    return http({
      method: 'POST',
      url: `/user/activity/list?${queryParams}`,  // 找搭子 type传3  新鲜事 传2
    })
  }
  export function audit(data) {
    return http({
      method: 'GET',
      url: '/admin/user/activity/audit',
      data
    })
  }
  export function onlineUp(data) {
    return http({
      method: 'GET',
      url: '/admin/user/activity/onlineUp',
      data
    })
  }
  export function onlineDown(data) {
    return http({
      method: 'GET',
      url: '/admin/user/activity/onlineDown',
      data
    })
  }