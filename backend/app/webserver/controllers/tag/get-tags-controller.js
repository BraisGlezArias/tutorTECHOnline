'use strict';

const mysqlPool = require('../../../database/mysql-pool');

async function getTags(req, res, next) {

    try {
        const connection = await mysqlPool.getConnection();
        const sqlQuery = `SELECT *
        FROM tags
            WHERE deletedAt IS NULL`;
        const [rows] = await connection.execute(sqlQuery);
        connection.release();

        if (rows.length === 0) {
            return res.status(404).send();
        }

        const tags = rows.map(tag => {
            return {
                ...tag,
                value: tag.id,
                label: tag.tag,
                image: tag.image,
                createdAt: tag.createdAt,
                updatedAt: tag.updatedAt,
                userId: undefined,
                createdAt: undefined,
                updatedAt: undefined,
            };
        });

        return res.status(200).send({
            data: tags,
        });
    } catch (e) {
        console.error(e);
        return res.status(500).send();
    }
}

module.exports = getTags;