import axios, { AxiosResponse } from 'axios';
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
  target: string;
  scanStatus: string;
}

// 新增扫描配置
export interface HostScanConfigInsertRequest {
  configName: string;
  target: string;
  excludeTarget: string;
  engineId: number;
  templateId: number;
}
// ----------------------------------------------系统扫描接口----------------------------------------
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
  if (params.target) {
    url = `${url}&templateName-op=ct&templateName=${params.target}`;
  }
  if (params.scanStatus) {
    url = `${url}&templateName-op=ct&templateName=${params.scanStatus}`;
  }
  return axios.get<HttpResponse>(url);
}

// 新增主机扫描配置
export function insertHostScanConfig(params: HostScanConfigInsertRequest) {
  const url = '/host/scan/configs/new';
  return axios.post<AxiosResponse<HttpResponse<any>>>(url, params);
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
// 查看扫描配置
export function getHostScanConfig(configId: number) {
  const url = `/host/scan/configs/${configId}/config`;
  return axios.get<HttpResponse>(url);
}
// 编辑扫描配置
export function editHostScanConfig(configId: number,data: HostScanConfigInsertRequest) {
  const url = `/host/scan/configs/${configId}/config`;
  return axios.put<HttpResponse>(url,data);
}
// ----------------------------------------------弱口令扫描接口----------------------------------------
// 查看弱口令扫描列表(带分页)
export function getWeakHostScanConfigPageList(params: HostScanConfigPageRequest) {
  let url = `/host/scan/configs/wkp/list?pageIndex=${params.pageIndex}&pageSize=${params.pageSize}&sort=${params.sort}&order=${params.order}`;
  if (params.configName) {
    url = `${url}&configName-op=ct&configName=${params.configName}`;
  }
  if (params.engineName) {
    url = `${url}&engineName-op=ct&engineName=${params.engineName}`;
  }
  if (params.templateName) {
    url = `${url}&templateName-op=ct&templateName=${params.templateName}`;
  }
  if (params.target) {
    url = `${url}&templateName-op=ct&templateName=${params.target}`;
  }
  if (params.scanStatus) {
    url = `${url}&templateName-op=ct&templateName=${params.scanStatus}`;
  }
  return axios.get<HttpResponse>(url);
}
// 新增弱口令扫描配置
export function insertWeakHostScanConfig(params: HostScanConfigInsertRequest) {
  const url = '/host/scan/configs/new/wkp';
  return axios.post<AxiosResponse<HttpResponse<any>>>(url, params);
}
// 编辑弱口令扫描配置
export function editWeakHostScanConfig(configId: number,data: HostScanConfigInsertRequest) {
  const url = `/host/scan/configs/${configId}/wkp/config`;
  return axios.put<HttpResponse>(url,data);
}
// 查看弱口令扫描配置
export function getWeakHostScanConfig(configId: number) {
  const url = `/host/scan/configs/${configId}/wkp/config`;
  return axios.get<HttpResponse>(url);
}
// 扫描弱口令配置详情
export function getWeakHostScanConfigDetail(configId: number) {
  const url = `/host/scan/configs/${configId}/wkp/detail`;
  return axios.get<HttpResponse>(url);
}
// 发起弱扫描
export function weakHostScan(configId: number) {
  const url = `/host/wkp/scan/${configId}`;
  return axios.get<HttpResponse>(url);
}