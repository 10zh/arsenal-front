import axios, { AxiosResponse } from 'axios';
import { HttpResponse } from '../interceptor/axios';

export interface assetSearchListPageRequest {
  total: number;
  pageIndex: number;
  pageSize: number;
  q:string;
}
// 获取搜索条件自动补全列表
export function getSearchAutoComplete(key: string) {
  const url = `/asset/search/auto?key=${key}`;
  return axios.get<HttpResponse>(url);
}
// 获取资产搜索列表
export function getSearchList(params:  assetSearchListPageRequest) {
  let url = `/asset/search?pageIndex=${params.pageIndex}&pageSize=${params.pageSize}`;
  if (params.q) {
    url = `${url}&q=${params.q}`;
  }
  return axios.get<HttpResponse>(url);
}

