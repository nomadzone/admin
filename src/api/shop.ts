import http from 'axios';

export interface ShopRecord {
    id:any;
    name: string;
    category: string;
    phone: string;
    qrCode: string;
    shopStatus: number;
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
    businessHoursStart: string;
    businessHoursEnd: string;
    province: string;
    city: string;
    county: string;
    longitude: string;
    latitude: string;
    perCapita: number;
    profilePhotoUrl: string;
    
}

// 获取登录用户的店铺信息
export function getLoginAccountShop() {
    return http.get<ShopRecord>('/shop/system/header/findShopByLoginUser');
}
  
// 新增店铺
export function addShop(data: ShopRecord) {
    return http.post<ShopRecord>('/shop/system/header/add', data);
}
// 获取店铺经纬度
export function getShopAddressPoint(data: any) {
    console.log('=================', data)

    return http({
        method: 'get',
        url: '/ws/geocoder/v1',
        params:data
      })
}

// 获取店铺认证状态
export function getShopAuthStatus(data: any) {
    return http.get(`/shop/system/auth/findByUserId/${data.id}`);
}



// 新增店铺认证
export function addShopAuth(data: any) {
    return http.post('/shop/system/auth/add', data);
}

