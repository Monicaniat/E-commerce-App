import { Link } from 'react-router-dom'

function Wishlist({ wishlistItems, removeFromWishlist }) {
  const handleRemoveFromWishlist = async (productId) => {
    const result = await removeFromWishlist(productId)
    if (result.success) {
      // Optionally show a success message
      console.log('Product removed from wishlist')
    }
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">My Wishlist</h1>
        
        <div className="text-center py-16">
          <div className="max-w-md mx-auto">
            <div className="text-6xl mb-4">💔</div>
            <h3 className="text-xl font-medium text-gray-800 mb-2">Your Wishlist is Empty</h3>
            <p className="text-gray-600 mb-6">
              Start adding products you love to your wishlist and find them here later!
            </p>
            <Link 
              to="/products"
              className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300 font-medium"
            >
              Browse Products
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800">My Wishlist</h1>
        <span className="text-gray-600">{wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'}</span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {wishlistItems.map(product => (
          <div key={product.id} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden">
            {/* Product Image */}
            <div className="relative">
              <img
                src={product.imageCover || `https://via.placeholder.com/300x200?text=${encodeURIComponent(product.title)}`}
                alt={product.title}
                className="w-full h-48 object-cover"
                loading="lazy"
              />
              
              {/* Remove from Wishlist Button */}
              <button
                onClick={() => handleRemoveFromWishlist(product.id)}
                className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition duration-300 group"
                title="Remove from Wishlist"
              >
                <svg 
                  className="w-5 h-5 text-red-500 group-hover:text-red-600" 
                  fill="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                </svg>
              </button>
            </div>
            
            {/* Product Info */}
            <div className="p-4">
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
              <h3 className="text-lg font-semibold mb-2 line-clamp-2 text-gray-800">
                {product.title}
              </h3>
              
              {/* Price */}
              <p className="text-xl font-bold text-green-600 mb-4">
                ${product.price}
              </p>
              
              {/* Actions */}
              <div className="flex gap-2">
                <Link 
                  to={`/products/${product.id}`}
                  className="flex-1 text-center bg-green-600 text-white py-2.5 px-4 rounded-lg hover:bg-green-700 transition duration-300 font-medium text-sm"
                >
                  View Details
                </Link>
                <button className="flex-1 bg-gray-100 text-gray-700 py-2.5 px-4 rounded-lg hover:bg-gray-200 transition duration-300 font-medium text-sm">
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Footer Actions */}
      <div className="mt-12 text-center">
        <Link 
          to="/products"
          className="inline-flex items-center px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition duration-300 font-medium mr-4"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  )
}

export default Wishlist