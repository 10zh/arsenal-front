import axios, { AxiosResponse } from 'axios';
import { HttpResponse } from '../interceptor/axios';

interface OrganizationListRequest {
  pageIndex:number,
  pageSize:number,
}
// 查询角色列表
export function getOrganizationPageList(params: OrganizationListRequest) {
  const url = `/system/company/list?pageIndex=${params.pageIndex}&pageSize=${params.pageSize}`;
  return axios.get<HttpResponse>(url);
}
export function getRolePageList2(params: OrganizationListRequest) {
  const url = `/system/roles/list?pageIndex=${params.pageIndex}&pageSize=${params.pageSize}`;
  return axios.get<HttpResponse>(url);
}