import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { getToken } from '@/utils/auth';
import { Message } from '@arco-design/web-vue';

// 创建axios实例
const axiosInstance: AxiosInstance = axios.create({
  timeout: 60000, // 超时时间
});

// 请求拦截器
axiosInstance.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    // 在发送请求之前做些什么
    // 例如设置请求头
    const token = getToken();
    if (token) {
        config.headers['Authorization'] = token;
    }
    return config;
  },
  (error: any) => {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// 响应拦截器
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    // 对响应数据做点什么
    console.log(response.data, 'response.data')
    const data = response.data
    if (data?.code === 401) {
      Message.error('token失效，请重新登录')
      window.location.href = '/login'
     return Promise.reject(data.msg);
    }
    if (data?.code != 200 && data?.code != 0) {
        Message.error(data.msg)
    }
    return response.data;
  },
  (error: any) => {
    // 对响应错误做点什么
    return Promise.reject(error);
  }
);

// 定义一个类型接口，用于封装请求参数
interface IRequestParams {
  method: 'GET' | 'POST' | 'get' | 'post' | 'DELETE'; // 可以扩展为更多的HTTP方法
  url: string;
  data?: object; // 对于POST请求，data为请求体
}

// 封装HTTP请求函数
function http({ method, url, data }: IRequestParams): Promise<AxiosResponse> {
  if (method === 'GET' || method === 'get') {
    return axiosInstance.get(url, { params: data });
  } else if (method === 'POST' || method === 'post') {
    return axiosInstance.post(url, data);
  } else if (method === 'DELETE' || method === 'delete') {
    return axiosInstance.delete(url, { data });
  } else {
    throw new Error('Unsupported HTTP method');
  }
}

// 导出封装好的http函数
export default http;
