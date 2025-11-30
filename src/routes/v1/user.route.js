const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const userValidation = require('../../validations/user.validation');
const userController = require('../../controllers/user.controller');

const router = express.Router();

router
  .route('/')
  .post(auth(['admin']), validate(userValidation.createUser), userController.createUser)
  .get(auth(['admin']), validate(userValidation.getUsers), userController.getUsers);

router
  .route('/stats')
  .get(auth(['admin']), userController.getAllUserStats);

router
  .route('/stats/students-per-grade')
  .get(auth(['admin']), userController.getStudentsPerGrade);

router
  .route('/stats/tutors-per-subject')
  .get(auth(['admin']), userController.getTutorsPerSubject);

router
  .route('/stats/logged-in-count')
  .get(auth(['admin']), userController.getLoggedInUserCount);

router
  .route('/my-students')
  .get(auth(['admin', 'tutor']), userController.getStudentsByTutor);

router
  .route('/names')
  .get(auth(['admin', 'tutor', 'student']), validate(userValidation.getUserNamesAndIds), userController.getUserNamesAndIds);

router
  .route('/:userId')
  .get(auth(['admin', 'student', 'parent', 'tutor']), validate(userValidation.getUser), userController.getUser)
  .patch(auth(['admin']), validate(userValidation.updateUser), userController.updateUser)
  .delete(auth(['admin']), validate(userValidation.deleteUser), userController.deleteUser);

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     description: Only admins can create users
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - name
 *               - role
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 description: Password must contain at least one letter and one number
 *                 example: password123
 *               name:
 *                 type: string
 *                 example: John Doe
 *               role:
 *                 type: string
 *                 enum: [student, parent, tutor, admin]
 *                 example: student
 *               phone:
 *                 type: string
 *                 example: "+84123456789"
 *               birthday:
 *                 type: string
 *                 format: date-time
 *                 example: "2000-01-01T00:00:00.000Z"
 *               moreInfo:
 *                 type: string
 *                 example: "Additional information"
 *               avatarUrl:
 *                 type: string
 *                 format: uri
 *                 example: "https://example.com/avatar.jpg"
 *               address:
 *                 type: string
 *                 example: "123 Main St"
 *               currentLevel:
 *                 type: string
 *                 example: "Grade 10"
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
 *                 email:
 *                   type: string
 *                 name:
 *                   type: string
 *                 role:
 *                   type: string
 *                 phone:
 *                   type: string
 *                 birthday:
 *                   type: string
 *                   format: date-time
 *                 moreInfo:
 *                   type: string
 *                 isEmailVerified:
 *                   type: boolean
 *                 isActive:
 *                   type: boolean
 *                 avatarUrl:
 *                   type: string
 *                 address:
 *                   type: string
 *                 currentLevel:
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
 *     summary: Get all users
 *     description: Only admins can retrieve all users
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filter by name (partial match, case-insensitive)
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [student, parent, tutor, admin]
 *         description: Filter by role
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: Sort by field (e.g., createdAt:desc)
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
 *                       email:
 *                         type: string
 *                       name:
 *                         type: string
 *                       role:
 *                         type: string
 *                       phone:
 *                         type: string
 *                       birthday:
 *                         type: string
 *                         format: date-time
 *                       moreInfo:
 *                         type: string
 *                       isEmailVerified:
 *                         type: boolean
 *                       isActive:
 *                         type: boolean
 *                       avatarUrl:
 *                         type: string
 *                       address:
 *                         type: string
 *                       currentLevel:
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
 *       "403":
 *         description: Forbidden
 */

/**
 * @swagger
 * /users/names:
 *   get:
 *     summary: Get user names and IDs
 *     description: Get only user names and IDs with optional role filtering (tutor or student)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [tutor, student]
 *         description: Filter by role (tutor or student). If not provided, returns all users.
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *       "401":
 *         description: Unauthorized
 *       "403":
 *         description: Forbidden
 */

