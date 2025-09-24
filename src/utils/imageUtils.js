// Utility function to handle product images
export const getImageUrl = (imageCover, fallbackUrl = null) => {
  if (!imageCover) {
    return fallbackUrl
  }
  
  // If the image URL is already a full URL, return it
  if (imageCover.startsWith('http://') || imageCover.startsWith('https://')) {
    return imageCover
  }
  
  // If it's a relative URL, try to construct the full URL
  // Many APIs return relative paths that need to be prefixed
  const baseImageUrl = 'https://ecommerce.routemisr.com'
  return `${baseImageUrl}${imageCover.startsWith('/') ? '' : '/'}${imageCover}`
}

// Generate placeholder image URL
export const getPlaceholderImage = (width = 400, height = 300, text = 'No Image') => {
  return `https://via.placeholder.com/${width}x${height}/f3f4f6/6b7280?text=${encodeURIComponent(text)}`
}

export default { getImageUrl, getPlaceholderImage }