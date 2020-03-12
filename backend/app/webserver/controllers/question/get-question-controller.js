'use strict';

const Joi = require('@hapi/joi');
const mysqlPool = require('../../../database/mysql-pool');

async function validate(payload) {
    const schema = Joi.object({
        questionId: Joi.string().guid({
            version: ['uuidv4'],
        }).required(),
    });

    Joi.assert(payload, schema);
}

async function hydrateQuestion(rows) {
    const questionHydrated = rows.reduce((acc, rawQuestion) => {

      const tag = rawQuestion.tagId && rawQuestion.tagDeletedAt === null ? {
        id: rawQuestion.tagId,
        tag: rawQuestion.tag,
        deletedAt: rawQuestion.tagDeletedAt,
      } : undefined;

      const answer = rawQuestion.answerId && rawQuestion.answerDeletedAt === null ? {
          id: rawQuestion.answerId,
          answer: rawQuestion.answerContent,
          rating: rawQuestion.rating,
          createdAt: rawQuestion.answerCreatedAt,
          deletedAt: rawQuestion.answerDeletedAt,
          userId: rawQuestion.answerUserId,
          questionId: rawQuestion.questionId,
      } : undefined;
  
      const questionProcessed = acc.id !== undefined;

      if (!questionProcessed) {
        return {
          ...acc,
          ...rawQuestion,
          createdAt: rawQuestion.createdAt,
          updatedAt: rawQuestion.updatedAt,
          userId: rawQuestion.userId,
          tags: tag ? [tag] : [],
          tagId: undefined,
          tag: undefined,
          tagDeletedAt: null,
          created_at: undefined,
          updated_at: undefined,
          answers: answer ? [answer] : [],
          answerId: undefined,
          answerContent: undefined,
          rating: undefined,
          answerCreatedAt: undefined,
          answerDeletedAt: null,
          answerUserId: undefined,
          questionId: undefined,
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
        tags: uniqueElement([ ...acc.tags ], tag) ? [ ...acc.tags, tag ] : [ ...acc.tags ],
        answers: uniqueElement([ ...acc.answers ], answer) ? [ ...acc.answers, answer ] : [ ...acc.answers ],
      };
    }, {});
  
    return questionHydrated;
  }

async function getQuestion(req, res, next) {
  const { questionId } = req.params;
  try {
    const payload = {
      questionId,
    };
    await validate(payload);
  } catch (e) {
    return res.status(400).send(e);
  }

  let connection;
  try {
    connection = await mysqlPool.getConnection();
    const sqlQuery = `SELECT q.id, q.title, q.content,
      q.createdAt, q.updatedAt, q.userId,
      t.id AS tagId, t.tag, t.deletedAt AS tagDeletedAt,
      a.id AS answerId, a.content AS answerContent, a.createdAt AS answerCreatedAt, 
      a.deletedAt AS answerDeletedAt, a.userId AS answerUserId, a.questionId,
      AVG(r.rating) AS rating
      FROM questions q
      LEFT JOIN questionsTags qt
        ON q.id = qt.questionId
      LEFT JOIN tags t
        ON qt.tagId = t.id
      LEFT JOIN answers a
        ON q.id = a.questionId
      LEFT JOIN ratings r
        ON a.id = r.answerId
      WHERE
        q.id = ?
        AND q.deletedAt IS NULL
        GROUP BY q.id, a.id, t.id
        ORDER BY rating DESC, a.createdAt`;
    const [rows] = await connection.execute(sqlQuery, [questionId]);

    const updateSqlQuery = `UPDATE questions q
      SET visitCounter = visitCounter + 1
      WHERE q.id = ?`;
    await connection.query(updateSqlQuery, [questionId]);
    connection.release();
    
        if (rows.length === 0) {
            return res.status(404).send();
        }

        const question = await hydrateQuestion(rows);
        return res.send(question);
    } catch(e) {
        if (connection) {
            connection.release();
        }

        console.error(e);
        return res.status(500).send();
    }
}

module.exports = getQuestion;