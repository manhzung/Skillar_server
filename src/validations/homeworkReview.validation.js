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

const createHomeworkReview = {
  body: Joi.object().keys({
    homeworkId: Joi.string().custom(objectId).required(),
    overallRating: Joi.number().integer().min(1).max(5).required(),
    reviews: Joi.array().items(reviewItemSchema),
    assignmentGrades: Joi.array().items(assignmentGradeSchema),
  }),
};

const getHomeworkReviews = {
  query: Joi.object().keys({
    homeworkId: Joi.string().custom(objectId),
    studentId: Joi.string().custom(objectId),
    tutorId: Joi.string().custom(objectId),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getHomeworkReview = {
  params: Joi.object().keys({
    homeworkReviewId: Joi.string().custom(objectId).required(),
  }),
};

const updateHomeworkReview = {
  params: Joi.object().keys({
    homeworkReviewId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object()
    .keys({
      overallRating: Joi.number().integer().min(1).max(5),
      reviews: Joi.array().items(reviewItemSchema),
      assignmentGrades: Joi.array().items(assignmentGradeSchema),
    })
    .min(1),
};

const deleteHomeworkReview = {
  params: Joi.object().keys({
    homeworkReviewId: Joi.string().custom(objectId).required(),
  }),
};

module.exports = {
  createHomeworkReview,
  getHomeworkReviews,
  getHomeworkReview,
  updateHomeworkReview,
  deleteHomeworkReview,
};
