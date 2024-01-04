import axios, { AxiosResponse } from 'axios';
import { HttpResponse } from '../interceptor/axios';

interface OrganizationListRequest {
  pageIndex:number,
  pageSize:number,
}
// 查询组织列表
export function getOrganizationPageList() {
  const url = `/system/companies/list`;
  return axios.get<HttpResponse>(url);
}
// 新增组织
export function addCompany(data: OrganizationListRequest) {
  const url = `/system/companies/new`;
  return axios.post<HttpResponse>(url,data);
}
// 查询单个组织架构
export function querySingleCompany(companyId: string) {
  const url = `/system/companies/${companyId}/company`;
  return axios.get<HttpResponse>(url);
}
// 编辑组织架构
export function editCompany(data: OrganizationListRequest,companyId: string) {
  const url = `/system/companies/${companyId}/company`;
  return axios.put<HttpResponse>(url,data);
}
// 删除组织架构
export function deleteCompany(companyId: string) {
  const url = `/system/companies/${companyId}/company`;
  return axios.delete<HttpResponse>(url);
}