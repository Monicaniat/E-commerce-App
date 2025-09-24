import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import productsService from '../services/productsService'
import wishlistService from '../services/wishlistService'
import { useCart } from '../contexts/CartContext'
import { useAuth } from '../hooks/useAuth'
import { getImageUrl, getPlaceholderImage } from '../utils/imageUtils'

function Products({ addToWishlist, removeFromWishlist }) {
  const { addToCart, isInCart, getItemQuantity } = useCart()
  const { isAuthenticated } = useAuth()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('-createdAt')
  const [wishlistStatus, setWishlistStatus] = useState({})
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalResults, setTotalResults] = useState(0)
  const [resultsPerPage] = useState(24)

  // Function to refresh wishlist status
  const refreshWishlistStatus = useCallback(async () => {
    if (products.length === 0) return
    
    try {
      const wishlistResult = await wishlistService.getWishlistItems()
      const wishlistItems = wishlistResult.success ? wishlistResult.data : []
      
      const status = {}
      products.forEach(product => {
        status[product.id] = wishlistItems.some(item => item.id === product.id)
      })
      
      setWishlistStatus(status)
    } catch (error) {
      console.error('Failed to refresh wishlist status:', error)
    }
  }, [products])

  // Debounce search query for real-time search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery)
    }, 300) // 300ms debounce

    return () => clearTimeout(timer)
  }, [searchQuery])

  // Memoized fetch function for better performance
  const fetchProducts = useCallback(async (keyword = '', page = 1) => {
    setLoading(true)
    setError('')
    
    try {
      const result = await productsService.getAllProducts({
        limit: resultsPerPage,
        page: page,
        sort: sortBy,
        keyword: keyword
      })
      
      if (result.success) {
        setProducts(result.data || [])
        setTotalResults(result.results || 0)
        setTotalPages(Math.ceil((result.results || 0) / resultsPerPage))
      } else {
        setError(result.message)
        setProducts([])
        setTotalResults(0)
        setTotalPages(1)
      }
    } catch {
      setError('Failed to load products. Please try again.')
      setProducts([])
      setTotalResults(0)
      setTotalPages(1)
    } finally {
      setLoading(false)
    }
  }, [sortBy, resultsPerPage])

  // Fetch products when sort, search, or page changes
  useEffect(() => {
    fetchProducts(debouncedSearchQuery, currentPage)
  }, [fetchProducts, debouncedSearchQuery, currentPage])

  // Reset to page 1 when search query changes
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchQuery, sortBy])

  // Load wishlist status when products change
  useEffect(() => {
    refreshWishlistStatus()
  }, [refreshWishlistStatus])

  // Skeleton loading component
  const ProductSkeleton = () => (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 animate-pulse">
      <div className="bg-gray-200 h-56 w-full"></div>
      <div className="p-5">
        <div className="flex justify-between mb-2">
          <div className="bg-gray-200 h-4 w-20 rounded-full"></div>
          <div className="bg-gray-200 h-4 w-16 rounded"></div>
        </div>
        <div className="bg-gray-200 h-6 w-full mb-2 rounded"></div>
        <div className="bg-gray-200 h-4 w-3/4 mb-3 rounded"></div>
        <div className="flex items-center mb-3">
          <div className="bg-gray-200 h-4 w-20 rounded"></div>
          <div className="bg-gray-200 h-4 w-16 ml-2 rounded"></div>
        </div>
        <div className="flex justify-between mb-4">
          <div className="bg-gray-200 h-8 w-20 rounded"></div>
          <div className="bg-gray-200 h-4 w-12 rounded"></div>
        </div>
        <div className="flex gap-2">
          <div className="bg-gray-200 h-10 flex-1 rounded-xl"></div>
          <div className="bg-gray-200 h-10 flex-1 rounded-xl"></div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Our Products</h1>
      
      {/* Search and Sort Controls */}
      <div className="mb-8 flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products in real-time..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200 bg-white shadow-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        
        <div className="sm:w-56">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200 bg-white shadow-sm cursor-pointer"
          >
            <option value="-createdAt">Newest First</option>
            <option value="createdAt">Oldest First</option>
            <option value="price">Price: Low to High</option>
            <option value="-price">Price: High to Low</option>
            <option value="title">Name: A to Z</option>
            <option value="-title">Name: Z to A</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="mb-8 p-6 bg-red-50 border border-red-200 text-red-700 rounded-2xl shadow-sm">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L3.314 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div className="ml-3 flex-1">
              <h3 className="text-lg font-medium text-red-800 mb-1">Error Loading Products</h3>
              <p className="text-red-700 mb-4">{error}</p>
              <button 
                onClick={() => fetchProducts(debouncedSearchQuery, currentPage)}
                className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-300 text-sm font-medium"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Try Again
              </button>
            </div>
          </div>
        </div>
      )}
      
      {products.length === 0 && !loading && !error && (
        <div className="text-center py-16">
          <div className="max-w-md mx-auto">
            <svg className="h-24 w-24 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M9 12h6" />
            </svg>
            <h3 className="text-xl font-medium text-gray-800 mb-2">No Products Found</h3>
            <p className="text-gray-600 mb-4">
              {debouncedSearchQuery ? (
                <>
                  No products match "<strong>{debouncedSearchQuery}</strong>". 
                  <br />
                  Try different keywords or browse all products.
                </>
              ) : (
                'No products available at the moment.'
              )}
            </p>
            {debouncedSearchQuery && (
              <div className="space-y-2">
                <button 
                  onClick={() => setSearchQuery('')}
                  className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300 text-sm font-medium mr-2"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Clear Search
                </button>
                <div className="text-sm text-gray-500 mt-2">
                  Search was: "{debouncedSearchQuery}"
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {loading ? (
          // Show skeleton loading cards
          [...Array(8)].map((_, index) => (
            <ProductSkeleton key={`skeleton-${index}`} />
          ))
        ) : (
          products.map(product => (
            <div key={product.id} className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden border border-gray-100">
              {/* Image Container */}
              <div className="relative overflow-hidden bg-gray-100">
                <img
                  src={getImageUrl(product.imageCover, getPlaceholderImage(400, 300, product.title))}
                  alt={product.title}
                  className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                  onError={(e) => {
                    e.target.src = getPlaceholderImage(400, 300, product.title)
                  }}
                />
                {/* Quick Action Overlay */}
                <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                  <Link 
                    to={`/products/${product.id}`}
                    className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 bg-white text-gray-800 px-6 py-2 rounded-full font-medium shadow-lg hover:bg-gray-50"
                  >
                    Quick View
                  </Link>
                </div>
                {/* Wishlist Heart Button */}
                <button
                  onClick={async () => {
                    const isCurrentlyInWishlist = wishlistStatus[product.id] ?? false
                    
                    // Optimistic update
                    setWishlistStatus(prev => ({
                      ...prev,
                      [product.id]: !isCurrentlyInWishlist
                    }))
                    
                    try {
                      if (isCurrentlyInWishlist) {
                        await removeFromWishlist(product.id)
                      } else {
                        await addToWishlist(product)
                      }
                      
                      // Refresh wishlist status after successful operation
                      setTimeout(() => refreshWishlistStatus(), 100)
                    } catch {
                      // Revert optimistic update on error
                      setWishlistStatus(prev => ({
                        ...prev,
                        [product.id]: isCurrentlyInWishlist
                      }))
                    }
                  }}
                  className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition duration-300 z-10"
                  title={wishlistStatus[product.id] ? "Remove from Wishlist" : "Add to Wishlist"}
                >
                  <svg 
                    className={`w-5 h-5 ${wishlistStatus[product.id] ? 'text-red-500' : 'text-gray-400'}`} 
                    fill={wishlistStatus[product.id] ? 'currentColor' : 'none'}
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>

                {/* Badge for stock status */}
                {product.quantity <= 5 && product.quantity > 0 && (
                  <div className="absolute top-3 left-3 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                    Low Stock
                  </div>
                )}
                {product.quantity === 0 && (
                  <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                    Out of Stock
                  </div>
                )}
              </div>
              
              {/* Content */}
              <div className="p-5">
                {/* Category & Brand */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                    {product.category?.name || 'Uncategorized'}
                  </span>
                  {product.brand?.name && (
                    <span className="text-xs text-gray-500 font-medium">
                      {product.brand.name}
                    </span>
                  )}
                </div>
                
                {/* Title */}
                <h3 className="text-lg font-semibold mb-3 line-clamp-2 text-gray-800 group-hover:text-green-600 transition-colors duration-200">
                  {product.title}
                </h3>
                
                {/* Rating */}
                {product.ratingsAverage && (
                  <div className="flex items-center mb-3">
                    <div className="flex text-yellow-400 mr-2">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className="text-sm">
                          {i < Math.floor(product.ratingsAverage) ? '★' : '☆'}
                        </span>
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">
                      {product.ratingsAverage} ({product.ratingsQuantity || 0})
                    </span>
                  </div>
                )}
                
                {/* Price */}
                <div className="flex items-center justify-between mb-4">
                  <p className="text-2xl font-bold text-gray-800">
                    <span className="text-green-600">${product.price}</span>
                  </p>
                  {product.sold && (
                    <span className="text-xs text-gray-500">
                      {product.sold} sold
                    </span>
                  )}
                </div>
                
                {/* Actions */}
                <div className="flex gap-2">
                  <Link 
                    to={`/products/${product.id}`}
                    className="flex-1 text-center bg-green-600 text-white py-2.5 px-4 rounded-xl hover:bg-green-700 transition duration-300 font-medium text-sm"
                  >
                    View Details
                  </Link>
                  <button 
                    onClick={async () => {
                      if (!isAuthenticated) {
                        alert('Please log in to add items to cart')
                        return
                      }
                      
                      try {
                        await addToCart(product.id)
                      } catch (error) {
                        alert(error.message || 'Failed to add item to cart')
                      }
                    }}
                    className={`flex-1 py-2.5 px-4 rounded-xl transition duration-300 font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed ${
                      isInCart(product.id) 
                        ? 'bg-green-600 text-white hover:bg-green-700' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    disabled={product.quantity === 0 || !isAuthenticated}
                  >
                    {product.quantity === 0 
                      ? 'Out of Stock' 
                      : !isAuthenticated 
                        ? 'Login to Add' 
                        : isInCart(product.id) 
                          ? `In Cart (${getItemQuantity(product.id)})` 
                          : 'Add to Cart'
                    }
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {!loading && !error && products.length > 0 && totalPages > 1 && (
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Results Info */}
          <div className="text-sm text-gray-600">
            Showing {((currentPage - 1) * resultsPerPage) + 1} to {Math.min(currentPage * resultsPerPage, totalResults)} of {totalResults} products
          </div>
          
          {/* Pagination Controls */}
          <div className="flex items-center gap-2">
            {/* Previous Button */}
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-gray-500 transition duration-200"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Previous
            </button>
            
            {/* Page Numbers */}
            <div className="flex items-center gap-1">
              {(() => {
                const pages = []
                const maxVisiblePages = 5
                let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
                let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)
                
                // Adjust start page if we're near the end
                if (endPage - startPage < maxVisiblePages - 1) {
                  startPage = Math.max(1, endPage - maxVisiblePages + 1)
                }
                
                // Add first page and ellipsis if needed
                if (startPage > 1) {
                  pages.push(
                    <button
                      key={1}
                      onClick={() => setCurrentPage(1)}
                      className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition duration-200"
                    >
                      1
                    </button>
                  )
                  if (startPage > 2) {
                    pages.push(
                      <span key="ellipsis-start" className="px-2 py-2 text-sm text-gray-500">
                        ...
                      </span>
                    )
                  }
                }
                
                // Add visible page numbers
                for (let i = startPage; i <= endPage; i++) {
                  pages.push(
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i)}
                      className={`px-3 py-2 text-sm font-medium rounded-lg transition duration-200 ${
                        i === currentPage
                          ? 'bg-green-600 text-white border border-green-600'
                          : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      {i}
                    </button>
                  )
                }
                
                // Add ellipsis and last page if needed
                if (endPage < totalPages) {
                  if (endPage < totalPages - 1) {
                    pages.push(
                      <span key="ellipsis-end" className="px-2 py-2 text-sm text-gray-500">
                        ...
                      </span>
                    )
                  }
                  pages.push(
                    <button
                      key={totalPages}
                      onClick={() => setCurrentPage(totalPages)}
                      className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition duration-200"
                    >
                      {totalPages}
                    </button>
                  )
                }
                
                return pages
              })()
              }
            </div>
            
            {/* Next Button */}
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-gray-500 transition duration-200"
            >
              Next
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Products