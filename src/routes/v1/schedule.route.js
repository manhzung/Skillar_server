const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const scheduleValidation = require('../../validations/schedule.validation');
const scheduleController = require('../../controllers/schedule.controller');

const router = express.Router();

router
  .route('/')
  .post(auth(['admin']), validate(scheduleValidation.createSchedule), scheduleController.createSchedule)
  .get(auth(['admin', 'student', 'parent', 'tutor']), validate(scheduleValidation.getSchedules), scheduleController.getSchedules);

router
  .route('/stats/today')
  .get(auth(['admin']), scheduleController.getTodaySchedulesCount);

router
  .route('/stats/dashboard')
  .get(auth(['admin']), scheduleController.getDashboardStats);

router
  .route('/stats/students-per-week')
  .get(auth(['admin']), scheduleController.getStudentsPerWeek);

router
  .route('/stats/schedules-per-month')
  .get(auth(['admin']), scheduleController.getSchedulesPerMonth);

router
  .route('/stats/today-lessons')
  .get(auth(['admin', 'student', 'parent', 'tutor']), validate(scheduleValidation.getTodayLessonStats), scheduleController.getTodayLessonStats);

router
  .route('/stats/student-dashboard')
  .get(auth(['admin', 'student', 'parent']), scheduleController.getStudentDashboardStats);

router
  .route('/stats/time-allocation')
  .get(auth(['admin', 'student', 'parent']), scheduleController.getTimeAllocationBySubject);

router
  .route('/stats/completed-tasks')
  .get(auth(['admin', 'student', 'parent']), scheduleController.getCompletedTasksBySubject);

router
  .route('/generate-meeting-link')
  .post(auth(['admin']), validate(scheduleValidation.generateMeetingLink), scheduleController.generateMeetingLink);

router
  .route('/:scheduleId')
  .get(auth(['admin', 'student', 'parent', 'tutor']), validate(scheduleValidation.getSchedule), scheduleController.getSchedule)
  .patch(auth(['admin']), validate(scheduleValidation.updateSchedule), scheduleController.updateSchedule)
  .delete(auth(['admin']), validate(scheduleValidation.deleteSchedule), scheduleController.deleteSchedule);

/**
 * @swagger
 * /schedules/stats/student-dashboard:
 *   get:
 *     summary: Get student dashboard statistics
 *     description: Students, parents, and admins can access student dashboard statistics
 *     tags: [Schedules]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 todayTasks:
 *                   type: object
 *                   properties:
 *                     completed:
 *                       type: integer
 *                     total:
 *                       type: integer
 *                     percentage:
 *                       type: integer
 *                 upcomingSessions:
 *                   type: integer
 *                 activeSubjects:
 *                   type: integer
 *                 nextLessonHours:
 *                   type: number
 *       "401":
 *         description: Unauthorized
 */

/**
 * @swagger
 * /schedules/stats/time-allocation:
 *   get:
 *     summary: Get time allocation by subject
 *     description: Students, parents, and admins can access time allocation statistics
 *     tags: [Schedules]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 subjects:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       subjectCode:
 *                         type: string
 *                       hours:
 *                         type: number
 *                       percentage:
 *                         type: integer
 *                 totalHours:
 *                   type: number
 *       "401":
 *         description: Unauthorized
 */

/**
 * @swagger
 * /schedules/stats/completed-tasks:
 *   get:
 *     summary: Get completed tasks by subject
 *     description: Students, parents, and admins can access completed tasks statistics
 *     tags: [Schedules]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 subjects:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       subject:
 *                         type: string
 *                       completed:
 *                         type: integer
 *                       total:
 *                         type: integer
 *                       percentage:
 *                         type: integer
 *                 overall:
 *                   type: object
 *                   properties:
 *                     completed:
 *                       type: integer
 *                     total:
 *                       type: integer
 *                     percentage:
 *                       type: integer
 *       "401":
 *         description: Unauthorized
 */

