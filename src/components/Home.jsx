import { Link } from 'react-router-dom'

function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">
          Welcome to FreshMart
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Discover amazing products at unbeatable prices
        </p>
        <div className="space-x-4">
          <Link 
            to="/products" 
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition duration-300"
          >
            Shop Now
          </Link>
          <Link 
            to="/brands" 
            className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition duration-300"
          >
            View Brands
          </Link>
        </div>
      </div>
      
      {/* Featured Categories */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-center mb-8">Featured Categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Electronics</h3>
            <p className="text-gray-600 mb-4">Latest gadgets and technology</p>
            <Link to="/products" className="text-green-600 hover:underline">
              Shop Electronics →
            </Link>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Clothing</h3>
            <p className="text-gray-600 mb-4">Fashion for every occasion</p>
            <Link to="/products" className="text-green-600 hover:underline">
              Shop Clothing →
            </Link>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Books</h3>
            <p className="text-gray-600 mb-4">Expand your knowledge</p>
            <Link to="/products" className="text-green-600 hover:underline">
              Shop Books →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home