
import http from './axios'


export function findPartnerList(data: any) {
    return http({
      method: 'POST',
      url: `/shop/user/findPartner/list`,
      data
    })
}