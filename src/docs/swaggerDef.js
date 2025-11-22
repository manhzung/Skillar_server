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
  },
  servers: [
    {
      url: `http://localhost:${config.port}/v1`,
      description: 'Development server',
    },
  ],
};

module.exports = swaggerDef;
