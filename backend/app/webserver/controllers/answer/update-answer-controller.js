'use strict';

const Joi = require('@hapi/joi');
const mysqlPool = require('../../../database/mysql-pool');

async function validateSchema(payload) {
    const schema = Joi.object({
        content: Joi.string().trim().min(1).max(66536).required(),
        answerId: Joi.string().guid({
            version: ['uuidv4']
        }).required(),
        userId: Joi.string().guid({
            version: ['uuidv4']
        }).required(),
    });

    Joi.assert(payload, schema);
}

async function updateAnswer(req, res, next) {
    const { questionId, answerId } = req.params;
    const { userId } = req.claims;
    const answerData = {
        ...req.body,
        answerId,
        userId,
    };

    try {
        await validateSchema(answerData);
    } catch (e) {
        console.error(e);
        return res.status(400).send(e);
    }

    let connection;
    try {
        connection = await mysqlPool.getConnection();
        const now = new Date().toISOString().replace('T', ' ').substring(0, 19);

        const sqlUpdateAnswer = `UPDATE answers
            SET content = ?,
                updatedAt = ?
            WHERE id = ?
                AND userId = ?`;
        const [updatedStatus] = await connection.query(sqlUpdateAnswer, [
            answerData.content,
            now,
            answerId,
            userId,
        ]);
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

module.exports = updateAnswer;