/**
 * @swagger
 * /schedules/generate-meeting-link:
 *   post:
 *     summary: Generate a meeting link
 *     description: Only admins can generate meeting links
 *     tags: [Schedules]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 meetingURL:
 *                   type: string
 *       "401":
 *         description: Unauthorized
 *       "403":
 *         description: Forbidden
 */

/**
 * @swagger
 * /schedules/{scheduleId}:
 *   get:
 *     summary: Get a schedule
 *     description: Logged in users can fetch schedule information
 *     tags: [Schedules]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: scheduleId
 *         required: true
 *         schema:
 *           type: string
 *         description: Schedule ID
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 startTime:
 *                   type: string
 *                   format: date-time
 *                 duration:
 *                   type: integer
 *                 subjectCode:
 *                   type: string
 *                 studentId:
 *                   type: string
 *                 tutorId:
 *                   type: string
 *                 meetingURL:
 *                   type: string
 *                 note:
 *                   type: string
 *                 status:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       "401":
 *         description: Unauthorized
 *       "404":
 *         description: Not Found
 *
 *   patch:
 *     summary: Update a schedule
 *     description: Only admins can update schedules
 *     tags: [Schedules]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: scheduleId
 *         required: true
 *         schema:
 *           type: string
 *         description: Schedule ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               startTime:
 *                 type: string
 *                 format: date-time
 *               duration:
 *                 type: integer
 *                 minimum: 1
 *               subjectCode:
 *                 type: string
 *               studentId:
 *                 type: string
 *               tutorId:
 *                 type: string
 *               meetingURL:
 *                 type: string
 *                 format: uri
 *               note:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [upcoming, ongoing, completed, cancelled]
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 startTime:
 *                   type: string
 *                   format: date-time
 *                 duration:
 *                   type: integer
 *                 subjectCode:
 *                   type: string
 *                 studentId:
 *                   type: string
 *                 tutorId:
 *                   type: string
 *                 meetingURL:
 *                   type: string
 *                 note:
 *                   type: string
 *                 status:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       "400":
 *         description: Bad Request
 *       "401":
 *         description: Unauthorized
 *       "403":
 *         description: Forbidden
 *       "404":
 *         description: Not Found
 *
 *   delete:
 *     summary: Delete a schedule
 *     description: Only admins can delete schedules
 *     tags: [Schedules]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: scheduleId
 *         required: true
 *         schema:
 *           type: string
 *         description: Schedule ID
 *     responses:
 *       "204":
 *         description: No Content
 *       "401":
 *         description: Unauthorized
 *       "403":
 *         description: Forbidden
 *       "404":
 *         description: Not Found
 */

/**
 * @swagger
 * /schedules/stats/today:
 *   get:
 *     summary: Get today's schedules count
 *     description: Only admins can access this statistic
 *     tags: [Schedules]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *       "401":
 *         description: Unauthorized
 *       "403":
 *         description: Forbidden
 */

/**
 * @swagger
 * /schedules/stats/dashboard:
 *   get:
 *     summary: Get dashboard statistics
 *     description: Only admins can access dashboard statistics
 *     tags: [Schedules]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalSchedules:
 *                   type: integer
 *                 totalStudents:
 *                   type: integer
 *                 totalTutors:
 *                   type: integer
 *                 studentsParticipated:
 *                   type: integer
 *       "401":
 *         description: Unauthorized
 *       "403":
 *         description: Forbidden
 */

/**
 * @swagger
 * /schedules/stats/students-per-week:
 *   get:
 *     summary: Get students per week statistics
 *     description: Only admins can access this statistic
 *     tags: [Schedules]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: weeks
 *         schema:
 *           type: integer
 *           default: 4
 *         description: Number of weeks to analyze
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   week:
 *                     type: string
 *                     example: "2024-01"
 *                   weekStart:
 *                     type: string
 *                     format: date-time
 *                   weekEnd:
 *                     type: string
 *                     format: date-time
 *                   studentCount:
 *                     type: integer
 *       "401":
 *         description: Unauthorized
 *       "403":
 *         description: Forbidden
 */

