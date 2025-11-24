const httpStatus = require('http-status');
const { Review, Schedule } = require('../models');
const ApiError = require('../utils/ApiError');
const { USER_SELECT_FIELDS } = require('../constants');

/**
 * Create a review
 * @param {Object} reviewBody
 * @returns {Promise<Review>}
 */
const createReview = async (reviewBody) => {
  // Verify schedule exists
  const schedule = await Schedule.findById(reviewBody.scheduleId);
  if (!schedule) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Schedule not found');
  }

  // Check if review already exists for this schedule
  const existingReview = await Review.findOne({ scheduleId: reviewBody.scheduleId });
  if (existingReview) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Review already exists for this schedule');
  }

  const review = await Review.create(reviewBody);
  return review;
};

/**
 * Query for reviews
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
const queryReviews = async (filter, options) => {
  // If studentId is provided, filter through schedule
  if (filter.studentId) {
    // Find all schedules matching the studentId
    const schedules = await Schedule.find({ studentId: filter.studentId }).select('_id');
    const scheduleIds = schedules.map((schedule) => schedule._id);
    
    // Filter reviews by scheduleIds
    if (scheduleIds.length > 0) {
      filter.scheduleId = { $in: scheduleIds };
    } else {
      // If no schedules found, return empty result
      filter.scheduleId = { $in: [] };
    }
    
    // Remove studentId from filter as it's not a direct field in Review
    delete filter.studentId;
  }
  
  const reviews = await Review.paginate(filter, options);
  return reviews;
};

/**
 * Get review by id
 * @param {ObjectId} id
 * @returns {Promise<Review>}
 */
const getReviewById = async (id) => {
  const review = await Review.findById(id)
    .populate({
      path: 'scheduleId',
      populate: [
        {
          path: 'studentId',
          select: USER_SELECT_FIELDS,
        },
        {
          path: 'tutorId',
          select: USER_SELECT_FIELDS,
        },
      ],
    });
  
  if (!review) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Review not found');
  }
  
  return review;
};

/**
 * Get review by schedule id
 * @param {ObjectId} scheduleId
 * @returns {Promise<Review>}
 */
const getReviewByScheduleId = async (scheduleId) => {
  return Review.findOne({ scheduleId })
    .populate({
      path: 'scheduleId',
      populate: [
        {
          path: 'studentId',
          select: USER_SELECT_FIELDS,
        },
        {
          path: 'tutorId',
          select: USER_SELECT_FIELDS,
        },
      ],
    });
};

/**
 * Update review by id
 * @param {ObjectId} reviewId
 * @param {Object} updateBody
 * @returns {Promise<Review>}
 */
const updateReviewById = async (reviewId, updateBody) => {
  const review = await Review.findByIdAndUpdate(reviewId, updateBody, {
    new: true,
    runValidators: true,
  })
    .populate({
      path: 'scheduleId',
      populate: [
        {
          path: 'studentId',
          select: USER_SELECT_FIELDS,
        },
        {
          path: 'tutorId',
          select: USER_SELECT_FIELDS,
        },
      ],
    });
  
  if (!review) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Review not found');
  }
  
  return review;
};

/**
 * Delete review by id
 * @param {ObjectId} reviewId
 * @returns {Promise<Review>}
 */
const deleteReviewById = async (reviewId) => {
  const review = await Review.findByIdAndDelete(reviewId);
  if (!review) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Review not found');
  }
  return review;
};

module.exports = {
  createReview,
  queryReviews,
  getReviewById,
  getReviewByScheduleId,
  updateReviewById,
  deleteReviewById,
};
