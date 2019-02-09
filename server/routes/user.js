const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const checkJWT = require('../middleware/check-jwt');

router.get('/', userController.getAllUsers);
router.delete('/', userController.deleteAllUsers);
router.get('/:username', userController.getUser);
router.post('/signup', userController.userSignup);
router.post('/login', userController.userLogin);
router.post('/follow', checkJWT, userController.followUser);
router.post('/unfollow', checkJWT, userController.unfollowUser);

module.exports = router;