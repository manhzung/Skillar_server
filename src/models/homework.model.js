const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const homeworkDetailSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    assignmentUrl: {
      type: String,
      trim: true,
    },
    solutionUrl: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['pending', 'submitted', 'graded'],
      default: 'pending',
    },
    description: {
      type: String,
      trim: true,
    },
  },
  { _id: true }
);

const homeworkSchema = mongoose.Schema(
  {
    studentId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
    },
    scheduleId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Schedule',
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    deadline: {
      type: Date,
      required: true,
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard', 'advanced'],
      trim: true,
    },
    subject: {
      type: String,
      trim: true,
    },
    tasks: [homeworkDetailSchema],
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
homeworkSchema.plugin(toJSON);
homeworkSchema.plugin(paginate);

/**
 * @typedef Homework
 */
const Homework = mongoose.model('Homework', homeworkSchema);

module.exports = Homework;
