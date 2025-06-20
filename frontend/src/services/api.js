import axios from 'axios'

// Configuração base da API
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor para adicionar token automaticamente
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Interceptor para lidar com respostas
api.interceptors.response.use(
  (response) => {
    // Se a resposta tem o padrão da API (success, data), extrair os dados
    if (response.data && response.data.success && response.data.data) {
      return {
        ...response,
        data: response.data.data,
        message: response.data.message,
        pagination: response.data.pagination
      }
    }
    return response
  },
  async (error) => {
    const originalRequest = error.config
    
    // Se o erro é 401 e não é uma tentativa de retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Limpar dados de autenticação
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      localStorage.removeItem('userType')
      
      // Redirecionar para login apenas se não estiver já na página de login
      if (!window.location.pathname.includes('/auth/login')) {
        window.location.href = '/auth/login'
      }
    }
    
    return Promise.reject(error)
  }
)

export default api