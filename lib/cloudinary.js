import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});





/**
 * Upload file to Cloudinary
 * @param {string} filePath - Path to the file
 * @param {object} options - Cloudinary upload options
 * @returns {Promise<object>} - Cloudinary response
 */
export const uploadToCloudinary = async (filePath, options = {}) => {
  try {
    const defaultOptions = {
      folder: 'properties',
      use_filename: true,
      unique_filename: true,
      overwrite: false,
      resource_type: 'auto',
      quality: 'auto',
      fetch_format: 'auto',
    };

    const uploadOptions = { ...defaultOptions, ...options };
    
    const result = await cloudinary.uploader.upload(filePath, uploadOptions);
    
    // Delete the temporary file
    try {
      fs.unlinkSync(filePath);
    } catch (error) {
      console.warn('Failed to delete temporary file:', error);
    }
    
    return result;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Failed to upload image to Cloudinary');
  }
};

/**
 * Delete file from Cloudinary
 * @param {string} publicId - Cloudinary public ID
 * @returns {Promise<object>} - Cloudinary response
 */
export const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Cloudinary deletion error:', error);
    throw new Error('Failed to delete image from Cloudinary');
  }
};

/**
 * Generate optimized image URLs
 * @param {string} publicId - Cloudinary public ID
 * @param {object} transformations - Image transformations
 * @returns {string} - Optimized image URL
 */
export const getOptimizedImageUrl = (publicId, transformations = {}) => {
  const defaultTransformations = {
    quality: 'auto',
    fetch_format: 'auto',
  };

  const finalTransformations = { ...defaultTransformations, ...transformations };
  
  return cloudinary.url(publicId, finalTransformations);
};

/**
 * Generate responsive image URLs for different screen sizes
 * @param {string} publicId - Cloudinary public ID
 * @returns {object} - Object with URLs for different screen sizes
 */
export const getResponsiveImageUrls = (publicId) => {
  return {
    thumbnail: getOptimizedImageUrl(publicId, { width: 300, height: 200, crop: 'fill' }),
    small: getOptimizedImageUrl(publicId, { width: 500, height: 375, crop: 'fill' }),
    medium: getOptimizedImageUrl(publicId, { width: 800, height: 600, crop: 'fill' }),
    large: getOptimizedImageUrl(publicId, { width: 1200, height: 900, crop: 'fill' }),
    original: getOptimizedImageUrl(publicId),
  };
};

/**
 * Upload multiple images to Cloudinary
 * @param {Array<string>} filePaths - Array of file paths
 * @param {object} options - Cloudinary upload options
 * @returns {Promise<Array>} - Array of upload results
 */
export const uploadMultipleImages = async (filePaths, options = {}) => {
  const uploadPromises = filePaths.map(filePath => 
    uploadToCloudinary(filePath, options)
  );
  
  try {
    const results = await Promise.all(uploadPromises);
    return results;
  } catch (error) {
    console.error('Multiple image upload error:', error);
    throw new Error('Failed to upload multiple images');
  }
};

/**
 * Create image transformation URL for property images
 * @param {string} publicId - Cloudinary public ID
 * @param {string} size - Size preset (thumbnail, small, medium, large)
 * @returns {string} - Transformed image URL
 */
export const getPropertyImageUrl = (publicId, size = 'medium') => {
  const sizeTransformations = {
    thumbnail: { width: 300, height: 200, crop: 'fill' },
    small: { width: 500, height: 375, crop: 'fill' },
    medium: { width: 800, height: 600, crop: 'fill' },
    large: { width: 1200, height: 900, crop: 'fill' },
    hero: { width: 1600, height: 900, crop: 'fill' },
  };

  const transformation = sizeTransformations[size] || sizeTransformations.medium;
  
  return getOptimizedImageUrl(publicId, transformation);
};


export default cloudinary;