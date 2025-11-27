const Joi = require('joi');
const { objectId } = require('./custom.validation');

const assignmentGradeSchema = Joi.object().keys({
  taskId: Joi.string().custom(objectId).required(),
  result: Joi.number().min(0).max(100),
  comment: Joi.string(),
});

const createReview = {
  body: Joi.object().keys({
    assignmentID: Joi.string().custom(objectId).required(),
    assignmentGrades: Joi.array().items(assignmentGradeSchema),
  }),
};

const getReviews = {
  query: Joi.object().keys({
    assignmentID: Joi.string().custom(objectId),
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
