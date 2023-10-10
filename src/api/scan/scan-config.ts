import axios from 'axios';
import { HttpResponse } from '../interceptor/axios';

// 分页参数查询带条件
export interface HostScanConfigPageRequest {
  total: number;
  pageIndex: number;
  pageSize: number;
  order: string;
  sort: string;
  configName: string;
  engineName: string;
  templateName: string;
}

// 新增扫描配置
export interface HostScanConfigInsertRequest {
  configName: string;
  target: string;
  excludeTarget: string;
  engineId: number;
  templateId: number;
}

// 获取主机扫描配置列表(带分页)
export function getHostScanConfigPageList(params: HostScanConfigPageRequest) {
  let url = `/host/scan/configs?pageIndex=${params.pageIndex}&pageSize=${params.pageSize}&sort=${params.sort}&order=${params.order}`;
  if (params.configName) {
    url = `${url}&configName-op=ct&configName=${params.configName}`;
  }
  if (params.engineName) {
    url = `${url}&engineName-op=ct&engineName=${params.engineName}`;
  }
  if (params.templateName) {
    url = `${url}&templateName-op=ct&templateName=${params.templateName}`;
  }
  return axios.get<HttpResponse>(url);
}

// 新增主机扫描配置
export function insertHostScanConfig(params: HostScanConfigInsertRequest) {
  const url = '/host/scan/configs/new';
  return axios.post<HttpResponse>(url, params);
}

// 删除主机扫描配置
export function deleteHostScanConfig(configId: number) {
  const url = `/host/scan/configs/${configId}/config`;
  return axios.delete<HttpResponse>(url);
}

// 发起扫描
export function hostScan(configId: number) {
  const url = `/host/scan/${configId}`;
  return axios.get<HttpResponse>(url);
}

// 扫描配置详情
export function getHostScanConfigDetail(configId: number) {
  const url = `/host/scan/configs/${configId}/detail`;
  return axios.get<HttpResponse>(url);
}
