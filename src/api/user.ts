import axios from 'axios';
import type { RouteRecordNormalized } from 'vue-router';
import { UserState } from '@/store/modules/user/types';

export interface LoginData {
  username: string;
  password: string;
  captcha: string;
  captchaKey: string;
}

export interface LoginRes {
  token: string;
}
export interface captchaRes {
  data: any;
}
export function login(data: LoginData) {
  return axios.post<LoginRes>('system/user/login', data);
}

export function logout() {
  return axios.get<LoginRes>('/system/user/logout');
}

export function getUserInfo() {
  return axios.get<UserState>('/system/user/info');
}

export function getMenuList() {
  return axios.get<RouteRecordNormalized[]>('/system/menus/list');
}
export function getCaptchaImg() {
  return axios.get<captchaRes>('/captcha');
}
