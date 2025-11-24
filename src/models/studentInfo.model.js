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
    parentName: {
      type: String,
      trim: true,
    },
    parentEmail: {
      type: String,
      trim: true,
      lowercase: true,
    },
    parentNumber: {
      type: String,
      trim: true,
    },
    parentRequest: {
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
