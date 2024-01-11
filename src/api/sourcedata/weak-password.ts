import axios from 'axios';
import { HttpResponse } from '../interceptor/axios';

// 列表参数
export interface WeakPasswordRequest {
  dbName: Array<string>;
  domain:Array<string>;
  password: Array<string>;
  serviceId: Array<string>;
  username: Array<string>;
  pageIndex: number;
  pageSize:number;
}
// 获取弱口令(带分页)
export function getWeakPasswordList(params: WeakPasswordRequest) {
  let url = `/host/wkp/dict/list?pageIndex=${params.pageIndex}&pageSize=${params.pageSize}`;
  if (params.dbName.length > 0) {
    url = `${url}&dbName-op=il&dbName=${JSON.stringify(params.dbName)}&dbName-ic=true`;
  }
  if (params.domain.length > 0) {
    url = `${url}&domain-op=il&domain=${JSON.stringify(params.domain)}&domain-ic=true`;
  }
  if (params.password.length > 0) {
    url = `${url}&password-op=il&password=${JSON.stringify(params.password)}&password-ic=true`;
  }
  if (params.serviceId.length > 0) {
    url = `${url}&serviceId-op=il&serviceId=${JSON.stringify(params.serviceId)}&serviceId-ic=true`;
  }
  if (params.username.length > 0) {
    url = `${url}&username-op=il&username=${JSON.stringify(params.username)}&usernameic=true`;
  }
  return axios.get<HttpResponse>(encodeURI(url));
}


export function logout() {
  return axios.get<LoginRes>('/system/user/logout');
}
