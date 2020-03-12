'use strict';

const Joi = require('@hapi/joi');
const mysqlPool = require('../../../database/mysql-pool');

async function validateSchema(payload) {
    const schema = Joi.object({
        title: Joi.string().trim().min(1).max(255).required(),
        content: Joi.string().trim().min(1).max(66536).required(),
        tags: Joi.array(),
        questionId: Joi.string().guid({
            version: ['uuidv4']
        }).required(),
        userId: Joi.string().guid({
            version: ['uuidv4']
        }).required(),
    });

    Joi.assert(payload, schema);
}

async function updateQuestion(req, res, next) {
    const { questionId } = req.params;
    const { userId } = req.claims;
    const questionData = {
        ...req.body,
        questionId,
        userId,
    };

    try {
        await validateSchema(questionData);
    } catch (e) {
        console.error(e);
        return res.status(400).send(e);
    }

    let connection;
    try {
        connection = await mysqlPool.getConnection();
        const now = new Date().toISOString().replace('T', ' ').substring(0, 19);

        const sqlUpdateQuestion = `UPDATE questions
            SET title = ?,
                content = ?,
                updatedAt = ?
            WHERE id = ?
                AND userId = ?`;
        const [updatedStatus] = await connection.query(sqlUpdateQuestion, [
            questionData.title,
            questionData.content,
            now,
            questionId,
            userId,
        ]);

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

        if (updatedStatus.changedRows === 0) {
            return res.status(404).send();
        }

        return res.status(204).send();
    } catch (e) {
        if (connection) {
            connection.release();
        }

        console.error(e);
        return res.status(500).send({
            message: e.message,
        });
    }
}

module.exports = updateQuestion;