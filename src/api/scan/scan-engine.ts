import axios from 'axios';
import qs from 'query-string';
import { HttpResponse } from '../interceptor/axios';

// 分页参数查询带条件
export interface HostScanConfigPageRequest {
  total: number;
  pageIndex: number;
  pageSize: number;
  order: string;
  sort: string;
}

// 引擎对象
export interface HostScanEngineRes {
  id: string;
  address: string;
  engienVersion: string;
  assignedTaskNumber: number;
  isLocal: boolean;
  name: string;
  port: number;
  status: number;
  failCause: string;
  updateTime: string;
}

export interface PolicyRecord {
  id: string;
  address: string;
  assignedTaskNumber: number;
  isLocal: boolean;
  name: string;
  port: number;
  status: number;
  updateTime: string;
}
export interface addEnginesRes {
  address: string;
  engineName: string;
  port: string;
}
export interface enginesRes {
  pageIndex: number;
  pageSize: number;
}

export interface PolicyParams extends Partial<PolicyRecord> {
  current: number;
  pageSize: number;
}

export interface PolicyListRes {
  list: PolicyRecord[];
  total: number;
}
export interface listRes {
  errCode: string;
  errMessage: string;
  success: boolean;
  data: any;
}

export function queryPolicyList(params: PolicyParams) {
  return axios.get<PolicyListRes>('/api/list/policy', {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}

// 获取引擎列表
export function getScanEngines(params: HostScanConfigPageRequest) {
  const url = `/scan/engines?pageIndex=${params.pageIndex}&pageSize=${params.pageSize}&sort=${params.sort}&order=${params.order}`;
  return axios.get<HttpResponse>(url);
}

// 刷新引擎
export function refreshScanEngine(engineId: string) {
  return axios.get<HttpResponse>(`/scan/engines/refresh/${engineId}`);
}

export function addScanEngines(data: addEnginesRes) {
  return axios.post<listRes>('/scan/engines/new', data);
}
export function editScanEngines(data: addEnginesRes, engineId: string) {
  return axios.put<listRes>(`/scan/engines/${engineId}/engine`, data);
}
