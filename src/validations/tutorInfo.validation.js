const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createTutorInfo = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object().keys({
    subjects: Joi.array().items(Joi.string()),
    experience: Joi.string(),
    qualification: Joi.string(),
    specialties: Joi.array().items(Joi.string()),
    bio: Joi.string(),
    cvUrl: Joi.string(),
    rating: Joi.number().min(0).max(5),
    totalStudents: Joi.number().integer().min(0),
  }),
};

const getTutorInfo = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId).required(),
  }),
};

const updateTutorInfo = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object()
    .keys({
      subjects: Joi.array().items(Joi.string()),
      experience: Joi.string(),
      qualification: Joi.string(),
      specialties: Joi.array().items(Joi.string()),
      bio: Joi.string(),
      cvUrl: Joi.string(),
      rating: Joi.number().min(0).max(5),
      totalStudents: Joi.number().integer().min(0),
    })
    .min(1),
};

const deleteTutorInfo = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId).required(),
  }),
};

module.exports = {
  createTutorInfo,
  getTutorInfo,
  updateTutorInfo,
  deleteTutorInfo,
};
