'use strict';

const Joi = require('@hapi/joi');
const mysqlPool = require('../../../database/mysql-pool');

async function validate(payload) {
    const schema = Joi.object({
        userId: Joi.string().guid({
            version: ['uuidv4'],
        }).required(),
    });

    Joi.assert(payload, schema);
}

async function deleteUser(req, res, next) {
    const { userId } = req.params;

    try {
        await validate({ userId });
    } catch (e) {
        return res.status(400).send(e);
    }

    let connection;
    try {
        connection = await mysqlPool.getConnection();

        const deleteRating = `DELETE
        FROM ratings
        WHERE userId = ?`
        await connection.execute(deleteRating, [userId]);

        const deleteAnswer = `DELETE
        FROM answers
        WHERE userId = ?`
        await connection.execute(deleteAnswer, [userId]);

        const deleteQuestion = `DELETE
        FROM questions
        WHERE userId = ?`
        await connection.execute(deleteQuestion, [userId]);


        const deleteUser = `DELETE
        FROM users
        WHERE id = ?`
        await connection.execute(deleteUser, [userId]);

        return res.status(404).send();
    } catch (e) {
        if (connection) {
            connection.release();
        }

        return res.status(500).send(e.message);
    } 
}

module.exports = deleteUser;