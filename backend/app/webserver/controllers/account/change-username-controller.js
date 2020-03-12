'use strict';

const Joi = require('@hapi/joi');
const mysqlPool = require('../../../database/mysql-pool');

async function validateSchema(payload) {
  const schema = Joi.object({
    userName: Joi.string().trim().min(5).max(25).required({
      version: ['uuidv4'],
    }).required(),
    userId: Joi.string().guid({
      version: ['uuidv4'],
    }).required(),
  });

  Joi.assert(payload, schema);
}

async function changeUsername(req, res, next) {
  const { userId } = req.claims;
  const newUserName = {
    ...req.body,
    userId
  }

  try {
    await validateSchema(newUserName);
  } catch (e) {
    console.error(e);
    return res.status(400).send(e);
  }

  let connection;
  try {
    connection = await mysqlPool.getConnection();
    const sqlChangeUsername = `UPDATE users
      SET userName = ?
      WHERE id = ?`;   
    const [updatedStatus] = await connection.query(sqlChangeUsername, [
      newUserName.userName,
      userId,
    ]);
    connection.release();

    if (updatedStatus.changedRows === 0) {
      return res.status(404).send();
    }

    return res.status(204).send();
  } catch (e) {
    if (connection) {
      connection.release();
    }

    console.error(e);
    return res.status(500).send({
      message: e.message,
    });
  }
}

module.exports = changeUsername;