const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { homeworkService } = require('../services');

const createHomework = catchAsync(async (req, res) => {
  const homework = await homeworkService.createHomework(req.body);
  res.status(httpStatus.CREATED).send(homework);
});

const getHomeworks = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['studentId', 'scheduleId', 'subject', 'difficulty']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await homeworkService.queryHomeworks(filter, options);
  res.send(result);
});

const getHomework = catchAsync(async (req, res) => {
  const homework = await homeworkService.getHomeworkById(req.params.homeworkId);
  if (!homework) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Homework not found');
  }
  res.send(homework);
});

const updateHomework = catchAsync(async (req, res) => {
  const homework = await homeworkService.updateHomeworkById(req.params.homeworkId, req.body);
  res.send(homework);
});

const deleteHomework = catchAsync(async (req, res) => {
  await homeworkService.deleteHomeworkById(req.params.homeworkId);
  res.status(httpStatus.NO_CONTENT).send();
});

const submitTask = catchAsync(async (req, res) => {
  const homework = await homeworkService.submitHomeworkTask(
    req.params.homeworkId,
    req.params.taskId,
    req.body
  );
  res.send(homework);
});

module.exports = {
  createHomework,
  getHomeworks,
  getHomework,
  updateHomework,
  deleteHomework,
  submitTask,
};
