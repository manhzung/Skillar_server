const moment = require('moment-timezone');
const { Schedule, Assignment } = require('../models');
const { SCHEDULE_STATUS } = require('../constants');
const logger = require('../config/logger');
const reportService = require('./report.service');

const TASK_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in-progress',
  COMPLETED: 'completed',
  SUBMITTED: 'submitted',
  UNDONE: 'undone',
};

/**
 * Update schedules from 'upcoming' to 'ongoing' when class time starts
 * Also update assignment tasks from 'pending' to 'in-progress'
 * @returns {Promise<Object>}
 */
const updateScheduleStatusToOngoing = async () => {
  const now = moment.utc().toDate();
  
  // Find schedules that should be ongoing (startTime <= now and status is upcoming)
  const schedulesToUpdate = await Schedule.find({
    status: SCHEDULE_STATUS.UPCOMING,
    startTime: { $lte: now },
  }).select('_id');
  
  if (schedulesToUpdate.length > 0) {
    const scheduleIds = schedulesToUpdate.map((s) => s._id);
    
    // Update schedule status
    const scheduleResult = await Schedule.updateMany(
      { _id: { $in: scheduleIds } },
      { $set: { status: SCHEDULE_STATUS.ONGOING } }
    );
    
    // Update assignment tasks from 'pending' to 'in-progress'
    // We need to update tasks array elements
    const assignments = await Assignment.find({
      scheduleId: { $in: scheduleIds },
    });
    
    let tasksUpdated = 0;
    for (const assignment of assignments) {
      let modified = false;
      assignment.tasks.forEach((task) => {
        if (task.status === TASK_STATUS.PENDING) {
          task.status = TASK_STATUS.IN_PROGRESS;
          modified = true;
          tasksUpdated++;
        }
      });
      
      if (modified) {
        await assignment.save();
      }
    }
    
    logger.info(
      `Updated ${scheduleResult.modifiedCount || 0} schedules to 'ongoing' and ${tasksUpdated} assignment tasks to 'in-progress'`
    );
    
    return {
      schedules: {
        modified: scheduleResult.nModified || scheduleResult.modifiedCount || 0,
      },
      tasks: {
        modified: tasksUpdated,
      },
      timestamp: now,
    };
  }
  
  return {
    schedules: { modified: 0 },
    tasks: { modified: 0 },
    timestamp: now,
  };
};

/**
 * Update schedules from 'ongoing' to 'completed' when class time ends
 * Also update assignment tasks to 'undone' if they don't have answerURL
 * @returns {Promise<Object>}
 */
const updateScheduleStatusToCompleted = async () => {
  const now = moment.utc().toDate();
  
  // Find schedules that should be completed
  // (startTime + duration <= now and status is ongoing)
  const ongoingSchedules = await Schedule.find({
    status: SCHEDULE_STATUS.ONGOING,
  }).select('_id startTime duration');
  
  const schedulesToComplete = ongoingSchedules.filter((schedule) => {
    const endTime = moment(schedule.startTime).add(schedule.duration, 'minutes').toDate();
    return endTime <= now;
  });
  
  if (schedulesToComplete.length > 0) {
    const scheduleIds = schedulesToComplete.map((s) => s._id);
    
    // Update schedule status
    const scheduleResult = await Schedule.updateMany(
      { _id: { $in: scheduleIds } },
      { $set: { status: SCHEDULE_STATUS.COMPLETED } }
    );
    
    // Auto generate report for completed schedules
    for (const scheduleId of scheduleIds) {
      try {
        await reportService.generateReportForSchedule(scheduleId);
        logger.info(`Auto-generated report for schedule ${scheduleId}`);
      } catch (error) {
        logger.error(`Failed to auto-generate report for schedule ${scheduleId}:`, error);
      }
    }
    
    // Update assignment tasks to 'undone' if no answerURL
    const assignments = await Assignment.find({
      scheduleId: { $in: scheduleIds },
    });
    
    let tasksUndone = 0;
    for (const assignment of assignments) {
      let modified = false;
      assignment.tasks.forEach((task) => {
        // If task is in-progress and has no answerURL, mark as undone
        if (
          task.status === TASK_STATUS.IN_PROGRESS &&
          (!task.answerURL || task.answerURL.trim() === '')
        ) {
          task.status = TASK_STATUS.UNDONE;
          modified = true;
          tasksUndone++;
        }
      });
      
      if (modified) {
        await assignment.save();
      }
    }
    
    logger.info(
      `Updated ${scheduleResult.modifiedCount || 0} schedules to 'completed' and ${tasksUndone} assignment tasks to 'undone'`
    );
    
    return {
      schedules: {
        modified: scheduleResult.nModified || scheduleResult.modifiedCount || 0,
      },
      tasks: {
        undone: tasksUndone,
      },
      timestamp: now,
    };
  }
  
  return {
    schedules: { modified: 0 },
    tasks: { undone: 0 },
    timestamp: now,
  };
};

/**
 * Update homework tasks to 'undone' when deadline passes without answerURL
 * Also update homework status to 'undone' when deadline passes with incomplete tasks
 * @returns {Promise<Object>}
 */
const updateOverdueHomeworkTasks = async () => {
  const { Homework } = require('../models');
  const now = moment.utc().toDate();
  
  // Find homeworks with deadlines that have passed
  const overdueHomeworks = await Homework.find({
    deadline: { $lt: now },
  });
  
  let tasksUndone = 0;
  let homeworksUndone = 0;
  
  for (const homework of overdueHomeworks) {
    let modified = false;
    
    // Mark incomplete tasks as undone
    homework.tasks.forEach((task) => {
      // If task is still in-progress and has no answerURL, mark as undone
      // Note: Tasks default to 'in-progress', not 'pending'
      if (
        task.status === TASK_STATUS.IN_PROGRESS &&
        (!task.answerURL || task.answerURL.trim() === '')
      ) {
        task.status = TASK_STATUS.UNDONE;
        modified = true;
        tasksUndone++;
      }
    });
    
    // Check if all tasks are submitted
    const allSubmitted = homework.tasks.every((task) => task.status === TASK_STATUS.SUBMITTED);
    
    // If past deadline and not all tasks submitted, mark homework as undone
    if (!allSubmitted && homework.status !== TASK_STATUS.UNDONE) {
      homework.status = TASK_STATUS.UNDONE;
      modified = true;
      homeworksUndone++;
    }
    
    if (modified) {
      await homework.save();  // This will trigger pre-save hook but we already set the status
    }
  }
  
  if (tasksUndone > 0 || homeworksUndone > 0) {
    logger.info(
      `Marked ${tasksUndone} overdue homework tasks and ${homeworksUndone} homeworks as 'undone'`
    );
  }
  
  return {
    tasks: {
      undone: tasksUndone,
    },
    homeworks: {
      undone: homeworksUndone,
    },
    timestamp: now,
  };
};

module.exports = {
  updateScheduleStatusToOngoing,
  updateScheduleStatusToCompleted,
  updateOverdueHomeworkTasks,
};
