import axios from 'axios';
import { HttpResponse } from '../interceptor/axios';

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

export interface HostScanTemplate {
  id: string;
  templateName: string;
}

interface TemplateRequest {
  pageIndex: number;
  pageSize: number;
}

export function getScanTemplates(data: TemplateRequest) {
  let url = '/host/scan/templates';
  url = `${url}?pageIndex=${data.pageIndex}&pageSize=${data.pageSize}`;
  return axios.post<HostScanTemplateRes[]>(url, data);
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
