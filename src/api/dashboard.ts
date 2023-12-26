import axios from 'axios';
import type { TableData } from '@arco-design/web-vue/es/table/interface';

export interface ContentDataRecord {
  x: string;
  y: number;
}

export function queryContentData() {
  return axios.get<ContentDataRecord[]>('/api/content-data');
}

export interface PopularRecord {
  key: number;
  clickNumber: string;
  title: string;
  increases: number;
}

export function queryPopularList(params: { type: string }) {
  return axios.get<TableData[]>('/api/popular/list', { params });
}
// 获取系统信息
export function querySysParams() {
  return axios.get('/index/system/params');
}
// 获取漏洞数量
export function querySysVulns() {
  return axios.get('/index/vulnerability');
}
// 获取漏洞类别维度统计数据
export function queryVulnsByCategory() {
  return axios.get('/index/category/vulnerability');
}
// 获取风险维度统计数据
export function queryVulnsBySys() {
  return axios.get('/index/os/vulnerability');
}
// 获取资产数量
export function queryAssetNumber() {
  return axios.get('/index/risk/asset/number');
}
// 查询统计漏洞
export function queryVulnsTop(number) {
  return axios.get(`/index/vulnerability/top/${number}`);
}
// 查询漏洞资产趋势
export function queryTend(unit) {
  return axios.get(`/index/vulnerability/both/asset/${unit}/trend`);
}