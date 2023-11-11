import axios from 'axios'
import { getToken } from './auth'
import { Message } from 'element-ui'
import router from '@/router'
const service = axios.create({
  baseURL: 'https://api-hmzs.itheima.net/api',
  timeout: 5000 // request timeout
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 完成token注入
    const token = getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    if (response.data.code !== 10000) {
      // 1.跳转到登录页
      Message.error(response.data.msg)
      // 清除token信息
      return Promise.reject(response.data)
    }
    return response.data
  },
  // 响应码不为200段
  error => {
    // 失效后会得到401状态码
    if (error.response?.status === 401) {
      router.push('/login')
      this.$store.commit('user/setToken')
    }
    Message.error(error.response?.data?.msg || '发送请求时出现了错误')
    return Promise.reject(error)
  }
)

export default service
