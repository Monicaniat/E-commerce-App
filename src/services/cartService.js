import api from './api'

class CartService {
  // Get user's cart
  async getCart() {
    try {
      const response = await api.get('/cart')
      
      return {
        success: true,
        data: response.data.data,
        numOfCartItems: response.data.numOfCartItems,
        totalCartPrice: response.data.data?.totalCartPrice || 0
      }
    } catch (error) {
      console.error('Get cart error:', error)
      
      // If no cart exists (404), return empty cart
      if (error.response?.status === 404) {
        return {
          success: true,
          data: null,
          numOfCartItems: 0,
          totalCartPrice: 0
        }
      }
      
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to get cart.',
        data: null,
        numOfCartItems: 0,
        totalCartPrice: 0
      }
    }
  }

  // Add product to cart
  async addToCart(productId) {
    try {
      const response = await api.post('/cart', {
        productId: productId
      })
      
      return {
        success: true,
        data: response.data.data,
        numOfCartItems: response.data.numOfCartItems,
        totalCartPrice: response.data.data?.totalCartPrice || 0,
        message: response.data.message || 'Product added to cart successfully'
      }
    } catch (error) {
      console.error('Add to cart error:', error)
      
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to add product to cart.',
        data: null,
        numOfCartItems: 0,
        totalCartPrice: 0
      }
    }
  }

  // Remove specific product from cart
  async removeFromCart(productId) {
    try {
      const response = await api.delete(`/cart/${productId}`)
      
      return {
        success: true,
        data: response.data.data,
        numOfCartItems: response.data.numOfCartItems,
        totalCartPrice: response.data.data?.totalCartPrice || 0,
        message: response.data.message || 'Product removed from cart successfully'
      }
    } catch (error) {
      console.error('Remove from cart error:', error)
      
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to remove product from cart.',
        data: null,
        numOfCartItems: 0,
        totalCartPrice: 0
      }
    }
  }

  // Update product quantity in cart
  async updateCartItemQuantity(productId, count) {
    try {
      const response = await api.put(`/cart/${productId}`, {
        count: count
      })
      
      return {
        success: true,
        data: response.data.data,
        numOfCartItems: response.data.numOfCartItems,
        totalCartPrice: response.data.data?.totalCartPrice || 0,
        message: response.data.message || 'Cart updated successfully'
      }
    } catch (error) {
      console.error('Update cart quantity error:', error)
      
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update cart quantity.',
        data: null,
        numOfCartItems: 0,
        totalCartPrice: 0
      }
    }
  }

  // Clear entire cart
  async clearCart() {
    try {
      const response = await api.delete('/cart')
      
      return {
        success: true,
        message: response.data.message || 'Cart cleared successfully'
      }
    } catch (error) {
      console.error('Clear cart error:', error)
      
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to clear cart.'
      }
    }
  }

  // Apply coupon to cart
  async applyCoupon(couponCode) {
    try {
      const response = await api.put('/cart/applycoupon', {
        coupon: couponCode
      })
      
      return {
        success: true,
        data: response.data.data,
        totalCartPrice: response.data.data?.totalCartPrice || 0,
        totalPriceAfterDiscount: response.data.data?.totalPriceAfterDiscount,
        message: response.data.message || 'Coupon applied successfully'
      }
    } catch (error) {
      console.error('Apply coupon error:', error)
      
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to apply coupon.'
      }
    }
  }
}

// Export singleton instance
const cartService = new CartService()
export default cartService