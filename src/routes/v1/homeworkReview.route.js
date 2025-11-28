const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const homeworkReviewValidation = require('../../validations/homeworkReview.validation');
const homeworkReviewController = require('../../controllers/homeworkReview.controller');

const router = express.Router();

router
  .route('/')
  .post(auth(['tutor', 'admin']), validate(homeworkReviewValidation.createHomeworkReview), homeworkReviewController.createHomeworkReview)
  .get(auth(['admin', 'student', 'parent', 'tutor']), validate(homeworkReviewValidation.getHomeworkReviews), homeworkReviewController.getHomeworkReviews);

router
  .route('/:homeworkReviewId')
  .get(auth(['admin', 'student', 'parent', 'tutor']), validate(homeworkReviewValidation.getHomeworkReview), homeworkReviewController.getHomeworkReview)
  .patch(auth(['tutor', 'admin']), validate(homeworkReviewValidation.updateHomeworkReview), homeworkReviewController.updateHomeworkReview)
  .delete(auth(['admin', 'tutor']), validate(homeworkReviewValidation.deleteHomeworkReview), homeworkReviewController.deleteHomeworkReview);

/**
 * @swagger
 * /homework-reviews:
 *   post:
 *     summary: Create a new homework review
 *     description: Only tutors and admins can create homework reviews
 *     tags: [HomeworkReviews]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - homeworkId
 *               - overallRating
 *             properties:
 *               homeworkId:
 *                 type: string
 *                 description: Homework ID
 *                 example: "507f1f77bcf86cd799439060"
 *               overallRating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 4
 *               reviews:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - name
 *                     - rating
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: "Completion"
 *                     rating:
 *                       type: integer
 *                       minimum: 1
 *                       maximum: 5
 *                       example: 5
 *                     comment:
 *                       type: string
 *                       example: "All tasks completed on time"
 *               assignmentGrades:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - taskId
 *                   properties:
 *                     taskId:
 *                       type: string
 *                       description: Task ID from assignment
 *                       example: "507f1f77bcf86cd799439051"
 *                     result:
 *                       type: number
 *                       minimum: 0
 *                       maximum: 100
 *                       example: 90
 *                     comment:
 *                       type: string
 *                       example: "Excellent work"
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
 *                 homeworkId:
 *                   type: string
 *                 overallRating:
 *                   type: integer
 *                 reviews:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                       rating:
 *                         type: integer
 *                       comment:
 *                         type: string
 *                 assignmentGrades:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       taskId:
 *                         type: string
 *                       result:
 *                         type: number
 *                       comment:
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
 *     summary: Get all homework reviews
 *     description: Logged in users can retrieve all homework reviews
 *     tags: [HomeworkReviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: homeworkId
 *         schema:
 *           type: string
 *         description: Filter by homework ID
 *       - in: query
 *         name: studentId
 *         schema:
 *           type: string
 *         description: Filter by student ID
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
 *                       homeworkId:
 *                         type: string
 *                       overallRating:
 *                         type: integer
 *                       reviews:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             name:
 *                               type: string
 *                             rating:
 *                               type: integer
 *                             comment:
 *                               type: string
 *                       assignmentGrades:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             taskId:
 *                               type: string
 *                             result:
 *                               type: number
 *                             comment:
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
 *
 * /homework-reviews/{homeworkReviewId}:
 *   get:
 *     summary: Get a homework review
 *     description: Logged in users can fetch homework review information
 *     tags: [HomeworkReviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: homeworkReviewId
 *         required: true
 *         schema:
 *           type: string
 *         description: Homework Review ID
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
 *                 homeworkId:
 *                   type: string
 *                 overallRating:
 *                   type: integer
 *                 reviews:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                       rating:
 *                         type: integer
 *                       comment:
 *                         type: string
 *                 assignmentGrades:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       taskId:
 *                         type: string
 *                       result:
 *                         type: number
 *                       comment:
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
 *     summary: Update a homework review
 *     description: Only tutors and admins can update homework reviews
 *     tags: [HomeworkReviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: homeworkReviewId
 *         required: true
 *         schema:
 *           type: string
 *         description: Homework Review ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               overallRating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *               reviews:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     rating:
 *                       type: integer
 *                       minimum: 1
 *                       maximum: 5
 *                     comment:
 *                       type: string
 *               assignmentGrades:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     taskId:
 *                       type: string
 *                     result:
 *                       type: number
 *                       minimum: 0
 *                       maximum: 100
 *                     comment:
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
 *                 homeworkId:
 *                   type: string
 *                 overallRating:
 *                   type: integer
 *                 reviews:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                       rating:
 *                         type: integer
 *                       comment:
 *                         type: string
 *                 assignmentGrades:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       taskId:
 *                         type: string
 *                       result:
 *                         type: number
 *                       comment:
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
 *     summary: Delete a homework review
 *     description: Only admins can delete homework reviews
 *     tags: [HomeworkReviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: homeworkReviewId
 *         required: true
 *         schema:
 *           type: string
 *         description: Homework Review ID
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

module.exports = router;
