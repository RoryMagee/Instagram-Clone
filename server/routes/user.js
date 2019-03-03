const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const checkJWT = require('../middleware/check-jwt');

router.get('/', userController.getAllUsers);
router.delete('/', userController.deleteAllUsers);
router.get('/user', checkJWT, userController.getProfile);
router.get('/user/:identifier', userController.getUser);
router.post('/signup', userController.userSignup);
router.post('/login', userController.userLogin);
router.post('/follow', checkJWT, userController.followUser);
//TODO
router.get('/followers', checkJWT, userController.getFollowers);
router.get('/following', checkJWT, userController.getFollowing);

module.exports = router;