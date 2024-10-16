import http from './axios'

interface ShopComboClassify {
    id?: string;
    shopComboId?: number;
    pid?: string;
    level?: string;
    name?: string;
    price?: string;
    number?: string;
  }
  
  interface ComboClassify {
    name?: string;
    updateBy?: string;
    id?: number;
    createBy?: string;
    number?: number;
    updateTime?: string;
    level?: string;
    pid?: string | null;
    shopComboClassifyList?: ShopComboClassify[];
    shopComboId?: number;
    createTime?: string | null;
    price?: number | null;
  }
  
  interface ComboData {
    createBy?: string;
    createTime?: string | null;
    updateBy?: string;
    updateTime?: string | null;
    dimensionId?: number;
    id?: number | string;
    shopId?: number;
    number?: number;
    comboName?: string;
    comboPrice?: number;
    comboStatus?: string | null;
    personNumber?: string | null;
    shopPrice?: string | null;
    monday?: string | null;
    tuesday?: string | null;
    wednesday?: string | null;
    thursday?: string | null;
    friday?: string | null;
    saturday?: string | null;
    sunday?: string | null;
    legalHolidayStatus?: string | null;
    allDayStatus?: string | null;
    allTimeStatus?: string | null;
    usedTimeStart?: string | null;
    usedTimeEnd?: string | null;
    remainingNumber?: string | null;
    comboPhotoUrl?: string | null;
    comboRemark?: string | null;
    comboClassifyList?: ComboClassify[];
  }

export interface ComboList {
    pageNumber: string;
    pageSize: string;
}

export function comboList(data: ComboList) {
    return http({
      method: 'get',
      url: '/shop/system/combo/list',
      data
    })
}

export function comboAdd(data: any) {
    return http({
      method: 'POST',
      url: '/shop/system/combo/add',
      data
    })
}

export function comboEdit(data: any) {
    return http({
      method: 'POST',
      url: '/shop/system/combo/edit',
      data
    })
}

export function comboDelete(id: string | number) {
    return http({
      method: 'DELETE',
      url: `/shop/system/combo/${id}`
    })
}

export interface ChangeStatus {
    id: string | number;
    comboStatus: '0' | '1'
}

export function comboChangeStatus(data: ChangeStatus) {
    return http({
      method: 'POST',
      url: `/shop/system/combo/changeStatus`,
      data
    })
}