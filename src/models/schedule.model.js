const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
const { SCHEDULE_STATUS } = require('../constants');

const scheduleSchema = mongoose.Schema(
  {
    startTime: {
      type: Date,
      required: true,
    },
    duration: {
      type: Number, // in minutes
      required: true,
    },
    subjectCode: {
      type: String,
      required: true,
      trim: true,
    },
    studentId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
    },
    tutorId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
    },
    meetingURL: {
      type: String,
      trim: true,
    },
    note: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: Object.values(SCHEDULE_STATUS),
      default: SCHEDULE_STATUS.UPCOMING,
    },
    reportURL: {
      type: String,
      trim: true,
    },
    supplementaryMaterials: [
      {
        name: {
          type: String,
          required: true,
          trim: true,
        },
        documentURL: {
          type: String,
          required: true,
          trim: true,
        },
        description: {
          type: String,
          trim: true,
        },
      },
    ],
    overallRating: {
      type: String,
      trim: true,
    },
    reviews: [
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
    ],
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
scheduleSchema.plugin(toJSON);
scheduleSchema.plugin(paginate);

/**
 * @typedef Schedule
 */
const Schedule = mongoose.model('Schedule', scheduleSchema);

module.exports = Schedule;
