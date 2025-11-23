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

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Assignments
 *   description: Assignment (checklist) management and grading
 */

/**
 * @swagger
 * /assignments:
 *   post:
 *     summary: Create an assignment
 *     description: Admin and tutors can create assignments.
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
 *                 description: Schedule ID reference
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               subject:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [pending, in-progress, completed]
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
 *                     estimatedTime:
 *                       type: integer
 *                       description: In minutes
 *                     actualTime:
 *                       type: integer
 *                     assignmentUrl:
 *                       type: string
 *                     solutionUrl:
 *                       type: string
 *                     status:
 *                       type: string
 *                       enum: [pending, in-progress, completed, submitted, graded]
 *                     description:
 *                       type: string
 *             example:
 *               scheduleId: "507f1f77bcf86cd799439040"
 *               name: "Bài tập buổi 1"
 *               description: "Giải hệ phương trình"
 *               subject: "Toán"
 *               tasks:
 *                 - name: "Bài 3 – Giải hệ bằng phương pháp thế"
 *                   estimatedTime: 10
 *                   assignmentUrl: "https://example.com/assignment.pdf"
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Assignment'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   get:
 *     summary: Get all assignments
 *     description: Admin, students, and tutors can retrieve assignments.
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
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: sort by query in the form of field:desc/asc
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         default: 10
 *         description: Maximum number of results
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         default: 1
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
 *                     $ref: '#/components/schemas/Assignment'
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
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /assignments/{assignmentId}:
 *   get:
 *     summary: Get an assignment
 *     description: Admin, students, and tutors can fetch assignment details.
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
 *               $ref: '#/components/schemas/Assignment'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   patch:
 *     summary: Update an assignment
 *     description: Admin and tutors can update assignments.
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
 *               tasks:
 *                 type: array
 *                 items:
 *                   type: object
 *             example:
 *               status: "completed"
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Assignment'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   delete:
 *     summary: Delete an assignment
 *     description: Only admins can delete assignments.
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
 *         description: No content
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /assignments/{assignmentId}/tasks/{taskId}/submit:
 *   patch:
 *     summary: Submit assignment task
 *     description: Students can submit their assignment task solutions.
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
 *                 description: Time spent in minutes
 *               solutionUrl:
 *                 type: string
 *                 description: URL to solution file
 *               status:
 *                 type: string
 *                 enum: [submitted]
 *               description:
 *                 type: string
 *             example:
 *               actualTime: 15
 *               solutionUrl: "https://example.com/my-solution.pdf"
 *               status: "submitted"
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Assignment'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Assignment:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         scheduleId:
 *           type: string
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         subject:
 *           type: string
 *         status:
 *           type: string
 *           enum: [pending, in-progress, completed]
 *         tasks:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               name:
 *                 type: string
 *               estimatedTime:
 *                 type: integer
 *               actualTime:
 *                 type: integer
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
 *         id: "507f1f77bcf86cd799439050"
 *         scheduleId: "507f1f77bcf86cd799439040"
 *         name: "Bài tập buổi 1"
 *         subject: "Toán"
 *         status: "in-progress"
 *         tasks:
 *           - id: "507f1f77bcf86cd799439051"
 *             name: "Bài 3"
 *             estimatedTime: 10
 *             actualTime: 12
 *             status: "completed"
 */
