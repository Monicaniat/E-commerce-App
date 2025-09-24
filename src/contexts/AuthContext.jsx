import { createContext, useState, useEffect } from 'react'
import authService from '../services/authService'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = () => {
    const authenticated = authService.isAuthenticated()
    const currentUser = authService.getCurrentUser()
    const currentToken = authService.getToken()
    setIsAuthenticated(authenticated)
    setUser(currentUser)
    setToken(currentToken)
    setLoading(false)
    return { authenticated, currentUser, token: currentToken }
  }

  const login = async (credentials) => {
    const result = await authService.login(credentials)
    if (result.success) {
      setIsAuthenticated(true)
      setUser(result.data.user)
      setToken(result.data.token)
    }
    return result
  }

  const signup = async (userData) => {
    const result = await authService.signup(userData)
    if (result.success) {
      setIsAuthenticated(true)
      setUser(result.data.user)
      setToken(result.data.token)
    }
    return result
  }

  const logout = () => {
    authService.logout()
    setIsAuthenticated(false)
    setUser(null)
    setToken(null)
  }

  const value = {
    user,
    token,
    isAuthenticated,
    loading,
    login,
    signup,
    logout,
    checkAuthStatus
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export { AuthContext }