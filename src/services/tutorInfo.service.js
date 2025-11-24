const httpStatus = require('http-status');
const { TutorInfo, User } = require('../models');
const ApiError = require('../utils/ApiError');
const { USER_ROLES, USER_DETAILED_SELECT_FIELDS } = require('../constants');

/**
 * Create tutor info
 * @param {ObjectId} userId
 * @param {Object} tutorInfoBody
 * @returns {Promise<TutorInfo>}
 */
const createTutorInfo = async (userId, tutorInfoBody) => {
  // Check if user exists and is a tutor
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (user.role !== USER_ROLES.TUTOR) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User is not a tutor');
  }

  // Check if tutor info already exists
  const existingInfo = await TutorInfo.findOne({ userId });
  if (existingInfo) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Tutor info already exists');
  }

  const tutorInfo = await TutorInfo.create({
    userId,
    ...tutorInfoBody,
  });

  return tutorInfo;
};

/**
 * Get tutor info by userId
 * @param {ObjectId} userId
 * @returns {Promise<TutorInfo>}
 */
const getTutorInfoByUserId = async (userId) => {
  const tutorInfo = await TutorInfo.findOne({ userId })
    .populate('userId', USER_DETAILED_SELECT_FIELDS);
  
  if (!tutorInfo) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Tutor info not found');
  }
  
  return tutorInfo;
};

/**
 * Update tutor info by userId
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<TutorInfo>}
 */
const updateTutorInfoByUserId = async (userId, updateBody) => {
  const tutorInfo = await TutorInfo.findOneAndUpdate({ userId }, updateBody, {
    new: true,
    runValidators: true,
  })
    .populate('userId', USER_DETAILED_SELECT_FIELDS);
  
  if (!tutorInfo) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Tutor info not found');
  }
  
  return tutorInfo;
};

/**
 * Delete tutor info by userId
 * @param {ObjectId} userId
 * @returns {Promise<TutorInfo>}
 */
const deleteTutorInfoByUserId = async (userId) => {
  const tutorInfo = await TutorInfo.findOneAndDelete({ userId });
  if (!tutorInfo) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Tutor info not found');
  }
  return tutorInfo;
};

module.exports = {
  createTutorInfo,
  getTutorInfoByUserId,
  updateTutorInfoByUserId,
  deleteTutorInfoByUserId,
};
