const mongoose = require('mongoose');
const User = require('../models/user');
const Post = require('../models/post');
const checkJWT = require('../middleware/check-jwt');
const dotenv = require('dotenv').config();
const async = require('async');

exports.getAllPosts = (req, res, next) => {
    Post.find({})
        .populate('postedBy')
        //.populate('comments')
        // .populate({
        //     path: 'comments',
        //     populate: [{path: 'replies'}]
        // })
        .exec((err, posts) => {
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
        .populate('postedBy')
        .populate('comments')
        .populate({
            path: 'comments',
            populate: [{path: 'replies'}]
        })
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
    User.findOne({ _id: req.decoded.user._id }, (err, user) => {
        if (err) {
            res.json({
                success: false,
                err: err
            });
        } else {
            let post = new Post();
            post.postedBy = req.decoded.user._id;
            post.image = req.file.location;
            post.caption = req.body.caption;
            post.save();
            user.posts.push(post);
            user.save();
            res.json({
                success: true,
                message: 'Post made successfully',
                post: post
            });
        }
    });
}

exports.deleteAllPosts = (req, res, next) => {
    Post.remove({}, (err) => {
        if (err) {
            res.json({
                success: false,
                err: err
            });
        } else {
            res.json({
                success: true,
                message: 'All posts successfully deleted'
            });
        }
    });
}

exports.likePost = (req, res, next) => {
    async.parallel([
        (callback) => {
            User.findOne({ _id: req.decoded.user._id }, (err, user) => {
                callback(err, user);
            });
        },
        (callback) => {
            Post.findOne({ _id: req.body.postId }, (err, post) => {
                if (err) {
                    return next(err);
                } else {
                    callback(err, post);
                }
            });
        }
    ], (err, results) => {
        let user = results[0];
        let post = results[1];
        Post.countDocuments({ $and: [{likedBy: user}, {_id: post}]}, (err, count) => {
            console.log(count);
            if (err) {
                res.json({
                    success: false,
                    err: err
                });
            } else if (count > 0) {
                post.likedBy.remove(user);
                post.likes--;
                user.likedPosts.remove(post);
                post.save();
                user.save();
                res.json({
                    success: true,
                    message: 'Like removed',
                    post: post
                });
            } else if (count == 0) {
                post.likedBy.push(user);
                post.likes++;
                user.likedPosts.push(post);
                post.save();
                user.save();
                res.json({
                    success: true,
                    message: 'Like added',
                    post: post
                });
            }
        });
    });
}

exports.postComment = (req, res, next) => {
    Post.findOne({_id: req.body.postId}, (err, post) => {
        
    })
}