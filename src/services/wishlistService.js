import api from './api'

// Wishlist service with API and localStorage fallback
class WishlistService {
  // Check if user is authenticated
  isAuthenticated() {
    return !!localStorage.getItem('token')
  }

  // Get wishlist from localStorage (fallback)
  getLocalWishlist() {
    try {
      const wishlist = localStorage.getItem('wishlist')
      return wishlist ? JSON.parse(wishlist) : []
    } catch {
      return []
    }
  }

  // Save wishlist to localStorage (fallback)
  saveLocalWishlist(items) {
    localStorage.setItem('wishlist', JSON.stringify(items))
  }

  // Get all wishlist items (API with localStorage fallback)
  async getWishlistItems() {
    // Try API first if authenticated
    if (this.isAuthenticated()) {
      try {
        const response = await api.get('/wishlist')
        console.log('✅ Wishlist API success:', response.data)
        return {
          success: true,
          data: response.data.data || [],
          count: response.data.count || 0
        }
      } catch (error) {
        // API failed, fall back to localStorage
        console.log('❌ Wishlist API failed:', {
          status: error.response?.status,
          message: error.response?.data?.message,
          url: error.config?.url
        })
        console.log('🔄 Using localStorage fallback')
      }
    }

    // Use localStorage (either not authenticated or API failed)
    const localItems = this.getLocalWishlist()
    return {
      success: true,
      data: localItems,
      count: localItems.length,
      message: this.isAuthenticated() ? 'API unavailable - using local storage' : 'Login to sync with cloud'
    }
  }

  // Add product to wishlist (API with localStorage fallback)
  async addToWishlist(productData) {
    // Accept either full product object or just productId for backwards compatibility
    const productId = typeof productData === 'object' ? productData.id : productData
    const fullProduct = typeof productData === 'object' ? productData : { id: productData }
    
    // Try API first if authenticated
    if (this.isAuthenticated()) {
      try {
        console.log('🔄 Adding to wishlist via API:', productId)
        const response = await api.post('/wishlist', { productId })
        console.log('✅ Add to wishlist API success:', response.data)
        return {
          success: true,
          message: response.data.message || 'Product added to wishlist',
          data: response.data.data
        }
      } catch (error) {
        console.log('❌ Add to wishlist API failed:', {
          status: error.response?.status,
          message: error.response?.data?.message,
          productId
        })
        // Fall through to localStorage fallback
      }
    }

    // Use localStorage (either not authenticated or API failed)
    const localItems = this.getLocalWishlist()
    const productExists = localItems.some(item => item.id === productId)
    
    if (!productExists) {
      localItems.push(fullProduct)
      this.saveLocalWishlist(localItems)
    }
    
    return {
      success: true,
      message: this.isAuthenticated() ? 'Product added to local wishlist (API unavailable)' : 'Product added to local wishlist'
    }
  }

  // Remove product from wishlist (API with localStorage fallback)
  async removeFromWishlist(productId) {
    // Try API first if authenticated
    if (this.isAuthenticated()) {
      try {
        const response = await api.delete(`/wishlist/${productId}`)
        return {
          success: true,
          message: response.data.message || 'Product removed from wishlist'
        }
      } catch (error) {
        console.log('API remove failed, using localStorage fallback:', error.response?.data)
        // Fall through to localStorage fallback
      }
    }

    // Use localStorage (either not authenticated or API failed)
    const localItems = this.getLocalWishlist()
    const filteredItems = localItems.filter(item => item.id !== productId)
    this.saveLocalWishlist(filteredItems)
    
    return {
      success: true,
      message: this.isAuthenticated() ? 'Product removed from local wishlist (API unavailable)' : 'Product removed from local wishlist'
    }
  }

  // Check if product is in wishlist
  async isInWishlist(productId) {
    const result = await this.getWishlistItems()
    return result.data.some(item => item.id === productId)
  }

  // Debug function to test API connectivity
  async testApiConnection() {
    if (!this.isAuthenticated()) {
      return { success: false, message: 'Not authenticated' }
    }

    try {
      console.log('🔍 Testing wishlist API connection...')
      const response = await api.get('/wishlist')
      console.log('✅ API test successful:', response.status)
      return { success: true, message: 'API is working' }
    } catch (error) {
      console.log('❌ API test failed:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        message: error.response?.data?.message,
        headers: error.response?.headers
      })
      return { 
        success: false, 
        message: `API failed: ${error.response?.status} ${error.response?.statusText}`,
        error: error.response?.data
      }
    }
  }
}

// Export a singleton instance
const wishlistService = new WishlistService()
export default wishlistService