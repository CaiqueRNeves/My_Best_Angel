import { createContext, useContext, useState, useEffect } from 'react'
import api from '../services/api'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Verificar se o usuário já está logado ao carregar a aplicação
  useEffect(() => {
    const token = localStorage.getItem('token')
    
    if (token) {
      const userJSON = localStorage.getItem('user')
      const userType = localStorage.getItem('userType')
      
      if (userJSON && userType) {
        try {
          const userData = JSON.parse(userJSON)
          setUser({ ...userData, userType })
        } catch (error) {
          console.error('Erro ao fazer parse dos dados do usuário:', error)
          logout()
        }
      } else {
        logout()
      }
    }
    
    setLoading(false)
  }, [])

  // Função de login
  const login = async (email, password, userType) => {
    try {
      const response = await api.post('/auth/login', {
        email,
        password,
        userType
      })
      
      const { data } = response
      const { token, user: userData, userType: responseUserType } = data
      
      // Salvar token no localStorage
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(userData))
      localStorage.setItem('userType', responseUserType)
      
      // Atualizar estado
      setUser({ ...userData, userType: responseUserType })
      
      return {
        success: true,
        userType: responseUserType
      }
    } catch (error) {
      console.error('Erro no login:', error)
      const message = error.response?.data?.error?.message || 
                     error.response?.data?.message || 
                     'Erro ao fazer login. Tente novamente.'
      
      return {
        success: false,
        message
      }
    }
  }

  // Função de registro
  const register = async (userData, userType) => {
    try {
      const endpoint = userType === 'angel' ? '/auth/register/angel' : '/auth/register/visitor'
      
      const response = await api.post(endpoint, userData)
      
      const { data } = response
      const { token, user: newUserData, userType: responseUserType } = data
      
      // Salvar token no localStorage
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(newUserData))
      localStorage.setItem('userType', responseUserType)
      
      // Atualizar estado
      setUser({ ...newUserData, userType: responseUserType })
      
      return {
        success: true,
        userType: responseUserType
      }
    } catch (error) {
      console.error('Erro no registro:', error)
      const message = error.response?.data?.error?.message || 
                     error.response?.data?.message || 
                     'Erro ao criar conta. Tente novamente.'
      
      return {
        success: false,
        message
      }
    }
  }

  // Função de logout
  const logout = () => {
    // Remover dados do localStorage
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('userType')
    
    // Limpar estado do usuário
    setUser(null)
  }

  // Função para atualizar dados do usuário
  const updateUser = (userData) => {
    const updatedUser = { ...user, ...userData }
    setUser(updatedUser)
    localStorage.setItem('user', JSON.stringify(updatedUser))
  }

  // Função para verificar se o usuário está autenticado
  const isAuthenticated = () => {
    return !!user && !!localStorage.getItem('token')
  }

  // Função para verificar se o usuário é um Angel
  const isAngel = () => {
    return user?.userType === 'angel'
  }

  // Função para verificar se o usuário é um Visitor
  const isVisitor = () => {
    return user?.userType === 'visitor'
  }

  // Função para obter dados atualizados do usuário
  const refreshUser = async () => {
    try {
      const response = await api.get('/auth/me')
      const { data } = response
      const { user: userData, userType } = data
      
      const updatedUser = { ...userData, userType }
      setUser(updatedUser)
      localStorage.setItem('user', JSON.stringify(userData))
      localStorage.setItem('userType', userType)
      
      return updatedUser
    } catch (error) {
      console.error('Erro ao atualizar dados do usuário:', error)
      logout()
      return null
    }
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateUser,
    refreshUser,
    isAuthenticated,
    isAngel,
    isVisitor
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}