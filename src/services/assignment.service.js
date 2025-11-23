const httpStatus = require('http-status');
const { Assignment, Schedule } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create an assignment
 * @param {Object} assignmentBody
 * @returns {Promise<Assignment>}
 */
const createAssignment = async (assignmentBody) => {
  // Verify schedule exists
  const schedule = await Schedule.findById(assignmentBody.scheduleId);
  if (!schedule) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Schedule not found');
  }

  const assignment = await Assignment.create(assignmentBody);
  return assignment;
};

/**
 * Query for assignments
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
const queryAssignments = async (filter, options) => {
  const assignments = await Assignment.paginate(filter, options);
  return assignments;
};

/**
 * Get assignment by id
 * @param {ObjectId} id
 * @returns {Promise<Assignment>}
 */
const getAssignmentById = async (id) => {
  return Assignment.findById(id).populate('scheduleId');
};

/**
 * Update assignment by id
 * @param {ObjectId} assignmentId
 * @param {Object} updateBody
 * @returns {Promise<Assignment>}
 */
const updateAssignmentById = async (assignmentId, updateBody) => {
  const assignment = await getAssignmentById(assignmentId);
  if (!assignment) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Assignment not found');
  }

  Object.assign(assignment, updateBody);
  await assignment.save();
  return assignment;
};

/**
 * Delete assignment by id
 * @param {ObjectId} assignmentId
 * @returns {Promise<Assignment>}
 */
const deleteAssignmentById = async (assignmentId) => {
  const assignment = await getAssignmentById(assignmentId);
  if (!assignment) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Assignment not found');
  }
  await assignment.remove();
  return assignment;
};

/**
 * Submit assignment task (student)
 * @param {ObjectId} assignmentId
 * @param {ObjectId} taskId
 * @param {Object} submitData
 * @returns {Promise<Assignment>}
 */
const submitAssignmentTask = async (assignmentId, taskId, submitData) => {
  const assignment = await getAssignmentById(assignmentId);
  if (!assignment) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Assignment not found');
  }

  const task = assignment.tasks.id(taskId);
  if (!task) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Task not found');
  }

  Object.assign(task, submitData);
  await assignment.save();
  return assignment;
};

module.exports = {
  createAssignment,
  queryAssignments,
  getAssignmentById,
  updateAssignmentById,
  deleteAssignmentById,
  submitAssignmentTask,
};
