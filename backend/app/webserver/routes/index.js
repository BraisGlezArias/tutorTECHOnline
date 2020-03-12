'use strict';

const accountRouter = require('./account-router');
const answerRouter = require('./answer-router');
const loginRouter = require('./login-router');
const questionRouter = require('./question-router');
const ratingRouter = require('./rating-router');
const tagRouter = require(`./tag-router`);
const userRouter = require('./user-router');

module.exports = {
  accountRouter,
  answerRouter,
  loginRouter,
  questionRouter,
  ratingRouter,
  tagRouter,
  userRouter,
};
