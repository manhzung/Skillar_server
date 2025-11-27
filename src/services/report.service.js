const puppeteer = require('puppeteer');
const httpStatus = require('http-status');
const { Schedule, Assignment, Review } = require('../models');
const { cloudinary } = require('../config/cloudinary');
const { generateReportHTML } = require('./htmlTemplate.service');
const ApiError = require('../utils/ApiError');

/**
 * Generate PDF report for a schedule
 * @param {ObjectId} scheduleId - Schedule ID
 * @returns {Promise<string>} Cloudinary URL of the generated PDF
 */
const generateReportForSchedule = async (scheduleId) => {
  // Fetch schedule with populated student and tutor
  const schedule = await Schedule.findById(scheduleId).populate('studentId').populate('tutorId');

  if (!schedule) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Schedule not found');
  }

  // Fetch all assignments for this schedule
  const assignments = await Assignment.find({ scheduleId }).lean();

  // Fetch all reviews for assignments in this schedule
  // Note: Review model mới chỉ có assignmentID, không có scheduleId
  const assignmentIds = assignments.map(a => a._id);
  const reviews = await Review.find({ assignmentID: { $in: assignmentIds } }).lean();
  
  // Create a map of assignmentID -> review for easy lookup
  const reviewMap = {};
  reviews.forEach(review => {
    reviewMap[review.assignmentID.toString()] = review;
  });

  // Prepare report data
  const reportData = {
    schedule: {
      subjectCode: schedule.subjectCode,
      startTime: schedule.startTime,
      duration: schedule.duration,
      status: schedule.status,
    },
    student: {
      name: schedule.studentId?.name || 'N/A',
      email: schedule.studentId?.email || '',
    },
    tutor: {
      name: schedule.tutorId?.name || 'N/A',
      email: schedule.tutorId?.email || '',
    },
    // Tổng quan - lấy từ schedule.note
    summary: schedule.note || 'N/A',
    
    // Checklist data from assignments
    checklist: {
      // Simple checklist - danh sách assignments với status
      simple: assignments.map(assignment => ({
        name: assignment.name,
        status: assignment.status === 'completed' ? 'done' : 'not_done',
      })),
      
      // Detailed checklist - grouped by assignments and their tasks
      assignments: assignments.map(assignment => {
        const assignmentReview = reviewMap[assignment._id.toString()];
        
        return {
          assignmentName: assignment.name,
          tasks: assignment.tasks.map(task => {
            // Tìm grade cho task này từ assignmentGrades nếu có
            const taskGrade = assignmentReview?.assignmentGrades?.find(
              grade => grade.taskId.toString() === task._id.toString()
            );
            
            return {
              name: task.name,
              estimatedTime: task.estimatedTime,
              actualTime: task.actualTime || 0,
              status: task.status,
              description: task.description || 'N/A',
              note: task.note || 'N/A', // Thêm field note mới
              result: taskGrade?.result, // Kết quả đánh giá từ Review
              gradeComment: taskGrade?.comment || 'N/A', // Comment cho task từ Review
            };
          }),
        };
      }),
    },
    
    // Evaluation criteria - lấy từ schedule.reviews (đã chuyển sang Schedule model)
    criteria: schedule.reviews && schedule.reviews.length > 0 ? schedule.reviews.map(item => ({
      metric: item.name,
      description: '', // reviewItemSchema không có description
      rating: item.rating,
      note: item.comment || 'N/A',
    })) : [],
    
    // General comment - lấy từ schedule.overallRating (đã chuyển sang Schedule model)
    generalComment: schedule.overallRating || 'N/A',
  };

  // Generate HTML
  const html = generateReportHTML(reportData);

  // Launch puppeteer and generate PDF
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });

    // Generate PDF buffer
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20px',
        right: '20px',
        bottom: '20px',
        left: '20px',
      },
    });

    await browser.close();

    // Upload to Cloudinary
    const reportURL = await uploadReportToCloudinary(pdfBuffer, scheduleId);

    // Update schedule with reportURL
    schedule.reportURL = reportURL;
    await schedule.save();

    return reportURL;
  } catch (error) {
    await browser.close();
    throw error;
  }
};

/**
 * Upload PDF buffer to Cloudinary
 * @param {Buffer} pdfBuffer - PDF file buffer
 * @param {ObjectId} scheduleId - Schedule ID for filename
 * @returns {Promise<string>} Cloudinary URL
 */
const uploadReportToCloudinary = async (pdfBuffer, scheduleId) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'skillar/reports',
        resource_type: 'raw',
        public_id: `report_${scheduleId}_${Date.now()}`,
        format: 'pdf',
        access_mode: 'public', // Make file publicly accessible
        type: 'upload', // Ensures public URL
      },
      (error, result) => {
        if (error) {
          reject(new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to upload PDF to Cloudinary'));
        } else {
          resolve(result.secure_url);
        }
      }
    );

    // Write buffer to stream
    uploadStream.end(pdfBuffer);
  });
};

/**
 * Get report URL by schedule ID
 * @param {ObjectId} scheduleId - Schedule ID
 * @returns {Promise<Object>} Schedule with reportURL
 */
const getReportByScheduleId = async (scheduleId) => {
  const schedule = await Schedule.findById(scheduleId).select('reportURL subjectCode startTime').populate('tutorId', 'name');

  if (!schedule) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Schedule not found');
  }

  return {
    id: schedule._id,
    subjectCode: schedule.subjectCode,
    startTime: schedule.startTime,
    tutor: schedule.tutorId?.name,
    reportURL: schedule.reportURL,
  };
};

module.exports = {
  generateReportForSchedule,
  getReportByScheduleId,
  uploadReportToCloudinary,
};
