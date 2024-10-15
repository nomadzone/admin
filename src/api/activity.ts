import http from './axios'


export function getList(data) {
    return http({
      method: 'POST',
      url: '/user/together/list',
      data
    })
  }
  // /user/together/audit
  export function audit(data) {
    return http({
      method: 'GET',
      url: '/user/together/audit',
      data
    })
  }
  export function onlineUp(data) {
    return http({
      method: 'GET',
      url: '/user/together/onlineUp',
      data
    })
  }
  export function onlineDown(data) {
    return http({
      method: 'GET',
      url: '/user/together/onlineDown',
      data
    })
  }