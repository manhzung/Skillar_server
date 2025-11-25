const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const studentInfoSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    school: {
      type: String,
      trim: true,
    },
    grade: {
      type: String,
      trim: true,
    },
    parent1Name: {
      type: String,
      trim: true,
    },
    parent1Email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    parent1Number: {
      type: String,
      trim: true,
    },
    parent1Request: {
      type: String,
      trim: true,
    },
    parent2Name: {
      type: String,
      trim: true,
    },
    parent2Email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    parent2Number: {
      type: String,
      trim: true,
    },
    parent2Request: {
      type: String,
      trim: true,
    },
    academicLevel: {
      type: String,
      trim: true,
    },
    hobbies: {
      type: [String],
      default: [],
    },
    favoriteSubjects: {
      type: [String],
      default: [],
    },
    strengths: {
      type: [String],
      default: [],
    },
    improvements: {
      type: [String],
      default: [],
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
studentInfoSchema.plugin(toJSON);
studentInfoSchema.plugin(paginate);

/**
 * @typedef StudentInfo
 */
const StudentInfo = mongoose.model('StudentInfo', studentInfoSchema);

module.exports = StudentInfo;
