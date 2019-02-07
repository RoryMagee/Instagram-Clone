const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

const userSchema = new Schema({
    email: {type: String, unique: true, lowercase: true},
    firstName: {type: string},
    secondName: {type: string},
    password: {type: String},
    profile_pic: {type: String},
    created: {type: Date, default: Date.now},
    bio: {type: String}
});

userSchema.pre('save', function(next) {
    var user = this;
    if(!user.isModified('password')) return next();
    bcrypt.hash(user.password, null, null, (err, hash) => {
        if(err) return next(err);
        user.password = hash;
        console.log("userpassword = " + hash);
        next();
    });
});