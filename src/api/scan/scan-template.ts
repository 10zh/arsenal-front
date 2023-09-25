import axios from 'axios';
import { HttpResponse } from '../interceptor/axios';

// 扫描模板对象
export interface HostScanTemplateRes {
  id?: string;
  templateName: string;
  performance: {
    assetConcurrency: number;
    singleAssetThread: number;
    portScanSpeed: string;
  };
  hostDiscovery: {
    enableIcmp: string;
    enableArp: string;
    enableSyn: string;
    synPort: string;
    enablePu: string;
    puPort: string;
    maxRetries: number;
  };
  serviceDiscovery: {
    tcpPort: string;
    udpPort: string;
  };
  message?: string;
}

// 模板列表请求参数
interface TemplateRequest {
  total: number;
  pageIndex: number;
  pageSize: number;
  order: string;
  sort: string;
  templateName: string;
}

// 端口扫描速度枚举
// eslint-disable-next-line no-shadow
export enum PortScanSpeedEnum {
  'T1' = 'scan.template.port.scan.t1',
  'T2' = 'scan.template.port.scan.t2',
  'T3' = 'scan.template.port.scan.t3',
  'T4' = 'scan.template.port.scan.t4',
  'T5' = 'scan.template.port.scan.t5',
}

// 端口扫描速度枚举
// eslint-disable-next-line no-shadow
export enum FieldSortedEnum {
  'performance.assetConcurrency' = 'assetConcurrency',
  'performance.singleAssetThread' = 'singleAssetThread',
  'performance.portScanSpeed' = 'portScanSpeed',
  'hostDiscovery.enableIcmp' = 'enableIcmp',
  'hostDiscovery.enableArp' = 'enableArp',
  'hostDiscovery.enableSyn' = 'enableSyn',
  'hostDiscovery.synPort' = 'synPort',
  'hostDiscovery.enablePu' = 'enablePu',
  'hostDiscovery.puPort' = 'puPort',
  'hostDiscovery.maxRetries' = 'maxRetries',
  'serviceDiscovery.tcpPort' = 'tcpPort',
  'serviceDiscovery.udpPort' = 'udpPort',
}

export interface HostScanTemplate {
  id: string;
  templateName: string;
}

// 获取模板列表
export function getScanTemplates(params: TemplateRequest) {
  let url = `/host/scan/templates?pageIndex=${params.pageIndex}&pageSize=${params.pageSize}&sort=${params.sort}&order=${params.order}`;
  if (params.templateName) {
    url = `${url}&configName-op=ct&configName=${params.templateName}`;
  }
  return axios.get<HostScanTemplateRes[]>(url);
}

export function addScanTemplates(data: HostScanTemplateRes) {
  return axios.post<HttpResponse>('/host/scan/templates/new', data);
}

export function editScanTemplates(data: HostScanTemplateRes) {
  return axios.put<HttpResponse>(
    `/host/scan/templates/${data.id}/template`,
    data
  );
}
