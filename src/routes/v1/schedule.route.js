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
  .route('/:scheduleId')
  .get(auth(['admin', 'student', 'parent', 'tutor']), validate(scheduleValidation.getSchedule), scheduleController.getSchedule)
  .patch(auth(['admin']), validate(scheduleValidation.updateSchedule), scheduleController.updateSchedule)
  .delete(auth(['admin']), validate(scheduleValidation.deleteSchedule), scheduleController.deleteSchedule);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Schedules
 *   description: Schedule management and statistics
 */

/**
 * @swagger
 * /schedules:
 *   post:
 *     summary: Create a schedule
 *     description: Only admins can create schedules. If meetingURL is not provided, a Jitsi Meet link will be auto-generated.
 *     tags: [Schedules]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - startTime
 *               - duration
 *               - subjectCode
 *               - studentId
 *               - tutorId
 *             properties:
 *               startTime:
 *                 type: string
 *                 format: date-time
 *                 description: Schedule start time
 *               duration:
 *                 type: number
 *                 description: Duration in minutes
 *               subjectCode:
 *                 type: string
 *                 description: Subject code
 *               studentId:
 *                 type: string
 *                 description: Student user ID
 *               tutorId:
 *                 type: string
 *                 description: Tutor user ID
 *               meetingURL:
 *                 type: string
 *                 description: Meeting URL (auto-generated Jitsi link if not provided)
 *               note:
 *                 type: string
 *                 description: Additional notes
 *               status:
 *                 type: string
 *                 enum: [upcoming, ongoing, completed, cancelled]
 *                 description: Schedule status
 *             example:
 *               startTime: '2024-11-22T14:00:00.000Z'
 *               duration: 60
 *               subjectCode: 'MATH101'
 *               studentId: '5ebac534954b54139806c112'
 *               tutorId: '5ebac534954b54139806c114'
 *               note: 'Ôn tập giải hệ phương trình'
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Schedule'
 *             example:
 *               id: '507f1f77bcf86cd799439040'
 *               startTime: '2024-11-22T14:00:00.000Z'
 *               duration: 60
 *               subjectCode: 'MATH101'
 *               studentId: '5ebac534954b54139806c112'
 *               tutorId: '5ebac534954b54139806c114'
 *               meetingURL: 'https://meet.jit.si/skillar-lesson-1700662800000-a1b2c3d4'
 *               status: 'upcoming'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *
 *   get:
 *     summary: Get all schedules
 *     description: Retrieve all schedules with pagination and filtering.
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
 *       - in: query
 *         name: subjectCode
 *         schema:
 *           type: string
 *         description: Filter by subject code
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: sort by query in the form of field:desc/asc (ex. startTime:desc)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         default: 10
 *         description: Maximum number of schedules
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Schedule'
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 10
 *                 totalPages:
 *                   type: integer
 *                   example: 1
 *                 totalResults:
 *                   type: integer
 *                   example: 1
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /schedules/stats/today:
 *   get:
 *     summary: Get today's schedule count
 *     description: Get the count of schedules for today.
 *     tags: [Schedules]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TodayScheduleCount'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /schedules/stats/dashboard:
 *   get:
 *     summary: Get dashboard statistics
 *     description: Get comprehensive statistics for the dashboard including total schedules, today's schedules, and user counts.
 *     tags: [Schedules]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DashboardStats'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /schedules/stats/students-per-week:
 *   get:
 *     summary: Get students per week statistics
 *     description: Get the number of unique students with schedules per week.
 *     tags: [Schedules]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: weeks
 *         schema:
 *           type: integer
 *           minimum: 1
 *         default: 4
 *         description: Number of weeks to retrieve data for
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StudentsPerWeekData'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /schedules/stats/schedules-per-month:
 *   get:
 *     summary: Get schedules per month statistics
 *     description: Get the number of schedules per month.
 *     tags: [Schedules]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: months
 *         schema:
 *           type: integer
 *           minimum: 1
 *         default: 6
 *         description: Number of months to retrieve data for
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SchedulesPerMonthData'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /schedules/{id}:
 *   get:
 *     summary: Get a schedule
 *     description: Get detailed information about a specific schedule.
 *     tags: [Schedules]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Schedule id
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Schedule'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   patch:
 *     summary: Update a schedule
 *     description: Only admins can update schedules.
 *     tags: [Schedules]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Schedule id
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
 *                 type: number
 *               subjectCode:
 *                 type: string
 *               studentId:
 *                 type: string
 *               tutorId:
 *                 type: string
 *             example:
 *               startTime: '2024-11-22T15:00:00.000Z'
 *               duration: 90
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Schedule'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   delete:
 *     summary: Delete a schedule
 *     description: Only admins can delete schedules.
 *     tags: [Schedules]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Schedule id
 *     responses:
 *       "200":
 *         description: No content
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

