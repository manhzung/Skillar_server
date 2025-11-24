const Joi = require('joi');
const { objectId } = require('./custom.validation');

const reviewItemSchema = Joi.object().keys({
  name: Joi.string().required(),
  rating: Joi.number().integer().min(1).max(5).required(),
  comment: Joi.string(),
});

const assignmentGradeSchema = Joi.object().keys({
  taskId: Joi.string().custom(objectId).required(),
  result: Joi.number().min(0).max(100),
  comment: Joi.string(),
});

const createReview = {
  body: Joi.object().keys({
    scheduleId: Joi.string().custom(objectId).required(),
    overallRating: Joi.string(),
    reviews: Joi.array().items(reviewItemSchema),
    assignmentGrades: Joi.array().items(assignmentGradeSchema),
  }),
};

const getReviews = {
  query: Joi.object().keys({
    scheduleId: Joi.string().custom(objectId),
    studentId: Joi.string().custom(objectId),
    tutorId: Joi.string().custom(objectId),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getReview = {
  params: Joi.object().keys({
    reviewId: Joi.string().custom(objectId).required(),
  }),
};

const updateReview = {
  params: Joi.object().keys({
    reviewId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object()
    .keys({
      overallRating: Joi.string(),
      reviews: Joi.array().items(reviewItemSchema),
      assignmentGrades: Joi.array().items(assignmentGradeSchema),
    })
    .min(1),
};

const deleteReview = {
  params: Joi.object().keys({
    reviewId: Joi.string().custom(objectId).required(),
  }),
};

module.exports = {
  createReview,
  getReviews,
  getReview,
  updateReview,
  deleteReview,
};
