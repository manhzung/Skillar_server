const express = require('express');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const swaggerDefinition = require('../../docs/swaggerDef');

const router = express.Router();

const specs = swaggerJsdoc({
  swaggerDefinition,
  apis: ['src/docs/*.yml', 'src/routes/v1/*.js'],
});

router.use('/', swaggerUi.serve);
router.get(
  '/',
  swaggerUi.setup(specs, {
    explorer: true,
    swaggerOptions: {
      // Force HTTP protocol - prevent browser auto-upgrade to HTTPS
      url: specs,
      validatorUrl: null,
    },
    customCss: `
      .swagger-ui .scheme-container { display: none !important; }
    `,
  })
);

module.exports = router;
