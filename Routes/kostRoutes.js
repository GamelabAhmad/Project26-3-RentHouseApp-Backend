const kostController = require('../Controller/kostController');
const verify = require('../middleware/verify');
const express = require('express');
const upload = require('../middleware/multer');
const router = express.Router();

router.post('/', upload.array('image'), kostController.createKost);
router.get('/', kostController.getKosts);

module.exports = router;