/**
 * @swagger
 * /users/my-students:
 *   get:
 *     summary: Get students taught by the current tutor
 *     description: Tutors can retrieve list of their students. Admins can use query param tutorId.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: tutorId
 *         schema:
 *           type: string
 *         description: Tutor ID (Admin only)
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   email:
 *                     type: string
 *                   name:
 *                     type: string
 *                   role:
 *                     type: string
 *                   phone:
 *                     type: string
 *                   studentInfo:
 *                     type: object
 *                     properties:
 *                       school:
 *                         type: string
 *                       grade:
 *                         type: string
 *                       parent1Name:
 *                         type: string
 *                       parent1Email:
 *                         type: string
 *                       parent1Number:
 *                         type: string
 *       "401":
 *         description: Unauthorized
 *       "403":
 *         description: Forbidden
 */

/**
 * @swagger
 * /users/stats:
 *   get:
 *     summary: Get all user statistics
 *     description: Only admins can access user statistics
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                 student:
 *                   type: integer
 *                 parent:
 *                   type: integer
 *                 tutor:
 *                   type: integer
 *                 admin:
 *                   type: integer
 *       "401":
 *         description: Unauthorized
 *       "403":
 *         description: Forbidden
 */

/**
 * @swagger
 * /users/stats/students-per-grade:
 *   get:
 *     summary: Get students distribution by grade
 *     description: Only admins can access this statistic
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   grade:
 *                     type: string
 *                   count:
 *                     type: integer
 *       "401":
 *         description: Unauthorized
 *       "403":
 *         description: Forbidden
 */

/**
 * @swagger
 * /users/stats/tutors-per-subject:
 *   get:
 *     summary: Get tutors distribution by subject
 *     description: Only admins can access this statistic
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   subject:
 *                     type: string
 *                   count:
 *                     type: integer
 *       "401":
 *         description: Unauthorized
 *       "403":
 *         description: Forbidden
 */

/**
 * @swagger
 * /users/stats/logged-in-count:
 *   get:
 *     summary: Get count of logged in users
 *     description: Only admins can access this statistic
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [student, parent, tutor, admin]
 *         description: Filter by role
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *       "401":
 *         description: Unauthorized
 *       "403":
 *         description: Forbidden
 */

/**
 * @swagger
 * /users/{userId}:
 *   get:
 *     summary: Get a user
 *     description: Logged in users can fetch their own user information. Admins can fetch any user.
 *     tags: [Users]
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
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 email:
 *                   type: string
 *                 name:
 *                   type: string
 *                 role:
 *                   type: string
 *                 phone:
 *                   type: string
 *                 birthday:
 *                   type: string
 *                   format: date-time
 *                 moreInfo:
 *                   type: string
 *                 isEmailVerified:
 *                   type: boolean
 *                 isActive:
 *                   type: boolean
 *                 avatarUrl:
 *                   type: string
 *                 address:
 *                   type: string
 *                 currentLevel:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       "401":
 *         description: Unauthorized
 *       "403":
 *         description: Forbidden
 *       "404":
 *         description: Not Found
 *
 *   patch:
 *     summary: Update a user
 *     description: Only admins can update users
 *     tags: [Users]
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
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 description: Password must contain at least one letter and one number
 *               name:
 *                 type: string
 *               phone:
 *                 type: string
 *               birthday:
 *                 type: string
 *                 format: date-time
 *               moreInfo:
 *                 type: string
 *               avatarUrl:
 *                 type: string
 *                 format: uri
 *               address:
 *                 type: string
 *               currentLevel:
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
 *                 email:
 *                   type: string
 *                 name:
 *                   type: string
 *                 role:
 *                   type: string
 *                 phone:
 *                   type: string
 *                 birthday:
 *                   type: string
 *                   format: date-time
 *                 moreInfo:
 *                   type: string
 *                 isEmailVerified:
 *                   type: boolean
 *                 isActive:
 *                   type: boolean
 *                 avatarUrl:
 *                   type: string
 *                 address:
 *                   type: string
 *                 currentLevel:
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
 *     summary: Delete a user
 *     description: Only admins can delete users
 *     tags: [Users]
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
 *         description: No Content
 *       "401":
 *         description: Unauthorized
 *       "403":
 *         description: Forbidden
 *       "404":
 *         description: Not Found
 */

module.exports = router;
