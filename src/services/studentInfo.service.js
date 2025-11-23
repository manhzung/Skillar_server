const httpStatus = require('http-status');
const { StudentInfo, User } = require('../models');
const ApiError = require('../utils/ApiError');

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
  if (user.role !== 'student') {
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
    .populate('userId', 'name email role phone avatarUrl address currentLevel')
    .populate('parentId', 'name email phone');
  return studentInfo;
};

/**
 * Update student info by userId
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<StudentInfo>}
 */
const updateStudentInfoByUserId = async (userId, updateBody) => {
  const studentInfo = await getStudentInfoByUserId(userId);
  if (!studentInfo) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Student info not found');
  }

  Object.assign(studentInfo, updateBody);
  await studentInfo.save();
  
  return StudentInfo.findOne({ userId })
    .populate('userId', 'name email role phone avatarUrl address currentLevel')
    .populate('parentId', 'name email phone');
};

/**
 * Delete student info by userId
 * @param {ObjectId} userId
 * @returns {Promise<StudentInfo>}
 */
const deleteStudentInfoByUserId = async (userId) => {
  const studentInfo = await getStudentInfoByUserId(userId);
  if (!studentInfo) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Student info not found');
  }
  await studentInfo.remove();
  return studentInfo;
};

module.exports = {
  createStudentInfo,
  getStudentInfoByUserId,
  updateStudentInfoByUserId,
  deleteStudentInfoByUserId,
};
