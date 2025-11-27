const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const assignmentReviewSchema = mongoose.Schema(
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

const reviewSchema = mongoose.Schema(
  {
    assignmentID: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Assignment',
      required: true,
    },
    assignmentGrades: [assignmentReviewSchema],
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
reviewSchema.plugin(toJSON);
reviewSchema.plugin(paginate);

/**
 * @typedef Review
 */
const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
