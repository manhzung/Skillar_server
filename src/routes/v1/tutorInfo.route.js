const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const tutorInfoValidation = require('../../validations/tutorInfo.validation');
const tutorInfoController = require('../../controllers/tutorInfo.controller');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .post(auth(['admin', 'student', 'tutor']), validate(tutorInfoValidation.createTutorInfo), tutorInfoController.createTutorInfo)
  .get(auth(['admin', 'student', 'tutor']), validate(tutorInfoValidation.getTutorInfo), tutorInfoController.getTutorInfo)
  .patch(auth(['admin', 'student', 'tutor']), validate(tutorInfoValidation.updateTutorInfo), tutorInfoController.updateTutorInfo)
  .delete(auth(['admin', 'student', 'tutor']), validate(tutorInfoValidation.deleteTutorInfo), tutorInfoController.deleteTutorInfo);

/**
 * @swagger
 * /tutors/{userId}/info:
 *   post:
 *     summary: Create tutor information
 *     description: Only admins can create tutor information
 *     tags: [TutorInfo]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID of the tutor
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               subjects:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Mathematics", "Physics"]
 *               experience:
 *                 type: string
 *                 example: "5 years of teaching experience"
 *               qualification:
 *                 type: string
 *                 example: "Master's in Mathematics"
 *               specialties:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Calculus", "Algebra"]
 *               bio:
 *                 type: string
 *                 example: "Experienced tutor specializing in mathematics"
 *               cvUrl:
 *                 type: string
 *                 format: uri
 *                 example: "https://example.com/cv.pdf"
 *               rating:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 5
 *                 example: 4.5
 *               totalStudents:
 *                 type: integer
 *                 minimum: 0
 *                 example: 50
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
 *                 userId:
 *                   type: string
 *                 subjects:
 *                   type: array
 *                   items:
 *                     type: string
 *                 experience:
 *                   type: string
 *                 qualification:
 *                   type: string
 *                 specialties:
 *                   type: array
 *                   items:
 *                     type: string
 *                 bio:
 *                   type: string
 *                 cvUrl:
 *                   type: string
 *                 rating:
 *                   type: number
 *                 totalStudents:
 *                   type: integer
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
 *     summary: Get tutor information
 *     description: Students, tutors, and admins can retrieve tutor information
 *     tags: [TutorInfo]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID of the tutor
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
 *                 userId:
 *                   type: string
 *                 subjects:
 *                   type: array
 *                   items:
 *                     type: string
 *                 experience:
 *                   type: string
 *                 qualification:
 *                   type: string
 *                 specialties:
 *                   type: array
 *                   items:
 *                     type: string
 *                 bio:
 *                   type: string
 *                 cvUrl:
 *                   type: string
 *                 rating:
 *                   type: number
 *                 totalStudents:
 *                   type: integer
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
 *     summary: Update tutor information
 *     description: Admins and tutors can update tutor information
 *     tags: [TutorInfo]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID of the tutor
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               subjects:
 *                 type: array
 *                 items:
 *                   type: string
 *               experience:
 *                 type: string
 *               qualification:
 *                 type: string
 *               specialties:
 *                 type: array
 *                 items:
 *                   type: string
 *               bio:
 *                 type: string
 *               cvUrl:
 *                 type: string
 *                 format: uri
 *               rating:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 5
 *               totalStudents:
 *                 type: integer
 *                 minimum: 0
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
 *                 userId:
 *                   type: string
 *                 subjects:
 *                   type: array
 *                   items:
 *                     type: string
 *                 experience:
 *                   type: string
 *                 qualification:
 *                   type: string
 *                 specialties:
 *                   type: array
 *                   items:
 *                     type: string
 *                 bio:
 *                   type: string
 *                 cvUrl:
 *                   type: string
 *                 rating:
 *                   type: number
 *                 totalStudents:
 *                   type: integer
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
 *     summary: Delete tutor information
 *     description: Only admins can delete tutor information
 *     tags: [TutorInfo]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID of the tutor
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

