'use strict';

const express = require('express');
const checkAccountSession = require('../controllers/account/check-account-session');
const createRating = require('../controllers/rating/create-rating-controller');
const deleteRating = require('../controllers/rating/delete-ratings-controller')
const getRating = require('../controllers/rating/get-rating-controller');
const getRatings = require('../controllers/rating/get-ratings-controller');

const router = express.Router();

router.post('/answers/:answerId/ratings', checkAccountSession, createRating);
router.delete('/answers/:answerId/ratings/:ratingId', checkAccountSession, deleteRating);
router.get('/ratings', getRatings);
router.get('/ratings/:ratingId', getRating);

module.exports = router;