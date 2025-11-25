const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createStudentInfo = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object().keys({
    school: Joi.string(),
    grade: Joi.string(),
    parent1Name: Joi.string(),
    parent1Email: Joi.string().email(),
    parent1Number: Joi.string(),
    parent1Request: Joi.string(),
    parent2Name: Joi.string(),
    parent2Email: Joi.string().email(),
    parent2Number: Joi.string(),
    parent2Request: Joi.string(),
    academicLevel: Joi.string(),
    hobbies: Joi.array().items(Joi.string()),
    favoriteSubjects: Joi.array().items(Joi.string()),
    strengths: Joi.array().items(Joi.string()),
    improvements: Joi.array().items(Joi.string()),
    notes: Joi.string(),
  }),
};

const getStudentInfo = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId).required(),
  }),
};

const updateStudentInfo = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object()
    .keys({
      school: Joi.string(),
      grade: Joi.string(),
      parent1Name: Joi.string(),
      parent1Email: Joi.string().email(),
      parent1Number: Joi.string(),
      parent1Request: Joi.string(),
      parent2Name: Joi.string(),
      parent2Email: Joi.string().email(),
      parent2Number: Joi.string(),
      parent2Request: Joi.string(),
      academicLevel: Joi.string(),
      hobbies: Joi.array().items(Joi.string()),
      favoriteSubjects: Joi.array().items(Joi.string()),
      strengths: Joi.array().items(Joi.string()),
      improvements: Joi.array().items(Joi.string()),
      notes: Joi.string(),
    })
    .min(1),
};

const deleteStudentInfo = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId).required(),
  }),
};

module.exports = {
  createStudentInfo,
  getStudentInfo,
  updateStudentInfo,
  deleteStudentInfo,
};
