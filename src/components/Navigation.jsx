import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useCart } from '../contexts/CartContext'
import { ShoppingCart } from 'lucide-react'

function Navigation({ wishlistCount = 0 }) {
  const location = useLocation()
  const { user, isAuthenticated, logout } = useAuth()
  const { numOfCartItems } = useCart()
  
  const isActive = (path) => {
    return location.pathname === path ? 'bg-green-700 text-white' : 'hover:bg-green-700 hover:text-white'
  }

  return (
    <nav>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="text-2xl font-bold">
            <ShoppingCart className="inline-block mr-2 text-green-600" />
            FreshMart
          </Link>
          
          <div className="hidden md:flex space-x-6">
            <Link 
              to="/" 
              className={`px-3 py-2 rounded transition duration-300 ${isActive('/')}`}
            >
              Home
            </Link>
            <Link 
              to="/products" 
              className={`px-3 py-2 rounded transition duration-300 ${isActive('/products')}`}
            >
              Products
            </Link>
            <Link 
              to="/brands" 
              className={`px-3 py-2 rounded transition duration-300 ${isActive('/brands')}`}
            >
              Brands
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Only show cart and wishlist when user is authenticated */}
            {isAuthenticated && (
              <>
                <Link 
                  to="/wishlist" 
                  className={`px-3 py-2 rounded transition duration-300 flex items-center space-x-1 ${isActive('/wishlist')}`}
                >
                  <span>❤️</span>
                  <span>Wishlist</span>
                  {wishlistCount > 0 && (
                    <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 ml-1">{wishlistCount}</span>
                  )}
                </Link>
                <Link 
                  to="/cart" 
                  className={`px-3 py-2 rounded transition duration-300 flex items-center space-x-1 ${isActive('/cart')}`}
                >
                  <span>🛒</span>
                  <span>Cart</span>
                  {numOfCartItems > 0 && (
                    <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 ml-1">{numOfCartItems}</span>
                  )}
                </Link>
              </>
            )}
            
            {/* Authentication Actions */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <span className="text-sm">Welcome, {user?.name}</span>
                <button
                  onClick={logout}
                  className="px-3 py-2 rounded cursor-pointer transition duration-300 text-white bg-green-600 hover:bg-green-700"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link 
                  to="/login" 
                  className={`px-3 py-2 rounded transition duration-300 ${isActive('/login')}`}
                >
                  Login
                </Link>
                <Link 
                  to="/signup" 
                  className={`px-3 py-2 rounded transition duration-300 bg-green-600 hover:bg-green-700 ${isActive('/signup')}`}
                >
                  Sign Up
                </Link>
              </div>
            )}
            
            <button className="md:hidden">
              <span className="text-2xl">☰</span>
            </button>
          </div>
        </div>
        
        <div className="md:hidden pb-4">
          <div className="flex flex-col space-y-2">
            <Link 
              to="/" 
              className={`px-3 py-2 rounded transition duration-300 ${isActive('/')}`}
            >
              Home
            </Link>
            <Link 
              to="/products" 
              className={`px-3 py-2 rounded transition duration-300 ${isActive('/products')}`}
            >
              Products
            </Link>
            <Link 
              to="/brands" 
              className={`px-3 py-2 rounded transition duration-300 ${isActive('/brands')}`}
            >
              Brands
            </Link>
            
            {/* Only show cart and wishlist in mobile menu when authenticated */}
            {isAuthenticated && (
              <>
                <Link 
                  to="/wishlist" 
                  className={`px-3 py-2 rounded transition duration-300 flex items-center space-x-1 ${isActive('/wishlist')}`}
                >
                  <span>❤️</span>
                  <span>Wishlist</span>
                  {wishlistCount > 0 && (
                    <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 ml-1">{wishlistCount}</span>
                  )}
                </Link>
                <Link 
                  to="/cart" 
                  className={`px-3 py-2 rounded transition duration-300 flex items-center space-x-1 ${isActive('/cart')}`}
                >
                  <span>🛒</span>
                  <span>Cart</span>
                  {numOfCartItems > 0 && (
                    <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 ml-1">{numOfCartItems}</span>
                  )}
                </Link>
              </>
            )}
            
            {isAuthenticated ? (
              <div className="border-t border-green-500 pt-2 mt-2">
                <span className="px-3 py-2 text-sm">Welcome, {user?.name}</span>
                <button
                  onClick={logout}
                  className="block w-full text-left px-3 py-2 rounded transition duration-300 hover:bg-green-700"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="border-t border-green-500 pt-2 mt-2 space-y-2">
                <Link 
                  to="/login" 
                  className={`block px-3 py-2 rounded transition duration-300 ${isActive('/login')}`}
                >
                  Login
                </Link>
                <Link 
                  to="/signup" 
                  className={`block px-3 py-2 rounded transition duration-300 bg-green-600 hover:bg-green-700 ${isActive('/signup')}`}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navigation