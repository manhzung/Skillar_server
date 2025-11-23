const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const tutorInfoSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    subjects: {
      type: [String],
      default: [],
    },
    experience: {
      type: String,
      trim: true,
    },
    qualification: {
      type: String,
      trim: true,
    },
    specialties: {
      type: [String],
      default: [],
    },
    bio: {
      type: String,
      trim: true,
    },
    cvUrl: {
      type: String,
      trim: true,
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    totalStudents: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
tutorInfoSchema.plugin(toJSON);
tutorInfoSchema.plugin(paginate);

/**
 * @typedef TutorInfo
 */
const TutorInfo = mongoose.model('TutorInfo', tutorInfoSchema);

module.exports = TutorInfo;
