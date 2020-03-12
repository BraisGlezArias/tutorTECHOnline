'use strict';

const mysqlPool = require('../../../database/mysql-pool');

async function getRatings(req, res, next) {

    try {
        const connection = await mysqlPool.getConnection();
        const sqlQuery = `SELECT *
        FROM ratings
        WHERE deletedAt IS NULL`;
        const [rows] = await connection.execute(sqlQuery);
        connection.release();

        if (rows.length === 0) {
            return res.status(404).send();
        }

        const ratings = rows.map(rating => {
            return {
                ...rating,
                createdAt: rating.createdAt,
                updatedAt: rating.updatedAt,
                userId: undefined,
                createdAt: undefined,
                updatedAt: undefined,
            };
        });

        return res.status(200).send({
            data: ratings,
        });
    } catch (e) {
        console.error(e);
        return res.status(500).send();
    }
}

module.exports = getRatings;