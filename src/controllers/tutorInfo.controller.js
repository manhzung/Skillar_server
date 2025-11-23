const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { tutorInfoService } = require('../services');

const createTutorInfo = catchAsync(async (req, res) => {
  const tutorInfo = await tutorInfoService.createTutorInfo(req.params.userId, req.body);
  res.status(httpStatus.CREATED).send(tutorInfo);
});

const getTutorInfo = catchAsync(async (req, res) => {
  const tutorInfo = await tutorInfoService.getTutorInfoByUserId(req.params.userId);
  if (!tutorInfo) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Tutor info not found');
  }
  res.send(tutorInfo);
});

const updateTutorInfo = catchAsync(async (req, res) => {
  const tutorInfo = await tutorInfoService.updateTutorInfoByUserId(req.params.userId, req.body);
  res.send(tutorInfo);
});

const deleteTutorInfo = catchAsync(async (req, res) => {
  await tutorInfoService.deleteTutorInfoByUserId(req.params.userId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createTutorInfo,
  getTutorInfo,
  updateTutorInfo,
  deleteTutorInfo,
};
