const mongoose = require('mongoose');

// Create a schema for the Post
const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,  // name is required
    trim: true       // removes any extra spaces before and after the string
  },
  description: {
    type: String,
    required: false, // description is optional
    trim: true
  },
  comments:[{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  images_url:[
    {
      type: String,
      required: false, // description is optional
      trim: true
    },
  ],
  youtube_video:[
    {
      type: String,
      required: false, // description is optional
      trim: true
    },
  ],
}, {
  timestamps: true  // Adds createdAt and updatedAt fields
});

PostSchema.index({ title: 'text', description: 'text' });

// Create the Post model from the schema
const Post = mongoose.model('Post', PostSchema);

// Export the model so it can be used in other parts of the application
module.exports = {Post};
