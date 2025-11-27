const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const assignmentValidation = require('../../validations/assignment.validation');
const assignmentController = require('../../controllers/assignment.controller');

const router = express.Router();

router
  .route('/')
  .post(auth(['admin', 'tutor']), validate(assignmentValidation.createAssignment), assignmentController.createAssignment)
  .get(auth(['admin', 'student', 'tutor']), validate(assignmentValidation.getAssignments), assignmentController.getAssignments);

router
  .route('/:assignmentId')
  .get(auth(['admin', 'student', 'tutor']), validate(assignmentValidation.getAssignment), assignmentController.getAssignment)
  .patch(auth(['admin', 'tutor']), validate(assignmentValidation.updateAssignment), assignmentController.updateAssignment)
  .delete(auth(['admin']), validate(assignmentValidation.deleteAssignment), assignmentController.deleteAssignment);

router
  .route('/:assignmentId/tasks/:taskId/submit')
  .patch(auth(['student','admin']), validate(assignmentValidation.submitTask), assignmentController.submitTask);

router
  .route('/stats/today')
  .get(auth(['admin', 'student', 'tutor']), assignmentController.getTodayAssignmentsStats);

/**
 * @swagger
 * /assignments:
 *   post:
 *     summary: Create a new assignment
 *     description: Only admins and tutors can create assignments
 *     tags: [Assignments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - scheduleId
 *               - name
 *             properties:
 *               scheduleId:
 *                 type: string
 *                 description: Schedule ID
 *                 example: "507f1f77bcf86cd799439011"
 *               name:
 *                 type: string
 *                 example: "Math Assignment 1"
 *               description:
 *                 type: string
 *                 example: "Complete exercises 1-10"
 *               subject:
 *                 type: string
 *                 example: "Mathematics"
 *               status:
 *                 type: string
 *                 enum: [pending, in-progress, completed]
 *                 default: pending
 *               supplementaryMaterials:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - name
 *                     - url
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: "Lecture Slides"
 *                     url:
 *                       type: string
 *                       example: "https://example.com/slides.pdf"
 *                     requirement:
 *                       type: string
 *                       example: "Must read before class"
 *               tasks:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - name
 *                     - estimatedTime
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: "Task 1"
 *                     estimatedTime:
 *                       type: integer
 *                       minimum: 1
 *                       description: Estimated time in minutes
 *                       example: 30
 *                     actualTime:
 *                       type: integer
 *                       minimum: 0
 *                       description: Actual time in minutes
 *                       example: 25
 *                     assignmentUrl:
 *                       type: string
 *                       format: uri
 *                       example: "https://example.com/assignment.pdf"
 *                     solutionUrl:
 *                       type: string
 *                       format: uri
 *                       example: "https://example.com/solution.pdf"
 *                     answerURL:
 *                       type: string
 *                       format: uri
 *                       description: Student's answer/solution file URL
 *                       example: "https://example.com/student-answer.pdf"
 *                     status:
 *                       type: string
 *                       enum: [pending, in-progress, submitted, graded]
 *                       default: pending
 *                     description:
 *                       type: string
 *                       example: "Solve quadratic equations"
 *                     note:
 *                       type: string
 *                       example: "Remember to show your work"
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 scheduleId:
 *                   type: string
 *                 name:
 *                   type: string
 *                 description:
 *                   type: string
 *                 subject:
 *                   type: string
 *                 status:
 *                   type: string
 *                 supplementaryMaterials:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                       url:
 *                         type: string
 *                       requirement:
 *                         type: string
 *                 tasks:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       estimatedTime:
 *                         type: integer
 *                       actualTime:
 *                         type: integer
 *                       assignmentUrl:
 *                         type: string
 *                       solutionUrl:
 *                         type: string
 *                       answerURL:
 *                         type: string
 *                       status:
 *                         type: string
 *                       description:
 *                         type: string
 *                       note:
 *                         type: string
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
 *
 *   get:
 *     summary: Get all assignments
 *     description: Logged in users can retrieve all assignments
 *     tags: [Assignments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: scheduleId
 *         schema:
 *           type: string
 *         description: Filter by schedule ID
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
 *         name: name
 *         schema:
 *           type: string
 *         description: Filter by name
 *       - in: query
 *         name: subject
 *         schema:
 *           type: string
 *         description: Filter by subject
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, in-progress, completed]
 *         description: Filter by status
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Filter by start date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Filter by end date (must be after startDate)
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: Sort by field
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Maximum number of results
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
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
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       scheduleId:
 *                         type: string
 *                       studentName:
 *                         type: string
 *                         description: Name of the student from the associated schedule
 *                       name:
 *                         type: string
 *                       description:
 *                         type: string
 *                       subject:
 *                         type: string
 *                       status:
 *                         type: string
 *                       supplementaryMaterials:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             name:
 *                               type: string
 *                             url:
 *                               type: string
 *                             requirement:
 *                               type: string
 *                       tasks:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: string
 *                             name:
 *                               type: string
 *                             estimatedTime:
 *                               type: integer
 *                             actualTime:
 *                               type: integer
 *                             assignmentUrl:
 *                               type: string
 *                             solutionUrl:
 *                               type: string
 *                             answerURL:
 *                               type: string
 *                             status:
 *                               type: string
 *                             description:
 *                               type: string
 *                             note:
 *                               type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                 page:
 *                   type: integer
 *                 limit:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 totalResults:
 *                   type: integer
 *       "401":
 *         description: Unauthorized
 */

