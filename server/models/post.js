const mongoose = require('mongoose');
const User = require('./user');
const Schema = mongoose.Schema;

const postSchema = new Schema({
    image: {type: String, required: true},
    caption: {type: String, required: true},
    created: {type: Date, default: Date.now},
    likes: {type: Number, default: 0},
    postedBy: {type: mongoose.SchemaTypes.ObjectId, ref: 'User', required: true},
    comments: [{
        comment: {type: String, required: true},
        commentor: {type: mongoose.SchemaTypes.ObjectId, ref: 'User', required: true}
    }]
});

module.exports = mongoose.model('Post', postSchema);