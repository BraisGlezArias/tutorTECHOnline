'use strict';

const checkAccountSession = require('../controllers/account/check-account-session');
const createAnswer = require('../controllers/answer/create-answer-controller');
const deleteAnswer = require('../controllers/answer/delete-answer-controller');
const express = require('express');
const getAnswer = require('../controllers/answer/get-answer-controller');
const getAnswers = require('../controllers/answer/get-answers-controller');
const updateAnswer = require('../controllers/answer/update-answer-controller');

const router = express.Router();

router.get('/answers', getAnswers);
router.get('/answers/:answerId', getAnswer);
router.post('/questions/:questionId/answers', checkAccountSession, createAnswer);
router.put('/questions/:questionId/answers/:answerId', checkAccountSession, updateAnswer);
router.delete('/questions/:questionId/answers/:answerId', checkAccountSession, deleteAnswer);
module.exports = router;