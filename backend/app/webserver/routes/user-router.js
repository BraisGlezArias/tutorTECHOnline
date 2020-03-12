'use strict';

const express = require('express');
const multer = require('multer');
const checkAccountSession = require('../controllers/account/check-account-session');
const deleteUser = require('../controllers/user/delete-user');
const getAllUsers = require('../controllers/user/get-all-users-controller');
const getUser = require('../controllers/user/get-user-controller');
const getAnswersByUser = require('../controllers/user/get-answers-user-controller');
const getQuestionsByUser = require('../controllers/user/get-questions-user-controller');
const getRatingsByUser = require('../controllers/user/get-ratings-user-controller');
const upload = multer();
const uploadAvatar = require('../controllers/user/upload-avatar-controller');

const router = express.Router();

router.get('/users', getAllUsers);
router.delete('/users/:userId', deleteUser);
router.get('/users/:userId', getUser);
router.post('/users/avatar', checkAccountSession, upload.single('avatar'), uploadAvatar);
router.get('/users/:userId/answers', getAnswersByUser);
router.get('/users/:userId/questions', getQuestionsByUser);
router.get('/users/:userId/ratings', getRatingsByUser);

module.exports = router;