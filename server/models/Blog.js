const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BlogSchema = new Schema({
  title: { type: String, required: true },
  article: { type: String, required: true },
  published: { type: Date, required: true },
  featured: { type: Boolean, required: true },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true }
})

module.exports = mongoose.model('Blog', BlogSchema)