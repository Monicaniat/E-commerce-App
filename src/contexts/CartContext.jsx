import React, { createContext, useContext, useReducer, useEffect } from 'react'
import cartService from '../services/cartService'
import { useAuth } from '../hooks/useAuth'

// Cart Context
const CartContext = createContext()

// Cart Actions
const CART_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_CART: 'SET_CART',
  SET_ERROR: 'SET_ERROR',
  ADD_ITEM: 'ADD_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM',
  UPDATE_ITEM: 'UPDATE_ITEM',
  CLEAR_CART: 'CLEAR_CART',
  SET_ITEM_COUNT: 'SET_ITEM_COUNT'
}

// Initial state
const initialState = {
  cart: null,
  items: [],
  numOfCartItems: 0,
  totalCartPrice: 0,
  totalPriceAfterDiscount: null,
  loading: false,
  error: null
}

// Cart reducer
function cartReducer(state, action) {
  switch (action.type) {
    case CART_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
        error: null
      }
    
    case CART_ACTIONS.SET_CART:
      return {
        ...state,
        cart: action.payload.data,
        items: action.payload.data?.products || [],
        numOfCartItems: action.payload.numOfCartItems || 0,
        totalCartPrice: action.payload.totalCartPrice || 0,
        totalPriceAfterDiscount: action.payload.data?.totalPriceAfterDiscount || null,
        loading: false,
        error: null
      }
    
    case CART_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false
      }
    
    case CART_ACTIONS.SET_ITEM_COUNT:
      return {
        ...state,
        numOfCartItems: action.payload
      }
    
    case CART_ACTIONS.CLEAR_CART:
      return {
        ...state,
        cart: null,
        items: [],
        numOfCartItems: 0,
        totalCartPrice: 0,
        totalPriceAfterDiscount: null,
        loading: false,
        error: null
      }
    
    default:
      return state
  }
}

// Cart Provider Component
export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState)
  const { token, user } = useAuth()

  // Fetch cart data
  const fetchCart = async () => {
    if (!token || !user) {
      dispatch({ type: CART_ACTIONS.CLEAR_CART })
      return
    }

    dispatch({ type: CART_ACTIONS.SET_LOADING, payload: true })
    
    try {
      const result = await cartService.getCart()
      
      if (result.success) {
        dispatch({
          type: CART_ACTIONS.SET_CART,
          payload: {
            data: result.data,
            numOfCartItems: result.numOfCartItems,
            totalCartPrice: result.totalCartPrice
          }
        })
      } else {
        dispatch({ type: CART_ACTIONS.SET_ERROR, payload: result.message })
      }
    } catch {
      dispatch({ type: CART_ACTIONS.SET_ERROR, payload: 'Failed to load cart' })
    }
  }

  // Add item to cart
  const addToCart = async (productId) => {
    if (!token || !user) {
      throw new Error('Please log in to add items to cart')
    }

    try {
      const result = await cartService.addToCart(productId)
      
      if (result.success) {
        // Refresh cart after adding
        await fetchCart()
        return result
      } else {
        throw new Error(result.message)
      }
    } catch (error) {
      throw new Error(error.message || 'Failed to add item to cart')
    }
  }

  // Remove item from cart
  const removeFromCart = async (productId) => {
    if (!token || !user) {
      throw new Error('Please log in to manage cart')
    }

    try {
      const result = await cartService.removeFromCart(productId)
      
      if (result.success) {
        // Refresh cart after removing
        await fetchCart()
        return result
      } else {
        throw new Error(result.message)
      }
    } catch (error) {
      throw new Error(error.message || 'Failed to remove item from cart')
    }
  }

  // Update item quantity
  const updateItemQuantity = async (productId, quantity) => {
    if (!token || !user) {
      throw new Error('Please log in to manage cart')
    }

    if (quantity <= 0) {
      return removeFromCart(productId)
    }

    try {
      const result = await cartService.updateCartItemQuantity(productId, quantity)
      
      if (result.success) {
        // Refresh cart after updating
        await fetchCart()
        return result
      } else {
        throw new Error(result.message)
      }
    } catch (error) {
      throw new Error(error.message || 'Failed to update item quantity')
    }
  }

  // Clear entire cart
  const clearCart = async () => {
    if (!token || !user) {
      throw new Error('Please log in to manage cart')
    }

    try {
      const result = await cartService.clearCart()
      
      if (result.success) {
        dispatch({ type: CART_ACTIONS.CLEAR_CART })
        return result
      } else {
        throw new Error(result.message)
      }
    } catch (error) {
      throw new Error(error.message || 'Failed to clear cart')
    }
  }

  // Apply coupon
  const applyCoupon = async (couponCode) => {
    if (!token || !user) {
      throw new Error('Please log in to apply coupon')
    }

    try {
      const result = await cartService.applyCoupon(couponCode)
      
      if (result.success) {
        // Refresh cart after applying coupon
        await fetchCart()
        return result
      } else {
        throw new Error(result.message)
      }
    } catch (error) {
      throw new Error(error.message || 'Failed to apply coupon')
    }
  }

  // Check if item is in cart
  const isInCart = (productId) => {
    return state.items.some(item => item.product?.id === productId || item.product?._id === productId)
  }

  // Get item quantity in cart
  const getItemQuantity = (productId) => {
    const item = state.items.find(item => item.product?.id === productId || item.product?._id === productId)
    return item ? item.count : 0
  }

  // Load cart when user logs in
  useEffect(() => {
    if (token && user) {
      fetchCart()
    } else {
      dispatch({ type: CART_ACTIONS.CLEAR_CART })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, user])

  const value = {
    // State
    cart: state.cart,
    items: state.items,
    numOfCartItems: state.numOfCartItems,
    totalCartPrice: state.totalCartPrice,
    totalPriceAfterDiscount: state.totalPriceAfterDiscount,
    loading: state.loading,
    error: state.error,
    
    // Actions
    fetchCart,
    addToCart,
    removeFromCart,
    updateItemQuantity,
    clearCart,
    applyCoupon,
    isInCart,
    getItemQuantity
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

// Hook to use cart context
export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}