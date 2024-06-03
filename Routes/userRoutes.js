const express = require('express');
const router = express.Router();
const userController = require('../Controller/userController');
const oauth2Client = require('../middleware/authGoogle');
const verify = require('../middleware/verify');

router.post('/login', userController.login);
router.post('/register', userController.register);
router.put('/:id', verify.verifyToken, userController.updateUser);

//login Google
router.get('/auth/google', userController.loginWithGoogle);
router.get('/auth/google/callback', userController.googleCallback);

module.exports = router;
