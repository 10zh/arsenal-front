import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

export interface HttpResponse<T = any> {
  errCode: string;
  errMessage: string;
  success: boolean;
  data: T;
}

axios.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
axios.interceptors.response.use(
  (response: AxiosResponse<HttpResponse>) => {
    const res = response.data;
    // if the custom code is not 20000, it is judged as an error.
    if (!res.success) {
      if (['1001', '4001', '5001'].includes(res.errCode)) {
        // do something
      }
      return Promise.reject(new Error(res.errMessage || 'Error'));
    }
    return res.data;
  },
  (error) => {
    return Promise.reject(error);
  }
);
