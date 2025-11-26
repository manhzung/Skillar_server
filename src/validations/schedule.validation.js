const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createSchedule = {
    body: Joi.object().keys({
        startTime: Joi.date().required(),
        duration: Joi.number().integer().min(1).required(),
        subjectCode: Joi.string(),
        studentId: Joi.string().required().custom(objectId),
        tutorId: Joi.string().required().custom(objectId),
        meetingURL: Joi.string().uri(),
        note: Joi.string(),
        status: Joi.string().valid('upcoming', 'ongoing', 'completed', 'cancelled'),
        supplementaryMaterials: Joi.array().items(
            Joi.object().keys({
                name: Joi.string().required(),
                documentURL: Joi.string().uri().required(),
                description: Joi.string().allow(''),
            })
        ),
        overallRating: Joi.string(),
        reviews: Joi.array().items(
            Joi.object().keys({
                name: Joi.string().required(),
                rating: Joi.number().integer().min(1).max(5).required(),
                comment: Joi.string().allow(''),
            })
        ),
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
            meetingURL: Joi.string().uri(),
            note: Joi.string(),
            status: Joi.string().valid('upcoming', 'ongoing', 'completed', 'cancelled'),
            supplementaryMaterials: Joi.array().items(
                Joi.object().keys({
                    name: Joi.string().required(),
                    documentURL: Joi.string().uri().required(),
                    description: Joi.string().allow(''),
                })
            ),
            overallRating: Joi.string(),
            reviews: Joi.array().items(
                Joi.object().keys({
                    name: Joi.string().required(),
                    rating: Joi.number().integer().min(1).max(5).required(),
                    comment: Joi.string().allow(''),
                })
            ),
        })
        .min(1),
};

const deleteSchedule = {
    params: Joi.object().keys({
        scheduleId: Joi.string().custom(objectId),
    }),
};

const generateMeetingLink = {
    body: Joi.object().keys({
        scheduleId: Joi.string().custom(objectId),
        date: Joi.date(),
        roomName: Joi.string(),
    }),
};

const getTodayLessonStats = {
    query: Joi.object().keys({
        studentId: Joi.string().custom(objectId),
        tutorId: Joi.string().custom(objectId),
    }),
};

module.exports = {
    createSchedule,
    getSchedules,
    getSchedule,
    updateSchedule,
    deleteSchedule,
    generateMeetingLink,
    getTodayLessonStats,
};
