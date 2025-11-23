const moment = require('moment');
const httpStatus = require('http-status');
const { Schedule } = require('../models');
const ApiError = require('../utils/ApiError');
const { generateMeetingUrl } = require('../utils/jitsi');

/**
 * Create a schedule
 * @param {Object} scheduleBody
 * @returns {Promise<Schedule>}
 */
const createSchedule = async (scheduleBody) => {
  // Auto-generate Jitsi meeting URL if not provided
  if (!scheduleBody.meetingURL) {
    scheduleBody.meetingURL = generateMeetingUrl({
      date: scheduleBody.startTime,
      prefix: 'skillar-lesson',
    });
  }
  
  return Schedule.create(scheduleBody);
};

/**
 * Query for schedules
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const querySchedules = async (filter, options) => {
  const schedules = await Schedule.paginate(filter, options);
  return schedules;
};

/**
 * Get schedule by id
 * @param {ObjectId} id
 * @returns {Promise<Schedule>}
 */
const getScheduleById = async (id) => {
  return Schedule.findById(id);
};

/**
 * Update schedule by id
 * @param {ObjectId} scheduleId
 * @param {Object} updateBody
 * @returns {Promise<Schedule>}
 */
const updateScheduleById = async (scheduleId, updateBody) => {
  const schedule = await getScheduleById(scheduleId);
  if (!schedule) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Schedule not found');
  }
  Object.assign(schedule, updateBody);
  await schedule.save();
  return schedule;
};

/**
 * Delete schedule by id
 * @param {ObjectId} scheduleId
 * @returns {Promise<Schedule>}
 */
const deleteScheduleById = async (scheduleId) => {
  const schedule = await getScheduleById(scheduleId);
  if (!schedule) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Schedule not found');
  }
  await schedule.remove();
  return schedule;
};

/**
 * Count schedules for today
 * @returns {Promise<number>}
 */
const countTodaySchedules = async () => {
  const startOfDay = moment().startOf('day').toDate();
  const endOfDay = moment().endOf('day').toDate();

  return Schedule.countDocuments({
    startTime: {
      $gte: startOfDay,
      $lte: endOfDay,
    },
  });
};

/**
 * Get dashboard statistics
 * @returns {Promise<Object>}
 */
const getDashboardStats = async () => {
  const { User } = require('../models');
  
  // Total schedules
  const totalSchedules = await Schedule.countDocuments();
  
  // Total students
  const totalStudents = await User.countDocuments({ role: 'student' });
  
  // Total tutors
  const totalTutors = await User.countDocuments({ role: 'tutor' });
  
  // Students who have participated (distinct studentIds in schedules)
  const activeStudents = await Schedule.distinct('studentId');  
  
  return {
    totalSchedules,
    totalStudents,
    totalTutors,
    studentsParticipated: activeStudents.length,
  };
};

/**
 * Get students count per week for last n weeks
 * @param {number} weeks - Number of weeks to get stats for
 * @returns {Promise<Array>}
 */
const getStudentsPerWeek = async (weeks = 4) => {
  const weeksData = [];
  
  for (let i = 0; i < weeks; i++) {
    const weekStart = moment().subtract(i, 'weeks').startOf('week').toDate();
    const weekEnd = moment().subtract(i, 'weeks').endOf('week').toDate();
    
    // Get distinct students who had schedules in this week
    const students = await Schedule.distinct('studentId', {
      startTime: {
        $gte: weekStart,
        $lte: weekEnd,
      },
    });
    
    weeksData.unshift({
      week: moment(weekStart).format('YYYY-WW'),
      weekStart: weekStart,
      weekEnd: weekEnd,
      studentCount: students.length,
    });
  }
  
  return weeksData;
};

/**
 * Get schedules count per month for last n months
 * @param {number} months - Number of months to get stats for
 * @returns {Promise<Array>}
 */
const getSchedulesPerMonth = async (months = 6) => {
  const monthsData = [];
  
  for (let i = 0; i < months; i++) {
    const monthStart = moment().subtract(i, 'months').startOf('month').toDate();
    const monthEnd = moment().subtract(i, 'months').endOf('month').toDate();
    
    const count = await Schedule.countDocuments({
      startTime: {
        $gte: monthStart,
        $lte: monthEnd,
      },
    });
    
    monthsData.unshift({
      month: moment(monthStart).format('YYYY-MM'),
      monthStart: monthStart,
      monthEnd: monthEnd,
      scheduleCount: count,
    });
  }
  
  return monthsData;
};

module.exports = {
  createSchedule,
  querySchedules,
  getScheduleById,
  updateScheduleById,
  deleteScheduleById,
  countTodaySchedules,
  getDashboardStats,
  getStudentsPerWeek,
  getSchedulesPerMonth,
};
