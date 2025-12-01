const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const studentInfoValidation = require('../../validations/studentInfo.validation');
const studentInfoController = require('../../controllers/studentInfo.controller');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .post(auth(['admin','tutor', 'student']), validate(studentInfoValidation.createStudentInfo), studentInfoController.createStudentInfo)
  .get(auth(['admin','tutor', 'student', 'parent']), validate(studentInfoValidation.getStudentInfo), studentInfoController.getStudentInfo)
  .patch(auth(['admin','tutor', 'student']), validate(studentInfoValidation.updateStudentInfo), studentInfoController.updateStudentInfo)
  .delete(auth(['admin','tutor', 'student']), validate(studentInfoValidation.deleteStudentInfo), studentInfoController.deleteStudentInfo);

/**
 * @swagger
 * /students/{userId}/info:
 *   post:
 *     summary: Create student information
 *     description: Only admins can create student information
 *     tags: [StudentInfo]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID of the student
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               school:
 *                 type: string
 *                 example: "ABC High School"
 *               grade:
 *                 type: string
 *                 example: "Grade 10"
 *               parent1Name:
 *                 type: string
 *                 example: "John Parent"
 *               parent1Email:
 *                 type: string
 *                 format: email
 *                 example: "parent1@example.com"
 *               parent1Number:
 *                 type: string
 *                 example: "+84123456789"
 *               parent1Request:
 *                 type: string
 *                 example: "Focus on algebra"
 *               parent2Name:
 *                 type: string
 *                 example: "Jane Parent"
 *               parent2Email:
 *                 type: string
 *                 format: email
 *                 example: "parent2@example.com"
 *               parent2Number:
 *                 type: string
 *                 example: "+84987654321"
 *               parent2Request:
 *                 type: string
 *                 example: "Help with geometry"
 *               academicLevel:
 *                 type: string
 *                 example: "Intermediate"
 *               hobbies:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Reading", "Sports"]
 *               favoriteSubjects:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Mathematics", "Physics"]
 *               strengths:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Problem solving", "Critical thinking"]
 *               improvements:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Time management", "Note taking"]
 *               notes:
 *                 type: string
 *                 example: "Student needs extra help with calculus"
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
 *                 school:
 *                   type: string
 *                 grade:
 *                   type: string
 *                 parent1Name:
 *                   type: string
 *                 parent1Email:
 *                   type: string
 *                 parent1Number:
 *                   type: string
 *                 parent1Request:
 *                   type: string
 *                 parent2Name:
 *                   type: string
 *                 parent2Email:
 *                   type: string
 *                 parent2Number:
 *                   type: string
 *                 parent2Request:
 *                   type: string
 *                 academicLevel:
 *                   type: string
 *                 hobbies:
 *                   type: array
 *                   items:
 *                     type: string
 *                 favoriteSubjects:
 *                   type: array
 *                   items:
 *                     type: string
 *                 strengths:
 *                   type: array
 *                   items:
 *                     type: string
 *                 improvements:
 *                   type: array
 *                   items:
 *                     type: string
 *                 notes:
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
 *     summary: Get student information
 *     description: Students, parents, and admins can retrieve student information
 *     tags: [StudentInfo]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID of the student
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
 *                 school:
 *                   type: string
 *                 grade:
 *                   type: string
 *                 parent1Name:
 *                   type: string
 *                 parent1Email:
 *                   type: string
 *                 parent1Number:
 *                   type: string
 *                 parent1Request:
 *                   type: string
 *                 parent2Name:
 *                   type: string
 *                 parent2Email:
 *                   type: string
 *                 parent2Number:
 *                   type: string
 *                 parent2Request:
 *                   type: string
 *                 academicLevel:
 *                   type: string
 *                 hobbies:
 *                   type: array
 *                   items:
 *                     type: string
 *                 favoriteSubjects:
 *                   type: array
 *                   items:
 *                     type: string
 *                 strengths:
 *                   type: array
 *                   items:
 *                     type: string
 *                 improvements:
 *                   type: array
 *                   items:
 *                     type: string
 *                 notes:
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
 *     summary: Update student information
 *     description: Only admins can update student information
 *     tags: [StudentInfo]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID of the student
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
 *               parent1Name:
 *                 type: string
 *               parent1Email:
 *                 type: string
 *                 format: email
 *               parent1Number:
 *                 type: string
 *               parent1Request:
 *                 type: string
 *               parent2Name:
 *                 type: string
 *               parent2Email:
 *                 type: string
 *                 format: email
 *               parent2Number:
 *                 type: string
 *               parent2Request:
 *                 type: string
 *               academicLevel:
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
 *                 school:
 *                   type: string
 *                 grade:
 *                   type: string
 *                 parent1Name:
 *                   type: string
 *                 parent1Email:
 *                   type: string
 *                 parent1Number:
 *                   type: string
 *                 parent1Request:
 *                   type: string
 *                 parent2Name:
 *                   type: string
 *                 parent2Email:
 *                   type: string
 *                 parent2Number:
 *                   type: string
 *                 parent2Request:
 *                   type: string
 *                 academicLevel:
 *                   type: string
 *                 hobbies:
 *                   type: array
 *                   items:
 *                     type: string
 *                 favoriteSubjects:
 *                   type: array
 *                   items:
 *                     type: string
 *                 strengths:
 *                   type: array
 *                   items:
 *                     type: string
 *                 improvements:
 *                   type: array
 *                   items:
 *                     type: string
 *                 notes:
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
 *     summary: Delete student information
 *     description: Only admins can delete student information
 *     tags: [StudentInfo]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID of the student
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
