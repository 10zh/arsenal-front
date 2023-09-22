import axios from 'axios';
import { HttpResponse } from '../interceptor/axios';

export interface HostScanConfigRes {
  engineId: string;
  configName: string;
  excludeTarget?: string;
  hostCredentials: number[];
  target: string;
  templateId: string;
  configNameOpt?: string;
}

export interface HostScanConfigForms {
  configName: string;
  excludeTarget?: string;
  hostCredentials: string;
  target: string;
}
interface configRequest {
  pageIndex: number;
  pageSize: number;
}
interface configHostRes {
  domain: string;
  fqdn: string;
  hostType: string;
  hostname: string;
  osName: string;
  macAddress: string;
}
export interface HostScanDetailRes {
  engineName: string;
  scanCostTime: string;
  scanStatus: string;
  templateName: string;
}
export interface HostServiceRes {
  accuracy: string;
  applicationProtocol: string;
  banner: string;
  certificate: string;
  components: {
    hierarchical: string;
    name: string;
    version: string;

  };

  httpHeader: string;
  httpTitle: string;
  httpUrl: string;
  port: string;
  proof: string;
  transportProtocol: string;
  unMatchBanner: string;
}
export function getScanConfig(data: configRequest, param: HostScanConfigRes) {
  return axios.get<HttpResponse>(`/host/scan/configs`, { params: { ...data, ...param } });
}
export function addScanConfig(data: configRequest) {
  return axios.post<HttpResponse>(`/host/scan/configs/new`, data);
}
export function editScanConfig(data: configRequest, configId: string) {
  return axios.put<HttpResponse>(`/host/scan/configs/${configId}/config`, data);
}
export function scanConfig(configId: string) {
  return axios.get<HttpResponse>(`/host/scan/${configId}`);
}
export function getScanDetail(configId: string, data: configRequest) {
  return axios.get<HttpResponse>(
    `/host/scan/${configId}/records?pageIndex=${data.pageIndex}&pageSize=${data.pageSize}`
  );
}
export function getScanDetailInfo(configId: string) {
  return axios.get<HttpResponse>(`/host/scan/configs/${configId}/detail`);
}
export function getScanHostList(scanId: string, data: configRequest) {
  return axios.get<HttpResponse>(
    `/host/scan/${scanId}/host/records?pageIndex=${data.pageIndex}&pageSize=${data.pageSize}`
  );
}
export function getScanBugList(scanId: string, data: configRequest) {
  return axios.get<HttpResponse>(
    `/host/scan/${scanId}/vulnerability/records?pageIndex=${data.pageIndex}&pageSize=${data.pageSize}`
  );
}
export function getScanProgress(scanId: string) {
  return axios.get<HttpResponse>(`/host/scan/${scanId}/record/detail`);
}

export function getHostDetail(scanId: string, hostId: string) {
  return axios.get<HttpResponse>(`/host/scan/${scanId}/${hostId}/host/detail`);
}
export function getHostServiceList(
  scanId: string,
  hostId: string,
  data: configRequest
) {
  return axios.get<HttpResponse>(
    `/host/scan/${scanId}/${hostId}/service/records?pageIndex=${data.pageIndex}&pageSize=${data.pageSize}`
  );
}
export function getHostBugList(
  scanId: string,
  hostId: string,
  data: configRequest
) {
  return axios.get<HttpResponse>(
    `/host/scan/${scanId}/${hostId}/vulnerability/records?pageIndex=${data.pageIndex}&pageSize=${data.pageSize}`
  );
}
