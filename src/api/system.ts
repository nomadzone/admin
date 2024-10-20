import http from './axios'

export interface dictList {
    pageNum: string;
    pageSize: string;
}

export interface DictRecord {}
// 查询字典
export function dictList(data: dictList & any) {
    return http({
      method: 'post',
      url: `/user/type/list?pageSize=${data.pageSize}&pageNum=${data.pageNum}`,
    })

  }

// 添加字典
export function dictAdd(data: any) {
    return http({
      method: 'POST',
      url: '/user/type/add',
      data
    })
}

// 修改字典
export function dictUpdate(data: any) {
    return http({
      method: 'POST',
      url: '/user/type/edit',
      data
    })
}

// 删除字典
export function dictDelete(data: any) {
    return http({
      method: 'POST',
      url: `/user/type/remove?id=${data.id}`,
    })
}


// 查询字典小项
export function dictItem(data: any) {
    return http({
      method: 'post',
      url: `/user/data/list?pageSize=${data.pageSize}&pageNum=${data.pageNum}&dictType=${data.dictType}`,
     
    })
}

// 添加字典小项
export function dictItemAdd(data: any) {
    return http({
      method: 'POST',
      url: '/user/data/add',
      data
    })
}

// 修改字典小项
export function dictItemUpdate(data: any) {
    return http({
      method: 'POST',
      url: '/user/data/update',
      data
    })
}

// 删除字典小项
export function dictItemDelete(id: string | number) {
    return http({
      method: 'POST',
      url: '/user/data/remove',
      data: { id }
    })
}


// 查询系统编码配置
export function configList(data: any) {
    return http({
      method: 'POST',
      url: '/user/config/list',
      data
    })
}


// 添加系统编码配置
export function configAdd(data: any) {
    return http({
      method: 'POST',
      url: '/user/config/add',
      data
    })
}

// 修改系统编码配置

export function configUpdate(data: any) {
    return http({
      method: 'POST',
      url: '/user/config/update',
      data
    })
}


// 删除系统编码配置
export function configDelete(id: string | number) {
    return http({
      method: 'POST',
      url: '/user/config/remove',
      data: { id }
    })
}