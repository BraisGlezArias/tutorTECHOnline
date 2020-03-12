'use strict';

const express = require('express');
const multer = require('multer');
const createTag = require('../controllers/tag/create-tag-controller');
const checkAccountSession = require('../controllers/account/check-account-session');
const checkRoleUser = require('../controllers/account/check-role-user');
const deleteTag = require('../controllers/tag/delete-tag-controller');
const getQuestionsByTag = require('../controllers/tag/get-questions-tag-controller')
const getTag = require('../controllers/tag/get-tag-controller');
const getTags = require('../controllers/tag/get-tags-controller');
const updateTag = require('../controllers/tag/update-tag-controller');
const upload = multer();
const uploadImage = require('../controllers/tag/upload-tag-image-controller');

const router = express.Router();

router.post('/tags', checkAccountSession, checkRoleUser, createTag);
router.get('/tags', getTags);
router.delete('/tags/:tagId', checkAccountSession, checkRoleUser, deleteTag);
router.get('/tags/:tag', getTag);
router.put('/tags/:tagId', checkAccountSession, checkRoleUser, updateTag);
router.post('/tags/:tagId/image', checkAccountSession, checkRoleUser, upload.single('image'), uploadImage);
router.get('/tags/:tagId/questions', getQuestionsByTag);
module.exports = router;