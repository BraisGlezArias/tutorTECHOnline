'use strict';

const Joi = require('@hapi/joi');
const mysqlPool = require('../../../database/mysql-pool');

async function validateSchema(payload) {
    const schema = Joi.object({
        tag: Joi.string().trim().min(1).max(20).required(),
        tagId: Joi.string().guid({
            version: ['uuidv4']
        }).required(),
    });

    Joi.assert(payload, schema);
}

async function updateTag(req, res, next) {
    const { tagId } = req.params;
    const tagData = {
        ...req.body,
        tagId,
    };

    try {
        await validateSchema(tagData);
    } catch (e) {
        console.error(e);
        return res.status(400).send(e);
    }

    let connection;
    try {
        connection = await mysqlPool.getConnection();
        const now = new Date().toISOString().replace('T', ' ').substring(0, 19);

        const sqlUpdateTag = `UPDATE tags
            SET tag = ?,
                updatedAt = ?
            WHERE id = ?`;
        const [updatedStatus] = await connection.query(sqlUpdateTag, [tagData.tag, now, tagId]);
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

module.exports = updateTag;