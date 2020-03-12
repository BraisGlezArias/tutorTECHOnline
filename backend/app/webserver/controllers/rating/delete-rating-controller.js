'use strict';

const Joi = require('@hapi/joi');
const mysqlPool = require('../../../database/mysql-pool');

async function validate(payload) {
    const schema = Joi.object({
        ratingId: Joi.string().guid({
            version: ['uuidv4'],
        }).required(),
    });

    Joi.assert(payload, schema);
}

async function deleteRating(req, res, next) {
    const { ratingId } = req.params;
    const { userId } = req.claims;

    try {
        await validate({ ratingId, });
    } catch (e) {
        return res.status(400).send(e);
    }

    let connection;
    try {
        connection = await mysqlPool.getConnection();
        const sqlQuery = `UPDATE ratings
            SET deletedAt = ?
            WHERE id = ?
                AND userId = ?
                AND deletedAt IS NULL`;

        const now = new Date().toISOString().substring(0, 19).replace('T', ' ');
        const [deletedStatus] = await connection.execute(sqlQuery, [now, ratingId, userId]);
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

module.exports = deleteRating;