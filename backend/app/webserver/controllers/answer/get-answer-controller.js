'use strict';

const Joi = require('@hapi/joi');
const mysqlPool = require('../../../database/mysql-pool');

async function validate(payload) {
    const schema = Joi.object({
        answerId: Joi.string().guid({
            version: ['uuidv4'],
        }).required(),
    });

    Joi.assert(payload, schema);
}

function hydrateAnswerRatings(rows) {
    const answerHydrated = rows.reduce((acc, rawAnswer) => {
        const rating = rawAnswer.ratingId ? {
            ratingId: rawAnswer.ratingId,
            rating: rawAnswer.rating,
        } : undefined;

        const answerProcessed = acc.id !== undefined;

        if (!answerProcessed) {
            return {
                ...acc,
                ...rawAnswer,
                createdAt: rawAnswer.createdAt,
                updatedAt: rawAnswer.updatedAt,
                ratings: rating ? [rating] : [],
                ratingId: undefined,
                rating: undefined,
                createdAt: undefined,
                updatedAt: undefined 
            }
        }

        return {
            ...acc,
            ratings: [ ...acc.ratings, rating ],
        };
    }, {});

    return answerHydrated;
}

async function getAnswer(req, res, next) {
    const { answerId } = req.params;
    try {
        const payload = {
            answerId,
        };
        await validate(payload);
    } catch (e) {
        return res.status(400).send(e);
    }

    let connection;
    try {
        connection = await mysqlPool.getConnection();
        const sqlQuery = `SELECT a.id, a.content,
            a.createdAt, a.updatedAt, r.id AS ratingId, r.rating
            FROM answers a
            LEFT JOIN ratings r
                ON a.id = r.answerId
            WHERE
                a.id = ?
                AND a.deletedAt IS NULL`;
        const [rows] = await connection.execute(sqlQuery, [answerId]);
        connection.release();

        if (rows.length === 0) {
            return res.status(404).send();
        }

        const answer = hydrateAnswerRatings(rows);
        return res.send(answer);
    } catch(e) {
        if (connection) {
            connection.release();
        }

        console.error(e);
        return res.status(500).send();
    }
}

module.exports = getAnswer;