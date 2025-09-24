import { useState, useEffect } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Navigation from './components/Navigation'
import Home from './components/Home'
import Products from './components/Products'
import ProductDetail from './components/ProductDetail'
import Cart from './components/Cart'
import Checkout from './components/Checkout'
import Brands from './components/Brands'
import Login from './components/Login'
import Signup from './components/Signup'
import Wishlist from './components/Wishlist'
import wishlistService from './services/wishlistService'
import { useAuth } from './hooks/useAuth'
import { CartProvider } from './contexts/CartContext'

// Protected route component that checks authentication
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth()
  
  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-16">
          <div className="max-w-md mx-auto">
            <div className="text-6xl mb-4">🔒</div>
            <h3 className="text-xl font-medium text-gray-800 mb-2">Login Required</h3>
            <p className="text-gray-600 mb-6">
              You need to be logged in to access this page.
            </p>
            <Link 
              to="/login"
              className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300 font-medium"
            >
              Login to Continue
            </Link>
          </div>
        </div>
      </div>
    )
  }
  
  return children
}

function App() {
  const [wishlistItems, setWishlistItems] = useState([])
  const [wishlistCount, setWishlistCount] = useState(0)

  // Load wishlist items on app startup
  useEffect(() => {
    const loadWishlist = async () => {
      const result = await wishlistService.getWishlistItems()
      if (result.success) {
        setWishlistItems(result.data)
        setWishlistCount(result.count)
      }
    }
    loadWishlist()
  }, [])

  // Add product to wishlist
  const addToWishlist = async (productData) => {
    const result = await wishlistService.addToWishlist(productData)
    if (result.success) {
      // Refresh wishlist after adding
      const updatedResult = await wishlistService.getWishlistItems()
      if (updatedResult.success) {
        setWishlistItems(updatedResult.data)
        setWishlistCount(updatedResult.count)
      }
    }
    return result
  }

  // Remove product from wishlist
  const removeFromWishlist = async (productId) => {
    const result = await wishlistService.removeFromWishlist(productId)
    if (result.success) {
      // Refresh wishlist after removing
      const updatedResult = await wishlistService.getWishlistItems()
      if (updatedResult.success) {
        setWishlistItems(updatedResult.data)
        setWishlistCount(updatedResult.count)
      }
    }
    return result
  }

  // Check if product is in wishlist
  const isInWishlist = async (productId) => {
    return await wishlistService.isInWishlist(productId)
  }

  return (
    <CartProvider>
      <div className="App">
        <Navigation wishlistCount={wishlistCount} />
        <main className="min-h-screen">
          <Routes>
            <Route path="/" element={<Home />} />
          <Route path="/products" element={
            <Products 
              addToWishlist={addToWishlist}
              removeFromWishlist={removeFromWishlist}
              isInWishlist={isInWishlist}
            />
          } />
          <Route path="/products/:id" element={
            <ProductDetail 
              addToWishlist={addToWishlist}
              removeFromWishlist={removeFromWishlist}
              isInWishlist={isInWishlist}
            />
          } />
          <Route path="/wishlist" element={
            <ProtectedRoute>
              <Wishlist 
                wishlistItems={wishlistItems}
                removeFromWishlist={removeFromWishlist}
              />
            </ProtectedRoute>
          } />
          <Route path="/cart" element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          } />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/brands" element={<Brands />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </main>
    </div>
    </CartProvider>
  )
}

export default App;