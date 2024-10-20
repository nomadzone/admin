import axios from 'axios';
import type { RouteRecordNormalized } from 'vue-router';
import { UserState } from '@/store/modules/user/types';
import http from './axios'

export interface LoginData {
  username: string;
  password: string;
  captchaId?: string;
  verifyCode?: string;
}

export interface LoginRes {
  token: string;
}
export function login(data: LoginData) {
  return http({
    method: 'GET',
    url: '/user/login',
    data
  })
  // return axios.post<LoginRes>('/api/user/login', data);
}

export function sendSms(data: any) {
  return http({
    method: 'POST',
    url: '/shop/sendSms',
    data
  })
  // return axios.post<LoginRes>('/api/user/login', data);
}

export function register(data: any) {
  return http({
    method: 'POST',
    url: '/shop/register',
    data
  })
  // return axios.post<LoginRes>('/api/user/login', data);
}

export function logout() {
  return http({
    method: 'POST',
    url: '/admin/base/comm/logout',
  })
  // return axios.post<LoginRes>('/api/user/logout');
}

export function getUserInfo() {
  return http({
    method: 'GET',
    url: '/shop/getInfo',
  })
  // return axios.post<UserState>('/api/user/info');
}

export function getRouters() {
  return http({
    method: 'GET',
    url: '/shop/getRouters',
  })
  // return axios.post<UserState>('/api/user/info');
}

export function getMenuList() {
  return axios.post<RouteRecordNormalized[]>('/api/user/menu');
}



export function orderUsedList(data:any) {
  return http({
    method: 'GET',
    url: '/shop/system/order/usedList',
    data
  })
  // return axios.post<UserState>('/api/user/info');
}

export function accountList(data:any) {
  return http({
    method: 'POST',
    url: '/user/account/list',
    data
  })
}

export function fansList(data:any, url?: string) {
  return http({
    method: 'POST',
    url: url || '/user/fans/list',
    data
  })
}