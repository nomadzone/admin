import http from './axios'

export function getList(data) {
  const queryParams = new URLSearchParams(data).toString();
  return http({
    method: 'POST',
    url: `/admin/user/activity/list?${queryParams}`,  // 找搭子 type传3  新鲜事 传2
  })
}
export function commentList(data) {
  return http({
    method: 'GET',
    url: `/admin/user/comment/list`,  // 找搭子 type传3  新鲜事 传2
    data
  })
}
export function commentRemove(data) {
  return http({
    method: 'GET',
    url: `/admin/user/comment/remove`,  // 找搭子 type传3  新鲜事 传2
    data
  })
}
export function audit(data) {
  return http({
    method: 'POST',
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
// /user/userActivity/list
export function userActivityList(data) {
  return http({
    method: 'POST',
    url: '/admin/user/userActivity/list',
    data
  })
}


export function commentDown(data) {
  return http({
    method: 'POST',
    url: `/admin/user/comment/down`,  // 找搭子 type传3  新鲜事 传2
    data
  })
}

export function commentUp(data) {
  return http({
    method: 'POST',
    url: `/admin/user/comment/up`,  // 找搭子 type传3  新鲜事 传2
    data
  })
}