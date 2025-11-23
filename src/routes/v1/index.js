const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const scheduleRoute = require('./schedule.route');
const studentInfoRoute = require('./studentInfo.route');
const tutorInfoRoute = require('./tutorInfo.route');
const assignmentRoute = require('./assignment.route');
const homeworkRoute = require('./homework.route');
const reviewRoute = require('./review.route');
const fileRoute = require('./file.route');
const docsRoute = require('./docs.route');
const config = require('../../config/config');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/schedules',
    route: scheduleRoute,
  },
  {
    path: '/students/:userId/info',
    route: studentInfoRoute,
  },
  {
    path: '/tutors/:userId/info',
    route: tutorInfoRoute,
  },
  {
    path: '/assignments',
    route: assignmentRoute,
  },
  {
    path: '/homeworks',
    route: homeworkRoute,
  },
  {
    path: '/reviews',
    route: reviewRoute,
  },
  {
    path: '/files',
    route: fileRoute,
  },
];


const devRoutes = [
  // routes available only in development mode
  {
    path: '/docs',
    route: docsRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
