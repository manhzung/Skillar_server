const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

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
      enum: ['pending', 'in-progress', 'submitted', 'undone'],
      default: 'pending',
    },
    description: {
      type: String,
      trim: true,
    },
    note: {
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
      enum: ['pending', 'in-progress', 'completed'],
      default: 'pending',
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

// Pre-save middleware to auto-update assignment status based on tasks
assignmentSchema.pre('save', function (next) {
  // Only update status if there are tasks
  if (this.tasks && this.tasks.length > 0) {
    const allSubmitted = this.tasks.every((task) => task.status === 'submitted');
    const anyInProgress = this.tasks.some((task) => task.status === 'in-progress');
    
    if (allSubmitted) {
      // All tasks submitted -> assignment completed
      this.status = 'completed';
    } else if (anyInProgress) {
      // At least one task in progress -> assignment in progress
      this.status = 'in-progress';
    }
    // If all tasks are pending/undone, keep status as is (usually 'pending')
  }
  
  next();
});

// add plugin that converts mongoose to json
assignmentSchema.plugin(toJSON);
assignmentSchema.plugin(paginate);

/**
 * @typedef Assignment
 */
const Assignment = mongoose.model('Assignment', assignmentSchema);

module.exports = Assignment;
