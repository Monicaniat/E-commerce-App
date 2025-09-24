import api from './api'

class AuthService {
  // User signup
  async signup(userData) {
    try {
      console.log('Sending signup data:', userData)
      const response = await api.post('/auth/signup', userData, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      console.log('Signup response:', response.data)
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token)
        localStorage.setItem('user', JSON.stringify(response.data.user))
      }
      
      return {
        success: true,
        data: response.data,
        message: response.data.message || 'Account created successfully!'
      }
    } catch (error) {
      console.error('Signup error:', error.response?.data || error.message)
      console.error('Full error:', error)
      
      // Handle different types of errors
      if (error.response?.status === 400) {
        return {
          success: false,
          message: error.response?.data?.message || 'Invalid data provided. Please check your input.',
          errors: error.response?.data?.errors || null
        }
      }
      
      return {
        success: false,
        message: error.response?.data?.message || 'Signup failed. Please try again.',
        errors: error.response?.data?.errors || null
      }
    }
  }

  // User login
  async login(credentials) {
    try {
      console.log('Sending login data:', credentials)
      const response = await api.post('/auth/signin', credentials, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      console.log('Login response:', response.data)
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token)
        localStorage.setItem('user', JSON.stringify(response.data.user))
      }
      
      return {
        success: true,
        data: response.data,
        message: response.data.message || 'Login successful!'
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed. Please check your credentials.',
        errors: error.response?.data?.errors || null
      }
    }
  }

  // User logout
  logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.location.href = '/login'
  }

  // Get current user
  getCurrentUser() {
    const user = localStorage.getItem('user')
    return user ? JSON.parse(user) : null
  }

  // Get auth token
  getToken() {
    return localStorage.getItem('token')
  }

  // Check if user is authenticated
  isAuthenticated() {
    const token = this.getToken()
    return !!token
  }

  // Verify token (optional - for checking if token is still valid)
  async verifyToken() {
    try {
      const response = await api.get('/auth/verify')
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      this.logout()
      return {
        success: false,
        message: error.response?.data?.message || 'Token verification failed.'
      }
    }
  }

  // Change password
  async changePassword(passwordData) {
    try {
      const response = await api.patch('/auth/change-password', passwordData)
      return {
        success: true,
        data: response.data,
        message: response.data.message || 'Password changed successfully!'
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to change password.',
        errors: error.response?.data?.errors || null
      }
    }
  }

  // Forgot password
  async forgotPassword(email) {
    try {
      const response = await api.post('/auth/forgot-password', { email })
      return {
        success: true,
        data: response.data,
        message: response.data.message || 'Password reset email sent!'
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to send reset email.',
        errors: error.response?.data?.errors || null
      }
    }
  }

  // Reset password
  async resetPassword(resetData) {
    try {
      const response = await api.post('/auth/reset-password', resetData)
      return {
        success: true,
        data: response.data,
        message: response.data.message || 'Password reset successfully!'
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to reset password.',
        errors: error.response?.data?.errors || null
      }
    }
  }
}

// Export a single instance
const authService = new AuthService()
export default authService