const router = require('express').Router();
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Post = require('../models/post');
const checkJWT = require('../middleware/check-jwt');
const dotenv = require('dotenv').config();
const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const s3 = new aws.S3({ accessKeyId: process.env.aws_access_id_key, secretAccessKey: process.env.aws_secret_access_key});

const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'instagramstorage',
        metadata: (req, file, cb) => {
            cb(null, {fieldName: file.fieldname});
        },
        key: (req, file, cb) => {
            console.log(file);
            cb(null, Date.now().toString());
        }
    })
});
 

//Router for user account creation
router.post('/signup', (req, res, next) => {
    let user = new User();
    user.email = req.body.email;
    user.userName = req.body.username;
    user.firstName = req.body.firstName;
    user.secondName = req.body.secondName;
    user.password = req.body.password;
    user.bio = req.body.bio;
    user.profile_pic = user.defaultProfilePic();
    
    User.findOne({email: user.email}, (err, existingUser) => {
        if (existingUser) {
            res.json({
                success: false,
                message: 'Account with that email address already exists'
            });
        } else {
            user.save();
            var token = jwt.sign({ user: user, }, process.env.secret, { expiresIn: '7d' });
            res.json({
                success: true,
                message: 'token issued',
                token: token,
                user: user
            });
        }
    });
});

router.post('/login', (req, res, next) => {
    console.log(req.body);
    User.findOne({email: req.body.email}, (err, user) => {
        if (err) {
            res.json({
                success: false,
                message: "No account registered with that email address"
            });
        } else if (user) {
            let validPassword =  user.comparePassword(req.body.password);
            if(!validPassword) {
                res.json({
                    success: false,
                    message: 'Auth Failed'
                });
            } else {
                let token = jwt.sign({user: user}, process.env.secret, {expiresIn: '7d'});
                res.json({
                    success: true,
                    message: "Login Successful",
                    token: token
                });
            }
        }
    });
});

//Temp route for deleting all account
router.delete('/signup', (req, res, next) => {
    User.remove({}, (err) => {
        if(err) {
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
});

router.get('/allusers', (req, res, next) => {
    User.find({}, (err, doc) => {
        if(err) {
            res.json({
                err: err
            });
        } else {
            res.json({
                users: doc
            });
        }
    });
});

router.get('/user/:username', (req, res, next) => {
    User.findOne({userNameLower: req.params.username.toLowerCase()}, (err, user) => {
        if(!user) {
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
});

router.route('/post')
    .post([checkJWT, upload.single('post_image')], (req, res, next) => {
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
    })
    .get((req, res, next) => {
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
    });

router.get('/post/:postId', (req, res, next) => {
    Post.findOne({_id: req.params.postId})
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
});
    


module.exports = router;

