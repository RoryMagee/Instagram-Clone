const express = require('express');
const router = express.Router();
const postController = require('../controllers/post');

router.get('/', postController.getAllPosts);
router.get('/:postID', postController.getPost);
router.post('/', postController.createPost);

module.exports = router;