const mongoose = require('mongoose');
const User = require('../models/user');
const Post = require('../models/post');
const checkJWT = require('../middleware/check-jwt');
const jwt = require('jsonwebtoken');

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
    User.findOne({ userNameLower: req.params.username.toLowerCase() }, (err, user) => {
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
    User.findOne({ _id: req.decoded.user._id }, (err, follower) => {
        if (err) {
            res.json({
                success: false,
                err: err
            });
        } else {
            User.findOne({ _id: req.body.userId }, (err, following) => {
                if (err) {
                    res.json({
                        success: false,
                        err: err
                    });
                } else {
                    follower.following.push(following);
                    following.followers.push(follower);
                    follower.save();
                    following.save();
                    res.json({
                        success: true,
                        message: "Successful follow",
                        user: follower
                    });
                }
            });
        }
    });
}