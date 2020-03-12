'use strict';

const Joi = require('@hapi/joi');
const uuidV4 = require('uuid/v4');
const mysqlPool = require('../../../database/mysql-pool');

function auth(dataUser, dataAnswer) {
    if (dataUser.userId !== dataAnswer.userId) {
        return true;
    }
    return false;
}

async function validateSchema(payload) {
    const schema = Joi.object({
        rating: Joi.string().trim().min(1).max(3).required(),
    });

    Joi.assert(payload, schema);
}

async function createRating(req, res, next) {
    const ratingData = { ...req.body };
    const { userId } = req.claims;
    const { answerId } = req.params;
    const userData = { ...req.claims };

    let connection;
    try {
        connection = await mysqlPool.getConnection();
        const sqlQuery = `SELECT * FROM answers a
            WHERE a.id = ?`
        const [answerData] = await connection.query(sqlQuery, [answerId]);
        connection.release();

        if(!auth(userData, answerData[0])) {
            return res.status(403).send();
        }

        if (answerData.length === 0) {
            return res.status(404).send();
        }
    } catch (e) {
        if (connection) {
            connection.release();
        }

        console.error(e);
        return res.status(500).send();
    }

    try {
        const connection = await mysqlPool.getConnection();
        const sqlQuery = `SELECT * FROM ratings r
            LEFT JOIN answers a
            ON r.answerId = a.id
            WHERE a.id = ?`
        await connection.query(sqlQuery, [answerId]);
        connection.release();

    } catch (e) {
        if (connection) {
            connection.release();
        }

        console.error(e);
        return res.status(500).send();
    }

    try {
        const payload = {
            ...ratingData,
        };
        await validateSchema(payload);
    } catch (e) {
        return res.status(400).send(e);
    }

    const id = uuidV4();
    const createdAt = new Date().toISOString().substring(0, 19).replace('T', ' ');

    const rating = {
        id,
        rating: ratingData.rating,
        userId: userId,
        answerId: answerId,
        createdAt: createdAt,
    };

    try {
        const connection = await mysqlPool.getConnection();
        try {
        const sqlQuery = 'INSERT INTO ratings SET ?';
        await connection.query(sqlQuery, rating);
        
        connection.release();

        res.header('Location', `${process.env.HTTP_SERVER_DOMAIN}/api/answers/${answerId}/ratings/${rating.id}`);
        return res.status(201).send({
            ratingId: rating.id,
        });
        } catch (e) {
            connection.release();
            throw e;
        }
    } catch (e) {
        console.error(e);
        return res.status(500).send();
    }
}

module.exports = createRating;