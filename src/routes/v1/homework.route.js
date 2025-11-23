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

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Homeworks
 *   description: Homework management and submission
 */

/**
 * @swagger
 * /homeworks:
 *   post:
 *     summary: Create homework
 *     description: Admin and tutors can create homework for students.
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
 *               scheduleId:
 *                 type: string
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
 *                   required:
 *                     - name
 *                   properties:
 *                     name:
 *                       type: string
 *                     assignmentUrl:
 *                       type: string
 *                     solutionUrl:
 *                       type: string
 *                     status:
 *                       type: string
 *                       enum: [pending, submitted, graded]
 *                     description:
 *                       type: string
 *             example:
 *               studentId: "507f1f77bcf86cd799439011"
 *               scheduleId: "507f1f77bcf86cd799439040"
 *               name: "Bài tập về nhà tuần 1"
 *               description: "Làm bài tập SGK"
 *               deadline: "2025-11-30T23:59:59.000Z"
 *               difficulty: "medium"
 *               subject: "Toán"
 *               tasks:
 *                 - name: "Làm lại bài 4"
 *                   assignmentUrl: "https://example.com/hw.pdf"
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Homework'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   get:
 *     summary: Get all homeworks
 *     description: Admin, students, and tutors can retrieve homeworks.
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
 *         name: difficulty
 *         schema:
 *           type: string
 *           enum: [easy, medium, hard, advanced]
 *         description: Filter by difficulty
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: sort by query
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         default: 10
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         default: 1
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
 *                     $ref: '#/components/schemas/Homework'
 *                 page:
 *                   type: integer
 *                 limit:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 totalResults:
 *                   type: integer
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 */

/**
 * @swagger
 * /homeworks/{homeworkId}:
 *   get:
 *     summary: Get a homework
 *     description: Admin, students, and tutors can fetch homework details.
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
 *               $ref: '#/components/schemas/Homework'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   patch:
 *     summary: Update homework
 *     description: Admin and tutors can update homework (e.g., add teacher solution, grade).
 *     tags: [Homeworks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: homeworkId
 *         required: true
 *         schema:
 *           type: string
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
 *             example:
 *               difficulty: "hard"
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Homework'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   delete:
 *     summary: Delete homework
 *     description: Only admins can delete homework.
 *     tags: [Homeworks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: homeworkId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       "204":
 *         description: No content
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /homeworks/{homeworkId}/tasks/{taskId}/submit:
 *   patch:
 *     summary: Submit homework task
 *     description: Students can submit their homework task solutions.
 *     tags: [Homeworks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: homeworkId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               solutionUrl:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [submitted]
 *               description:
 *                 type: string
 *             example:
 *               solutionUrl: "https://example.com/my-homework.pdf"
 *               status: "submitted"
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Homework'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Homework:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         studentId:
 *           type: string
 *         scheduleId:
 *           type: string
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         deadline:
 *           type: string
 *           format: date-time
 *         difficulty:
 *           type: string
 *           enum: [easy, medium, hard, advanced]
 *         subject:
 *           type: string
 *         tasks:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               name:
 *                 type: string
 *               assignmentUrl:
 *                 type: string
 *               solutionUrl:
 *                 type: string
 *               status:
 *                 type: string
 *               description:
 *                 type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *       example:
 *         id: "507f1f77bcf86cd799439060"
 *         studentId: "507f1f77bcf86cd799439011"
 *         scheduleId: "507f1f77bcf86cd799439040"
 *         name: "Bài tập về nhà tuần 1"
 *         deadline: "2025-11-30T23:59:59.000Z"
 *         difficulty: "medium"
 *         subject: "Toán"
 */
