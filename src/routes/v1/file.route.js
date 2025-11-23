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

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Files
 *   description: File upload and management using Cloudinary
 */

/**
 * @swagger
 * /files/upload:
 *   post:
 *     summary: Upload a file
 *     description: Authenticated users can upload files (images, PDFs, documents) to Cloudinary.
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
 *                 description: File to upload (max 10MB)
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
 *                     url:
 *                       type: string
 *                       description: Cloudinary URL of uploaded file
 *                     publicId:
 *                       type: string
 *                       description: Cloudinary public ID
 *                     format:
 *                       type: string
 *                     resourceType:
 *                       type: string
 *                     bytes:
 *                       type: integer
 *             example:
 *               message: "File uploaded successfully"
 *               file:
 *                 url: "https://res.cloudinary.com/demo/image/upload/v1/skillar/file123.jpg"
 *                 publicId: "skillar/file123"
 *                 format: "jpg"
 *                 resourceType: "image"
 *                 bytes: 204800
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /files/upload-multiple:
 *   post:
 *     summary: Upload multiple files
 *     description: Authenticated users can upload up to 10 files at once.
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
 *                 description: Files to upload (max 10 files, 10MB each)
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
 *                       url:
 *                         type: string
 *                       publicId:
 *                         type: string
 *                       format:
 *                         type: string
 *                       resourceType:
 *                         type: string
 *                       bytes:
 *                         type: integer
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 */

/**
 * @swagger
 * /files/{publicId}:
 *   delete:
 *     summary: Delete a file
 *     description: Only admins can delete files from Cloudinary.
 *     tags: [Files]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: publicId
 *         required: true
 *         schema:
 *           type: string
 *         description: Cloudinary public ID (e.g., "skillar/file123")
 *         example: "skillar/file123"
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
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "500":
 *         $ref: '#/components/responses/InternalServerError'
 */
