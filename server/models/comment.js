const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./user');
const Post = require('./post');

const commentSchema = new Schema({
    created: {type: Date, default: Date.now()},
    commentText: {type: String, required: true},
    likes: {type: Number, default: 0},
    replies: [{type: mongoose.SchemaTypes.ObjectId, ref: 'Comment', default: []}],
    postedBy: {type: mongoose.SchemaTypes.ObjectId, ref: 'User', required: true},
    post: {type: mongoose.SchemaTypes.ObjectId, ref: 'Post', required: true}
});

commentSchema.pre('remove', (next) => {
    // Post.find({_id: this.post}, (err, post) {

    // });
    console.log("remove hook working");
});

module.exports = mongoose.model('Comment', commentSchema);