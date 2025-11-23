const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { fileService } = require('../services');
const ApiError = require('../utils/ApiError');

const uploadFile = catchAsync(async (req, res) => {
  if (!req.file) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Please upload a file');
  }

  const result = await fileService.uploadFile(req.file);
  res.status(httpStatus.CREATED).send({
    message: 'File uploaded successfully',
    file: result,
  });
});

const uploadMultipleFiles = catchAsync(async (req, res) => {
  if (!req.files || req.files.length === 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Please upload at least one file');
  }

  const uploadPromises = req.files.map((file) => fileService.uploadFile(file));
  const results = await Promise.all(uploadPromises);

  res.status(httpStatus.CREATED).send({
    message: `${results.length} files uploaded successfully`,
    files: results,
  });
});

const deleteFile = catchAsync(async (req, res) => {
  await fileService.deleteFile(req.params.publicId);
  res.send({ message: 'File deleted successfully' });
});

module.exports = {
  uploadFile,
  uploadMultipleFiles,
  deleteFile,
};
