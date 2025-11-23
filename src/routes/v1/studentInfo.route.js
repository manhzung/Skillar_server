const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const studentInfoValidation = require('../../validations/studentInfo.validation');
const studentInfoController = require('../../controllers/studentInfo.controller');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .post(auth(['admin']), validate(studentInfoValidation.createStudentInfo), studentInfoController.createStudentInfo)
  .get(auth(['admin', 'student', 'parent']), validate(studentInfoValidation.getStudentInfo), studentInfoController.getStudentInfo)
  .patch(auth(['admin']), validate(studentInfoValidation.updateStudentInfo), studentInfoController.updateStudentInfo)
  .delete(auth(['admin']), validate(studentInfoValidation.deleteStudentInfo), studentInfoController.deleteStudentInfo);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: StudentInfo
 *   description: Student extended information management
 */

/**
 * @swagger
 * /students/{userId}/info:
 *   post:
 *     summary: Create student info
 *     description: Only admins can create student extended information.
 *     tags: [StudentInfo]
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
 *               school:
 *                 type: string
 *                 description: School name
 *               grade:
 *                 type: string
 *                 description: Current grade/class
 *               parentId:
 *                 type: string
 *                 description: Parent user ID reference
 *               parentRequest:
 *                 type: string
 *                 description: Parent's requests or expectations
 *               hobbies:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Student's hobbies
 *               favoriteSubjects:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Favorite subjects
 *               strengths:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Student's strengths
 *               improvements:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Areas for improvement
 *               notes:
 *                 type: string
 *                 description: Additional notes
 *             example:
 *               school: "THCS Nguyễn Du"
 *               grade: "Lớp 7A1"
 *               parentId: "507f1f77bcf86cd799439030"
 *               parentRequest: "Cải thiện khả năng trình bày"
 *               hobbies: ["Bóng đá", "Âm nhạc"]
 *               favoriteSubjects: ["Toán", "Vật lý"]
 *               strengths: ["Tư duy logic tốt"]
 *               improvements: ["Quản lý thời gian"]
 *               notes: "Học sinh tốt"
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StudentInfo'
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
 *     summary: Get student info
 *     description: Admin, student, and parent can retrieve student information.
 *     tags: [StudentInfo]
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
 *               $ref: '#/components/schemas/StudentInfo'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   patch:
 *     summary: Update student info
 *     description: Only admins can update student information.
 *     tags: [StudentInfo]
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
 *               school:
 *                 type: string
 *               grade:
 *                 type: string
 *               parentId:
 *                 type: string
 *               parentRequest:
 *                 type: string
 *               hobbies:
 *                 type: array
 *                 items:
 *                   type: string
 *               favoriteSubjects:
 *                 type: array
 *                 items:
 *                   type: string
 *               strengths:
 *                 type: array
 *                 items:
 *                   type: string
 *               improvements:
 *                 type: array
 *                 items:
 *                   type: string
 *               notes:
 *                 type: string
 *             example:
 *               grade: "Lớp 8A1"
 *               notes: "Đã cải thiện nhiều"
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StudentInfo'
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
 *     summary: Delete student info
 *     description: Only admins can delete student information.
 *     tags: [StudentInfo]
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
 *     StudentInfo:
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
 *             currentLevel:
 *               type: string
 *         school:
 *           type: string
 *         grade:
 *           type: string
 *         parentId:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *             name:
 *               type: string
 *             email:
 *               type: string
 *             phone:
 *               type: string
 *         parentRequest:
 *           type: string
 *         hobbies:
 *           type: array
 *           items:
 *             type: string
 *         favoriteSubjects:
 *           type: array
 *           items:
 *             type: string
 *         strengths:
 *           type: array
 *           items:
 *             type: string
 *         improvements:
 *           type: array
 *           items:
 *             type: string
 *         notes:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *       example:
 *         id: "507f1f77bcf86cd799439020"
 *         userId:
 *           id: "507f1f77bcf86cd799439011"
 *           name: "Nguyễn Văn A"
 *           email: "student@skillar.com"
 *           role: "student"
 *         school: "THCS Nguyễn Du"
 *         grade: "Lớp 7A1"
 *         parentId:
 *           id: "507f1f77bcf86cd799439030"
 *           name: "Phạm Văn X"
 *         hobbies: ["Bóng đá", "Âm nhạc"]
 *         favoriteSubjects: ["Toán", "Vật lý"]
 */
