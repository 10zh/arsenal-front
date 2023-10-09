import axios from 'axios';
import { HttpResponse } from '../interceptor/axios';

// 分页参数查询带条件
export interface AutoCompleteFieldRequest {
  total: number;
  pageIndex: number;
  pageSize: number;
  table: string;
  field: string;
  value: string;
}

// 根据字段模糊查询值 用于输入框自动补全
export function aotuCompleteByTableField(params: AutoCompleteFieldRequest) {
  const url = `/base/search/field?pageIndex=${params.pageIndex}&pageSize=${params.pageSize}&table=${params.table}&field=${params.field}&value=${params.value}&value-op=ct`;
  return axios.get<HttpResponse>(url);
}
