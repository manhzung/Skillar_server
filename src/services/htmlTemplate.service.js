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
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars += '<span class="star filled">★</span>';
      } else {
        stars += '<span class="star">☆</span>';
      }
    }
    return stars;
  };

  // Format date
  const formatDate = (date) => {
    const d = new Date(date);
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return d.toLocaleDateString('vi-VN', options);
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
      background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
      color: white;
      padding: 32px;
      text-align: center;
      border-radius: 12px;
      margin-bottom: 24px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    
    .header h1 {
      font-size: 26px;
      margin-bottom: 6px;
      font-weight: 700;
      letter-spacing: -0.01em;
    }
    
    .header .subtitle {
      font-size: 14px;
      opacity: 0.95;
      font-weight: 500;
    }
    
    .content-wrapper {
      /* No padding here, sections have their own backgrounds */
    }
    
    .info-section {
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      padding: 24px;
      margin-bottom: 20px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    }
    
    .info-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
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
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      padding: 20px 24px;
      margin-bottom: 20px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    }
    
    .section-header {
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      color: #6b7280;
      margin-bottom: 16px;
      letter-spacing: 0.05em;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    
    .summary-text {
      font-size: 15px;
      color: #374151;
      line-height: 1.7;
    }
    
    .checklist-simple {
      list-style: none;
      padding: 0;
    }
    
    .checklist-simple li {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 16px;
      margin-bottom: 10px;
      background: #f9fafb;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
    }
    
    .checklist-simple li:last-child {
      margin-bottom: 0;
    }
    
    .task-name {
      color: #374151;
      font-weight: 500;
      font-size: 14px;
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
    
    .star {
      font-size: 16px;
      color: #d1d5db;
    }
    
    .star.filled {
      color: #fbbf24;
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
    
    .footer {
      text-align: center;
      padding: 24px 0 0;
      font-size: 11px;
      color: #9ca3af;
      margin-top: 32px;
    }
    
    @media print {
      body {
        padding: 0;
        background: white;
      }
      
      .container {
        background: white;
      }
      
      .section {
        page-break-inside: avoid;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>BÁO CÁO BUỔI HỌC</h1>
      <div class="subtitle">Báo cáo chi tiết đánh giá và nhận xét</div>
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
      
      <!-- Summary -->
      ${summary && summary !== 'N/A' ? `
      <div class="section">
        <div class="section-header">TỔNG QUAN</div>
        <div class="summary-text">${summary}</div>
      </div>
      ` : ''}
      
      <!-- Simple Checklist -->
      ${checklist.simple && checklist.simple.length > 0 ? `
      <div class="section">
        <div class="section-header">
          CHECKLIST HÔM NAY
          <span class="checklist-count">${checklist.simple.filter(i => i.status === 'done').length}/${checklist.simple.length} (${Math.round(checklist.simple.filter(i => i.status === 'done').length / checklist.simple.length * 100)}%)</span>
        </div>
        <ul class="checklist-simple">
          ${checklist.simple.map((item, index) => `
            <li>
              <span class="task-name">${index + 1}. ${item.name}</span>
              <span class="status-badge ${item.status === 'done' ? 'status-completed' : 'status-not-completed'}">
                ${item.status === 'done' ? 'Hoàn thành' : 'Chưa xong'}
              </span>
            </li>
          `).join('')}
        </ul>
      </div>
      ` : ''}
      
      <!-- Detailed Checklist Tables - One section per assignment -->
      ${checklist.assignments && checklist.assignments.length > 0 ? 
        checklist.assignments.map((assignment, assignmentIndex) => `
        <div class="section">
          <div class="section-header">CHI TIẾT BÀI TẬP ${assignment.assignmentName ? `- ${assignment.assignmentName.toUpperCase()}` : `#${assignmentIndex + 1}`}</div>
          ${assignment.tasks && assignment.tasks.length > 0 ? `
          <table class="detail-table">
            <thead>
              <tr>
                <th>TÊN TASK</th>
                <th>THỜI GIAN ƯỚC LƯỢNG</th>
                <th>THỜI GIAN THỰC TẾ</th>
                <th>KẾT QUẢ</th>
                <th>MÔ TẢ</th>
              </tr>
            </thead>
            <tbody>
              ${assignment.tasks.map(task => `
                <tr>
                  <td><strong>${task.name || 'N/A'}</strong></td>
                  <td>${task.estimatedTime || 0} phút</td>
                  <td>${task.actualTime || 0} phút</td>
                  <td>
                    <span class="status-badge ${
                      task.status === 'completed' || task.status === 'graded' ? 'status-completed' : 
                      'status-not-completed'
                    }">
                      ${task.status === 'completed' || task.status === 'graded' ? 'Hoàn thành' : 
                        task.status === 'in-progress' ? 'Đang làm' :
                        task.status === 'submitted' ? 'Đã nộp' : 'Chưa làm'}
                    </span>
                  </td>
                  <td>${task.description || 'N/A'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          ` : '<div class="summary-text">Không có task nào.</div>'}
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
      
      <!-- General Comment -->
      ${generalComment && generalComment !== 'N/A' ? `
      <div class="section">
        <div class="general-comment-box">
          <div class="general-comment-title">NHẬN XÉT CHUNG CHO MÔN HỌC TỪ TUTOR</div>
          <div class="general-comment-text">${generalComment}</div>
        </div>
      </div>
      ` : ''}
      
      <div class="footer">
        Báo cáo được tạo tự động bởi hệ thống LearnerPro vào ${new Date().toLocaleString('vi-VN')}
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
