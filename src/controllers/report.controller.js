const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { reportService } = require('../services');

/**
 * Generate report for a schedule
 */
const generateReport = catchAsync(async (req, res) => {
  const reportURL = await reportService.generateReportForSchedule(req.params.scheduleId);
  res.status(httpStatus.CREATED).send({
    message: 'Report generated successfully',
    reportURL,
  });
});

/**
 * Get report by schedule ID
 */
const getReport = catchAsync(async (req, res) => {
  const report = await reportService.getReportByScheduleId(req.params.scheduleId);
  res.send(report);
});

module.exports = {
  generateReport,
  getReport,
};
