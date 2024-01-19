import axios, { AxiosResponse } from 'axios';
import { HttpResponse } from '../interceptor/axios';

interface userListRequest {
  pageIndex:number,
  pageSize:number,
  keyword:string,
  status?:string
}
interface companyIdReq {
  companyId:string
}
interface addUserParams {
  companyId: string,
  email?: string,
  nickName?: string,
  password: string,
  phone?: string,
  roleId: string,
  status: string,
  username: string,
}
// 查询所有角色
export function queryAllRoles(params:companyIdReq) {
  const url = `/system/roles/queryRole`;
  return axios.get<HttpResponse>(url,params);
}
// 查询所有组织架构
export function queryAllCompanyId() {
  const url = `/system/companies/list`;
  return axios.get<HttpResponse>(url);
}
// 查询用户列表
export function getUserPageList(params:userListRequest) {
  let url = `/system/user?pageIndex=${params.pageIndex}&pageSize=${params.pageSize}`;
  if(params.keyword){
    url = `${url}&keyword=${params.keyword}`;
  }
  if(params.status){
    url = `${url}&status=${params.status}&status-op=eq`;
  }
  return axios.get<HttpResponse>(url);
}
// 添加用户
export function addUser(data: addUserParams) {
  const url = `/system/user/new`;
  return axios.post<AxiosResponse<HttpResponse<any>>>(url, data);
}
// 删除用户
export function deleteRole(roleId: string) {
  const url = `/system/roles/${roleId}/role`;
  return axios.delete<HttpResponse>(url);
}
// 查看单个用户信息
export function getSingleUser(userId:string) {
  const url = `/system/user/${userId}`;
  return axios.get<AxiosResponse>(url);
}
// 更新用户信息
export function updateSingleUser(userId:string,data:addUserParams) {
  const url = `/system/user/${userId}`;
  return axios.put<AxiosResponse<HttpResponse<any>>>(url, data);
}
// 获取管理员用户列表（即获取安全人员用户列表）
export function getManageUser() {
  const url = `/system/user/queryUser?roleId=4`;
  return axios.get<HttpResponse>(url);
}
// 删除用户
export function deleteUser(id:string) {
  const url = `/system/user/${id}`;
  return axios.delete<HttpResponse>(url);
}
// 禁用
export function setNoUser(id:string,data) {
  const url = `/system/user/disable/${id}`;
  return axios.put<HttpResponse>(url);
}
// 启用
export function setUser(id:string,data) {
  const url = `/system/user/enable/${id}`;
  return axios.put<HttpResponse>(url);
}