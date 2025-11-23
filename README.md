# Skillar Backend API

[![Node.js](https://img.shields.io/badge/Node.js-v14+-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-blue.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4.x-green.svg)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

Backend API cho Skillar - Nền tảng quản lý giáo dục kết nối học sinh, phụ huynh và gia sư. Hệ thống cung cấp các API để quản lý người dùng, lịch học, bài tập, homework, đánh giá và nhiều tính năng khác.

## 🚀 Tính Năng Chính

### 📚 Quản Lý Học Tập

- **Schedules (Lịch Học)**: Quản lý lịch học giữa học sinh và gia sư
  - Tự động tạo Jitsi Meet link cho mỗi buổi học
  - Thống kê lịch học theo ngày, tuần, tháng
  - Dashboard analytics cho admin
- **Assignments (Bài Tập Trên Lớp)**: Checklist theo dõi tiến độ học tập trong buổi học
  - Quản lý tasks với estimated/actual time
  - Submit solutions từ học sinh
  - Grading từ gia sư
- **Homeworks (Bài Tập Về Nhà)**: Quản lý bài tập về nhà
  - Deadline tracking
  - Difficulty levels (easy, medium, hard, advanced)
  - Submit và grading workflow
- **Reviews (Đánh Giá)**: Đánh giá hàng ngày từ gia sư
  - Rating theo nhiều tiêu chí (1-5 stars)
  - Assignment grading (0-100 points)
  - Overall feedback

### 👥 Quản Lý Người Dùng

- **Users**: CRUD cho 4 loại người dùng (student, parent, tutor, admin)
- **StudentInfo**: Thông tin mở rộng của học sinh (trường, lớp, sở thích, điểm mạnh/yếu)
- **TutorInfo**: Thông tin mở rộng của gia sư (môn dạy, kinh nghiệm, rating)
- **User Statistics**: Thống kê người dùng theo role

### 📁 Quản Lý File

- Upload file lên Cloudinary (images, PDFs, documents)
- Upload multiple files (tối đa 10 files)
- Delete files (admin only)

### 🔐 Authentication & Authorization

- JWT-based authentication
- Role-based access control (RBAC)
- Refresh token mechanism
- Email verification
- Password reset flow

## 🛠️ Tech Stack

- **Runtime**: Node.js v14+
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: Passport.js + JWT
- **Validation**: Joi
- **File Upload**: Cloudinary
- **API Documentation**: Swagger/OpenAPI 3.0
- **Testing**: Jest
- **Logging**: Winston + Morgan
- **Security**: Helmet, express-mongo-sanitize, xss-clean
- **Process Management**: PM2

## 📋 Yêu Cầu Hệ Thống

- Node.js >= 14.x
- MongoDB >= 4.x
- npm hoặc yarn
- Cloudinary account (cho file upload)

## ⚙️ Cài Đặt

### 1. Clone Repository

```bash
git clone <repository-url>
cd server
```

### 2. Install Dependencies

```bash
npm install
# hoặc
yarn install
```

### 3. Cấu Hình Environment Variables

Copy file `.env.example` thành `.env`:

```bash
cp .env.example .env
```

Cập nhật các biến môi trường trong file `.env`:

```env
# Server
NODE_ENV=development
PORT=3000

# Database
MONGODB_URL=mongodb://127.0.0.1:27017/skillar

# JWT
JWT_SECRET=your-secret-key-here
JWT_ACCESS_EXPIRATION_MINUTES=30
JWT_REFRESH_EXPIRATION_DAYS=30
JWT_RESET_PASSWORD_EXPIRATION_MINUTES=10
JWT_VERIFY_EMAIL_EXPIRATION_MINUTES=10

# SMTP (Email)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password
EMAIL_FROM=noreply@skillar.com

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### 4. Chạy Server

**Development mode (with nodemon auto-reload):**

```bash
npm run dev
```

**Production mode:**

```bash
npm start
```

**Using PM2:**

```bash
npm run start:pm2
```

## 📚 API Documentation

Sau khi chạy server ở development mode, truy cập Swagger UI tại:

```
http://localhost:3000/v1/docs
```

### API Endpoints Overview

#### Authentication (`/v1/auth`)

- `POST /register` - Đăng ký tài khoản mới
- `POST /login` - Đăng nhập
- `POST /logout` - Đăng xuất
- `POST /refresh-tokens` - Refresh access token
- `POST /forgot-password` - Yêu cầu reset password
- `POST /reset-password` - Reset password
- `POST /send-verification-email` - Gửi email xác thực
- `POST /verify-email` - Xác thực email

#### Users (`/v1/users`)

- `POST /` - Tạo user mới (admin only)
- `GET /` - Lấy danh sách users (admin only)
- `GET /stats` - Thống kê users theo role (admin only)
- `GET /:userId` - Lấy thông tin user
- `PATCH /:userId` - Cập nhật user (admin only)
- `DELETE /:userId` - Xóa user (admin only)

#### Schedules (`/v1/schedules`)

- `POST /` - Tạo lịch học (admin only)
- `GET /` - Lấy danh sách lịch học
- `GET /stats/today` - Số lịch học hôm nay (admin only)
- `GET /stats/dashboard` - Dashboard statistics (admin only)
- `GET /stats/students-per-week` - Thống kê học sinh/tuần (admin only)
- `GET /stats/schedules-per-month` - Thống kê lịch học/tháng (admin only)
- `GET /:scheduleId` - Lấy chi tiết lịch học
- `PATCH /:scheduleId` - Cập nhật lịch học (admin only)
- `DELETE /:scheduleId` - Xóa lịch học (admin only)

#### Assignments (`/v1/assignments`)

- `POST /` - Tạo assignment (admin, tutor)
- `GET /` - Lấy danh sách assignments
- `GET /:assignmentId` - Lấy chi tiết assignment
- `PATCH /:assignmentId` - Cập nhật assignment (admin, tutor)
- `DELETE /:assignmentId` - Xóa assignment (admin only)
- `PATCH /:assignmentId/tasks/:taskId/submit` - Submit task (student, admin)

#### Homeworks (`/v1/homeworks`)

- `POST /` - Tạo homework (admin, tutor)
- `GET /` - Lấy danh sách homeworks
- `GET /:homeworkId` - Lấy chi tiết homework
- `PATCH /:homeworkId` - Cập nhật homework (admin, tutor)
- `DELETE /:homeworkId` - Xóa homework (admin only)
- `PATCH /:homeworkId/tasks/:taskId/submit` - Submit homework (student, admin)

#### Reviews (`/v1/reviews`)

- `POST /` - Tạo review (tutor, admin)
- `GET /` - Lấy danh sách reviews
- `GET /:reviewId` - Lấy chi tiết review
- `PATCH /:reviewId` - Cập nhật review (tutor, admin)
- `DELETE /:reviewId` - Xóa review (admin only)

#### Student Info (`/v1/students/:userId/info`)

- `POST /` - Tạo student info (admin only)
- `GET /` - Lấy student info
- `PATCH /` - Cập nhật student info (admin only)
- `DELETE /` - Xóa student info (admin only)

#### Tutor Info (`/v1/tutors/:userId/info`)

- `POST /` - Tạo tutor info (admin only)
- `GET /` - Lấy tutor info
- `PATCH /` - Cập nhật tutor info (admin, tutor)
- `DELETE /` - Xóa tutor info (admin only)

#### Files (`/v1/files`)

- `POST /upload` - Upload một file (admin, student, tutor)
- `POST /upload-multiple` - Upload nhiều files (admin, student, tutor)
- `DELETE /:publicId` - Xóa file (admin only)

## 🗂️ Cấu Trúc Thư Mục

```
src/
├── config/          # Configuration files (database, cloudinary, logger, roles, etc.)
├── controllers/     # Route controllers (xử lý HTTP requests)
├── docs/            # Swagger documentation files
├── middlewares/     # Custom Express middlewares (auth, error, validate, etc.)
├── models/          # Mongoose models và schemas
│   └── plugins/     # Mongoose plugins (toJSON, paginate)
├── routes/          # API routes
│   └── v1/          # Version 1 API routes
├── services/        # Business logic layer
├── utils/           # Utility functions (ApiError, catchAsync, pick, jitsi, etc.)
├── validations/     # Joi validation schemas
├── app.js           # Express app configuration
└── index.js         # Entry point
```

## 🔑 User Roles & Permissions

Hệ thống có 4 loại user với quyền khác nhau:

### Admin

- Toàn quyền trên hệ thống
- Quản lý tất cả users, schedules, assignments, homeworks, reviews
- Xem thống kê và dashboard
- Upload và xóa files

### Tutor (Gia Sư)

- Tạo và quản lý assignments, homeworks, reviews
- Xem schedules của mình
- Upload files
- Cập nhật tutor info của mình

### Student (Học Sinh)

- Xem schedules, assignments, homeworks, reviews của mình
- Submit assignments và homeworks
- Upload files
- Xem student info của mình

### Parent (Phụ Huynh)

- Xem schedules, assignments, homeworks, reviews của con
- Xem student info của con

## 🧪 Testing

```bash
# Chạy tất cả tests
npm test

# Chạy tests ở watch mode
npm run test:watch

# Xem test coverage
npm run coverage
```

## 🐳 Docker

```bash
# Development mode
npm run docker:dev

# Production mode
npm run docker:prod

# Run tests in Docker
npm run docker:test
```

## 🔧 Linting & Code Quality

```bash
# Run ESLint
npm run lint

# Fix ESLint errors
npm run lint:fix

# Run Prettier
npm run prettier

# Fix Prettier errors
npm run prettier:fix
```

## 🌐 Environment Support

- **Development**: Full logging, Swagger docs, auto-reload với nodemon
- **Production**: Optimized logging, PM2 process management, security headers

## 📦 Key Dependencies

- **express**: ^4.17.1 - Web framework
- **mongoose**: ^5.13.2 - MongoDB ODM
- **passport-jwt**: ^4.0.0 - JWT authentication
- **joi**: ^17.4.0 - Validation
- **winston**: ^3.3.3 - Logging
- **cloudinary**: ^1.26.2 - File storage
- **swagger-jsdoc**: ^6.1.0 - API documentation
- **helmet**: ^4.6.0 - Security headers
- **cors**: ^2.8.5 - CORS handling
- **compression**: ^1.7.4 - Response compression

## 🔒 Security Features

- **Helmet**: Set security HTTP headers
- **CORS**: Cross-Origin Resource Sharing configured
- **XSS Protection**: xss-clean middleware
- **NoSQL Injection Prevention**: express-mongo-sanitize
- **Rate Limiting**: express-rate-limit (có thể config)
- **JWT**: Secure token-based authentication

## 📝 Logging

Logs được lưu bằng Winston với các levels:

- `error`: Level 0 (cao nhất)
- `warn`: Level 1
- `info`: Level 2
- `http`: Level 3
- `verbose`: Level 4
- `debug`: Level 5

Development mode: Tất cả logs được in ra console
Production mode: Chỉ `info`, `warn`, `error` được log

## 🚀 Deployment

### PM2 (Recommended)

```bash
# Start with PM2
npm run start:pm2

# Stop
npm run stop:pm2

# Restart
pm2 restart skillar-api

# View logs
pm2 logs skillar-api
```

### Manual Deployment

1. Set `NODE_ENV=production` trong .env
2. Cài đặt dependencies: `npm ci --only=production`
3. Chạy: `npm start`

## 📖 Additional Documentation

- [API Documentation](http://localhost:3000/v1/docs) (khi chạy dev server)
- [Swagger Comparison Report](swagger_api_comparison.md)

## 🤝 Contributing

1. Fork repository
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

[MIT](LICENSE)

## 👨‍💻 Developers

Phát triển bởi Skillar Team

---

**Note**: Đây là backend API, cần kết hợp với frontend client để có ứng dụng hoàn chỉnh.
