const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const reviewValidation = require('../../validations/review.validation');
const reviewController = require('../../controllers/review.controller');

const router = express.Router();

router
  .route('/')
  .post(auth(['tutor','admin']), validate(reviewValidation.createReview), reviewController.createReview)
  .get(auth(['admin', 'student', 'parent', 'tutor']), validate(reviewValidation.getReviews), reviewController.getReviews);

router
  .route('/:reviewId')
  .get(auth(['admin', 'student', 'parent', 'tutor']), validate(reviewValidation.getReview), reviewController.getReview)
  .patch(auth(['tutor','admin']), validate(reviewValidation.updateReview), reviewController.updateReview)
  .delete(auth(['admin']), validate(reviewValidation.deleteReview), reviewController.deleteReview);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Reviews
 *   description: Daily review and student evaluation management
 */

/**
 * @swagger
 * /reviews:
 *   post:
 *     summary: Create a review
 *     description: Tutors can create daily reviews for students.
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
 *               - scheduleId
 *             properties:
 *               scheduleId:
 *                 type: string
 *                 description: Schedule ID reference
 *               overallRating:
 *                 type: string
 *                 description: Overall rating/summary
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
 *                       description: Criteria name (e.g., "Sự tập trung")
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
 *                   required:
 *                     - taskId
 *                   properties:
 *                     taskId:
 *                       type: string
 *                     result:
 *                       type: number
 *                       minimum: 0
 *                       maximum: 100
 *                     comment:
 *                       type: string
 *             example:
 *               scheduleId: "507f1f77bcf86cd799439040"
 *               overallRating: "Học sinh tiến bộ tốt"
 *               reviews:
 *                 - name: "Sự tập trung"
 *                   rating: 4
 *                   comment: "Tập trung tốt"
 *                 - name: "Hiểu bài"
 *                   rating: 4
 *                   comment: "Nắm vững kiến thức"
 *               assignmentGrades:
 *                 - taskId: "507f1f77bcf86cd799439051"
 *                   result: 85
 *                   comment: "Làm tốt"
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Review'
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   get:
 *     summary: Get all reviews
 *     description: Admin, students, parents, and tutors can retrieve reviews.
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: scheduleId
 *         schema:
 *           type: string
 *         description: Filter by schedule ID
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
 *                     $ref: '#/components/schemas/Review'
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
 * /reviews/{reviewId}:
 *   get:
 *     summary: Get a review
 *     description: Admin, students, parents, and tutors can fetch review details.
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
 *               $ref: '#/components/schemas/Review'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   patch:
 *     summary: Update a review
 *     description: Tutors can update their reviews.
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reviewId
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
 *               overallRating:
 *                 type: string
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
 *             example:
 *               overallRating: "Updated rating"
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Review'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   delete:
 *     summary: Delete a review
 *     description: Only admins can delete reviews.
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reviewId
 *         required: true
 *         schema:
 *           type: string
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
 * components:
 *   schemas:
 *     Review:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         scheduleId:
 *           type: string
 *         overallRating:
 *           type: string
 *         reviews:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *               comment:
 *                 type: string
 *         assignmentGrades:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               taskId:
 *                 type: string
 *               result:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 100
 *               comment:
 *                 type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *       example:
 *         id: "507f1f77bcf86cd799439070"
 *         scheduleId: "507f1f77bcf86cd799439040"
 *         overallRating: "Học sinh tiến bộ tốt"
 *         reviews:
 *           - name: "Sự tập trung"
 *             rating: 4
 *             comment: "Tập trung tốt"
 *         assignmentGrades:
 *           - taskId: "507f1f77bcf86cd799439051"
 *             result: 85
 *             comment: "Làm tốt"
 */
