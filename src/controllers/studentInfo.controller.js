const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { studentInfoService } = require('../services');

const createStudentInfo = catchAsync(async (req, res) => {
  const studentInfo = await studentInfoService.createStudentInfo(req.params.userId, req.body);
  res.status(httpStatus.CREATED).send(studentInfo);
});

const getStudentInfo = catchAsync(async (req, res) => {
  const studentInfo = await studentInfoService.getStudentInfoByUserId(req.params.userId);
  if (!studentInfo) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Student info not found');
  }
  res.send(studentInfo);
});

const updateStudentInfo = catchAsync(async (req, res) => {
  const studentInfo = await studentInfoService.updateStudentInfoByUserId(req.params.userId, req.body);
  res.send(studentInfo);
});

const deleteStudentInfo = catchAsync(async (req, res) => {
  await studentInfoService.deleteStudentInfoByUserId(req.params.userId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createStudentInfo,
  getStudentInfo,
  updateStudentInfo,
  deleteStudentInfo,
};
