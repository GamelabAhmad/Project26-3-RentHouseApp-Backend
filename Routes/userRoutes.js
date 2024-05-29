const express = require('express');
const router = express.Router();
const userController = require('../Controller/userController');
const verify = require('../middleware/verify');

router.post('/login', userController.login);
router.post('/register', userController.register);
router.get('/', verify.verifyToken, userController.getUsers);
router.get('/:id', userController.getUserById);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;
