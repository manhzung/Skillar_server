const { version } = require('../../package.json');
const config = require('../config/config');

const swaggerDef = {
  openapi: '3.0.0',
  info: {
    title: 'Skillar API Documentation',
    version,
    description: 'API documentation for Skillar - An educational platform for managing students, tutors, and schedules',
    license: {
      name: 'MIT',
      url: 'https://github.com/hagopj13/node-express-boilerplate/blob/master/LICENSE',
    },
    contact: {
      name: 'Skillar Support',
      email: 'support@skillar.com',
    },
  },
  servers: [
    {
      url: 'http://47.128.68.241/v1',
      description: 'Production server (IP)',
    },
    {
      url: 'http://ec2-47-128-68-241.ap-southeast-1.compute.amazonaws.com/v1',
      description: 'Production server (AWS DNS)',
    },
    {
      url: `http://localhost:${config.port}/v1`,
      description: 'Development server (Local)',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter your JWT token (without "Bearer" prefix)',
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
};

module.exports = swaggerDef;
