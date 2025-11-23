const httpStatus = require('http-status');
const { Review, Schedule } = require('../models');
const ApiError = require('../utils/ApiError');

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
  const reviews = await Review.paginate(filter, options);
  return reviews;
};

/**
 * Get review by id
 * @param {ObjectId} id
 * @returns {Promise<Review>}
 */
const getReviewById = async (id) => {
  return Review.findById(id).populate('scheduleId');
};

/**
 * Get review by schedule id
 * @param {ObjectId} scheduleId
 * @returns {Promise<Review>}
 */
const getReviewByScheduleId = async (scheduleId) => {
  return Review.findOne({ scheduleId }).populate('scheduleId');
};

/**
 * Update review by id
 * @param {ObjectId} reviewId
 * @param {Object} updateBody
 * @returns {Promise<Review>}
 */
const updateReviewById = async (reviewId, updateBody) => {
  const review = await getReviewById(reviewId);
  if (!review) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Review not found');
  }

  Object.assign(review, updateBody);
  await review.save();
  return review;
};

/**
 * Delete review by id
 * @param {ObjectId} reviewId
 * @returns {Promise<Review>}
 */
const deleteReviewById = async (reviewId) => {
  const review = await getReviewById(reviewId);
  if (!review) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Review not found');
  }
  await review.remove();
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
