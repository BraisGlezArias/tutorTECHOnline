'use strict';

const mysqlPool = require('../../../database/mysql-pool');

async function getQuestionsByTag(req, res, next) {
    const { tagId } = req.params;
    try {
      const sqlQuery = `SELECT q.id, q.title, q.content, 
      q.createdAt, q.updatedAt, t.id AS tagId, t.tag
      FROM questions q
      LEFT JOIN questionsTags qt
        ON q.id = qt.questionId
      LEFT JOIN tags t
        ON qt.tagId = t.id
      WHERE t.id = ?
          AND q.deletedAt IS NULL
          AND t.deletedAt IS NULL
      ORDER BY createdAt`;
  
      const connection = await mysqlPool.getConnection();
      const [questionsData] = await connection.execute(sqlQuery, [tagId]);
      connection.release();

      if (questionsData.length === 0) {
        return res.status(404).send();
      }
  
      const questionsHydrated = questionsData.reduce((acc, rawQuestion) => {
        const tag = rawQuestion.tagId ? {
          id: rawQuestion.tagId,
          tag: rawQuestion.tag,
        } : undefined;

        const questionProcessed = acc[rawQuestion.id];
     
        if (!questionProcessed) {
          return {
             ...acc,
             [rawQuestion.id]: {
             ...rawQuestion,
             tags: tag ? [tag] : [],
             tagId: undefined,
             tag: undefined,
           },  
          }
        }
     
        return {
          ...acc,
          [rawQuestion.id]: {
           ...rawQuestion,
           tags: [ ...questionProcessed.tags, tag ],
           tagId: undefined,
           tag: undefined,
          },
        };
       }, {});
  
      return res.status(200).send({
        data: Object.values(questionsHydrated), 
      });
    } catch (e) {
      console.error(e);
      return res.status(500).send({
        message: e.message,
      });
    }
  }

module.exports = getQuestionsByTag;