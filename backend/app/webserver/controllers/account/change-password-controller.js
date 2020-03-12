'use strict';

const bcrypt = require('bcrypt');
const Joi = require('@hapi/joi');
const jwt = require('jsonwebtoken');
const mysqlPool = require('../../../database/mysql-pool');

async function validateSchema(payload) {
  const schema = Joi.object({
    password: Joi.string().trim().min(5).max(25).required({
      version: ['uuidv4'],
    }).required(),
    newPassword: Joi.string().trim().min(5).max(25).required({
      version: ['uuidv4'],
    }).required(),
    confirmedNewPassword: Joi.string().trim().min(5).max(25).required({
      version: ['uuidv4'],
    }).required(),
    userId: Joi.string().guid({
      version: ['uuidv4'],
    }).required(),
  });

  Joi.assert(payload, schema);
}

async function changePassword(req, res, next) {

  const newPassword = {
    ...req.body,
  }

  if (newPassword.newPassword !== newPassword.confirmedNewPassword) {
    return res.status(404).send();
  }

  const userId = newPassword.userId;
  const secureNewPassword = await bcrypt.hash(newPassword.newPassword, 10);

  try {
    await validateSchema(newPassword);
  } catch (e) {
    console.error(e);
    return res.status(400).send(e);
  }

  let connection;
  const sqlQuery = `SELECT id, email, password, userName, role, avatarUrl
    FROM users
    WHERE id = '${userId}'`;
  

  try {
    connection = await mysqlPool.getConnection();
    const [rows] = await connection.query(sqlQuery);
    connection.release();

    if (rows.length !== 1) {
      return res.status(401).send();
    }

    const user = rows[0];

    try {
      const isPasswordOk = await bcrypt.compare(newPassword.password, user.password);
      if (!isPasswordOk) {
        return res.status(401).send();
      }
    } catch (e) {
      return res.status(500);
    }
  } catch (e) {
    console.error(e);
    return res.status(500).send();
  }

  try {
    connection = await mysqlPool.getConnection();

    const sqlChangePassword = `UPDATE users
    SET password = ?
    WHERE id = ?`;   

    const [updatedStatus] = await connection.query(sqlChangePassword, [
      secureNewPassword,
      userId,
    ]);

    const sqlQuery2 = `SELECT id, email, password, userName, role, avatarUrl
    FROM users
    WHERE id = ?`;
    const [rows2] = await connection.query(sqlQuery2, [userId]);
    connection.release();

    const user = rows2[0];

    if (updatedStatus.changedRows === 0) {
      return res.status(404).send();
    }

    const payloadJwt = {
      userId: user.id,
      role: user.role,
    }

    const jwtExpiresIn = parseInt(process.env.AUTH_ACCESS_TOKEN_TTL);
    const token = jwt.sign(payloadJwt, process.env.AUTH_JWT_SECRET, {
      expiresIn: jwtExpiresIn,
    })

    return res.status(204).send({
      userId: user.id,
      role: user.role,
      accessToken: token,
      avatarUrl: user.avatarUrl,
      expiresIn: jwtExpiresIn,
    });
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

module.exports = changePassword;