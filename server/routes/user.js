const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');

router.get('/', userController.getAllUsers);
router.delete('/', userController.deleteAllUsers);
router.get('/:username', userController.getUser);
router.post('/signup', userController.userSignup);
router.post('/login', userController.userLogin);

module.exports = router;