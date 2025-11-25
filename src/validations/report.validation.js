const Joi = require('joi');
const { objectId } = require('./custom.validation');

const generateReport = {
  params: Joi.object().keys({
    scheduleId: Joi.string().custom(objectId).required(),
  }),
};

const getReport = {
  params: Joi.object().keys({
    scheduleId: Joi.string().custom(objectId).required(),
  }),
};

module.exports = {
  generateReport,
  getReport,
};
