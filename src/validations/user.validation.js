const Joi = require('joi');
const { password, objectId } = require('./custom.validation');

const createUser = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
    name: Joi.string().required(),
    role: Joi.string().required().valid('student', 'parent', 'tutor', 'admin'),
    phone: Joi.string(),
    birthday: Joi.date(),
    moreInfo: Joi.string(),
    avatarUrl: Joi.string().uri(),
    address: Joi.string(),
    currentLevel: Joi.string(),
  }),
};

const getUsers = {
  query: Joi.object().keys({
    name: Joi.string(),
    role: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

const updateUser = {
  params: Joi.object().keys({
    userId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      email: Joi.string().email(),
      password: Joi.string().custom(password),
      name: Joi.string(),
      phone: Joi.string(),
      birthday: Joi.date(),
      moreInfo: Joi.string(),
      avatarUrl: Joi.string().uri(),
      address: Joi.string(),
      currentLevel: Joi.string(),
    })
    .min(1),
};

const deleteUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

const getUserNamesAndIds = {
  query: Joi.object().keys({
    role: Joi.string().valid('tutor', 'student'),
  }),
};

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  getUserNamesAndIds,
};
