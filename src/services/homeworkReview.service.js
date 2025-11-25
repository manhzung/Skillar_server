const httpStatus = require('http-status');
const { HomeworkReview, Homework } = require('../models');
const ApiError = require('../utils/ApiError');
const { USER_SELECT_FIELDS } = require('../constants');

/**
 * Create a homework review
 * @param {Object} reviewBody
 * @returns {Promise<HomeworkReview>}
 */
const createHomeworkReview = async (reviewBody) => {
  // Verify homework exists
  const homework = await Homework.findById(reviewBody.homeworkId);
  if (!homework) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Homework not found');
  }

  // Check if review already exists for this homework
  const existingReview = await HomeworkReview.findOne({ homeworkId: reviewBody.homeworkId });
  if (existingReview) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Review already exists for this homework');
  }

  const review = await HomeworkReview.create(reviewBody);
  return review;
};

/**
 * Query for homework reviews
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
const queryHomeworkReviews = async (filter, options) => {
  // If studentId is provided, filter through homework
  if (filter.studentId) {
    // Find all homeworks matching the studentId
    const homeworks = await Homework.find({ studentId: filter.studentId }).select('_id');
    const homeworkIds = homeworks.map((homework) => homework._id);
    
    // Filter reviews by homeworkIds
    if (homeworkIds.length > 0) {
      filter.homeworkId = { $in: homeworkIds };
    } else {
      // If no homeworks found, return empty result
      filter.homeworkId = { $in: [] };
    }
    
    // Remove studentId from filter as it's not a direct field in HomeworkReview
    delete filter.studentId;
  }
  
  const reviews = await HomeworkReview.paginate(filter, options);
  return reviews;
};

/**
 * Get homework review by id
 * @param {ObjectId} id
 * @returns {Promise<HomeworkReview>}
 */
const getHomeworkReviewById = async (id) => {
  const review = await HomeworkReview.findById(id)
    .populate({
      path: 'homeworkId',
      populate: [
        {
          path: 'studentId',
          select: USER_SELECT_FIELDS,
        },
      ],
    });
  
  if (!review) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Homework review not found');
  }
  
  return review;
};

/**
 * Get homework review by homework id
 * @param {ObjectId} homeworkId
 * @returns {Promise<HomeworkReview>}
 */
const getHomeworkReviewByHomeworkId = async (homeworkId) => {
  return HomeworkReview.findOne({ homeworkId })
    .populate({
      path: 'homeworkId',
      populate: [
        {
          path: 'studentId',
          select: USER_SELECT_FIELDS,
        },
      ],
    });
};

/**
 * Update homework review by id
 * @param {ObjectId} reviewId
 * @param {Object} updateBody
 * @returns {Promise<HomeworkReview>}
 */
const updateHomeworkReviewById = async (reviewId, updateBody) => {
  const review = await HomeworkReview.findByIdAndUpdate(reviewId, updateBody, {
    new: true,
    runValidators: true,
  })
    .populate({
      path: 'homeworkId',
      populate: [
        {
          path: 'studentId',
          select: USER_SELECT_FIELDS,
        },
      ],
    });
  
  if (!review) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Homework review not found');
  }
  
  return review;
};

/**
 * Delete homework review by id
 * @param {ObjectId} reviewId
 * @returns {Promise<HomeworkReview>}
 */
const deleteHomeworkReviewById = async (reviewId) => {
  const review = await HomeworkReview.findByIdAndDelete(reviewId);
  if (!review) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Homework review not found');
  }
  return review;
};

module.exports = {
  createHomeworkReview,
  queryHomeworkReviews,
  getHomeworkReviewById,
  getHomeworkReviewByHomeworkId,
  updateHomeworkReviewById,
  deleteHomeworkReviewById,
};
