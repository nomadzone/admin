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
      url: `/admin/user/type/list?pageSize=${data.pageSize}&pageNum=${data.pageNum}`,
    })

  }

// 添加字典
export function dictAdd(data: any) {
    return http({
      method: 'POST',
      url: '/admin/user/type/add',
      data
    })
}

// 修改字典
export function dictUpdate(data: any) {
    return http({
      method: 'POST',
      url: '/admin/user/type/edit',
      data
    })
}

// 删除字典
export function dictDelete(data: any) {
    return http({
      method: 'POST',
      url: `/admin/user/type/remove?id=${data.id}`,
    })
}


// 查询字典小项
export function dictItem(data: any) {
    return http({
      method: 'post',
      url: `/admin/user/data/list?pageSize=${data.pageSize}&pageNum=${data.pageNum}&dictType=${data.dictType}`,
     
    })
}

// 添加字典小项
export function dictItemAdd(data: any) {
    return http({
      method: 'POST',
      url: '/admin/user/data/add',
      data
    })
}

// 修改字典小项
export function dictItemUpdate(data: any) {
    return http({
      method: 'POST',
      url: '/admin/user/data/edit',
      data
    })
}

// 删除字典小项
export function dictItemDelete(data: any) {
    return http({
      method: 'POST',
      url: `/admin/user/data/remove?id=${data.id}`,
      
    })
}


// 查询系统编码配置
export function configList(data: any) {
    return http({
      method: 'POST',
      url: `/admin/user/config/list?pageSize=${data.pageSize}&pageNum=${data.pageNum}`,
    })
}


// 添加系统编码配置
export function configAdd(data: any) {
    return http({
      method: 'POST',
      url: '/admin/user/config/add',
      data
    })
}

// 修改系统编码配置

export function configUpdate(data: any) {
    return http({
      method: 'POST',
      url: '/admin/user/config/edit',
      data
    })
}


// 删除系统编码配置
export function configDelete(data: any) {
    return http({
      method: 'POST',
      url: `/admin/user/config/remove?configId=${data.configId}`,
      
    })
}