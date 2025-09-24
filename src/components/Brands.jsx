import { useState, useEffect } from 'react'
import brandsService from '../services/brandsService'
import { getImageUrl, getPlaceholderImage } from '../utils/imageUtils'

function Brands() {
  const [brands, setBrands] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchBrands = async () => {
      setLoading(true)
      setError('')
      
      try {
        const result = await brandsService.getAllBrands()
        
        if (result.success) {
          setBrands(result.data || [])
        } else {
          setError(result.message)
        }
      } catch {
        setError('Failed to load brands. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchBrands()
  }, [])

  // Skeleton loading component
  const BrandSkeleton = () => (
    <div className="group relative bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
      <div className="aspect-square bg-gray-200"></div>
      <div className="p-6">
        <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
      </div>
    </div>
  )

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-16">
          <div className="text-6xl mb-4">😞</div>
          <h3 className="text-xl font-medium text-gray-800 mb-2">Oops! Something went wrong</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300 font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Our Brands</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Discover the premium brands we partner with to bring you the finest quality products
        </p>
        {!loading && brands.length > 0 && (
          <div className="mt-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
              {brands.length} Brand{brands.length !== 1 ? 's' : ''} Available
            </span>
          </div>
        )}
      </div>

      {/* Brands Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
        {loading ? (
          // Show skeleton loading cards
          [...Array(12)].map((_, index) => (
            <BrandSkeleton key={`skeleton-${index}`} />
          ))
        ) : brands.length > 0 ? (
          brands.map(brand => (
            <div 
              key={brand._id} 
              className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-105 border border-gray-100 overflow-hidden cursor-pointer"
            >
              {/* Brand Image */}
              <div className="aspect-square bg-gray-50 relative overflow-hidden">
                <img
                  src={getImageUrl(brand.image, getPlaceholderImage(300, 300, brand.name))}
                  alt={brand.name}
                  className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                  onError={(e) => {
                    e.target.src = getPlaceholderImage(300, 300, brand.name)
                  }}
                />
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Hover Effect Ring */}
                <div className="absolute inset-2 border-2 border-green-500 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 scale-95 group-hover:scale-100"></div>
              </div>
              
              {/* Brand Name */}
              <div className="p-4 text-center">
                <h3 className="font-semibold text-gray-800 group-hover:text-green-600 transition-colors duration-300 truncate">
                  {brand.name}
                </h3>
              </div>

              {/* Floating Badge */}
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                <div className="bg-green-500 text-white rounded-full p-1.5">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
            </div>
          ))
        ) : (
          // No brands found
          <div className="col-span-full text-center py-16">
            <div className="text-6xl mb-4">🏷️</div>
            <h3 className="text-xl font-medium text-gray-800 mb-2">No Brands Available</h3>
            <p className="text-gray-600">
              We're working on adding more brands. Check back soon!
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Brands