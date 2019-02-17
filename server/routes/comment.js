const express = require('express');
const router = express.Router();
const checkJWT = require('../middleware/check-jwt');
const commentController = require('../controllers/comment');

router.post('/:postId', checkJWT, commentController.postComment);
router.post('/reply/:commentId', checkJWT, commentController.postReply);
router.delete('/:commentId', checkJWT, commentController.deleteComment);
router.delete('/', commentController.deleteAllComments);
router.get('/:commentId', commentController.getComment);
router.get('/', commentController.getAllComments);
module.exports = router;