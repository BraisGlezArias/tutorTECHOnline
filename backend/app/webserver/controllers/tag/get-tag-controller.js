'use strict';

const Joi = require('@hapi/joi');
const mysqlPool = require('../../../database/mysql-pool');

async function validate(payload) {
    const schema = Joi.object({
        tag: Joi.string().trim().min(1).max(20).required(),
    });

    Joi.assert(payload, schema);
}

async function getTag(req, res, next) {
    const { tag } = req.params;

    const payload = {
        tag,
    };

    try {
        await validate(payload);
    } catch (e) {
        return res.status(400).send(e);
    }

    try {
        const connection = await mysqlPool.getConnection();
        const getTagQuery = `SELECT id, tag, createdAt, updatedAt
        FROM tags
        WHERE tag = ?
            AND deletedAt IS NULL`;
        const [results] = await connection.execute(getTagQuery, [tag]);
        connection.release();
        if (results.length < 1) {
            return res.status(404).send();
        }

        const [tagData, ] = results;

        return res.send(tagData);
    } catch (e) {
        console.error(e);
        res.status(500).send({
            message: e.message,
        });
    }
}

module.exports = getTag;