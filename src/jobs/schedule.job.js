const cron = require('node-cron');
const { 
  updateScheduleStatusToOngoing, 
  updateScheduleStatusToCompleted,
  updateOverdueHomeworkTasks 
} = require('../services/scheduleStatusUpdate.service');
const logger = require('../config/logger');

/**
 * Start cron job to auto-update schedule, assignment, and homework statuses
 * Runs every minute to check and update statuses
 */
const startScheduleStatusUpdateJob = () => {
  // Run every minute: '* * * * *'
  cron.schedule('* * * * *', async () => {
    try {
      logger.debug('Running schedule status update job...');
      
      // Update upcoming → ongoing
      const ongoingResult = await updateScheduleStatusToOngoing();
      
      // Update ongoing → completed
      const completedResult = await updateScheduleStatusToCompleted();
      
      // Update overdue homework tasks → undone
      const homeworkResult = await updateOverdueHomeworkTasks();
      
      if (ongoingResult.schedules.modified > 0 || completedResult.schedules.modified > 0 || homeworkResult.tasks.undone > 0) {
        logger.info('Schedule status update job completed', {
          ongoing: ongoingResult,
          completed: completedResult,
          homework: homeworkResult,
        });
      }
    } catch (error) {
      logger.error('Error in schedule status update job:', error);
    }
  });
  
  logger.info('Schedule & homework status update cron job started (runs every minute)');
};

module.exports = {
  startScheduleStatusUpdateJob,
};
