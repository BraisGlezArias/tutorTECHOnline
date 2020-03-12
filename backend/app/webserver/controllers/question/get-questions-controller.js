'use strict';

const mysqlPool = require('../../../database/mysql-pool');

async function getQuestions(req, res, next) {
    try {
      const sqlQuery = `SELECT q.id, q.title, q.content, 
        q.createdAt, q.updatedAt, q.userId, q.visitCounter,
        t.id AS tagId, t.tag, t.deletedAt AS tagDeletedAt,
        a.id AS answerId, a.createdAt AS answerCreatedAt,
        a.deletedAt AS answerDeletedAt, a.userId AS answerUserId,
        a.questionId, AVG(r.rating) AS averageRating, COUNT(r.rating) AS countRating
        FROM questions q
        LEFT JOIN questionsTags qt
          ON q.id = qt.questionId
        LEFT JOIN tags t
          ON qt.tagId = t.id
        LEFT JOIN answers a
          ON q.id = a.questionId
        LEFT JOIN ratings r
          ON a.id = r.answerId
        WHERE q.deletedAt IS NULL
        GROUP BY q.id, a.id, t.id
        ORDER BY createdAt DESC`;
  
      const connection = await mysqlPool.getConnection();
      const [questionsData] = await connection.execute(sqlQuery);
      connection.release();
      
      if (questionsData.length === 0) {
        return res.status(404).send();
      }

      const questionsHydrated = questionsData.reduce((acc, rawQuestion) => {
        
        const tag = rawQuestion.tagId && rawQuestion.tagDeletedAt === null ? {
          id: rawQuestion.tagId,
          tag: rawQuestion.tag,
          deletedAt: rawQuestion.tagDeletedAt,
        } : undefined;

        const answer = rawQuestion.answerId && rawQuestion.answerDeletedAt === null ? {
          id: rawQuestion.answerId,
          rating: rawQuestion.averageRating,
          ratings: rawQuestion.countRating,
          createdAt: rawQuestion.answerCreatedAt,
          deletedAt: rawQuestion.answerDeletedAt,
          userId: rawQuestion.answerUserId,
          questionId: rawQuestion.questionId,
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
             tagDeletedAt: null,
             answers: answer ? [answer] : [],
             answerId: undefined,
             averageRating: undefined,
             countRating: undefined,
             answerCreatedAt: undefined,
             answerDeletedAt: null,
             answerUserId: undefined,
             questionId: undefined,
           },  
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
          [rawQuestion.id]: {
           ...rawQuestion,
           tags: uniqueElement([ ...questionProcessed.tags ], tag) ? [ ...questionProcessed.tags, tag ] : [ ...questionProcessed.tags ],
           tagId: undefined,
           tag: undefined,
           tagDeletedAt: null,
           answers: uniqueElement([ ...questionProcessed.answers ], answer) ? [ ...questionProcessed.answers, answer ] : [ ...questionProcessed.answers ],
           answerId: undefined,
           averageRating: undefined,
           countRating: undefined,
           answerCreatedAt: undefined,
           answerDeletedAt: null,
           answerUserId: undefined,
           questionId: undefined,
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

module.exports = getQuestions;