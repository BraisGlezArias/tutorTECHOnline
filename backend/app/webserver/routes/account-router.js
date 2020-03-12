'use strict';

const express = require('express');
const createAccount = require('../controllers/account/create-account-controller');
const changePassword = require('../controllers/account/change-password-controller');
const changeUsername = require('../controllers/account/change-username-controller');
const changeRole = require('../controllers/account/change-role-controller');

const router = express.Router();

router.post('/accounts', createAccount);
router.put('/accounts/password', changePassword);
router.put('/accounts/username', changeUsername);
router.put('/accounts/role', changeRole);

module.exports = router;