const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { scheduleService } = require('../services');

const createSchedule = catchAsync(async (req, res) => {
  const schedule = await scheduleService.createSchedule(req.body);
  res.status(httpStatus.CREATED).send(schedule);
});

const getSchedules = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['studentId', 'tutorId', 'subjectCode']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await scheduleService.querySchedules(filter, options);
  res.send(result);
});

const getSchedule = catchAsync(async (req, res) => {
  const schedule = await scheduleService.getScheduleById(req.params.scheduleId);
  if (!schedule) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Schedule not found');
  }
  res.send(schedule);
});

const updateSchedule = catchAsync(async (req, res) => {
  const schedule = await scheduleService.updateScheduleById(req.params.scheduleId, req.body);
  res.send(schedule);
});

const deleteSchedule = catchAsync(async (req, res) => {
  await scheduleService.deleteScheduleById(req.params.scheduleId);
  res.status(httpStatus.NO_CONTENT).send();
});

const getTodaySchedulesCount = catchAsync(async (req, res) => {
  const count = await scheduleService.countTodaySchedules();
  res.send({ count });
});

const getDashboardStats = catchAsync(async (req, res) => {
  const stats = await scheduleService.getDashboardStats();
  res.send(stats);
});

const getStudentsPerWeek = catchAsync(async (req, res) => {
  const weeks = parseInt(req.query.weeks, 10) || 4;
  const data = await scheduleService.getStudentsPerWeek(weeks);
  res.send(data);
});

const getSchedulesPerMonth = catchAsync(async (req, res) => {
  const months = parseInt(req.query.months, 10) || 6;
  const data = await scheduleService.getSchedulesPerMonth(months);
  res.send(data);
});

module.exports = {
  createSchedule,
  getSchedules,
  getSchedule,
  updateSchedule,
  deleteSchedule,
  getTodaySchedulesCount,
  getDashboardStats,
  getStudentsPerWeek,
  getSchedulesPerMonth,
};