/**
 * @swagger
 * /assignments/stats/today:
 *   get:
 *     summary: Get today's assignments statistics
 *     description: Logged in users can access today's assignment statistics
 *     tags: [Assignments]
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
 *                 assignments:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       scheduleId:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           studentId:
 *                             type: object
 *                           tutorId:
 *                             type: object
 *                       name:
 *                         type: string
 *                       description:
 *                         type: string
 *                       subject:
 *                         type: string
 *                       status:
 *                         type: string
 *                       tasks:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: string
 *                             name:
 *                               type: string
 *                             estimatedTime:
 *                               type: integer
 *                             actualTime:
 *                               type: integer
 *                             assignmentUrl:
 *                               type: string
 *                             solutionUrl:
 *                               type: string
 *                             answerURL:
 *                               type: string
 *                             status:
 *                               type: string
 *                             description:
 *                               type: string
 *                             note:
 *                               type: string
 *                       taskStats:
 *                         type: object
 *                         properties:
 *                           completed:
 *                             type: integer
 *                           total:
 *                             type: integer
 *                           percentage:
 *                             type: integer
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                 subjectStats:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       subject:
 *                         type: string
 *                       totalAssignments:
 *                         type: integer
 *                       totalTasks:
 *                         type: integer
 *                       completedTasks:
 *                         type: integer
 *                       completionPercentage:
 *                         type: integer
 *       "401":
 *         description: Unauthorized
 */

/**
 * @swagger
 * /assignments/{assignmentId}:
 *   get:
 *     summary: Get an assignment
 *     description: Logged in users can fetch assignment information
 *     tags: [Assignments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: assignmentId
 *         required: true
 *         schema:
 *           type: string
 *         description: Assignment ID
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
 *                 scheduleId:
 *                   type: string
 *                 name:
 *                   type: string
 *                 description:
 *                   type: string
 *                 subject:
 *                   type: string
 *                 status:
 *                   type: string
 *                 supplementaryMaterials:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                       url:
 *                         type: string
 *                       requirement:
 *                         type: string
 *                 tasks:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       estimatedTime:
 *                         type: integer
 *                       actualTime:
 *                         type: integer
 *                       assignmentUrl:
 *                         type: string
 *                       solutionUrl:
 *                         type: string
 *                       answerURL:
 *                         type: string
 *                       status:
 *                         type: string
 *                       description:
 *                         type: string
 *                       note:
 *                         type: string
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
 *     summary: Update an assignment
 *     description: Only admins and tutors can update assignments
 *     tags: [Assignments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: assignmentId
 *         required: true
 *         schema:
 *           type: string
 *         description: Assignment ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               subject:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [pending, in-progress, completed]
 *               supplementaryMaterials:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     url:
 *                       type: string
 *                     requirement:
 *                       type: string
 *               tasks:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     estimatedTime:
 *                       type: integer
 *                       minimum: 1
 *                     actualTime:
 *                       type: integer
 *                       minimum: 0
 *                     assignmentUrl:
 *                       type: string
 *                       format: uri
 *                     solutionUrl:
 *                       type: string
 *                       format: uri
 *                     answerURL:
 *                       type: string
 *                       format: uri
 *                       description: Student's answer/solution file URL
 *                     status:
 *                       type: string
 *                       enum: [pending, in-progress, submitted, graded]
 *                     description:
 *                       type: string
 *                     note:
 *                       type: string
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
 *                 scheduleId:
 *                   type: string
 *                 name:
 *                   type: string
 *                 description:
 *                   type: string
 *                 subject:
 *                   type: string
 *                 status:
 *                   type: string
 *                 supplementaryMaterials:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                       url:
 *                         type: string
 *                       requirement:
 *                         type: string
 *                 tasks:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       estimatedTime:
 *                         type: integer
 *                       actualTime:
 *                         type: integer
 *                       assignmentUrl:
 *                         type: string
 *                       solutionUrl:
 *                         type: string
 *                       answerURL:
 *                         type: string
 *                       status:
 *                         type: string
 *                       description:
 *                         type: string
 *                       note:
 *                         type: string
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
 *     summary: Delete an assignment
 *     description: Only admins can delete assignments
 *     tags: [Assignments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: assignmentId
 *         required: true
 *         schema:
 *           type: string
 *         description: Assignment ID
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
 * /assignments/{assignmentId}/tasks/{taskId}/submit:
 *   patch:
 *     summary: Submit an assignment task
 *     description: Students and admins can submit assignment tasks
 *     tags: [Assignments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: assignmentId
 *         required: true
 *         schema:
 *           type: string
 *         description: Assignment ID
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *         description: Task ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               actualTime:
 *                 type: integer
 *                 minimum: 0
 *                 description: Actual time spent in minutes
 *                 example: 25
 *               solutionUrl:
 *                 type: string
 *                 format: uri
 *                 example: "https://example.com/solution.pdf"
 *               answerURL:
 *                 type: string
 *                 format: uri
 *                 description: Student's answer/solution file URL
 *                 example: "https://example.com/student-answer.pdf"
 *               status:
 *                 type: string
 *                 enum: [submitted]
 *                 example: submitted
 *               description:
 *                 type: string
 *                 example: "Completed the task"
 *               note:
 *                 type: string
 *                 example: "I found this difficult"
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
 *                 scheduleId:
 *                   type: string
 *                 name:
 *                   type: string
 *                 tasks:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       estimatedTime:
 *                         type: integer
 *                       actualTime:
 *                         type: integer
 *                       assignmentUrl:
 *                         type: string
 *                       solutionUrl:
 *                         type: string
 *                       answerURL:
 *                         type: string
 *                       status:
 *                         type: string
 *                       description:
 *                         type: string
 *                       note:
 *                         type: string
 *       "400":
 *         description: Bad Request
 *       "401":
 *         description: Unauthorized
 *       "403":
 *         description: Forbidden
 *       "404":
 *         description: Not Found
 */

module.exports = router;
