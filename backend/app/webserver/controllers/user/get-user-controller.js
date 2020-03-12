'use strict';

const mysqlPool = require('../../../database/mysql-pool');

async function getUser(req, res, next) {
  const { userId } = req.params;

  try {
    const connection = await mysqlPool.getConnection();
    const sqlQuery = `SELECT id, userName, email, role, avatarURL, createdAt, updatedAt
      FROM users
      WHERE id = ?
        AND deletedAt IS NULL`;
    const [rows] = await connection.execute(sqlQuery, [userId]);
    connection.release();

    if (rows.length < 1) {
      return res.status(404).send();
    }
    
    const [anUser, ] = rows;

    return res.status(200).send(anUser);
  } catch (e) {
    console.error(e);
    return res.status(500).send();
  }
}

module.exports = getUser;

