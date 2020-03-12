'use strict';

const Joi = require('@hapi/joi');
const mysqlPool = require('../../../database/mysql-pool');

async function validate(payload) {
    const schema = Joi.object({
        questionId: Joi.string().guid({
            version: ['uuidv4'],
        }).required(),
    });

    Joi.assert(payload, schema);
}

async function getQuestion(questionId, userId) {
    const connection = await mysqlPool.getConnection();
    const getQuestionQuery = `SELECT id, title, content, createdAt, updatedAt
        FROM questions
        WHERE userId = ?
            AND id = ?
            AND deletedAt IS NULL`;
    const [questionData] = await connection.execute(getQuestionQuery, [userId, questionId]);
    connection.release();

    if (questionData.length < 1) {
        return null;
    }

    return questionData[0];
}

async function deleteTagFromQuestion(req, res, next) {
    const { questionId } = req.params;
    const { userId } = req.claims;
    const payload = {
        questionId,
    };

    try {
        await validate(payload);
    } catch (e) {
        console.error(e);
        return res.status(400).send(e);
    }

    try {
        const question = await getQuestion(questionId, userId);

        if (!question) {
            return res.status(404).send();
        }

        const sqlDeleteTag = `DELETE
            FROM questionsTags
            WHERE questionId = ?`;

        const connection = await mysqlPool.getConnection();
        try {
            await connection.execute(sqlDeleteTag, [questionId]);
            connection.release();
        } catch (e) {
            console.error(e);
            connection.release();
            return res.status(500).send({
                message: e.message,
            });
        }

        return res.status(204).send();
    } catch (e) {
        console.error(e);

        return res.status(500).send({
            message: e.message,
        });
    }
}

module.exports = deleteTagFromQuestion;