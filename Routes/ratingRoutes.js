const verify = require('../middleware/verify');
const express = require('express');
const router = express.Router();
const ratingController = require('../Controller/ratingController');

router.post('/', verify.verifyToken, ratingController.createRating);
router.get('/:id', ratingController.getRatingByKostId);

module.exports = router;
