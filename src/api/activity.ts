import http from './axios'

export function getList(data) {
    return http({
      method: 'POST',
      url: '/user/activity/list',
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