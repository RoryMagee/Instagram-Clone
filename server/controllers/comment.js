const mongoose = require('mongoose');
const User = require('../models/user');
const Post = require('../models/post');
const Comment = require('../models/comment');
const async = require('async');

exports.postComment = (req, res, next) => {
    Post.findOne({ _id: req.params.postId }, (err, post) => {
        if (err) {
            res.json({
                success: false,
                err: err
            });
        } else {
            let comment = new Comment();
            comment.commentText = req.body.comment;
            comment.postedBy = req.decoded.user._id;
            comment.post = post._id;
            comment.save();
            post.comments.push(comment);
            post.save();
            res.json({
                success: true,
                message: 'Comment sucessfully added',
                comment: comment
            });
        }

    });
}

exports.deleteComment = (req, res, next) => {
    Comment.remove({_id: req.params.commentId}, (err, comment) => {
        if(err) {
            res.json({
                success: false,
                err: err
            });
        } else {
            res.json({
                success: true,
                comment: comment
            });
        }
    });
}

exports.deleteAllComments = (req, res, next) => {
    Comment.remove({}, (err, comment) => {
        if(err) {
            res.json({
                success: false,
                err: err
            });
        } else {
            res.json({
                success: true,
                comment: comment
            });
        }
    });
}

exports.getComment = (req, res, next) => {
    Comment.findOne({_id: req.params.commentId}, (err,comment) => {
        if(err) {
            res.json({
                sucess: false,
                err: err
            });
        } else {
            res.json({
                success: true,
                comment: comment
            });
        }
    });
}

exports.getAllComments = (req, res, next) => {
    Comment.find({}, (err, comments) => {
        if(err) {
            res.json({
                success: false,
                err: err
            });
        } else {
            res.json({
                success: true,
                comments: comments
            });
        }
    });
}