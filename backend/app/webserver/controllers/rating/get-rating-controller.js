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

async function getRating(req, res, next) {
    const ratingId = req.params.ratingId;

    const payload = {
        ratingId,
    };

    try {
        await validate(payload);
    } catch (e) {
        return res.status(400).send(e);
    }

    try {
        const connection = await mysqlPool.getConnection();
        const getRatingQuery = `SELECT id, rating, createdAt, updatedAt
        FROM ratings
        WHERE id = ?
        AND deletedAt is NULL`;
        const [results] = await connection.execute(getRatingQuery, [ratingId]);
        connection.release();
        if (results.length < 1) {
            return res.status(404).send();
        }

        const [ratingData, ] = results;
        
        return res.send(ratingData);
    } catch (e) {
        console.error(e);
        res.status(500).send({
            message: e.message,
        });
    }
}

module.exports = getRating;