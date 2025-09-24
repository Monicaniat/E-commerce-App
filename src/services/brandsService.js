import api from './api'

class BrandsService {
  // Get all brands
  async getAllBrands() {
    try {
      const response = await api.get('/brands')
      
      return {
        success: true,
        data: response.data.data || [],
        results: response.data.results || 0
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch brands.',
        data: [],
        results: 0
      }
    }
  }

  // Get single brand by ID
  async getBrandById(brandId) {
    try {
      const response = await api.get(`/brands/${brandId}`)
      
      return {
        success: true,
        data: response.data.data
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch brand.',
        data: null
      }
    }
  }
}

export default new BrandsService()