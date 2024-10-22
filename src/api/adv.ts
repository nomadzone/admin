import http from './axios'

export function noticeList(data: any) {
    return http({
      method: 'POST',
      url: '/admin/user/notice/list',
      data
    })
}

export function noticeRemove(data: any) {
    return http({
      method: 'GET',
      url: '/admin/user/notice/remove',
      data
    })
}


export function noticeEdit(data: any) {
    return http({
      method: 'POST',
      url: '/admin/user/notice/edit',
      data
    })
}

export function noticeAdd(data: any) {
    return http({
      method: 'POST',
      url: '/admin/user/notice/add',
      data
    })
}

export function noticeUp(data: any) {
    return http({
      method: 'POST',
      url: '/admin/user/notice/onlineUp',
      data
    })
}

export function noticeDown(data: any) {
    return http({
        method: 'POST',
      url: '/admin/user/notice/onlineDown',
      data
    })
}