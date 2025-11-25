const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { homeworkReviewService } = require('../services');

const createHomeworkReview = catchAsync(async (req, res) => {
  const review = await homeworkReviewService.createHomeworkReview(req.body);
  res.status(httpStatus.CREATED).send(review);
});

const getHomeworkReviews = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['homeworkId', 'studentId']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await homeworkReviewService.queryHomeworkReviews(filter, options);
  res.send(result);
});

const getHomeworkReview = catchAsync(async (req, res) => {
  const review = await homeworkReviewService.getHomeworkReviewById(req.params.homeworkReviewId);
  res.send(review);
});

const updateHomeworkReview = catchAsync(async (req, res) => {
  const review = await homeworkReviewService.updateHomeworkReviewById(req.params.homeworkReviewId, req.body);
  res.send(review);
});

const deleteHomeworkReview = catchAsync(async (req, res) => {
  await homeworkReviewService.deleteHomeworkReviewById(req.params.homeworkReviewId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createHomeworkReview,
  getHomeworkReviews,
  getHomeworkReview,
  updateHomeworkReview,
  deleteHomeworkReview,
};
