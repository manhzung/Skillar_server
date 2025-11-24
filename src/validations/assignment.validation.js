const Joi = require('joi');
const { objectId } = require('./custom.validation');

const taskSchema = Joi.object().keys({
  name: Joi.string().required(),
  estimatedTime: Joi.number().integer().min(1).required(),
  actualTime: Joi.number().integer().min(0),
  assignmentUrl: Joi.string(),
  solutionUrl: Joi.string(),
  status: Joi.string().valid('pending', 'in-progress', 'completed', 'submitted', 'graded'),
  description: Joi.string(),
});

const createAssignment = {
  body: Joi.object().keys({
    scheduleId: Joi.string().custom(objectId).required(),
    name: Joi.string().required(),
    description: Joi.string(),
    subject: Joi.string(),
    status: Joi.string().valid('pending', 'in-progress', 'completed'),
    tasks: Joi.array().items(taskSchema),
  }),
};

const getAssignments = {
  query: Joi.object().keys({
    scheduleId: Joi.string().custom(objectId),
    studentId: Joi.string().custom(objectId),
    subject: Joi.string(),
    status: Joi.string().valid('pending', 'in-progress', 'completed'),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getAssignment = {
  params: Joi.object().keys({
    assignmentId: Joi.string().custom(objectId).required(),
  }),
};

const updateAssignment = {
  params: Joi.object().keys({
    assignmentId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string(),
      description: Joi.string(),
      subject: Joi.string(),
      status: Joi.string().valid('pending', 'in-progress', 'completed'),
      tasks: Joi.array().items(taskSchema),
    })
    .min(1),
};

const deleteAssignment = {
  params: Joi.object().keys({
    assignmentId: Joi.string().custom(objectId).required(),
  }),
};

const submitTask = {
  params: Joi.object().keys({
    assignmentId: Joi.string().custom(objectId).required(),
    taskId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object().keys({
    actualTime: Joi.number().integer().min(0),
    solutionUrl: Joi.string(),
    status: Joi.string().valid('submitted'),
    description: Joi.string(),
  }),
};

module.exports = {
  createAssignment,
  getAssignments,
  getAssignment,
  updateAssignment,
  deleteAssignment,
  submitTask,
};
