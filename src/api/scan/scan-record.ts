import axios from 'axios';
import { HttpResponse } from '../interceptor/axios';

// 扫描状态枚举
// eslint-disable-next-line no-shadow
export enum ScanStatus {
  'scan.status.not.start',
  'scan.status.prepare',
  'scan.status.progress',
  'scan.status.suspend',
  'scan.status.stop',
  'scan.status.fail',
  'scan.status.finish',
}

// 状态对应颜色枚举
// eslint-disable-next-line no-shadow
export enum ScanStatusColor {
  '#0fc6c2',
  '#168cff',
  '#7bc616',
  '#ff7d00',
  '#7816ff',
  '#f53f3f',
  '#00b42a',
}

// 分页参数查询带条件
export interface HostScanConfigRecordPageRequest {
  pageIndex: number;
  pageSize: number;
  order: string;
  sort: string;
}

// 主机列表分页参数查询带条件
export interface HostListRecordPageRequest {
  pageIndex: number;
  pageSize: number;
}

// 主机漏洞列表分页参数查询条件
export interface HostVulnerabilityListRecordPageRequest {
  total: number;
  pageIndex: number;
  pageSize: number;
  vulnName: string;
  ipv4: string;
  ipv6: string;
  componentName: string;
  port: number;
  potential: string;
  safe: string;
}

// 扫描配置详情
export function getHostScanRecordList(
  configId: number,
  params: HostScanConfigRecordPageRequest
) {
  const url = `/host/scan/${configId}/records?pageIndex=${params.pageIndex}&pageSize=${params.pageSize}&sort=${params.sort}&order=${params.order}`;
  return axios.get<HttpResponse>(url);
}

// 获取扫描记录详情
export function getHostScanRecordDetail(scanId: string) {
  const url = `/host/scan/${scanId}/record/detail`;
  return axios.get<HttpResponse>(url);
}

// 获取主机列表数据
export function getHostListRecordByScanId(
  scanId: string,
  params: HostListRecordPageRequest
) {
  const url = `/host/scan/${scanId}/host/records?pageIndex=${params.pageIndex}&pageSize=${params.pageSize}`;
  return axios.get<HttpResponse>(url);
}

// 获取漏洞列表数据
export function getHostVulnerabilityListRecordByScanId(
  scanId: string,
  params: HostVulnerabilityListRecordPageRequest
) {
  const url = `/host/scan/${scanId}/vulnerability/records?pageIndex=${params.pageIndex}&pageSize=${params.pageSize}`;
  return axios.get<HttpResponse>(url);
}

// 根据扫描ID和主机ID获取漏洞列表
export function getHostVulnerabilityListRecordByScanHostId(
  scanId: string,
  hostId: string,
  params: HostVulnerabilityListRecordPageRequest
) {
  console.log('params potential', params.potential);
  let url = `/host/scan/${scanId}/${hostId}/vulnerability/records?pageIndex=${params.pageIndex}&pageSize=${params.pageSize}`;
  if (params.vulnName) {
    url = `${url}&vulnerabilityName-op=ct&vulnerabilityName=${params.vulnName}`;
  }
  if (params.ipv4) {
    url = `${url}&ipv4-op=ct&ipv4=${params.ipv4}`;
  }
  if (params.ipv6) {
    url = `${url}&ipv6-op=ct&ipv6=${params.ipv6}`;
  }
  if (params.componentName) {
    url = `${url}&componentName-op=ct&componentName=${params.componentName}`;
  }
  if (params.port) {
    url = `${url}&port-op=eq&port=${params.port}`;
  }
  if (params.potential === '1') {
    url = `${url}&potential-op=eq&potential=true`;
  } else if (params.potential === '0') {
    url = `${url}&potential-op=eq&potential=false`;
  }
  if (params.safe === '1') {
    url = `${url}&safe-op=eq&safe=true`;
  } else if (params.safe === '0') {
    url = `${url}&safe-op=eq&safe=false`;
  }
  return axios.get<HttpResponse>(url);
}

// 根据扫描ID和主机ID获取主机详情信息
export function getHostRecordDetailByScanHostId(
  scanId: string,
  hostId: string
) {
  const url = `/host/scan/${scanId}/${hostId}/host/detail`;
  return axios.get<HttpResponse>(url);
}

// 根据扫描ID和主机ID获取服务详情信息
export function getHostServiceRecordDetailByScanHostId(
  scanId: string,
  hostId: string
) {
  const url = `/host/scan/${scanId}/${hostId}/service/records`;
  return axios.get<HttpResponse>(url);
}
