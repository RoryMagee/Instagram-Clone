const express = require('express');
const router = express.Router();
const checkJWT = require('../middleware/check-jwt');
const commentController = require('../controllers/comment');

router.post('/:postId', checkJWT, commentController.postComment);

module.exports = router;