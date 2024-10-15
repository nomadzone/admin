
import http from './axios'

export interface dictCode {
    code: string;
}

// 根据code查询系统字典
export function getDictByCode(data: dictCode) {
    return http({
      method: 'GET',
      url: '/shop/system/header/findDictListByCode',
      data
    })
}

