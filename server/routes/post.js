const express = require('express');
const router = express.Router();
const checkJWT = require('../middleware/check-jwt');
const postUpload = require('../middleware/post-upload');
const postController = require('../controllers/post');

const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const s3 = new aws.S3({ accessKeyId: process.env.aws_access_id_key, secretAccessKey: process.env.aws_secret_access_key });

const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'instagramstorage',
        metadata: (req, file, cb) => {
            cb(null, { fieldName: file.fieldname });
        },
        key: (req, file, cb) => {
            console.log(file);
            cb(null, Date.now().toString());
        }
    })
});

router.get('/', postController.getAllPosts);
router.get('post/:postId', postController.getPost);
router.post('/', [checkJWT, upload.single('post_image')], postController.createPost);
router.delete('/', postController.deleteAllPosts);
router.post('/likePost', checkJWT, postController.likePost);
//router.post('/comment', checkJWT, postController.postComment);
//TODO
router.get('/following', postController.getFollowingPosts);
//router.get('/ownPosts', postController.getOwnPosts);

module.exports = router;