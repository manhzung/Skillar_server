const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
const { ASSIGNMENT_STATUS, ASSIGNMENT_TASK_STATUS } = require('../constants');

const assignmentDetailSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    estimatedTime: {
      type: Number, // in minutes
      required: true,
    },
    actualTime: {
      type: Number, // in minutes
    },
    assignmentUrl: {
      type: String,
      trim: true,
    },
    solutionUrl: {
      type: String,
      trim: true,
    },
    answerURL: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: Object.values(ASSIGNMENT_TASK_STATUS),
      default: ASSIGNMENT_TASK_STATUS.PENDING,
    },
    description: {
      type: String,
      trim: true,
    },
  },
  { _id: true },
  {
    timestamps: true,
  }
);

const assignmentSchema = mongoose.Schema(
  {
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
    subject: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: Object.values(ASSIGNMENT_STATUS),
      default: ASSIGNMENT_STATUS.PENDING,
    },
    supplementaryMaterials: [
      {
        name: {
          type: String,
          required: true,
          trim: true,
        },
        url: {
          type: String,
          required: true,
          trim: true,
        },
        requirement: {
          type: String,
          trim: true,
        },
      },
    ],
    tasks: [assignmentDetailSchema],
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
assignmentSchema.plugin(toJSON);
assignmentSchema.plugin(paginate);

/**
 * @typedef Assignment
 */
const Assignment = mongoose.model('Assignment', assignmentSchema);

module.exports = Assignment;
