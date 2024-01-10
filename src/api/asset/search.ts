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
// 统计数据返回参数
export interface staticCounteReq {
  componentNumber:number,
  hostNumber:number,
  serviceNumber:number,
  vulnerabilityNumber:number,

}
// 资产用户组列表参数
export interface assetUsersReq {
  pageIndex:number,
  pageSize:number,
  username:string,
}
// windows补丁列表
export interface windowsPatchPageRequest {
  total: number;
  pageIndex: number;
  pageSize: number;
  order: string;
  sort: string;
  hotfixId: string;
}
// 主机进程列表参数
export interface hostProcPageRequest{
  total: number;
  pageIndex: number;
  pageSize: number;
  order: string;
  sort: string;
  port: string;
}
// 主机安装软件列表
export interface installSoftwarePageRequest{
  total: number;
  pageIndex: number;
  pageSize: number;
  order: string;
  sort: string;
  name: string;
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
// 查询单个主机用户和组列表
export function getUsersList(assetId:number,params:assetUsersReq) {
  let url = `/asset/${assetId}/both/user/group?pageIndex=${params.pageIndex}&pageSize=${params.pageSize}`;
  if(params.username){
    url = `${url}&username=${params.username}&username-ic=true&username-op=ct`
  }
  return axios.get<HttpResponse>(url);
}
// 查询单个资产Windows补丁列表
export function getAssetHotfixList(assetId:string, params:windowsPatchPageRequest){
  let url = `/asset/${assetId}/hotfix?pageIndex=${params.pageIndex}&pageSize=${params.pageSize}`;
  if (params.hotfixId) {
    url = `${url}&hotfixId=${params.hotfixId}&hotfixId-ic=true&hotfixId-op=ct`;
  }
  return axios.get<HttpResponse>(url);
}
// 查询主机进程列表
export function getAssetHostProcList(assetId:string, params:hostProcPageRequest){
  let url = `/asset/${assetId}/proc?pageIndex=${params.pageIndex}&pageSize=${params.pageSize}`;
  if (params.port) {
    url = `${url}&port-op=eq&port=${params.port}`;
  }
  return axios.get<HttpResponse>(url);
}
// 查询单个主机安装软件列表
export function getAssetInstallSoftwareList(assetId:string, params:installSoftwarePageRequest){
  let url = `/asset/${assetId}/software?pageIndex=${params.pageIndex}&pageSize=${params.pageSize}`;
  if (params.name) {
    url = `${url}&name-op=ct&name=${params.name}&name-ic=true`;
  }
  return axios.get<HttpResponse>(url);
}
