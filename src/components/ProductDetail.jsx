import { useState, useEffect, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import productsService from '../services/productsService'
import wishlistService from '../services/wishlistService'

function ProductDetail({ addToWishlist, removeFromWishlist }) {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedImage, setSelectedImage] = useState(0)
  const [isInWishlist, setIsInWishlist] = useState(false)

  const fetchProduct = useCallback(async () => {
    setLoading(true)
    setError('')
    
    try {
      const result = await productsService.getProductById(id)
      
      if (result.success) {
        setProduct(result.data)
        setSelectedImage(0)
      } else {
        setError(result.message)
      }
    } catch {
      setError('Failed to load product details. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchProduct()
  }, [fetchProduct])

  // Check wishlist status when product loads
  useEffect(() => {
    const checkWishlistStatus = async () => {
      if (product) {
        const inWishlist = await wishlistService.isInWishlist(product.id)
        setIsInWishlist(inWishlist)
      }
    }
    checkWishlistStatus()
  }, [product])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          <span className="ml-3 text-lg">Loading product...</span>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          {error || 'Product Not Found'}
        </h1>
        <Link to="/products" className="text-green-600 hover:underline">
          ← Back to Products
        </Link>
        {error && (
          <button 
            onClick={fetchProduct}
            className="ml-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Retry
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/products" className="text-green-600 hover:underline mb-6 inline-block">
        ← Back to Products
      </Link>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="lg:flex">
          {/* Product Images */}
          <div className="lg:w-1/2 p-6">
            <div className="mb-4">
              <img
                src={product.images?.[selectedImage] || product.imageCover}
                alt={product.title}
                className="w-full h-96 object-cover rounded-lg"
              />
            </div>
            {product.images && product.images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                      selectedImage === index ? 'border-green-600' : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.title} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Product Info */}
          <div className="lg:w-1/2 p-6">
            <div className="mb-4">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{product.title}</h1>
              <p className="text-lg text-gray-600">{product.category?.name || 'Uncategorized'}</p>
              {product.brand?.name && (
                <p className="text-md text-gray-500">Brand: {product.brand.name}</p>
              )}
            </div>

            <div className="mb-6">
              <p className="text-4xl font-bold text-green-600 mb-2">${product.price}</p>
              {product.ratingsAverage && (
                <div className="flex items-center mb-2">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <span key={i}>
                        {i < Math.floor(product.ratingsAverage) ? '★' : '☆'}
                      </span>
                    ))}
                  </div>
                  <span className="ml-2 text-gray-600">
                    {product.ratingsAverage} ({product.ratingsQuantity} reviews)
                  </span>
                </div>
              )}
              {product.quantity !== undefined && (
                <p className="text-sm text-gray-600">
                  {product.quantity > 0 ? `${product.quantity} in stock` : 'Out of stock'}
                </p>
              )}
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-gray-700 leading-relaxed">
                {product.description || 'No description available.'}
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="flex gap-3">
                <button 
                  className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={product.quantity === 0}
                >
                  {product.quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>
                <button
                  onClick={async () => {
                    // Optimistic update
                    setIsInWishlist(!isInWishlist)
                    
                    try {
                      if (isInWishlist) {
                        await removeFromWishlist(product.id)
                      } else {
                        await addToWishlist(product)
                      }
                    } catch {
                      // Revert optimistic update on error
                      setIsInWishlist(isInWishlist)
                    }
                  }}
                  className="p-3 border-2 border-gray-300 rounded-lg hover:border-red-500 hover:bg-red-50 transition duration-300"
                  title={isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
                >
                  <svg 
                    className={`w-6 h-6 ${isInWishlist ? 'text-red-500' : 'text-gray-400'}`} 
                    fill={isInWishlist ? 'currentColor' : 'none'}
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
              </div>
              <button 
                className="w-full bg-gray-800 text-white py-3 px-6 rounded-lg hover:bg-gray-900 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={product.quantity === 0}
              >
                {product.quantity === 0 ? 'Out of Stock' : 'Buy Now'}
              </button>
            </div>

            {/* Additional Product Info */}
            {(product.sold || product.createdAt) && (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                  {product.sold && (
                    <div>
                      <span className="font-medium">Sold:</span> {product.sold} items
                    </div>
                  )}
                  {product.createdAt && (
                    <div>
                      <span className="font-medium">Added:</span>{' '}
                      {new Date(product.createdAt).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail