const httpStatus = require('http-status');
const moment = require('moment');
const { Assignment, Schedule } = require('../models');
const ApiError = require('../utils/ApiError');
const { USER_SELECT_FIELDS } = require('../constants');

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
  // If studentId or tutorId is provided, filter through schedule
  if (filter.studentId || filter.tutorId) {
    const scheduleFilter = {};
    if (filter.studentId) {
      scheduleFilter.studentId = filter.studentId;
    }
    if (filter.tutorId) {
      scheduleFilter.tutorId = filter.tutorId;
    }
    
    // Find all schedules matching the studentId/tutorId
    const schedules = await Schedule.find(scheduleFilter).select('_id');
    const scheduleIds = schedules.map((schedule) => schedule._id);
    
    // Filter assignments by scheduleIds
    if (scheduleIds.length > 0) {
      filter.scheduleId = { $in: scheduleIds };
    } else {
      // If no schedules found, return empty result
      filter.scheduleId = { $in: [] };
    }
    
    // Remove studentId and tutorId from filter as they're not direct fields in Assignment
    delete filter.studentId;
    delete filter.tutorId;
  }
  
  // Handle name and subject search with regex (case-insensitive partial match)
  if (filter.name) {
    filter.name = { $regex: filter.name, $options: 'i' };
  }
  if (filter.subject) {
    filter.subject = { $regex: filter.subject, $options: 'i' };
  }
  
  // Handle date range filter (based on createdAt)
  if (filter.startDate || filter.endDate) {
    filter.createdAt = {};
    if (filter.startDate) {
      // Set start of day for startDate
      const startDate = new Date(filter.startDate);
      startDate.setHours(0, 0, 0, 0);
      filter.createdAt.$gte = startDate;
    }
    if (filter.endDate) {
      // Set end of day for endDate
      const endDate = new Date(filter.endDate);
      endDate.setHours(23, 59, 59, 999);
      filter.createdAt.$lte = endDate;
    }
    delete filter.startDate;
    delete filter.endDate;
  }
  
  const assignments = await Assignment.paginate(filter, options);
  return assignments;
};

/**
 * Get assignment by id
 * @param {ObjectId} id
 * @returns {Promise<Assignment>}
 */
const getAssignmentById = async (id) => {
  const assignment = await Assignment.findById(id)
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
  
  if (!assignment) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Assignment not found');
  }
  
  return assignment;
};

/**
 * Update assignment by id
 * @param {ObjectId} assignmentId
 * @param {Object} updateBody
 * @returns {Promise<Assignment>}
 */
const updateAssignmentById = async (assignmentId, updateBody) => {
  const assignment = await Assignment.findByIdAndUpdate(assignmentId, updateBody, {
    new: true,
    runValidators: true,
  })
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
  
  if (!assignment) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Assignment not found');
  }
  
  return assignment;
};

/**
 * Delete assignment by id
 * @param {ObjectId} assignmentId
 * @returns {Promise<Assignment>}
 */
const deleteAssignmentById = async (assignmentId) => {
  const assignment = await Assignment.findByIdAndDelete(assignmentId);
  if (!assignment) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Assignment not found');
  }
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
  
  const task = assignment.tasks.id(taskId);
  if (!task) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Task not found');
  }

  Object.assign(task, submitData);
  await assignment.save();
  
  return getAssignmentById(assignmentId);
};

/**
 * Get today's assignments statistics with task completion data
 * @returns {Promise<Object>}
 */
const getTodayAssignmentsStats = async () => {
  const now = moment();
  const startOfDay = now.clone().startOf('day').toDate();
  const endOfDay = now.clone().endOf('day').toDate();

  // Get all assignments updated today (created or updated)
  const todayAssignments = await Assignment.find({
    $or: [
      { createdAt: { $gte: startOfDay, $lte: endOfDay } },
      { updatedAt: { $gte: startOfDay, $lte: endOfDay } },
    ],
  })
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
    })
    .lean();

  // Process each assignment to calculate task completion
  const assignmentsWithStats = todayAssignments.map((assignment) => {
    const totalTasks = assignment.tasks ? assignment.tasks.length : 0;
    const completedTasks = assignment.tasks
      ? assignment.tasks.filter((task) => ['completed', 'submitted', 'graded'].includes(task.status)).length
      : 0;
    const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return {
      ...assignment,
      taskStats: {
        completed: completedTasks,
        total: totalTasks,
        percentage: completionPercentage,
      },
    };
  });

  // Group by subject and calculate statistics
  const subjectStats = {};
  assignmentsWithStats.forEach((assignment) => {
    const subject = assignment.subject || 'Không xác định';
    if (!subjectStats[subject]) {
      subjectStats[subject] = {
        subject,
        totalAssignments: 0,
        totalTasks: 0,
        completedTasks: 0,
        completionPercentage: 0,
      };
    }

    subjectStats[subject].totalAssignments++;
    subjectStats[subject].totalTasks += assignment.taskStats.total;
    subjectStats[subject].completedTasks += assignment.taskStats.completed;
  });

  // Calculate percentage for each subject
  Object.keys(subjectStats).forEach((subject) => {
    const stats = subjectStats[subject];
    stats.completionPercentage =
      stats.totalTasks > 0 ? Math.round((stats.completedTasks / stats.totalTasks) * 100) : 0;
  });

  // Convert to array and sort by subject name
  const subjectStatsArray = Object.values(subjectStats).sort((a, b) => a.subject.localeCompare(b.subject));

  return {
    assignments: assignmentsWithStats,
    subjectStats: subjectStatsArray,
  };
};

module.exports = {
  createAssignment,
  queryAssignments,
  getAssignmentById,
  updateAssignmentById,
  deleteAssignmentById,
  submitAssignmentTask,
  getTodayAssignmentsStats,
};
