'use strict';

const mysqlPool = require('../../../database/mysql-pool');

async function getRatingsByUser(req, res, next) {
    const { userId } = req.params;
    try {
        const sqlQuery =`SELECT *
            FROM ratings
            WHERE userId = ?
                AND deletedAt IS NULL
            ORDER BY createdAt`;

        const connection = await mysqlPool.getConnection();
        const [ratingsData] = await connection.execute(sqlQuery, [userId]);
        connection.release();

        if (ratingsData.length === 0) {
            return res.status(404).send();
        }

        const ratings = ratingsData.map(rating => {
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
            data: Object.values(ratings),
        });
    } catch (e) {
        console.error(e);
        return res.status(500).send({
            message: e.message,
        });
    }
}

module.exports = getRatingsByUser;