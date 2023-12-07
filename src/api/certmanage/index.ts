import axios, { AxiosResponse } from 'axios';
import { HttpResponse } from '../interceptor/axios';

// 凭证列表查询参数
interface certRequest  {
  total: number;
  pageIndex: number;
  pageSize: number;
  order: string;
  sort: string;
  name: string;
  authType: string;
  target: string;
  port: string;
}
interface addCertRequest {
  name: string;
  authType: string;
  target: string;
  port: string;
  credentialInfo:{
    domain: string,
    password: string,
    proPassword: string,
    username: string,
  }

}
// 获取凭证列表
export function getCertList(params: certRequest) {
  let url = `/host/credentials/list?pageIndex=${params.pageIndex}&pageSize=${params.pageSize}&sort=${params.sort}&order=${params.order}`;
  if (params.name) {
    url = `${url}&name-op=ct&name=${params.name}`;
  }
  if (params.authType) {
    url = `${url}&authType-op=ct&authType=${params.authType}`;
  }
  if (params.target) {
    url = `${url}&port-op=op&port=${params.target}`;
  }
  if (params.port) {
    url = `${url}&port-op=eq&port=${params.port}`;
  }
  return axios.get<HttpResponse[]>(url);
}
// 新增凭证
export function addCert(data: addCertRequest) {
  return axios.post<HttpResponse>('/host/credentials/new', data);
}
// 根据凭证类型查询表单
export function getFormByAuthType(params: string) {
  return axios.get<HttpResponse>(`/host/credentials/${params}/form`,);
}
// 查看单个凭证信息
export function getSingleCert(certId: string) {
  return axios.get<HttpResponse>(`/host/credentials/${certId}/info`);
}
// 删除凭证信息
export function deleteCert(certId: string) {
  return axios.delete<HttpResponse>(`/host/credentials/${certId}/credential`);
}
// 批量删除凭证
export function batchDeleteCert(certIds:Array<number>) {
  return axios.post<HttpResponse>(`/host/credentials/batch/del`,certIds);
}
// 编辑凭证
export function editCert(certId: string,data:addCertRequest) {
  return axios.put<HttpResponse>(`/host/credentials/${certId}/credential`,data);
}