const mongoose = require('mongoose');
const User = require('../models/user');
const Post = require('../models/post');
const checkJWT = require('../middleware/check-jwt');
const jwt = require('jsonwebtoken');
const async = require('async');

exports.getAllUsers = (req, res, next) => {
    User.find({})
        .populate('posts')
        .exec((err, doc) => {
            if (err) {
                res.json({
                    err: err
                });
            } else {
                res.json({
                    users: doc
                });
            }
        });
}

exports.deleteAllUsers = (req, res, next) => {
    User.remove({}, (err) => {
        if (err) {
            res.json({
                err: err
            });
        } else {
            res.json({
                success: true,
                message: 'All users deleted'
            });
        }
    });
}

exports.getUser = (req, res, next) => {
    User.find({ _id: req.params.identifier })
        .populate('posts')
        .exec((err, user) => {
        if (!user) {
            res.json({
                success: false,
                message: 'No user with that username'
            });
        } else {
            res.json({
                success: true,
                user: user
            });
        }
    });

}

exports.getProfile = (req, res, next) => {
    User.find({_id: req.decoded.user._id}, (err, user) => {
        if (err) {
            res.json({
                success: false,
                err: err,
                message: 'user not found'
            });
        } else {
            res.json({
                success: true,
                user: user
            });
        }
    });
}

exports.userSignup = (req, res, next) => {
    let user = new User();
    user.email = req.body.email;
    user.userName = req.body.username;
    user.firstName = req.body.firstName;
    user.secondName = req.body.secondName;
    user.password = req.body.password;
    user.bio = req.body.bio;
    user.profile_pic = user.defaultProfilePic();

    User.findOne({ email: user.email }, (err, existingUser) => {
        if (existingUser) {
            res.json({
                success: false,
                message: 'Account with that email address already exists'
            });
        } else {
            user.save();
            let token = jwt.sign({ user: user }, process.env.secret, { expiresIn: '7d'});
            res.json({
                success: true,
                message: 'Account successfully created',
                token: token
            });
        }
    });
}

exports.userLogin = (req, res, next) => {
    User.findOne({ email: req.body.email }, (err, user) => {
        if (err) {
            res.json({
                success: false,
                message: "No account registered with that email address"
            });
        } else if (user) {
            let validPassword = user.comparePassword(req.body.password);
            if (!validPassword) {
                res.json({
                    success: false,
                    message: 'Auth Failed'
                });
            } else {
                let token = jwt.sign({ user: user }, process.env.secret, { expiresIn: '7d' });
                res.json({
                    success: true,
                    message: "Login Successful",
                    token: token
                });
            }
        }
    });
}

exports.followUser = (req, res, next) => {
    async.parallel([
        (callback) => {
            User.findOne({_id: req.decoded.user._id}, (err, follower) => {
                callback(err, follower);
            });
        },
        (callback) => {
            User.findOne({_id: req.body.userId}, (err, following) => {
                if(err) {
                    return next(err);
                } else {
                    callback(err, following);
                }
            });
        },
        (callback) => {
            //Count = number of users in following array that match selected user
            User.countDocuments({$and: [{_id: req.decoded.user._id}, {following: req.body.userId}]}, (err, count) => {
                if(err) {
                    return next(err);
                } else {
                    callback(err, count);
                }
            });
        }
    ], (err, results) => {
        let follower = results[0];
        let following = results[1];
        let count = results[2];
        if(err) {
            res.json({
                success: false,
                err: err
            });
        } else if (count > 0) {
            following.followers.remove(follower);
            follower.following.remove(following);
            follower.save();
            following.save();
            res.json({
                success: true,
                message: 'User successfully unfollowed'
            });
        } else if (count == 0) {
            following.followers.push(follower);
            follower.following.push(following);
            follower.save();
            following.save();
            res.json({
                success: true,
                message: 'User successfully followed'
            });
        }
    });
}

exports.getFollowers = (req, res, next) => {
    User.find({_id: {$in: [req.decoded.user.followers]}}, (err, followers) => {
        console.log("sdkfjghsdfklgjhsd");
        if (err) {
            res.json({
                success: false,
                err: err
            });
        } else {
            res.json({
                success: false,
                followers: followers
            });
        } 
    });
}

exports.getFollowing = (req, res, next) => {
    User.find({_id: {$in: [req.decoded.user.following]}}, (err, following) => {
        console.log("sdkfjghsdfklgjhsd");
        if (err) {
            res.json({
                success: false,
                err: err
            });
        } else {
            res.json({
                success: false,
                following: following
            });
        } 
    });
}