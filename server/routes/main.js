const router = require('express').Router();
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const checkJWT = require('../middleware/check-jwt');


//Router for user account creation
router.post('/signup', (req, res, next) => {
    let user = new User();
    user.email = req.body.email;
    user.firstName = req.body.firstName;
    user.secondName = req.body.secondName;
    user.password = req.body.password;
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
                token: token
            });
        }
    });
});

router.post('/login', (req, res, next) => {
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


module.exports = router;

