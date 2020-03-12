'use strict';

const express = require('express');
const login = require('../controllers/login/login-controller');

const router = express.Router();

router.post('/login', login);

module.exports = router;