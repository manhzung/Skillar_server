const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const reviewValidation = require('../../validations/review.validation');
const reviewController = require('../../controllers/review.controller');

const router = express.Router();

router
  .route('/')
  .post(auth(['tutor','admin','student']), validate(reviewValidation.createReview), reviewController.createReview)
  .get(auth(['admin', 'student', 'parent', 'tutor']), validate(reviewValidation.getReviews), reviewController.getReviews);

router
  .route('/assignment/:assignmentID')
  .get(auth(['admin', 'student', 'parent', 'tutor']), validate(reviewValidation.getReviewByAssignmentId), reviewController.getReviewByAssignmentId);

router
  .route('/:reviewId')
  .get(auth(['admin', 'student', 'parent', 'tutor']), validate(reviewValidation.getReview), reviewController.getReview)
  .patch(auth(['tutor','admin','student']), validate(reviewValidation.updateReview), reviewController.updateReview)
  .delete(auth(['admin','student','tutor']), validate(reviewValidation.deleteReview), reviewController.deleteReview);

/**
 * @swagger
 * /reviews:
 *   post:
 *     summary: Create a new review
 *     description: Only tutors and admins can create reviews
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - assignmentID
 *             properties:
 *               assignmentID:
 *                 type: string
 *                 description: Assignment ID
 *                 example: "507f1f77bcf86cd799439011"
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
 *                       example: "507f1f77bcf86cd799439012"
 *                     result:
 *                       type: number
 *                       minimum: 0
 *                       maximum: 100
 *                       example: 85
 *                     comment:
 *                       type: string
 *                       example: "Well done, minor mistakes"
 *               comment:
 *                 type: string
 *                 description: Overall review comment
 *                 example: "Good progress overall"
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
 *                 assignmentID:
 *                   type: string
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
 *                 comment:
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
 *
 *   get:
 *     summary: Get all reviews
 *     description: Logged in users can retrieve all reviews
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: assignmentID
 *         schema:
 *           type: string
 *         description: Filter by assignment ID
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
 *                       assignmentID:
 *                         type: string
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
 *                       comment:
 *                         type: string
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
 * /reviews/assignment/{assignmentID}:
 *   get:
 *     summary: Get a review by assignment ID
 *     description: Logged in users can fetch review information by assignment ID
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: assignmentID
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
 *                 assignmentID:
 *                   type: string
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
 *                 comment:
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
 */

/**
 * @swagger
 * /reviews/{reviewId}:
 *   get:
 *     summary: Get a review
 *     description: Logged in users can fetch review information
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reviewId
 *         required: true
 *         schema:
 *           type: string
 *         description: Review ID
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
 *                 assignmentID:
 *                   type: string
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
 *                 comment:
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
 *     summary: Update a review
 *     description: Only tutors and admins can update reviews
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reviewId
 *         required: true
 *         schema:
 *           type: string
 *         description: Review ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
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
 *               comment:
 *                 type: string
 *                 description: Overall review comment
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
 *                 assignmentID:
 *                   type: string
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
 *                 comment:
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
 *     summary: Delete a review
 *     description: Only admins can delete reviews
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reviewId
 *         required: true
 *         schema:
 *           type: string
 *         description: Review ID
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
