const mongoose = require('mongoose');
const User = require('./user');
const Schema = mongoose.Schema;
const Comment = require('./comment');

const postSchema = new Schema({
    image: {type: String, required: true},
    caption: {type: String, required: true},
    created: {type: Date, default: Date.now},
    likes: {type: Number, default: 0},
    likedBy: [{type: mongoose.SchemaTypes.ObjectId, ref: 'User', default: []}],
    postedBy: {type: mongoose.SchemaTypes.ObjectId, ref: 'User', required: true},
    comments: [{type: mongoose.SchemaTypes.ObjectId, ref: 'Comment', default: []}]
});

postSchema.pre('remove', (next) => {
    Comment.remove({post: this._id}).exec();
});

module.exports = mongoose.model('Post', postSchema);