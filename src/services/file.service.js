const httpStatus = require('http-status');
const { cloudinary } = require('../config/cloudinary');
const ApiError = require('../utils/ApiError');

/**
 * Upload file to Cloudinary
 * @param {Object} file - Multer file object
 * @param {string} folder - Optional folder name
 * @returns {Promise<Object>} - Cloudinary upload result
 */
const uploadFile = async (file, folder = 'skillar') => {
  if (!file) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'No file provided');
  }

  return {
    url: file.path,
    publicId: file.filename,
    format: file.format,
    resourceType: file.resource_type,
    bytes: file.bytes,
  };
};

/**
 * Delete file from Cloudinary
 * @param {string} publicId - Cloudinary public ID
 * @returns {Promise<Object>} - Deletion result
 */
const deleteFile = async (publicId) => {
  if (!publicId) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'No public ID provided');
  }

  const result = await cloudinary.uploader.destroy(publicId);
  
  if (result.result !== 'ok') {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to delete file');
  }

  return result;
};

/**
 * Get file URL from publicId
 * @param {string} publicId - Cloudinary public ID
 * @returns {string} - File URL
 */
const getFileUrl = (publicId) => {
  return cloudinary.url(publicId);
};

module.exports = {
  uploadFile,
  deleteFile,
  getFileUrl,
};
