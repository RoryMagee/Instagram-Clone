const mongoose = require('mongoose');
const User = require('../models/user');
const Post = require('../models/post');
const checkJWT = require('../middleware/check-jwt');
const dotenv = require('dotenv').config();
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

exports.getAllPosts = (req, res, next) => {
    Post.find({}, (err, posts) => {
        if (err) {
            res.json({
                success: false,
                err: err
            });
        } else {
            res.json({
                success: true,
                posts: posts
            });
        }
    });
}


exports.getPost = (req, res, next) => {
    Post.findOne({ _id: req.params.postId })
        .populate('User')
        .exec((err, doc) => {
            if (err) {
                res.json({
                    success: false,
                    err: err
                });
            } else {
                res.json({
                    success: true,
                    doc: doc
                });
            }
        });
}

exports.createPost = (req, res, next) => {
    console.log(req.body);
    let post = new Post();
    post.postedBy = req.decoded.user._id;
    post.image = req.file.location;
    post.caption = req.body.caption;
    post.save();
    res.json({
        success: true,
        message: 'Post made successfully'
    });
}