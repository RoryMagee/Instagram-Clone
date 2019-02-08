const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./user');

const postSchema = new Schema({
    image: {type: String, required: true},
    caption: {type: String, required: true},
    created: {type: Date, default: Date.now},
    likes: {type: Number, default: 0},
    comments: [{
        commentor: {type: User},
        comment: {type: String, require: true}
    }]
});

module.exports = mongoose.Schema('Post', postSchema);