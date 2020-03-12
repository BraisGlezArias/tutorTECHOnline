'use strict';

const mysqlPool = require('../../../database/mysql-pool');

async function getAnswers(req, res, next) {
    try {
        const sqlQuery = `SELECT a.id, a.content,
            a.createdAt, a.updatedAt, r.id AS ratingId, r.rating
            FROM answers a
            LEFT JOIN ratings r
                ON a.id = r.answerId
            WHERE a.deletedAt IS NULL
            ORDER BY createdAt`;
            
        const connection = await mysqlPool.getConnection();
        const [answersData] = await connection.execute(sqlQuery);
        connection.release();

        if (answersData.length === 0) {
            return res.status(404).send();
        }

        const answersHydrated = answersData.reduce((acc, rawAnswer) => {
            const rating = rawAnswer.ratingId ? {
                id: rawAnswer.ratingId,
                rating: rawAnswer.rating,
            } : undefined;

            const answerProcessed = acc[rawAnswer.id];

            if (!answerProcessed) {
                return {
                    ...acc,
                    [rawAnswer.id]: {
                        ...rawAnswer,
                        ratings: rating ? [rating] : [],
                        ratingId: undefined,
                        rating: undefined,
                    },
                }
            }

            return {
                ...acc,
                [rawAnswer.id]: {
                    ...rawAnswer,
                    ratings: [ ...answerProcessed.ratings, rating],
                    ratingId: undefined,
                    rating: undefined,
                },
            };
        }, {});

        return res.status(200).send({
            data: Object.values(answersHydrated),
        });
    } catch (e) {
        console.error(e);
        return res.status(500).send({
            message: e.message,
        });
    }
}

module.exports = getAnswers;