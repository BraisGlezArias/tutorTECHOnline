'use strict';

const Joi = require('@hapi/joi');
const mysqlPool = require('../../../database/mysql-pool');


async function validate(payload) {
    const schema = Joi.object({
        tagId: Joi.string().trim().min(1).max(20).required()
    });

    Joi.assert(payload, schema);
}

async function deleteTag(req, res, next) {
    const { tagId } = req.params;

    try {
        await validate({ tagId, });
    } catch (e) {
        return res.status(400).send(e);
    }

    let connection;
    try {
        connection = await mysqlPool.getConnection();
        const sqlQuery = `UPDATE tags
        SET deletedAt = ?
        WHERE id = ?
            AND deletedAt IS NULL`;

        const now = new Date().toISOString().substring(0, 19).replace('T', ' ');
        const [deletedStatus] = await connection.execute(sqlQuery, [now, tagId,]);
        connection.release();

        if (deletedStatus.changedRows !== 1) {
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

module.exports = deleteTag;