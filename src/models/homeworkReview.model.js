const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const reviewItemSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      trim: true,
    },
  },
  { _id: false }
);

const assignmentGradeSchema = mongoose.Schema(
  {
    taskId: {
      type: mongoose.SchemaTypes.ObjectId, 
      required: true,
    },
    result: {
      type: Number,
      min: 0,
      max: 100,
    },
    comment: {
      type: String,
      trim: true,
    },
  },
  { _id: false }
);

const homeworkReviewSchema = mongoose.Schema(
  {
    homeworkId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Homework',
      required: true,
    },
    overallRating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    reviews: [reviewItemSchema],
    assignmentGrades: [assignmentGradeSchema],
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
homeworkReviewSchema.plugin(toJSON);
homeworkReviewSchema.plugin(paginate);

/**
 * @typedef HomeworkReview
 */
const HomeworkReview = mongoose.model('HomeworkReview', homeworkReviewSchema);

module.exports = HomeworkReview;
