import api from './api'

class ProductsService {
  // Get all products with optional filters
  async getAllProducts(options = {}) {
    try {
      const { 
        limit = 40, 
        page = 1, 
        sort = '-createdAt', 
        keyword = '', 
        category = '', 
        brand = '',
        priceGte = '',
        priceLte = ''
      } = options

      const params = new URLSearchParams()
      if (limit) params.append('limit', limit)
      if (page) params.append('page', page)
      if (sort) params.append('sort', sort)
      if (keyword) params.append('keyword', keyword)
      if (category) params.append('category[in]', category)
      if (brand) params.append('brand', brand)
      if (priceGte) params.append('price[gte]', priceGte)
      if (priceLte) params.append('price[lte]', priceLte)

      const response = await api.get(`/products?${params.toString()}`)
      
      return {
        success: true,
        data: response.data.data,
        metadata: response.data.metadata,
        results: response.data.results
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch products.',
        data: [],
        metadata: null,
        results: 0
      }
    }
  }

  // Get single product by ID
  async getProductById(productId) {
    try {
      const response = await api.get(`/products/${productId}`)
      
      return {
        success: true,
        data: response.data.data
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch product.',
        data: null
      }
    }
  }

  // Get products by category
  async getProductsByCategory(categoryId, options = {}) {
    return this.getAllProducts({
      ...options,
      category: categoryId
    })
  }

  // Get products by brand
  async getProductsByBrand(brandId, options = {}) {
    return this.getAllProducts({
      ...options,
      brand: brandId
    })
  }

  // Search products
  async searchProducts(keyword, options = {}) {
    return this.getAllProducts({
      ...options,
      keyword: keyword
    })
  }

  // Get products by price range
  async getProductsByPriceRange(minPrice, maxPrice, options = {}) {
    return this.getAllProducts({
      ...options,
      priceGte: minPrice,
      priceLte: maxPrice
    })
  }
}

export default new ProductsService()