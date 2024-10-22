import http from './axios'

export function getList(data) {
    return http({
      method: 'POST',
      url: '/user/activity/list',  // 找搭子 type传3  新鲜事 传2
      data
    })
  }
  export function audit(data) {
    return http({
      method: 'GET',
      url: '/user/activity/audit',
      data
    })
  }
  export function onlineUp(data) {
    return http({
      method: 'GET',
      url: '/user/activity/onlineUp',
      data
    })
  }
  export function onlineDown(data) {
    return http({
      method: 'GET',
      url: '/user/activity/onlineDown',
      data
    })
  }
  // /user/userActivity/list
  export function userActivityList(data) {
    return http({
      method: 'POST',
      url: '/user/userActivity/list',
      data
    })
    }