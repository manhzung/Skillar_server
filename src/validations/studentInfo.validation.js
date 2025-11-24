const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createStudentInfo = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object().keys({
    school: Joi.string(),
    grade: Joi.string(),
    parentName: Joi.string(),
    parentEmail: Joi.string().email(),
    parentNumber: Joi.string(),
    parentRequest: Joi.string(),
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
      parentName: Joi.string(),
      parentEmail: Joi.string().email(),
      parentNumber: Joi.string(),
      parentRequest: Joi.string(),
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
