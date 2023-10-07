import axios from 'axios';
import { HttpResponse } from '../interceptor/axios';

// 端口扫描速度枚举
// eslint-disable-next-line no-shadow
export enum ScanStatus {
  'scan.status.not.start',
  'scan.status.prepare',
  'scan.status.progress',
  'scan.status.suspend',
  'scan.status.stop',
  'scan.status.fail',
  'scan.status.finish',
}

// 分页参数查询带条件
export interface HostScanConfigRecordPageRequest {
  pageIndex: number;
  pageSize: number;
}

// 扫描配置详情
export function getHostScanRecordList(
  configId: number,
  params: HostScanConfigRecordPageRequest
) {
  const url = `/host/scan/${configId}/records?pageIndex=${params.pageIndex}&pageSize=${params.pageSize}`;
  return axios.get<HttpResponse>(url);
}
