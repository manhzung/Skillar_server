const httpStatus = require('http-status');
const bcrypt = require('bcryptjs');
const { User } = require('../models');
const ApiError = require('../utils/ApiError');
const { USER_ROLES } = require('../constants');

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody) => {
  if (await User.isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  return User.create(userBody);
};

/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryUsers = async (filter, options) => {
  const users = await User.paginate(filter, options);
  return users;
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getUserById = async (id) => {
  const user = await User.findById(id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  return user;
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
const getUserByEmail = async (email) => {
  return User.findOne({ email });
};

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUserById = async (userId, updateBody) => {
  if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  
  // Hash password if it's being updated
  if (updateBody.password) {
    updateBody.password = await bcrypt.hash(updateBody.password, 8);
  }
  
  const user = await User.findByIdAndUpdate(userId, updateBody, {
    new: true,
    runValidators: true,
  });
  
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  
  return user;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
const deleteUserById = async (userId) => {
  const user = await User.findByIdAndDelete(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  return user;
};

/**
 * Count total users
 * @returns {Promise<number>}
 */
const countUsers = async () => {
  return User.countDocuments();
};

/**
 * Count users by role
 * @returns {Promise<Object>}
 */
const countUsersByRole = async () => {
  const roles = Object.values(USER_ROLES);
  const counts = {};

  await Promise.all(
    roles.map(async (role) => {
      counts[role] = await User.countDocuments({ role });
    })
  );

  return counts;
};

/**
 * Get students distribution by grade
 * @returns {Promise<Array>}
 */
const getStudentsPerGrade = async () => {
  const { StudentInfo } = require('../models');
  
  const distribution = await StudentInfo.aggregate([
    {
      $match: {
        grade: { $exists: true, $ne: null, $ne: '' }
      }
    },
    {
      $group: {
        _id: '$grade',
        count: { $sum: 1 }
      }
    },
    {
      $sort: { _id: 1 }
    },
    {
      $project: {
        _id: 0,
        grade: '$_id',
        studentCount: '$count'
      }
    }
  ]);

  return distribution;
};

/**
 * Get tutors distribution by subject
 * @returns {Promise<Array>}
 */
const getTutorsPerSubject = async () => {
  const { TutorInfo } = require('../models');
  
  const distribution = await TutorInfo.aggregate([
    {
      $match: {
        subjects: { $exists: true, $ne: [] }
      }
    },
    {
      $unwind: '$subjects'
    },
    {
      $group: {
        _id: '$subjects',
        count: { $sum: 1 }
      }
    },
    {
      $sort: { count: -1 }
    },
    {
      $project: {
        _id: 0,
        subject: '$_id',
        tutorCount: '$count'
      }
    }
  ]);

  return distribution;
};

/**
 * Get students taught by a tutor
 * @param {ObjectId} tutorId
 * @returns {Promise<Array>}
 */
const getStudentsByTutorId = async (tutorId) => {
  const { Schedule, StudentInfo } = require('../models');

  // Find all distinct studentIds from schedules where tutorId matches
  const studentIds = await Schedule.distinct('studentId', { tutorId });

  if (!studentIds.length) {
    return [];
  }

  // Fetch User details for these students
  const students = await User.find({ _id: { $in: studentIds } }).lean();

  // Fetch StudentInfo details for these students
  const studentInfos = await StudentInfo.find({ userId: { $in: studentIds } }).lean();

  // Merge User and StudentInfo
  const result = students.map((student) => {
    const info = studentInfos.find((info) => info.userId.toString() === student._id.toString());
    return {
      ...student,
      studentInfo: info || null,
    };
  });

  return result;
};

module.exports = {
  createUser,
  queryUsers,
  getUserById,
  getUserByEmail,
  updateUserById,
  deleteUserById,
  countUsers,
  countUsersByRole,
  getStudentsPerGrade,
  getTutorsPerSubject,
  getStudentsByTutorId,
};
