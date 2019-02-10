const mongoose = require('mongoose');
const User = require('../models/user');
const Post = require('../models/post');
const Comment = require('../models/comment');
const async = require('async');

// exports.postComment = (req, res, next) => {
//     async.parallel([
//         (callback) => {
//             Post.findOne({_id: req.params.postId}, (err, post) => {
//                 callback(err, post);
//             });
//         },
//         (callback) => {
//             User.findOne({_id: req.decoded.user._id}, (err, poster) => {
//                 if(err) return next(err);
//                 callback(err, poster);
//             });
//         }
//     ], (err, results) => {
//         let post = results[0];
//         let poster = results[1];
//         if(err) {
//             res.json({
//                 success: false,
//                 err: err
//             });
//         } else {
//             let comment = new Comment();
//             comment.commentText = req.body.comment;
//             comment.postedBy = poster;
//             comment.post = post;
//             comment.save();
//             res.json({
//                 success: true,
//                 message: 'Comment successfully added',
//                 post: post,
//                 comment: comment
//             });
//         }
//     });
// }

// exports.postComment = (req, res, next) => {
//     async.parallel([
//         (callback) => {
//             User.findOne({_id: req.decoded.user._id}, (err, poster) => {
//                 callback(err, poster);
//             });
//         },
//         (callback) => {
//             let comment = new Comment();
//             comment.commentText = req.body.comment;
//             comment.postedBy = req.decoded.user._id;
//             comment.post = req.params.postId;
//             comment.save();
//             callback(comment);
//         }
//     ], (err, results) => {
//         let poster = results[0];
//         let comment = results[1];
//         if(err) {
//             res.json({
//                 success: false,
//                 err: err
//             });
//         } else {
//             poster.comments.push(comment);
//             poster.save();
//         }
//     });
// }

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
                message: 'Comment sucessfully added'
            });
        }

    });
}