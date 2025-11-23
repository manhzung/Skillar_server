const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const tutorInfoValidation = require('../../validations/tutorInfo.validation');
const tutorInfoController = require('../../controllers/tutorInfo.controller');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .post(auth(['admin']), validate(tutorInfoValidation.createTutorInfo), tutorInfoController.createTutorInfo)
  .get(auth(['admin', 'student', 'tutor']), validate(tutorInfoValidation.getTutorInfo), tutorInfoController.getTutorInfo)
  .patch(auth(['admin', 'tutor']), validate(tutorInfoValidation.updateTutorInfo), tutorInfoController.updateTutorInfo)
  .delete(auth(['admin']), validate(tutorInfoValidation.deleteTutorInfo), tutorInfoController.deleteTutorInfo);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: TutorInfo
 *   description: Tutor extended information management
 */

/**
 * @swagger
 * /tutors/{userId}/info:
 *   post:
 *     summary: Create tutor info
 *     description: Only admins can create tutor extended information.
 *     tags: [TutorInfo]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               subjects:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Subjects taught
 *               experience:
 *                 type: string
 *                 description: Teaching experience
 *               qualification:
 *                 type: string
 *                 description: Educational qualifications
 *               specialties:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Special areas of expertise
 *               bio:
 *                 type: string
 *                 description: Biography
 *               cvUrl:
 *                 type: string
 *                 description: CV/Resume URL
 *               rating:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 5
 *                 description: Average rating
 *               totalStudents:
 *                 type: integer
 *                 minimum: 0
 *                 description: Total students taught
 *             example:
 *               subjects: ["Toán", "Vật lý"]
 *               experience: "5 năm giảng dạy THCS & THPT"
 *               qualification: "Cử nhân Sư phạm Toán"
 *               specialties: ["Toán nâng cao", "Luyện thi chuyên"]
 *               bio: "Đam mê giảng dạy"
 *               cvUrl: "https://example.com/cv.pdf"
 *               rating: 4.8
 *               totalStudents: 45
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TutorInfo'
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
 *     summary: Get tutor info
 *     description: Admin, student, and tutor can retrieve tutor information.
 *     tags: [TutorInfo]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TutorInfo'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   patch:
 *     summary: Update tutor info
 *     description: Admins and tutors can update tutor information.
 *     tags: [TutorInfo]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
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
 *               rating:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 5
 *               totalStudents:
 *                 type: integer
 *                 minimum: 0
 *             example:
 *               experience: "6 năm giảng dạy"
 *               rating: 4.9
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TutorInfo'
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   delete:
 *     summary: Delete tutor info
 *     description: Only admins can delete tutor information.
 *     tags: [TutorInfo]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
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
 *     TutorInfo:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         userId:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *             name:
 *               type: string
 *             email:
 *               type: string
 *             role:
 *               type: string
 *             phone:
 *               type: string
 *             avatarUrl:
 *               type: string
 *             address:
 *               type: string
 *         subjects:
 *           type: array
 *           items:
 *             type: string
 *         experience:
 *           type: string
 *         qualification:
 *           type: string
 *         specialties:
 *           type: array
 *           items:
 *             type: string
 *         bio:
 *           type: string
 *         cvUrl:
 *           type: string
 *         rating:
 *           type: number
 *         totalStudents:
 *           type: integer
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *       example:
 *         id: "507f1f77bcf86cd799439021"
 *         userId:
 *           id: "507f1f77bcf86cd799439012"
 *           name: "Nguyễn Thị B"
 *           email: "tutor@skillar.com"
 *           role: "tutor"
 *         subjects: ["Toán", "Vật lý"]
 *         experience: "5 năm giảng dạy"
 *         qualification: "Cử nhân Sư phạm Toán"
 *         specialties: ["Toán nâng cao"]
 *         bio: "Đam mê giảng dạy"
 *         rating: 4.8
 *         totalStudents: 45
 */
