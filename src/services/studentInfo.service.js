const httpStatus = require('http-status');
const { StudentInfo, User } = require('../models');
const ApiError = require('../utils/ApiError');
const { USER_ROLES, USER_DETAILED_SELECT_FIELDS } = require('../constants');

/**
 * Create student info
 * @param {ObjectId} userId
 * @param {Object} studentInfoBody
 * @returns {Promise<StudentInfo>}
 */
const createStudentInfo = async (userId, studentInfoBody) => {
  // Check if user exists and is a student
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (user.role !== USER_ROLES.STUDENT) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User is not a student');
  }

  // Check if student info already exists
  const existingInfo = await StudentInfo.findOne({ userId });
  if (existingInfo) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Student info already exists');
  }

  const studentInfo = await StudentInfo.create({
    userId,
    ...studentInfoBody,
  });

  return studentInfo;
};

/**
 * Get student info by userId
 * @param {ObjectId} userId
 * @returns {Promise<StudentInfo>}
 */
const getStudentInfoByUserId = async (userId) => {
  const studentInfo = await StudentInfo.findOne({ userId })
    .populate('userId', USER_DETAILED_SELECT_FIELDS);
  
  if (!studentInfo) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Student info not found');
  }
  
  return studentInfo;
};

/**
 * Update student info by userId
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<StudentInfo>}
 */
const updateStudentInfoByUserId = async (userId, updateBody) => {
  const studentInfo = await StudentInfo.findOneAndUpdate({ userId }, updateBody, {
    new: true,
    runValidators: true,
  })
    .populate('userId', USER_DETAILED_SELECT_FIELDS);
  
  if (!studentInfo) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Student info not found');
  }
  
  return studentInfo;
};

/**
 * Delete student info by userId
 * @param {ObjectId} userId
 * @returns {Promise<StudentInfo>}
 */
const deleteStudentInfoByUserId = async (userId) => {
  const studentInfo = await StudentInfo.findOneAndDelete({ userId });
  if (!studentInfo) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Student info not found');
  }
  return studentInfo;
};

module.exports = {
  createStudentInfo,
  getStudentInfoByUserId,
  updateStudentInfoByUserId,
  deleteStudentInfoByUserId,
};
