const mongoose = require('mongoose');

// Create a schema for the ClassRoom
const commentSchema = new mongoose.Schema({
  post: {type: mongoose.Schema.Types.ObjectId, ref: 'Post'},
  content: {
    type: String,
    required: false, 
    trim: true
  },
}, {
  timestamps: true  
});

const Comment= mongoose.model('Comment', commentSchema);

// Export the model so it can be used in other parts of the application
module.exports = {Comment};
