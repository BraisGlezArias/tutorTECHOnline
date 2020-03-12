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

async function deleteQuestion(req, res, next) {
    const { questionId } = req.params;
    const { userId } = req.claims;

    try {
        await validate({ questionId, });
    } catch (e) {
        return res.status(400).send(e);
    }

    let connection;
    try {
        connection = await mysqlPool.getConnection();
        const sqlQuery = `UPDATE questions
            SET deletedAt = ?
            WHERE id = ?
            AND userId = ?
            AND deletedAt IS NULL`;

        const now = new Date().toISOString().substring(0, 19).replace('T', ' ');
        const [deletedStatus] = await connection.execute(sqlQuery, [ now, questionId, userId ]);

        const sqlDeleteTag = `DELETE
        FROM questionsTags
        WHERE questionId = ?`;
        await connection.execute(sqlDeleteTag, [questionId]);

        const sqlDeleteAnswer = `UPDATE answers
            SET deletedAt = ?
            WHERE questionId = ?
            AND deletedAt IS NULL`;
        await connection.execute(sqlDeleteAnswer, [now, questionId]);

        const sqlDeleteRating = `UPDATE ratings r
            LEFT JOIN answers a
            ON r.answerId = a.id
            SET r.deletedAt = ?
            WHERE a.questionId = ?
            AND r.deletedAt IS NULL`;
        await connection.execute(sqlDeleteRating, [now, questionId]);
        connection.release();

        if (deletedStatus.changedRows === 0) {
            return res.status(404).send();
        }

        return res.status(204).send();
    } catch (e) {
        if (connection) {
            connection.release();
        }

        return res.status(500).send(e.message);
    }
}

module.exports = deleteQuestion;
