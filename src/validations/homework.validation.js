const Joi = require('joi');
const { objectId } = require('./custom.validation');

const taskSchema = Joi.object().keys({
  name: Joi.string().required(),
  assignmentUrl: Joi.string(),
  solutionUrl: Joi.string(),
  answerURL: Joi.string(),
  status: Joi.string().valid('in-progress', 'submitted', 'undone'),
  description: Joi.string(),
});

const createHomework = {
  body: Joi.object().keys({
    studentId: Joi.string().custom(objectId).required(),
    scheduleId: Joi.string().custom(objectId).required(),
    name: Joi.string().required(),
    description: Joi.string(),
    deadline: Joi.date().required(),
    difficulty: Joi.string().valid('easy', 'medium', 'hard', 'advanced'),
    subject: Joi.string(),
    status: Joi.string().valid('in-progress', 'completed', 'undone'),
    tasks: Joi.array().items(taskSchema),
  }),
};

const getHomeworks = {
  query: Joi.object().keys({
    studentId: Joi.string().custom(objectId),
    scheduleId: Joi.string().custom(objectId),
    subject: Joi.string(),
    status: Joi.string().valid('in-progress', 'completed', 'undone'),
    difficulty: Joi.string().valid('easy', 'medium', 'hard', 'advanced'),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getHomework = {
  params: Joi.object().keys({
    homeworkId: Joi.string().custom(objectId).required(),
  }),
};

const updateHomework = {
  params: Joi.object().keys({
    homeworkId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string(),
      description: Joi.string(),
      deadline: Joi.date(),
      difficulty: Joi.string().valid('easy', 'medium', 'hard', 'advanced'),
      subject: Joi.string(),
      status: Joi.string().valid('in-progress', 'completed', 'undone'),
      tasks: Joi.array().items(taskSchema),
    })
    .min(1),
};

const deleteHomework = {
  params: Joi.object().keys({
    homeworkId: Joi.string().custom(objectId).required(),
  }),
};

const submitTask = {
  params: Joi.object().keys({
    homeworkId: Joi.string().custom(objectId).required(),
    taskId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object().keys({
    solutionUrl: Joi.string(),
    answerURL: Joi.string(),
    status: Joi.string().valid('submitted'),
    description: Joi.string(),
  }),
};

module.exports = {
  createHomework,
  getHomeworks,
  getHomework,
  updateHomework,
  deleteHomework,
  submitTask,
};
