const Joi = require('joi');

const deleteFile = {
  params: Joi.object().keys({
    publicId: Joi.string().required(),
  }),
};

module.exports = {
  deleteFile,
};
