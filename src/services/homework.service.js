const httpStatus = require('http-status');
const { Homework, Schedule, User } = require('../models');
const ApiError = require('../utils/ApiError');
const { USER_ROLES, USER_SELECT_FIELDS } = require('../constants');

/**
 * Create homework
 * @param {Object} homeworkBody
 * @returns {Promise<Homework>}
 */
const createHomework = async (homeworkBody) => {
  // Verify schedule and student exist
  const schedule = await Schedule.findById(homeworkBody.scheduleId);
  if (!schedule) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Schedule not found');
  }

  const student = await User.findById(homeworkBody.studentId);
  if (!student) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Student not found');
  }

  if (student.role !== USER_ROLES.STUDENT) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User is not a student');
  }

  const homework = await Homework.create(homeworkBody);
  return homework;
};

/**
 * Query for homeworks
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
const queryHomeworks = async (filter, options) => {
  const homeworks = await Homework.paginate(filter, options);
  return homeworks;
};

/**
 * Get homework by id
 * @param {ObjectId} id
 * @returns {Promise<Homework>}
 */
const getHomeworkById = async (id) => {
  const homework = await Homework.findById(id)
    .populate('studentId', USER_SELECT_FIELDS)
    .populate({
      path: 'scheduleId',
      populate: [
        {
          path: 'studentId',
          select: USER_SELECT_FIELDS,
        },
        {
          path: 'tutorId',
          select: USER_SELECT_FIELDS,
        },
      ],
    });
  
  if (!homework) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Homework not found');
  }
  
  return homework;
};

/**
 * Update homework by id
 * @param {ObjectId} homeworkId
 * @param {Object} updateBody
 * @returns {Promise<Homework>}
 */
const updateHomeworkById = async (homeworkId, updateBody) => {
  const homework = await Homework.findByIdAndUpdate(homeworkId, updateBody, {
    new: true,
    runValidators: true,
  })
    .populate('studentId', USER_SELECT_FIELDS)
    .populate({
      path: 'scheduleId',
      populate: [
        {
          path: 'studentId',
          select: USER_SELECT_FIELDS,
        },
        {
          path: 'tutorId',
          select: USER_SELECT_FIELDS,
        },
      ],
    });
  
  if (!homework) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Homework not found');
  }
  
  return homework;
};

/**
 * Delete homework by id
 * @param {ObjectId} homeworkId
 * @returns {Promise<Homework>}
 */
const deleteHomeworkById = async (homeworkId) => {
  const homework = await Homework.findByIdAndDelete(homeworkId);
  if (!homework) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Homework not found');
  }
  return homework;
};

/**
 * Submit homework task (student)
 * @param {ObjectId} homeworkId
 * @param {ObjectId} taskId
 * @param {Object} submitData
 * @returns {Promise<Homework>}
 */
const submitHomeworkTask = async (homeworkId, taskId, submitData) => {
  const homework = await getHomeworkById(homeworkId);
  
  const task = homework.tasks.id(taskId);
  if (!task) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Task not found');
  }

  Object.assign(task, submitData);
  
  // Auto-update status to 'submitted' when answerURL is provided
  if (submitData.answerURL && submitData.answerURL.trim() !== '') {
    task.status = 'submitted';
  }
  
  await homework.save();  // This triggers pre-save hook to update homework status
  
  return getHomeworkById(homeworkId);
};

module.exports = {
  createHomework,
  queryHomeworks,
  getHomeworkById,
  updateHomeworkById,
  deleteHomeworkById,
  submitHomeworkTask,
};
