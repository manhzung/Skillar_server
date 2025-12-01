const moment = require('moment-timezone');
const httpStatus = require('http-status');
const { Schedule, Assignment, Homework } = require('../models');
const ApiError = require('../utils/ApiError');
const { generateMeetingUrl, generateMeetingUrlWithConfig } = require('../utils/jitsi');
const { USER_SELECT_FIELDS, USER_ROLES, SCHEDULE_STATUS } = require('../constants');

/**
 * Create a schedule
 * @param {Object} scheduleBody
 * @returns {Promise<Schedule>}
 */
const createSchedule = async (scheduleBody) => {
  // Auto-generate Jitsi meeting URL if not provided
  if (!scheduleBody.meetingURL) {
    scheduleBody.meetingURL = generateMeetingUrlWithConfig({
      date: scheduleBody.startTime,
      prefix: 'skillar-lesson',
      requireModerator: false, // Không yêu cầu moderator phải vào trước
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
  const schedule = await Schedule.findById(id)
    .populate('studentId', USER_SELECT_FIELDS)
    .populate('tutorId', USER_SELECT_FIELDS);
  
  if (!schedule) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Schedule not found');
  }
  
  return schedule;
};

/**
 * Update schedule by id
 * @param {ObjectId} scheduleId
 * @param {Object} updateBody
 * @param {Object} user - Current user
 * @returns {Promise<Schedule>}
 */
const updateScheduleById = async (scheduleId, updateBody, user) => {
  const schedule = await getScheduleById(scheduleId);

  if (!schedule) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Schedule not found');
  }

  // Check authorization
  if (user.role !== 'admin') {
    if (user.role === 'tutor' && schedule.tutorId.id !== user.id) {
      throw new ApiError(httpStatus.FORBIDDEN, 'You are not authorized to update this schedule');
    }
    if (user.role === 'student' && schedule.studentId.id !== user.id) {
      throw new ApiError(httpStatus.FORBIDDEN, 'You are not authorized to update this schedule');
    }
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
  const { Review, HomeworkReview } = require('../models');
  
  const schedule = await Schedule.findById(scheduleId);
  if (!schedule) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Schedule not found');
  }

  // Find all assignments for this schedule
  const assignments = await Assignment.find({ scheduleId });
  const assignmentIds = assignments.map((a) => a._id);

  // Delete all reviews for these assignments
  if (assignmentIds.length > 0) {
    await Review.deleteMany({ assignmentID: { $in: assignmentIds } });
  }

  // Delete all assignments for this schedule
  await Assignment.deleteMany({ scheduleId });

  // Find all homeworks for this schedule
  const homeworks = await Homework.find({ scheduleId });
  const homeworkIds = homeworks.map((h) => h._id);

  // Delete all homework reviews
  if (homeworkIds.length > 0) {
    await HomeworkReview.deleteMany({ homeworkId: { $in: homeworkIds } });
  }

  // Delete all homeworks for this schedule
  await Homework.deleteMany({ scheduleId });

  // Delete the schedule
  await schedule.deleteOne();

  return schedule;
};

/**
 * Count schedules for today
 * @returns {Promise<number>}
 */
const countTodaySchedules = async () => {
  const startOfDay = moment.utc().startOf('day').toDate();
  const endOfDay = moment.utc().endOf('day').toDate();

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
  const totalStudents = await User.countDocuments({ role: USER_ROLES.STUDENT });
  
  // Total tutors
  const totalTutors = await User.countDocuments({ role: USER_ROLES.TUTOR });
  
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
    const weekStart = moment.utc().subtract(i, 'weeks').startOf('week').toDate();
    const weekEnd = moment.utc().subtract(i, 'weeks').endOf('week').toDate();
    
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
    const monthStart = moment.utc().subtract(i, 'months').startOf('month').toDate();
    const monthEnd = moment.utc().subtract(i, 'months').endOf('month').toDate();
    
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

/**
 * Generate new meeting link
 * @param {Object} options
 * @returns {Promise<Object>}
 */
const generateMeetingLink = async (options = {}) => {
  // Generate new Jitsi meeting URL
  const newMeetingURL = generateMeetingUrlWithConfig({
    scheduleId: options.scheduleId,
    date: options.date || new Date(),
    prefix: 'skillar-lesson',
    roomName: options.roomName,
    requireModerator: false, // Không yêu cầu moderator phải vào trước
  });
  
  return { meetingURL: newMeetingURL };
};

/**
 * Get today's lesson statistics
 * @returns {Promise<Object>}
 */
const getTodayLessonStats = async (filters = {}) => {
  const now = moment.utc();
  const startOfDay = now.clone().startOf('day').toDate();
  const endOfDay = now.clone().endOf('day').toDate();
  const startOfWeek = now.clone().startOf('week').toDate();
  const endOfWeek = now.clone().endOf('week').toDate();

  const baseFilter = {};
  if (filters.studentId) baseFilter.studentId = filters.studentId;
  if (filters.tutorId) baseFilter.tutorId = filters.tutorId;

  // Get today's schedules with populated fields
  const todaySchedulesWithDetails = await Schedule.find({
    ...baseFilter,
    startTime: {
      $gte: startOfDay,
      $lte: endOfDay,
    },
    status: { $ne: SCHEDULE_STATUS.CANCELLED },
  })
    .sort({ startTime: 1 })
    .populate('studentId', USER_SELECT_FIELDS)
    .populate('tutorId', USER_SELECT_FIELDS)
    .lean();

  // Get all schedules to find related assignments
  const allSchedules = await Schedule.find(baseFilter).select('_id');
  const scheduleIds = allSchedules.map((s) => s._id);

  // Get all assignments and homeworks updated today
  // (to include assignments/homeworks created earlier but tasks completed today)
  const todayAssignments = await Assignment.find({
    scheduleId: { $in: scheduleIds },
    $or: [
      { createdAt: { $gte: startOfDay, $lte: endOfDay } },
      { updatedAt: { $gte: startOfDay, $lte: endOfDay } },
    ],
  });

  const todayHomeworks = await Homework.find({
    scheduleId: { $in: scheduleIds },
    $or: [
      { createdAt: { $gte: startOfDay, $lte: endOfDay } },
      { updatedAt: { $gte: startOfDay, $lte: endOfDay } },
    ],
  });

  // Count total tasks and completed tasks
  let totalTasks = 0;
  let completedTasks = 0;

  todayAssignments.forEach((assignment) => {
    assignment.tasks.forEach((task) => {
      totalTasks++;
      if (['completed', 'submitted', 'graded'].includes(task.status)) {
        completedTasks++;
      }
    });
  });

  todayHomeworks.forEach((homework) => {
    homework.tasks.forEach((task) => {
      totalTasks++;
      if (['submitted', 'graded'].includes(task.status)) {
        completedTasks++;
      }
    });
  });

  const taskCompletionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Get this week's schedules
  const weekSchedules = await Schedule.find({
    ...baseFilter,
    startTime: {
      $gte: startOfWeek,
      $lte: endOfWeek,
    },
    status: { $ne: SCHEDULE_STATUS.CANCELLED },
  });

  const totalSessionsThisWeek = weekSchedules.length;
  const totalHoursThisWeek = weekSchedules.reduce((total, schedule) => total + schedule.duration, 0) / 60;

  return {
    todayCompletion: {
      completed: completedTasks,
      total: totalTasks,
      percentage: taskCompletionPercentage,
    },
    todaySchedules: todaySchedulesWithDetails || [],
    thisWeek: {
      totalSessions: totalSessionsThisWeek,
      totalHours: Math.round(totalHoursThisWeek * 10) / 10, // Round to 1 decimal place
    },
  };
};

/**
 * Get student dashboard statistics
 * @param {ObjectId} studentId - Student user ID
 * @returns {Promise<Object>}
 */
const getStudentDashboardStats = async (studentId) => {
  const now = moment.utc();
  const startOfDay = now.clone().startOf('day').toDate();
  const endOfDay = now.clone().endOf('day').toDate();
  const startOfNext7Days = now.clone().toDate();
  const endOfNext7Days = now.clone().add(7, 'days').endOf('day').toDate();

  // 1. Số bài tập đã làm xong trong ngày (có tính theo %)
  // Lấy tất cả schedules của student
  const studentSchedules = await Schedule.find({ studentId }).select('_id');
  const scheduleIds = studentSchedules.map((s) => s._id);

  // Lấy tất cả assignments và homeworks của student được cập nhật trong ngày hôm nay
  // (để bao gồm cả những assignment/homework được tạo trước đó nhưng task được hoàn thành trong ngày)
  const todayAssignments = await Assignment.find({
    scheduleId: { $in: scheduleIds },
    $or: [
      { createdAt: { $gte: startOfDay, $lte: endOfDay } },
      { updatedAt: { $gte: startOfDay, $lte: endOfDay } },
    ],
  });

  const todayHomeworks = await Homework.find({
    studentId,
    $or: [
      { createdAt: { $gte: startOfDay, $lte: endOfDay } },
      { updatedAt: { $gte: startOfDay, $lte: endOfDay } },
    ],
  });

  // Đếm tổng số tasks và số tasks đã hoàn thành
  let totalTasks = 0;
  let completedTasks = 0;

  todayAssignments.forEach((assignment) => {
    assignment.tasks.forEach((task) => {
      totalTasks++;
      if (['completed', 'submitted', 'graded'].includes(task.status)) {
        completedTasks++;
      }
    });
  });

  todayHomeworks.forEach((homework) => {
    homework.tasks.forEach((task) => {
      totalTasks++;
      if (['submitted', 'graded'].includes(task.status)) {
        completedTasks++;
      }
    });
  });

  const taskCompletionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // 2. Số buổi học sắp tới trong 7 ngày
  const upcomingSchedules = await Schedule.countDocuments({
    studentId,
    startTime: {
      $gte: startOfNext7Days,
      $lte: endOfNext7Days,
    },
    status: SCHEDULE_STATUS.UPCOMING,
  });

  // 3. Số môn đang học (distinct subjectCode từ schedules có status upcoming hoặc ongoing)
  const activeSubjects = await Schedule.distinct('subjectCode', {
    studentId,
    status: { $in: [SCHEDULE_STATUS.UPCOMING, SCHEDULE_STATUS.ONGOING] },
  });

  // 4. Số giờ học đã lên lịch tiếp theo (lấy schedule tiếp theo gần nhất)
  const nextSchedule = await Schedule.findOne({
    studentId,
    startTime: { $gte: now.toDate() },
    status: { $in: [SCHEDULE_STATUS.UPCOMING, SCHEDULE_STATUS.ONGOING] },
  })
    .sort({ startTime: 1 })
    .lean();

  const nextLessonHours = nextSchedule ? Math.round((nextSchedule.duration / 60) * 10) / 10 : 0;

  return {
    todayTasks: {
      completed: completedTasks,
      total: totalTasks,
      percentage: taskCompletionPercentage,
    },
    upcomingSessions: upcomingSchedules,
    activeSubjects: activeSubjects.length,
    nextLessonHours,
  };
};

/**
 * Get time allocation by subject for student
 * @param {ObjectId} studentId - Student user ID
 * @returns {Promise<Object>}
 */
const getTimeAllocationBySubject = async (studentId) => {
  // Lấy tất cả schedules của student (không tính cancelled)
  const schedules = await Schedule.find({
    studentId,
    status: { $ne: SCHEDULE_STATUS.CANCELLED },
  }).select('subjectCode duration');

  // Nhóm theo subjectCode và tính tổng duration (minutes)
  const subjectTimeMap = {};
  let totalMinutes = 0;

  schedules.forEach((schedule) => {
    const { subjectCode, duration } = schedule;
    if (!subjectTimeMap[subjectCode]) {
      subjectTimeMap[subjectCode] = 0;
    }
    subjectTimeMap[subjectCode] += duration;
    totalMinutes += duration;
  });

  // Chuyển đổi sang hours và tính phần trăm
  const subjects = Object.keys(subjectTimeMap).map((subjectCode) => {
    const minutes = subjectTimeMap[subjectCode];
    const hours = Math.round((minutes / 60) * 10) / 10; // Làm tròn 1 chữ số thập phân
    const percentage = totalMinutes > 0 ? Math.round((minutes / totalMinutes) * 100) : 0;

    return {
      subjectCode,
      hours,
      percentage,
    };
  });

  // Sắp xếp theo giờ học giảm dần
  subjects.sort((a, b) => b.hours - a.hours);

  return {
    subjects,
    totalHours: Math.round((totalMinutes / 60) * 10) / 10,
  };
};

/**
 * Get completed assignments/homework tasks by subject for student
 * @param {ObjectId} studentId - Student user ID
 * @returns {Promise<Object>}
 */
const getCompletedTasksBySubject = async (studentId) => {
  // Lấy tất cả schedules của student
  const schedules = await Schedule.find({
    studentId,
    status: { $ne: SCHEDULE_STATUS.CANCELLED },
  }).select('_id');

  const scheduleIds = schedules.map((s) => s._id);

  // Lấy tất cả assignments của student (thông qua schedules)
  const assignments = await Assignment.find({
    scheduleId: { $in: scheduleIds },
  }).select('subject tasks');

  // Lấy tất cả homeworks của student
  const homeworks = await Homework.find({
    studentId,
  }).select('subject tasks');

  // Nhóm theo subject và đếm tasks
  const subjectStatsMap = {};
  let totalCompleted = 0;
  let totalTasks = 0;

  // Xử lý assignments
  assignments.forEach((assignment) => {
    const subject = assignment.subject || 'Unknown';
    if (!subjectStatsMap[subject]) {
      subjectStatsMap[subject] = {
        completed: 0,
        total: 0,
      };
    }

    assignment.tasks.forEach((task) => {
      subjectStatsMap[subject].total++;
      totalTasks++;
      // Assignment tasks: completed, submitted, graded được coi là đã làm xong
      if (['completed', 'submitted', 'graded'].includes(task.status)) {
        subjectStatsMap[subject].completed++;
        totalCompleted++;
      }
    });
  });

  // Xử lý homeworks
  homeworks.forEach((homework) => {
    const subject = homework.subject || 'Unknown';
    if (!subjectStatsMap[subject]) {
      subjectStatsMap[subject] = {
        completed: 0,
        total: 0,
      };
    }

    homework.tasks.forEach((task) => {
      subjectStatsMap[subject].total++;
      totalTasks++;
      // Homework tasks: submitted, graded được coi là đã làm xong
      if (['submitted', 'graded'].includes(task.status)) {
        subjectStatsMap[subject].completed++;
        totalCompleted++;
      }
    });
  });

  // Chuyển đổi sang array và tính phần trăm
  const subjects = Object.keys(subjectStatsMap).map((subject) => {
    const { completed, total } = subjectStatsMap[subject];
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      subject,
      completed,
      total,
      percentage,
    };
  });

  // Sắp xếp theo số bài đã làm xong giảm dần
  subjects.sort((a, b) => b.completed - a.completed);

  const overallPercentage = totalTasks > 0 ? Math.round((totalCompleted / totalTasks) * 100) : 0;

  return {
    subjects,
    overall: {
      completed: totalCompleted,
      total: totalTasks,
      percentage: overallPercentage,
    },
  };
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
  generateMeetingLink,
  getTodayLessonStats,
  getStudentDashboardStats,
  getTimeAllocationBySubject,
  getCompletedTasksBySubject,
};
