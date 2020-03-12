'use strict';

const Joi = require('@hapi/joi');
const mysqlPool = require('../../../database/mysql-pool');

async function validate(payload) {
    const schema = Joi.object({
        answerId: Joi.string().guid({
            version: ['uuidv4'],
        }).required(),
    });

    Joi.assert(payload, schema);
}

async function deleteAnswer(req, res, next) {
    const { answerId } = req.params;
    const { userId } = req.claims;

    try {
        await validate({ answerId, });
    } catch (e) {
        return res.status(400).send(e);
    }

    let connection;
    try {
        connection = await mysqlPool.getConnection();
        const sqlQuery = `UPDATE answers
            SET deletedAt = ?
            WHERE id = ?
            AND userId = ?
            AND deletedAt IS NULL`;

        const now = new Date().toISOString().substring(0, 19).replace('T', ' ');
        const [deletedStatus] = await connection.execute(sqlQuery, [ now, answerId, userId ]);
        
        const sqlDeleteRatings = `UPDATE ratings
            SET deletedAt = ?
            WHERE answerId = ?
            AND deletedAt IS NULL`;
        await connection.execute(sqlDeleteRatings, [ now, answerId ])
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

module.exports = deleteAnswer;