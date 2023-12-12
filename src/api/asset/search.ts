import axios, { AxiosResponse } from 'axios';
import { HttpResponse } from '../interceptor/axios';

export interface assetSearchListPageRequest {
  total: number;
  pageIndex: number;
  pageSize: number;
  q:string;
}
// 获取图表信息的搜索条件
export interface assetSearchListChartRequest {
  size: number;
  type: string;
  q: string;
}
// 分页参数
export interface assetSearchVulnListReq {
  pageIndex:number;
  pageSize:number;
}
// 获取搜索条件自动补全列表
export function getSearchAutoComplete(key: string) {
  const url = `/asset/search/auto?key=${key}`;
  return axios.get<HttpResponse>(url);
}
// 获取搜索历史
export function getSearchHistoryList() {
  const url = `/asset/search/history`;
  return axios.get<HttpResponse>(url);
}
// 获取统计数据
export function getDiscoveryCount() {
  const url = `/asset/asset/discovery/count`;
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
// 获取资产聚合信息
export function getSearchInfo(params:  assetSearchListPageRequest) {
  let url = `/asset/search/aggregate`;
  if (params.q) {
    url = `${url}?q=${params.q}`;
  }
  return axios.get<HttpResponse>(url);
}
// 搜索图表信息
export function getBarChartList(params:  assetSearchListChartRequest) {
  let url = `/asset/search/aggregate/${params.type}/more`;
  if (params.q) {
    url = `${url}?q=${params.q}`;
  }
if(params.size) {
  url = `${url}&size=${params.size}`;
}
  return axios.get<HttpResponse>(url);
}
// 获取单个资产详情信息
export function getSearchDetail(id:number) {
  const url = `/asset/search/${id}/detail`;
  return axios.get<HttpResponse>(url);
}
// 获取单个资产详情的漏洞列表信息
export function getSearchDetailVulns(id:number,page:assetSearchVulnListReq) {
  const url = `/asset/${id}/search/vulns?pageIndex=${page.pageIndex}&pageSize=${page.pageSize}`;
  return axios.get<HttpResponse>(url);
}
// 获取漏洞详情
export function getLeakDetail(id:number) {
  const url = `/asset/${id}/vuln/detail`;
  return axios.get<HttpResponse>(url);
}