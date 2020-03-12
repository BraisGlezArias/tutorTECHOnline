'use strict';

const mysqlPool = require('../../../database/mysql-pool');

async function getAllUsers(req, res, next) {

  try {
    const connection = await mysqlPool.getConnection();
    const sqlQuery = `SELECT u.id, u.userName, u.email,
      u.role, u.avatarURL, u.deletedAt, a.id AS answerId,
      a.deletedAt AS answerDeletedAt,
      AVG(r.rating) AS rating, 
      COUNT(r.rating) AS countRating
      FROM users u
        LEFT JOIN answers a
          ON u.id = a.userId
        LEFT JOIN ratings r
          ON a.id = r.answerId
        WHERE u.deletedAt IS NULL
        GROUP BY u.id, a.id, r.id`;
    const [rows] = await connection.execute(sqlQuery);
    connection.release();
  
    if (rows.length === 0) {
      return res.status(404).send();
    }
    
    const allUsers = rows.reduce((acc, user) => {

      const answer = user.answerId && user.answerDeletedAt === null ? {
        id: user.answerId,
        deletedAt: user.answerDeletedAt,
        rating: user.rating,
        ratings: user.countRating,
      } : undefined;

      const userProcessed = acc[user.id];

      if (!userProcessed) {
      return {
        ...acc,
        [user.id]: {
          ...user,
        createdAt: undefined,
        updatedAt: undefined,
        answers: answer ? [answer] : [],
        answerId: undefined,
        answerDeletedAt: undefined,
        rating: undefined,
        countRating: undefined,
        }
      };
      }

  const uniqueElement = function findRepeatedElement(array, element) {
    for( const el of array) {
        if (el !== undefined && element !== undefined) {
          if (el.id === element.id) {
            return false;
          }
        }
    }
    return true;
  }

    return {
      ...acc,
      [user.id]: {
        ...user,
      createdAt: undefined,
      updatedAt: undefined,
      answers: uniqueElement([ ...userProcessed.answers ], answer) ? [ ...userProcessed.answers, answer ] : [ ...userProcessed.answers ],
      answerId: undefined,
      answerDeletedAt: undefined,
      rating: undefined,
      countRating: undefined,
      }
    };
  }, {});

    return res.status(200).send({
      data: Object.values(allUsers),
    });
  } catch (e) {
    console.error(e);
    return res.status(500).send();
  }
}

module.exports = getAllUsers;