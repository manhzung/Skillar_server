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
      type: [String],
      default: [],
    },
    solutionUrl: {
      type: [String],
      default: [],
    },
    answerURL: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ['in-progress', 'submitted', 'late-submitted', 'undone'],
      default: 'in-progress',
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
    status: {
      type: String,
      enum: ['in-progress', 'completed', 'undone'],
      default: 'in-progress',
    },
    tasks: [homeworkDetailSchema],
  },
  {
    timestamps: true,
  }
);

// Pre-save middleware to auto-update homework status based on tasks
homeworkSchema.pre('save', function (next) {
  // Only update status if there are tasks
  if (this.tasks && this.tasks.length > 0) {
    const allSubmitted = this.tasks.every(
      (task) => task.status === 'submitted' || task.status === 'late-submitted'
    );
    const anyUndone = this.tasks.some((task) => task.status === 'undone');
    
    if (allSubmitted) {
      // All tasks submitted (on time or late) → homework completed
      this.status = 'completed';
    } else if (anyUndone) {
      // At least one task undone → homework undone
      this.status = 'undone';
    } else {
      // Otherwise → in progress
      this.status = 'in-progress';
    }
  }
  
  next();
});

// add plugin that converts mongoose to json
homeworkSchema.plugin(toJSON);
homeworkSchema.plugin(paginate);

/**
 * @typedef Homework
 */
const Homework = mongoose.model('Homework', homeworkSchema);

module.exports = Homework;
