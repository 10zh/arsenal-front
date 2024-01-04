import axios, { AxiosResponse } from 'axios';
import { HttpResponse } from '../interceptor/axios';

interface roleListRequest {
  pageIndex:number,
  pageSize:number,
}
// 查询角色列表
export function getRolePageList(params: roleListRequest) {
  const url = `/system/roles/list?pageIndex=${params.pageIndex}&pageSize=${params.pageSize}`;
  return axios.get<HttpResponse>(url);
}
// 查看当个角色信息
export function getRole(id: number) {
  const url = `/system/roles/${id}/role`;
  return axios.get<HttpResponse>(url);
}
// 添加角色
export function addRole(data: roleListRequest) {
  const url = `/system/roles/new`;
  return axios.post<AxiosResponse<HttpResponse<any>>>(url, data);
}
// 删除角色
export function deleteRole(roleId: string) {
  const url = `/system/roles/${roleId}/role`;
  return axios.delete<HttpResponse>(url);
}
// 修改角色
export function editRole(roleId: string,data) {
  const url = `/system/roles/${roleId}/role`;
  return axios.put<HttpResponse>(url,data);
}