/**
 * @swagger
 * /schedules/stats/schedules-per-month:
 *   get:
 *     summary: Get schedules per month statistics
 *     description: Only admins can access this statistic
 *     tags: [Schedules]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: months
 *         schema:
 *           type: integer
 *           default: 6
 *         description: Number of months to analyze
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   month:
 *                     type: string
 *                     example: "2024-01"
 *                   monthStart:
 *                     type: string
 *                     format: date-time
 *                   monthEnd:
 *                     type: string
 *                     format: date-time
 *                   scheduleCount:
 *                     type: integer
 *       "401":
 *         description: Unauthorized
 *       "403":
 *         description: Forbidden
 */

/**
 * @swagger
 * /schedules/stats/today-lessons:
 *   get:
 *     summary: Get today's lesson statistics
 *     description: Logged in users can access today's lesson statistics
 *     tags: [Schedules]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: studentId
 *         schema:
 *           type: string
 *         description: Filter by student ID
 *       - in: query
 *         name: tutorId
 *         schema:
 *           type: string
 *         description: Filter by tutor ID
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 todayCompletion:
 *                   type: object
 *                   properties:
 *                     completed:
 *                       type: integer
 *                     total:
 *                       type: integer
 *                     percentage:
 *                       type: integer
 *                 todaySchedules:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       startTime:
 *                         type: string
 *                         format: date-time
 *                       duration:
 *                         type: integer
 *                       subjectCode:
 *                         type: string
 *                       studentId:
 *                         type: object
 *                       tutorId:
 *                         type: object
 *                       meetingURL:
 *                         type: string
 *                       note:
 *                         type: string
 *                       status:
 *                         type: string
 *                 thisWeek:
 *                   type: object
 *                   properties:
 *                     totalSessions:
 *                       type: integer
 *                     totalHours:
 *                       type: number
 *       "401":
 *         description: Unauthorized
 */

/**
 * @swagger
 * /schedules/stats/student-dashboard:
 *   get:
 *     summary: Get student dashboard statistics
 *     description: Students, parents, and admins can access student dashboard statistics
 *     tags: [Schedules]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 todayTasks:
 *                   type: object
 *                   properties:
 *                     completed:
 *                       type: integer
 *                     total:
 *                       type: integer
 *                     percentage:
 *                       type: integer
 *                 upcomingSessions:
 *                   type: integer
 *                 activeSubjects:
 *                   type: integer
 *                 nextLessonHours:
 *                   type: number
 *       "401":
 *         description: Unauthorized
 */

/**
 * @swagger
 * /schedules/stats/time-allocation:
 *   get:
 *     summary: Get time allocation by subject
 *     description: Students, parents, and admins can access time allocation statistics
 *     tags: [Schedules]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 subjects:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       subjectCode:
 *                         type: string
 *                       hours:
 *                         type: number
 *                       percentage:
 *                         type: integer
 *                 totalHours:
 *                   type: number
 *       "401":
 *         description: Unauthorized
 */

/**
 * @swagger
 * /schedules/stats/completed-tasks:
 *   get:
 *     summary: Get completed tasks by subject
 *     description: Students, parents, and admins can access completed tasks statistics
 *     tags: [Schedules]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 subjects:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       subject:
 *                         type: string
 *                       completed:
 *                         type: integer
 *                       total:
 *                         type: integer
 *                       percentage:
 *                         type: integer
 *                 overall:
 *                   type: object
 *                   properties:
 *                     completed:
 *                       type: integer
 *                     total:
 *                       type: integer
 *                     percentage:
 *                       type: integer
 *       "401":
 *         description: Unauthorized
 */



module.exports = router;
