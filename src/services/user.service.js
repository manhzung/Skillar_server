const httpStatus = require('http-status');
const { User } = require('../models');
const ApiError = require('../utils/ApiError');

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
  return User.findById(id);
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
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
const deleteUserById = async (userId) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  await user.remove();
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
  const roles = ['student', 'parent', 'tutor', 'admin'];
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
};
