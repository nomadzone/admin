import http from './axios'
export interface dictList {
    pageNum: string;
    pageSize: string;
}
export function dictList(data: dictList & any) {
    return http({
      method: 'get',
      url: '/admin/user/type/list',
      data
    })
}