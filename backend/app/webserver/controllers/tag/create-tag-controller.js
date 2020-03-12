'use strict';

const uuidV4 = require('uuid/v4');
const Joi = require('@hapi/joi');
const mysqlPool = require('../../../database/mysql-pool');

async function validateSchema(payload) {
    const schema = Joi.object({
        tag: Joi.string().trim().min(1).max(20).required(),
    });

    Joi.assert(payload, schema);
}

async function createTag(req, res, next) {
    const tagData = { ...req.body };
    
    try {
        const payload = {
            ...tagData,
        };
        await validateSchema(payload);
    } catch (e) {
        return res.status(400).send(e);
    }

    const id = uuidV4();
    const createdAt = new Date().toISOString().substring(0, 19).replace('T', ' ');

    const tag = {
        id,
        tag: tagData.tag,
        createdAt: createdAt,
    };

    let connection;
    try {
        connection = await mysqlPool.getConnection();
        const sqlQuery = 'INSERT INTO tags SET ?';
        await connection.query(sqlQuery, tag);
        connection.release();

        res.header('Location', `${process.env.HTTP_SERVER_DOMAIN}/api/tags/${tag.tag}`);
        return res.status(201).send({
            tagId: tag.tag,
        });
    } catch (e) {
        if (connection) {
            connection.release();
        }
        if (e.code === 'ER_DUP_ENTRY') {
            return res.status(409).send();
        }

        console.error(e);
        return res.status(500).send();
    }
}

module.exports = createTag;
