import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { Message } from '@arco-design/web-vue';
import { getToken } from '@/utils/auth';

export interface HttpResponse<T = any> {
  errCode: string;
  errMessage: string;
  success: boolean;
  totalCount: number;
  pageIndex: number;
  pageSize: number;
  data: T;
}

if (import.meta.env.VITE_API_BASE_URL) {
  const API_PROXY_PRIFIX = '/api';
  axios.defaults.baseURL =
    import.meta.env.NODE_EVN === 'production'
      ? import.meta.env.VITE_API_BASE_URL
      : API_PROXY_PRIFIX;
}

axios.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const token = getToken();
    if (token) {
      if (!config.headers) {
        config.headers = {};
      }
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
axios.interceptors.response.use(
  (response: AxiosResponse<HttpResponse>) => {
    const res: HttpResponse = response.data;
    console.log('res: ', response);
    if (!res.success) {
      Message.error(res.errMessage);
      return res;
    }
    return res;
  },
  (error) => {
    return Promise.reject(error);
  }
);
