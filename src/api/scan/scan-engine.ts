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
  engineName: string;
  address: string;
  engineVersion: string;
  status:string;
  createTime:Array<string>;
  port: number;
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

// 添加引擎
export interface addEnginesRequest {
  engineName: string;
  address: string;
  port: string;
}

// 编辑引擎
export interface editEnginesRequest {
  engineName: string;
  address: string;
  port: string;
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
  let url = `/scan/engines?pageIndex=${params.pageIndex}&pageSize=${params.pageSize}&sort=${params.sort}&order=${params.order}`;
  if (params.engineName) {
    url = `${url}&engineName-op=ct&engineName=${params.engineName}`;
  }
  if (params.engineVersion) {
    url = `${url}&engineVersion-op=ct&engineVersion=${params.engineVersion}`;
  }
  if (params.port) {
    url = `${url}&port-op=ct&port=${params.port}`;
  }
  if (params.address) {
    url = `${url}&address-op=ct&address=${params.address}`;
  }
  if(params.status){
    url = `${url}&status-op=eq&status=${params.status}`;
  }
  if(params.createTime.length > 0){
    url = `${url}&createTime-op=bt&createTime-0=${params.createTime[0]}&createTime-1=${params.createTime[1]}`;
  }
  return axios.get<HttpResponse>(url);
}

// 刷新引擎
export function refreshScanEngine(engineId: string) {
  return axios.get<HttpResponse>(`/scan/engines/refresh/${engineId}`);
}

// 添加引擎
export function addScanEngine(params: addEnginesRequest) {
  return axios.post<HttpResponse>('/scan/engines/new', params);
}

// 编辑引擎
export function editScanEngine(params: editEnginesRequest) {
  return axios.put<HttpResponse>(`/scan/engines/${params.id}/engine`, params);
}
