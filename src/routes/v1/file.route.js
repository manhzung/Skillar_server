const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const fileValidation = require('../../validations/file.validation');
const fileController = require('../../controllers/file.controller');
const { upload } = require('../../config/cloudinary');

const router = express.Router();

router
  .route('/upload')
  .post(auth(['admin', 'student', 'tutor']), upload.single('file'), fileController.uploadFile);

router
  .route('/upload-multiple')
  .post(auth(['admin', 'student', 'tutor']), upload.array('files', 10), fileController.uploadMultipleFiles);

router
  .route('/:publicId')
  .delete(auth(['admin']), validate(fileValidation.deleteFile), fileController.deleteFile);

/**
 * @swagger
 * /files/upload:
 *   post:
 *     summary: Upload a single file
 *     description: Logged in users can upload files
 *     tags: [Files]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: File to upload
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "File uploaded successfully"
 *                 file:
 *                   type: object
 *                   properties:
 *                     publicId:
 *                       type: string
 *                     url:
 *                       type: string
 *                       format: uri
 *                     format:
 *                       type: string
 *                     width:
 *                       type: integer
 *                     height:
 *                       type: integer
 *                     bytes:
 *                       type: integer
 *       "400":
 *         description: Bad Request
 *       "401":
 *         description: Unauthorized
 */

/**
 * @swagger
 * /files/upload-multiple:
 *   post:
 *     summary: Upload multiple files
 *     description: Logged in users can upload multiple files (max 10)
 *     tags: [Files]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - files
 *             properties:
 *               files:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Files to upload (max 10)
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "3 files uploaded successfully"
 *                 files:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       publicId:
 *                         type: string
 *                       url:
 *                         type: string
 *                         format: uri
 *                       format:
 *                         type: string
 *                       width:
 *                         type: integer
 *                       height:
 *                         type: integer
 *                       bytes:
 *                         type: integer
 *       "400":
 *         description: Bad Request
 *       "401":
 *         description: Unauthorized
 */

/**
 * @swagger
 * /files/{publicId}:
 *   delete:
 *     summary: Delete a file
 *     description: Only admins can delete files
 *     tags: [Files]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: publicId
 *         required: true
 *         schema:
 *           type: string
 *         description: File public ID from Cloudinary
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "File deleted successfully"
 *       "401":
 *         description: Unauthorized
 *       "403":
 *         description: Forbidden
 *       "404":
 *         description: Not Found
 */

module.exports = router;

