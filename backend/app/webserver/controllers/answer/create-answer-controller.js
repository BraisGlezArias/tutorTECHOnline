'use strict';

const Joi = require('@hapi/joi');
const uuidV4 = require('uuid/v4');
const mysqlPool = require('../../../database/mysql-pool');

function auth(dataUser, dataQuestion) {
    if (dataUser.userId !== dataQuestion.userId && dataUser.role !== 'User') {
        return true;
    }
    return false;
}

async function validate(payload) {
    const schema = Joi.object({
        content: Joi.string().trim().min(10).max(65536).required(),
        ratings: Joi.array(),
    });

    Joi.assert(payload, schema);
}

async function createAnswer(req, res, next) {
    const answerData = { ...req.body };
    const { userId, role } = req.claims;
    const userData = { ...req.claims }
    const { questionId } = req.params;

    let connection;
    try {
        connection = await mysqlPool.getConnection();
        const sqlQuery = `SELECT * FROM questions q
            WHERE q.id = ?`;
        const [questionData] = await connection.query(sqlQuery, [questionId]);   
        connection.release();

        if (!auth(userData, questionData[0])) {
            return res.status(403).send();
        }

        if (questionData.length === 0) {
            return res.status(404),send();
        }
    
    } catch(e) {
        if (connection) {
            connection.release();
        }

        console.error(e);
        return res.status(500).send();
    }

    try {
        await validate(answerData);
    } catch(e) {
        return res.status(400).send(e);
    }

    const now = new Date().toISOString().substring(0, 19).replace('T', ' ');
    const {
        content,
    } = answerData;

    const answerId = uuidV4();
    const answer = {
        id: answerId,
        content,
        userId: userId,
        questionId: questionId,
        createdAt: now,
    };

    try {
        const connection = await mysqlPool.getConnection();
        try {
            const sqlCreateAnswer = 'INSERT INTO answers SET ?';
            await connection.query(sqlCreateAnswer, answer);

            connection.release();

            res.header('Location', `${process.env.HTTP_SERVER_DOMAIN}/api/questions/${questionId}/answers/${answerId}`);
            return res.status(201).send({
                answerId: answer.id,
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

module.exports = createAnswer;