/**
 * Generate HTML template for session report
 * @param {Object} reportData - Report data including schedule, student, tutor info
 * @returns {string} HTML string for PDF generation
 */
const generateReportHTML = (reportData) => {
  const { schedule, student, tutor, criteria = [], generalComment = '', checklist = [], summary = '' } = reportData;

  // Helper to generate star rating HTML
  const generateStars = (rating) => {
    let stars = '';
    const starSvg = (filled) => `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${filled ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="star-icon ${filled ? 'filled' : ''}">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
      </svg>
    `;

    for (let i = 1; i <= 5; i++) {
      stars += starSvg(i <= rating);
    }
    return stars;
  };

  // Format date
  const formatDate = (date) => {
    const d = new Date(date);
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return d.toLocaleDateString('vi-VN', options);
  };

  // Helper to render links
  const renderLinks = (urls, label) => {
    if (!urls || urls.length === 0) return '—';
    // Handle case where urls might still be a string (legacy data)
    const urlList = Array.isArray(urls) ? urls : [urls];
    return urlList.map((url, index) => 
      `<a href="${url}" class="file-link" target="_blank">${label} ${urlList.length > 1 ? index + 1 : ''}</a>`
    ).join('<br>');
  };

  // Format time
  const formatTime = (date, duration) => {
    const start = new Date(date);
    const end = new Date(start.getTime() + duration * 60000);
    const formatHour = (d) => d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    return `${formatHour(start)} - ${formatHour(end)}`;
  };

  return `
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Báo cáo buổi học - ${schedule.subjectCode}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700&display=swap');

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Be Vietnam Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      color: #374151;
      background: #f9fafb;
      padding: 32px 20px;
      -webkit-print-color-adjust: exact;
    }
    
    .container {
      max-width: 900px;
      margin: 0 auto;
      background: #f9fafb;
    }
    
    .header {
      text-align: center;
      margin-bottom: 24px;
    }
    
    .header-top {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      margin-bottom: 20px;
    }
    
    .header-logo {
      width: 200px;
      height:100px;
      object-fit: contain;
    }
    
    .header-company {
      text-align: left;
    }
    
    .header-company-name {
      font-size: 16px;
      font-weight: 700;
      color: #111827;
      margin-bottom: 2px;
    }
    
    .header-company-address {
      font-size: 11px;
      color: #6b7280;
    }
    
    .header-title {
      background: white;
      padding: 20px 32px;
      border-radius: 12px;
      margin-bottom: 20px;
    }
    
    .header-title h1 {
      font-size: 28px;
      margin-bottom: 4px;
      font-weight: 700;
      letter-spacing: -0.01em;
      color: #111827;
    }
    
    .header-title .subtitle {
      font-size: 13px;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #6b7280;
    }
    
    .content-wrapper {
      /* No padding here, sections have their own backgrounds */
    }
    
    .student-report-label {
      text-align: center;
      margin-bottom: 24px;
    }
    
    .student-report-text {
      display: inline-block;
      background: #00bcd4;
      color: white;
      padding: 12px 48px;
      border-radius: 24px;
      font-size: 14px;
      font-weight: 700;
      letter-spacing: 0.05em;
      text-transform: uppercase;
    }
    
    .info-section {
      background: white;
      border: 1px solid #00bcd4;
      border-radius: 12px;
      padding: 24px;
      margin-bottom: 20px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    }
    
    .info-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px 40px;
    }
    
    .info-item {
      display: flex;
      flex-direction: column;
    }
    
    .info-label {
      color: #9ca3af;
      font-size: 11px;
      text-transform: uppercase;
      font-weight: 600;
      margin-bottom: 4px;
      letter-spacing: 0.03em;
    }
    
    .info-value {
      color: #111827;
      font-weight: 600;
      font-size: 15px;
    }
    
    .section {
      background: white;
      border: 1px solid #00bcd4;
      border-radius: 12px;
      padding: 20px 24px;
      margin-bottom: 20px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    }
    
    .section-header {
      font-size: 16px;
      font-weight: 700;
      text-transform: uppercase;
      color: #111827;
      margin-bottom: 16px;
      letter-spacing: 0.05em;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    
    .section-subheader {
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      color: #6b7280;
      margin: 16px 0 12px 0;
      letter-spacing: 0.05em;
    }
    
    .summary-text {
      font-size: 15px;
      color: #374151;
      line-height: 1.7;
    }
    
    /* Summary Table Styles */
    .summary-table {
      width: 100%;
      border-collapse: separate;
      border-spacing: 0;
      margin-top: 12px;
      font-size: 13px;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      overflow: hidden;
      background: white;
    }
    
    .summary-table th {
      background: #f9fafb;
      padding: 10px 12px;
      text-align: left;
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      color: #6b7280;
      border-bottom: 1px solid #e5e7eb;
    }
    
    .summary-table td {
      padding: 12px;
      border-bottom: 1px solid #f3f4f6;
      vertical-align: top;
      color: #374151;
    }
    
    .summary-table tr:last-child td {
      border-bottom: none;
    }
    
    .summary-table strong {
      color: #111827;
      font-weight: 600;
    }
    
    /* Set specific column widths for summary table */
    .summary-table th:nth-child(1),
    .summary-table td:nth-child(1) {
      width: 20%; /* BÀI HỌC */
    }
    
    .summary-table th:nth-child(2),
    .summary-table td:nth-child(2) {
      width: 35%; /* NHIỆM VỤ */
    }
    
    .summary-table th:nth-child(3),
    .summary-table td:nth-child(3) {
      width: 15%; /* TRẠNG THÁI */
      white-space: nowrap;
    }
    
    .summary-table th:nth-child(4),
    .summary-table td:nth-child(4) {
      width: 30%; /* NHẬN XÉT */
    }
    
    .status-badge {
      padding: 5px 12px;
      border-radius: 16px;
      font-size: 11px;
      font-weight: 600;
    }
    
    .status-completed {
      background: #d1fae5;
      color: #065f46;
    }
    
    .status-not-completed {
      background: #fee2e2;
      color: #991b1b;
    }
    
    .checklist-count {
      font-size: 12px;
      color: #2563eb;
      font-weight: 600;
    }
    
    .detail-table {
      width: 100%;
      border-collapse: separate;
      border-spacing: 0;
      margin-top: 12px;
      font-size: 13px;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      overflow: hidden;
      background: white;
    }
    
    .detail-table th {
      background: #f9fafb;
      padding: 10px 12px;
      text-align: left;
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      color: #6b7280;
      border-bottom: 1px solid #e5e7eb;
    }
    
    /* Set specific column widths for detail table */
    .detail-table th:nth-child(1),
    .detail-table td:nth-child(1) {
      width: 20%; /* BÀI HỌC */
    }
    
    .detail-table th:nth-child(2),
    .detail-table td:nth-child(2) {
      width: 15%; /* THỜI GIAN */
      white-space: nowrap;
    }
    
    .detail-table th:nth-child(3),
    .detail-table td:nth-child(3) {
      width: 13%; /* FILE BÀI TẬP */
      white-space: nowrap;
    }
    
    .detail-table th:nth-child(4),
    .detail-table td:nth-child(4) {
      width: 13%; /* BÀI LÀM HỌC SINH */
      white-space: nowrap;
    }
    
    .detail-table th:nth-child(5),
    .detail-table td:nth-child(5) {
      width: 13%; /* FILE LỜI GIẢI */
      white-space: nowrap;
    }
    
    .detail-table th:nth-child(6),
    .detail-table td:nth-child(6) {
      width: 13%; /* TRẠNG THÁI */
      white-space: nowrap;
    }
    
    .detail-table td {
      padding: 12px;
      border-bottom: 1px solid #f3f4f6;
      vertical-align: top;
      color: #374151;
    }
    
    .detail-table tr:last-child td {
      border-bottom: none;
    }
    
    .detail-table strong {
      color: #111827;
      font-weight: 600;
    }
    
    /* File link styles */
    .file-link {
      color: #2563eb;
      text-decoration: none;
      font-size: 12px;
      font-weight: 500;
    }
    
    .file-link:hover {
      text-decoration: underline;
    }
    
    .criteria-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    
    .criteria-item {
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      padding: 18px 20px;
      background: white;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
    }
    
    .criteria-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 10px;
    }
    
    .criteria-title {
      flex: 1;
      padding-right: 16px;
    }
    
    .criteria-name {
      font-size: 15px;
      font-weight: 600;
      color: #111827;
      margin-bottom: 3px;
    }
    
    .criteria-description {
      font-size: 12px;
      color: #9ca3af;
      line-height: 1.5;
    }
    
    .rating {
      display: flex;
      align-items: center;
      gap: 2px;
    }
    
    .star-icon {
      width: 16px;
      height: 16px;
      color: #d1d5db;
    }
    
    .star-icon.filled {
      color: #fbbf24;
      fill: #fbbf24;
      stroke: #fbbf24;
    }
    
    .rating-value {
      margin-left: 6px;
      font-size: 14px;
      font-weight: 600;
      color: #374151;
    }
    
    .criteria-note {
      background: #eff6ff;
      color: #1e40af;
      padding: 10px 14px;
      border-radius: 6px;
      font-size: 13px;
      line-height: 1.6;
    }
    
    .general-comment-box {
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 20px;
    }
    
    .general-comment-title {
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      color: #6b7280;
      margin-bottom: 10px;
      letter-spacing: 0.05em;
    }
    
    .general-comment-text {
      font-size: 14px;
      color: #374151;
      line-height: 1.7;
    }
    
    .subject-evaluation {
      margin-top: 16px;
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 16px;
    }
    
    .evaluation-title {
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      color: #6b7280;
      margin-bottom: 8px;
      letter-spacing: 0.05em;
    }
    
    .evaluation-text {
      font-size: 14px;
      color: #374151;
      line-height: 1.7;
    }
    
    .footer {
      background: transparent;
      padding: 20px 32px;
      margin-top: 32px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 20px;
    }
    
    .footer-contact {
      display: flex;
      align-items: center;
      gap: 32px;
      flex-wrap: wrap;
    }
    
    .footer-contact-item {
      display: flex;
      align-items: center;
      gap: 10px;
      color: #00bcd4;
      font-size: 13px;
    }
    
    .footer-icon {
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #00bcd4;
      border-radius: 6px;
      padding: 4px;
    }
    
    .footer-icon svg {
      width: 16px;
      height: 16px;
      fill: white;
    }
    
    @media print {
      body {
        padding: 0;
        background: white;
      }
      
      .container {
        background: white;
      }
      
      /* Page break rules to avoid orphaned content */
      .section {
        page-break-inside: auto; /* Allow sections to break */
        orphans: 3; /* Minimum 3 lines at bottom of page */
        widows: 3; /* Minimum 3 lines at top of page */
      }
      
      .info-section {
        page-break-inside: avoid; /* Keep info section together */
      }
      
      .header {
        page-break-after: avoid;
      }
      
      .student-report-label {
        page-break-before: avoid;
        page-break-after: avoid;
      }
      
      /* Keep section header with content - at least 2 lines after header */
      .section-header {
        page-break-after: avoid;
        orphans: 2;
      }
      
      .section-subheader {
        page-break-after: avoid;
        orphans: 2;
      }
      
      /* Tables should not break in the middle if possible */
      .summary-table,
      .detail-table {
        page-break-inside: auto;
      }
      
      .summary-table thead,
      .detail-table thead {
        display: table-header-group; /* Repeat header on each page */
      }
      
      /* Avoid breaking table rows */
      .summary-table tr,
      .detail-table tr {
        page-break-inside: avoid;
        page-break-after: auto;
      }
      
      /* Subject evaluation - try to keep together */
      .subject-evaluation {
        page-break-inside: avoid;
        page-break-before: auto;
      }
      
      /* Criteria items should not break */
      .criteria-item {
        page-break-inside: avoid;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="header-top">
        ${reportData.logo ? `<img src="${reportData.logo}" alt="Skillar Logo" class="header-logo">` : ''}
      </div>
      <div class="header-title">
        <h1>BÁO CÁO BUỔI HỌC</h1>
      </div>
    </div>
    
    <div class="content-wrapper">
      <!-- Session Information -->
      <div class="info-section">
        <div class="info-grid">
          <div class="info-item">
            <div class="info-label">Môn học</div>
            <div class="info-value">${schedule.subjectCode}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Ngày học</div>
            <div class="info-value">${formatDate(schedule.startTime)}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Thời gian</div>
            <div class="info-value">${formatTime(schedule.startTime, schedule.duration)}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Thời lượng</div>
            <div class="info-value">${schedule.duration} phút</div>
          </div>
          <div class="info-item">
            <div class="info-label">Học sinh</div>
            <div class="info-value">${student.name || 'N/A'}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Tutor</div>
            <div class="info-value">${tutor.name || 'N/A'}</div>
          </div>
        </div>
      </div>
      
      <!-- Student Report Label -->
      <div class="student-report-label">
        <div class="student-report-text">THÔNG TIN CHI TIẾT BUỔI HỌC</div>
      </div>
      
      <!-- Assignment Sections - Each with its own summary table and details -->
      ${checklist.assignments && checklist.assignments.length > 0 ? 
        checklist.assignments.map((assignment, assignmentIndex) => `
        <div class="section">
          <div class="section-header">${assignment.assignmentName ? assignment.assignmentName.toUpperCase() : `BÀI ${assignmentIndex + 1}`}</div>
          
          <!-- BẢNG TÓM TẮT for this assignment's tasks -->
          ${assignment.tasks && assignment.tasks.length > 0 ? `
          <div class="section-subheader">BẢNG TÓM TẮT</div>
          <table class="summary-table">
            <thead>
              <tr>
                <th>BÀI HỌC</th>
                <th>NHIỆM VỤ</th>
                <th>TRẠNG THÁI</th>
                <th>NHẬN XÉT</th>
              </tr>
            </thead>
            <tbody>
              ${assignment.tasks.map(task => `
                <tr>
                  <td><strong>${task.name || 'N/A'}</strong></td>
                  <td>${task.description || task.note || 'N/A'}</td>
                  <td>
                    <span class="status-badge ${
                      task.status === 'submitted' || task.status === 'completed' || task.status === 'graded' 
                        ? 'status-completed' 
                        : 'status-not-completed'
                    }">
                      ${task.status === 'submitted' || task.status === 'completed' || task.status === 'graded'
                        ? 'Hoàn thành' 
                        : 'CHƯA XONG'}
                    </span>
                  </td>
                  <td>${task.gradeComment || 'N/A'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          ` : '<div class="summary-text">Không có task nào.</div>'}
          
          <!-- Detailed table for this assignment -->
          ${assignment.tasks && assignment.tasks.length > 0 ? `
          <table class="detail-table">
            <thead>
              <tr>
                <th>BÀI HỌC</th>
                <th>THỜI GIAN</th>
                <th>FILE BÀI TẬP</th>
                <th>BÀI LÀM HỌC SINH</th>
                <th>FILE LỜI GIẢI</th>
                <th>TRẠNG THÁI</th>
              </tr>
            </thead>
            <tbody>
              ${assignment.tasks.map(task => `
                <tr>
                  <td><strong>${task.name || 'N/A'}</strong></td>
                  <td>${task.estimatedTime || 0}' / ${task.actualTime ? task.actualTime + "'" : '—'}</td>
                  <td>${renderLinks(task.assignmentUrl, 'Xem file')}</td>
                  <td>${renderLinks(task.answerURL, 'File lời giải')}</td>
                  <td>${renderLinks(task.solutionUrl, 'Xem file')}</td>
                  <td>
                    <span class="status-badge ${
                      task.status === 'submitted' || task.status === 'completed' || task.status === 'graded' 
                        ? 'status-completed' 
                        : 'status-not-completed'
                    }">
                      ${task.status === 'submitted' || task.status === 'completed' || task.status === 'graded' 
                        ? 'Hoàn thành' 
                        : 'Chưa xong'}
                    </span>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          ` : ''}
          
          <!-- Subject Evaluation from Review Comment -->
          ${assignment.subjectComment ? `
          <div class="subject-evaluation">
            <div class="evaluation-title">ĐÁNH GIÁ MÔN HỌC</div>
            <div class="evaluation-text">${assignment.subjectComment}</div>
          </div>
          ` : ''}
        </div>
        `).join('')
      : ''}
      
      <!-- Evaluation Criteria -->
      ${criteria && criteria.length > 0 ? `
      <div class="section">
        <div class="section-header">NHẬN XÉT CHI TIẾT</div>
        <div class="criteria-list">
          ${criteria.map(c => `
            <div class="criteria-item">
              <div class="criteria-header">
                <div class="criteria-title">
                  <div class="criteria-name">${c.metric || 'N/A'}</div>
                  ${c.description ? `<div class="criteria-description">${c.description}</div>` : ''}
                </div>
                <div class="rating">
                  ${generateStars(c.rating || 0)}
                  <span class="rating-value">${c.rating || 0}/5</span>
                </div>
              </div>
              <div class="criteria-note">${c.note || 'N/A'}</div>
            </div>
          `).join('')}
        </div>
      </div>
      ` : ''}
      
      <div class="footer">
        <div class="footer-contact">
          <div class="footer-contact-item">
            <div class="footer-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011.11-.27 11.36 11.36 0 004.48 1.08 1 1 0 011 1V21a1 1 0 01-1 1A17 17 0 013 5a1 1 0 011-1h4.19a1 1 0 011 1 11.36 11.36 0 001.08 4.48 1 1 0 01-.27 1.11z"/>
              </svg>
            </div>
            <span>Hotline: 0815 836 636</span>
          </div>
          <div class="footer-contact-item">
            <div class="footer-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
              </svg>
            </div>
            <span>Email: skillartutor@gmail.com</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</body>
</html>
  `;
};

module.exports = {
  generateReportHTML,
};
