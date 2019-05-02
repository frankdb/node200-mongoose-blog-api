// Imports mongoose and extracts Schema into it's own variable
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Creates a new Mongoose Schema with two properties
const UserSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  social: {
    facebook: { type: String, required: false },
    twitter: { type: String, required: false },
    linkedIn: { type: String, required: false }
  },
  blogs: [{ type: Schema.Types.ObjectId, ref: 'Blog' }]
});

module.exports = mongoose.model('User', UserSchema);