import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'
import { getImageUrl, getPlaceholderImage } from '../utils/imageUtils'

function Cart() {
  const {
    items,
    numOfCartItems,
    totalCartPrice,
    totalPriceAfterDiscount,
    loading,
    error,
    updateItemQuantity,
    removeFromCart,
    clearCart,
    applyCoupon
  } = useCart()

  const [couponCode, setCouponCode] = useState('')
  const [couponLoading, setCouponLoading] = useState(false)
  const [couponError, setCouponError] = useState('')
  const [couponSuccess, setCouponSuccess] = useState('')

  // Handle quantity change
  const handleQuantityChange = async (productId, newQuantity) => {
    try {
      await updateItemQuantity(productId, newQuantity)
    } catch (error) {
      console.error('Failed to update quantity:', error.message)
    }
  }

  // Handle remove item
  const handleRemoveItem = async (productId) => {
    try {
      await removeFromCart(productId)
    } catch (error) {
      console.error('Failed to remove item:', error.message)
    }
  }

  // Handle clear cart
  const handleClearCart = async () => {
    if (window.confirm('Are you sure you want to clear your entire cart?')) {
      try {
        await clearCart()
      } catch (error) {
        console.error('Failed to clear cart:', error.message)
      }
    }
  }

  // Handle coupon application
  const handleApplyCoupon = async (e) => {
    e.preventDefault()
    if (!couponCode.trim()) return

    setCouponLoading(true)
    setCouponError('')
    setCouponSuccess('')

    try {
      const result = await applyCoupon(couponCode.trim())
      setCouponSuccess(result.message || 'Coupon applied successfully!')
      setCouponCode('')
    } catch (error) {
      setCouponError(error.message)
    } finally {
      setCouponLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-16">
          <div className="max-w-md mx-auto">
            <div className="text-6xl mb-4">❌</div>
            <h3 className="text-xl font-medium text-red-800 mb-2">Error Loading Cart</h3>
            <p className="text-red-600 mb-6">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="inline-flex items-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-300 font-medium"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (numOfCartItems === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-16">
          <div className="max-w-md mx-auto">
            <div className="text-8xl mb-6">🛒</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Your Cart is Empty</h2>
            <p className="text-gray-600 mb-8">
              Looks like you haven't added any items to your cart yet. 
              Start shopping to fill it up!
            </p>
            <Link 
              to="/products"
              className="inline-flex items-center px-8 py-4 bg-green-600 text-white rounded-xl hover:bg-green-700 transition duration-300 font-medium text-lg"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              Start Shopping
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Shopping Cart</h1>
            <p className="text-gray-600">{numOfCartItems} {numOfCartItems === 1 ? 'item' : 'items'} in your cart</p>
          </div>
          {numOfCartItems > 0 && (
            <button
              onClick={handleClearCart}
              className="mt-4 sm:mt-0 px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition duration-300 font-medium"
            >
              Clear Cart
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="p-6">
                <div className="space-y-6">
                  {items.map((item) => (
                    <div key={item.product.id || item.product._id} className="flex flex-col sm:flex-row gap-4 pb-6 border-b border-gray-100 last:border-b-0 last:pb-0">
                      {/* Product Image */}
                      <div className="flex-shrink-0">
                        <img
                          src={getImageUrl(item.product.imageCover, getPlaceholderImage(120, 120, item.product.title))}
                          alt={item.product.title}
                          className="w-24 h-24 object-cover rounded-xl"
                          onError={(e) => {
                            e.target.src = getPlaceholderImage(120, 120, item.product.title)
                          }}
                        />
                      </div>

                      {/* Product Info */}
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-800 mb-1">
                              <Link 
                                to={`/products/${item.product.id || item.product._id}`}
                                className="hover:text-green-600 transition-colors duration-200"
                              >
                                {item.product.title}
                              </Link>
                            </h3>
                            {item.product.category && (
                              <p className="text-sm text-gray-500 mb-2">{item.product.category.name}</p>
                            )}
                            {item.product.brand && (
                              <p className="text-sm text-gray-500 mb-3">Brand: {item.product.brand.name}</p>
                            )}
                            <p className="text-xl font-bold text-green-600">${item.price}</p>
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex items-center gap-4 mt-4 sm:mt-0">
                            <div className="flex items-center border border-gray-300 rounded-lg">
                              <button
                                onClick={() => handleQuantityChange(item.product.id || item.product._id, item.count - 1)}
                                className="p-2 hover:bg-gray-50 transition duration-200 rounded-l-lg"
                                disabled={item.count <= 1}
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                </svg>
                              </button>
                              <span className="px-4 py-2 font-medium min-w-[3rem] text-center">{item.count}</span>
                              <button
                                onClick={() => handleQuantityChange(item.product.id || item.product._id, item.count + 1)}
                                className="p-2 hover:bg-gray-50 transition duration-200 rounded-r-lg"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                              </button>
                            </div>

                            {/* Remove Button */}
                            <button
                              onClick={() => handleRemoveItem(item.product.id || item.product._id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition duration-200"
                              title="Remove item"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-8">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Order Summary</h2>

              {/* Coupon Section */}
              <div className="mb-6">
                <form onSubmit={handleApplyCoupon} className="space-y-3">
                  <div>
                    <input
                      type="text"
                      placeholder="Enter coupon code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={couponLoading || !couponCode.trim()}
                    className="w-full px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {couponLoading ? 'Applying...' : 'Apply Coupon'}
                  </button>
                </form>

                {couponError && (
                  <p className="text-red-600 text-sm mt-2">{couponError}</p>
                )}
                {couponSuccess && (
                  <p className="text-green-600 text-sm mt-2">{couponSuccess}</p>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({numOfCartItems} items)</span>
                  <span>${totalCartPrice}</span>
                </div>
                
                {totalPriceAfterDiscount && totalPriceAfterDiscount < totalCartPrice && (
                  <>
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>-${(totalCartPrice - totalPriceAfterDiscount).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Total after discount</span>
                      <span>${totalPriceAfterDiscount}</span>
                    </div>
                  </>
                )}
                
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between text-xl font-bold text-gray-800">
                    <span>Total</span>
                    <span>${totalPriceAfterDiscount || totalCartPrice}</span>
                  </div>
                </div>
              </div>

              {/* Checkout Button */}
              <button className="w-full bg-green-600 text-white py-4 rounded-xl hover:bg-green-700 transition duration-300 font-medium text-lg mb-4">
                Proceed to Checkout
              </button>

              {/* Continue Shopping */}
              <Link 
                to="/products"
                className="block w-full text-center text-green-600 hover:text-green-700 transition duration-300 font-medium"
              >
                ← Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart