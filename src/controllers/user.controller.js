const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { userService, tokenService } = require('../services');

const createUser = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const getUsers = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  
  // Convert name filter to regex for partial matching (case-insensitive)
  if (filter.name) {
    filter.name = { $regex: filter.name, $options: 'i' };
  }
  
  const result = await userService.queryUsers(filter, options);
  res.send(result);
});

const getUser = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.userId);
  res.send(user);
});

const updateUser = catchAsync(async (req, res) => {
  const user = await userService.updateUserById(req.params.userId, req.body);
  res.send(user);
});

const deleteUser = catchAsync(async (req, res) => {
  await userService.deleteUserById(req.params.userId);
  res.status(httpStatus.NO_CONTENT).send();
});

const getAllUserStats = catchAsync(async (req, res) => {
  const total = await userService.countUsers();
  const byRole = await userService.countUsersByRole();

  res.send({
    total,
    ...byRole,
  });
});

const getStudentsPerGrade = catchAsync(async (req, res) => {
  const distribution = await userService.getStudentsPerGrade();
  res.send(distribution);
});

const getTutorsPerSubject = catchAsync(async (req, res) => {
  const distribution = await userService.getTutorsPerSubject();
  res.send(distribution);
});

const getLoggedInUserCount = catchAsync(async (req, res) => {
  const role = req.query.role;
  const count = await tokenService.countLoggedInUsers(role);
  res.send({ count });
});

const getStudentsByTutor = catchAsync(async (req, res) => {
  // If admin, can pass tutorId in query or params. If tutor, use own id.
  // For now, let's assume it's for the logged in tutor or specific tutorId if provided and admin
  let tutorId = req.user.id;
  if (req.user.role === 'admin' && req.query.tutorId) {
    tutorId = req.query.tutorId;
  }
  
  const students = await userService.getStudentsByTutorId(tutorId);
  res.send(students);
});

const getUserNamesAndIds = catchAsync(async (req, res) => {
  const role = req.query.role;
  const users = await userService.getUserNamesAndIds(role);
  res.send(users);
});

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  getAllUserStats,
  getStudentsPerGrade,
  getTutorsPerSubject,
  getLoggedInUserCount,
  getStudentsByTutor,
  getUserNamesAndIds,
};
