const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const reportValidation = require('../../validations/report.validation');
const reportController = require('../../controllers/report.controller');

const router = express.Router();

router
  .route('/generate/:scheduleId')
  .post(auth(['admin', 'tutor','student','parent']), validate(reportValidation.generateReport), reportController.generateReport);

router
  .route('/:scheduleId')
  .get(auth(['admin', 'student', 'parent', 'tutor']), validate(reportValidation.getReport), reportController.getReport);

/**
 * @swagger
 * /reports/generate/{scheduleId}:
 *   post:
 *     summary: Generate PDF report for a schedule
 *     description: Only tutors and admins can generate reports for completed sessions.
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: scheduleId
 *         required: true
 *         schema:
 *           type: string
 *         description: Schedule ID
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
 *                   example: Report generated successfully
 *                 reportURL:
 *                   type: string
 *                   example: https://res.cloudinary.com/demo/raw/upload/v1/skillar/reports/report_abc123.pdf
 *       "401":
 *         description: Unauthorized
 *       "403":
 *         description: Forbidden
 *       "404":
 *         description: Not Found
 */

/**
 * @swagger
 * /reports/{scheduleId}:
 *   get:
 *     summary: Get report URL for a schedule
 *     description: Logged in users can retrieve report URLs for their schedules.
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: scheduleId
 *         required: true
 *         schema:
 *           type: string
 *         description: Schedule ID
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
 *                 subjectCode:
 *                   type: string
 *                 startTime:
 *                   type: string
 *                   format: date-time
 *                 tutor:
 *                   type: string
 *                 reportURL:
 *                   type: string
 *                   example: https://res.cloudinary.com/demo/raw/upload/v1/skillar/reports/report_abc123.pdf
 *       "401":
 *         description: Unauthorized
 *       "404":
 *         description: Not Found
 */

module.exports = router;
