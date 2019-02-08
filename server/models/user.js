const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');
const crypto = require('crypto');
const Post = require('./post');

const userSchema = new Schema({
    email: {type: String, unique: true, lowercase: true, required: true},
    firstName: {type: String, required: true},
    secondName: {type: String, required: true},
    password: {type: String, required: true},
    profile_pic: {type: String},
    created: {type: Date, default: Date.now},
    bio: {type: String},
    posts: [{type: Post, default: []}]
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

userSchema.methods.comparePassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

userSchema.methods.defaultProfilePic = function(size) {
    if(!this.size) size = 200;
    if(!this.email) return 'https://gravatar.com/?s' + size + '&d=retro';
    var md5 = crypto.createHash('md5').update(this.email).digest('hex');
    return 'https://gravatar.com/avatar/' + md5 + '?s' + size + '&d=retro';
}

module.exports = mongoose.model('User', userSchema);