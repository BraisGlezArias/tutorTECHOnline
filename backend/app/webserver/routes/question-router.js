'use strict';

const express = require('express');
const addTagToQuestion = require('../controllers/question/add-tag-question-controller')
const checkAccountSession = require('../controllers/account/check-account-session');
const createQuestion = require('../controllers/question/create-question-controller');
const deleteQuestion = require('../controllers/question/delete-question-controller');
const deleteTagFromQuestion = require('../controllers/question/delete-tag-question-controller');
const getQuestion = require('../controllers/question/get-question-controller');
const getQuestions = require('../controllers/question/get-questions-controller');
const updateQuestion = require('../controllers/question/update-question-controller');

const router = express.Router();

router.get('/questions', getQuestions);
router.post('/questions', checkAccountSession, createQuestion);
router.get('/questions/:questionId', getQuestion);
router.put('/questions/:questionId', checkAccountSession, updateQuestion);
router.delete('/questions/:questionId', checkAccountSession, deleteQuestion);
router.post('/questions/:questionId/tags', checkAccountSession, addTagToQuestion);
router.delete('/questions/:questionId/tags', checkAccountSession, deleteTagFromQuestion);

module.exports = router;