import axios from 'axios'

// 创建axios实例
const api = axios.create({
  baseURL: '/api',
  timeout: 30000,
})

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    // 可以在这里添加token等认证信息
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    console.error('API Error:', error)
    return Promise.reject(error)
  }
)

// 应用相关API
export const agentApi = {
  // 获取应用列表
  getList: () => api.get('/proxy/agent/list'),
  // 获取应用详情
  getDetail: (agentId: string) => api.get(`/proxy/agent/detail/${agentId}`),
  // 获取应用统计
  getStats: () => api.get('/proxy/agent/stats'),
  // 执行诊断命令
  executeCommand: (agentId: string, command: string) => 
    api.post(`/proxy/agent/${agentId}/execute`, { command }),
  // 获取命令执行结果
  getCommandResult: (taskId: string) => api.get(`/proxy/agent/task/${taskId}/result`),
}

// 诊断相关API
export const diagnoseApi = {
  // 获取支持的命令列表
  getCommands: () => api.get('/proxy/diagnose/commands'),
  // 获取诊断历史
  getHistory: (agentId?: string) => 
    api.get('/proxy/diagnose/history', { params: { agentId } }),
}

// 系统相关API
export const systemApi = {
  // 登录
  login: (username: string, password: string) => 
    api.post('/proxy/user/login', { username, password }),
  // 获取系统信息
  getInfo: () => api.get('/proxy/system/info'),
}

export default api