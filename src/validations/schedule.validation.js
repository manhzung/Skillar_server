const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createSchedule = {
    body: Joi.object().keys({
        startTime: Joi.date().required(),
        duration: Joi.number().integer().min(1).required(),
        subjectCode: Joi.string().required(),
        studentId: Joi.string().required().custom(objectId),
        tutorId: Joi.string().required().custom(objectId),
    }),
};

const getSchedules = {
    query: Joi.object().keys({
        studentId: Joi.string().custom(objectId),
        tutorId: Joi.string().custom(objectId),
        subjectCode: Joi.string(),
        sortBy: Joi.string(),
        limit: Joi.number().integer(),
        page: Joi.number().integer(),
    }),
};

const getSchedule = {
    params: Joi.object().keys({
        scheduleId: Joi.string().custom(objectId),
    }),
};

const updateSchedule = {
    params: Joi.object().keys({
        scheduleId: Joi.required().custom(objectId),
    }),
    body: Joi.object()
        .keys({
            startTime: Joi.date(),
            duration: Joi.number().integer().min(1),
            subjectCode: Joi.string(),
            studentId: Joi.string().custom(objectId),
            tutorId: Joi.string().custom(objectId),
        })
        .min(1),
};

const deleteSchedule = {
    params: Joi.object().keys({
        scheduleId: Joi.string().custom(objectId),
    }),
};

module.exports = {
    createSchedule,
    getSchedules,
    getSchedule,
    updateSchedule,
    deleteSchedule,
};
