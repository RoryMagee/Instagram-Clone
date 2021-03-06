const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./user');
const Post = require('./post');

const commentSchema = new Schema({
    created: {type: Date, default: Date.now()},
    commentText: {type: String, required: true},
    likes: {type: Number, default: 0},
    replies: [{type: mongoose.SchemaTypes.ObjectId, ref: 'Comment', default: []}],
    postedBy: {type: mongoose.SchemaTypes.ObjectId, ref: 'User', required: true}
    //post: {type: mongoose.SchemaTypes.ObjectId, ref: 'Post', required: true}
});

function autoPopulateSubs(next) {
    this.populate('replies');
    next();
  }

commentSchema
  .pre('findOne', autoPopulateSubs)
  .pre('find', autoPopulateSubs)
  .pre('remove', (next) => {
      console.log("Removing replies");
      Comment.remove({_id: {$in: [this.replies]}}).exec();
      next();
  });

module.exports = mongoose.model('Comment', commentSchema);