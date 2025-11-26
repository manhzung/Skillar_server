const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const homeworkValidation = require('../../validations/homework.validation');
const homeworkController = require('../../controllers/homework.controller');

const router = express.Router();

router
  .route('/')
  .post(auth(['admin', 'tutor']), validate(homeworkValidation.createHomework), homeworkController.createHomework)
  .get(auth(['admin', 'student', 'tutor']), validate(homeworkValidation.getHomeworks), homeworkController.getHomeworks);

router
  .route('/:homeworkId')
  .get(auth(['admin', 'student', 'tutor']), validate(homeworkValidation.getHomework), homeworkController.getHomework)
  .patch(auth(['admin', 'tutor']), validate(homeworkValidation.updateHomework), homeworkController.updateHomework)
  .delete(auth(['admin']), validate(homeworkValidation.deleteHomework), homeworkController.deleteHomework);

router
  .route('/:homeworkId/tasks/:taskId/submit')
  .patch(auth(['student','admin']), validate(homeworkValidation.submitTask), homeworkController.submitTask);

/**
 * @swagger
 * /homeworks:
 *   post:
 *     summary: Create a new homework
 *     description: Only admins and tutors can create homeworks
 *     tags: [Homeworks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - studentId
 *               - scheduleId
 *               - name
 *               - deadline
 *             properties:
 *               studentId:
 *                 type: string
 *                 description: User ID of the student
 *                 example: "507f1f77bcf86cd799439011"
 *               scheduleId:
 *                 type: string
 *                 description: Schedule ID
 *                 example: "507f1f77bcf86cd799439012"
 *               name:
 *                 type: string
 *                 example: "Math Homework 1"
 *               description:
 *                 type: string
 *                 example: "Complete exercises 1-10"
 *               deadline:
 *                 type: string
 *                 format: date-time
 *                 example: "2024-01-20T23:59:59.000Z"
 *               difficulty:
 *                 type: string
 *                 enum: [easy, medium, hard, advanced]
 *                 example: medium
 *               subject:
 *                 type: string
 *                 example: "Mathematics"
 *               tasks:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - name
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: "Solve quadratic equations"
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
 *                       enum: [pending, submitted, graded]
 *                       default: pending
 *                     description:
 *                       type: string
 *                       example: "Solve quadratic equations"
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
 *                 studentId:
 *                   type: string
 *                 scheduleId:
 *                   type: string
 *                 name:
 *                   type: string
 *                 description:
 *                   type: string
 *                 deadline:
 *                   type: string
 *                   format: date-time
 *                 difficulty:
 *                   type: string
 *                 subject:
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
 *     summary: Get all homeworks
 *     description: Logged in users can retrieve all homeworks
 *     tags: [Homeworks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: studentId
 *         schema:
 *           type: string
 *         description: Filter by student ID
 *       - in: query
 *         name: scheduleId
 *         schema:
 *           type: string
 *         description: Filter by schedule ID
 *       - in: query
 *         name: subject
 *         schema:
 *           type: string
 *         description: Filter by subject
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, submitted, graded]
 *         description: Filter by task status
 *       - in: query
 *         name: difficulty
 *         schema:
 *           type: string
 *           enum: [easy, medium, hard, advanced]
 *         description: Filter by difficulty
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
 *                       studentId:
 *                         type: string
 *                       scheduleId:
 *                         type: string
 *                       name:
 *                         type: string
 *                       description:
 *                         type: string
 *                       deadline:
 *                         type: string
 *                         format: date-time
 *                       difficulty:
 *                         type: string
 *                       subject:
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
 * /homeworks/{homeworkId}:
 *   get:
 *     summary: Get a homework
 *     description: Logged in users can fetch homework information
 *     tags: [Homeworks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: homeworkId
 *         required: true
 *         schema:
 *           type: string
 *         description: Homework ID
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
 *                 studentId:
 *                   type: string
 *                 scheduleId:
 *                   type: string
 *                 name:
 *                   type: string
 *                 description:
 *                   type: string
 *                 deadline:
 *                   type: string
 *                   format: date-time
 *                 difficulty:
 *                   type: string
 *                 subject:
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
 *     summary: Update a homework
 *     description: Only admins and tutors can update homeworks
 *     tags: [Homeworks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: homeworkId
 *         required: true
 *         schema:
 *           type: string
 *         description: Homework ID
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
 *               deadline:
 *                 type: string
 *                 format: date-time
 *               difficulty:
 *                 type: string
 *                 enum: [easy, medium, hard, advanced]
 *               subject:
 *                 type: string
 *               tasks:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     assignmentUrl:
 *                       type: string
 *                       format: uri
 *                     solutionUrl:
 *                       type: string
 *                       format: uri
 *                     answerURL:
 *                       type: string
 *                       format: uri
 *                     status:
 *                       type: string
 *                       enum: [pending, submitted, graded]
 *                     description:
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
 *                 studentId:
 *                   type: string
 *                 scheduleId:
 *                   type: string
 *                 name:
 *                   type: string
 *                 description:
 *                   type: string
 *                 deadline:
 *                   type: string
 *                   format: date-time
 *                 difficulty:
 *                   type: string
 *                 subject:
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
 *     summary: Delete a homework
 *     description: Only admins can delete homeworks
 *     tags: [Homeworks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: homeworkId
 *         required: true
 *         schema:
 *           type: string
 *         description: Homework ID
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
 * /homeworks/{homeworkId}/tasks/{taskId}/submit:
 *   patch:
 *     summary: Submit a homework task
 *     description: Students and admins can submit homework tasks
 *     tags: [Homeworks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: homeworkId
 *         required: true
 *         schema:
 *           type: string
 *         description: Homework ID
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
 *                 studentId:
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
