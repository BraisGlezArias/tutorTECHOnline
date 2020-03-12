'use strict';

const Joi = require('@hapi/joi');
const uuidV4 = require('uuid/v4');
const mysqlPool = require('../../../database/mysql-pool');

const httpServerDomain = process.env.HTTP_SERVER_DOMAIN;

async function validate(payload) {
    const schema = Joi.object({
        title: Joi.string().trim().min(1).max(255).required(),
        content: Joi.string().trim().min(10).max(65536).required(),
        tags: Joi.array().required(),
        answers: Joi.array()
    });

    Joi.assert(payload, schema);
}

async function createQuestion(req, res, next) {
    const questionData = { ...req.body };
    const { userId } = req.claims;

    try {
        await validate(questionData);
    } catch(e) {
        return res.status(400).send(e);
    }

    const now = new Date().toISOString().substring(0, 19).replace('T', ' ');

    const {
        title,
        content,
    } = questionData;

    const questionId = uuidV4();
    const question = {
        id: questionId,
        title,
        content,
        userId: userId,
        createdAt: now,
        visitCounter: 0,
    };

    try {
        const connection = await mysqlPool.getConnection();
        try {
            const sqlCreateQuestion = 'INSERT INTO questions SET ?';
            await connection.query(sqlCreateQuestion, question);

            questionData.tags.forEach(async (tagId) => {
                const sqlAddTag = `INSERT INTO questionsTags SET ?`;
                try {
                    await connection.query(sqlAddTag, {
                        questionId: questionId,
                        tagId: tagId.id,
                        createdAt: now,
                    });
                } catch (e) {
                    console.error(e);
                }
            });

            connection.release();

            res.header('Location', `${httpServerDomain}/api/questions/${questionId}`);
            return res.status(201).send({
                questionId: questionId,
            });
        } catch (e) {
            connection.release({
                questionId: question.id,
            });
            throw e;
        }
    } catch (e) {
        console.error(e);
        return res.status(500).send();
    }
}

module.exports = createQuestion;