const kostController = require('../Controller/kostController');
const verify = require('../middleware/verify');
const express = require('express');
const upload = require('../middleware/multer');
const router = express.Router();

router.post('/', verify.verifyToken, verify.verifyIsPemilik, upload.array('image'), kostController.createKost);
router.get('/', kostController.getKosts);
router.get('/search', kostController.searchKosts);
router.get('/:id', kostController.getKostsById);
router.put('/:id', verify.verifyToken, verify.verifyIsPemilik, upload.array('image'), kostController.updateKosts);
router.delete('/:id', verify.verifyToken, verify.verifyIsPemilik, kostController.deleteKosts);

module.exports = router;
