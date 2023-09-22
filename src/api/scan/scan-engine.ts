import axios from 'axios';
import qs from 'query-string';
import type { DescData } from '@arco-design/web-vue/es/descriptions/interface';

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

export interface ServiceRecord {
  id: number;
  title: string;
  description: string;
  name?: string;
  actionType?: string;
  icon?: string;
  data?: DescData[];
  enable?: boolean;
  expires?: boolean;
}
export function queryInspectionList() {
  return axios.get('/api/list/quality-inspection');
}

export function queryTheServiceList() {
  return axios.get('/api/list/the-service');
}

export function queryRulesPresetList() {
  return axios.get('/api/list/rules-preset');
}
export function addScanEngines(data: addEnginesRes) {
  return axios.post<listRes>('/scan/engines/new', data);
}
export function editScanEngines(data: addEnginesRes, engineId: string) {
  return axios.put<listRes>(`/scan/engines/${engineId}/engine`, data);
}
export function getScanEngines(data: enginesRes) {
  return axios.post<any>('/scan/engines', data);
}
export function refreshScanEngines(engineId: string) {
  return axios.get<any>(`/scan/engines/refresh/${engineId}`);
}
