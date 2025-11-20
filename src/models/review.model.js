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
    scheduleId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Schedule',
      required: true,
    },
    overallRating: {
      type: String,
      trim: true,
    },
    reviews: [reviewItemSchema],
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
