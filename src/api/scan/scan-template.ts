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
    tcpDetectType: string;
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
  enableArp: string;
  enableIcmp: string;
  portScanSpeed: string;
  tcpPort: string;
  udpPort: string;
}
// 漏洞列表参数
interface vulnsRequest {
  vulnerabilityName?:Array<string>,
  riskGrade?:Array<number>,
  total: number;
  pageIndex: number;
  pageSize: number;
  order: string;
  sort: string;
  extraValue?:Array<string>,
  tag?:Array<number>,

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
    url = `${url}&templateName-op=ct&templateName=${params.templateName}`;
  }
  if (params.tcpPort) {
    url = `${url}&tcpPort-op=ct&tcpPort=${params.tcpPort}`;
  }
  if (params.udpPort) {
    url = `${url}&udpPort-op=ct&udpPort=${params.udpPort}`;
  }
  if (params.enableArp) {
    url = `${url}&enableARP-op=eq&enableArp=${params.enableArp}`;
  }
  if (params.enableIcmp) {
    url = `${url}&enableIcmp-op=eq&enableIcmp=${params.enableIcmp}`;
  }
  if (params.portScanSpeed) {
    url = `${url}&portScanSpeed-op=eq&portScanSpeed=${params.portScanSpeed}`;
  }
  return axios.get<HostScanTemplateRes[]>(url);
}
// 添加模板
export function addScanTemplates(data: HostScanTemplateRes) {
  return axios.post<HttpResponse>('/host/scan/templates/new', data);
}
// 编辑模板
export function editScanTemplates(data: HostScanTemplateRes) {
  return axios.put<HttpResponse>(
    `/host/scan/templates/${data.id}/template`,
    data
  );
}
// 查看单个模板数据
export function getSingleScanTemplates(templateId: string) {
  return axios.get<HttpResponse>(`/host/scan/templates/${templateId}/template`);
}
// 删除模板
export function deleteScanTemplates(templateId: string) {
  return axios.delete<HttpResponse>(
    `/host/scan/templates/${templateId}/template`
  );
}
// 查询漏洞库信息
export function getVulnerabilityList(params: vulnsRequest) {
  let url = `/vulnerability/condition/list?pageIndex=${params.pageIndex}&pageSize=${params.pageSize}`;
  if (params.vulnerabilityName.length > 0) {
    url = `${url}&vulnerabilityName-op=il&vulnerabilityName=${JSON.stringify(params.vulnerabilityName)}&vulnerabilityName-ic=true`;
  }
  if (params.riskGrade.length > 0) {
    url = `${url}&riskGrade-op=il&riskGrade=${JSON.stringify(params.riskGrade)}`;
  }
  if (params.extraValue.length > 0) {
    url = `${url}&extraValue-op=il&extraValue=${JSON.stringify(params.extraValue)}&extraValue-ic=true`;
  }
  if (params.tag.length > 0) {
    url = `${url}&tag-op=il&tag=${JSON.stringify(params.tag)}&tag-ic=true`;
  }
  return axios.get<HostScanTemplateRes[]>(encodeURI(url));
}
// 获取弱口令模板列表
export function getWeakScanTemplates(params: TemplateRequest) {
  let url = `/host/scan/templates/wkp/list?pageIndex=${params.pageIndex}&pageSize=${params.pageSize}&sort=${params.sort}&order=${params.order}`;
  if (params.templateName) {
    url = `${url}&templateName-op=ct&templateName=${params.templateName}`;
  }
  if (params.tcpPort) {
    url = `${url}&tcpPort-op=ct&tcpPort=${params.tcpPort}`;
  }
  if (params.udpPort) {
    url = `${url}&udpPort-op=ct&udpPort=${params.udpPort}`;
  }
  if (params.enableArp) {
    url = `${url}&enableARP-op=eq&enableArp=${params.enableArp}`;
  }
  if (params.enableIcmp) {
    url = `${url}&enableIcmp-op=eq&enableIcmp=${params.enableIcmp}`;
  }
  if (params.portScanSpeed) {
    url = `${url}&portScanSpeed-op=eq&portScanSpeed=${params.portScanSpeed}`;
  }
  return axios.get<HostScanTemplateRes[]>(url);
}
// 添加弱口令模板
export function addWeakScanTemplates(data: HostScanTemplateRes) {
  return axios.post<HttpResponse>('/host/scan/templates/new/wkp', data);
}
// 编辑弱口令模板
export function editWeakScanTemplates(data: HostScanTemplateRes) {
  return axios.put<HttpResponse>(
    `/host/scan/templates/${data.id}/wkp/template`,
    data
  );
}
// 查看单个弱口令模板数据
export function getWeakSingleScanTemplates(templateId: string) {
  return axios.get<HttpResponse>(`/host/scan/templates/${templateId}/wkp/template`);
}
// 删除弱口令模板
export function deleteWeakScanTemplates(templateId: string) {
  return axios.delete<HttpResponse>(
    `/host/scan/templates/${templateId}/template`
  );
}