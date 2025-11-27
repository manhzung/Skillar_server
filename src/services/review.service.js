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
  // Verify assignment exists
  const assignment = await require('../models/assignment.model').findById(reviewBody.assignmentID);
  if (!assignment) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Assignment not found');
  }

  // Check if review already exists for this assignment
  const existingReview = await Review.findOne({ assignmentID: reviewBody.assignmentID });
  if (existingReview) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Review already exists for this assignment');
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
  // If studentId or tutorId is provided, filter through assignment -> schedule
  if (filter.studentId || filter.tutorId) {
    // Build schedule filter
    const scheduleFilter = {};
    if (filter.studentId) scheduleFilter.studentId = filter.studentId;
    if (filter.tutorId) scheduleFilter.tutorId = filter.tutorId;
    
    // Find all schedules matching the filter
    const schedules = await Schedule.find(scheduleFilter).select('_id');
    const scheduleIds = schedules.map((schedule) => schedule._id);
    
    // Find all assignments for those schedules
    const Assignment = require('../models/assignment.model');
    const assignments = await Assignment.find({ scheduleId: { $in: scheduleIds } }).select('_id');
    const assignmentIds = assignments.map((assignment) => assignment._id);
    
    // Filter reviews by assignmentIds
    if (assignmentIds.length > 0) {
      filter.assignmentID = { $in: assignmentIds };
    } else {
      // If no assignments found, return empty result
      filter.assignmentID = { $in: [] };
    }
    
    // Remove studentId and tutorId from filter as they're not direct fields in Review
    delete filter.studentId;
    delete filter.tutorId;
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
      path: 'assignmentID',
      populate: [
        {
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
        },
      ],
    });
  
  if (!review) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Review not found');
  }
  
  return review;
};

/**
 * Get review by assignment id
 * @param {ObjectId} assignmentID
 * @returns {Promise<Review>}
 */
const getReviewByAssignmentId = async (assignmentID) => {
  return Review.findOne({ assignmentID })
    .populate({
      path: 'assignmentID',
      populate: [
        {
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
      path: 'assignmentID',
      populate: [
        {
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
  getReviewByAssignmentId,
  updateReviewById,
  deleteReviewById,
};
